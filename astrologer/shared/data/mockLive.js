// Illustrative mock data only — Live Sessions (spec 07_LIVE_SESSIONS.md, AD-112 – AD-119).
// Sample values come from the reference prototype ("07 Live Sessions").

export const liveSeed = {
  verified: true, // Verified Astrologer (AD-112); verification steps are AP-04-01
  scheduled: null,
  live: null,
  past: [
    { id: 'LV-0410', topic: 'Guru Peyarchi 2026 – what it means for you', date: '2026-10-14T19:00', dur: '52 min', parts: 418, comments: 236 },
  ],
  form: { mode: 'schedule', topic: '', desc: '', thumb: '', aud: 'Public', tiers: [], when: '2026-11-28T19:00' },
};

// What a starting Live looks like in the prototype (watchers and first comments).
export const liveRoomSeed = {
  parts: 128,
  comments: [
    { name: 'Kavya M.', text: 'Namaste! Is Sani Peyarchi good for Simha?', muted: false },
    { name: 'Hari K.', text: 'Please talk about career.', muted: false },
    { name: 'Spam Bot', text: 'Buy followers cheap!!!', muted: false },
  ],
};

export const AUDIENCES = ['Public', 'Followers', 'Subscribers', 'Specific tiers'];
export const TIERS = ['Silver', 'Gold', 'Platinum']; // AD-72
