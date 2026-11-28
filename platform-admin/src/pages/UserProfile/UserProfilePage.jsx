import { useCallback, useEffect, useRef, useState } from 'react';
import Icon from '../../components/icons.jsx';
import { href } from '../../router/useHashRoute.js';
import { userProfilePath } from '../../router/navigation.js';
import { loadProfile, getProfile } from '../../data/profileStore.js';
import ProfileHeader from './ProfileHeader.jsx';
import ProfileTab from './tabs/ProfileTab.jsx';
import WalletTab from './tabs/WalletTab.jsx';
import ServicesTab from './tabs/ServicesTab.jsx';
import FollowingTab from './tabs/FollowingTab.jsx';
import SubscriptionsTab from './tabs/SubscriptionsTab.jsx';
import RemediesTab from './tabs/RemediesTab.jsx';
import DisputesTab from './tabs/DisputesTab.jsx';
import ActivityTab from './tabs/ActivityTab.jsx';
import AccountTab from './tabs/AccountTab.jsx';
import '../Users/UsersPage.css';
import './UserProfilePage.css';

// People Management → Users → User Profile
// (docs/03-platform-admin/04-people-management/user-management.md §3 – §12).
// Exactly nine tabs, in the documented order.
export const TABS = [
  { id: 'profile', label: 'Profile', Component: ProfileTab },
  { id: 'wallet', label: 'Wallet', Component: WalletTab },
  { id: 'services', label: 'Services', Component: ServicesTab },
  { id: 'following', label: 'Following', Component: FollowingTab },
  { id: 'subscriptions', label: 'Subscriptions', Component: SubscriptionsTab },
  { id: 'remedies', label: 'Remedies', Component: RemediesTab },
  { id: 'disputes', label: 'Disputes', Component: DisputesTab },
  { id: 'activity', label: 'Activity', Component: ActivityTab },
  { id: 'account', label: 'Account', Component: AccountTab },
];

export default function UserProfilePage({ userId, initialTab, session }) {
  const [state, setState] = useState({ status: 'loading', profile: null, message: '' });
  const [tab, setTab] = useState(() => (TABS.some((t) => t.id === initialTab) ? initialTab : 'profile'));
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);
  const tabRefs = useRef([]);

  const load = useCallback(() => {
    let cancelled = false;
    setState((s) => ({ ...s, status: 'loading' }));
    loadProfile(userId).then(
      (profile) => !cancelled && setState({ status: profile ? 'ready' : 'missing', profile, message: '' }),
      (err) => !cancelled && setState({ status: 'error', profile: null, message: err.message })
    );
    return () => {
      cancelled = true;
    };
  }, [userId]);

  useEffect(() => load(), [load]);
  useEffect(() => () => clearTimeout(toastTimer.current), []);

  /** Re-read the profile after a change (status, note, adjustment). */
  const refresh = useCallback(() => {
    setState((s) => ({ ...s, profile: getProfile(userId) }));
  }, [userId]);

  const notify = useCallback((tone, text) => {
    clearTimeout(toastTimer.current);
    setToast({ tone, text });
    toastTimer.current = setTimeout(() => setToast(null), 6000);
  }, []);

  function selectTab(id) {
    setTab(id);
    // Keep the tab in the address so refresh and shared links reopen it.
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${href(userProfilePath(userId))}?tab=${id}`);
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
    // Keep the active tab visible in the horizontally scrolling tab bar
    // (without scrolling the page vertically).
    const el = tabRefs.current[TABS.findIndex((t) => t.id === tab)];
    const bar = el?.parentElement;
    if (!el || !bar) return;
    if (el.offsetLeft < bar.scrollLeft) bar.scrollLeft = el.offsetLeft - 12;
    else if (el.offsetLeft + el.offsetWidth > bar.scrollLeft + bar.clientWidth) {
      bar.scrollLeft = el.offsetLeft + el.offsetWidth - bar.clientWidth + 12;
    }
  }, [tab]);

  if (state.status === 'loading' && !state.profile) {
    return (
      <div className="p-page" role="status" aria-label="Loading user profile">
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
          <p className="u-state__title">User not found</p>
          <p className="u-state__text">
            No user account exists with ID <strong>{userId}</strong>.
          </p>
          <a className="u-btn" href={href('/people/users')}>
            <Icon name="chevronLeft" size={16} />
            Back to Users
          </a>
        </div>
      </div>
    );
  }

  const { profile } = state;
  const Active = TABS.find((t) => t.id === tab).Component;

  return (
    <div className="p-page">
      <ProfileHeader user={profile.user} />

      <div className="p-tabs-wrap">
        <div className="p-tabs" role="tablist" aria-label="User profile sections">
          {TABS.map((t, i) => (
            <button
              key={t.id}
              ref={(el) => (tabRefs.current[i] = el)}
              type="button"
              role="tab"
              id={`ptab-${t.id}`}
              aria-selected={tab === t.id}
              aria-controls="ptab-panel"
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

      <div id="ptab-panel" role="tabpanel" aria-labelledby={`ptab-${tab}`} className="p-panel-body" tabIndex={-1}>
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
