// Single source for the Platform Admin sidebar, page titles and routes.
// Only the Dashboard is implemented; every other entry opens a placeholder
// until its own implementation phase.

export const DEFAULT_PATH = '/dashboard';

export const NAV = [
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
  {
    id: 'people',
    label: 'People Management',
    icon: 'people',
    children: [
      { label: 'Users', path: '/people/users' },
      { label: 'Astrologers', path: '/people/astrologers' },
      { label: 'Assistants', path: '/people/assistants' },
    ],
  },
  {
    id: 'services',
    label: 'Service Management',
    icon: 'services',
    children: [
      { label: 'Overview', path: '/services/overview' },
      { label: 'Text Questions', path: '/services/text-questions' },
      { label: 'Appointments', path: '/services/appointments' },
      { label: 'Instant Call', path: '/services/instant-call' },
      { label: 'Instant Chat', path: '/services/instant-chat' },
      { label: 'Disputes', path: '/services/disputes' },
    ],
  },
  {
    id: 'finance',
    label: 'Finance',
    icon: 'finance',
    children: [
      { label: 'Wallet Overview', path: '/finance/wallet-overview' },
      { label: 'Service Revenue', path: '/finance/service-revenue' },
      { label: 'Platform Commission', path: '/finance/platform-commission' },
      { label: 'Astrologer Earnings', path: '/finance/astrologer-earnings' },
      { label: 'User Wallet Deposits', path: '/finance/user-wallet-deposits' },
      { label: 'Payment Transactions', path: '/finance/payment-transactions' },
      { label: 'Wallet Adjustments', path: '/finance/wallet-adjustments' },
      { label: 'Refunds', path: '/finance/refunds' },
      { label: 'Settlements', path: '/finance/settlements' },
      { label: 'Payouts', path: '/finance/payouts' },
      { label: 'Commission Settings', path: '/finance/commission-settings' },
      { label: 'Financial Reports', path: '/finance/financial-reports' },
    ],
  },
  {
    id: 'operations',
    label: 'Operations',
    icon: 'operations',
    children: [
      { label: 'Technical Complaints', path: '/operations/technical-complaints' },
      { label: 'Remedies', path: '/operations/remedies' },
      { label: 'Content Management', path: '/operations/content' },
      { label: 'Ratings & Reviews', path: '/operations/ratings-reviews' },
      { label: 'Availability', path: '/operations/availability' },
    ],
  },
  { id: 'activity', label: 'Recent Activity', path: '/recent-activity', icon: 'activity' },
  { id: 'documents', label: 'Document Management', path: '/documents', icon: 'document' },
];

const ROUTES = new Map();
for (const item of NAV) {
  if (item.path) ROUTES.set(item.path, { label: item.label, group: null, groupId: null });
  for (const child of item.children ?? []) {
    ROUTES.set(child.path, { label: child.label, group: item.label, groupId: item.id });
  }
}

// Earlier paths kept working after a page moved (e.g. Dashboard links).
export const ALIASES = { '/operations/disputes': '/services/disputes' };

const USER_PROFILE = /^\/people\/users\/([A-Za-z0-9-]+)$/;
const ASTROLOGER_PROFILE = /^\/people\/astrologers\/([A-Za-z0-9-]+)$/;
const ASSISTANT_PROFILE = /^\/people\/assistants\/([A-Za-z0-9-]+)$/;

/** Path of one assistant's profile page. */
export const assistantProfilePath = (assistantId) => `/people/assistants/${assistantId}`;

/** Path of one astrologer's profile page. */
export const astrologerProfilePath = (astrologerId) => `/people/astrologers/${astrologerId}`;

/** Path of one user's profile page. */
export const userProfilePath = (userId) => `/people/users/${userId}`;

/**
 * Route metadata for a path, or null when the path is unknown.
 * `navPath` is the sidebar entry to highlight (differs for detail pages).
 */
export function findRoute(path) {
  const known = ROUTES.get(path);
  if (known) return { ...known, navPath: path };
  const alias = ALIASES[path];
  if (alias) return { ...ROUTES.get(alias), navPath: alias };
  const profile = USER_PROFILE.exec(path);
  if (profile) {
    return {
      label: 'User Profile',
      group: 'People Management',
      groupId: 'people',
      navPath: '/people/users',
      params: { userId: profile[1] },
    };
  }
  const assistant = ASSISTANT_PROFILE.exec(path);
  if (assistant) {
    return { label: 'Assistant Profile', group: 'People Management', groupId: 'people', navPath: '/people/assistants', params: { assistantId: assistant[1] } };
  }
  const astrologer = ASTROLOGER_PROFILE.exec(path);
  if (astrologer) {
    return {
      label: 'Astrologer Profile',
      group: 'People Management',
      groupId: 'people',
      navPath: '/people/astrologers',
      params: { astrologerId: astrologer[1] },
    };
  }
  return null;
}
