// Service records for Finance → Service Revenue and Platform Commission.
// One record per paid service, built from the same records as the other
// Finance pages:
//   - payments: Payment Transactions (wallet payments that completed, and
//     direct payments that did not fail) — so revenue equals what users paid;
//   - commission / net: Astrologer Earnings (confirmed rates only);
//   - refunds: the single wallet refund credit linked to the original payment.
// Nothing is calculated for unconfirmed rates (Text Questions, Subscriptions:
// PP-09).

import { loadWalletIndex } from './walletIndex.js';
import { loadAstroFinanceIndex } from './astroFinanceIndex.js';

export const SERVICE_TYPES = ['Text Question', 'Appointment', 'Instant Call', 'Instant Chat', 'Subscription'];

/** Approved commission configuration (06-payments-finance.md §2). null = not finalised. */
export const COMMISSION_RULES = [
  { service: 'Instant Call', rate: 0.02, source: 'Astrologer AD-124' },
  { service: 'Instant Chat', rate: 0.02, source: 'Astrologer AD-124' },
  { service: 'Appointment', rate: 0.03, source: 'Astrologer AD-124 (astrologer net 97%)' },
  { service: 'Wallet Top-up', rate: 0, source: 'Platform requirement' },
  { service: 'Text Question', rate: null, source: 'PP-09 (Astrologer AP-08-02)' },
  { service: 'Subscription', rate: null, source: 'PP-09' },
  { service: 'Live Session', rate: null, source: 'Free now; no earnings (Astrologer AD-113)', free: true },
];

export function buildServiceRecords(walletIndex, astroIndex) {
  const services = new Map();
  for (const r of walletIndex.rows) {
    const paid = (r.category === 'Wallet Payment' && (r.status === 'Success' || r.status === 'Refunded')) || (r.category === 'Direct Payment' && r.status !== 'Failed');
    if (!paid || !r.serviceId) continue;
    const s = services.get(r.serviceId) ?? {
      serviceId: r.serviceId,
      type: r.serviceType,
      userId: r.userId,
      userName: r.userName,
      astroId: r.astroId,
      astroName: r.astroName,
      at: r.at,
      gross: 0,
      payments: [],
      refunded: 0,
      refundIds: [],
      earnings: null,
    };
    s.gross += r.debit;
    s.at = Math.min(s.at, r.at);
    s.payments.push(r.id);
    services.set(r.serviceId, s);
  }
  for (const r of walletIndex.rows) {
    if (r.category !== 'Refund') continue;
    const s = services.get(r.serviceId);
    if (!s) continue;
    s.refunded += r.credit;
    s.refundIds.push(r.id);
  }
  for (const e of astroIndex.earnings) {
    const s = services.get(e.serviceId);
    if (s) s.earnings = e;
  }
  return [...services.values()].map((s) => {
    const e = s.earnings;
    let commission = null;
    let commissionNote = 'Not finalised';
    if (e && e.commission !== null) {
      commission = e.commission;
      commissionNote = `${Math.round(e.rate * 100)}%`;
    } else if (!e && s.refunded >= s.gross) {
      commission = 0;
      commissionNote = 'No commission — refunded, no earnings';
    }
    return {
      serviceId: s.serviceId,
      type: s.type,
      userId: s.userId,
      userName: s.userName,
      astroId: s.astroId,
      astroName: s.astroName,
      at: s.at,
      gross: s.gross,
      refunded: s.refunded,
      net: s.gross - s.refunded,
      commission,
      commissionNote,
      astroNet: e ? e.net : commission === 0 ? 0 : null,
      earningsStatus: e ? e.status : null,
      payments: s.payments,
      refundIds: s.refundIds,
    };
  });
}

let pending = null;
export function loadRevenueData() {
  return Promise.all([loadWalletIndex(), loadAstroFinanceIndex()]).then(([wallet, astro]) => {
    if (pending?.wallet !== wallet || pending?.astro !== astro) pending = { wallet, astro, services: buildServiceRecords(wallet, astro) };
    return pending;
  });
}

export const monthOf = (ms) => {
  const d = new Date(ms);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

/** Sum a list of service records by a key function. */
export function groupTotals(list, keyFn) {
  const out = new Map();
  for (const s of list) {
    const k = keyFn(s);
    const g = out.get(k) ?? { key: k, count: 0, gross: 0, refunded: 0, net: 0, commission: 0, commissionUnknown: 0, astroNet: 0, knownGross: 0 };
    g.count += 1;
    g.gross += s.gross;
    g.refunded += s.refunded;
    g.net += s.net;
    if (s.commission === null) g.commissionUnknown += 1;
    else {
      g.commission += s.commission;
      g.astroNet += s.astroNet ?? 0;
      g.knownGross += s.gross - s.refunded;
    }
    out.set(k, g);
  }
  return out;
}
