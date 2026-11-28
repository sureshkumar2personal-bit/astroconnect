import { useMemo, useState } from 'react';
import { loadAstroFinanceIndex } from '../../data/astroFinanceIndex.js';
import { getAstrologerProfile } from '../../data/astrologersStore.js';
import { formatNumber } from '../../components/charts/chartUtils.js';
import { DataTable, DetailPanel, Empty, FilterBar, Fields, Pill, SearchFilter, Section, SelectFilter, SubHeading, Timeline, ViewButton, d, dt, usePaged } from '../UserProfile/components/ui.jsx';
import { AstroLink, ErrorState, ExportPair, LoadingState, PageHead, useToast } from '../Services/components/ServiceBits.jsx';
import { useLoaded } from '../Finance/components/FinanceBits.jsx';
import '../Users/UsersPage.css';
import '../UserProfile/UserProfilePage.css';
import '../Services/ServicesPage.css';

const STATES = ['Available', 'Busy', 'Offline', 'DND'];
const SORTS = [
  ['name', 'Astrologer name'],
  ['available7:desc', 'Open slots (most)'],
  ['booked7:desc', 'Booked slots (most)'],
  ['dnd30:desc', 'DND periods (most)'],
];
const EMPTY = { query: '', state: 'all', account: 'all' };

// Operations → Availability (11-availability-schedule.md). Admin view-only:
// Available · Busy · Offline · DND; weekly schedule; next 7 days of
// appointment slots (Available / Booked / Blocked); date closures; DND / Busy
// history; schedule changes. The same records as the Astrologer Profile →
// Availability & Schedule tab. No scheduling rule is added here.
export default function AvailabilityPage() {
  const state = useLoaded(loadAstroFinanceIndex);
  const [f, setF] = useState(EMPTY);
  const [sort, setSort] = useState('name');
  const [open, setOpen] = useState(null);
  const [notify, toastNode] = useToast();
  const set = (p) => setF((s) => ({ ...s, ...p }));
  const all = state.data?.availability ?? [];
  const accounts = useMemo(() => [...new Set(all.map((a) => a.accountStatus))].sort(), [all]);

  const rows = useMemo(() => {
    const q = f.query.trim().toLowerCase();
    const list = all.filter((a) => (f.state === 'all' || a.state === f.state) && (f.account === 'all' || a.accountStatus === f.account) && (!q || a.astroId.toLowerCase().includes(q) || a.astroName.toLowerCase().includes(q)));
    if (sort === 'name') return list.sort((a, b) => a.astroName.localeCompare(b.astroName));
    const k = sort.split(':')[0];
    return list.sort((a, b) => b[k] - a[k] || a.astroName.localeCompare(b.astroName));
  }, [all, f, sort]);
  const paged = usePaged(rows, 10, JSON.stringify(f) + sort);
  const counts = useMemo(() => STATES.map((s) => [s, rows.filter((a) => a.state === s).length]), [rows]);
  const slots = useMemo(() => rows.reduce((t, a) => ({ available: t.available + a.available7, booked: t.booked + a.booked7, blocked: t.blocked + a.blocked7 }), { available: 0, booked: 0, blocked: 0 }), [rows]);

  const columns = [
    { header: 'Astrologer', value: (a) => `${a.astroName} (${a.astroId})`, width: 28 },
    { header: 'Account Status', value: (a) => a.accountStatus, width: 12 },
    { header: 'Availability', value: (a) => a.state, width: 12 },
    { header: 'Working Days', value: (a) => a.workingDays, width: 10 },
    { header: 'Weekly Off', value: (a) => a.offDays.join(', '), width: 14 },
    { header: 'Hours', value: (a) => a.hours, width: 24 },
    { header: 'Slot (minutes + buffer)', value: (a) => `${a.duration} + ${a.buffer}`, width: 14 },
    { header: 'Next 7 Days — Available', value: (a) => a.available7, width: 12 },
    { header: 'Next 7 Days — Booked', value: (a) => a.booked7, width: 12 },
    { header: 'Next 7 Days — Blocked', value: (a) => a.blocked7, width: 12 },
    { header: 'DND Periods (30 days)', value: (a) => a.dnd30, width: 12 },
    { header: 'Busy Sessions (30 days)', value: (a) => a.busy30, width: 12 },
    { header: 'Date Closures', value: (a) => a.closures, width: 10 },
  ];

  return (
    <div className="users services">
      <PageHead section="Operations" title="Availability" subtitle="Astrologer availability and schedules. View only — schedules are managed by astrologers under the approved Astrologer App rules." />
      {state.status === 'loading' && <LoadingState label="Loading schedules" />}
      {state.status === 'error' && <ErrorState message={state.message} />}
      {state.status === 'ready' && (
        <Section
          id="av-list"
          title="Astrologer Availability"
          description={`${counts.map(([s, n]) => `${s} ${formatNumber(n)}`).join(' · ')} · Next 7 days: ${formatNumber(slots.available)} open, ${formatNumber(slots.booked)} booked, ${formatNumber(slots.blocked)} blocked appointment slots`}
          actions={<ExportPair title="Astrologer Availability" columns={columns} rows={rows} fileBase="astroconnect-availability" notify={notify} />}
        >
          <FilterBar canClear={JSON.stringify(f) !== JSON.stringify(EMPTY)} onClear={() => setF(EMPTY)}>
            <SearchFilter label="Search" value={f.query} onChange={(v) => set({ query: v })} placeholder="Astrologer name or ID" />
            <SelectFilter label="Availability" value={f.state} onChange={(v) => set({ state: v })} options={[['all', 'All states'], ...STATES]} />
            <SelectFilter label="Account Status" value={f.account} onChange={(v) => set({ account: v })} options={[['all', 'All accounts'], ...accounts]} />
            <SelectFilter label="Sort by" value={sort} onChange={setSort} options={SORTS} />
          </FilterBar>
          <p className="p-small p-muted">{formatNumber(rows.length)} astrologers match.</p>
          <DataTable
            caption="Astrologer availability"
            rows={paged.rows}
            rowKey={(a) => a.astroId}
            onRowClick={setOpen}
            empty={<Empty icon="search" title="No matching astrologers" text="Change or clear the filters." />}
            columns={[
              { key: 'a', header: 'Astrologer', primary: true, render: (a) => <AstroLink id={a.astroId} name={a.astroName} tab="availability" /> },
              { key: 's', header: 'Availability', render: (a) => <span className="p-desc"><Pill value={a.state} /><span className="p-small">Account {a.accountStatus}</span></span> },
              { key: 'w', header: 'Weekly Schedule', render: (a) => <span className="p-desc"><span>{a.hours || '—'}</span><span className="p-small">{a.workingDays} days · off {a.offDays.join(', ') || '—'}</span></span> },
              { key: 'n', header: 'Next 7 Days', render: (a) => `${a.available7} open · ${a.booked7} booked · ${a.blocked7} blocked` },
              { key: 'h', header: 'Last 30 Days', render: (a) => `${a.dnd30} DND · ${a.busy30} busy` },
              { key: 'v', header: 'Details', render: (a) => <ViewButton onClick={() => setOpen(a)} /> },
            ]}
          />
          {paged.pager('astrologers')}
        </Section>
      )}
      {open && <ScheduleDetails row={open} onClose={() => setOpen(null)} />}
      {toastNode}
    </div>
  );
}

function ScheduleDetails({ row, onClose }) {
  const av = useMemo(() => getAstrologerProfile(row.astroId)?.availability ?? null, [row]);
  if (!av) {
    return (
      <DetailPanel title={row.astroName} subtitle="Availability" onClose={onClose}>
        <p className="p-muted">This schedule could not be loaded.</p>
      </DetailPanel>
    );
  }
  return (
    <DetailPanel title={row.astroName} subtitle={`${row.astroId} · Availability & Schedule (view only)`} onClose={onClose}>
      <Fields
        columns={2}
        items={[
          ['Current State', <Pill key="s" value={av.current} />],
          ['Appointment Slot', `${av.duration} minutes + ${av.buffer}-minute buffer`],
        ]}
      />
      <SubHeading>Weekly Schedule</SubHeading>
      <DataTable
        caption="Weekly schedule"
        rows={av.weekly}
        rowKey={(w) => w.day}
        columns={[
          { key: 'd', header: 'Day', primary: true, render: (w) => w.day },
          { key: 's', header: 'Sessions', render: (w) => (w.working ? w.sessions.map((s) => s.join('–')).join(', ') : 'Weekly off') },
          { key: 'b', header: 'Breaks', render: (w) => (w.breaks.length ? w.breaks.map((s) => s.join('–')).join(', ') : '—') },
        ]}
      />
      <SubHeading>Next 7 Days — Appointment Slots</SubHeading>
      <DataTable
        caption="Next 7 days"
        rows={av.upcoming}
        rowKey={(u) => u.date}
        columns={[
          { key: 'd', header: 'Date', primary: true, render: (u) => `${u.day}, ${d(u.date)}` },
          { key: 'w', header: 'Day', render: (u) => (u.closed ? 'Date closed' : u.working ? 'Working' : 'Weekly off') },
          { key: 'a', header: 'Available', className: 'is-num', render: (u) => u.available },
          { key: 'b', header: 'Booked', className: 'is-num', render: (u) => u.booked.length },
          { key: 'x', header: 'Blocked', className: 'is-num', render: (u) => u.blocked },
        ]}
      />
      <SubHeading>Manual Date Closures</SubHeading>
      {av.closures.length ? <ul className="p-small">{av.closures.map((c) => <li key={c.date}>{d(c.date)} — {c.reason} (closed on {dt(c.at)}; {c.affected} appointments affected)</li>)}</ul> : <p className="p-small p-muted">No date closures.</p>}
      <SubHeading>DND / Busy History (last 30 days)</SubHeading>
      <Timeline items={av.history.slice(0, 15).map((h) => ({ at: h.from, text: `${h.state} — ${h.note}${h.to ? ` (until ${dt(h.to)})` : ' (ongoing)'}` }))} />
      {av.history.length > 15 && <p className="p-small p-muted">Latest 15 of {av.history.length} entries.</p>}
      <SubHeading>Schedule Change History</SubHeading>
      <Timeline items={av.changes} />
      <p className="p-small p-muted">Admin cannot change schedules or availability (view only). DND cannot be turned on during an active Call / Chat (AD-74).</p>
    </DetailPanel>
  );
}
