// Platform-wide wallet and payment records for Finance (Wallet Overview, User
// Wallet Deposits, Payment Transactions). Built from every user's own wallet
// ledger and service payments — the same records the User Profile Wallet tab
// shows — in a background worker. Wallet adjustments approved in this browser
// (User Profile → Wallet) are merged in on the main thread, so balances match
// the User Profile exactly.
//
// Rules (06-payments-finance.md §4–§5): statuses Success · Pending · Failed ·
// Reversed · Refunded; only completed transactions (Success, and debits later
// Refunded) change the balance; every refund is credited to the Wallet once
// and stays linked to its original payment; adjustments change the balance
// only after Super Admin approval.

import { generateUsers } from './mock/usersMock.js';
import { generateProfile } from './mock/profileMock.js';
import { getUser } from './usersStore.js';
import { getProfile } from './profileStore.js';

const ts = (v) => (v ? new Date(v).getTime() : null);
export const affectsBalance = (t) => t.direct !== true && (t.status === 'Success' || t.status === 'Refunded');

export const CATEGORIES = ['Wallet Deposit', 'Wallet Payment', 'Direct Payment', 'Refund', 'Withdrawal', 'Wallet Adjustment'];

function categoryOf(t) {
  switch (t.serviceType) {
    case 'Wallet Top-up':
      return 'Wallet Deposit';
    case 'Refund':
      return 'Refund';
    case 'Withdrawal':
      return 'Withdrawal';
    case 'Adjustment':
      return 'Wallet Adjustment';
    default:
      return 'Wallet Payment';
  }
}

/** Compact rows for one user's wallet + direct payments. */
export function rowsForUser(user, wallet, services, subscriptions, subscriptionFailures) {
  const svc = new Map([...services, ...subscriptions].map((s) => [s.id, s]));
  const refundOf = new Map(wallet.refunds.map((r) => [r.creditTx, r]));
  const refundFor = new Map(wallet.refunds.map((r) => [r.originalTx, r]));
  const rows = [];
  // Running balance in date order — the same calculation as the User Profile
  // Wallet tab (profileStore.buildWallet), so "Balance After" matches it.
  const chronological = [...wallet.transactions].sort((x, y) => x.at.localeCompare(y.at) || x.id.localeCompare(y.id));
  let running = 0;
  for (const t of chronological) {
    if (t.status === 'Success' || t.status === 'Refunded') running += (t.credit ?? 0) - (t.debit ?? 0);
    const s = t.serviceId ? svc.get(t.serviceId) : null;
    const refund = refundOf.get(t.id);
    rows.push({
      id: t.id,
      userId: user.id,
      userName: user.name,
      at: ts(t.at),
      category: categoryOf(t),
      serviceType: t.serviceType,
      description: t.description,
      credit: t.credit ?? null,
      debit: t.debit ?? null,
      status: t.status,
      method: t.method,
      gatewayRef: t.gatewayRef ?? null,
      serviceId: t.serviceId ?? null,
      astroId: s?.astrologer?.id ?? null,
      astroName: s?.astrologer?.name ?? null,
      balanceAfter: running,
      details: t.details ?? '',
      refundId: refund?.id ?? null,
      originalTx: refund?.originalTx ?? null,
      refundReason: refund?.reason ?? null,
      refundServiceType: refund?.serviceType ?? null,
      direct: false,
    });
  }
  // Direct (UPI / card / net banking) service payments: not wallet movements.
  for (const s of [...services, ...subscriptions]) {
    for (const p of s.payments ?? []) {
      if (p.method === 'Wallet') continue;
      const rf = refundFor.get(p.id);
      rows.push({
        id: p.id,
        userId: user.id,
        userName: user.name,
        at: ts(p.at),
        category: 'Direct Payment',
        serviceType: s.type ?? 'Subscription',
        description: `${s.type ?? `${s.plan} subscription`} payment · ${s.id}`,
        credit: null,
        debit: p.amount,
        status: rf ? 'Refunded' : 'Success',
        method: p.method,
        gatewayRef: p.gatewayRef ?? null,
        serviceId: s.id,
        astroId: s.astrologer?.id ?? null,
        astroName: s.astrologer?.name ?? null,
        balanceAfter: null,
        details: rf ? `Refunded to Wallet · ${rf.id}` : '',
        refundId: null,
        originalTx: null,
        direct: true,
      });
    }
  }
  for (const f of subscriptionFailures) {
    rows.push({
      id: f.txId,
      userId: user.id,
      userName: user.name,
      at: ts(f.at),
      category: 'Direct Payment',
      serviceType: 'Subscription',
      description: `${f.plan} subscription payment attempt`,
      credit: null,
      debit: f.amount,
      status: 'Failed',
      method: f.method,
      gatewayRef: null,
      serviceId: null,
      astroId: f.astrologer.id,
      astroName: f.astrologer.name,
      balanceAfter: null,
      details: f.reason,
      refundId: null,
      originalTx: null,
      direct: true,
    });
  }
  return rows;
}

/** { rows, balances: {userId: balance}, adjustments: [...] } for all users. */
export function computeWalletIndex(nowMs = Date.now()) {
  const now = new Date(nowMs);
  const rows = [];
  const balances = {};
  const adjustments = [];
  for (const user of generateUsers(now)) {
    const p = generateProfile(user, now);
    balances[user.id] = p.wallet.balance;
    for (const a of p.wallet.adjustments) adjustments.push({ ...a, userId: user.id, userName: user.name });
    for (const r of rowsForUser(user, p.wallet, p.services, p.subscriptions, p.subscriptionFailures)) rows.push(r);
  }
  return { rows, balances, adjustments, builtAt: nowMs };
}

let pending = null;

function storedAdjustmentUsers() {
  try {
    return [...new Set((JSON.parse(localStorage.getItem('astroconnect.profile.walletAdjustments') || '[]') ?? []).map((a) => a.userId))];
  } catch {
    return [];
  }
}

/** Merge Admin-approved adjustments (saved in this browser) for affected users. */
function mergeStored(index) {
  const users = storedAdjustmentUsers();
  if (!users.length) return index;
  const affected = new Set(users);
  const rows = index.rows.filter((r) => !affected.has(r.userId));
  const balances = { ...index.balances };
  const adjustments = index.adjustments.filter((a) => !affected.has(a.userId));
  for (const id of users) {
    const user = getUser(id);
    const p = user && getProfile(id);
    if (!p) continue;
    balances[id] = p.wallet.balance;
    for (const a of p.wallet.adjustments) adjustments.push({ ...a, userId: id, userName: user.name });
    rows.push(...rowsForUser(user, p.wallet, p.services, p.subscriptions, p.subscriptionFailures));
  }
  return { ...index, rows, balances, adjustments };
}

/** Resolve the index (worker, main-thread fallback), merged with saved changes. */
export function loadWalletIndex() {
  if (!pending) {
    pending = new Promise((resolve) => {
      try {
        const worker = new Worker(new URL('./walletIndex.worker.js', import.meta.url), { type: 'module' });
        worker.onmessage = (e) => {
          resolve(e.data);
          worker.terminate();
        };
        worker.onerror = () => {
          worker.terminate();
          resolve(computeWalletIndex());
        };
        worker.postMessage({ now: Date.now() });
      } catch {
        resolve(computeWalletIndex());
      }
    });
  }
  return pending.then(mergeStored);
}

/** Summary figures; every figure is a sum over the same rows. */
export function walletSummary(index) {
  const wallet = index.rows.filter((r) => !r.direct);
  const sum = (list, k) => list.reduce((t, r) => t + (r[k] ?? 0), 0);
  const ok = wallet.filter(affectsBalance);
  const deposits = wallet.filter((r) => r.category === 'Wallet Deposit');
  const byStatus = (list, st) => list.filter((r) => r.status === st);
  const balanceFromRows = sum(ok, 'credit') - sum(ok, 'debit');
  const balanceFromUsers = Object.values(index.balances).reduce((t, b) => t + b, 0);
  return {
    balanceFromRows,
    balanceFromUsers,
    usersWithBalance: Object.values(index.balances).filter((b) => b > 0).length,
    deposits: { success: sum(byStatus(deposits, 'Success'), 'credit'), successCount: byStatus(deposits, 'Success').length, pending: byStatus(deposits, 'Pending').length, pendingAmount: sum(byStatus(deposits, 'Pending'), 'credit'), failed: byStatus(deposits, 'Failed').length, reversed: byStatus(deposits, 'Reversed').length },
    credits: sum(ok.filter((r) => r.credit), 'credit'),
    refunds: sum(ok.filter((r) => r.category === 'Refund'), 'credit'),
    refundCount: ok.filter((r) => r.category === 'Refund').length,
    debits: sum(ok.filter((r) => r.debit), 'debit'),
    withdrawals: sum(ok.filter((r) => r.category === 'Withdrawal'), 'debit'),
    adjustmentsCredit: sum(ok.filter((r) => r.category === 'Wallet Adjustment'), 'credit'),
    adjustmentsDebit: sum(ok.filter((r) => r.category === 'Wallet Adjustment'), 'debit'),
    walletPayments: sum(ok.filter((r) => r.category === 'Wallet Payment'), 'debit'),
    directPayments: sum(index.rows.filter((r) => r.direct && r.status !== 'Failed'), 'debit'),
  };
}
