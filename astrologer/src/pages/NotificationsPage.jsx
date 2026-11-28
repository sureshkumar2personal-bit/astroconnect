import { useMemo, useRef, useState } from 'react';
import useNotifications, { AF0, NF0, notificationActions } from '@/hooks/useNotifications.js';
import { activitySeed } from '@/data/mockActivity.js';
import { dt } from '@/lib/format.js';
import NotificationFilters, { Empty, Pager, PER, ReadToggle, inDate } from '@/components/notifications/NotificationFilters.jsx';
import NotificationItem, { ACATS, GROUPS, NCATS, activityCat, groupOf, refOf, whoOf } from '@/components/notifications/NotificationItem.jsx';
import ActivityItem from '@/components/activity/ActivityItem.jsx';

// Notification & Activity (spec 14_NOTIFICATIONS_AND_REMINDERS.md, AD-148 – AD-151; Recent Activity AD-20).
// Routes: #/notifications (Notifications tab) and #/activity (My Activity tab, opened from Home's "View All").
// Filters are kept when returning from a detail page (§5.1). Preferences live in Settings (AD-150, AD-153).

export function meta() {
  // Back goes to the Home dashboard.
  return { title: 'Notification & Activity', parent: '/' };
}

const byNewest = (x, y) => y.at.localeCompare(x.at);
const catLabel = (cats, k) => (cats.find((c) => c.k === k) || {}).label || '';
const matchQ = (e, q) => {
  if (!q) return true;
  const t = q.trim().toLowerCase();
  return [e.title, e.text, e.who, e.ref, e.catLabel].some((v) => v && v.toLowerCase().includes(t));
};

function Grouped({ items, children }) {
  return GROUPS.map((g) => [g, items.filter((e) => groupOf(dt(e.at)) === g)]).filter(([, l]) => l.length).map(([g, l]) => (
    <section key={g} className="nc-grp" aria-label={g}>
      <h3 className="nc-grp__h">{g}<span>{l.length}</span></h3>
      {l.map(children)}
    </section>
  ));
}

function NotificationsTab({ s, top }) {
  const f = s.nf;
  const set = notificationActions.setNf;
  const items = useMemo(() => s.list
    .map((n) => ({ ...n, who: whoOf(n.text), catLabel: catLabel(NCATS, n.cat) }))
    .filter((e) => (f.read === 'all' ? true : f.read === 'unread' ? !e.read : e.read))
    .filter((e) => !f.cat || e.cat === f.cat)
    .filter((e) => inDate(dt(e.at), f))
    .filter((e) => matchQ(e, f.q))
    .sort(byNewest), [s.list, f]);
  const pages = Math.max(1, Math.ceil(items.length / PER));
  const page = Math.min(f.page, pages);
  const slice = items.slice((page - 1) * PER, page * PER);
  const filtering = f.q || f.cat || f.date !== 'any';

  let body;
  if (!s.list.length) body = <Empty icon="inbox" title="You’re all caught up!" text="New notifications will appear here when you receive updates." />;
  else if (!items.length && f.read === 'unread' && !filtering) {
    body = <Empty icon="checks" title="You’re all caught up!" text="You have no unread notifications. New ones will appear here when you receive updates."
      action={<button type="button" className="nc-text-btn" onClick={() => set({ read: 'all' })}>Show all notifications</button>} />;
  } else if (!items.length) {
    body = <Empty icon="search" title="No matching notifications" text="Try another search term, category or date."
      action={<button type="button" className="nc-text-btn" onClick={() => set({ ...NF0 })}>Clear filters</button>} />;
  } else {
    body = (
      <>
        <Grouped items={slice}>{(e) => <NotificationItem key={e.id} n={e} focused={s.focus === e.id} onOpen={notificationActions.markRead} />}</Grouped>
        <Pager page={page} total={items.length} onPage={(p) => { set({ page: p }); top.current?.scrollIntoView({ block: 'start' }); }} />
      </>
    );
  }
  return (
    <div role="tabpanel" id="panel-notifications" aria-labelledby="tab-notifications">
      <NotificationFilters f={f} set={set} cats={NCATS} allLabel="All Categories" searchLabel="Search notifications" placeholder="Search notifications">
        <span className="nc-spacer" />
        <ReadToggle value={f.read} onChange={(read) => set({ read })} />
      </NotificationFilters>
      {body}
    </div>
  );
}

function ActivityTab({ s, top }) {
  const f = s.af;
  const set = notificationActions.setAf;
  const items = useMemo(() => activitySeed
    .map((a) => ({ ...a, cat: activityCat(a), ref: refOf(a.href), catLabel: catLabel(ACATS, activityCat(a)) || 'Activity' }))
    .filter((e) => !f.cat || e.cat === f.cat)
    .filter((e) => inDate(dt(e.at), f))
    .filter((e) => matchQ(e, f.q))
    .sort(byNewest), [f]);
  const pages = Math.max(1, Math.ceil(items.length / PER));
  const page = Math.min(f.page, pages);
  const slice = items.slice((page - 1) * PER, page * PER);

  let body;
  if (!activitySeed.length) body = <Empty icon="history" title="No activity recorded yet." text="Your completed work and important actions will appear here." />;
  else if (!items.length) {
    body = <Empty icon="search" title="No matching activity" text="Try another title, customer name, reference ID, category or date."
      action={<button type="button" className="nc-text-btn" onClick={() => set({ ...AF0 })}>Clear filters</button>} />;
  } else {
    body = (
      <>
        <Grouped items={slice}>{(e) => <ActivityItem key={e.id} a={e} focused={s.focus === e.id} />}</Grouped>
        <Pager page={page} total={items.length} onPage={(p) => { set({ page: p }); top.current?.scrollIntoView({ block: 'start' }); }} />
      </>
    );
  }
  return (
    <div role="tabpanel" id="panel-activity" aria-labelledby="tab-activity">
      <NotificationFilters f={f} set={set} cats={ACATS} allLabel="All Activities" searchLabel="Search activity" placeholder="Search by title, customer or ID" />
      {body}
    </div>
  );
}

export function NotificationCenter({ initialTab }) {
  const s = useNotifications();
  const [tab, setTab] = useState(initialTab);
  const top = useRef(null);
  const unread = s.list.filter((x) => !x.read).length;
  const tabs = [['notifications', 'Notifications'], ['activity', 'My Activity']];
  const onKey = (ev) => {
    if (ev.key !== 'ArrowRight' && ev.key !== 'ArrowLeft') return;
    const next = tab === 'notifications' ? 'activity' : 'notifications';
    setTab(next);
    setTimeout(() => document.getElementById(`tab-${next}`)?.focus(), 0);
  };
  return (
    <div className="nc" ref={top}>
      <div className="nc-tabs" role="tablist" aria-label="Notifications and activity" onKeyDown={onKey}>
        {tabs.map(([k, l]) => (
          <button key={k} id={`tab-${k}`} type="button" role="tab" aria-selected={tab === k} aria-controls={`panel-${k}`} tabIndex={tab === k ? 0 : -1} className="nc-tab" onClick={() => setTab(k)}>
            {l}
            {k === 'notifications' && unread > 0 && <span className="nc-cnt" aria-label={`${unread} unread`}>{unread}</span>}
          </button>
        ))}
      </div>
      {tab === 'notifications' ? <NotificationsTab s={s} top={top} /> : <ActivityTab s={s} top={top} />}
    </div>
  );
}

export default function NotificationsPage() {
  return <NotificationCenter initialTab="notifications" />;
}
