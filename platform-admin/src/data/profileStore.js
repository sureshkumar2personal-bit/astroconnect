// User Profile data: assembles one user's records for the nine profile tabs
// and keeps Admin-side additions (internal notes, wallet adjustment requests,
// wallet audit) in this browser's localStorage. Account status changes and
// their audit stay in usersStore.js. Replace with API calls later.

import { getAudit, getUser } from './usersStore.js';
import { generateProfile } from './mock/profileMock.js';
import { getUserDisputes } from './disputesStore.js';
import { liveAstrologerRef } from './astrologerStatus.js';
import { getAssistant } from './assistantsStore.js';
import { applyRemedyModeration } from './moderationStore.js';
import { KAVYA_ID } from './mock/assistantsMock.js';

const NOTES_KEY = 'astroconnect.profile.notes';
const ADJ_KEY = 'astroconnect.profile.walletAdjustments';
const AUDIT_KEY = 'astroconnect.profile.walletAudit';

export const ADMIN_ROLE = 'Super Admin';

const baseCache = new Map();

function read(key) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(key, list) {
  try {
    localStorage.setItem(key, JSON.stringify(list));
    return true;
  } catch {
    return false;
  }
}

const newId = (prefix) => `${prefix}-${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 90 + 10)}`;
// The person who acted: an Assistant account is shown as that Assistant with
// their own role (never as Super Admin); anyone else is the signed-in Admin.
const assistantRole = (a) => (a.id === KAVYA_ID ? 'Wallet Management Assistant' : a.type);
function personFor(id, fallback) {
  if (id && String(id).startsWith('AST-AS-')) {
    const a = getAssistant(id);
    if (a) return { id: a.id, name: a.name, role: assistantRole(a) };
  }
  return fallback;
}
const actor = (admin) => personFor(admin.accountId, { id: admin.accountId, name: admin.fullName, role: ADMIN_ROLE });
/** Correct the displayed identity of a saved record without rewriting history. */
const identity = (by) => (by ? personFor(by.id, by) : by);

function base(user) {
  if (!baseCache.has(user.id)) baseCache.set(user.id, generateProfile(user));
  return baseCache.get(user.id);
}

/** Rebuild the ledger with approved adjustments and recompute balances. */
function buildWallet(b, userId) {
  const stored = read(ADJ_KEY)
    .filter((a) => a.userId === userId)
    .map((a) => ({ ...a, requestedBy: identity(a.requestedBy), decidedBy: identity(a.decidedBy) }));
  const adjustments = [...b.wallet.adjustments, ...stored].sort((x, y) => y.requestedAt.localeCompare(x.requestedAt));
  const extra = stored
    .filter((a) => a.status === 'Approved')
    .map((a) => ({
      id: a.txId,
      at: a.decidedAt,
      description: `Wallet adjustment (${a.type.toLowerCase()})`,
      serviceType: 'Adjustment',
      credit: a.type === 'Credit' ? a.amount : null,
      debit: a.type === 'Debit' ? a.amount : null,
      method: 'Adjustment',
      gatewayRef: null,
      serviceId: null,
      status: 'Success',
      details: `${a.id} · approved by ${a.decidedBy.role}`,
    }));
  const chronological = [...b.wallet.transactions, ...extra].sort((x, y) => x.at.localeCompare(y.at) || x.id.localeCompare(y.id));
  let balance = 0;
  const transactions = chronological.map((t) => {
    if (t.status === 'Success' || t.status === 'Refunded') balance += (t.credit ?? 0) - (t.debit ?? 0);
    return { ...t, balanceAfter: balance };
  });
  return { ...b.wallet, balance, adjustments, transactions: transactions.reverse() };
}

/**
 * The user's generated records plus their disputes — the same underlying
 * records the Astrologer Profile reads (decision 1A). Do not mutate.
 */
export function getBaseProfile(user) {
  const b = base(user);
  return { ...b, ...getUserDisputes(user, b.services) };
}

// Show each astrologer's current name and status inside the user's records.
const withLive = (list) => list.map((x) => ({ ...x, astrologer: liveAstrologerRef(x.astrologer) }));

/** Everything the profile page needs for one user, or null. */
export function getProfile(userId) {
  const user = getUser(userId);
  if (!user) return null;
  const raw = base(user);
  const { disputes, complaints } = getUserDisputes(user, raw.services);
  const b = {
    ...raw,
    services: withLive(raw.services),
    following: withLive(raw.following),
    followEvents: withLive(raw.followEvents),
    subscriptions: withLive(raw.subscriptions),
    subscriptionFailures: withLive(raw.subscriptionFailures),
    remedies: withLive(raw.remedies).map((r) => applyRemedyModeration(r)),
  };
  const profile = {
    ...b,
    user,
    wallet: buildWallet(b, userId),
    disputes: withLive(disputes),
    complaints,
    notes: read(NOTES_KEY)
      .filter((n) => n.userId === userId)
      .sort((x, y) => y.at.localeCompare(x.at)),
    statusAudit: getAudit(userId),
  };
  profile.walletAudit = buildWalletAudit(profile);
  profile.activity = buildActivity(profile);
  return profile;
}

/** Async wrapper used by the page for its loading / error states. */
export async function loadProfile(userId) {
  const scenario = new URLSearchParams(window.location.search).get('mock');
  await new Promise((resolve) => setTimeout(resolve, 200));
  if (scenario === 'error') throw new Error('The user profile could not be loaded.');
  return getProfile(userId);
}

// ---------- all saved logs (Recent Activity) ----------
export const allUserNotes = () => read(NOTES_KEY).map((n) => ({ ...n, by: identity(n.by) }));
export const allWalletAudit = () => read(AUDIT_KEY).map((e) => ({ ...e, by: identity(e.by) }));

// ---------- Admin notes ----------
export function addNote(userId, text, admin) {
  if (!text.trim()) return { ok: false, error: 'Enter the note text.' };
  const note = { id: newId('NOTE'), userId, text: text.trim(), by: actor(admin), at: new Date().toISOString() };
  if (!write(NOTES_KEY, [...read(NOTES_KEY), note])) return { ok: false, error: 'The note could not be saved.' };
  return { ok: true, note };
}

// ---------- Wallet adjustment requests (Super Admin approval) ----------
export function createAdjustment(userId, { type, amount, reason, reference }, admin) {
  const value = Number(amount);
  if (!['Credit', 'Debit'].includes(type)) return { ok: false, error: 'Choose Credit or Debit.' };
  if (!Number.isFinite(value) || value <= 0) return { ok: false, error: 'Enter an amount greater than zero.' };
  if (!reason.trim()) return { ok: false, error: 'A reason is required.' };
  const request = {
    id: newId('ADJ'),
    userId,
    type,
    amount: Math.round(value * 100) / 100,
    reason: reason.trim(),
    reference: reference.trim(),
    status: 'Pending',
    requestedBy: actor(admin),
    requestedAt: new Date().toISOString(),
    decidedBy: null,
    decidedAt: null,
    rejectionReason: '',
    txId: null,
  };
  if (!write(ADJ_KEY, [...read(ADJ_KEY), request])) return { ok: false, error: 'The request could not be saved.' };
  logWalletAudit(userId, `Adjustment requested · ${request.id} · ${type} ₹${request.amount}`, admin);
  return { ok: true, request };
}

export function decideAdjustment(userId, requestId, { approve, rejectionReason = '' }, admin) {
  const all = read(ADJ_KEY);
  const request = all.find((a) => a.id === requestId && a.userId === userId);
  if (!request || request.status !== 'Pending') return { ok: false, error: 'This request is no longer pending.' };
  if (!approve && !rejectionReason.trim()) return { ok: false, error: 'A rejection reason is required.' };
  if (approve && request.type === 'Debit') {
    const balance = getProfile(userId).wallet.balance;
    if (request.amount > balance) {
      return { ok: false, error: `A debit of ₹${request.amount} is more than the available balance.` };
    }
  }
  const decided = {
    ...request,
    status: approve ? 'Approved' : 'Rejected',
    decidedBy: actor(admin),
    decidedAt: new Date().toISOString(),
    rejectionReason: approve ? '' : rejectionReason.trim(),
    txId: approve ? newId('TXN') : null,
  };
  if (!write(ADJ_KEY, all.map((a) => (a.id === requestId ? decided : a)))) {
    return { ok: false, error: 'The decision could not be saved.' };
  }
  logWalletAudit(userId, `Adjustment ${approve ? 'approved' : 'rejected'} · ${requestId}`, admin);
  return { ok: true, request: decided };
}

// ---------- Wallet audit (§5.8) ----------
export function logWalletAudit(userId, action, admin) {
  write(AUDIT_KEY, [...read(AUDIT_KEY), { id: newId('WA'), userId, action, by: actor(admin), at: new Date().toISOString() }]);
}

function buildWalletAudit(profile) {
  const seeded = [];
  for (const a of profile.wallet.adjustments) {
    if (a.userId) continue; // stored requests are already logged
    seeded.push({ id: `${a.id}-r`, action: `Adjustment requested · ${a.id} · ${a.type} ₹${a.amount}`, by: a.requestedBy, at: a.requestedAt });
    seeded.push({ id: `${a.id}-d`, action: `Adjustment ${a.status.toLowerCase()} · ${a.id}`, by: a.decidedBy, at: a.decidedAt });
  }
  const stored = read(AUDIT_KEY)
    .filter((e) => e.userId === profile.userId)
    .map((e) => ({ ...e, by: identity(e.by) }));
  return [...seeded, ...stored].sort((x, y) => y.at.localeCompare(x.at));
}

// ---------- Monthly statement (§5.5) ----------
export function statementMonths(profile) {
  const months = [];
  const start = new Date(profile.user.registeredAt);
  const d = new Date(start.getFullYear(), start.getMonth(), 1);
  const end = new Date();
  while (d <= end) {
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
    d.setMonth(d.getMonth() + 1);
  }
  return months.reverse();
}

export function buildStatement(profile, month) {
  const [y, m] = month.split('-').map(Number);
  const from = new Date(y, m - 1, 1).getTime();
  const to = new Date(y, m, 1).getTime();
  const chronological = [...profile.wallet.transactions].reverse();
  const affects = (t) => t.status === 'Success' || t.status === 'Refunded';
  let opening = 0;
  for (const t of chronological) {
    if (new Date(t.at).getTime() >= from) break;
    if (affects(t)) opening = t.balanceAfter;
  }
  const rows = chronological.filter((t) => {
    const at = new Date(t.at).getTime();
    return at >= from && at < to;
  });
  const totalCredit = rows.filter(affects).reduce((s, t) => s + (t.credit ?? 0), 0);
  const totalDebit = rows.filter(affects).reduce((s, t) => s + (t.debit ?? 0), 0);
  return { month, opening, totalCredit, totalDebit, closing: opening + totalCredit - totalDebit, rows };
}

// ---------- User activity timeline (§11) — user events only ----------
export const ACTIVITY_CATEGORIES = [
  'Account Created',
  'Login / Logout',
  'Last Active',
  'Profile Changes',
  'Birth Details Changes',
  'Profile Photo Changes',
  'Password Reset',
  'Text Questions',
  'Appointments',
  'Calls / Chats',
  'Wallet Top-ups',
  'Payments',
  'Refunds',
  'Withdrawals',
  'Wallet Adjustments',
  'Follow / Unfollow',
  'Subscriptions',
  'Remedies',
  'Disputes',
  'Notifications',
  'Consent',
  'App Version / Device',
  'Failed Activities',
];

function buildActivity(p) {
  const out = [];
  let i = 0;
  const add = (at, category, title, extra = {}) => {
    if (!at) return;
    i += 1;
    out.push({ id: `ACT-${p.userId.replace(/\D/g, '')}-${i}`, at, category, title, ref: '', details: [], ...extra });
  };

  add(p.user.registeredAt, 'Account Created', `Account created via ${p.account.registrationMethod.toLowerCase()}`, {
    details: [['Account Type', p.user.accountType]],
  });
  for (const c of p.preferences.consentHistory) add(c.at, 'Consent', `${c.item} ${c.action.toLowerCase()}`, { details: c.version !== '—' ? [['Version', c.version]] : [] });
  for (const s of p.sessions) {
    add(s.at, 'Login / Logout', 'Signed in', { details: [['Device', s.device], ['App version', s.version]] });
    if (s.logout) add(s.logout, 'Login / Logout', 'Signed out', { details: [['Device', s.device]] });
  }
  for (const d of p.deviceEvents) add(d.at, 'App Version / Device', d.text, { details: [['App version', d.version]] });
  for (const c of p.profileChanges) add(c.at, c.category, c.text);
  for (const f of p.failedLogins) add(f, 'Failed Activities', 'Sign-in failed — incorrect password', { details: [['Result', 'Blocked after the attempt; no account change']] });

  for (const s of p.services) {
    const payRef = s.payments?.[0]?.id ?? '';
    if (s.type === 'Text Question') {
      add(s.createdAt, 'Text Questions', `Text Question submitted to ${s.astrologer.name}`, { ref: s.id });
      if (s.answeredAt) {
        add(s.answeredAt, 'Text Questions', 'Answer received', { ref: s.id });
        add(s.answeredAt, 'Notifications', 'Notification: your answer is ready', { ref: s.id });
      }
    } else if (s.type === 'Appointment') {
      add(s.createdAt, 'Appointments', `Appointment booked with ${s.astrologer.name}`, {
        ref: s.id,
        details: [['Slot', new Date(s.serviceAt).toLocaleString('en-IN')], ['Duration', `${s.duration} minutes`]],
      });
      for (const r of s.reschedules) add(r.at, 'Appointments', 'Appointment rescheduled (once)', { ref: s.id });
      if (s.cancellation) add(s.cancellation.at, 'Appointments', 'Appointment cancelled by astrologer', { ref: s.id });
      if (s.status === 'Completed') add(s.serviceAt, 'Appointments', 'Appointment completed', { ref: s.id });
      for (const n of s.notifications) add(n.at, 'Notifications', `Notification: ${n.text.toLowerCase()}`, { ref: s.id });
    } else {
      add(s.connectedAt, 'Calls / Chats', `${s.type} started with ${s.astrologer.name}`, { ref: s.id });
      add(s.endedAt, 'Calls / Chats', `${s.type} ended — ${s.termination.toLowerCase()}`, {
        ref: s.id,
        details: [['Duration', `${s.usedMinutes} min`]],
      });
    }
    if (s.payments?.[0] && s.payments[0].method !== 'Wallet') {
      add(s.payments[0].at, 'Payments', `Payment successful · ${s.type}`, { ref: payRef, details: [['Method', s.payments[0].method]] });
    }
  }

  for (const t of p.wallet.transactions) {
    if (t.serviceType === 'Wallet Top-up') {
      if (t.status === 'Failed') add(t.at, 'Failed Activities', `Wallet top-up failed (₹${t.credit})`, { ref: t.id });
      else add(t.at, 'Wallet Top-ups', `Wallet top-up ₹${t.credit} — ${t.status}`, { ref: t.id, details: [['Method', t.method]] });
    } else if (t.serviceType === 'Refund') {
      add(t.at, 'Refunds', `Refund of ₹${t.credit} credited to Wallet`, { ref: t.id });
    } else if (t.serviceType === 'Withdrawal') {
      add(t.at, 'Withdrawals', `Withdrawal of ₹${t.debit} — ${t.status}`, { ref: t.id });
    } else if (t.serviceType === 'Adjustment') {
      add(t.at, 'Wallet Adjustments', `Wallet ${t.credit ? 'credit' : 'debit'} adjustment of ₹${t.credit ?? t.debit} posted`, { ref: t.id });
    } else if (t.method === 'Wallet' && t.debit) {
      add(t.at, 'Payments', `Paid ₹${t.debit} from Wallet · ${t.serviceType}`, { ref: t.id });
    }
  }

  for (const f of p.followEvents) add(f.at, 'Follow / Unfollow', `${f.action} ${f.astrologer.name}`, { ref: f.astrologer.id });
  for (const s of p.subscriptions) {
    add(s.purchasedAt, 'Subscriptions', `${s.renewalOf ? 'Renewed' : 'Purchased'} ${s.plan} subscription · ${s.astrologer.name}`, { ref: s.id });
    if (s.cancelledAt) add(s.cancelledAt, 'Subscriptions', `Cancelled ${s.plan} subscription`, { ref: s.id });
    if (s.status === 'Expired') add(s.expiryAt, 'Subscriptions', `${s.plan} subscription expired`, { ref: s.id });
  }
  for (const f of p.subscriptionFailures) add(f.at, 'Failed Activities', `Subscription payment failed (${f.plan})`, { ref: f.txId, details: [['Reason', f.reason]] });

  for (const r of p.remedies) {
    if (r.startAt) add(r.startAt, 'Remedies', `Started remedy: ${r.title}`, { ref: r.id });
    const updates = r.progress.filter((g) => g.value !== 'Missed Update');
    if (updates.length) {
      add(updates.at(-1).at, 'Remedies', `Remedy progress updated (${updates.length} daily updates)`, { ref: r.id });
    }
    for (const pr of r.proof) add(pr.at, 'Remedies', 'Remedy completion proof uploaded', { ref: r.id });
    if (r.completedAt) add(r.completedAt, 'Remedies', `Completed remedy: ${r.title}`, { ref: r.id });
  }

  for (const d of [...p.disputes, ...p.complaints]) {
    add(d.raisedAt, 'Disputes', `${d.kind} raised${d.questionId ? ` for ${d.questionId}` : ` (${d.category})`}`, { ref: d.id });
    if (d.evidence.length > 1) add(d.raisedAt, 'Disputes', 'Evidence attached', { ref: d.id });
    if (d.status === 'Withdrawn by User') add(d.timeline.at(-1).at, 'Disputes', `${d.kind} withdrawn`, { ref: d.id });
  }

  add(p.user.lastActiveAt, 'Last Active', 'Last active in the app');
  return out.sort((a, b) => b.at.localeCompare(a.at) || b.id.localeCompare(a.id));
}
