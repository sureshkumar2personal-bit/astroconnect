// Illustrative mock data only — Settings (spec 15_SETTINGS_AND_PREFERENCES.md, AD-152 – AD-157).
// Sample values come from the reference prototype ("15 Settings"). No real account data.

export const ACCOUNT_FACTS = [
  ['Account', 'Ananya Ramesh · AST-1042'],
  ['Registered mobile', '+91 98400 12345'],
  ['Registered email', 'ananya@astroconverse.in'],
];

// Login / Security Activity (AD-152).
export const SECURITY_ACTIVITY = [
  '20 Nov 2026, 07:55 AM · New device login · Chrome on Windows',
  '18 Nov 2026, 09:10 PM · Login · Android app',
  '12 Nov 2026, 10:02 AM · Password changed',
];

// Notification categories A–I (owned by 14_NOTIFICATIONS_AND_REMINDERS.md, AD-148).
export const NOTIFICATION_CATEGORIES = {
  A: 'New Activity & Customers', B: 'Text Questions', C: 'Appointments', D: 'Instant Call & Chat', E: 'Content',
  F: 'Live', G: 'Wallet & Earnings', H: 'Account & Security', I: 'Platform & Support',
};

// AD-154: the list of "other supported languages" and the date formats are not defined in the spec;
// these options are the reference prototype's placeholders.
export const LANGUAGES = ['English', 'Tamil', 'Other supported languages'];
export const DATE_FORMATS = ['DD/MM/YYYY', 'DD MMM YYYY'];
export const TIME_ZONES = ['Asia/Kolkata (IST)', 'Other'];

export const LEGAL_DOCS = ['Privacy Policy', 'Terms and Conditions', 'Data / Privacy Information'];
export const APP_VERSION = '1.0.0 (design preview)';

export const settingsSeed = {
  push: true,
  sound: true,
  vib: true,
  cats: Object.fromEntries(Object.keys(NOTIFICATION_CATEGORIES).map((k) => [k, true])),
  ev: { 'New Question Received': true, 'Answer Pending Reminder': true, 'Upcoming Reminder': true, 'New Likes/Comments': false },
  lang: 'English',
  fmt: 'DD/MM/YYYY',
  tz: 'Asia/Kolkata (IST)', // SET-03: IST by default
  perm: { Camera: true, Microphone: true, 'Photos / Files': true },
  sessions: [
    { id: 's1', name: 'This device · Chrome on Windows', where: 'Chennai · active now', current: true },
    { id: 's2', name: 'Android app · Pixel 7', where: 'Chennai · 2 hours ago', current: false },
    { id: 's3', name: 'Safari on iPad', where: 'Coimbatore · 3 days ago', current: false },
  ],
  request: '', // last deactivation/deletion request sent to Platform Admin (AD-157)
};
