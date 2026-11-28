import { useCallback, useEffect, useRef, useState } from 'react';
import Icon from '../../components/icons.jsx';
import { href } from '../../router/useHashRoute.js';
import { astrologerProfilePath } from '../../router/navigation.js';
import { getAstrologerProfile, loadAstrologerProfile } from '../../data/astrologersStore.js';
import AstroHeader from './AstroHeader.jsx';
import ProfileTab from './tabs/ProfileTab.jsx';
import DocumentsTab from './tabs/DocumentsTab.jsx';
import WalletTab from './tabs/WalletTab.jsx';
import ServicesTab from './tabs/ServicesTab.jsx';
import FollowersTab from './tabs/FollowersTab.jsx';
import SubscriptionsTab from './tabs/SubscriptionsTab.jsx';
import RemediesTab from './tabs/RemediesTab.jsx';
import DisputesTab from './tabs/DisputesTab.jsx';
import ContentTab from './tabs/ContentTab.jsx';
import ReviewsTab from './tabs/ReviewsTab.jsx';
import AvailabilityTab from './tabs/AvailabilityTab.jsx';
import ActivityTab from './tabs/ActivityTab.jsx';
import AccountTab from './tabs/AccountTab.jsx';
import '../Users/UsersPage.css';
import '../Astrologers/AstrologersPage.css';
import '../UserProfile/UserProfilePage.css';
import './AstrologerProfilePage.css';

// People Management → Astrologers → Astrologer Profile
// (astrologer-management.md §3 – §16). Exactly thirteen tabs, in order.
export const TABS = [
  { id: 'profile', label: 'Profile', Component: ProfileTab },
  { id: 'documents', label: 'Documents & Verification', Component: DocumentsTab },
  { id: 'wallet', label: 'Wallet & Earnings', Component: WalletTab },
  { id: 'services', label: 'Services', Component: ServicesTab },
  { id: 'followers', label: 'Followers', Component: FollowersTab },
  { id: 'subscriptions', label: 'Subscriptions & Subscribers', Component: SubscriptionsTab },
  { id: 'remedies', label: 'Remedies', Component: RemediesTab },
  { id: 'disputes', label: 'Disputes & Complaints', Component: DisputesTab },
  { id: 'content', label: 'Content Management', Component: ContentTab },
  { id: 'reviews', label: 'Ratings & Reviews', Component: ReviewsTab },
  { id: 'availability', label: 'Availability & Schedule', Component: AvailabilityTab },
  { id: 'activity', label: 'Activity', Component: ActivityTab },
  { id: 'account', label: 'Account', Component: AccountTab },
];

export default function AstrologerProfilePage({ astrologerId, initialTab, session }) {
  const [state, setState] = useState({ status: 'loading', profile: null, message: '' });
  const [tab, setTab] = useState(() => (TABS.some((t) => t.id === initialTab) ? initialTab : 'profile'));
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);
  const tabRefs = useRef([]);

  const load = useCallback(() => {
    let cancelled = false;
    setState((s) => ({ ...s, status: 'loading' }));
    loadAstrologerProfile(astrologerId).then(
      (profile) => !cancelled && setState({ status: profile ? 'ready' : 'missing', profile, message: '' }),
      (err) => !cancelled && setState({ status: 'error', profile: null, message: err.message })
    );
    return () => {
      cancelled = true;
    };
  }, [astrologerId]);
  useEffect(() => load(), [load]);
  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const refresh = useCallback(() => setState((s) => ({ ...s, profile: getAstrologerProfile(astrologerId) })), [astrologerId]);
  const notify = useCallback((tone, text) => {
    clearTimeout(toastTimer.current);
    setToast({ tone, text });
    toastTimer.current = setTimeout(() => setToast(null), 6000);
  }, []);

  function selectTab(id) {
    setTab(id);
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${href(astrologerProfilePath(astrologerId))}?tab=${id}`);
  }

  function onTabKey(event, index) {
    const last = TABS.length - 1;
    let next = null;
    if (event.key === 'ArrowRight') next = index === last ? 0 : index + 1;
    if (event.key === 'ArrowLeft') next = index === 0 ? last : index - 1;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = last;
    if (next === null) return;
    event.preventDefault();
    selectTab(TABS[next].id);
    tabRefs.current[next]?.focus();
  }

  useEffect(() => {
    const el = tabRefs.current[TABS.findIndex((t) => t.id === tab)];
    const bar = el?.parentElement;
    if (!el || !bar) return;
    if (el.offsetLeft < bar.scrollLeft) bar.scrollLeft = el.offsetLeft - 12;
    else if (el.offsetLeft + el.offsetWidth > bar.scrollLeft + bar.clientWidth) bar.scrollLeft = el.offsetLeft + el.offsetWidth - bar.clientWidth + 12;
  }, [tab, state.status]);

  if (state.status === 'loading' && !state.profile) {
    return (
      <div className="p-page" role="status" aria-label="Loading astrologer profile">
        <div className="p-skeleton p-skeleton--header" />
        <div className="p-skeleton p-skeleton--tabs" />
        <div className="p-skeleton p-skeleton--body" />
      </div>
    );
  }
  if (state.status === 'error') {
    return (
      <div className="p-page">
        <div className="u-state u-state--error" role="alert">
          <Icon name="alert" size={22} />
          <p className="u-state__title">Profile unavailable</p>
          <p className="u-state__text">{state.message} Please try again.</p>
          <button type="button" className="u-btn" onClick={load}>
            <Icon name="refresh" size={16} />
            Retry
          </button>
        </div>
      </div>
    );
  }
  if (state.status === 'missing') {
    return (
      <div className="p-page">
        <div className="u-state">
          <Icon name="people" size={22} />
          <p className="u-state__title">Astrologer not found</p>
          <p className="u-state__text">
            No astrologer account exists with ID <strong>{astrologerId}</strong>.
          </p>
          <a className="u-btn" href={href('/people/astrologers')}>
            <Icon name="chevronLeft" size={16} />
            Back to Astrologers
          </a>
        </div>
      </div>
    );
  }

  const { profile } = state;
  const Active = TABS.find((t) => t.id === tab).Component;
  return (
    <div className="p-page a-profile">
      <AstroHeader astrologer={profile.astrologer} rating={profile.rating} reviewCount={profile.publishedCount} />
      <div className="p-tabs-wrap">
        <div className="p-tabs" role="tablist" aria-label="Astrologer profile sections">
          {TABS.map((t, i) => (
            <button
              key={t.id}
              ref={(el) => (tabRefs.current[i] = el)}
              type="button"
              role="tab"
              id={`atab-${t.id}`}
              aria-selected={tab === t.id}
              aria-controls="atab-panel"
              tabIndex={tab === t.id ? 0 : -1}
              className={`p-tab${tab === t.id ? ' is-active' : ''}`}
              onClick={() => selectTab(t.id)}
              onKeyDown={(e) => onTabKey(e, i)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div id="atab-panel" role="tabpanel" aria-labelledby={`atab-${tab}`} className="p-panel-body" tabIndex={-1}>
        <Active key={tab} profile={profile} session={session} refresh={refresh} notify={notify} goToTab={selectTab} />
      </div>
      <div className="u-toast-region" aria-live="polite" role="status">
        {toast && (
          <div className={`u-toast u-toast--${toast.tone}`}>
            <Icon name={toast.tone === 'success' ? 'check' : 'alert'} size={18} />
            <span>{toast.text}</span>
            <button type="button" className="u-toast__close" aria-label="Dismiss" onClick={() => setToast(null)}>
              <Icon name="close" size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
