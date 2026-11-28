// Service Disputes and Technical Complaints — the single set of records used
// by the User Profile (Disputes tab) and, later, the standalone Dispute &
// Complaint Management module (07-dispute-complaint-management.md). Records
// are derived deterministically from the user's services, so both views
// always show the same records.
//
// Approved flow: dispute within 7 days after the answer; the astrologer
// answers once within 3 days, otherwise Admin Review (D-19, AD-41).
// Record statuses use the documented list (§4); their mapping to the Text
// Question flow (PC-11) and refund outcomes (PP-03) are not decided, so no
// refunds are attached to dispute resolutions here.

import { hashString, mulberry32, snapshotTime } from './mock/profileMock.js';

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;
const iso = (ms) => new Date(ms).toISOString();

const REASONS = [
  'The answer did not address the timing I asked about.',
  'The answer seems general and does not refer to my birth details.',
  'I asked about my career, but the answer focuses on marriage.',
];

const COMPLAINTS = [
  ['Appointment', 'Appointment', 'The astrologer joined the appointment late and the call disconnected twice.'],
  ['Call', 'Instant Call', 'The call audio was unclear for several minutes during my session.'],
  ['Chat', 'Instant Chat', 'Messages were delayed and the chat kept showing a reconnecting banner.'],
  ['Payment', null, 'The payment was deducted from my bank account but the app showed a failure.'],
  ['Wallet', null, 'My wallet top-up is not reflected in the balance.'],
  ['Login', null, 'I am unable to sign in on my new phone with my registered mobile number.'],
  ['Technical problem', null, 'The app closes when I open the Remedy Tracker.'],
];

const cache = new Map();

export const DISPUTE_STATUSES = [
  'Open',
  'Under Investigation',
  'Waiting for User Response',
  'Waiting for Astrologer Response',
  'Resolved',
  'Rejected',
  'Closed',
  'Withdrawn by User',
];

/** { disputes, complaints } for one user. `services` comes from the profile. */
export function getUserDisputes(user, services, now = new Date()) {
  if (cache.has(user.id)) return cache.get(user.id);
  const rand = mulberry32(hashString(`${user.id}:disputes`));
  const pick = (list) => list[Math.floor(rand() * list.length)];
  const chance = (p) => rand() < p;
  const between = (a, b) => a + Math.floor(rand() * Math.max(0, b - a));
  const num = user.id.replace(/\D/g, '');
  const snapshot = snapshotTime(now);
  const last = new Date(user.lastActiveAt).getTime();
  let n = 0;

  const disputes = [];
  for (const q of services.filter((s) => s.type === 'Text Question' && s.answeredAt)) {
    if (!chance(0.14)) continue;
    const answeredAt = new Date(q.answeredAt).getTime();
    const raisedAt = answeredAt + between(6 * HOUR, 6 * DAY);
    if (raisedAt > Math.min(last, snapshot)) continue;
    const deadline = raisedAt + 3 * DAY;
    const responded = chance(0.65);
    const timeline = [
      { at: iso(answeredAt), text: `Answer delivered by ${q.astrologer.name}` },
      { at: iso(raisedAt), text: 'Dispute raised by user (within the 7-day window)' },
    ];
    const responses = [];
    const evidence = [{ type: 'Text', label: 'Description', value: pick(REASONS) }];
    if (chance(0.45)) evidence.push({ type: 'Screenshot', label: 'answer-screenshot.png', value: '420 KB' });
    let status;
    let investigation = '';
    let resolution = '';
    const withdrawn = chance(0.08);

    if (withdrawn) {
      const at = Math.min(raisedAt + between(HOUR, 2 * DAY), last);
      timeline.push({ at: iso(at), text: 'Withdrawn by user' });
      status = 'Withdrawn by User';
    } else if (responded) {
      const at = Math.min(raisedAt + between(6 * HOUR, 3 * DAY - HOUR), snapshot);
      responses.push({
        at: iso(at),
        from: `${q.astrologer.name} (Astrologer)`,
        text: 'Thank you for the follow-up. Considering your birth details again, the favourable period begins after the next Jupiter transit; the guidance in my answer applies from then.',
      });
      timeline.push({ at: iso(at), text: 'Dispute answered by astrologer within 3 days' });
      status = at + DAY < snapshot ? 'Closed' : 'Waiting for User Response';
      if (status === 'Closed') {
        resolution = 'Dispute answered by the astrologer. No further dispute can be raised for this question.';
        timeline.push({ at: iso(at + DAY), text: 'Closed after the dispute answer' });
      }
    } else {
      const escalatedAt = deadline;
      timeline.push({ at: iso(escalatedAt), text: 'No astrologer answer within 3 days — moved to Admin Review' });
      if (escalatedAt > snapshot) {
        status = 'Waiting for Astrologer Response';
      } else if (escalatedAt + 4 * DAY > snapshot) {
        status = 'Under Investigation';
        investigation = 'Admin Review in progress: question, answer and birth details are being reviewed.';
      } else {
        const upheld = chance(0.5);
        status = upheld ? 'Resolved' : 'Rejected';
        investigation = 'Admin reviewed the question, the delivered answer and the birth details shared with consent.';
        resolution = upheld
          ? 'The answer did not address the question asked. The astrologer has been asked to follow the question scope.'
          : 'The answer addressed the question asked. No further action required.';
        const at = escalatedAt + between(DAY, 4 * DAY);
        responses.push({ at: iso(at), from: 'AstroConnect Support', text: `Your dispute has been reviewed. ${resolution}` });
        timeline.push({ at: iso(at), text: `Admin Review completed — ${status}` });
      }
    }

    n += 1;
    disputes.push({
      id: `DSP-${num}${String(n).padStart(2, '0')}`,
      kind: 'Service Dispute',
      questionId: q.id,
      astrologer: q.astrologer,
      raisedAt: iso(raisedAt),
      category: 'Text Question answer',
      evidence,
      responses,
      deadline: iso(deadline),
      investigation,
      resolution,
      status,
      timeline: timeline.sort((a, b) => a.at.localeCompare(b.at)),
    });
  }

  const complaints = [];
  const age = (last - new Date(user.registeredAt).getTime()) / DAY;
  if (age > 5 && chance(0.22)) {
    const count = chance(0.75) ? 1 : 2;
    for (let i = 0; i < count; i++) {
      const [category, serviceType, description] = pick(COMPLAINTS);
      const related = serviceType ? services.find((s) => s.type === serviceType) : null;
      if (serviceType && !related) continue;
      const raisedAt = related
        ? Math.min(new Date(related.serviceAt ?? related.createdAt).getTime() + between(HOUR, DAY), last)
        : between(new Date(user.registeredAt).getTime() + DAY, last);
      const evidence = [{ type: 'Text', label: 'Description', value: description }];
      if (chance(0.5)) evidence.push(pick([
        { type: 'Screenshot', label: 'app-screen.png', value: '380 KB' },
        { type: 'Photo', label: 'issue-photo.jpg', value: '1.1 MB' },
        { type: 'PDF', label: 'bank-statement.pdf', value: '220 KB' },
      ]));
      const timeline = [{ at: iso(raisedAt), text: `Technical complaint raised (${category})` }];
      const responses = [];
      let status;
      let investigation = '';
      let resolution = '';
      const replyAt = raisedAt + between(2 * HOUR, DAY);
      if (replyAt > snapshot) {
        status = 'Open';
      } else {
        responses.push({ at: iso(replyAt), from: 'AstroConnect Support', text: 'Thank you for reporting this. Our team is looking into it and will update you here.' });
        timeline.push({ at: iso(replyAt), text: 'Support acknowledged the complaint' });
        investigation = 'Session and device logs reviewed by the technical team.';
        const doneAt = replyAt + between(DAY, 4 * DAY);
        if (doneAt > snapshot) {
          status = 'Under Investigation';
        } else {
          status = chance(0.8) ? 'Resolved' : 'Closed';
          resolution =
            status === 'Resolved'
              ? 'The issue was identified and fixed in the latest app update.'
              : 'No fault was found; guidance was shared with the user.';
          responses.push({ at: iso(doneAt), from: 'AstroConnect Support', text: resolution });
          timeline.push({ at: iso(doneAt), text: `Complaint ${status.toLowerCase()}` });
        }
      }
      n += 1;
      complaints.push({
        id: `TC-${num}${String(n).padStart(2, '0')}`,
        kind: 'Technical Complaint',
        category,
        serviceId: related?.id ?? null,
        raisedAt: iso(raisedAt),
        evidence,
        responses,
        deadline: null,
        investigation,
        resolution,
        status,
        timeline: timeline.sort((a, b) => a.at.localeCompare(b.at)),
      });
    }
  }

  const result = {
    disputes: disputes.sort((a, b) => b.raisedAt.localeCompare(a.raisedAt)),
    complaints: complaints.sort((a, b) => b.raisedAt.localeCompare(a.raisedAt)),
  };
  cache.set(user.id, result);
  return result;
}
