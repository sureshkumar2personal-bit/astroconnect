// Service records for Service Management (Overview, Text Questions,
// Appointments). Built from every user's own records — the same records the
// User Profile and Astrologer Profile show — in a background worker, then
// kept in memory for the session. Detail panels re-read the full record from
// the user's records, so every screen shows the same data.

import { generateUsers } from './mock/usersMock.js';
import { generateProfile } from './mock/profileMock.js';
import { getUserDisputes } from './disputesStore.js';
import { reviewFor } from './mock/reviewsMock.js';
import { DAY, snapshotTime } from './mock/seed.js';
import { getUser } from './usersStore.js';
import { getBaseProfile, getProfile } from './profileStore.js';

const ts = (v) => (v ? new Date(v).getTime() : null);

/** Text Question status for Admin (AD-51), derived from the shared dispute records. */
export function adminQuestionStatus(service, dispute, snapshot) {
  if (service.status !== 'Completed') return service.status;
  if (dispute) return dispute.responses.some((r) => r.from.includes('(Astrologer)')) ? 'Dispute Answered' : 'Disputed';
  return new Date(service.answeredAt).getTime() + 7 * DAY <= snapshot ? 'Settled' : 'Completed';
}

/**
 * { questions, appointments, sessions, complaints } as compact rows.
 * `sessions` holds Instant Call / Chat rows (for overview totals only).
 */
export function computeServiceIndex(nowMs = Date.now()) {
  const now = new Date(nowMs);
  const snapshot = snapshotTime(now);
  const questions = [];
  const appointments = [];
  const sessions = [];
  const complaints = [];
  const disputes_ = []; // Service Disputes (Text Question answers only, one per question)
  const reviews = [];
  const remedies = [];
  for (const user of generateUsers(now)) {
    const p = generateProfile(user, now);
    const { disputes, complaints: userComplaints } = getUserDisputes(user, p.services, now);
    const byQuestion = new Map(disputes.map((d) => [d.questionId, d]));
    const services = new Map(p.services.map((s) => [s.id, s]));
    for (const d of disputes) {
      const q = services.get(d.questionId);
      const refund = p.wallet.refunds.find((r) => r.serviceId === d.questionId) ?? null;
      disputes_.push({
        id: d.id,
        userId: user.id,
        userName: user.name,
        astroId: d.astrologer.id,
        astroName: d.astrologer.name,
        serviceId: d.questionId,
        serviceType: 'Text Question',
        category: d.category,
        description: d.evidence[0]?.value ?? '',
        evidenceCount: d.evidence.length,
        status: d.status,
        raisedAt: ts(d.raisedAt),
        updatedAt: ts(d.timeline.at(-1)?.at ?? d.raisedAt),
        deadline: ts(d.deadline),
        payIds: (q?.payments ?? []).map((x) => x.id),
        amount: q?.amount ?? null,
        refundId: refund?.id ?? null,
        refundTx: refund?.creditTx ?? null,
      });
    }
    for (const c of userComplaints) {
      const rel = c.serviceId ? services.get(c.serviceId) : null;
      complaints.push({
        id: c.id,
        serviceId: c.serviceId,
        serviceType: rel?.type ?? null,
        astroId: rel?.astrologer.id ?? null,
        astroName: rel?.astrologer.name ?? null,
        category: c.category,
        description: c.evidence[0]?.value ?? '',
        evidenceCount: c.evidence.length,
        raisedAt: ts(c.raisedAt),
        updatedAt: ts(c.timeline.at(-1)?.at ?? c.raisedAt),
        status: c.status,
        userId: user.id,
        userName: user.name,
      });
    }
    // Remedies: the same records as the User / Astrologer Profile Remedies tabs.
    for (const rm of p.remedies) {
      remedies.push({
        id: rm.id,
        userId: user.id,
        userName: user.name,
        astroId: rm.astrologer.id,
        astroName: rm.astrologer.name,
        serviceId: rm.serviceId,
        serviceType: services.get(rm.serviceId)?.type ?? null,
        title: rm.title,
        status: rm.status,
        duration: rm.duration,
        suggestedAt: ts(rm.suggestedAt),
        startAt: ts(rm.startAt),
        dueAt: ts(rm.dueAt),
        completedAt: ts(rm.completedAt),
        daysDone: rm.progress.filter((x) => x.value === 'Completed for Today').length,
        daysLogged: rm.progress.length,
        proof: rm.proof.length,
        visibility: rm.visibility,
      });
    }
    // Ratings & Reviews: the same review records as the Astrologer Profile.
    for (const s of p.services) {
      const rv = reviewFor(s, user.lastActiveAt, now);
      if (!rv) continue;
      reviews.push({
        id: rv.id,
        userId: user.id,
        userName: user.name,
        astroId: s.astrologer.id,
        astroName: s.astrologer.name,
        serviceId: s.id,
        serviceType: s.type,
        rating: rv.rating,
        text: rv.text,
        at: ts(rv.at),
        status: rv.status,
        replied: rv.replied,
      });
    }
    for (const s of p.services) {
      const base = {
        id: s.id,
        userId: user.id,
        userName: user.name,
        astroId: s.astrologer.id,
        astroName: s.astrologer.name,
        createdAt: ts(s.createdAt),
        amount: s.amount,
        paymentStatus: s.paymentStatus,
        payIds: (s.payments ?? []).map((x) => x.id),
      };
      if (s.type === 'Text Question') {
        const d = byQuestion.get(s.id);
        questions.push({
          ...base,
          deadline: ts(s.deadline),
          answeredAt: ts(s.answeredAt),
          status: adminQuestionStatus(s, d, snapshot),
          disputeId: d?.id ?? null,
          attachments: s.attachments.filter((f) => f.sender === 'User').length,
        });
      } else if (s.type === 'Appointment') {
        appointments.push({
          ...base,
          serviceAt: ts(s.serviceAt),
          duration: s.duration,
          status: s.status,
          rescheduled: s.reschedules.length > 0,
          cancelledAt: ts(s.cancellation?.at),
          cancelledBy: s.cancellation?.by ?? null,
          refund: s.refundInfo?.amount ?? null,
        });
      } else {
        sessions.push({
          ...base,
          type: s.type,
          completedAt: ts(s.endedAt),
          connectedAt: ts(s.connectedAt),
          endedAt: ts(s.endedAt),
          usedMinutes: s.usedMinutes,
          packageMinutes: s.package.minutes,
          packagePrice: s.package.price,
          extensions: s.extensions,
          termination: s.termination,
          status: s.status,
        });
      }
    }
  }
  return { questions, appointments, sessions, complaints, disputes: disputes_, reviews, remedies, snapshot, builtAt: nowMs };
}

let pending = null;

/** Resolve the index once per session (worker, with a main-thread fallback). */
export function loadServiceIndex() {
  if (pending) return pending;
  pending = new Promise((resolve) => {
    try {
      const worker = new Worker(new URL('./serviceIndex.worker.js', import.meta.url), { type: 'module' });
      worker.onmessage = (e) => {
        resolve(e.data);
        worker.terminate();
      };
      worker.onerror = () => {
        worker.terminate();
        resolve(computeServiceIndex());
      };
      worker.postMessage({ now: Date.now() });
    } catch {
      resolve(computeServiceIndex());
    }
  });
  return pending;
}

/** One Technical Complaint with its user and related service (same record as the User Profile). */
export function complaintDetails(userId, complaintId) {
  const user = getUser(userId);
  if (!user) return null;
  const p = getBaseProfile(user);
  const complaint = p.complaints.find((c) => c.id === complaintId) ?? null;
  if (!complaint) return null;
  const service = complaint.serviceId ? p.services.find((s) => s.id === complaint.serviceId) ?? null : null;
  return { user, complaint, service };
}

/** One remedy (moderation applied) with its user and source service. */
export function remedyDetails(userId, remedyId) {
  const p = getProfile(userId);
  if (!p) return null;
  const remedy = p.remedies.find((r) => r.id === remedyId) ?? null;
  if (!remedy) return null;
  return { user: p.user, remedy, service: p.services.find((s) => s.id === remedy.serviceId) ?? null };
}

/** One review with reply history (same record as the Astrologer Profile). */
export function reviewDetails(userId, serviceId) {
  const user = getUser(userId);
  if (!user) return null;
  const service = getBaseProfile(user).services.find((s) => s.id === serviceId);
  if (!service) return null;
  return { user, service, review: reviewFor(service, user.lastActiveAt) };
}

// ---------- details: the full record from the user's own records ----------
export function serviceDetails(userId, serviceId) {
  const user = getUser(userId);
  if (!user) return null;
  const p = getBaseProfile(user);
  const service = p.services.find((s) => s.id === serviceId);
  if (!service) return null;
  const dispute = p.disputes.find((d) => d.questionId === serviceId) ?? null;
  const complaint = p.complaints.find((c) => c.serviceId === serviceId) ?? null;
  const transactions = p.wallet.transactions.filter((t) => t.serviceId === serviceId);
  const refund = p.wallet.refunds.find((r) => r.serviceId === serviceId) ?? null;
  return { user, service, dispute, complaint, transactions, refund };
}
