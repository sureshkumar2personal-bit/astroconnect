import { activitySeed } from '@/data/mockActivity.js';
import { Sec } from '@/components/ui/sectionKit.jsx';
import ActivityItem from '@/components/activity/ActivityItem.jsx';

// Recent Activity — the dedicated tab opened from Home's Recent Activity "View All"
// (spec 01_HOME_SCREEN.md AD-20; not a bottom-navigation tab, AD-03). Route: #/activity.

export const meta = () => ({ title: 'Recent Activity', subtitle: 'Everything that happened recently', parent: '/' });

export default function ActivityPage() {
  return (
    <Sec>
      {activitySeed.map((a) => <ActivityItem key={a.id} a={a} />)}
    </Sec>
  );
}
