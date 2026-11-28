// Illustrative mock data only — Ratings & Reviews (spec 10_RATINGS_AND_REVIEWS.md, AD-129 – AD-134, AD-186).
// Sample values come from the reference prototypes ("10 Ratings & Reviews" and "AstroConnect – Ratings & Reviews").
// Users and service IDs match the other mock data (Text Questions, Appointments, Instant Call & Chat).

export const SERVICES = ['Text Questions', 'Appointments', 'Instant Call', 'Instant Chat']; // AD-134
export const STATUSES = ['Pending Publication', 'Published', 'Hidden']; // AD-131
export const REPLY_STATES = ['Replied', 'Not Replied']; // AD-131
export const RATINGS = [['5', '5 stars'], ['4', '4 stars'], ['3', '3 stars'], ['2', '2 stars'], ['1', '1 star']];
export const DATES = [['today', 'Today'], ['7d', 'Last 7 days'], ['30d', 'Last 30 days'], ['custom', 'Custom range']];
export const SORTS = [['newest', 'Newest first'], ['oldest', 'Oldest first'], ['high', 'Highest rating'], ['low', 'Lowest rating']];
export const REVIEWS_TODAY = '2026-11-27'; // "today" for the date filters of the sample reviews
export const PER_PAGE = 10;

// st = review status; reply = the single current reply (AD-130); admin = Platform Admin action note (AD-133);
// ref = the service record the review is about ('' when the sample has none).
// Filters: st = tab ('' = All); q = search; rating; date (+ from / to for a custom range); sort; page.
export const reviewsSeed = {
  filters: { svc: '', st: '', rep: '', q: '', rating: '', date: '', from: '', to: '', sort: 'newest', page: 1 },
  list: [
    { id: 'RV-301', svc: 'Text Questions', ref: 'TQ-98276', user: 'Sanjay R.', stars: 5, text: 'Very clear and quick answer. Thank you!', at: '2026-11-20T11:00', st: 'Pending Publication', reply: '' },
    { id: 'RV-298', svc: 'Appointments', ref: 'APT-5007', user: 'Kavya M.', stars: 4, text: 'Helpful session, remedy was easy to follow.', at: '2026-11-18T10:30', st: 'Published', reply: 'Thank you, Kavya. Wishing you success!' },
    { id: 'RV-295', svc: 'Instant Call', ref: 'CON-7752', user: 'Arun R.', stars: 2, text: 'Call ended a bit early.', at: '2026-11-17T19:30', st: 'Hidden', reply: '' },
    { id: 'RV-290', svc: 'Instant Chat', ref: 'CON-7760', user: 'Kavya M.', stars: 5, text: '', at: '2026-11-18T22:00', st: 'Published', reply: '' },
    { id: 'RV-284', svc: 'Text Questions', ref: 'TQ-97821', user: 'Arun R.', stars: 5, text: 'Accurate prediction.', at: '2026-11-05T09:00', st: 'Published', reply: '', admin: 'Reply removed by Platform Admin: contained a phone number (policy).' },
    // further sample reviews from the "AstroConnect – Ratings & Reviews" reference
    { id: 'RV-312', svc: 'Instant Chat', ref: '', user: 'Meena S.', stars: 5, text: 'Very patient and explained my chart in detail. I finally understand what the Saturn transit means for me.', at: '2026-11-27T10:42', st: 'Pending Publication', reply: '' },
    { id: 'RV-310', svc: 'Appointments', ref: '', user: 'Rahul V.', stars: 3, text: 'Good guidance overall, but the session started about ten minutes late.', at: '2026-11-26T19:15', st: 'Pending Publication', reply: 'Thank you for your patience, Rahul. I am sorry the session started late — I have adjusted my schedule so it does not happen again.' },
    { id: 'RV-308', svc: 'Instant Call', ref: '', user: 'Divya K.', stars: 4, text: 'Clear answers about my career question. Would have liked a little more time.', at: '2026-11-25T12:08', st: 'Pending Publication', reply: '' },
    { id: 'RV-306', svc: 'Text Questions', ref: '', user: 'Prakash N.', stars: 1, text: '', at: '2026-11-24T21:30', st: 'Pending Publication', reply: '' },
    { id: 'RV-305', svc: 'Instant Chat', ref: '', user: 'Lakshmi P.', stars: 4, text: 'Helpful advice, though replies were a little slow at times.', at: '2026-11-23T16:20', st: 'Pending Publication', reply: 'Thank you, Lakshmi. I appreciate the feedback and will keep my chat responses quicker.' },
    { id: 'RV-303', svc: 'Appointments', ref: '', user: 'Vignesh T.', stars: 5, text: 'Detailed reading and practical remedies. Will book again before my housewarming.', at: '2026-11-22T11:05', st: 'Pending Publication', reply: '' },
    { id: 'RV-293', svc: 'Instant Chat', ref: '', user: 'Nithya R.', stars: 3, text: 'Answers felt a bit general for my situation.', at: '2026-11-15T13:48', st: 'Hidden', reply: '' },
    { id: 'RV-287', svc: 'Instant Call', ref: '', user: 'Karthik S.', stars: 5, text: '', at: '2026-11-10T08:55', st: 'Pending Publication', reply: '' },
    { id: 'RV-280', svc: 'Appointments', ref: '', user: 'Priya D.', stars: 2, text: 'Expected more time on the marriage question.', at: '2026-10-28T15:10', st: 'Hidden', reply: 'Thank you, Priya. I am sorry the session felt short — please reach out if you would like to continue the discussion.' },
  ],
};
