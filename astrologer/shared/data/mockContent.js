// Illustrative mock data only — Benefits & Content (spec 12_CONTENT_MANAGEMENT.md, AD-138 – AD-144).
// Sample values come from the reference prototype ("12 Content Management").

// The 12 Rasis supplied by the prediction template (AD-141).
export const RASI = [
  'Mesham (Aries)', 'Rishabam (Taurus)', 'Mithunam (Gemini)', 'Kadagam (Cancer)', 'Simmam (Leo)', 'Kanni (Virgo)',
  'Thulam (Libra)', 'Viruchigam (Scorpio)', 'Dhanusu (Sagittarius)', 'Magaram (Capricorn)', 'Kumbam (Aquarius)', 'Meenam (Pisces)',
];

// The ten optional special astrology templates (AD-142).
export const SPECIAL = [
  'Guru Peyarchi', 'Sani Peyarchi', 'Rahu Peyarchi', 'Ketu Peyarchi', 'Sevvai Peyarchi',
  'Surya Peyarchi', 'Sukra Peyarchi', 'Budha Peyarchi', 'Surya Grahanam', 'Chandra Grahanam',
];

export const AUDIENCES = ['Public', 'Followers', 'Subscribers', 'Silver', 'Gold', 'Platinum']; // AD-139
export const TIERS = ['Silver', 'Gold', 'Platinum']; // AD-72
export const BENEFIT_KINDS = ['Daily Prediction', 'Weekly Prediction', 'Monthly Prediction', 'Special Prediction']; // AD-140

export const contentSeed = {
  tab: 'posts', // posts | benefit | templates | delivery
  pv: 'editor', // phone editor tab: editor | preview (AD-144)
  ed: null, // content being edited
  posts: [
    { id: 'PST-120', kind: 'General Post', fmt: 'Image', title: 'Karthigai Deepam blessings', text: 'Light a lamp at dusk for prosperity.', aud: 'Public', st: 'Published', at: '2026-11-18T07:00', views: 2140, likes: 312, comments: 41 },
    { id: 'PST-121', kind: 'General Post', fmt: 'Text', title: "This week's lucky colours", text: 'Monday: white, Tuesday: red…', aud: 'Followers', st: 'Scheduled', at: '2026-11-23T07:00', views: 0, likes: 0, comments: 0 },
    { id: 'PST-119', kind: 'Daily Prediction', fmt: 'Text + Image', title: 'Daily prediction · 20 Nov', text: '12-Rasi daily prediction', aud: 'Gold, Platinum', st: 'Published', at: '2026-11-20T06:00', views: 388, likes: 96, comments: 12 },
    { id: 'PST-118', kind: 'Custom', fmt: 'Text', title: 'Draft: Navaratri fasting guide', text: '', aud: 'Subscribers', st: 'Draft', at: '2026-11-17T20:00', views: 0, likes: 0, comments: 0 },
  ],
  // Delivery history (AD-140): Delivered, Missed, Pending.
  delivery: [
    { content: 'Daily Prediction · 20 Nov', tier: 'Gold, Platinum', st: 'Delivered', at: '2026-11-20T06:00' },
    { content: 'Daily Prediction · 19 Nov', tier: 'Gold, Platinum', st: 'Delivered', at: '2026-11-19T06:00' },
    { content: 'Weekly Prediction · Week 47', tier: 'Silver', st: 'Missed', at: '2026-11-16T06:00' },
    { content: 'Daily Prediction · 21 Nov', tier: 'Gold, Platinum', st: 'Pending', at: '2026-11-21T06:00' },
  ],
  recur: { daily: true, weekly: true }, // Daily and Weekly recurring schedules (AD-140)
};
