import { useMemo, useState } from 'react';
import { ACTIVITY_CATEGORIES, activitiesForMonth, activityMonths, loadActivitySources } from '../../data/activityLog.js';
import { formatNumber } from '../../components/charts/chartUtils.js';
import { DataTable, DetailPanel, Empty, FilterBar, Fields, Pill, SearchFilter, Section, SelectFilter, ViewButton, dt, monthLabel, usePaged } from '../UserProfile/components/ui.jsx';
import { ErrorState, ExportPair, LoadingState, PageHead, useToast } from '../Services/components/ServiceBits.jsx';
import { iso, useLoaded } from '../Finance/components/FinanceBits.jsx';
import { href } from '../../router/useHashRoute.js';
import { assistantProfilePath, astrologerProfilePath, userProfilePath } from '../../router/navigation.js';
import '../Users/UsersPage.css';
import '../UserProfile/UserProfilePage.css';
import '../Services/ServicesPage.css';

const SORTS = [
  ['desc', 'Newest first'],
  ['asc', 'Oldest first'],
];
const actorText = (a) => `${a.actor?.name ?? '—'}${a.actor?.role ? ` (${a.actor.role})` : ''}`;
const related = (a) => [a.userId, a.astroId, a.assistantId].filter(Boolean).join(', ');

// Recent Activity (12-recent-activity-history.md): the full platform activity
// history, one month at a time, with category filter, search (Activity ID,
// User ID, Astrologer ID), details and PDF / Excel export. Built only from
// existing records and saved audit logs; audit history is never deleted.
export default function RecentActivityPage() {
  const state = useLoaded(loadActivitySources);
  const months = useMemo(() => (state.data ? activityMonths(state.data) : []), [state.data]);
  const [month, setMonth] = useState(null);
  const current = month ?? months[0];
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('desc');
  const [open, setOpen] = useState(null);
  const [notify, toastNode] = useToast();

  const monthRows = useMemo(() => (state.data && current ? activitiesForMonth(state.data, current) : []), [state.data, current]);
  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = monthRows.filter(
      (a) => (category === 'all' || a.category === category) && (!q || [a.id, a.userId ?? '', a.astroId ?? '', a.assistantId ?? '', a.ref ?? ''].some((v) => v.toLowerCase().includes(q)))
    );
    return sort === 'asc' ? [...list].reverse() : list;
  }, [monthRows, category, query, sort]);
  const paged = usePaged(rows, 10, `${current}|${category}|${query}|${sort}`);
  const counts = useMemo(() => ACTIVITY_CATEGORIES.map((c) => [c, monthRows.filter((a) => a.category === c).length]), [monthRows]);

  const columns = [
    { header: 'Activity ID', value: (a) => a.id, width: 26 },
    { header: 'Category', value: (a) => a.category, width: 22 },
    { header: 'Activity Type', value: (a) => a.type, width: 24 },
    { header: 'Actor', value: actorText, width: 28 },
    { header: 'Related User / Astrologer / Assistant ID', value: related, width: 26 },
    { header: 'Related Service / Transaction ID', value: (a) => a.ref ?? '', width: 26 },
    { header: 'Date / Time', value: (a) => dt(iso(a.at)), width: 20 },
    { header: 'Description', value: (a) => a.description, width: 50 },
    { header: 'Previous Value', value: (a) => a.prev ?? '', width: 18 },
    { header: 'New Value', value: (a) => a.next ?? '', width: 18 },
  ];

  return (
    <div className="users services">
      <PageHead section={null} title="Recent Activity" subtitle="Full activity history across users, astrologers, assistants, services, payments, wallet, settlements, refunds, disputes and Admin actions." />
      {state.status === 'loading' && <LoadingState label="Loading activity history" />}
      {state.status === 'error' && <ErrorState message={state.message} />}
      {state.status === 'ready' && (
        <Section
          id="ra-list"
          title={`Activity — ${monthLabel(current)}`}
          description={counts.filter(([, n]) => n).map(([c, n]) => `${c.replace(' activities', '')} ${formatNumber(n)}`).join(' · ')}
          actions={<ExportPair title={`Recent Activity — ${monthLabel(current)}`} columns={columns} rows={rows} fileBase={`astroconnect-activity-${current}`} notify={notify} />}
        >
          <FilterBar canClear={category !== 'all' || query !== ''} onClear={() => { setCategory('all'); setQuery(''); }}>
            <SelectFilter label="Month" value={current} onChange={setMonth} options={months.map((m) => [m, monthLabel(m)])} />
            <SelectFilter label="Category" value={category} onChange={setCategory} options={[['all', 'All categories'], ...ACTIVITY_CATEGORIES]} />
            <SearchFilter label="Search" value={query} onChange={setQuery} placeholder="Activity, User or Astrologer ID" />
            <SelectFilter label="Sort by" value={sort} onChange={setSort} options={SORTS} />
          </FilterBar>
          <p className="p-small p-muted">{formatNumber(rows.length)} activities match.</p>
          <DataTable
            caption="Activity history"
            rows={paged.rows}
            onRowClick={setOpen}
            empty={<Empty icon="search" title="No matching activity" text="Choose another month or change the filters." />}
            columns={[
              { key: 'd', header: 'Date / Time', primary: true, render: (a) => dt(iso(a.at)) },
              { key: 't', header: 'Activity', render: (a) => <span className="p-desc"><span>{a.type}</span><span className="p-small">{a.category}</span></span> },
              { key: 'a', header: 'Actor', render: (a) => <span className="p-desc"><span>{a.actor?.name ?? '—'}</span><span className="p-small">{a.actor?.role}</span></span> },
              { key: 'x', header: 'Description', className: 'p-wrap', render: (a) => a.description },
              { key: 'r', header: 'Related', render: (a) => <span className="p-desc"><span className="p-mono">{related(a) || '—'}</span><span className="p-small p-mono">{a.ref ?? ''}</span></span> },
              { key: 'v', header: 'Details', render: (a) => <ViewButton onClick={() => setOpen(a)} /> },
            ]}
          />
          {paged.pager('activities')}
          <p className="p-small p-muted">Retention periods for technical logs are not finalised (PP-14). Account, payment, service and dispute audit history is never deleted.</p>
        </Section>
      )}
      {open && (
        <DetailPanel title={open.type} subtitle={open.id} onClose={() => setOpen(null)}>
          <Fields
            columns={2}
            items={[
              ['Activity ID', open.id],
              ['Category', open.category],
              ['Activity Type', open.type],
              ['Date / Time', dt(iso(open.at))],
              ['Actor', actorText(open)],
              ['Status', open.status ? <Pill key="s" value={open.status} /> : '—'],
              ['Related User', open.userId ? <a key="u" className="u-name" href={href(userProfilePath(open.userId))}>{open.userId}</a> : '—'],
              ['Related Astrologer', open.astroId ? <a key="a" className="u-name" href={href(astrologerProfilePath(open.astroId))}>{open.astroId}</a> : '—'],
              ['Related Assistant', open.assistantId ? <a key="as" className="u-name" href={href(assistantProfilePath(open.assistantId))}>{open.assistantId}</a> : '—'],
              ['Related Service / Transaction', open.ref ?? '—'],
              ['Previous Value', open.prev ?? '—'],
              ['New Value', open.next ?? '—'],
              ...(open.recordedIn ? [['Recorded In', open.recordedIn, { wide: true }]] : []),
              ['Description', open.description, { wide: true }],
            ]}
          />
        </DetailPanel>
      )}
      {toastNode}
    </div>
  );
}
