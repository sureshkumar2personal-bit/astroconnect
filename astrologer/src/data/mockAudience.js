// Illustrative mock data only — Audience (spec 11_AUDIENCE.md, AD-135 – AD-137).
// Sample values come from the reference prototype ("11 Audience"). User IDs and names match the
// Text Questions / Appointments / Instant Call mock data. Counts are sample data, never real (AD-137).

export const FILTERS = [['all', 'All Users'], ['followers', 'Followers'], ['subscribers', 'Subscribers']]; // AD-135
export const SORTS = [['recent', 'Recent activity'], ['name', 'Name']];

// follow = follows the astrologer (free); sub = subscription tier/status (paid, also follows — X-09);
// inter = interactions [type, record ID, note]; blocked = block request context (AD-161).
export const audienceSeed = {
  filters: { f: 'all', q: '', sort: 'recent', from: '' },
  list: [
    { uid: 'U-44821', name: 'Divya S.', follow: true, sub: 'Gold', since: '2026-08-02', last: '2026-11-20', inter: [['Text Question', 'TQ-98241'], ['Appointment', 'APT-5012'], ['Instant Call', 'CON-7781']] },
    { uid: 'U-39017', name: 'Rahul K.', follow: true, sub: '', since: '2026-09-14', last: '2026-11-19', inter: [['Text Question', 'TQ-97790', '(Disputed)'], ['Appointment', 'APT-5013']] },
    { uid: 'U-41870', name: 'Hari K.', follow: true, sub: 'Gold', since: '2026-10-01', last: '2026-11-20', inter: [['Subscription Question', 'SQ-3011']] },
    { uid: 'U-40011', name: 'Maya J.', follow: true, sub: 'Silver', since: '2026-07-21', last: '2026-11-18', inter: [['Subscription Question', 'SQ-3007']] },
    { uid: 'U-39550', name: 'Deepa L.', follow: true, sub: 'Platinum (expired)', since: '2026-03-11', last: '2026-11-20', inter: [['Subscription Question', 'SQ-2999']] },
    { uid: 'U-38877', name: 'Arun R.', follow: false, sub: '', since: '2026-10-20', last: '2026-11-19', inter: [['Appointment', 'APT-5009'], ['Text Question', 'TQ-97821']] },
    { uid: 'U-37005', name: 'Naveen P.', follow: false, sub: '', since: '2026-09-30', last: '2026-10-30', inter: [['Blocked request under Platform review']], blocked: 'Block requested 02 Nov 2026 · under Platform Admin review' },
  ],
};

export const AVATAR_BG = '#E3D9F7'; // reference avatar colour for audience cards
