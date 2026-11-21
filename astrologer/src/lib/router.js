import { useEffect, useState } from 'react';

// Minimal hash router (no dependency). Routes:
//   #/                               Home
//   #/work                           My Work overview (desktop and phone)
//   #/work/questions[/:id[/answer | /timeline]]      Text-Based Questions list, details, answer editor, timeline
//   #/work/subscriptions[/:id[/answer | /timeline]]  Subscription Questions (same screens, category 'sub')
//   #/work/campaigns[/new | /open | /:campaignId]    Campaign Management, editor, Open Questions settings
//   #/work/templates | history
//   #/work/appointments[/calendar | /:id]  Appointments list, Calendar & Availability, details
//   #/<section>[/...]                Section pages (Live, Earnings, Profile and the "More" pages);
//                                    see SECTION_KEYS. The rest of the path is passed as `parts`.
const read = () => window.location.hash.replace(/^#/, '') || '/';

export function useHashPath() {
  const [path, setPath] = useState(read);
  useEffect(() => {
    const onChange = () => setPath(read());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return path;
}

export const navigate = (path) => {
  window.location.hash = path;
};

const WORK_VIEWS = ['questions', 'subscriptions', 'campaigns', 'templates', 'history', 'appointments'];

export const SECTION_KEYS = [
  'live', 'earnings', 'profile', 'calls', 'audience', 'reviews', 'content',
  'analytics', 'remedies', 'notifications', 'activity', 'settings', 'support',
];

export function parseRoute(path) {
  const parts = path.split('/').filter(Boolean);
  if (SECTION_KEYS.includes(parts[0])) return { page: parts[0], parts: parts.slice(1).map(decodeURIComponent) };
  if (parts[0] !== 'work') return { page: 'home' };
  const view = WORK_VIEWS.includes(parts[1]) ? parts[1] : 'hub';
  if (view === 'appointments') {
    const calendar = parts[2] === 'calendar';
    return { page: 'work', view, calendar, id: !calendar && parts[2] ? decodeURIComponent(parts[2]) : null, editor: false };
  }
  const qView = view === 'questions' || view === 'subscriptions';
  const sub = parts[3];
  return {
    page: 'work',
    view,
    cat: view === 'subscriptions' ? 'sub' : 'text',
    id: qView && parts[2] ? decodeURIComponent(parts[2]) : null,
    editor: qView && sub === 'answer',
    timeline: qView && sub === 'timeline',
    // Campaign Management sub-pages: 'new', 'open' (Open Questions settings) or a campaign id.
    camp: view === 'campaigns' && parts[2] ? decodeURIComponent(parts[2]) : null,
  };
}

export const routes = {
  home: '/',
  hub: '/work',
  list: '/work/questions',
  subs: '/work/subscriptions',
  listFor: (cat) => (cat === 'sub' ? '/work/subscriptions' : '/work/questions'),
  // Subscription Questions (SQ-…) open under #/work/subscriptions; #/work/questions/<SQ-id> also works.
  detail: (id) => `${String(id).startsWith('SQ-') ? '/work/subscriptions' : '/work/questions'}/${encodeURIComponent(id)}`,
  editor: (id) => `${String(id).startsWith('SQ-') ? '/work/subscriptions' : '/work/questions'}/${encodeURIComponent(id)}/answer`,
  timeline: (id) => `${String(id).startsWith('SQ-') ? '/work/subscriptions' : '/work/questions'}/${encodeURIComponent(id)}/timeline`,
  campaigns: '/work/campaigns',
  campNew: '/work/campaigns/new',
  campEdit: (id) => `/work/campaigns/${encodeURIComponent(id)}`,
  openSettings: '/work/campaigns/open',
  view: (v) => `/work/${v}`,
  appointments: '/work/appointments',
  aptDetail: (id) => `/work/appointments/${encodeURIComponent(id)}`,
  aptCalendar: '/work/appointments/calendar',
};
