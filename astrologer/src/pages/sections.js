// Section pages, loaded on demand by SectionPage. Order = reference sidebar order.
// Each module follows the contract documented in SectionPage.jsx.
export const SECTIONS = {
  live: { title: 'Live Sessions', load: () => import('./LivePage.jsx') },
  earnings: { title: 'Earnings & Wallet', load: () => import('./EarningsPage.jsx') },
  profile: { title: 'Profile', load: () => import('./ProfilePage.jsx') },
  calls: { title: 'Instant Call & Chat', load: () => import('./CallsPage.jsx') },
  audience: { title: 'Audience', load: () => import('./AudiencePage.jsx') },
  reviews: { title: 'Ratings & Reviews', load: () => import('./ReviewsPage.jsx') },
  content: { title: 'Benefits & Content', load: () => import('./ContentPage.jsx') },
  analytics: { title: 'Analytics', load: () => import('./AnalyticsPage.jsx') },
  remedies: { title: 'Remedy Tracker', load: () => import('./RemediesPage.jsx') },
  notifications: { title: 'Notifications', load: () => import('./NotificationsPage.jsx') },
  activity: { title: 'Recent Activity', load: () => import('./ActivityPage.jsx') },
  settings: { title: 'Settings', load: () => import('./SettingsPage.jsx') },
  support: { title: 'Help & Support', load: () => import('./SupportPage.jsx') },
};
