import { ACATS, EntryRow, activityCat, refOf } from '@/components/notifications/NotificationItem.jsx';

// One My Activity row (AD-20): icon, short description, category, reference and time; links to the related detail page.
export default function ActivityItem({ a, focused }) {
  const c = ACATS.find((x) => x.k === activityCat(a));
  return <EntryRow focused={focused} onOpen={() => {}} e={{ ...a, tone: c ? c.tone : 'gold', catLabel: c ? c.label : 'Activity', ref: refOf(a.href) }} />;
}
