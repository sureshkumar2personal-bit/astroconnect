import { useEffect, useMemo, useState } from 'react';
import { loadServiceIndex, serviceDetails } from '../../data/serviceIndex.js';
import { formatNumber } from '../../components/charts/chartUtils.js';
import {
  DataTable,
  DateFilter,
  DetailPanel,
  Empty,
  Fields,
  FilterBar,
  Pill,
  SearchFilter,
  Section,
  SelectFilter,
  Stats,
  SubHeading,
  Timeline,
  ViewButton,
  d,
  dt,
  money,
  usePaged,
} from '../UserProfile/components/ui.jsx';
import { AstroLink, DAY, ErrorState, ExportPair, LoadingState, NOT_FINALISED, PageHead, UnavailableAction, UserLink, startOfDay, useToast } from './components/ServiceBits.jsx';
import '../Users/UsersPage.css';
import '../UserProfile/UserProfilePage.css';
import './ServicesPage.css';

// Service Management → Appointments (appointment-management.md). Voice-only,
// 15 / 30 minutes; payment confirms immediately (no pending-payment status);
// the user may reschedule once; astrologer cancellation → full Wallet refund.
// No Admin reschedule or slot blocking (ruling C4). Admin cancel and
// attendance correction are unavailable until their effect is decided (PP-13).

export const APPOINTMENT_STATUSES = ['Confirmed', 'Under Review', 'Completed', 'Cancelled', 'Missed / No-show'];
const SORTS = [
  ['slot:desc', 'Appointment date (latest)'],
  ['slot:asc', 'Appointment date (earliest)'],
  ['booked:desc', 'Booking date (newest)'],
  ['amount:desc', 'Amount (highest)'],
];
const iso = (t) => new Date(t).toISOString();
const time = (t) => new Date(t).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });

export default function AppointmentsPage() {
  const [state, setState] = useState({ status: 'loading', index: null, message: '' });
  const [view, setView] = useState('table');
  const [f, setF] = useState({ query: '', status: 'all', payment: 'all', astro: 'all', when: 'all', flag: 'all', aFrom: '', aTo: '', bFrom: '', bTo: '' });
  const [sort, setSort] = useState('slot:desc');
  const [week, setWeek] = useState(0);
  const [open, setOpen] = useState(null);
  const [notify, toastNode] = useToast();
  useEffect(() => {
    let live = true;
    loadServiceIndex().then((index) => live && setState({ status: 'ready', index, message: '' }), (e) => live && setState({ status: 'error', index: null, message: e.message }));
    return () => {
      live = false;
    };
  }, []);
  const set = (patch) => setF((s) => ({ ...s, ...patch }));

  const all = state.index?.appointments ?? [];
  const snapshot = state.index?.snapshot ?? Date.now();
  const today = startOfDay(snapshot);
  const astrologers = useMemo(() => [...new Map(all.map((a) => [a.astroId, a.astroName])).entries()].sort((x, y) => x[1].localeCompare(y[1])), [all]);
  const payments = useMemo(() => [...new Set(all.map((a) => a.paymentStatus))].sort(), [all]);
  const rows = useMemo(() => {
    const q = f.query.trim().toLowerCase();
    const day = (v, end) => (v ? new Date(`${v}T${end ? '23:59:59' : '00:00:00'}`).getTime() : null);
    const [aF, aT, bF, bT] = [day(f.aFrom), day(f.aTo, true), day(f.bFrom), day(f.bTo, true)];
    const list = all.filter(
      (a) =>
        (f.status === 'all' || a.status === f.status) &&
        (f.payment === 'all' || a.paymentStatus === f.payment) &&
        (f.astro === 'all' || a.astroId === f.astro) &&
        (f.when === 'all' || (f.when === 'today' ? a.serviceAt >= today && a.serviceAt < today + DAY : f.when === 'upcoming' ? a.serviceAt > snapshot : a.serviceAt <= snapshot)) &&
        (f.flag === 'all' || (f.flag === 'cancelled' ? a.status === 'Cancelled' : a.rescheduled)) &&
        (aF === null || a.serviceAt >= aF) &&
        (aT === null || a.serviceAt <= aT) &&
        (bF === null || a.createdAt >= bF) &&
        (bT === null || a.createdAt <= bT) &&
        (!q || a.id.toLowerCase().includes(q) || a.userId.toLowerCase().includes(q) || a.astroId.toLowerCase().includes(q) || a.userName.toLowerCase().includes(q) || a.astroName.toLowerCase().includes(q))
    );
    const [key, dir] = sort.split(':');
    const val = { slot: (a) => a.serviceAt, booked: (a) => a.createdAt, amount: (a) => a.amount }[key];
    return list.sort((a, b) => (dir === 'asc' ? val(a) - val(b) : val(b) - val(a)) || a.id.localeCompare(b.id));
  }, [all, f, sort, snapshot, today]);
  const paged = usePaged(rows, 10, JSON.stringify(f) + sort);

  const report = useMemo(() => {
    const done = all.filter((a) => a.status === 'Completed').length;
    const cancelled = all.filter((a) => a.status === 'Cancelled').length;
    const past = all.filter((a) => a.serviceAt <= snapshot).length;
    return {
      total: all.length,
      bookedToday: all.filter((a) => a.createdAt >= today && a.createdAt <= snapshot).length,
      upcoming: all.filter((a) => a.status === 'Confirmed' && a.serviceAt > snapshot).length,
      completed: done,
      cancelled,
      rescheduled: all.filter((a) => a.rescheduled).length,
      noShow: all.filter((a) => a.status === 'Missed / No-show').length,
      cancelRate: past ? `${((cancelled / past) * 100).toFixed(1)}%` : '—',
      completionRate: past ? `${((done / past) * 100).toFixed(1)}%` : '—',
    };
  }, [all, snapshot, today]);

  const columns = [
    { header: 'Appointment ID', value: (a) => a.id, width: 16 },
    { header: 'User', value: (a) => `${a.userName} (${a.userId})`, width: 28 },
    { header: 'Astrologer', value: (a) => `${a.astroName} (${a.astroId})`, width: 30 },
    { header: 'Booking Date', value: (a) => dt(iso(a.createdAt)), width: 20 },
    { header: 'Appointment Date', value: (a) => dt(iso(a.serviceAt)), width: 20 },
    { header: 'Duration', value: (a) => `${a.duration} min`, width: 10 },
    { header: 'User Paid Amount', value: (a) => a.amount, width: 12 },
    { header: 'Payment Status', value: (a) => a.paymentStatus, width: 12 },
    { header: 'Appointment Status', value: (a) => a.status, width: 16 },
  ];

  // Calendar: one week of appointments matching the filters.
  const weekStart = (() => {
    const dd = new Date(today);
    dd.setDate(dd.getDate() - ((dd.getDay() + 6) % 7) + week * 7);
    return dd.getTime();
  })();
  const weekDays = Array.from({ length: 7 }, (_, i) => weekStart + i * DAY);
  const inWeek = rows.filter((a) => a.serviceAt >= weekStart && a.serviceAt < weekStart + 7 * DAY);

  return (
    <div className="users services">
      <PageHead title="Appointments" subtitle="Voice-only consultations of 15 or 30 minutes, confirmed on payment." />
      {state.status === 'loading' && <LoadingState label="Loading appointments" />}
      {state.status === 'error' && <ErrorState message={state.message} />}
      {state.status === 'ready' && (
        <>
          <Stats
            label="Appointment report"
            items={[
              ['Total', formatNumber(report.total), 'gold'],
              ['Booked Today', report.bookedToday],
              ['Upcoming', formatNumber(report.upcoming)],
              ['Completed', formatNumber(report.completed), 'green'],
              ['Cancelled', formatNumber(report.cancelled)],
              ['Rescheduled', formatNumber(report.rescheduled)],
              ['No-show', report.noShow],
              ['Cancellation Rate', report.cancelRate],
              ['Completion Rate', report.completionRate],
            ]}
          />
          <Section
            id="ap-list"
            title="Appointments"
            actions={
              <div className="p-actions">
                <div className="sv-toggle" role="group" aria-label="View">
                  <button type="button" className={`u-btn${view === 'table' ? ' is-on' : ''}`} aria-pressed={view === 'table'} onClick={() => setView('table')}>Table</button>
                  <button type="button" className={`u-btn${view === 'calendar' ? ' is-on' : ''}`} aria-pressed={view === 'calendar'} onClick={() => setView('calendar')}>Calendar</button>
                </div>
                <ExportPair title="Appointments" columns={columns} rows={rows} fileBase="astroconnect-appointments" notify={notify} />
              </div>
            }
          >
            <FilterBar canClear={JSON.stringify(f) !== JSON.stringify({ query: '', status: 'all', payment: 'all', astro: 'all', when: 'all', flag: 'all', aFrom: '', aTo: '', bFrom: '', bTo: '' })} onClear={() => set({ query: '', status: 'all', payment: 'all', astro: 'all', when: 'all', flag: 'all', aFrom: '', aTo: '', bFrom: '', bTo: '' })}>
              <SearchFilter label="Search" value={f.query} onChange={(v) => set({ query: v })} placeholder="Appointment, User or Astrologer ID / name" />
              <SelectFilter label="Appointment Status" value={f.status} onChange={(v) => set({ status: v })} options={[['all', 'All statuses'], ...APPOINTMENT_STATUSES]} />
              <SelectFilter label="Payment Status" value={f.payment} onChange={(v) => set({ payment: v })} options={[['all', 'All'], ...payments]} />
              <SelectFilter label="Astrologer" value={f.astro} onChange={(v) => set({ astro: v })} options={[['all', 'All astrologers'], ...astrologers]} />
              <SelectFilter label="When" value={f.when} onChange={(v) => set({ when: v })} options={[['all', 'All'], ['today', 'Today'], ['upcoming', 'Upcoming'], ['past', 'Past']]} />
              <SelectFilter label="Cancelled / Rescheduled" value={f.flag} onChange={(v) => set({ flag: v })} options={[['all', 'All'], ['cancelled', 'Cancelled'], ['rescheduled', 'Rescheduled']]} />
              <DateFilter label="Appointment from" value={f.aFrom} onChange={(v) => set({ aFrom: v })} />
              <DateFilter label="Appointment to" value={f.aTo} onChange={(v) => set({ aTo: v })} />
              <DateFilter label="Booked from" value={f.bFrom} onChange={(v) => set({ bFrom: v })} />
              <DateFilter label="Booked to" value={f.bTo} onChange={(v) => set({ bTo: v })} />
              <SelectFilter label="Sort by" value={sort} onChange={setSort} options={SORTS} />
            </FilterBar>
            <p className="p-small p-muted">{formatNumber(rows.length)} appointments match. No Admin rescheduling or slot blocking.</p>
            {view === 'table' ? (
              <>
                <DataTable
                  caption="Appointments"
                  rows={paged.rows}
                  onRowClick={setOpen}
                  empty={<Empty title="No matching appointments" text="Change or clear the filters." />}
                  columns={[
                    { key: 'id', header: 'Appointment ID', primary: true, render: (a) => <span className="p-mono">{a.id}</span> },
                    { key: 'u', header: 'User', render: (a) => <UserLink id={a.userId} name={a.userName} /> },
                    { key: 'as', header: 'Astrologer', render: (a) => <AstroLink id={a.astroId} name={a.astroName} /> },
                    { key: 'b', header: 'Booking Date', render: (a) => dt(iso(a.createdAt)) },
                    { key: 's', header: 'Appointment Date', render: (a) => dt(iso(a.serviceAt)) },
                    { key: 'dur', header: 'Duration', render: (a) => `${a.duration} min` },
                    { key: 'amt', header: 'User Paid Amount', className: 'is-num', render: (a) => money(a.amount) },
                    { key: 'p', header: 'Payment Status', render: (a) => <Pill value={a.paymentStatus} /> },
                    { key: 'st', header: 'Appointment Status', render: (a) => <span className="p-inline"><Pill value={a.status} />{a.rescheduled && <span className="sv-flag">Rescheduled</span>}</span> },
                    { key: 'v', header: 'View Details', render: (a) => <ViewButton onClick={() => setOpen(a)} /> },
                  ]}
                />
                {paged.pager('appointments')}
              </>
            ) : (
              <div className="sv-calendar">
                <div className="sv-calendar__nav">
                  <button type="button" className="u-btn" onClick={() => setWeek((w) => w - 1)}>Previous week</button>
                  <strong>
                    {d(iso(weekStart))} – {d(iso(weekStart + 6 * DAY))}
                  </strong>
                  <button type="button" className="u-btn" onClick={() => setWeek((w) => w + 1)}>Next week</button>
                  {week !== 0 && <button type="button" className="u-btn u-btn--ghost" onClick={() => setWeek(0)}>This week</button>}
                </div>
                <div className="sv-week">
                  {weekDays.map((day) => {
                    const items = inWeek.filter((a) => a.serviceAt >= day && a.serviceAt < day + DAY).sort((x, y) => x.serviceAt - y.serviceAt);
                    return (
                      <section key={day} className={`sv-day${day === today ? ' is-today' : ''}`} aria-label={d(iso(day))}>
                        <h4 className="sv-day__head">
                          {new Date(day).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                          <span className="p-small">{items.length}</span>
                        </h4>
                        {items.slice(0, 12).map((a) => (
                          <button key={a.id} type="button" className={`sv-appt is-${a.status.split(' ')[0].toLowerCase()}`} onClick={() => setOpen(a)}>
                            <span className="sv-appt__time">{time(a.serviceAt)} · {a.duration}m</span>
                            <span className="sv-appt__who">{a.astroName}</span>
                          </button>
                        ))}
                        {items.length > 12 && <span className="p-small">+{items.length - 12} more</span>}
                      </section>
                    );
                  })}
                </div>
              </div>
            )}
          </Section>
        </>
      )}
      {open && <AppointmentDetails row={open} onClose={() => setOpen(null)} />}
      {toastNode}
    </div>
  );
}

function AppointmentDetails({ row, onClose }) {
  const detail = serviceDetails(row.userId, row.id);
  if (!detail) return null;
  const { service: s, complaint, transactions, user } = detail;
  const refundTx = s.refundInfo ? transactions.find((t) => t.id === s.refundInfo.creditTx) : null;
  return (
    <DetailPanel title={s.id} subtitle={`${user.name} (${user.id}) with ${s.astrologer.name} (${s.astrologer.id})`} onClose={onClose}>
      <Fields
        columns={2}
        items={[
          ['Appointment Status', <Pill key="s" value={s.status} />],
          ['Type', 'Voice only'],
          ['Booking Date / Time', dt(s.createdAt)],
          ['Appointment Slot', dt(s.serviceAt)],
          ['Duration', `${s.duration} minutes`],
          ['User Paid Amount', money(s.amount)],
          ['User', <UserLink key="u" id={user.id} name={user.name} />],
          ['Astrologer', <AstroLink key="a" id={s.astrologer.id} name={s.astrologer.name} tab="availability" />],
        ]}
      />
      <SubHeading>Payment</SubHeading>
      <Fields
        columns={2}
        items={[
          ['Payment Status', <Pill key="p" value={s.paymentStatus} />],
          ['Payment Method', s.payments?.[0]?.method ?? s.method],
          ['Payment Transaction ID', (s.payments ?? []).map((p) => p.id).join(', ') || '—', { wide: true }],
        ]}
      />
      <SubHeading>Reschedule History (the user may reschedule once)</SubHeading>
      {s.reschedules.length ? (
        <ul className="p-list">
          {s.reschedules.map((r) => (
            <li key={r.at}>
              Requested by the {r.by.toLowerCase()} on {dt(r.at)}: {dt(r.from)} → {dt(r.to)}
            </li>
          ))}
        </ul>
      ) : (
        <p className="p-muted">Not rescheduled.</p>
      )}
      <SubHeading>Cancellation and Refund</SubHeading>
      <Fields
        columns={2}
        items={[
          ['Cancelled By', s.cancellation?.by ?? '—'],
          ['Cancellation Reason', s.cancellation?.reason ?? '—', { wide: true }],
          ['Refund Eligibility', s.cancellation?.by === 'Astrologer' ? 'Full refund to the user’s Wallet' : '—'],
          ['Refund Amount / Status', s.refundInfo ? `${money(s.refundInfo.amount)} · ${s.refundInfo.status}` : '—'],
          ['Refund Transaction ID', refundTx ? `${refundTx.id} (${refundTx.status})` : '—'],
        ]}
      />
      <SubHeading>Notifications</SubHeading>
      <Timeline items={s.notifications} />
      <SubHeading>Related Complaint</SubHeading>
      {complaint ? <Fields columns={2} items={[['Complaint ID', complaint.id], ['Status', <Pill key="c" value={complaint.status} />]]} /> : <p className="p-muted">No related complaint.</p>}
      <SubHeading>Actions</SubHeading>
      <div className="p-actions">
        <UnavailableAction label="Cancel with Reason" reason={`${NOT_FINALISED}: refund handling for Admin cancellation is not yet decided.`} />
        <UnavailableAction label="Correct Attendance" reason={`${NOT_FINALISED}: effect on refunds and earnings is not yet decided.`} />
      </div>
      <p className="p-small p-muted">Rescheduling is done only by the user; dates are closed only by the astrologer.</p>
    </DetailPanel>
  );
}
