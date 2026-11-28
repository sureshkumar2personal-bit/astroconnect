import { useEffect, useRef } from 'react';
import Icon from '@/components/ui/Icon.jsx';
import { NCAT } from '@/data/mockNotifications.js';
import { notificationActions } from '@/hooks/useNotifications.js';
import { TODAY, dt } from '@/lib/format.js';
import { Ic, dayDiff } from './NotificationFilters.jsx';

// One Notification & Activity row (reference "Notifications & Activity prototype"): unread dot, coloured category
// icon, title, text, who / category / reference, time and a mark read / unread button (AD-149).
// The row links to the exact related detail page; opening a notification marks it Read.

// Category → colour tone (mapped to the theme's status tokens in the stylesheet) and icon.
const NTONE = { A: 'gold', B: 'teal', C: 'navy', D: 'teal', E: 'plum', F: 'rose', G: 'green', H: 'red', I: 'navy' };
const NICON = { A: 'userPlus', B: 'chat', C: 'calendar', D: 'phone', E: 'file', F: 'live', G: 'coins', H: 'alert', I: 'headset' };
export const NCATS = Object.entries(NCAT).map(([k, label]) => ({ k, label, tone: NTONE[k], icon: NICON[k] }));

// My Activity categories (the activity feed has no category field: it is derived from the related page).
export const ACATS = [
  { k: 'tq', label: 'Text Questions', tone: 'teal' },
  { k: 'apt', label: 'Appointments', tone: 'navy' },
  { k: 'calls', label: 'Instant Call & Chat', tone: 'teal' },
  { k: 'content', label: 'Content', tone: 'plum' },
  { k: 'live', label: 'Live', tone: 'rose' },
  { k: 'review', label: 'Ratings & Reviews', tone: 'gold' },
  { k: 'remedy', label: 'Remedy Tracker', tone: 'green' },
  { k: 'audience', label: 'Audience', tone: 'gold' },
];
const AROUTE = [['/work/questions', 'tq'], ['/work/appointments', 'apt'], ['/calls', 'calls'], ['/content', 'content'], ['/live', 'live'], ['/reviews', 'review'], ['/remedies', 'remedy'], ['/audience', 'audience']];
export const activityCat = (a) => (AROUTE.find(([p]) => a.href.startsWith(p)) || [])[1] || '';
/** Reference ID taken from the related page link, e.g. /work/questions/TQ-98275 → TQ-98275. */
export const refOf = (href) => { const last = href.split('/').pop(); return /^[A-Z]{1,4}-\d+$/.test(last) ? last : ''; };
/** Customer name when the text starts with one, e.g. "Rahul K. raised a dispute…". */
export const whoOf = (text) => (text.match(/^([A-Z][a-z]+ [A-Z]\.)(?=\s)/) || [])[1] || '';

const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const SINCE_MON = (TODAY.getDay() + 6) % 7;
const clock = (d) => { let h = d.getHours(); const ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12; return `${h}:${String(d.getMinutes()).padStart(2, '0')} ${ap}`; };
export const GROUPS = ['Today', 'Yesterday', 'Earlier This Week', 'Older'];
export function groupOf(d) { const n = dayDiff(d); if (n <= 0) return 'Today'; if (n === 1) return 'Yesterday'; if (n <= SINCE_MON) return 'Earlier This Week'; return 'Older'; }
export function whenLabel(d) {
  const g = groupOf(d);
  if (g === 'Today' || g === 'Yesterday') return clock(d);
  if (g === 'Earlier This Week') return `${WD[d.getDay()]}, ${clock(d)}`;
  return `${d.getDate()} ${MON[d.getMonth()]}, ${clock(d)}`;
}

/** Shared row for both tabs. `e` = { id, title, text, at, href, icon, tone, catLabel, who, ref, read?, security? }. */
export function EntryRow({ e, focused, onOpen }) {
  const ref = useRef(null);
  const isNotif = typeof e.read === 'boolean';
  const unread = isNotif && !e.read;
  useEffect(() => {
    if (!focused || !ref.current) return;
    ref.current.scrollIntoView({ block: 'center' });
    ref.current.querySelector('.nc-row__main')?.focus({ preventScroll: true });
    notificationActions.setFocus(null);
  }, [focused]);
  const when = whenLabel(dt(e.at));
  return (
    <div ref={ref} className={`nc-row${unread ? ' is-unread' : ''}`}>
      <a className="nc-row__main" href={`#${e.href}`} onClick={() => { notificationActions.setFocus(e.id); onOpen(e.id); }}
        aria-label={`${unread ? 'Unread. ' : ''}${e.title}. ${e.text}. ${e.who ? `${e.who}. ` : ''}${e.catLabel}. ${when}`}>
        <span className="nc-dot" aria-hidden="true" />
        <span className={`nc-ic t-${e.tone}`}><Icon name={e.icon} size={19} stroke={1.8} /></span>
        <span className="nc-txt">
          <span className="nc-title">{e.title}</span>
          <span className="nc-desc">{e.text}</span>
          <span className="nc-meta">
            {e.who && <span className="nc-who">{e.who}</span>}
            <span className="nc-cat">{e.catLabel}</span>
            {e.security && <span className="nc-cat nc-sec">Security alert</span>}
            {!isNotif && e.ref && <span className="nc-ref">{e.ref}</span>}
          </span>
        </span>
      </a>
      <div className="nc-side">
        <time className="nc-time" dateTime={e.at}>{when}</time>
        {isNotif && (
          <button type="button" className="nc-icon-btn" title={unread ? 'Mark as read' : 'Mark as unread'}
            aria-label={`${unread ? 'Mark as read' : 'Mark as unread'}: ${e.title}`}
            onClick={() => notificationActions.setRead(e.id, unread)}>
            <Ic n={unread ? 'mailOpen' : 'mail'} size={17} />
          </button>
        )}
      </div>
    </div>
  );
}

export default function NotificationItem({ n, focused, onOpen }) {
  const c = NCATS.find((x) => x.k === n.cat);
  return <EntryRow focused={focused} onOpen={onOpen} e={{ ...n, icon: c.icon, tone: c.tone, catLabel: c.label, who: whoOf(n.text) }} />;
}
