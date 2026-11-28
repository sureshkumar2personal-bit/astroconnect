// Illustrative mock data only — Audience (spec 11_AUDIENCE.md, AD-135 – AD-137).
// Sample values come from the reference prototypes ("11 Audience" and "AstroConnect – Audience"). User IDs and names match the
// Text Questions / Appointments / Instant Call mock data. Counts are sample data, never real (AD-137).

export const FILTERS = [['all', 'All Users'], ['followers', 'Followers'], ['subscribers', 'Subscribers']]; // AD-135
export const SORTS = [['recent', 'Recent activity'], ['name', 'Name (A–Z)'], ['since_new', 'Customer since (newest)'], ['since_old', 'Customer since (oldest)']];
export const SUB_FILTERS = [['all', 'All'], ['active', 'Active'], ['expired', 'Expired'], ['none', 'No subscription']];
export const FOLLOW_FILTERS = [['all', 'All'], ['following', 'Following'], ['not', 'Not following']];

// "Today" for the Audience sample data (date presets, plan progress) and the start of the 12-month activity window.
export const AUDIENCE_TODAY = '2026-11-27';
export const ACTIVITY_SINCE = '2025-11-27';
export const PLAN_NAME = { 1: 'Monthly', 3: 'Quarterly', 6: 'Half-yearly' };
export const TIER_RANK = { Silver: 1, Gold: 2, Platinum: 3 };
export const LAST_LABEL = { chat: 'Instant chat session', call: 'Instant call', question: 'Text question', appt: 'Appointment completed', booked: 'Appointment booked', content: 'Content interaction', sub: 'Subscription purchased', follow: 'Followed you', unf: 'Unfollowed you' };

// follow = follows the astrologer (free); sub = current subscription tier/status (paid, also follows — X-09);
// inter = interactions [type, record ID, note]; blocked = block request context (AD-161), kept for the Instant Call sample.
// lastType = kind of the last activity (LAST_LABEL); unf = date the customer unfollowed;
// subs = subscription history [tier, start, months, end, 'Active' | 'Expired'], oldest first;
// block = block request { s: Requested | Under review | Approved | Rejected, at, dec?, ref?, reason? };
// events = activity history [date, time, kind, title, detail], newest first.
export const audienceSeed = {
  filters: { f: 'all', q: '', sort: 'recent', from: '', to: '', subF: 'all', followF: 'all', page: 1 },
  list: [
  { uid: 'U-44821', name: 'Divya S.', follow: true, sub: 'Gold', since: '2026-08-02', last: '2026-11-20', inter: [['Text Question', 'TQ-98241'], ['Appointment', 'APT-5012'], ['Instant Call', 'CON-7781']],
    lastType: 'chat', subs: [['Silver', '2026-08-05', 1, '2026-09-05', 'Expired'], ['Gold', '2026-09-06', 3, '2026-12-06', 'Active']],
    events: [
      ['2026-11-20', '8:45 PM', 'chat', 'Instant chat session', '9 min · completed'],
      ['2026-11-13', '11:30 AM', 'call', 'Instant call', '11 min · completed'],
      ['2026-11-07', '12:55 PM', 'saved', 'Saved your article', '“Full moon rituals for the month”'],
      ['2026-09-22', '6:45 PM', 'call', 'Instant call', '22 min · completed'],
      ['2026-09-15', '3:20 PM', 'appt', 'Appointment completed', '20-min audio consultation'],
      ['2026-09-06', '4:55 PM', 'renew', 'Upgraded subscription', 'Gold Quarterly · 3 months'],
      ['2026-08-05', '9:45 AM', 'sub', 'Subscription purchased', 'Silver Monthly · 1 month'],
      ['2026-08-02', '5:05 PM', 'follow', 'Followed you', 'Started following your profile'],
    ] },
  { uid: 'U-39017', name: 'Rahul K.', follow: true, sub: '', since: '2026-09-14', last: '2026-11-19', inter: [['Text Question', 'TQ-97790', '(Disputed)'], ['Appointment', 'APT-5013']],
    lastType: 'call', subs: [],
    events: [
      ['2026-11-19', '11:30 AM', 'call', 'Instant call', '23 min · completed'],
      ['2026-11-18', '10:35 AM', 'chat', 'Instant chat session', '27 min · completed'],
      ['2026-11-04', '9:05 PM', 'content', 'Liked your post', '“Reading your Navamsa chart”'],
      ['2026-09-14', '9:10 PM', 'follow', 'Followed you', 'Started following your profile'],
    ] },
  { uid: 'U-41870', name: 'Hari K.', follow: true, sub: 'Gold', since: '2026-10-01', last: '2026-11-20', inter: [['Subscription Question', 'SQ-3011']],
    lastType: 'question', subs: [['Gold', '2026-10-01', 3, '2027-01-01', 'Active']],
    events: [
      ['2026-11-20', '7:20 PM', 'question', 'Text question submitted', 'Topic: Finance & property · answered'],
      ['2026-10-22', '5:10 PM', 'chat', 'Instant chat session', '28 min · completed'],
      ['2026-10-22', '4:25 PM', 'chat', 'Instant chat session', '15 min · completed'],
      ['2026-10-01', '9:30 PM', 'follow', 'Followed you', 'Started following your profile'],
      ['2026-10-01', '7:00 PM', 'sub', 'Subscription purchased', 'Gold Quarterly · 3 months'],
    ] },
  { uid: 'U-40011', name: 'Maya J.', follow: true, sub: 'Silver', since: '2026-07-21', last: '2026-11-18', inter: [['Subscription Question', 'SQ-3007']],
    lastType: 'question', subs: [['Silver', '2026-07-21', 1, '2026-08-21', 'Expired'], ['Silver', '2026-08-22', 6, '2027-02-22', 'Active']],
    events: [
      ['2026-11-18', '1:30 PM', 'question', 'Text question submitted', 'Topic: Education · answered'],
      ['2026-10-29', '1:50 PM', 'chat', 'Instant chat session', '12 min · completed'],
      ['2026-10-16', '7:00 PM', 'call', 'Instant call', '21 min · completed'],
      ['2026-09-11', '9:45 AM', 'chat', 'Instant chat session', '18 min · completed'],
      ['2026-08-22', '9:00 PM', 'call', 'Instant call', '7 min · completed'],
      ['2026-08-22', '9:30 AM', 'renew', 'Subscription renewed', 'Silver Half-yearly · 6 months'],
      ['2026-07-21', '1:55 PM', 'follow', 'Followed you', 'Started following your profile'],
      ['2026-07-21', '10:15 AM', 'sub', 'Subscription purchased', 'Silver Monthly · 1 month'],
    ] },
  { uid: 'U-39550', name: 'Deepa L.', follow: true, sub: 'Platinum (expired)', since: '2026-03-11', last: '2026-11-20', inter: [['Subscription Question', 'SQ-2999']],
    lastType: 'content', subs: [['Gold', '2026-03-15', 3, '2026-06-15', 'Expired'], ['Platinum', '2026-07-20', 3, '2026-10-20', 'Expired']],
    events: [
      ['2026-11-20', '3:50 PM', 'content', 'Liked your post', '“Choosing an auspicious muhurat”'],
      ['2026-11-10', '7:25 PM', 'question', 'Text question submitted', 'Topic: Education · answered'],
      ['2026-10-23', '12:40 PM', 'saved', 'Saved your article', '“Mercury retrograde: what to expect”'],
      ['2026-10-20', '12:55 PM', 'expired', 'Subscription expired', 'Platinum Quarterly ended without renewal'],
      ['2026-10-01', '10:00 AM', 'content', 'Liked your post', '“Saturn transit, explained simply”'],
      ['2026-07-20', '2:20 PM', 'sub', 'Subscription purchased', 'Platinum Quarterly · 3 months'],
      ['2026-06-18', '9:20 AM', 'appt', 'Appointment completed', '20-min audio consultation'],
      ['2026-06-15', '8:20 PM', 'expired', 'Subscription expired', 'Gold Quarterly ended without renewal'],
      ['2026-06-11', '3:05 PM', 'content', 'Liked your post', '“Saturn transit, explained simply”'],
      ['2026-03-15', '2:25 PM', 'sub', 'Subscription purchased', 'Gold Quarterly · 3 months'],
      ['2026-03-11', '3:20 PM', 'follow', 'Followed you', 'Started following your profile'],
    ] },
  { uid: 'U-38877', name: 'Arun R.', follow: false, sub: '', since: '2026-10-20', last: '2026-11-19', inter: [['Appointment', 'APT-5009'], ['Text Question', 'TQ-97821']],
    lastType: 'chat', subs: [], block: { s: 'Requested', at: '2026-11-19', ref: 'HS-20931', reason: 'Inappropriate messages during a chat session' },
    events: [
      ['2026-11-19', '3:45 PM', 'chat', 'Instant chat session', '22 min · completed'],
      ['2026-10-26', '3:00 PM', 'content', 'Liked your post', '“Full moon rituals for the month”'],
      ['2026-10-20', '3:30 PM', 'chat', 'Instant chat session', '9 min · completed'],
    ] },
  { uid: 'U-37005', name: 'Naveen P.', follow: false, sub: '', since: '2026-09-30', last: '2026-10-30', inter: [['Blocked request under Platform review']], blocked: 'Block requested 02 Nov 2026 · under Platform Admin review',
    lastType: 'unf', unf: '2026-10-30', subs: [], block: { s: 'Under review', at: '2026-11-02' },
    events: [
      ['2026-10-30', '8:35 PM', 'unfollow', 'Unfollowed you', 'Stopped following your profile'],
      ['2026-10-28', '2:35 PM', 'chat', 'Instant chat session', '19 min · completed'],
      ['2026-09-30', '9:20 AM', 'follow', 'Followed you', 'Started following your profile'],
    ] },
  ],
};

// Further sample customers from the "AstroConnect – Audience" reference, shown on the Audience page only
// (kept out of audienceSeed.list so the Instant Call sample keeps its customers).
export const moreCustomers = [
  { uid: 'U-45102', name: 'Priya M.', follow: true, sub: 'Platinum', since: '2026-06-12', last: '2026-11-17', lastType: 'appt', subs: [['Gold', '2026-06-15', 3, '2026-09-15', 'Expired'], ['Platinum', '2026-11-04', 6, '2027-05-04', 'Active']],
    events: [
      ['2026-11-17', '3:25 PM', 'appt', 'Appointment completed', '30-min compatibility reading'],
      ['2026-11-04', '8:25 PM', 'sub', 'Subscription purchased', 'Platinum Half-yearly · 6 months'],
      ['2026-10-12', '12:50 PM', 'saved', 'Saved your article', '“Full moon rituals for the month”'],
      ['2026-10-01', '5:30 PM', 'content', 'Liked your post', '“Full moon rituals for the month”'],
      ['2026-09-15', '8:35 PM', 'expired', 'Subscription expired', 'Gold Quarterly ended without renewal'],
      ['2026-08-24', '7:50 PM', 'content', 'Liked your post', '“Mercury retrograde: what to expect”'],
      ['2026-08-15', '9:05 PM', 'question', 'Text question submitted', 'Topic: Family · answered'],
      ['2026-06-20', '9:00 PM', 'call', 'Instant call', '15 min · completed'],
      ['2026-06-15', '11:50 AM', 'sub', 'Subscription purchased', 'Gold Quarterly · 3 months'],
      ['2026-06-12', '6:40 PM', 'follow', 'Followed you', 'Started following your profile'],
    ] },
  { uid: 'U-36214', name: 'Karthik V.', follow: true, sub: 'Gold (expired)', since: '2026-04-02', last: '2026-11-16', lastType: 'content', subs: [['Gold', '2026-04-12', 3, '2026-07-12', 'Expired']],
    events: [
      ['2026-11-16', '10:05 AM', 'saved', 'Saved your article', '“Choosing an auspicious muhurat”'],
      ['2026-09-13', '3:25 PM', 'appt', 'Appointment completed', '45-min birth chart reading'],
      ['2026-08-02', '10:25 AM', 'chat', 'Instant chat session', '25 min · completed'],
      ['2026-07-12', '9:50 PM', 'expired', 'Subscription expired', 'Gold Quarterly ended without renewal'],
      ['2026-04-25', '3:30 PM', 'saved', 'Saved your article', '“Full moon rituals for the month”'],
      ['2026-04-22', '10:55 AM', 'call', 'Instant call', '21 min · completed'],
      ['2026-04-20', '2:45 PM', 'saved', 'Saved your article', '“Weekly horoscope · Leo”'],
      ['2026-04-12', '7:20 PM', 'sub', 'Subscription purchased', 'Gold Quarterly · 3 months'],
      ['2026-04-02', '6:25 PM', 'follow', 'Followed you', 'Started following your profile'],
    ] },
  { uid: 'U-43390', name: 'Sneha R.', follow: true, sub: '', since: '2026-10-25', last: '2026-11-16', lastType: 'question', subs: [],
    events: [
      ['2026-11-16', '1:45 PM', 'question', 'Text question submitted', 'Topic: Career · answered'],
      ['2026-11-01', '5:40 PM', 'call', 'Instant call', '18 min · completed'],
      ['2026-10-25', '10:45 AM', 'follow', 'Followed you', 'Started following your profile'],
    ] },
  { uid: 'U-35871', name: 'Lakshmi N.', follow: false, sub: 'Silver (expired)', since: '2026-02-03', last: '2026-08-08', lastType: 'chat', unf: '2026-07-02', subs: [['Silver', '2026-02-10', 3, '2026-05-10', 'Expired']],
    events: [
      ['2026-08-08', '10:00 AM', 'chat', 'Instant chat session', '13 min · completed'],
      ['2026-07-02', '7:00 PM', 'unfollow', 'Unfollowed you', 'Stopped following your profile'],
      ['2026-06-23', '8:15 PM', 'content', 'Liked your post', '“Mercury retrograde: what to expect”'],
      ['2026-05-24', '8:45 PM', 'question', 'Text question submitted', 'Topic: Finance & property · answered'],
      ['2026-05-10', '7:55 PM', 'expired', 'Subscription expired', 'Silver Quarterly ended without renewal'],
      ['2026-04-18', '12:30 PM', 'chat', 'Instant chat session', '12 min · completed'],
      ['2026-04-05', '6:15 PM', 'question', 'Text question submitted', 'Topic: Finance & property · answered'],
      ['2026-03-07', '11:30 AM', 'question', 'Text question submitted', 'Topic: Finance & property · answered'],
      ['2026-02-10', '12:20 PM', 'sub', 'Subscription purchased', 'Silver Quarterly · 3 months'],
      ['2026-02-03', '3:45 PM', 'follow', 'Followed you', 'Started following your profile'],
    ] },
  { uid: 'U-42255', name: 'Ganesh T.', follow: true, sub: 'Silver', since: '2026-08-28', last: '2026-11-15', lastType: 'sub', subs: [['Silver', '2026-11-15', 1, '2026-12-15', 'Active']],
    events: [
      ['2026-11-15', '4:20 PM', 'sub', 'Subscription purchased', 'Silver Monthly · 1 month'],
      ['2026-11-14', '11:20 AM', 'appt', 'Appointment completed', '20-min audio consultation'],
      ['2026-09-22', '10:20 AM', 'appt', 'Appointment completed', '30-min compatibility reading'],
      ['2026-09-07', '12:35 PM', 'saved', 'Saved your article', '“Saturn transit, explained simply”'],
      ['2026-08-28', '9:10 PM', 'follow', 'Followed you', 'Started following your profile'],
    ] },
  { uid: 'U-41003', name: 'Meera P.', follow: true, sub: 'Gold', since: '2026-05-19', last: '2026-11-14', lastType: 'booked', subs: [['Gold', '2026-09-09', 6, '2027-03-09', 'Active']],
    events: [
      ['2026-11-14', '11:50 AM', 'booked', 'Appointment booked', '30-min video consultation · upcoming'],
      ['2026-10-18', '7:05 PM', 'appt', 'Appointment completed', '20-min audio consultation'],
      ['2026-09-28', '12:35 PM', 'content', 'Liked your post', '“Mercury retrograde: what to expect”'],
      ['2026-09-16', '7:20 PM', 'appt', 'Appointment completed', '20-min audio consultation'],
      ['2026-09-09', '6:15 PM', 'sub', 'Subscription purchased', 'Gold Half-yearly · 6 months'],
      ['2026-08-22', '1:15 PM', 'content', 'Liked your post', '“Reading your Navamsa chart”'],
      ['2026-07-10', '7:45 PM', 'question', 'Text question submitted', 'Topic: Finance & property · answered'],
      ['2026-05-19', '3:20 PM', 'follow', 'Followed you', 'Started following your profile'],
    ] },
  { uid: 'U-31120', name: 'Vikram S.', follow: false, sub: '', since: '2025-06-10', last: '2025-09-12', lastType: 'question', subs: [],
    events: [
      ['2025-09-12', '1:40 PM', 'question', 'Text question submitted', 'Topic: Career · answered'],
      ['2025-08-17', '11:10 AM', 'call', 'Instant call', '19 min · completed'],
      ['2025-07-21', '7:45 PM', 'saved', 'Saved your article', '“Weekly horoscope · Leo”'],
      ['2025-06-21', '8:10 PM', 'saved', 'Saved your article', '“Choosing an auspicious muhurat”'],
      ['2025-06-10', '7:00 PM', 'question', 'Text question submitted', 'Topic: Travel · answered'],
    ] },
  { uid: 'U-44107', name: 'Anjali D.', follow: true, sub: '', since: '2026-11-05', last: '2026-11-13', lastType: 'content', subs: [],
    events: [
      ['2026-11-13', '2:55 PM', 'saved', 'Saved your article', '“Weekly horoscope · Leo”'],
      ['2026-11-05', '2:20 PM', 'follow', 'Followed you', 'Started following your profile'],
    ] },
  { uid: 'U-33718', name: 'Suresh B.', follow: false, sub: 'Platinum (expired)', since: '2025-12-20', last: '2026-04-02', lastType: 'unf', unf: '2026-04-02', subs: [['Platinum', '2026-01-01', 3, '2026-04-01', 'Expired']],
    events: [
      ['2026-04-02', '1:50 PM', 'unfollow', 'Unfollowed you', 'Stopped following your profile'],
      ['2026-04-01', '9:30 PM', 'expired', 'Subscription expired', 'Platinum Quarterly ended without renewal'],
      ['2026-03-27', '9:15 AM', 'saved', 'Saved your article', '“Mercury retrograde: what to expect”'],
      ['2026-03-24', '12:05 PM', 'chat', 'Instant chat session', '9 min · completed'],
      ['2026-02-05', '8:00 PM', 'appt', 'Appointment completed', '20-min audio consultation'],
      ['2026-01-18', '8:10 PM', 'saved', 'Saved your article', '“Weekly horoscope · Leo”'],
      ['2026-01-01', '3:05 PM', 'sub', 'Subscription purchased', 'Platinum Quarterly · 3 months'],
      ['2025-12-20', '8:20 PM', 'follow', 'Followed you', 'Started following your profile'],
    ] },
  { uid: 'U-46012', name: 'Kavya R.', follow: true, sub: '', since: '2026-11-18', last: '2026-11-18', lastType: 'follow', subs: [],
    events: [
      ['2026-11-18', '3:05 PM', 'follow', 'Followed you', 'Started following your profile'],
    ] },
  { uid: 'U-34560', name: 'Ramesh G.', follow: false, sub: 'Gold (expired)', since: '2026-05-14', last: '2026-08-25', lastType: 'unf', unf: '2026-08-25', subs: [['Gold', '2026-05-20', 3, '2026-08-20', 'Expired']],
    events: [
      ['2026-08-25', '9:25 PM', 'unfollow', 'Unfollowed you', 'Stopped following your profile'],
      ['2026-08-20', '2:20 PM', 'expired', 'Subscription expired', 'Gold Quarterly ended without renewal'],
      ['2026-08-18', '9:40 PM', 'saved', 'Saved your article', '“Saturn transit, explained simply”'],
      ['2026-08-07', '3:15 PM', 'call', 'Instant call', '14 min · completed'],
      ['2026-06-25', '5:35 PM', 'call', 'Instant call', '16 min · completed'],
      ['2026-05-25', '1:35 PM', 'appt', 'Appointment completed', '30-min compatibility reading'],
      ['2026-05-20', '9:20 AM', 'sub', 'Subscription purchased', 'Gold Quarterly · 3 months'],
      ['2026-05-14', '11:00 AM', 'follow', 'Followed you', 'Started following your profile'],
    ] },
  { uid: 'U-42871', name: 'Nithya A.', follow: true, sub: 'Silver', since: '2026-07-30', last: '2026-11-12', lastType: 'chat', subs: [['Silver', '2026-11-01', 3, '2027-02-01', 'Active']],
    events: [
      ['2026-11-12', '6:20 PM', 'chat', 'Instant chat session', '20 min · completed'],
      ['2026-11-09', '11:05 AM', 'question', 'Text question submitted', 'Topic: Finance & property · answered'],
      ['2026-11-01', '5:30 PM', 'sub', 'Subscription purchased', 'Silver Quarterly · 3 months'],
      ['2026-10-24', '9:15 PM', 'saved', 'Saved your article', '“Full moon rituals for the month”'],
      ['2026-08-15', '9:20 PM', 'appt', 'Appointment completed', '45-min birth chart reading'],
      ['2026-08-13', '8:55 PM', 'appt', 'Appointment completed', '20-min audio consultation'],
      ['2026-07-30', '6:30 PM', 'follow', 'Followed you', 'Started following your profile'],
    ] },
  { uid: 'U-40566', name: 'Kiran J.', follow: false, sub: '', since: '2026-09-08', last: '2026-11-03', lastType: 'call', subs: [], block: { s: 'Under review', at: '2026-11-04', ref: 'HS-20544', reason: 'Repeated requests to move conversations off the platform' },
    events: [
      ['2026-11-03', '9:55 PM', 'call', 'Instant call', '8 min · completed'],
      ['2026-11-01', '4:05 PM', 'chat', 'Instant chat session', '19 min · completed'],
      ['2026-09-24', '1:20 PM', 'call', 'Instant call', '8 min · completed'],
      ['2026-09-08', '9:25 AM', 'call', 'Instant call', '11 min · completed'],
    ] },
  { uid: 'U-37789', name: 'Pooja V.', follow: true, sub: 'Gold (expired)', since: '2026-05-28', last: '2026-11-10', lastType: 'content', subs: [['Gold', '2026-06-05', 3, '2026-09-05', 'Expired']],
    events: [
      ['2026-11-10', '3:20 PM', 'content', 'Liked your post', '“Saturn transit, explained simply”'],
      ['2026-10-26', '5:25 PM', 'saved', 'Saved your article', '“Full moon rituals for the month”'],
      ['2026-10-20', '4:50 PM', 'chat', 'Instant chat session', '29 min · completed'],
      ['2026-10-14', '8:40 PM', 'appt', 'Appointment completed', '45-min birth chart reading'],
      ['2026-09-05', '2:25 PM', 'expired', 'Subscription expired', 'Gold Quarterly ended without renewal'],
      ['2026-07-28', '9:05 AM', 'chat', 'Instant chat session', '21 min · completed'],
      ['2026-06-05', '5:10 PM', 'sub', 'Subscription purchased', 'Gold Quarterly · 3 months'],
      ['2026-06-05', '2:05 PM', 'call', 'Instant call', '8 min · completed'],
      ['2026-05-28', '11:55 AM', 'follow', 'Followed you', 'Started following your profile'],
    ] },
  { uid: 'U-38102', name: 'Arjun M.', follow: false, sub: '', since: '2026-07-16', last: '2026-09-21', lastType: 'chat', unf: '2026-09-21', subs: [], block: { s: 'Approved', at: '2026-09-22', dec: '2026-09-25', ref: 'HS-19872', reason: 'Abusive language during a chat session' },
    events: [
      ['2026-09-21', '8:55 PM', 'unfollow', 'Unfollowed you', 'Stopped following your profile'],
      ['2026-09-21', '6:45 PM', 'chat', 'Instant chat session', '22 min · completed'],
      ['2026-09-11', '11:50 AM', 'question', 'Text question submitted', 'Topic: Career · answered'],
      ['2026-07-28', '8:45 PM', 'appt', 'Appointment completed', '30-min compatibility reading'],
      ['2026-07-16', '7:35 PM', 'follow', 'Followed you', 'Started following your profile'],
    ] },
  { uid: 'U-43820', name: 'Fathima Z.', follow: true, sub: '', since: '2026-10-11', last: '2026-11-09', lastType: 'question', subs: [],
    events: [
      ['2026-11-09', '6:05 PM', 'question', 'Text question submitted', 'Topic: Career · answered'],
      ['2026-10-20', '9:45 AM', 'call', 'Instant call', '13 min · completed'],
      ['2026-10-11', '8:00 PM', 'follow', 'Followed you', 'Started following your profile'],
    ] },
  { uid: 'U-39981', name: 'Sanjay R.', follow: false, sub: '', since: '2026-10-02', last: '2026-10-27', lastType: 'question', subs: [], block: { s: 'Rejected', at: '2026-10-28', dec: '2026-10-31', ref: 'HS-20217', reason: 'Repeated duplicate questions' },
    events: [
      ['2026-10-27', '2:20 PM', 'question', 'Text question submitted', 'Topic: Relationships · answered'],
      ['2026-10-11', '6:30 PM', 'call', 'Instant call', '7 min · completed'],
      ['2026-10-02', '8:25 PM', 'question', 'Text question submitted', 'Topic: Education · answered'],
    ] },
  { uid: 'U-36650', name: 'Revathi K.', follow: true, sub: 'Platinum', since: '2026-02-06', last: '2026-11-19', lastType: 'appt', subs: [['Gold', '2026-02-10', 6, '2026-08-10', 'Expired'], ['Platinum', '2026-10-18', 6, '2027-04-18', 'Active']],
    events: [
      ['2026-11-19', '7:50 PM', 'appt', 'Appointment completed', '45-min birth chart reading'],
      ['2026-10-24', '9:20 PM', 'appt', 'Appointment completed', '20-min audio consultation'],
      ['2026-10-18', '12:15 PM', 'sub', 'Subscription purchased', 'Platinum Half-yearly · 6 months'],
      ['2026-09-22', '6:40 PM', 'question', 'Text question submitted', 'Topic: Family · answered'],
      ['2026-09-08', '7:45 PM', 'content', 'Liked your post', '“Reading your Navamsa chart”'],
      ['2026-08-10', '10:05 AM', 'expired', 'Subscription expired', 'Gold Half-yearly ended without renewal'],
      ['2026-04-25', '5:15 PM', 'saved', 'Saved your article', '“Mercury retrograde: what to expect”'],
      ['2026-03-19', '4:30 PM', 'call', 'Instant call', '6 min · completed'],
      ['2026-02-10', '1:40 PM', 'sub', 'Subscription purchased', 'Gold Half-yearly · 6 months'],
      ['2026-02-06', '10:00 AM', 'follow', 'Followed you', 'Started following your profile'],
    ] },
  { uid: 'U-35002', name: 'Manoj E.', follow: false, sub: 'Silver (expired)', since: '2026-03-08', last: '2026-04-14', lastType: 'chat', subs: [['Silver', '2026-03-12', 1, '2026-04-12', 'Expired']],
    events: [
      ['2026-04-14', '9:35 PM', 'chat', 'Instant chat session', '10 min · completed'],
      ['2026-04-12', '9:25 PM', 'expired', 'Subscription expired', 'Silver Monthly ended without renewal'],
      ['2026-03-18', '10:00 AM', 'chat', 'Instant chat session', '20 min · completed'],
      ['2026-03-12', '9:35 AM', 'sub', 'Subscription purchased', 'Silver Monthly · 1 month'],
      ['2026-03-08', '11:00 AM', 'chat', 'Instant chat session', '12 min · completed'],
    ] },
];

export const AVATAR_BG = '#E3D9F7'; // reference avatar colour for audience cards
