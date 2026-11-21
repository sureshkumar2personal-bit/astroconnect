// Illustrative mock data only — Remedy Tracker (spec 17_REMEDY_TRACKER.md, AD-163; AD-22, AD-39).
// Sample values come from the reference prototype ("17 Remedy Tracker").
//
// remedySeed: remedies prescribed in Text Question answers / Dispute Answers that are not in the
// Text Questions mock state. Appointment attachments are NOT listed here — they are read live from
// the Appointments state (AD-102, AD-163); `userProgress` only holds what the User did with them
// (completion and upload are set by the User only, AD-22), matched by appointment + text.

export const remedySeed = [
  { id: 'RM-0405', uid: 'U-38877', user: 'Arun R.', src: 'Text Question', ref: 'TQ-97821', text: 'Offer water to the Sun every morning for 21 days.', date: '2026-11-04T12:00', done: false, file: '' },
  { id: 'RM-0399', uid: 'U-37710', user: 'Kavya M.', src: 'Dispute Answer', ref: 'TQ-97702', text: 'Light a ghee lamp on Fridays for 11 weeks.', date: '2026-10-24T09:00', done: false, file: '' },
];

export const userProgress = [
  { id: 'RM-0412', ref: 'APT-5007', text: 'Recite Hanuman Chalisa on Saturdays.', date: '2026-11-18T10:00', done: true, file: 'temple-visit.jpg' },
];

export const REMEDY_FILTERS = [['', 'All'], ['open', 'Not completed'], ['done', 'Completed by user']];
