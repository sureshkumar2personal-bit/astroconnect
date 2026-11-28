import { useEffect, useMemo, useState } from 'react';
import { href } from '../../router/useHashRoute.js';
import { loadServiceIndex } from '../../data/serviceIndex.js';
import BarChart from '../../components/charts/BarChart.jsx';
import { formatNumber } from '../../components/charts/chartUtils.js';
import { DataTable, DateFilter, FilterBar, Section, SelectFilter, Stats } from '../UserProfile/components/ui.jsx';
import { AstroLink, DAY, ErrorState, LoadingState, NOT_FINALISED, PageHead, startOfDay } from './components/ServiceBits.jsx';
import '../Users/UsersPage.css';
import '../UserProfile/UserProfilePage.css';
import './ServicesPage.css';

// Service Management → Overview (service-overview.md §2). Counts come from
// the same service records as the Text Questions and Appointments pages and
// the user / astrologer profiles. "New / Completed Services Today" and
// "Cancellation Requests Today" use the Dashboard definitions. Grouping of
// approved statuses into Pending / In Progress (PP-22) and "Overdue"
// (PP-21) are not finalised.

const TYPES = [
  { key: 'Text Question', label: 'Text Questions', path: '/services/text-questions', color: '#c9962e' },
  { key: 'Appointment', label: 'Appointments', path: '/services/appointments', color: '#7b5a8c' },
  { key: 'Instant Call', label: 'Instant Calls', path: '/services/instant-call', color: '#4f7c74' },
  { key: 'Instant Chat', label: 'Instant Chats', path: '/services/instant-chat', color: '#b07b4f' },
];

const RANGES = [
  ['7', 'Last 7 days'],
  ['30', 'Last 30 days'],
  ['90', 'Last 90 days'],
  ['all', 'All time'],
  ['custom', 'Custom range'],
];

export default function ServiceOverviewPage() {
  const [state, setState] = useState({ status: 'loading', index: null, message: '' });
  const [range, setRange] = useState('30');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  useEffect(() => {
    let live = true;
    loadServiceIndex().then(
      (index) => live && setState({ status: 'ready', index, message: '' }),
      (e) => live && setState({ status: 'error', index: null, message: e.message })
    );
    return () => {
      live = false;
    };
  }, []);

  const data = useMemo(() => {
    if (!state.index) return null;
    const { questions, appointments, sessions, complaints, snapshot } = state.index;
    const today = startOfDay(snapshot);
    let start = null;
    let end = snapshot;
    if (range === 'custom') {
      start = from ? new Date(`${from}T00:00:00`).getTime() : null;
      end = to ? new Date(`${to}T23:59:59`).getTime() : snapshot;
    } else if (range !== 'all') start = today - (Number(range) - 1) * DAY;
    const inRange = (t) => t !== null && (start === null || t >= start) && t <= end;
    const all = [
      ...questions.map((q) => ({ ...q, type: 'Text Question', completedAt: q.answeredAt })),
      ...appointments.map((a) => ({ ...a, type: 'Appointment', completedAt: a.status === 'Completed' ? a.serviceAt + a.duration * 60000 : null })),
      ...sessions,
    ];
    const rows = all.filter((s) => inRange(s.createdAt));
    const byType = TYPES.map((t) => {
      const list = rows.filter((s) => s.type === t.key);
      const statuses = {};
      for (const s of list) statuses[s.status] = (statuses[s.status] ?? 0) + 1;
      return { ...t, total: list.length, statuses };
    });
    // Today (Dashboard definitions).
    const newToday = TYPES.map((t) => all.filter((s) => s.type === t.key && s.createdAt >= today && s.createdAt <= snapshot).length);
    const completedToday = TYPES.map((t) => all.filter((s) => s.type === t.key && s.completedAt && s.completedAt >= today && s.completedAt <= snapshot).length);
    const cancelToday = appointments.filter((a) => a.cancelledAt && a.cancelledAt >= today && a.cancelledAt <= snapshot).length;
    const techIssues = complaints.filter((c) => inRange(c.raisedAt)).length;
    // Trend: daily new services by type (last up to 30 days of the range).
    const trendEnd = startOfDay(end);
    const trendStart = Math.max(start ?? trendEnd - 29 * DAY, trendEnd - 29 * DAY);
    const buckets = [];
    for (let t = trendStart; t <= trendEnd; t += DAY) {
      const dd = new Date(t);
      buckets.push({ t, label: String(dd.getDate()), fullLabel: dd.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }), values: Object.fromEntries(TYPES.map((x) => [x.key, 0])) });
    }
    for (const s of rows) {
      const b = buckets[Math.floor((startOfDay(s.createdAt) - trendStart) / DAY)];
      if (b) b.values[s.type] += 1;
    }
    // Astrologer-wise summary.
    const astro = new Map();
    for (const s of rows) {
      const r = astro.get(s.astroId) ?? { id: s.astroId, name: s.astroName, total: 0, 'Text Question': 0, Appointment: 0, 'Instant Call': 0, 'Instant Chat': 0 };
      r.total += 1;
      r[s.type] += 1;
      astro.set(s.astroId, r);
    }
    const topAstro = [...astro.values()].sort((a, b) => b.total - a.total).slice(0, 10);
    return { byType, newToday, completedToday, cancelToday, techIssues, buckets, topAstro, total: rows.length };
  }, [state.index, range, from, to]);

  return (
    <div className="users services">
      <PageHead title="Overview" subtitle="Service operations across Text Questions, Appointments, Instant Calls and Instant Chats." />
      {state.status === 'loading' && <LoadingState label="Loading service records" />}
      {state.status === 'error' && <ErrorState message={state.message} />}
      {data && (
        <>
          <Stats
            label="Today"
            items={[
              ['New Services Today', formatNumber(data.newToday.reduce((a, b) => a + b, 0)), 'gold'],
              ['Completed Services Today', formatNumber(data.completedToday.reduce((a, b) => a + b, 0)), 'green'],
              ['Cancellation Requests Today', data.cancelToday],
              ['Pending Services', NOT_FINALISED],
              ['Overdue Services', NOT_FINALISED],
            ]}
          />
          <Section id="sv-filter" title="Service Breakdown" description="Counts by approved status for services created in the selected period. Each service type is counted separately.">
            <FilterBar>
              <SelectFilter label="Period" value={range} onChange={setRange} options={RANGES} />
              {range === 'custom' && <DateFilter label="From" value={from} onChange={setFrom} max={to || undefined} />}
              {range === 'custom' && <DateFilter label="To" value={to} onChange={setTo} min={from || undefined} />}
            </FilterBar>
            <DataTable
              caption="Service breakdown"
              rows={data.byType}
              rowKey={(r) => r.key}
              columns={[
                { key: 'svc', header: 'Service', primary: true, render: (r) => <a className="u-name" href={href(r.path)}>{r.label}</a> },
                { key: 'total', header: 'Total', className: 'is-num', render: (r) => <strong>{formatNumber(r.total)}</strong> },
                { key: 'status', header: 'By Status', className: 'p-wrap', render: (r) => (r.total ? Object.entries(r.statuses).map(([k, v]) => `${k} ${formatNumber(v)}`).join(' · ') : '—') },
                { key: 'new', header: 'New Today', className: 'is-num', render: (r) => data.newToday[TYPES.findIndex((t) => t.key === r.key)] },
                { key: 'done', header: 'Completed Today', className: 'is-num', render: (r) => data.completedToday[TYPES.findIndex((t) => t.key === r.key)] },
              ]}
            />
            <p className="p-small p-muted">
              Pending / In Progress groupings across services: {NOT_FINALISED}. Technical complaints in this period: {formatNumber(data.techIssues)}.
            </p>
          </Section>
          <div className="p-grid-2">
            <Section id="sv-trend" title="New Services per Day" description="Services created per day in the selected period (up to the last 30 days).">
              <ul className="chart-legend">
                {TYPES.map((t) => (
                  <li key={t.key}>
                    <span className="chart-swatch" style={{ background: t.color }} />
                    {t.label}
                  </li>
                ))}
              </ul>
              {data.total ? (
                <BarChart data={data.buckets} series={TYPES.map((t) => ({ key: t.key, label: t.label, color: t.color }))} stacked integer formatValue={formatNumber} totalLabel="Total" ariaLabel="New services per day by service type" />
              ) : (
                <p className="p-muted">No services in this period.</p>
              )}
            </Section>
            <Section id="sv-astro" title="Astrologer-wise Service Summary" description="Top astrologers by services created in the selected period.">
              <DataTable
                caption="Astrologer-wise service summary"
                rows={data.topAstro}
                empty={<p className="p-muted">No services in this period.</p>}
                columns={[
                  { key: 'a', header: 'Astrologer', primary: true, render: (r) => <AstroLink id={r.id} name={r.name} tab="services" /> },
                  { key: 'tq', header: 'Questions', className: 'is-num', render: (r) => r['Text Question'] },
                  { key: 'ap', header: 'Appointments', className: 'is-num', render: (r) => r.Appointment },
                  { key: 'cl', header: 'Calls', className: 'is-num', render: (r) => r['Instant Call'] },
                  { key: 'ch', header: 'Chats', className: 'is-num', render: (r) => r['Instant Chat'] },
                  { key: 't', header: 'Total', className: 'is-num', render: (r) => <strong>{r.total}</strong> },
                ]}
              />
            </Section>
          </div>
        </>
      )}
    </div>
  );
}
