import { createStore, useStore } from '@/lib/store.js';
import { TODAY } from '@/lib/format.js';
import { MIN_WITHDRAWAL, OFFER_SEED, walletSeed } from '@/data/mockEarnings.js';

// Wallet & Earnings state and rules (spec 08, AD-120 – AD-126; spec 09, AD-127 – AD-128).
// Prototype only: no money moves, no payout or statement is generated; state resets on reload.
// Filters live in the store, so they persist when coming Back from a transaction (AD-77).

export const earningsStore = createStore(structuredClone(walletSeed));

/** Net = gross − commission; null while the commission rate is not decided (AP-08-02). */
export const txNet = (t) => (t.c == null ? null : t.g - t.c);

/** Transactions of the selected month, after the service/status filters (AD-122, AD-123). */
export const monthTx = (s) => s.tx
  .filter((t) => t.at.slice(0, 7) === s.month)
  .filter((t) => (!s.f.svc || t.svc === s.f.svc) && (!s.f.st || t.st === s.f.st));

export const txStatusKind = (st) => (st === 'Settled' ? 'ok' : st === 'Held' ? 'warn' : 'info');
export const wdStatusKind = (st) => (st === 'Paid' ? 'ok' : st === 'Failed' ? 'bad' : 'warn');

/** Where the related ID opens in the app (Appointment, Consultation or Text Question). */
export const relatedHref = (ref) => (ref.startsWith('APT') ? `#/work/appointments/${ref}`
  : ref.startsWith('CON') ? `#/calls/c/${ref}` : `#/work/questions/${ref}`);

/** A withdrawal requested in this session is still in progress → block duplicates (AD-125). */
export const withdrawalInProgress = (s) => s.wd.some((w) => w.isNew && ['Pending', 'Processing'].includes(w.st));

/** Validate a withdrawal amount; returns an error message or ''. */
export function validateWithdrawal(amount, avail) {
  if (!(amount >= MIN_WITHDRAWAL)) return 'Minimum withdrawal is ₹500.';
  if (amount > avail) return 'Amount is more than your Available Balance.';
  return '';
}

/**
 * Offer performance rows (AD-128). Uses discounted campaigns from Text Questions when they carry
 * discount data (gDisc / pDisc); otherwise the reference sample offers.
 */
export function offerRows(campaigns = []) {
  const live = campaigns.filter((c) => c.gDisc?.on || c.pDisc?.on).map((c) => {
    const g = c.gDisc?.on;
    return { name: `${c.name} – ${g ? 'General' : 'Personal'}`, pct: (g ? c.gDisc : c.pDisc).pct, price: g ? c.pg : c.pp, sold: g ? c.gSold : c.pSold };
  });
  return (live.length ? live : OFFER_SEED).map((o) => {
    const orig = o.price * o.sold;
    const disc = (orig * o.pct) / 100;
    return { ...o, orig, disc, coll: orig - disc };
  });
}

export const earningsActions = {
  setMonth: (month) => earningsStore.patch({ month }),
  setFilter: (part) => earningsStore.patch((s) => ({ f: { ...s.f, ...part } })),
  /** Record a withdrawal request (status Pending). Returns an error message, or '' on success. */
  withdraw(amount, method) {
    const s = earningsStore.get();
    const err = validateWithdrawal(amount, s.avail);
    if (err) return err;
    if (withdrawalInProgress(s)) return 'A withdrawal is already in progress.';
    earningsStore.patch({
      avail: s.avail - amount,
      wd: [{ id: `WD-${2300 + s.wd.length}`, amt: amount, m: method, at: TODAY.toISOString(), st: 'Pending', isNew: true }, ...s.wd],
    });
    return '';
  },
};

export default function useEarnings() {
  return useStore(earningsStore);
}
