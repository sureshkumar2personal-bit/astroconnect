import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';
import AdminDashboard from '../pages/AdminDashboard/AdminDashboard.jsx';
import ModulePlaceholder from '../pages/ModulePlaceholder/ModulePlaceholder.jsx';
import UsersPage from '../pages/Users/UsersPage.jsx';
import UserProfilePage from '../pages/UserProfile/UserProfilePage.jsx';
// Astrologer screens load on demand to keep the initial bundle small.
const AstrologersPage = lazy(() => import('../pages/Astrologers/AstrologersPage.jsx'));
const AstrologerProfilePage = lazy(() => import('../pages/AstrologerProfile/AstrologerProfilePage.jsx'));
const AssistantsPage = lazy(() => import('../pages/Assistants/AssistantsPage.jsx'));
const AssistantProfilePage = lazy(() => import('../pages/AssistantProfile/AssistantProfilePage.jsx'));
const ServiceOverviewPage = lazy(() => import('../pages/Services/ServiceOverviewPage.jsx'));
const TextQuestionsPage = lazy(() => import('../pages/Services/TextQuestionsPage.jsx'));
const AppointmentsPage = lazy(() => import('../pages/Services/AppointmentsPage.jsx'));
const InstantSessionsPage = lazy(() => import('../pages/Services/InstantSessionsPage.jsx'));
const WalletOverviewPage = lazy(() => import('../pages/Finance/WalletOverviewPage.jsx'));
const TransactionsPage = lazy(() => import('../pages/Finance/TransactionsPage.jsx'));
const AstrologerEarningsPage = lazy(() => import('../pages/Finance/AstrologerEarningsPage.jsx'));
const PayoutRequestsPage = lazy(() => import('../pages/Finance/PayoutRequestsPage.jsx'));
const WalletAdjustmentsPage = lazy(() => import('../pages/Finance/WalletAdjustmentsPage.jsx'));
const ServiceRevenuePage = lazy(() => import('../pages/Finance/ServiceRevenuePage.jsx'));
const PlatformCommissionPage = lazy(() => import('../pages/Finance/PlatformCommissionPage.jsx'));
const SettlementsPage = lazy(() => import('../pages/Finance/SettlementsPage.jsx'));
const RefundsPage = lazy(() => import('../pages/Finance/RefundsPage.jsx'));
const DisputesPage = lazy(() => import('../pages/Services/DisputesPage.jsx'));
const TechnicalComplaintsPage = lazy(() => import('../pages/Operations/TechnicalComplaintsPage.jsx'));
const RatingsReviewsPage = lazy(() => import('../pages/Operations/RatingsReviewsPage.jsx'));
const RemediesPage = lazy(() => import('../pages/Operations/RemediesPage.jsx'));
const ContentManagementPage = lazy(() => import('../pages/Operations/ContentManagementPage.jsx'));
const AvailabilityPage = lazy(() => import('../pages/Operations/AvailabilityPage.jsx'));
const RecentActivityPage = lazy(() => import('../pages/Activity/RecentActivityPage.jsx'));
const DocumentManagementPage = lazy(() => import('../pages/Documents/DocumentManagementPage.jsx'));
const CommissionSettingsPage = lazy(() => import('../pages/Finance/CommissionSettingsPage.jsx'));
const FinancialReportsPage = lazy(() => import('../pages/Finance/FinancialReportsPage.jsx'));
import { loadAstrologerIndex } from '../data/astrologerIndex.js';
import { findRoute } from '../router/navigation.js';
import { useHashRoute } from '../router/useHashRoute.js';
import { useMediaQuery } from '../hooks/useMediaQuery.js';
import './AdminLayout.css';

const DRAWER_QUERY = '(max-width: 1023px)';

// Shared Platform Admin shell: sidebar, header and the routed page.
export default function AdminLayout({ session, onSignOut }) {
  const { path, params } = useHashRoute();
  const route = findRoute(path);
  const isDrawer = useMediaQuery(DRAWER_QUERY);
  const [navOpen, setNavOpen] = useState(false);
  const mainRef = useRef(null);
  const firstRender = useRef(true);
  const navId = 'admin-sidebar';

  const title = route?.label ?? 'Page not found';

  // On navigation: close the drawer, scroll to top and move focus to the page.
  useEffect(() => {
    document.title = `${title} · AstroConnect Admin`;
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setNavOpen(false);
    window.scrollTo(0, 0);
    mainRef.current?.focus({ preventScroll: true });
  }, [path, title]);

  useEffect(() => {
    if (!isDrawer) setNavOpen(false);
  }, [isDrawer]);

  // Build the astrologer rating / services summary in the background.
  useEffect(() => {
    const start = () => loadAstrologerIndex();
    const id = window.requestIdleCallback ? window.requestIdleCallback(start, { timeout: 2000 }) : setTimeout(start, 500);
    return () => (window.cancelIdleCallback ? window.cancelIdleCallback(id) : clearTimeout(id));
  }, []);

  function closeNav() {
    setNavOpen(false);
    // Return focus to the menu button once the drawer is gone.
    requestAnimationFrame(() => document.querySelector('.topbar__menu')?.focus());
  }

  useEffect(() => {
    if (!navOpen) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') closeNav();
    };
    document.addEventListener('keydown', onKey);
    document.querySelector(`#${navId} .nav__item`)?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [navOpen]);

  let page;
  if (path === '/dashboard') page = <AdminDashboard />;
  else if (path === '/people/users') page = <UsersPage session={session} />;
  else if (path === '/people/astrologers') page = <AstrologersPage session={session} />;
  else if (path === '/people/assistants') page = <AssistantsPage session={session} />;
  else if (path === '/services/overview') page = <ServiceOverviewPage />;
  else if (path === '/services/text-questions') page = <TextQuestionsPage />;
  else if (path === '/services/appointments') page = <AppointmentsPage />;
  else if (path === '/services/instant-call') page = <InstantSessionsPage key="call" type="Instant Call" session={session} />;
  else if (path === '/services/instant-chat') page = <InstantSessionsPage key="chat" type="Instant Chat" session={session} />;
  else if (path === '/finance/wallet-overview') page = <WalletOverviewPage />;
  else if (path === '/finance/user-wallet-deposits') page = <TransactionsPage key="deposits" mode="deposits" />;
  else if (path === '/finance/payment-transactions') page = <TransactionsPage key="all" mode="all" />;
  else if (path === '/finance/astrologer-earnings') page = <AstrologerEarningsPage />;
  else if (path === '/finance/payouts') page = <PayoutRequestsPage />;
  else if (path === '/finance/wallet-adjustments') page = <WalletAdjustmentsPage session={session} />;
  else if (path === '/finance/service-revenue') page = <ServiceRevenuePage />;
  else if (path === '/finance/platform-commission') page = <PlatformCommissionPage />;
  else if (path === '/finance/settlements') page = <SettlementsPage />;
  else if (path === '/operations/technical-complaints') page = <TechnicalComplaintsPage session={session} />;
  else if (path === '/operations/ratings-reviews') page = <RatingsReviewsPage />;
  else if (path === '/operations/remedies') page = <RemediesPage session={session} />;
  else if (path === '/operations/content') page = <ContentManagementPage session={session} />;
  else if (path === '/operations/availability') page = <AvailabilityPage />;
  else if (path === '/recent-activity') page = <RecentActivityPage />;
  else if (path === '/documents') page = <DocumentManagementPage />;
  else if (path === '/finance/commission-settings') page = <CommissionSettingsPage />;
  else if (path === '/finance/financial-reports') page = <FinancialReportsPage />;
  else if (path === '/finance/refunds') page = <RefundsPage key={params.get('ref') ?? ''} initialQuery={params.get('ref') ?? ''} />;
  else if (route?.navPath === '/services/disputes') page = <DisputesPage key={params.get('ref') ?? ''} session={session} initialQuery={params.get('ref') ?? ''} />;
  else if (route?.params?.assistantId) {
    page = <AssistantProfilePage key={`${route.params.assistantId}:${params.get('tab') ?? ''}`} assistantId={route.params.assistantId} initialTab={params.get('tab')} session={session} />;
  }
  else if (route?.params?.astrologerId) {
    page = (
      <AstrologerProfilePage
        key={`${route.params.astrologerId}:${params.get('tab') ?? ''}`}
        astrologerId={route.params.astrologerId}
        initialTab={params.get('tab')}
        session={session}
      />
    );
  } else if (route?.params?.userId) {
    page = (
      <UserProfilePage key={route.params.userId} userId={route.params.userId} initialTab={params.get('tab')} session={session} />
    );
  }
  else page = <ModulePlaceholder route={route} path={path} reference={params.get('ref')} />;

  return (
    <div className="shell">
      <a className="skip-link" href="#admin-main" onClick={(e) => {
        e.preventDefault();
        mainRef.current?.focus();
      }}>
        Skip to content
      </a>
      <Sidebar
        id={navId}
        path={path}
        isDrawer={isDrawer}
        isOpen={isDrawer && navOpen}
        onClose={closeNav}
      />
      {isDrawer && navOpen && (
        <div className="shell__scrim" aria-hidden="true" onClick={closeNav} />
      )}
      <div className="shell__main" inert={isDrawer && navOpen ? true : undefined}>
        <Header
          title={title}
          group={route?.group}
          session={session}
          onSignOut={onSignOut}
          navOpen={navOpen}
          navId={navId}
          onOpenNav={() => setNavOpen(true)}
        />
        <main id="admin-main" ref={mainRef} tabIndex={-1} className="content">
          <Suspense
            fallback={
              <div className="p-page" role="status" aria-label="Loading">
                <div className="p-skeleton p-skeleton--header" />
                <div className="p-skeleton p-skeleton--body" />
              </div>
            }
          >
            {page}
          </Suspense>
        </main>
      </div>
    </div>
  );
}
