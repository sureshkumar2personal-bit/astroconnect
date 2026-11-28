import { useCallback, useEffect, useRef, useState } from 'react';
import Icon from '../../components/icons.jsx';
import { href } from '../../router/useHashRoute.js';
import { assistantProfilePath, astrologerProfilePath } from '../../router/navigation.js';
import { getAssistant, loadAssistant } from '../../data/assistantsStore.js';
import { Avatar } from '../Users/components/UserBits.jsx';
import { AssistantStatus, RoleTag, TypeTag } from '../Assistants/components/AssistantBits.jsx';
import { d, dt } from '../UserProfile/components/ui.jsx';
import ProfileTab from './tabs/ProfileTab.jsx';
import PermissionsTab from './tabs/PermissionsTab.jsx';
import TasksTab from './tabs/TasksTab.jsx';
import ActivityTab from './tabs/ActivityTab.jsx';
import WalletTab from './tabs/WalletTab.jsx';
import AccountTab from './tabs/AccountTab.jsx';
import '../Users/UsersPage.css';
import '../Astrologers/AstrologersPage.css';
import '../Assistants/AssistantsPage.css';
import '../UserProfile/UserProfilePage.css';
import './AssistantProfilePage.css';

// People Management → Assistants → Assistant Profile. Six tabs, in order.
export const TABS = [
  { id: 'profile', label: 'Profile', Component: ProfileTab },
  { id: 'permissions', label: 'Permissions', Component: PermissionsTab },
  { id: 'tasks', label: 'Assigned Tasks', Component: TasksTab },
  { id: 'activity', label: 'Activity', Component: ActivityTab },
  { id: 'wallet', label: 'Wallet Access', Component: WalletTab },
  { id: 'account', label: 'Account', Component: AccountTab },
];

export default function AssistantProfilePage({ assistantId, initialTab, session }) {
  const [state, setState] = useState({ status: 'loading', assistant: null, message: '' });
  const [tab, setTab] = useState(() => (TABS.some((t) => t.id === initialTab) ? initialTab : 'profile'));
  const [toast, setToast] = useState(null);
  const timer = useRef(null);
  const tabRefs = useRef([]);

  const load = useCallback(() => {
    let cancelled = false;
    setState((s) => ({ ...s, status: 'loading' }));
    loadAssistant(assistantId).then(
      (assistant) => !cancelled && setState({ status: assistant ? 'ready' : 'missing', assistant, message: '' }),
      (err) => !cancelled && setState({ status: 'error', assistant: null, message: err.message })
    );
    return () => {
      cancelled = true;
    };
  }, [assistantId]);
  useEffect(() => load(), [load]);
  useEffect(() => () => clearTimeout(timer.current), []);
  const refresh = useCallback(() => setState((s) => ({ ...s, assistant: getAssistant(assistantId) })), [assistantId]);
  const notify = useCallback((tone, text) => {
    clearTimeout(timer.current);
    setToast({ tone, text });
    timer.current = setTimeout(() => setToast(null), 6000);
  }, []);
  function selectTab(id) {
    setTab(id);
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${href(assistantProfilePath(assistantId))}?tab=${id}`);
  }
  function onKey(e, i) {
    const last = TABS.length - 1;
    const next = e.key === 'ArrowRight' ? (i === last ? 0 : i + 1) : e.key === 'ArrowLeft' ? (i === 0 ? last : i - 1) : e.key === 'Home' ? 0 : e.key === 'End' ? last : null;
    if (next === null) return;
    e.preventDefault();
    selectTab(TABS[next].id);
    tabRefs.current[next]?.focus();
  }

  if (state.status === 'loading' && !state.assistant) {
    return (
      <div className="p-page" role="status" aria-label="Loading assistant profile">
        <div className="p-skeleton p-skeleton--header" />
        <div className="p-skeleton p-skeleton--body" />
      </div>
    );
  }
  if (state.status === 'error' || state.status === 'missing') {
    return (
      <div className="p-page">
        <div className={`u-state${state.status === 'error' ? ' u-state--error' : ''}`} role={state.status === 'error' ? 'alert' : undefined}>
          <Icon name={state.status === 'error' ? 'alert' : 'people'} size={22} />
          <p className="u-state__title">{state.status === 'error' ? 'Profile unavailable' : 'Assistant not found'}</p>
          <p className="u-state__text">{state.status === 'error' ? `${state.message} Please try again.` : `No assistant account exists with ID ${assistantId}.`}</p>
          {state.status === 'error' ? (
            <button type="button" className="u-btn" onClick={load}>
              Retry
            </button>
          ) : (
            <a className="u-btn" href={href('/people/assistants')}>
              Back to Assistants
            </a>
          )}
        </div>
      </div>
    );
  }

  const a = state.assistant;
  const Active = TABS.find((t) => t.id === tab).Component;
  return (
    <div className="p-page">
      <header className="p-header">
        <div className="p-header__nav">
          <nav aria-label="Breadcrumb" className="u-crumbs">
            <ol>
              <li>
                <a href={href('/dashboard')}>Dashboard</a>
              </li>
              <li>People Management</li>
              <li>
                <a href={href('/people/assistants')}>Assistants</a>
              </li>
              <li aria-current="page">Assistant Profile</li>
            </ol>
          </nav>
          <a className="u-btn p-back" href={href('/people/assistants')}>
            <Icon name="chevronLeft" size={16} />
            Back to Assistants
          </a>
        </div>
        <div className="p-summary">
          <div className="p-summary__identity">
            <Avatar user={a} size={72} />
            <div className="p-summary__name-block">
              <h1 className="p-summary__name">{a.name}</h1>
              <p className="p-summary__id">{a.id}</p>
              <div className="p-summary__badges">
                <AssistantStatus status={a.status} />
                <RoleTag role={a.role} />
                <TypeTag type={a.type} />
              </div>
            </div>
          </div>
          <dl className="p-summary__facts">
            <div>
              <dt>{a.type === 'Astrologer Assistant' ? 'Assigned Astrologer' : 'Departments'}</dt>
              <dd>{a.astrologer ? <a className="u-name" href={href(astrologerProfilePath(a.astrologer.id))}>{a.astrologer.name}</a> : a.departments.join(', ')}</dd>
            </div>
            <div>
              <dt>Email Address</dt>
              <dd className="p-break">{a.email}</dd>
            </div>
            <div>
              <dt>Created / Invited</dt>
              <dd>{d(a.invitedAt)}</dd>
            </div>
            <div>
              <dt>Last Active</dt>
              <dd>{dt(a.lastActiveAt)}</dd>
            </div>
          </dl>
        </div>
      </header>
      <div className="p-tabs-wrap">
        <div className="p-tabs" role="tablist" aria-label="Assistant profile sections">
          {TABS.map((t, i) => (
            <button
              key={t.id}
              ref={(el) => (tabRefs.current[i] = el)}
              type="button"
              role="tab"
              id={`stab-${t.id}`}
              aria-selected={tab === t.id}
              aria-controls="stab-panel"
              tabIndex={tab === t.id ? 0 : -1}
              className={`p-tab${tab === t.id ? ' is-active' : ''}`}
              onClick={() => selectTab(t.id)}
              onKeyDown={(e) => onKey(e, i)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div id="stab-panel" role="tabpanel" aria-labelledby={`stab-${tab}`} className="p-panel-body" tabIndex={-1}>
        <Active key={tab} assistant={a} session={session} refresh={refresh} notify={notify} />
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
