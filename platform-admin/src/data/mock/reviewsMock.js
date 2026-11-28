// Ratings & Reviews derived from completed services (local data).
// AD-129: a 1–5 star rating follows every completed Text Question,
// Appointment, Instant Call or Instant Chat; written feedback is optional.
// A review exists only if the user was active after the service.
// AD-130 / AD-131: Pending Publication · Published · Hidden; Replied / Not
// Replied; one current reply (edit history kept). AD-132: the public rating
// uses Published reviews only.

import { DAY, HOUR, hashString, iso, mulberry32, snapshotTime } from './seed.js';

const TEXTS = {
  5: ['Very accurate and kind guidance. Thank you!', 'Clear answer with practical remedies.', 'Excellent consultation, explained everything patiently.'],
  4: ['Helpful reading, a little brief but useful.', 'Good guidance on timing; will consult again.'],
  3: ['Average. The answer was general.', 'Okay, expected more detail on my question.'],
  2: ['Did not address my main concern.'],
  1: ['Not satisfied with the consultation.'],
};

const REPLIES = [
  'Thank you for your kind words. Wishing you the very best.',
  'Thank you. Please follow the suggested remedy regularly.',
  'I appreciate your feedback and will add more detail next time.',
];

function completedAt(service) {
  if (service.type === 'Text Question') return service.answeredAt;
  if (service.type === 'Appointment') return iso(new Date(service.serviceAt).getTime() + service.duration * 60 * 1000);
  return service.endedAt;
}

/** The review for one service, or null. `userLastActive` is an ISO date. */
export function reviewFor(service, userLastActive, now = new Date()) {
  const done = service.status === 'Completed' || service.status === 'Settled';
  if (!done || !service.astrologer) return null;
  const end = completedAt(service);
  if (!end) return null;
  const rand = mulberry32(hashString(`${service.id}:review`));
  const at = new Date(end).getTime() + Math.floor(rand() * 20 * HOUR) + 10 * 60 * 1000;
  if (at > new Date(userLastActive).getTime() || at > snapshotTime(now)) return null;
  const x = rand();
  const rating = x < 0.55 ? 5 : x < 0.83 ? 4 : x < 0.93 ? 3 : x < 0.97 ? 2 : 1;
  const withText = rand() < 0.6;
  const s = rand();
  const status = s < 0.72 ? 'Published' : s < 0.9 ? 'Pending Publication' : 'Hidden';
  const replied = rand() < 0.45;
  const replyAt = at + Math.floor(rand() * 2 * DAY) + HOUR;
  const replyHistory = [];
  if (replied && replyAt <= snapshotTime(now)) {
    replyHistory.push({ at: iso(replyAt), action: 'Replied', text: REPLIES[Math.floor(rand() * REPLIES.length)] });
    if (rand() < 0.15 && replyAt + DAY <= snapshotTime(now)) {
      replyHistory.push({ at: iso(replyAt + DAY), action: 'Reply edited', text: REPLIES[0] });
    }
  }
  const pool = TEXTS[rating];
  return {
    id: `RV-${service.id}`, // keeps the service prefix so IDs stay unique across service types
    serviceId: service.id,
    serviceType: service.type,
    astrologerId: service.astrologer.id,
    rating,
    text: withText ? pool[Math.floor(rand() * pool.length)] : '',
    at: iso(at),
    status,
    replied: replyHistory.length > 0,
    reply: replyHistory.at(-1)?.text ?? '',
    replyHistory,
  };
}
