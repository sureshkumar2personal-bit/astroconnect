// Platform-wide Astrologer earnings and payout (withdrawal) records for
// Finance → Astrologer Earnings and Payout Requests. Every row comes from the
// same per-astrologer wallet the Astrologer Profile Wallet tab shows
// (astrologersStore.getAstrologerWallet), built in a background worker that
// sees this browser's saved changes, so both screens always agree.
//
// Rules (06-payments-finance.md §2–§3; Astrologer AD-124 – AD-126): Call /
// Chat 2%, Appointment 3% on the amount the user paid; Text Question
// commission (PP-09) and Call / Chat release (PP-10) are not finalised and
// are never calculated. Withdrawals: minimum ₹500; Bank Account or UPI;
// Pending · Processing · Paid · Failed; processing target 3 working days.

import { getAstrologerOps, getAstrologerWallet } from './astrologersStore.js';
import { allAstrologers } from './astrologerStatus.js';

const ts = (v) => (v ? new Date(v).getTime() : null);

/** Request time + 3 working days (Mon–Fri), the approved processing target. */
export function payoutTarget(requestedAt) {
  const d = new Date(requestedAt);
  let n = 0;
  while (n < 3) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0 && d.getDay() !== 6) n += 1;
  }
  return d.getTime();
}

export function computeAstroFinanceIndex() {
  const earnings = [];
  const payouts = [];
  const settlements = [];
  for (const a of allAstrologers()) {
    const rec = getAstrologerWallet(a.id);
    if (!rec) continue;
    const { astrologer, wallet } = rec;
    const txByRef = new Map(wallet.transactions.filter((t) => t.serviceType === 'Withdrawal' || t.serviceType === 'Settlement').map((t) => [t.ref, t.id]));
    for (const st of wallet.settlements) {
      settlements.push({
        id: st.id,
        astroId: astrologer.id,
        astroName: astrologer.name,
        at: ts(st.at),
        count: st.count,
        gross: st.gross,
        commission: st.commission,
        net: st.net,
        status: st.status,
        services: st.services,
        walletTx: txByRef.get(st.id) ?? null,
      });
    }
    for (const e of wallet.earnings) {
      const s = e.service;
      earnings.push({
        id: `ETX-${s.id}`, // same ID as the Astrologer Profile transaction
        astroId: astrologer.id,
        astroName: astrologer.name,
        serviceId: s.id,
        serviceType: s.type,
        serviceStatus: s.status,
        userId: s.user.id,
        userName: s.user.name,
        gross: e.gross,
        rate: e.rate ?? null,
        commission: e.commission,
        net: e.net,
        status: e.state,
        at: ts(e.at),
        bookedAt: ts(s.createdAt),
        completedAt: ts(s.completedAt),
        releaseAt: e.releaseAt ?? null,
        settlementId: e.settlementId ?? null,
        payments: (s.payments ?? []).map((p) => ({ id: p.id, method: p.method, amount: p.amount, at: ts(p.at), gatewayRef: p.gatewayRef ?? null })),
      });
    }
    for (const w of wallet.withdrawals) {
      payouts.push({
        id: w.id,
        astroId: astrologer.id,
        astroName: astrologer.name,
        amount: w.amount,
        method: w.method,
        requestedAt: ts(w.requestedAt),
        status: w.status,
        paidAt: ts(w.paidAt),
        reference: w.reference && w.reference !== '—' ? w.reference : null,
        failureReason: w.failureReason || '',
        walletTx: txByRef.get(w.id) ?? null,
        targetAt: payoutTarget(w.requestedAt),
      });
    }
  }
  // Operations: availability, content and predictions (Astrologer Profile records).
  const availability = [];
  const posts = [];
  const predictions = [];
  const documents = [];
  for (const a of allAstrologers()) {
    const rec = getAstrologerOps(a.id);
    if (!rec) continue;
    const { astrologer: x, availability: av, content } = rec;
    const working = av.weekly.filter((w) => w.working);
    const sum = (k) => av.upcoming.reduce((t, u) => t + (typeof u[k] === 'number' ? u[k] : u[k].length), 0);
    availability.push({
      astroId: x.id,
      astroName: x.name,
      accountStatus: x.status,
      state: av.current,
      workingDays: working.length,
      offDays: av.weekly.filter((w) => !w.working).map((w) => w.day),
      hours: working[0]?.sessions.map((s) => s.join('–')).join(', ') ?? '',
      duration: av.duration,
      buffer: av.buffer,
      available7: sum('available'),
      booked7: sum('booked'),
      blocked7: sum('blocked'),
      closures: av.closures.length,
      dnd30: av.history.filter((h) => h.state === 'DND').length,
      busy30: av.history.filter((h) => h.state === 'Busy').length,
      lastChange: ts(av.changes[0]?.at),
    });
    for (const p of content.posts) {
      posts.push({ id: p.id, astroId: x.id, astroName: x.name, title: p.title, kind: p.kind, audience: p.audience, status: p.status, hidden: p.hidden, createdAt: ts(p.createdAt), publishedAt: ts(p.publishedAt), scheduledFor: ts(p.scheduledFor), likes: p.likes, comments: p.comments });
    }
    for (const doc of rec.documents) documents.push({ ...doc, ownerType: 'Astrologer', ownerId: x.id, ownerName: x.name, uploadedAt: ts(doc.uploadedAt) });
    for (const pr of content.predictions) predictions.push({ id: pr.id, astroId: x.id, astroName: x.name, type: pr.type, for: ts(pr.for), status: pr.status });
  }
  return { earnings, payouts, settlements, availability, posts, predictions, documents };
}

// Saved data that does not change these records (applied on the page instead).
const UNRELATED = /moderation|disputeNotes|disputeEvidenceLog|chatViewLog|demo\.session/;

// Saved changes the worker must see (astrologer status, user links, adjustments…).
function storageSnapshot() {
  const out = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('astroconnect.') && !UNRELATED.test(k)) out[k] = localStorage.getItem(k);
    }
  } catch {
    /* storage blocked */
  }
  return out;
}

let cached = null; // { key, promise }

/** Resolve the index (worker, main-thread fallback); rebuilt when saved data changes. */
export function loadAstroFinanceIndex() {
  const storage = storageSnapshot();
  const key = JSON.stringify(storage);
  if (cached?.key === key) return cached.promise;
  const promise = new Promise((resolve) => {
    try {
      const worker = new Worker(new URL('./astroFinanceIndex.worker.js', import.meta.url), { type: 'module' });
      worker.onmessage = (e) => {
        resolve(e.data);
        worker.terminate();
      };
      worker.onerror = () => {
        worker.terminate();
        resolve(computeAstroFinanceIndex());
      };
      worker.postMessage({ storage });
    } catch {
      resolve(computeAstroFinanceIndex());
    }
  });
  cached = { key, promise };
  return promise;
}
