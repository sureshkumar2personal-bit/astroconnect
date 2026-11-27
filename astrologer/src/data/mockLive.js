// Illustrative mock data only — Live Sessions (spec 07_LIVE_SESSIONS.md, AD-112 – AD-119, AD-169 – AD-171).
// The History sample records come from the Live Sessions reference design (Live History); real saved session
// records replace them in production. A value that was not recorded is null and shown as "Not available".

const sampleComments = [
  { who: 'Viewer A', at: '+04:12', text: 'Namaste! Joining from Chennai.' },
  { who: 'Viewer B', at: '+11:48', text: 'Is this a good week to sign a new contract?' },
  { who: 'Viewer C', at: '+23:05', text: 'Thank you for the clear explanation.' },
];

export const liveSeed = {
  verified: true, // Verified Astrologer (AD-112); verification steps are AP-04-01
  scheduled: null,
  live: null,
  past: [
    { id: 'LV-2610-018', topic: 'Diwali muhurat & Venus transit – live Q&A', desc: 'Muhurat timings for Diwali week and how the Venus transit affects relationships and finances.', date: '2026-10-18T19:00', dur: '52 min', aud: 'Public', status: 'Completed', parts: 241, unique: 214, peak: 138, comments: 96, commenters: 41, commentList: sampleComments, thumb: '' },
    { id: 'LV-2609-012', topic: 'Saturn retrograde: what it means for your sign', desc: 'Sign-by-sign walkthrough of the Saturn retrograde period.', date: '2026-09-12T20:00', dur: '47 min', aud: 'Followers', status: 'Completed', parts: 186, unique: 168, peak: null, comments: 71, commenters: 33, commentList: sampleComments, thumb: '' },
    { id: 'LV-2608-009', topic: 'Rahu–Ketu transit and career questions', desc: 'Career and finance questions in light of the Rahu–Ketu transit.', date: '2026-08-09T18:30', dur: '38 min', aud: 'Subscribers', status: 'Completed', parts: 122, unique: 109, peak: 74, comments: 54, commenters: null, commentList: sampleComments, thumb: '' },
    { id: 'LV-2607-021', topic: 'Guru Purnima special', desc: 'A short Guru Purnima session; ended early due to a connection issue.', date: '2026-07-21T19:30', dur: '12 min', aud: 'Subscribers – Silver', status: 'Ended early', parts: 31, unique: 31, peak: null, comments: 6, commenters: null, commentList: sampleComments, thumb: '' },
  ],
  form: { mode: 'schedule', topic: '', desc: '', thumb: '', thumbUrl: '', aud: 'Public', tiers: [], date: '', time: '' },
  // Live Settings (AD-170): defaults for new lives and the tools available during a live.
  settings: { watch: 'Public', comment: 'everyone', priority: 'chrono', slow: false, pin: true, mute: true, block: true },
};

// What a starting Live looks like in the prototype (watchers and first comments). `role` drives comment priority.
export const liveRoomSeed = {
  parts: 128,
  comments: [
    { name: 'Kavya M.', text: 'Namaste! Is Sani Peyarchi good for Simha?', muted: false, pinned: false, role: 'subscriber' },
    { name: 'Hari K.', text: 'Please talk about career.', muted: false, pinned: false, role: 'follower' },
    { name: 'Spam Bot', text: 'Buy followers cheap!!!', muted: false, pinned: false, role: 'public' },
  ],
};

export const AUDIENCES = ['Public', 'Followers', 'Subscribers', 'Specific tiers'];
export const AUDIENCE_LABEL = { Public: 'Public', Followers: 'Followers', Subscribers: 'Subscribers', 'Specific tiers': 'Specific Subscription Tiers' };
export const TIERS = ['Silver', 'Gold', 'Platinum']; // AD-72
export const COMMENT_OPTIONS = [['everyone', 'Everyone'], ['followers', 'Followers'], ['subscribers', 'Subscribers'], ['tiers', 'Specific Subscription Tiers'], ['off', 'Comments Off']];
export const PRIORITY_OPTIONS = [['chrono', 'Chronological'], ['followers', 'Followers First'], ['subscribers', 'Subscribers First']];
