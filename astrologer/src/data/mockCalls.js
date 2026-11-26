// Illustrative mock data only — Instant Call & Chat (spec 06_INSTANT_CALL_AND_CHAT.md, AD-103 – AD-111).
// Sample values come from the reference prototype ("06 Instant Call & Chat"). People are the existing
// sample customers (data/mockAudience.js); nothing here is real.

export const ME = { name: 'Ananya R.', id: 'AST-1042' }; // astrologer details shown in Consultation Details (AD-110)

// History record: { id, svc, user, uid, at, dur, mins, pk, amt, pay, status, att,
//   review: { stars, text } | null, notes, remedies: [text], files: [name], msgs: [[who, text]] (chat only) }
const rec = (x) => ({ status: 'Completed', review: null, notes: '', remedies: [], files: [], att: '', ...x });

export const callsSeed = {
  tab: 'call', // History tab: 'call' | 'chat'
  // Waiting incoming requests. Call and Chat share ONE waiting list of at most 3 users (oldest first);
  // they are stored per service: { id, s, user, uid, sub, pk, at (ms), left (s) }.
  queue: { call: [], chat: [] },
  session: null, // active consultation { s, user, pk, start, state, pausedMs, dropAt }
  now: 0, // last clock tick (ms) while a request or session is running
  // Prepaid packages (AD-106). ₹75 for 5 minutes is illustrative only.
  pk: {
    call: [{ m: 5, p: 75 }, { m: 10, p: 140 }, { m: 20, p: 260 }],
    chat: [{ m: 5, p: 60 }, { m: 15, p: 160 }],
  },
  // Call History / Chat History (AD-110, AD-111).
  hist: [
    rec({ id: 'CON-7781', svc: 'Instant Call', user: 'Divya S.', uid: 'U-44821', at: '2026-11-20T09:05', dur: '9m 40s', pk: '10 min', amt: 140, pay: 'Paid · UPI',
      review: { stars: 5, text: 'Very clear guidance on my job switch. Felt reassured.' }, notes: 'Saturn transit; advised to wait till January before resigning.',
      remedies: ['Recite Shani mantra on Saturdays'], files: ['Birth-chart-summary.pdf'], att: 'Remedy note' }),
    rec({ id: 'CON-7779', svc: 'Instant Chat', user: 'Hari K.', uid: 'U-41870', at: '2026-11-20T08:15', dur: '14m 02s', pk: '15 min', amt: 160, pay: 'Paid · Wallet',
      review: { stars: 5, text: 'Detailed answers and quick replies.' }, notes: 'Father’s health: Mars in 8th; advised check-ups in March.',
      remedies: ['Hanuman Chalisa on Tuesdays'], files: ['Health-period.pdf'],
      msgs: [['u', 'Namaste, my father has been unwell. Which months need extra care?'], ['me', 'Namaste! Please share his birth details.'], ['u', '3 Jan 1960, 4:15 AM, Tiruchirappalli.'], ['me', 'Thank you. March and August need extra care; regular check-ups will help.']] }),
    rec({ id: 'CON-7772', svc: 'Instant Call', user: 'Maya J.', uid: 'U-40011', at: '2026-11-19T18:40', dur: '19m 20s', pk: '20 min', amt: 260, pay: 'Paid · Card',
      review: { stars: 4, text: 'Helpful about my studies abroad.' }, notes: 'Jupiter favourable from June 2027 for foreign education.' }),
    rec({ id: 'CON-7766', svc: 'Instant Chat', user: 'Deepa L.', uid: 'U-39550', at: '2026-11-19T07:30', dur: '0m 00s', pk: '5 min', amt: 60, pay: 'Refunded · Wallet', status: 'Cancelled',
      msgs: [] }),
    rec({ id: 'CON-7760', svc: 'Instant Chat', user: 'Rahul K.', uid: 'U-39017', at: '2026-11-18T21:40', dur: '5m 00s', pk: '5 min', amt: 60, pay: 'Paid · Card',
      review: { stars: 4, text: 'Quick and to the point.' }, msgs: [['u', 'Quick question about travel next month.'], ['me', 'The second half of the month is better for travel.']] }),
    rec({ id: 'CON-7752', svc: 'Instant Call', user: 'Arun R.', uid: 'U-38877', at: '2026-11-17T19:10', dur: '4m 12s (ended early)', pk: '5 min', amt: 75, pay: 'Paid · UPI' }),
    rec({ id: 'CON-7741', svc: 'Instant Call', user: 'Rahul K.', uid: 'U-39017', at: '2026-11-16T10:20', dur: '0m 00s', pk: '10 min', amt: 140, pay: 'Refunded · UPI', status: 'Cancelled' }),
  ],
  // Request History: every incoming request and what happened to it.
  // status: Accepted | Declined | Missed (not accepted within 30 s, AD-104) | Cancelled (by the User before accepting).
  reqLog: [
    { id: 'RQ-9041', s: 'call', user: 'Divya S.', uid: 'U-44821', at: '2026-11-20T09:04:40', status: 'Accepted', topic: 'Career', outcome: 'Joined after 20 s' },
    { id: 'RQ-9038', s: 'chat', user: 'Hari K.', uid: 'U-41870', at: '2026-11-20T08:14:50', status: 'Accepted', topic: 'Health', outcome: 'Joined after 10 s' },
    { id: 'RQ-9033', s: 'chat', user: 'Maya J.', uid: 'U-40011', at: '2026-11-20T07:19:00', status: 'Declined', topic: 'Education', outcome: 'Declined by you. The user was offered Try Again / Try Some Other Astrologer.' },
    { id: 'RQ-9030', s: 'call', user: 'Arun R.', uid: 'U-38877', at: '2026-11-20T01:19:00', status: 'Missed', topic: 'Business', outcome: 'Not accepted within 30 s; the request expired.' },
    { id: 'RQ-9024', s: 'chat', user: 'Deepa L.', uid: 'U-39550', at: '2026-11-19T07:29:00', status: 'Cancelled', topic: 'Finance', outcome: 'Cancelled by the user before you accepted.' },
    { id: 'RQ-9019', s: 'call', user: 'Maya J.', uid: 'U-40011', at: '2026-11-19T18:39:30', status: 'Accepted', topic: 'Education', outcome: 'Joined after 25 s' },
  ],
  // Offers for Instant Call / Chat. Prototype only: the specification defines offers for Text Question
  // campaigns (09 Offers, AD-127); Call/Chat offers are still to be confirmed by the product owner.
  // kind: 'pct' (value % off) | 'flat' (₹ value off); svc: 'both' | 'call' | 'chat'.
  offers: [
    { id: 'OF-1', name: 'First session welcome', svc: 'both', kind: 'pct', value: 20, from: '2026-10-01', to: '2026-12-31', aud: 'New Users only', used: 42, paused: false },
    { id: 'OF-2', name: 'Festive flat discount', svc: 'chat', kind: 'flat', value: 50, from: '2026-11-10', to: '2026-11-30', aud: 'All Users', used: 17, paused: false },
    { id: 'OF-3', name: 'Loyal clients – 15% off', svc: 'call', kind: 'pct', value: 15, from: '2026-11-01', to: '2026-12-15', aud: 'Selected Users', used: 6, paused: true },
    { id: 'OF-4', name: 'Monsoon special', svc: 'call', kind: 'pct', value: 10, from: '2026-08-01', to: '2026-09-15', aud: 'All Users', used: 88, paused: false },
  ],
};
