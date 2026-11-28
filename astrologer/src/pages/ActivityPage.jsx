import { NotificationCenter } from './NotificationsPage.jsx';

// Recent Activity — opened from Home's Recent Activity "View All" (spec 01_HOME_SCREEN.md AD-20; not a
// bottom-navigation tab, AD-03). Route: #/activity. It is the My Activity tab of Notification & Activity.

export const meta = () => ({ title: 'Notification & Activity', parent: '/' });

export default function ActivityPage() {
  return <NotificationCenter initialTab="activity" />;
}
