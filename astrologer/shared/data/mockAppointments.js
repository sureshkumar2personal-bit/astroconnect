// Illustrative mock data only — Appointments (spec 05_APPOINTMENTS.md, AD-88 – AD-102).
// Sample values come from the reference prototype (astro-converse-app-*.html, "05 Appointments").
// Replace with real API responses later; components keep this shape.

const apt = (id, uid, user, at, dur, amt, status, purpose, extra = {}) => ({
  id, uid, user, at, dur, amt, status, purpose,
  pay: 'Paid', horo: 'Birth-chart.pdf', saved: 'Main horoscope', birth: null,
  unotes: '', pnotes: '', att: [], pendingAtt: false, opened: false,
  ...extra,
});

export const appointments = [
  apt('APT-5012', 'U-44821', 'Divya S.', '2026-11-20T16:30', 30, 550, 'Confirmed', 'Career change guidance', { birth: '12 Mar 1998, 06:40 AM, Chennai', unotes: 'Please focus on 2027.' }),
  apt('APT-5013', 'U-39017', 'Rahul K.', '2026-11-20T18:00', 15, 300, 'Under Review', 'Marriage timing'),
  apt('APT-5014', 'U-43120', 'Nila V.', '2026-11-20T19:30', 30, 550, 'Confirmed', 'Health and family', { birth: '02 Jan 1995, 11:15 PM, Madurai' }),
  apt('APT-5015', 'U-41233', 'Arjun V.', '2026-11-21T10:00', 30, 550, 'Confirmed', 'Property purchase timing'),
  apt('APT-5016', 'U-40562', 'Meera P.', '2026-11-27T11:00', 15, 300, 'Confirmed', 'Job offer decision'),
  apt('APT-5009', 'U-38877', 'Arun R.', '2026-11-19T17:00', 30, 550, 'Completed', 'Exam preparation', { pendingAtt: true }),
  apt('APT-5007', 'U-37710', 'Kavya M.', '2026-11-18T09:30', 15, 300, 'Completed', 'Promotion', { att: [{ type: 'Remedy', text: 'Recite Hanuman Chalisa on Saturdays.' }] }),
  apt('APT-5005', 'U-42118', 'Lakshmi N.', '2026-11-16T12:00', 30, 550, 'Cancelled', 'Transfer question', { pay: 'Refunded to User Wallet', cancelBy: 'User (more than 12 hours before)' }),
  apt('APT-5003', 'U-43007', 'Karthik M.', '2026-11-15T19:00', 15, 300, 'Missed / No-show', 'Travel', { noShow: 'User did not join within the 5-minute grace period' }),
];

// Calendar & Availability settings (AD-90, AD-92, AD-93).
export const availabilitySettings = {
  dur: 30,
  p15: 300,
  p30: 550,
  buffer: 10,
  breaks: [['13:00', '14:00']],
  closed: ['2026-11-27'],
  overrides: [{ date: '2026-11-24', note: 'Single-date override: 4:00 PM – 7:00 PM only' }],
  week: {
    Mon: [['09:00', '12:00'], ['16:00', '20:00']],
    Tue: [['09:00', '12:00'], ['16:00', '20:00']],
    Wed: [['16:00', '20:00']],
    Thu: [['09:00', '12:00'], ['16:00', '20:00']],
    Fri: [['09:00', '12:00'], ['16:00', '20:00']],
    Sat: [['10:00', '14:00']],
    Sun: [],
  },
};

// Sent to both parties, one reminder per interval (AD-100).
export const reminderSchedule = [
  'Immediately after booking',
  '3 days before',
  '2 days before',
  '1 day before',
  '1 hour before (appointment day)',
  '15 minutes before (appointment day)',
  'Immediately after a cancellation or reschedule',
];
