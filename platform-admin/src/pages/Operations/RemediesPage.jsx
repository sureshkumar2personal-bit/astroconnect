import { useMemo, useState } from 'react';
import { loadServiceIndex, remedyDetails } from '../../data/serviceIndex.js';
import { moderationIndex } from '../../data/moderationStore.js';
import { formatNumber } from '../../components/charts/chartUtils.js';
import { DataTable, DateFilter, DetailPanel, Empty, FilterBar, Fields, Pill, SearchFilter, Section, SelectFilter, SubHeading, Timeline, ViewButton, d, dt, usePaged } from '../UserProfile/components/ui.jsx';
import { AstroLink, ErrorState, ExportPair, LoadingState, PageHead, UserLink, useToast } from '../Services/components/ServiceBits.jsx';
import { inRange, iso, useLoaded } from '../Finance/components/FinanceBits.jsx';
import ModerationPanel from './components/ModerationPanel.jsx';
import '../Users/UsersPage.css';
import '../UserProfile/UserProfilePage.css';
import '../Services/ServicesPage.css';

const STATUSES = ['Suggested', 'In Progress', 'Overdue', 'Completed', 'Cancelled'];
const SORTS = [
  ['suggestedAt:desc', 'Newest first'],
  ['suggestedAt:asc', 'Oldest first'],
  ['dueAt:asc', 'Due date (earliest)'],
];
const EMPTY = { query: '', status: 'all', visibility: 'all', type: 'all', from: '', to: '' };

// Operations → Remedies (08-remedy-management.md). The same remedy records as
// the User Profile and Astrologer Profile. Statuses: Suggested · In Progress ·
// Overdue · Completed · Cancelled; "Hidden" is a visibility state (§3, §7).
export default function RemediesPage({ session }) {
  const state = useLoaded(loadServiceIndex);
  const [f, setF] = useState(EMPTY);
  const [sort, setSort] = useState('suggestedAt:desc');
  const [open, setOpen] = useState(null);
  const [tick, setTick] = useState(0);
  const [notify, toastNode] = useToast();
  const set = (p) => setF((s) => ({ ...s, ...p }));

  const all = useMemo(() => {
    const mod = moderationIndex('remedy');
    return (state.data?.remedies ?? []).map((r) => {
      const m = mod.get(r.id) ?? [];
      return m.length ? { ...r, visibility: r.visibility === 'Hidden' || m.some((x) => x.action === 'Hidden') ? 'Hidden' : 'Visible', flagged: m.some((x) => x.action === 'Flagged') } : r;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.data, tick]);
  const types = useMemo(() => [...new Set(all.map((r) => r.serviceType).filter(Boolean))].sort(), [all]);
  const rows = useMemo(() => {
    const q = f.query.trim().toLowerCase();
    const list = all.filter(
      (r) =>
        (f.status === 'all' || r.status === f.status) &&
        (f.visibility === 'all' || r.visibility === f.visibility) &&
        (f.type === 'all' || r.serviceType === f.type) &&
        inRange(r.suggestedAt, f.from, f.to) &&
        (!q || [r.id, r.userId, r.userName, r.astroId, r.astroName, r.serviceId, r.title].some((v) => v.toLowerCase().includes(q)))
    );
    const [k, dir] = sort.split(':');
    const v = (r) => r[k] ?? (dir === 'asc' ? Infinity : -Infinity);
    return list.sort((a, b) => (dir === 'asc' ? v(a) - v(b) : v(b) - v(a)) || a.id.localeCompare(b.id));
  }, [all, f, sort]);
  const paged = usePaged(rows, 10, JSON.stringify(f) + sort);
  const counts = useMemo(() => ({ total: rows.length, hidden: rows.filter((r) => r.visibility === 'Hidden').length, ...Object.fromEntries(STATUSES.map((s) => [s, rows.filter((r) => r.status === s).length])) }), [rows]);

  const columns = [
    { header: 'Remedy ID', value: (r) => r.id, width: 14 },
    { header: 'Remedy', value: (r) => r.title, width: 26 },
    { header: 'User', value: (r) => `${r.userName} (${r.userId})`, width: 26 },
    { header: 'Astrologer', value: (r) => `${r.astroName} (${r.astroId})`, width: 26 },
    { header: 'Related Service', value: (r) => `${r.serviceId} (${r.serviceType ?? ''})`, width: 26 },
    { header: 'Suggested', value: (r) => dt(iso(r.suggestedAt)), width: 20 },
    { header: 'Start (Day 1)', value: (r) => (r.startAt ? dt(iso(r.startAt)) : ''), width: 20 },
    { header: 'Duration (days)', value: (r) => r.duration, width: 10 },
    { header: 'Due', value: (r) => (r.dueAt ? d(iso(r.dueAt)) : ''), width: 14 },
    { header: 'Days Completed', value: (r) => `${r.daysDone} / ${r.daysLogged}`, width: 12 },
    { header: 'Status', value: (r) => r.status, width: 12 },
    { header: 'Visibility', value: (r) => r.visibility, width: 10 },
  ];

  return (
    <div className="users services">
      <PageHead section="Operations" title="Remedies" subtitle="Remedies suggested by astrologers. The duration starts when the user taps Start Remedy (Day 1). Admin is view-only and may flag, review and hide." />
      {state.status === 'loading' && <LoadingState label="Loading remedies" />}
      {state.status === 'error' && <ErrorState message={state.message} />}
      {state.status === 'ready' && (
        <Section
          id="rm-list"
          title="Remedy List"
          description={`Total ${formatNumber(counts.total)} · ${STATUSES.map((s) => `${s} ${formatNumber(counts[s])}`).join(' · ')} · Hidden ${formatNumber(counts.hidden)}`}
          actions={<ExportPair title="Remedies" columns={columns} rows={rows} fileBase="astroconnect-remedies" notify={notify} />}
        >
          <FilterBar canClear={JSON.stringify(f) !== JSON.stringify(EMPTY)} onClear={() => setF(EMPTY)}>
            <SearchFilter label="Search" value={f.query} onChange={(v) => set({ query: v })} placeholder="Remedy ID, User, Astrologer or Service ID" />
            <SelectFilter label="Status" value={f.status} onChange={(v) => set({ status: v })} options={[['all', 'All statuses'], ...STATUSES]} />
            <SelectFilter label="Visibility" value={f.visibility} onChange={(v) => set({ visibility: v })} options={[['all', 'Visible and Hidden'], 'Visible', 'Hidden']} />
            <SelectFilter label="Service Type" value={f.type} onChange={(v) => set({ type: v })} options={[['all', 'All services'], ...types]} />
            <DateFilter label="From" value={f.from} onChange={(v) => set({ from: v })} max={f.to || undefined} />
            <DateFilter label="To" value={f.to} onChange={(v) => set({ to: v })} min={f.from || undefined} />
            <SelectFilter label="Sort by" value={sort} onChange={setSort} options={SORTS} />
          </FilterBar>
          <p className="p-small p-muted">{formatNumber(rows.length)} remedies match.</p>
          <DataTable
            caption="Remedies"
            rows={paged.rows}
            rowKey={(r) => `${r.userId}|${r.id}`}
            onRowClick={setOpen}
            empty={<Empty icon="search" title="No matching remedies" text="Change or clear the filters." />}
            columns={[
              { key: 'id', header: 'Remedy', primary: true, render: (r) => <span className="p-desc"><span className="p-mono">{r.id}</span><span className="p-small">{r.title}</span></span> },
              { key: 'u', header: 'User', render: (r) => <UserLink id={r.userId} name={r.userName} /> },
              { key: 'a', header: 'Astrologer', render: (r) => <AstroLink id={r.astroId} name={r.astroName} tab="remedies" /> },
              { key: 'sv', header: 'Service', render: (r) => <span className="p-desc"><span className="p-mono">{r.serviceId}</span><span className="p-small">{r.serviceType}</span></span> },
              { key: 'p', header: 'Progress', render: (r) => (r.startAt ? <span className="p-desc"><span>{r.daysDone} / {r.daysLogged} days done</span><span className="p-small">Due {d(iso(r.dueAt))}</span></span> : <span className="p-muted">Not started</span>) },
              { key: 'st', header: 'Status', render: (r) => <span className="p-desc"><Pill value={r.status} />{r.visibility === 'Hidden' && <span className="p-small">Hidden</span>}</span> },
              { key: 'd', header: 'Suggested', render: (r) => dt(iso(r.suggestedAt)) },
              { key: 'v', header: 'Details', render: (r) => <ViewButton onClick={() => setOpen(r)} /> },
            ]}
          />
          {paged.pager('remedies')}
        </Section>
      )}
      {open && (
        <RemedyDetails
          key={`${open.id}:${tick}`}
          row={open}
          session={session}
          onChanged={(entry) => {
            setTick((t) => t + 1);
            notify('success', `${open.id}: ${entry.action === 'Hidden' ? 'hidden from the User App' : entry.action.toLowerCase()}. Logged with reason.`);
          }}
          onClose={() => setOpen(null)}
        />
      )}
      {toastNode}
    </div>
  );
}

function RemedyDetails({ row, session, onChanged, onClose }) {
  const details = useMemo(() => remedyDetails(row.userId, row.id), [row]);
  if (!details) {
    return (
      <DetailPanel title={row.id} subtitle="Remedy" onClose={onClose}>
        <p className="p-muted">This remedy could not be loaded.</p>
      </DetailPanel>
    );
  }
  const { user, remedy: r, service: s } = details;
  return (
    <DetailPanel title={r.id} subtitle={`${r.title} · ${r.status}`} onClose={onClose}>
      <Fields
        columns={2}
        items={[
          ['Status', <Pill key="s" value={r.status} />],
          ['Visibility', r.visibility === 'Hidden' ? 'Hidden from the User App' : 'Visible'],
          ['User', <UserLink key="u" id={user.id} name={user.name} />],
          ['Astrologer', <AstroLink key="a" id={r.astrologer.id} name={r.astrologer.name} tab="remedies" />],
          ['Related Service', s ? `${s.id} · ${s.type}` : r.serviceId],
          ['Suggested', dt(r.suggestedAt)],
          ['Start Date (Day 1)', r.startAt ? dt(r.startAt) : 'Not started — duration has not begun'],
          ['Duration', `${r.duration} days`],
          ['Due Date', r.dueAt ? d(r.dueAt) : '—'],
          ['Completed', r.completedAt ? dt(r.completedAt) : '—'],
          ['Instructions', r.instructions, { wide: true }],
        ]}
      />
      <SubHeading>Steps</SubHeading>
      <ol className="p-small">{r.steps.map((st) => <li key={st}>{st}</li>)}</ol>
      <SubHeading>Daily Progress</SubHeading>
      <DataTable
        caption="Daily progress"
        rows={r.progress}
        rowKey={(p) => String(p.day)}
        empty={<p className="p-small p-muted">No daily updates yet.</p>}
        columns={[
          { key: 'd', header: 'Day', primary: true, render: (p) => `Day ${p.day}` },
          { key: 'v', header: 'Update', render: (p) => <Pill value={p.value} /> },
          { key: 'r', header: 'Reason', render: (p) => p.reason || '—' },
          { key: 'at', header: 'Date / Time', render: (p) => dt(p.at) },
        ]}
      />
      <SubHeading>Completion Proof</SubHeading>
      {r.proof.length ? <ul className="p-small">{r.proof.map((p) => <li key={p.name}>{p.type} · {p.name} · {dt(p.at)}</li>)}</ul> : <p className="p-small p-muted">No proof uploaded (optional).</p>}
      <SubHeading>Reminder History</SubHeading>
      <DataTable
        caption="Reminder history"
        rows={[...r.reminders].reverse().slice(0, 10)}
        rowKey={(m) => m.at}
        empty={<p className="p-small p-muted">No reminders sent.</p>}
        columns={[
          { key: 'at', header: 'Date / Time', primary: true, render: (m) => dt(m.at) },
          { key: 't', header: 'Type', render: (m) => `${m.type} · Day ${m.day}` },
          { key: 's', header: 'Status', render: (m) => <Pill value={m.status} /> },
          { key: 'f', header: 'Failure Reason', render: (m) => m.failureReason || '—' },
        ]}
      />
      {r.reminders.length > 10 && <p className="p-small p-muted">Latest 10 of {r.reminders.length} reminders.</p>}
      <SubHeading>Edit / Cancel History</SubHeading>
      {r.history.length ? <ul className="p-small">{r.history.map((h) => <li key={h.at}>{dt(h.at)} · {h.action} by {h.by} — {h.detail}</li>)}</ul> : <p className="p-small p-muted">No edits or cancellations.</p>}
      <ModerationPanel kind="remedy" targetId={r.id} hidden={r.visibility === 'Hidden'} log={r.moderationLog ?? []} session={session} onDone={onChanged} />
      <SubHeading>Timeline</SubHeading>
      <Timeline items={r.timeline} />
    </DetailPanel>
  );
}
