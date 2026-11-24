import useLive, { liveStore } from '@/hooks/useLive.js';
import LiveOverview from '@/components/live/LiveOverview.jsx';
import LiveRoom from '@/components/live/LiveRoom.jsx';
import LiveSummary from '@/components/live/LiveSummary.jsx';

// Live Sessions (spec 07_LIVE_SESSIONS.md). Routes:
//   #/live           overview (or the Live screen while a Live is running)
//   #/live/summary   post-Live summary
const isSummary = (route) => route.parts[0] === 'summary';

export function meta(route) {
  const s = liveStore.get();
  if (s.live) return { title: `Live now: ${s.live.topic}`, subtitle: `Audience: ${s.live.aud}` };
  if (isSummary(route)) return { title: 'Post-Live summary', subtitle: s.past[0]?.topic, parent: '/live' };
  // Back goes to the Home dashboard.
  return { title: 'Live Sessions', parent: '/' };
}

export default function LivePage({ route, ui }) {
  const s = useLive();
  if (s.live) return <LiveRoom live={s.live} ui={ui} />;
  if (isSummary(route)) return <LiveSummary last={s.past[0]} />;
  return <LiveOverview s={s} ui={ui} />;
}
