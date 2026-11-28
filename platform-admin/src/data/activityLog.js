// Recent Activity (12-recent-activity-history.md). A platform-wide history
// assembled from records that already exist — no activity is generated:
//   - Wallet / payment / refund records (wallet index, Payment Transactions)
//   - Services, disputes, complaints (service index)
//   - Settlements, payouts, astrologer posts (astrologer index)
//   - Users and astrologers (registration / joining)
//   - Assistant events (Assistant Management)
//   - Saved Admin logs: account status changes, profile edits, notes, wallet
//     adjustment requests and decisions, wallet audit, dispute / complaint
//     notes and evidence views, moderation, chat transcript views.
// Built one month at a time (§4 month selection).

import { loadWalletIndex } from './walletIndex.js';
import { loadServiceIndex } from './serviceIndex.js';
import { loadAstroFinanceIndex } from './astroFinanceIndex.js';
import { ACTIONS, allUserAudit, loadUsers } from './usersStore.js';
import { allAstrologerAudit, allAstrologerEdits, allAstrologerNotes, allAstrologers } from './astrologerStatus.js';
import { allAssistants } from './assistantsStore.js';
import { allUserNotes, allWalletAudit } from './profileStore.js';
import { allDisputeNotes, allEvidenceViews } from './disputeActions.js';
import { allModeration } from './moderationStore.js';
import { allChatViews } from './chatTranscripts.js';

export const ACTIVITY_CATEGORIES = [
  'User activities',
  'Astrologer activities',
  'Assistant activities',
  'Service activities',
  'Payment activities',
  'Wallet activities',
  'Settlement activities',
  'Refund activities',
  'Dispute / Complaint activities',
  'Admin actions',
];

const ts = (v) => (v ? new Date(v).getTime() : null);
const SYSTEM = { name: 'AstroConnect', role: 'System' };
const admin = (name, role = 'Super Admin') => ({ name: name ?? 'Platform Admin', role });

/** Load every source once (workers run in parallel). */
export async function loadActivitySources() {
  const [wallet, service, astro, users] = await Promise.all([loadWalletIndex(), loadServiceIndex(), loadAstroFinanceIndex(), loadUsers()]);
  return { wallet, service, astro, users };
}

/** Months (YYYY-MM) from the earliest record to now, newest first. */
export function activityMonths(src) {
  const first = Math.min(...src.users.map((u) => ts(u.registeredAt)), ...allAstrologers().map((a) => ts(a.joinedAt)));
  const out = [];
  const d = new Date(first);
  d.setDate(1);
  const end = new Date();
  while (d <= end) {
    out.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
    d.setMonth(d.getMonth() + 1);
  }
  return out.reverse();
}

// Audit entries store the action verb (Suspend, Block, …); show its past tense.
const pastOf = (verb) => Object.values(ACTIONS).find((x) => x.verb === verb)?.past ?? String(verb).toLowerCase();

const assistantRecordedIn =(type) => (type === 'Astrologer Assistant' ? "The astrologer's Activity History and Platform Admin Activity History" : 'Admin Activity History');

/** All activities in one month, newest first. */
export function activitiesForMonth(src, month) {
  const [y, m] = month.split('-').map(Number);
  const from = new Date(y, m - 1, 1).getTime();
  const to = new Date(y, m, 1).getTime();
  const inMonth = (t) => t !== null && t >= from && t < to;
  const out = [];
  const add = (a) => inMonth(a.at) && out.push(a);

  // ---- users / astrologers ----
  for (const u of src.users) add({ id: `ACT-USR-${u.id}`, category: 'User activities', type: 'User registered', actor: { name: u.name, role: 'User' }, userId: u.id, at: ts(u.registeredAt), description: `${u.name} registered (${u.accountType ?? 'Registered'} account)` });
  for (const a of allAstrologers()) add({ id: `ACT-AST-${a.id}`, category: 'Astrologer activities', type: 'Astrologer joined', actor: { name: a.name, role: 'Astrologer' }, astroId: a.id, at: ts(a.joinedAt), description: `${a.name} joined AstroConnect` });
  for (const p of src.astro.posts) {
    if (p.publishedAt) add({ id: `ACT-PST-${p.id}`, category: 'Astrologer activities', type: 'Post published', actor: { name: p.astroName, role: 'Astrologer' }, astroId: p.astroId, ref: p.id, at: p.publishedAt, description: `${p.kind} post published: “${p.title}” (${p.audience})` });
  }

  // ---- services ----
  const svc = src.service;
  for (const q of svc.questions) {
    add({ id: `ACT-SVC-${q.id}`, category: 'Service activities', type: 'Text Question asked', actor: { name: q.userName, role: 'User' }, userId: q.userId, astroId: q.astroId, ref: q.id, at: q.createdAt, description: `Text Question to ${q.astroName}` });
    add({ id: `ACT-SVA-${q.id}`, category: 'Service activities', type: 'Text Question answered', actor: { name: q.astroName, role: 'Astrologer' }, userId: q.userId, astroId: q.astroId, ref: q.id, at: q.answeredAt, description: `Answered ${q.userName}’s question` });
  }
  for (const a of svc.appointments) {
    add({ id: `ACT-SVC-${a.id}`, category: 'Service activities', type: 'Appointment booked', actor: { name: a.userName, role: 'User' }, userId: a.userId, astroId: a.astroId, ref: a.id, at: a.createdAt, description: `Appointment with ${a.astroName}` });
    add({ id: `ACT-SVX-${a.id}`, category: 'Service activities', type: 'Appointment cancelled', actor: a.cancelledBy === 'Astrologer' ? { name: a.astroName, role: 'Astrologer' } : { name: a.userName, role: a.cancelledBy ?? 'User' }, userId: a.userId, astroId: a.astroId, ref: a.id, at: a.cancelledAt, description: `Appointment cancelled by ${a.cancelledBy ?? 'user'}`, prev: 'Confirmed', next: 'Cancelled' });
  }
  for (const s of svc.sessions) add({ id: `ACT-SVC-${s.id}`, category: 'Service activities', type: `${s.type} session`, actor: { name: s.userName, role: 'User' }, userId: s.userId, astroId: s.astroId, ref: s.id, at: s.connectedAt ?? s.createdAt, description: `${s.type} with ${s.astroName} · ${s.usedMinutes} min used · ${s.termination}` });

  // ---- disputes / complaints ----
  for (const d of svc.disputes) {
    add({ id: `ACT-DSP-${d.id}`, category: 'Dispute / Complaint activities', type: 'Dispute raised', actor: { name: d.userName, role: 'User' }, userId: d.userId, astroId: d.astroId, ref: d.serviceId, at: d.raisedAt, description: `Dispute ${d.id} on ${d.serviceId}: ${d.description}` });
    if (d.updatedAt !== d.raisedAt) add({ id: `ACT-DSU-${d.id}`, category: 'Dispute / Complaint activities', type: 'Dispute updated', actor: SYSTEM, userId: d.userId, astroId: d.astroId, ref: d.serviceId, at: d.updatedAt, description: `Dispute ${d.id} — latest status ${d.status}`, next: d.status });
  }
  for (const c of svc.complaints) {
    add({ id: `ACT-TC-${c.userId}-${c.id}`, category: 'Dispute / Complaint activities', type: 'Technical complaint raised', actor: { name: c.userName, role: 'User' }, userId: c.userId, ref: c.serviceId ?? c.id, at: c.raisedAt, description: `${c.id} (${c.category}): ${c.description}` });
    if (c.updatedAt !== c.raisedAt) add({ id: `ACT-TCU-${c.userId}-${c.id}`, category: 'Dispute / Complaint activities', type: 'Technical complaint updated', actor: SYSTEM, userId: c.userId, ref: c.serviceId ?? c.id, at: c.updatedAt, description: `${c.id} — latest status ${c.status}`, next: c.status });
  }

  // ---- wallet / payments / refunds ----
  for (const r of src.wallet.rows) {
    if (!inMonth(r.at)) continue;
    const base = { userId: r.userId, astroId: r.astroId, ref: r.serviceId ? `${r.id} · ${r.serviceId}` : r.id, at: r.at, status: r.status };
    if (r.category === 'Refund') out.push({ ...base, id: `ACT-${r.id}`, category: 'Refund activities', type: 'Refund credited to wallet', actor: SYSTEM, description: `${r.refundId ?? ''} ₹${r.credit} for ${r.serviceId} (original ${r.originalTx}) — ${r.refundReason ?? ''}` });
    else if (r.category === 'Wallet Payment' || r.category === 'Direct Payment') out.push({ ...base, id: `ACT-${r.userId}-${r.id}`, category: 'Payment activities', type: r.category === 'Direct Payment' ? 'Direct payment' : 'Wallet payment', actor: { name: r.userName, role: 'User' }, description: `₹${r.debit} for ${r.serviceType} · ${r.method ?? ''} · ${r.status}` });
    else out.push({ ...base, id: `ACT-${r.id}`, category: 'Wallet activities', type: r.category, actor: r.category === 'Wallet Adjustment' ? admin('Platform Super Admin') : { name: r.userName, role: 'User' }, description: `${r.credit ? `+₹${r.credit}` : `−₹${r.debit}`} · ${r.description} · ${r.status}` });
  }
  for (const a of src.wallet.adjustments) {
    const requester = a.requestedBy ?? {};
    const isAssistant = String(requester.id ?? '').startsWith('AST-AS-');
    add({ id: `ACT-ADJ-${a.userId}-${a.id}`, category: isAssistant ? 'Assistant activities' : 'Admin actions', type: 'Wallet adjustment requested', actor: { name: requester.name, role: requester.role }, userId: a.userId, assistantId: isAssistant ? requester.id : undefined, ref: a.id, at: ts(a.requestedAt), description: `${a.type} ₹${a.amount} for ${a.userName} — ${a.reason}`, next: 'Pending', recordedIn: isAssistant ? 'Admin Activity History' : undefined });
    if (a.decidedAt) add({ id: `ACT-ADD-${a.userId}-${a.id}`, category: 'Admin actions', type: `Wallet adjustment ${a.status.toLowerCase()}`, actor: { name: a.decidedBy?.name, role: a.decidedBy?.role ?? 'Super Admin' }, userId: a.userId, ref: a.txId ? `${a.id} · ${a.txId}` : a.id, at: ts(a.decidedAt), description: `${a.type} ₹${a.amount} for ${a.userName}${a.rejectionReason ? ` — Rejection reason: ${a.rejectionReason}` : ''}`, prev: 'Pending', next: a.status });
  }

  // ---- settlements / payouts ----
  for (const s of src.astro.settlements) add({ id: `ACT-${s.astroId}-${s.id}`, category: 'Settlement activities', type: 'Settlement released', actor: SYSTEM, astroId: s.astroId, ref: s.walletTx ? `${s.id} · ${s.walletTx}` : s.id, at: s.at, description: `₹${s.net} net released to ${s.astroName} (${s.count} services)` });
  for (const p of src.astro.payouts) {
    add({ id: `ACT-${p.id}`, category: 'Settlement activities', type: 'Payout requested', actor: { name: p.astroName, role: 'Astrologer' }, astroId: p.astroId, ref: p.walletTx ? `${p.id} · ${p.walletTx}` : p.id, at: p.requestedAt, description: `₹${p.amount} to ${p.method} — current status ${p.status}`, status: p.status });
    if (p.paidAt) add({ id: `ACT-${p.id}-PAID`, category: 'Settlement activities', type: 'Payout paid', actor: SYSTEM, astroId: p.astroId, ref: p.reference ? `${p.id} · ${p.reference}` : p.id, at: p.paidAt, description: `₹${p.amount} paid to ${p.astroName}`, prev: 'Processing', next: 'Paid' });
  }

  // ---- assistants (§5 routing) ----
  for (const a of allAssistants()) {
    for (const [i, e] of a.events.entries()) {
      const byRole = e.by?.role ?? '';
      const isSelf = byRole === 'Admin Assistant' || byRole === 'Astrologer Assistant';
      const category = isSelf || byRole === 'System' ? 'Assistant activities' : byRole === 'Astrologer' ? 'Astrologer activities' : 'Admin actions';
      add({
        id: `ACT-${e.id ?? `${a.id}-${i}`}`,
        category,
        type: e.action,
        actor: { name: e.by?.name, role: byRole },
        assistantId: a.id,
        astroId: a.astrologer?.id,
        ref: e.module,
        at: ts(e.at),
        description: `${a.name} (${a.type}) — ${e.description}`,
        recordedIn: isSelf ? assistantRecordedIn(a.type) : undefined,
      });
    }
  }

  // ---- saved Admin logs ----
  for (const e of allUserAudit()) add({ id: `ACT-${e.id}-${e.userId}`, category: 'Admin actions', type: `User account ${pastOf(e.action)}`, actor: admin(e.adminName), userId: e.userId, at: ts(e.at), description: `${e.userName}: ${e.reason}${e.notes ? ` (${e.notes})` : ''}`, prev: e.previousStatus, next: e.newStatus });
  for (const e of allAstrologerAudit()) add({ id: `ACT-${e.id}`, category: 'Admin actions', type: `Astrologer account ${pastOf(e.action)}`, actor: admin(e.adminName), astroId: e.userId, at: ts(e.at), description: `${e.userName}: ${e.reason}${e.notes ? ` (${e.notes})` : ''}`, prev: e.previousStatus, next: e.newStatus });
  for (const e of allAstrologerEdits()) add({ id: `ACT-${e.id}`, category: 'Admin actions', type: 'Astrologer profile edited', actor: admin(e.adminName), astroId: e.astrologerId, at: ts(e.at), description: `Reason: ${e.reason}`, prev: e.changes.map((c) => `${c.label}: ${c.from}`).join('; '), next: e.changes.map((c) => `${c.label}: ${c.to}`).join('; ') });
  for (const n of allAstrologerNotes()) add({ id: `ACT-${n.id}`, category: 'Admin actions', type: 'Astrologer note added', actor: admin(n.by?.name, n.by?.role), astroId: n.astrologerId, at: ts(n.at), description: n.text });
  for (const n of allUserNotes()) add({ id: `ACT-${n.id}`, category: 'Admin actions', type: 'User note added', actor: admin(n.by?.name, n.by?.role), userId: n.userId, at: ts(n.at), description: n.text });
  for (const e of allWalletAudit()) {
    if (/^Adjustment (requested|approved|rejected)/.test(e.action)) continue; // shown above from the request record
    add({ id: `ACT-${e.id}`, category: 'Admin actions', type: 'Wallet audit', actor: admin(e.by?.name, e.by?.role), userId: e.userId, at: ts(e.at), description: e.action });
  }
  for (const n of allDisputeNotes()) add({ id: `ACT-${n.id}`, category: 'Dispute / Complaint activities', type: 'Internal note added', actor: admin(n.by?.name, n.by?.role), ref: n.disputeId, at: ts(n.at), description: `${n.disputeId}: ${n.text}` });
  for (const v of allEvidenceViews()) add({ id: `ACT-${v.id}`, category: 'Dispute / Complaint activities', type: 'Evidence viewed', actor: admin(v.by?.name, v.by?.role), ref: v.disputeId, at: ts(v.at), description: `${v.evidence} on ${v.disputeId}` });
  for (const mo of allModeration()) add({ id: `ACT-${mo.id}`, category: 'Admin actions', type: `${mo.kind === 'remedy' ? 'Remedy' : 'Post'} ${mo.action.toLowerCase()}`, actor: admin(mo.by?.name, mo.by?.role), ref: mo.targetId, at: ts(mo.at), description: `Reason: ${mo.reason}`, prev: mo.action === 'Hidden' ? 'Visible' : undefined, next: mo.action === 'Hidden' ? 'Hidden' : undefined });
  for (const [i, v] of allChatViews().entries()) add({ id: `ACT-CHV-${i}-${v.sessionId}`, category: 'Admin actions', type: 'Chat transcript viewed', actor: admin(v.by?.name), ref: v.sessionId, at: ts(v.at), description: `Instant Chat transcript ${v.sessionId} opened` });

  return out.sort((a, b) => b.at - a.at || a.id.localeCompare(b.id));
}
