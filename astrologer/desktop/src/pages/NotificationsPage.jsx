import useNotifications, { notificationActions, notificationsStore, unreadCount, visible } from '@shared/hooks/useNotifications.js';
import { Empty, Sec } from '../components/section/kit.jsx';
import NotificationFilters from '../components/notifications/NotificationFilters.jsx';
import NotificationItem from '../components/notifications/NotificationItem.jsx';

// Activity & Notification Centre (spec 14_NOTIFICATIONS_AND_REMINDERS.md, AD-148 – AD-151).
// Route: #/notifications. Category filter is kept when returning from a detail page (§5.1).
// Preferences live in Settings (AD-150, AD-153) — linked, not duplicated here.

export function meta() {
  return { title: 'Activity & Notification Centre', subtitle: `${unreadCount(notificationsStore.get())} unread` };
}

export default function NotificationsPage() {
  const s = useNotifications();
  const list = visible(s);
  return (
    <>
      <div className="nt-bar">
        <button type="button" className="btn btn-o" onClick={notificationActions.markAllRead}>Mark all read</button>
        <a className="btn btn-o" href="#/settings">Preferences</a>
      </div>
      <NotificationFilters value={s.cat} onChange={notificationActions.setCat} />
      <Sec>
        {list.length
          ? list.map((n) => <NotificationItem key={n.id} n={n} onOpen={notificationActions.markRead} />)
          : <Empty title="No notifications" />}
      </Sec>
      <p className="muted sm">Important alerts also arrive as push notifications. The same event never creates duplicates.</p>
    </>
  );
}
