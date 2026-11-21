import { createStore, useStore } from '@/lib/store.js';
import { notificationsSeed } from '@/data/mockNotifications.js';

// Activity & Notification Centre state (spec 14_NOTIFICATIONS_AND_REMINDERS.md, AD-149):
// read/unread, unread count, category filter (kept when the user comes back — §5.1 step 5).
// Prototype only: no push delivery; state resets on reload.

export const notificationsStore = createStore({ cat: '', list: notificationsSeed.map((n) => ({ ...n })) });

/** Number of unread notifications (drives the header bell). */
export const unreadCount = (s) => s.list.filter((n) => !n.read).length;

/** Visible list for the current category filter, newest first. */
export const visible = (s) => s.list
  .filter((n) => !s.cat || n.cat === s.cat)
  .sort((a, b) => b.at.localeCompare(a.at));

export const notificationActions = {
  setCat: (cat) => notificationsStore.patch({ cat }),
  /** Opening a notification marks it Read (AD-149). */
  markRead: (id) => notificationsStore.patch((s) => ({ list: s.list.map((n) => (n.id === id ? { ...n, read: true } : n)) })),
  markAllRead: () => notificationsStore.patch((s) => ({ list: s.list.map((n) => ({ ...n, read: true })) })),
};

export default function useNotifications() {
  return useStore(notificationsStore);
}
