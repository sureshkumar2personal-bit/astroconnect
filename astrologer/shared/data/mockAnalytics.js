// Illustrative mock data only — Analytics and Performance (spec 13_ANALYTICS_AND_PERFORMANCE.md,
// AD-145 – AD-147). Sample values come from the reference prototype ("13 Analytics").
// Text Questions, Appointments and Live figures are counted live from their own modules
// (AD-147); the values below stand in for modules that have no shared state yet.

export const PERIODS = ['Daily', 'Weekly', 'Monthly', 'Custom'];

export const analyticsSeed = { per: 'Monthly', from: '2026-11-01', to: '2026-11-20' };

/** Previous-period comparison, in % (AD-146). */
export const CHANGE = {
  views: 12, followers: 9, subscribers: -4,
  tqReceived: 6, tqAnswered: 11, tqPending: -8,
  aptBookings: 5, aptCompleted: 3, aptCancelled: 0, aptMissed: -50,
  callRequests: 7, callAccepted: 9, callDeclined: -20, callCompleted: 8, callUsage: 6,
  liveSessions: 0, liveParts: 14, liveComments: 5,
};

export const profilePerformance = { views: '3,482', followers: '+148', subscribers: '+22' };

// Instant Call & Chat (reference: completed sessions = 4 sessions in history + 35 earlier).
export const callChat = { requests: 46, accepted: 39, declined: 4, completed: 39, usage: '412 min' };

// Published posts (reference "12 Content Management").
export const contentPosts = [
  { id: 'PST-120', title: 'Karthigai Deepam blessings', aud: 'Public', views: 2140, likes: 312, comments: 41 },
  { id: 'PST-119', title: 'Daily prediction · 20 Nov', aud: 'Gold, Platinum', views: 388, likes: 96, comments: 12 },
];

export const growthTrend = { values: [12, 18, 15, 22, 19, 27, 24], labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] };
export const earningsSummary = { values: [38, 53, 21, 15], labels: ['Text Q', 'Appts', 'Call', 'Chat'] };
