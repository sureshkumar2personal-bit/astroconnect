import useLive, { liveStore } from '@/hooks/useLive.js';
import LiveHeader from '@/components/live/LiveHeader.jsx';
import LiveCreate from '@/components/live/LiveCreate.jsx';
import LiveHistory from '@/components/live/LiveHistory.jsx';
import LiveSettings from '@/components/live/LiveSettings.jsx';
import LiveRoom from '@/components/live/LiveRoom.jsx';
import LiveSummary from '@/components/live/LiveSummary.jsx';

// Live Sessions (spec 07_LIVE_SESSIONS.md; reference design "Live Sessions"). Routes:
//   #/live                  Create Live
//   #/live/history          Live History   (#/live/history/<id> opens that session's details)
//   #/live/settings         Live Settings
//   #/live/summary          post-Live summary
// While a Live is running the Live screen is shown instead.
const tabOf = (route) => (route.parts[0] === 'history' ? 'history' : route.parts[0] === 'settings' ? 'settings' : '');

export function meta(route) {
  const s = liveStore.get();
  if (s.live) return { title: `Live now: ${s.live.topic}`, subtitle: `Audience: ${s.live.aud}` };
  if (route.parts[0] === 'summary') return { title: 'Post-Live summary', subtitle: s.past[0]?.topic, parent: '/live' };
  // Back goes to the Home dashboard.
  return { title: 'Live Sessions', parent: '/' };
}

export default function LivePage({ route, ui }) {
  const s = useLive();
  if (s.live) return <LiveRoom live={s.live} ui={ui} settings={s.settings} />;
  if (route.parts[0] === 'summary') return <LiveSummary last={s.past[0]} />;
  const tab = tabOf(route);
  return (
    <div className="lv">
      <LiveHeader s={s} tab={tab} />
      {tab === 'history' ? <LiveHistory s={s} id={route.parts[1]} />
        : tab === 'settings' ? <LiveSettings s={s} />
          : <LiveCreate s={s} ui={ui} />}
    </div>
  );
}
