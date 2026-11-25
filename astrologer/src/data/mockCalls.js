// Illustrative mock data only — Instant Call & Chat (spec 06_INSTANT_CALL_AND_CHAT.md, AD-103 – AD-111).
// Sample values come from the reference prototype ("06 Instant Call & Chat").

export const ME = { name: 'Ananya R.', id: 'AST-1042' }; // astrologer details shown in Consultation Details (AD-110)

export const callsSeed = {
  tab: 'call', // History tab: 'call' | 'chat'
  // Waiting incoming requests, one FIFO queue per service: { id, s, user, uid, sub, pk, at (ms), left (s) }.
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
    { id: 'CON-7781', svc: 'Instant Call', user: 'Divya S.', uid: 'U-44821', at: '2026-11-20T09:05', dur: '9m 40s', pk: '10 min', amt: 140, pay: 'Paid · UPI', att: 'Remedy note' },
    {
      id: 'CON-7779', svc: 'Instant Chat', user: 'Gokul P.', uid: 'U-42901', at: '2026-11-20T08:15', dur: '14m 02s', pk: '15 min', amt: 160, pay: 'Paid · Wallet', att: '',
      msgs: [['u', 'Is this a good time to change my job?'], ['me', 'Yes — January to April 2027 is supportive. Prepare your resume now.'], ['u', 'Thank you!']],
    },
    { id: 'CON-7760', svc: 'Instant Chat', user: 'Kavya M.', uid: 'U-37710', at: '2026-11-18T21:40', dur: '5m 00s', pk: '5 min', amt: 60, pay: 'Paid · Card', att: '', msgs: [['u', 'Quick question about travel']] },
    { id: 'CON-7752', svc: 'Instant Call', user: 'Arun R.', uid: 'U-38877', at: '2026-11-17T19:10', dur: '4m 12s (ended early)', pk: '5 min', amt: 75, pay: 'Paid · UPI', att: '' },
  ],
};

