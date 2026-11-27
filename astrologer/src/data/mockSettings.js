// Illustrative mock data only — Settings (spec 15_SETTINGS_AND_PREFERENCES.md, AD-152 – AD-157).
// Sample values follow the "AstroConnect Settings" reference. No real account data.

export const ACCOUNT = {
  name: 'Ananya Ramesh', initials: 'AR', id: 'AST-1042', type: 'Astrologer',
  mobile: '+91 98400 12345', email: 'ananya@astroconverse.in',
};

// The six Settings categories (left navigation on desktop, list rows on phones).
export const SECTIONS = [
  { id: 'account', label: 'Account Settings', icon: 'user' },
  { id: 'notifications', label: 'Notification Preferences', icon: 'bell' },
  { id: 'language', label: 'Language & Region', icon: 'globe' },
  { id: 'app', label: 'App Preferences', icon: 'sliders' },
  { id: 'privacy', label: 'Privacy & Security', icon: 'shield' },
  { id: 'about', label: 'About & Account Actions', icon: 'info' },
];

// Notification categories A–I (owned by 14_NOTIFICATIONS_AND_REMINDERS.md, AD-148) and their events.
export const NOTIFICATION_GROUPS = [
  { id: 'consult', title: 'Consultations' },
  { id: 'content', title: 'Content & Live' },
  { id: 'account', title: 'Account & Platform' },
];
export const NOTIFICATION_CATEGORIES = [
  { id: 'A', group: 'consult', name: 'New Activity & Customers', desc: 'New customers and activity on your profile', icon: 'users' },
  { id: 'B', group: 'consult', name: 'Text Questions', desc: 'Questions from customers and answer reminders', icon: 'messageQ',
    events: [
      { id: 'nq', name: 'New Question Received', desc: 'When a customer sends you a question' },
      { id: 'apr', name: 'Answer Pending Reminder', desc: 'When a question is still waiting for your answer' },
    ] },
  { id: 'C', group: 'consult', name: 'Appointments', desc: 'Bookings, changes and reminders', icon: 'calendar',
    events: [{ id: 'upc', name: 'Upcoming Reminder', desc: 'Before a scheduled appointment begins' }] },
  { id: 'D', group: 'consult', name: 'Instant Call & Chat', desc: 'Incoming instant call and chat requests', icon: 'phone' },
  { id: 'E', group: 'content', name: 'Content', desc: 'Engagement on your posts', icon: 'pen',
    events: [{ id: 'likes', name: 'New Likes / Comments', desc: 'When customers react to or comment on your posts' }] },
  { id: 'F', group: 'content', name: 'Live', desc: 'Live session updates and audience activity', icon: 'radio' },
  { id: 'G', group: 'account', name: 'Wallet & Earnings', desc: 'Earnings, payouts and wallet updates', icon: 'wallet' },
  { id: 'H', group: 'account', name: 'Account & Security', desc: 'Account updates and notices', icon: 'shield' },
  { id: 'I', group: 'account', name: 'Platform & Support', desc: 'Support replies and platform announcements', icon: 'help' },
];

export const DELIVERY = [
  { key: 'push', name: 'Push notifications', desc: 'Alerts on this device, even when the app is closed', icon: 'bell' },
  { key: 'sound', name: 'Sound', desc: 'Play a tone when an alert arrives', icon: 'volume' },
  { key: 'vib', name: 'Vibration', desc: 'Vibrate when an alert arrives', icon: 'vibrate' },
];

// AD-154: the list of "other supported languages" is not defined; English and Tamil only.
export const LANGUAGES = [
  { id: 'en', label: 'English', native: '' },
  { id: 'ta', label: 'Tamil', native: 'தமிழ்' },
];
export const DATE_FORMATS = [{ id: 'dmy', label: 'DD/MM/YYYY' }, { id: 'dmmmy', label: 'DD MMM YYYY' }];
export const TODAY = [2026, 11, 27];
export const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const DATE_SAMPLES = [
  { label: 'Today', d: TODAY },
  { label: 'Upcoming appointment', d: [2026, 12, 4] },
  { label: 'Last sign-in activity', d: [2026, 11, 20] },
];

// Device permissions (AD-155). Statuses are illustrative; the app cannot change them.
export const PERMISSIONS = [
  { id: 'camera', name: 'Camera', icon: 'camera', purpose: 'Profile photos and content you create', status: 'na' },
  { id: 'mic', name: 'Microphone', icon: 'mic', purpose: 'Voice consultations and live sessions', status: 'allowed' },
  { id: 'files', name: 'Photos / Files', icon: 'image', purpose: 'Uploading images and documents', status: 'pending' },
];
export const PERM_STATUS = {
  allowed: { label: 'Allowed', tone: 'ok', explain: 'Access is allowed. You can turn it off at any time from your device settings.' },
  na: { label: 'Not allowed', tone: 'bad', explain: "Access is blocked. Features that need it won't work until you allow it in your device settings." },
  pending: { label: 'Not yet requested', tone: 'gold', explain: "You haven't been asked yet. The app asks the first time a feature needs it." },
};

export const LEGAL_DOCS = [
  { name: 'Privacy Policy', desc: 'How your personal data is collected, used and protected' },
  { name: 'Terms and Conditions', desc: 'The terms for using AstroConnect as an astrologer' },
  { name: 'Data & Privacy Information', desc: 'Details about the data linked to your account' },
];

export const ACTIVITY_KIND = {
  newdev: { title: 'New device sign-in', tag: 'New device', icon: 'monitor', tone: 'gold' },
  login: { title: 'Signed in', tag: 'Login', icon: 'smartphone', tone: 'ok' },
  password: { title: 'Password changed', tag: 'Security', icon: 'key', tone: 'pri' },
};

export const APP_VERSION = '1.0.0';
export const ABOUT_TEXT = 'AstroConnect brings astrologers and seekers together through text questions, scheduled appointments, instant calls and chat, content and live sessions.';

export const settingsSeed = {
  push: true,
  sound: true,
  vib: false,
  cats: { A: true, B: true, C: true, D: true, E: true, F: false, G: true, H: true, I: true },
  events: { nq: true, apr: true, upc: true, likes: false },
  lang: 'en',
  fmt: 'dmmmy',
  pwChanged: [2026, 11, 12],
  activity: [
    { kind: 'newdev', detail: 'Chrome on Windows', date: [2026, 11, 20], time: '07:55 AM' },
    { kind: 'login', detail: 'Android app', date: [2026, 11, 18], time: '09:10 PM' },
    { kind: 'password', detail: 'Changed from account settings', date: [2026, 11, 12], time: '10:02 AM' },
  ],
  sessions: [
    { id: 's1', name: 'Chrome on Windows', icon: 'monitor', place: 'Chennai', when: 'Active now', current: true },
    { id: 's2', name: 'Android app · Pixel 7', icon: 'smartphone', place: 'Chennai', when: '2 hours ago', current: false },
    { id: 's3', name: 'Safari on iPad', icon: 'tablet', place: 'Coimbatore', when: '3 days ago', current: false },
  ],
  deactReq: false, // AD-157: requests go to Platform Admin; never applied instantly
  delReq: false,
};
