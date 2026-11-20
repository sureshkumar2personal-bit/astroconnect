import Sidebar from './layout/Sidebar.jsx';
import BottomNav from './layout/BottomNav.jsx';
import HomeHeader from './layout/HomeHeader.jsx';
import AvailabilityCard from './components/home/AvailabilityCard.jsx';
import EarningsCard from './components/home/EarningsCard.jsx';
import PeakDemandCard from './components/home/PeakDemandCard.jsx';
import TodaysWorkCard from './components/home/TodaysWorkCard.jsx';
import RecentActivityCard from './components/home/RecentActivityCard.jsx';
import QuickActionsCard from './components/home/QuickActionsCard.jsx';
import useTheme from '@shared/hooks/useTheme.js';
import useAvailability from '@shared/hooks/useAvailability.js';
import useTextQuestions from '@shared/hooks/useTextQuestions.js';
import useMediaQuery from '@shared/hooks/useMediaQuery.js';
import { parseRoute, useHashPath } from '@shared/lib/router.js';
import WorkPage from './pages/WorkPage.jsx';
import { themeAssets } from '@shared/config/themeAssets.js';
import { astrologer, notifications, earnings, peakDemand, todaysWork, recentActivity, quickActions } from '@shared/data/mockHome.js';

const dateLabel = new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
  .format(new Date())
  .replace(',', '');

// Astrologer app shell. Home: the seven sections in the order of AD-02.
// My Work → Text Questions and its sub-pages render in WorkPage.
export default function App() {
  const { theme, toggle } = useTheme();
  const availability = useAvailability(todaysWork.answeredToday);
  const textQuestions = useTextQuestions();
  const path = useHashPath();
  const route = parseRoute(path);
  const mobile = useMediaQuery('(max-width: 760px)'); // same breakpoint as the CSS mobile layout

  const assets = themeAssets[theme];
  const appVars = {
    '--art': `url("${assets.art}")`,
    '--bg-img': assets.bg ? `url("${assets.bg}")` : 'none',
    '--bg-img-mobile': `url("${assets.bgMobile}")`,
  };

  return (
    <div className={`ac-app${route.page === 'work' ? ' ac-app--work' : ''}`} style={appVars}>
      <Sidebar theme={theme} active={route.page} workView={route.page === 'work' ? (route.view === 'hub' ? 'questions' : route.view) : undefined} />
      {route.page === 'work' ? (
        <main className="ac-main tq">
          <WorkPage route={route} path={path} mobile={mobile} tq={textQuestions} theme={theme} onToggleTheme={toggle} unread={notifications.unread} availability={availability} />
        </main>
      ) : (
        <main className="ac-main">
          <HomeHeader theme={theme} onToggleTheme={toggle} name={astrologer.firstName} initial={astrologer.initial} unread={notifications.unread} dateLabel={dateLabel} />
          <div className="ac-grid">
            <AvailabilityCard a={availability} />
            <EarningsCard data={earnings} />
            <PeakDemandCard data={peakDemand} />
          </div>
          <div className="ac-grid">
            <TodaysWorkCard work={todaysWork} a={availability} />
            <RecentActivityCard items={recentActivity} />
            <QuickActionsCard actions={quickActions} />
          </div>
        </main>
      )}
      <BottomNav active={route.page} />
    </div>
  );
}
