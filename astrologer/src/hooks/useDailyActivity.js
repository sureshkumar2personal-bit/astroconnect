import { audienceStore, isExpired } from '@/hooks/useAudience.js';
import { notificationsStore } from '@/hooks/useNotifications.js';
import { activitySeed } from '@/data/mockActivity.js';
import { useStore } from '@/lib/store.js';
import { TODAY } from '@/lib/format.js';
import { isoDay, sameDay } from '@/hooks/useAppointments.js';

// Daily activity counts for the Home Live Activity ticker (AD-166, all three always shown), derived from the live app state:
// new followers / subscribers from the Audience "since" date, and today's appointments with the same
// rule as Today's Work. Appointments are counted by scheduled date because booking dates are not
// recorded (AP-01-17). Flowers are not included until they are defined (AP-01-16).
export default function useDailyActivity(apt) {
  const { list } = useStore(audienceStore);
  const { list: notes } = useStore(notificationsStore);
  const today = isoDay(TODAY);
  // A person counts once, whether they appear through the Audience join date or a dated event
  // (the Recent Activity feed for followers, Notifications for subscribers). Event links end in the User ID.
  const uidOf = (e) => (e.href || '').split('/').pop();
  const onToday = (e) => (e.at || '').slice(0, 10) === today;
  const followers = new Set([
    ...list.filter((u) => u.since === today && u.follow).map((u) => u.uid),
    ...activitySeed.filter((e) => e.title === 'New Follower' && onToday(e)).map(uidOf),
  ]).size;
  const subscribers = new Set([
    ...list.filter((u) => u.since === today && u.sub && !isExpired(u.sub)).map((u) => u.uid),
    ...notes.filter((n) => n.title === 'New Subscriber' && onToday(n)).map(uidOf),
  ]).size;
  const appointments = apt.list.filter((x) => sameDay(x.at, TODAY) && x.status !== 'Cancelled').length;

  const plural = (n, one, many) => (n === 1 ? one : many);
  return [
    { key: 'followers', n: followers, post: ` New ${plural(followers, 'Follower', 'Followers')} Added Today` },
    { key: 'subscribers', n: subscribers, post: ` New ${plural(subscribers, 'Subscriber', 'Subscribers')} Added Today` },
    { key: 'appointments', n: appointments, post: ` ${plural(appointments, 'Appointment', 'Appointments')} Scheduled Today` },
  ];
}
