import { createStore, useStore } from '@/lib/store.js';
import { notificationsSeed } from '@/data/mockNotifications.js';

// Activity & Notification Centre state (spec 14_NOTIFICATIONS_AND_REMINDERS.md, AD-149):
// read/unread, unread count, category filter (kept when the user comes back — §5.1 step 5).
// Prototype only: no push delivery; state resets on reload.

// Filters of the two tabs (Notifications / My Activity) live here too, so they are kept when the user
// comes back from a detail page; `focus` is the entry to scroll back to.
export const NF0 = { q: '', cat: '', date: 'any', from: '2026-11-01', to: '2026-11-20', read: 'all', page: 1 };
export const AF0 = { q: '', cat: '', date: 'any', from: '2026-11-01', to: '2026-11-20', page: 1 };

export const notificationsStore = createStore({ cat: '', list: notificationsSeed.map((n) => ({ ...n })), nf: { ...NF0 }, af: { ...AF0 }, focus: null });

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
  /** Mark a single notification Read or Unread (row action). */
  setRead: (id, read) => notificationsStore.patch((s) => ({ list: s.list.map((n) => (n.id === id ? { ...n, read } : n)) })),
  /** Patch a tab's filters; any change other than the page goes back to page 1. */
  setNf: (patch) => notificationsStore.patch((s) => ({ nf: { ...s.nf, ...patch, page: patch.page || 1 } })),
  setAf: (patch) => notificationsStore.patch((s) => ({ af: { ...s.af, ...patch, page: patch.page || 1 } })),
  setFocus: (focus) => notificationsStore.patch({ focus }),
  markAllRead: () => notificationsStore.patch((s) => ({ list: s.list.map((n) => ({ ...n, read: true })) })),
};

export default function useNotifications() {
  return useStore(notificationsStore);
}
