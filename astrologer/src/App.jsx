import Sidebar from '@/layout/Sidebar.jsx';
import BottomNav from '@/layout/BottomNav.jsx';
import HomeHeader from '@/layout/HomeHeader.jsx';
import EarningsCard from '@/components/home/EarningsCard.jsx';
import PeakDemandCard from '@/components/home/PeakDemandCard.jsx';
import TodaysWorkSection from '@/components/home/TodaysWorkSection.jsx';
import useHomeUi from '@/components/home/useHomeUi.jsx';
import RecentActivityCard from '@/components/home/RecentActivityCard.jsx';
import RecentReviewsCard from '@/components/home/RecentReviewsCard.jsx';
import useTheme from '@/hooks/useTheme.js';
import useAvailability from '@/hooks/useAvailability.js';
import useTextQuestions from '@/hooks/useTextQuestions.js';
import { TODAY, answeredToday } from '@/lib/textQuestions.js';
import useAppointments from '@/hooks/useAppointments.js';
import { useStore } from '@/lib/store.js';
import { notificationsStore, unreadCount } from '@/hooks/useNotifications.js';
import useMediaQuery from '@/hooks/useMediaQuery.js';
import { SECTION_KEYS, parseRoute, useHashPath } from '@/lib/router.js';
import WorkPage from '@/pages/WorkPage.jsx';
import SectionPage from '@/pages/SectionPage.jsx';
import { astrologer, earnings, peakDemand, recentActivity, quickActions } from '@/data/mockHome.js';

const dateLabel = new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
  .format(TODAY) // the prototype's fixed today, as in the reference (fD(TODAY))
  .replace(',', '');

// Astrologer app shell. Home: sticky header (logo, availability controls, date, theme, bell, logout),
// then the AD-02 sections in order; Availability (AD-02 #2) lives in the header.
// My Work → Text Questions, Appointments and their sub-pages render in WorkPage.
// Live, Earnings, Profile and the "More" pages render in SectionPage (pages/sections.js).
export default function App() {
  const { theme, toggle } = useTheme();
  const textQuestions = useTextQuestions();
  const availability = useAvailability(answeredToday(textQuestions.questions, 'text'));
  const appointments = useAppointments();
  const path = useHashPath();
  const route = parseRoute(path);
  const mobile = useMediaQuery('(max-width: 760px)'); // same breakpoint as the CSS mobile layout
  const unread = unreadCount(useStore(notificationsStore)); // bell badge on every page
  // Bottom-nav tab for each page (reference tabOf): Notifications and Recent Activity belong to Home.
  const tab = ['notifications', 'activity'].includes(route.page) ? 'home' : route.page;
  const home = useHomeUi(mobile); // Home's dialog (Planned Unavailability) and toasts

  return (
    <div className={`ac-app${route.page !== 'home' ? ' ac-app--work' : ''}`}>
      <Sidebar theme={theme} active={route.page} workView={route.page === 'work' && route.view !== 'hub' ? route.view : undefined} />
      {route.page === 'work' ? (
        <main className="ac-main tq">
          <WorkPage route={route} path={path} mobile={mobile} tq={textQuestions} apt={appointments} theme={theme} onToggleTheme={toggle} unread={unread} availability={availability} />
        </main>
      ) : SECTION_KEYS.includes(route.page) ? (
        <main className="ac-main tq">
          <SectionPage route={route} path={path} mobile={mobile} theme={theme} onToggleTheme={toggle} unread={unread} availability={availability}
            ctx={{ theme, onToggleTheme: toggle, availability, tq: textQuestions, apt: appointments, unread }} />
        </main>
      ) : (
        <main className="ac-main">
          <HomeHeader theme={theme} onToggleTheme={toggle} name={astrologer.firstName} initial={astrologer.initial} unread={unread} dateLabel={dateLabel}
            availability={availability} ui={home.ui} earnToday={earnings.today} actions={quickActions} />
          <TodaysWorkSection tq={textQuestions} apt={appointments} a={availability} />
          <div className="ac-grid ac-grid--single">
            <EarningsCard data={earnings} />
          </div>
          <div className="ac-grid ac-grid--single">
            <PeakDemandCard data={peakDemand} />
          </div>
          <div className="ac-grid ac-grid--pair">
            <RecentReviewsCard />
            <RecentActivityCard items={recentActivity} />
          </div>
          {home.node}
        </main>
      )}
      <BottomNav active={tab} />
    </div>
  );
}
