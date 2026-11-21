// Illustrative mock data only — Help & Support (spec 16_HELP_AND_SUPPORT.md, AD-158 – AD-162).
// Sample values come from the reference prototype ("16 Help & Support").

// AD-159 — Other/General Support is always available (SUP-02).
export const SUPPORT_CATEGORIES = [
  'Account/Profile/KYC', 'Text Questions', 'Text Question Disputes/Clarifications', 'Campaigns/Quota', 'Appointments',
  'Instant Call/Chat', 'Wallet/Earnings/Commission/Settlement/Withdrawal', 'Subscription/Offers', 'Ratings & Reviews',
  'Audience/Customers', 'Live Sessions', 'Content/Posts', 'Remedies/Reports', 'Rewards/Notifications', 'App/Technical',
  'Other/General Support',
];

// Subcategories are not defined in the spec (not invented): the form offers only "General".
export const SUBCATEGORIES = ['General'];

// AD-160 statuses — "suggested" in the source, confirmation pending (AP-16-01). Badge colour per status.
export const STATUS_KIND = {
  Open: 'info', 'Under Review': 'warn', 'Awaiting Astrologer Response': 'accent', Resolved: 'ok', Closed: 'gen',
};
export const CLOSED_STATUSES = ['Resolved', 'Closed'];

// history: oldest first. by: 'me' (astrologer) | 'pf' (Platform reply).
export const ticketsSeed = [
  {
    id: 'TCK-1201', cat: 'Wallet/Earnings/Commission/Settlement/Withdrawal', sub: '', ref: 'WD-2231', files: ['screenshot.png'],
    desc: 'Withdrawal WD-2231 has been processing for 1 day.', status: 'Awaiting Astrologer Response',
    hist: [
      { title: 'Ticket created', at: '2026-11-18T12:00', by: 'me', text: 'Withdrawal WD-2231 has been processing for 1 day.' },
      { title: 'Platform reply', at: '2026-11-19T19:00', by: 'pf', text: 'Please confirm your UPI ID is ananya@okhdfc.' },
    ],
  },
  {
    id: 'TCK-1188', cat: 'App/Technical', sub: '', ref: '', files: [],
    desc: 'Voice to Text stopped on Android.', status: 'Resolved',
    hist: [
      { title: 'Ticket created', at: '2026-11-10T09:00', by: 'me', text: 'Voice to Text stopped on Android.' },
      { title: 'Platform reply', at: '2026-11-11T10:00', by: 'pf', text: 'Fixed in version 1.0.0. Please update.' },
    ],
  },
];

// "Which channel to use" (AD-162). Links point at the owning pages.
export const CHANNELS = [
  { situation: 'A user disputes a Text Question answer', channel: ['Answer it inside ', ['Text Questions', '/work/questions'], ' (Dispute Questions tab)'] },
  { situation: 'User feedback on Appointments, Calls, Chats', channel: [['Ratings & Reviews', '/reviews'], ' — there is no dispute section for these'] },
  { situation: 'User-raised disputes generally', channel: ['Handled by Platform Admin'] },
  { situation: 'Your own platform issue, or a request to block a user', channel: ['A Help & Support ticket'] },
];
