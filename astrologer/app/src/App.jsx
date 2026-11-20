import Sidebar from './components/Sidebar.jsx';
import BottomNav from './components/BottomNav.jsx';
import HomeHeader from './components/HomeHeader.jsx';
import AvailabilityCard from './components/AvailabilityCard.jsx';
import EarningsCard from './components/EarningsCard.jsx';
import PeakDemandCard from './components/PeakDemandCard.jsx';
import TodaysWorkCard from './components/TodaysWorkCard.jsx';
import RecentActivityCard from './components/RecentActivityCard.jsx';
import QuickActionsCard from './components/QuickActionsCard.jsx';
import useTheme from './hooks/useTheme.js';
import useAvailability from './hooks/useAvailability.js';
import { themeAssets } from './data/assets.js';
import { astrologer, notifications, earnings, peakDemand, todaysWork, recentActivity, quickActions } from './data/mockHome.js';

const dateLabel = new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
  .format(new Date())
  .replace(',', '');

// Astrologer Home: the seven sections in the order of AD-02.
export default function App() {
  const { theme, toggle } = useTheme();
  const availability = useAvailability(todaysWork.answeredToday);

  const assets = themeAssets[theme];
  const appVars = {
    '--art': `url("${assets.art}")`,
    '--bg-img': assets.bg ? `url("${assets.bg}")` : 'none',
    '--bg-img-mobile': `url("${assets.bgMobile}")`,
  };

  return (
    <div className="ac-app" style={appVars}>
      <Sidebar theme={theme} />
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
      <BottomNav />
    </div>
  );
}
