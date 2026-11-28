import { useCallback, useEffect, useState } from 'react';
import Icon from '../../components/icons.jsx';
import BarChart from '../../components/charts/BarChart.jsx';
import LineChart from '../../components/charts/LineChart.jsx';
import { formatNumber, formatRupees } from '../../components/charts/chartUtils.js';
import { fetchDashboard } from '../../data/dashboardService.js';
import HeaderCounts from './components/HeaderCounts.jsx';
import KpiCard from './components/KpiCard.jsx';
import OperationCard from './components/OperationCard.jsx';
import { AstrologerTasksAlert, PlatformTasksAlert } from './components/AlertPanels.jsx';
import ChartCard from './components/ChartCard.jsx';
import ActivityList from './components/ActivityList.jsx';
import { PendingTag, SectionHeading, Tag } from './components/Common.jsx';
import './AdminDashboard.css';

// Platform Admin Dashboard (docs/03-platform-admin/03-dashboard.md).
// All figures are demonstration data from src/data/mock/dashboardMock.js.

const COLORS = {
  new: '#d9b25c',
  completed: '#6b4a24',
  call: '#c9962e',
  chat: '#4f7c74',
  appointment: '#7b5a8c',
  users: '#b8862a',
  astrologers: '#4f7c74',
};

const SERVICE_SERIES = [
  { key: 'new', label: 'New today', color: COLORS.new },
  { key: 'completed', label: 'Completed today', color: COLORS.completed },
];

const REVENUE_SERIES = [
  { key: 'call', label: 'Instant Calls (2%)', color: COLORS.call },
  { key: 'chat', label: 'Instant Chats (2%)', color: COLORS.chat },
  { key: 'appointment', label: 'Appointments (3%)', color: COLORS.appointment },
];

export default function AdminDashboard() {
  const [state, setState] = useState({ status: 'loading' });

  const load = useCallback(() => {
    let cancelled = false;
    setState({ status: 'loading' });
    fetchDashboard().then(
      (data) => !cancelled && setState({ status: 'ready', data }),
      (error) => !cancelled && setState({ status: 'error', message: error.message })
    );
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => load(), [load]);

  return (
    <div className="dashboard">
      <div className="dashboard__intro">
        {/* The visible page title is in the top bar. */}
        <h1 className="visually-hidden">Dashboard</h1>
        {state.status === 'ready' && (
          <p className="dashboard__date">
            {state.data.dateLabel}
            <Tag tone="neutral">
              Data as of {state.data.snapshotTime}
            </Tag>
          </p>
        )}
      </div>

      {state.status === 'loading' && <DashboardSkeleton />}
      {state.status === 'error' && (
        <div className="dashboard__error" role="alert">
          <Icon name="alert" />
          <div>
            <p className="dashboard__error-title">Dashboard unavailable</p>
            <p className="dashboard__error-text">{state.message} Please try again.</p>
          </div>
          <button type="button" className="btn-secondary" onClick={load}>
            <Icon name="refresh" size={16} />
            Retry
          </button>
        </div>
      )}
      {state.status === 'ready' && <DashboardContent data={state.data} />}
    </div>
  );
}

function DashboardContent({ data }) {
  const { kpis, operations, charts } = data;
  const revenueEmpty = charts.revenue.every((b) => !b.values.call && !b.values.chat && !b.values.appointment);
  const servicesEmpty = charts.services.every((s) => !s.values.new && !s.values.completed);
  const growthEmpty = charts.growth.every((d) => !d.users && !d.astrologers);
  const growthUsers = charts.growth.map((d) => ({ label: d.label, fullLabel: d.fullLabel, value: d.users }));
  const growthAstro = charts.growth.map((d) => ({ label: d.label, fullLabel: d.fullLabel, value: d.astrologers }));
  const sumOf = (list) => list.reduce((s, d) => s + d.value, 0);

  return (
    <>
      {/* A — overall counts */}
      <HeaderCounts counts={data.counts} />

      {/* B — KPI overview: 4 + 1 */}
      <section className="dash-section" aria-labelledby="kpi-title">
        <SectionHeading id="kpi-title" title="Today at a glance" />
        <div className="kpi-grid">
          <KpiCard label="New Users Today" path="/people/users" caption="Registered today">
            {formatNumber(kpis.newUsers)}
          </KpiCard>
          <KpiCard
            label="New Astrologers Today"
            path="/people/astrologers"
            caption="Newly registered (not verification)"
          >
            {formatNumber(kpis.newAstrologers)}
          </KpiCard>
          <KpiCard label="Today's Services" path="/services/overview" caption="Cancelled and failed excluded">
            <span className="kpi__pair">
              <span>
                {formatNumber(kpis.servicesNew)}
                <small>New</small>
              </span>
              <span>
                {formatNumber(kpis.servicesCompleted)}
                <small>Completed</small>
              </span>
            </span>
          </KpiCard>
          <KpiCard
            label="Active Consultations"
            path="/services/overview"
            caption={`${kpis.activeCalls} calls · ${kpis.activeChats} chats in progress`}
          >
            {formatNumber(kpis.activeCalls + kpis.activeChats)}
          </KpiCard>
          <KpiCard
            label="Today's Revenue"
            path="/finance/platform-commission"
            className="kpi--wide"
            caption={
              <>
                <strong>Platform Revenue only</strong> — commission earned by the platform. Not
                user payments and not astrologer earnings.{' '}
                <PendingTag id="PP-09">Text Question rate pending</PendingTag>
              </>
            }
          >
            {formatRupees(kpis.revenue)}
          </KpiCard>
        </div>
      </section>

      {/* C — Today's Operations */}
      <section className="dash-section" aria-labelledby="ops-title">
        <SectionHeading id="ops-title" title="Today's Operations" />
        <div className="ops-grid">
          <OperationCard
            icon="calendar"
            title="Appointments Today"
            count={operations.appointments.length}
            countLabel="confirmed, scheduled today"
            items={operations.appointments}
            emptyText="No confirmed appointments remain today."
            renderItem={(a) => (
              <span className="rec">
                <span className="rec__time">{a.time}</span>
                <span className="rec__main">
                  <span className="rec__title">{a.user}</span>
                  <span className="rec__sub">with {a.astrologer}</span>
                </span>
                <Tag tone="success">Confirmed</Tag>
              </span>
            )}
            links={[{ label: 'Appointments', path: '/services/appointments' }]}
          />
          <OperationCard
            icon="question"
            title="Questions Pending"
            count={operations.questions.length}
            countLabel="due for an answer today"
            note={<PendingTag id="PP-21">“Due today” definition pending</PendingTag>}
            items={operations.questions}
            emptyText="No questions are due today."
            renderItem={(q) => (
              <span className="rec">
                <span className="rec__main">
                  <span className="rec__title">{q.id}</span>
                  <span className="rec__sub">{q.astrologer}</span>
                </span>
                <Tag tone={q.status === 'Pending' ? 'gold' : 'neutral'}>{q.status}</Tag>
              </span>
            )}
            links={[{ label: 'Text Questions', path: '/services/text-questions' }]}
          />
          <OperationCard
            icon="phone"
            title="Instant Calls & Chats"
            count={operations.live.calls + operations.live.chats}
            countLabel="active sessions now"
            links={[
              { label: 'Instant Call', path: '/services/instant-call' },
              { label: 'Instant Chat', path: '/services/instant-chat' },
            ]}
          >
            <dl className="live">
              <div>
                <dt>Active calls</dt>
                <dd>{operations.live.calls}</dd>
              </div>
              <div>
                <dt>Active chats</dt>
                <dd>{operations.live.chats}</dd>
              </div>
              <div>
                <dt>
                  <span className="online-dot" aria-hidden="true" />
                  Astrologers available
                </dt>
                <dd>{operations.live.available}</dd>
              </div>
            </dl>
          </OperationCard>
          <OperationCard
            icon="cancel"
            title="Today's Cancellations"
            count={operations.cancellations.length}
            countLabel="new requests received today"
            items={operations.cancellations}
            emptyText="No new cancellation requests today."
            renderItem={(c) => (
              <span className="rec">
                <span className="rec__time">{c.receivedAt}</span>
                <span className="rec__main">
                  <span className="rec__title">{c.id}</span>
                  <span className="rec__sub">
                    {c.user} · {c.astrologer}
                  </span>
                </span>
                <Tag tone="gold">New</Tag>
              </span>
            )}
            links={[{ label: 'Appointments', path: '/services/appointments' }]}
          />
        </div>
      </section>

      {/* D — Alerts */}
      <section className="dash-section" aria-labelledby="alerts-title">
        <SectionHeading id="alerts-title" title="Action Required" />
        <div className="alerts-grid">
          <AstrologerTasksAlert data={data.astrologerTasks} />
          <PlatformTasksAlert data={data.platformTasks} />
        </div>
      </section>

      {/* E — Charts, F — Recent Activity */}
      <section className="dash-section" aria-labelledby="analytics-title">
        <SectionHeading id="analytics-title" title="Analytics" />
        <div className="charts-grid">
          <ChartCard
            id="chart-services"
            title="Service Overview"
            subtitle="New and completed services today, by service"
            isEmpty={servicesEmpty}
            emptyText="No services recorded today."
            legend={<Legend series={SERVICE_SERIES} />}
          >
            <BarChart
              data={charts.services}
              series={SERVICE_SERIES}
              integer
              formatValue={formatNumber}
              ariaLabel="Service Overview: new and completed services today"
            />
          </ChartCard>

          <ChartCard
            id="chart-revenue"
            title="Today's Revenue"
            subtitle={`Platform Revenue by time of day · ${formatRupees(kpis.revenue)} total`}
            isEmpty={revenueEmpty}
            emptyText="No platform revenue recorded today."
            legend={
              <Legend
                series={REVENUE_SERIES}
                totals={{
                  call: formatRupees(charts.revenueBy.call),
                  chat: formatRupees(charts.revenueBy.chat),
                  appointment: formatRupees(charts.revenueBy.appointment),
                }}
              />
            }
            footer={
              <>
                Platform commission only — user payments and astrologer earnings are in Finance.
                Wallet top-ups: 0%. <PendingTag id="PP-09">Text Questions not included</PendingTag>
              </>
            }
          >
            <BarChart
              data={charts.revenue}
              series={REVENUE_SERIES}
              stacked
              formatValue={formatRupees}
              formatTick={(v) => `₹${formatNumber(v)}`}
              totalLabel="Platform Revenue"
              ariaLabel="Today's Platform Revenue by two-hour block and service"
            />
          </ChartCard>

          <ChartCard
            id="chart-growth"
            title="User & Astrologer Growth"
            subtitle="Daily registrations, last 14 days"
            isEmpty={growthEmpty}
            emptyText="No registrations in the last 14 days."
          >
            <div className="growth">
              <div className="growth__series">
                <p className="growth__label">
                  <span className="chart-swatch" style={{ background: COLORS.users }} />
                  Users <strong>{formatNumber(sumOf(growthUsers))}</strong>
                </p>
                <LineChart
                  data={growthUsers}
                  color={COLORS.users}
                  seriesLabel="new users"
                  integer
                  formatValue={formatNumber}
                  ariaLabel="New user registrations per day, last 14 days"
                />
              </div>
              <div className="growth__series">
                <p className="growth__label">
                  <span className="chart-swatch" style={{ background: COLORS.astrologers }} />
                  Astrologers <strong>{formatNumber(sumOf(growthAstro))}</strong>
                </p>
                <LineChart
                  data={growthAstro}
                  color={COLORS.astrologers}
                  seriesLabel="new astrologers"
                  integer
                  formatValue={formatNumber}
                  ariaLabel="New astrologer registrations per day, last 14 days"
                />
              </div>
            </div>
          </ChartCard>

          <section className="chart-card activity-card" aria-labelledby="activity-title">
            <header className="chart-card__head">
              <div>
                <h3 id="activity-title" className="chart-card__title">
                  Recent Activity
                </h3>
                <p className="chart-card__subtitle">Latest platform events</p>
              </div>
            </header>
            <ActivityList items={data.activity} />
          </section>
        </div>
      </section>
    </>
  );
}

function Legend({ series, totals }) {
  return (
    <ul className="chart-legend">
      {series.map((s) => (
        <li key={s.key}>
          <span className="chart-swatch" style={{ background: s.color }} />
          {s.label}
          {totals && <strong>{totals[s.key]}</strong>}
        </li>
      ))}
    </ul>
  );
}

function DashboardSkeleton() {
  return (
    <div className="skeleton" role="status" aria-label="Loading dashboard">
      <div className="skeleton__bar skeleton__bar--counts" />
      <div className="skeleton__row">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="skeleton__bar skeleton__bar--kpi" />
        ))}
      </div>
      <div className="skeleton__row">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="skeleton__bar skeleton__bar--op" />
        ))}
      </div>
    </div>
  );
}
