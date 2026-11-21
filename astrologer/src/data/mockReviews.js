// Illustrative mock data only — Ratings & Reviews (spec 10_RATINGS_AND_REVIEWS.md, AD-129 – AD-134).
// Sample values come from the reference prototype ("10 Ratings & Reviews"). Users and service IDs
// match the other mock data (Text Questions, Appointments, Instant Call & Chat).

export const SERVICES = ['Text Questions', 'Appointments', 'Instant Call', 'Instant Chat']; // AD-134
export const STATUSES = ['Pending Publication', 'Published', 'Hidden']; // AD-131
export const REPLY_STATES = ['Replied', 'Not Replied']; // AD-131

// st = review status; reply = the single current reply (AD-130); admin = Platform Admin action note (AD-133).
export const reviewsSeed = {
  filters: { svc: '', st: '', rep: '' },
  list: [
    { id: 'RV-301', svc: 'Text Questions', ref: 'TQ-98276', user: 'Sanjay R.', stars: 5, text: 'Very clear and quick answer. Thank you!', at: '2026-11-20T11:00', st: 'Pending Publication', reply: '' },
    { id: 'RV-298', svc: 'Appointments', ref: 'APT-5007', user: 'Kavya M.', stars: 4, text: 'Helpful session, remedy was easy to follow.', at: '2026-11-18T10:30', st: 'Published', reply: 'Thank you, Kavya. Wishing you success!' },
    { id: 'RV-295', svc: 'Instant Call', ref: 'CON-7752', user: 'Arun R.', stars: 2, text: 'Call ended a bit early.', at: '2026-11-17T19:30', st: 'Hidden', reply: '' },
    { id: 'RV-290', svc: 'Instant Chat', ref: 'CON-7760', user: 'Kavya M.', stars: 5, text: '', at: '2026-11-18T22:00', st: 'Published', reply: '' },
    { id: 'RV-284', svc: 'Text Questions', ref: 'TQ-97821', user: 'Arun R.', stars: 5, text: 'Accurate prediction.', at: '2026-11-05T09:00', st: 'Published', reply: '', admin: 'Reply removed by Platform Admin: contained a phone number (policy).' },
  ],
};
