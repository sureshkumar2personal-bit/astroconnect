import { useMemo, useState } from 'react';
import { complaintDetails, loadServiceIndex } from '../../data/serviceIndex.js';
import { DISPUTE_STATUSES } from '../../data/disputesStore.js';
import { NOTE_MAX, addDisputeNote, disputeNotes, evidenceViews, logEvidenceView } from '../../data/disputeActions.js';
import { formatNumber } from '../../components/charts/chartUtils.js';
import { DataTable, DateFilter, DetailPanel, Empty, FilterBar, Fields, Pill, SearchFilter, Section, SelectFilter, SubHeading, Timeline, ViewButton, dt, money, usePaged } from '../UserProfile/components/ui.jsx';
import { AstroLink, ErrorState, ExportPair, LoadingState, NOT_FINALISED, PageHead, UnavailableAction, UserLink, useToast } from '../Services/components/ServiceBits.jsx';
import { inRange, iso, useLoaded } from '../Finance/components/FinanceBits.jsx';
import '../Users/UsersPage.css';
import '../UserProfile/UserProfilePage.css';
import '../Services/ServicesPage.css';

// Documented categories (07 §1): Appointment, Call, Chat, Subscription,
// Payment, Wallet, Login, technical problems.
const CATEGORIES = ['Appointment', 'Call', 'Chat', 'Subscription', 'Payment', 'Wallet', 'Login', 'Technical problem'];
const SORTS = [
  ['raisedAt:desc', 'Newest first'],
  ['raisedAt:asc', 'Oldest first'],
  ['updatedAt:desc', 'Recently updated'],
];
const EMPTY = { query: '', status: 'all', category: 'all', from: '', to: '' };
const PENDING_ACTIONS = [
  ['Resolve / Reject / Close', 'Resolution outcomes and refunds (PP-03)'],
  ['Request More Information / Public Reply / Contact Parties', 'Admin response deadlines (PP-02)'],
  ['Assign / Change Priority', 'Assignees and priority levels are not defined'],
  ['Escalate to Super Admin', 'Escalation flow is not defined'],
];

// Operations → Technical Complaints (07-dispute-complaint-management.md):
// Appointment, Call, Chat, Subscription, Payment, Wallet, Login and technical
// problems — separate from Service Disputes (Text Question answers). The
// same records the User Profile Disputes tab shows (disputesStore.js).
export default function TechnicalComplaintsPage({ session }) {
  const state = useLoaded(loadServiceIndex);
  const [f, setF] = useState(EMPTY);
  const [sort, setSort] = useState('raisedAt:desc');
  const [open, setOpen] = useState(null);
  const [notify, toastNode] = useToast();
  const set = (p) => setF((s) => ({ ...s, ...p }));
  const all = state.data?.complaints ?? [];

  const rows = useMemo(() => {
    const q = f.query.trim().toLowerCase();
    const list = all.filter(
      (c) =>
        (f.status === 'all' || c.status === f.status) &&
        (f.category === 'all' || c.category === f.category) &&
        inRange(c.raisedAt, f.from, f.to) &&
        (!q || [c.id, c.userId, c.userName, c.serviceId ?? ''].some((v) => v.toLowerCase().includes(q)))
    );
    const [k, dir] = sort.split(':');
    return list.sort((a, b) => (dir === 'asc' ? a[k] - b[k] : b[k] - a[k]) || a.id.localeCompare(b.id));
  }, [all, f, sort]);
  const paged = usePaged(rows, 10, JSON.stringify(f) + sort);
  const counts = useMemo(() => DISPUTE_STATUSES.map((s) => [s, all.filter((c) => c.status === s).length]).filter(([, n]) => n), [all]);

  const columns = [
    { header: 'Complaint ID', value: (c) => c.id, width: 14 },
    { header: 'User', value: (c) => `${c.userName} (${c.userId})`, width: 26 },
    { header: 'Category', value: (c) => c.category, width: 16 },
    { header: 'Related Service', value: (c) => (c.serviceId ? `${c.serviceId} (${c.serviceType})` : ''), width: 26 },
    { header: 'Description', value: (c) => c.description, width: 48 },
    { header: 'Status', value: (c) => c.status, width: 18 },
    { header: 'Created', value: (c) => dt(iso(c.raisedAt)), width: 20 },
    { header: 'Last Updated', value: (c) => dt(iso(c.updatedAt)), width: 20 },
  ];

  return (
    <div className="users services">
      <PageHead section="Operations" title="Technical Complaints" subtitle="Service and platform issues: Appointment, Call, Chat, Subscription, Payment, Wallet, Login and technical problems. Text Question answer disputes are under Service Management → Disputes." />
      {state.status === 'loading' && <LoadingState label="Loading complaints" />}
      {state.status === 'error' && <ErrorState message={state.message} />}
      {state.status === 'ready' && (
        <Section
          id="tc-list"
          title="Technical Complaints"
          description={counts.map(([s, n]) => `${s} ${formatNumber(n)}`).join(' · ')}
          actions={<ExportPair title="Technical Complaints" columns={columns} rows={rows} fileBase="astroconnect-technical-complaints" notify={notify} />}
        >
          <FilterBar canClear={JSON.stringify(f) !== JSON.stringify(EMPTY)} onClear={() => setF(EMPTY)}>
            <SearchFilter label="Search" value={f.query} onChange={(v) => set({ query: v })} placeholder="Complaint ID, User name or ID" />
            <SelectFilter label="Status" value={f.status} onChange={(v) => set({ status: v })} options={[['all', 'All statuses'], ...DISPUTE_STATUSES]} />
            <SelectFilter label="Category" value={f.category} onChange={(v) => set({ category: v })} options={[['all', 'All categories'], ...CATEGORIES]} />
            <DateFilter label="From" value={f.from} onChange={(v) => set({ from: v })} max={f.to || undefined} />
            <DateFilter label="To" value={f.to} onChange={(v) => set({ to: v })} min={f.from || undefined} />
            <SelectFilter label="Sort by" value={sort} onChange={setSort} options={SORTS} />
          </FilterBar>
          <p className="p-small p-muted">{formatNumber(rows.length)} complaints match.</p>
          <DataTable
            caption="Technical complaints"
            rows={paged.rows}
            rowKey={(c) => `${c.userId}|${c.id}`}
            onRowClick={setOpen}
            empty={<Empty icon="search" title="No matching complaints" text="Change or clear the filters." />}
            columns={[
              { key: 'id', header: 'Complaint ID', primary: true, render: (c) => <span className="p-mono">{c.id}</span> },
              { key: 'u', header: 'User', render: (c) => <UserLink id={c.userId} name={c.userName} /> },
              { key: 'c', header: 'Category / Issue', className: 'p-wrap', render: (c) => <span className="p-desc"><span>{c.category}</span><span className="p-small">{c.description}</span></span> },
              { key: 's', header: 'Related Service', render: (c) => (c.serviceId ? <span className="p-desc"><span className="p-mono">{c.serviceId}</span><span className="p-small">{c.serviceType}</span></span> : '—') },
              { key: 'st', header: 'Status', render: (c) => <Pill value={c.status} /> },
              { key: 'd', header: 'Created / Updated', render: (c) => <span className="p-desc"><span>{dt(iso(c.raisedAt))}</span><span className="p-small">Updated {dt(iso(c.updatedAt))}</span></span> },
              { key: 'v', header: 'Details', render: (c) => <ViewButton onClick={() => setOpen(c)} /> },
            ]}
          />
          {paged.pager('complaints')}
        </Section>
      )}
      {open && <ComplaintDetails row={open} session={session} notify={notify} onClose={() => setOpen(null)} />}
      {toastNode}
    </div>
  );
}

function ComplaintDetails({ row, session, notify, onClose }) {
  const details = useMemo(() => complaintDetails(row.userId, row.id), [row]);
  const [tick, setTick] = useState(0);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [viewed, setViewed] = useState(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const notes = useMemo(() => disputeNotes(row.id), [row.id, tick]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const views = useMemo(() => evidenceViews(row.id), [row.id, tick]);
  if (!details) {
    return (
      <DetailPanel title={row.id} subtitle="Technical Complaint" onClose={onClose}>
        <p className="p-muted">This complaint could not be loaded.</p>
      </DetailPanel>
    );
  }
  const { user, complaint: c, service: s } = details;
  const adminHistory = [
    ...notes.map((n) => ({ at: n.at, text: `Internal note added by ${n.by.name} (${n.by.role})` })),
    ...views.map((v) => ({ at: v.at, text: `Evidence viewed — ${v.evidence} — by ${v.by.name} (${v.by.role})` })),
  ].sort((a, b) => b.at.localeCompare(a.at));

  function submitNote(ev) {
    ev.preventDefault();
    const result = addDisputeNote(c.id, note, session);
    if (!result.ok) return setError(result.error);
    setNote('');
    setError('');
    setTick((t) => t + 1);
    notify('success', `Internal note added to ${c.id}.`);
  }

  return (
    <DetailPanel title={c.id} subtitle={`Technical Complaint · ${c.category}`} onClose={onClose}>
      <Fields
        columns={2}
        items={[
          ['Status', <Pill key="s" value={c.status} />],
          ['Category', c.category],
          ['User', <UserLink key="u" id={user.id} name={user.name} />],
          ['User Account Status', <Pill key="us" value={user.status} />],
          ['Created', dt(c.raisedAt)],
          ['Last Updated', dt(c.timeline.at(-1)?.at ?? c.raisedAt)],
          ['Response Deadline', `${NOT_FINALISED} (PP-02)`],
        ]}
      />
      <SubHeading>Description and Evidence</SubHeading>
      <ul className="p-evidence">
        {c.evidence.map((e) => (
          <li key={e.label}>
            <span className="p-evidence__type">{e.type}</span>
            {e.type === 'Text' ? (
              <span>{e.value}</span>
            ) : (
              <span className="p-desc">
                <span className="p-file">{e.label} · {e.value}</span>
                {viewed === e.label ? (
                  <span className="p-small">Access recorded. File preview is not available here.</span>
                ) : (
                  <button type="button" className="p-link" onClick={() => { logEvidenceView(c.id, e.label, session); setViewed(e.label); setTick((t) => t + 1); }}>Review evidence</button>
                )}
              </span>
            )}
          </li>
        ))}
      </ul>
      <SubHeading>Related Service</SubHeading>
      {s ? (
        <Fields
          columns={2}
          items={[
            ['Service ID', s.id],
            ['Service Type', s.type],
            ['Astrologer', <AstroLink key="a" id={s.astrologer.id} name={s.astrologer.name} />],
            ['Service Status', s.status],
            ['Booked', dt(s.createdAt)],
            ['Amount', money(s.amount)],
            ['Payment Transactions', (s.payments ?? []).map((p) => p.id).join(', ') || '—', { wide: true }],
          ]}
        />
      ) : (
        <p className="p-muted">No service is linked to this complaint.</p>
      )}
      <SubHeading>Conversation</SubHeading>
      {c.responses.length ? (
        <ul className="p-responses">
          {c.responses.map((x) => (
            <li key={x.at}>
              <p className="p-responses__from">{x.from} · {dt(x.at)}</p>
              <p className="p-responses__text">{x.text}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="p-muted">No responses yet.</p>
      )}
      <SubHeading>Investigation and Resolution</SubHeading>
      <Fields columns={2} items={[['Investigation', c.investigation || 'No investigation recorded yet.', { wide: true }], ['Resolution', c.resolution || 'Not resolved yet.', { wide: true }]]} />
      <SubHeading>Internal Notes</SubHeading>
      <form className="p-stack" onSubmit={submitNote} noValidate>
        <label htmlFor={`note-${c.id}`} className="u-label">Add an internal note (Admin only)</label>
        <textarea id={`note-${c.id}`} className="u-input u-textarea" rows={3} maxLength={NOTE_MAX} value={note} onChange={(e) => { setNote(e.target.value); setError(''); }} />
        {error && <p className="u-field__error" role="alert">{error}</p>}
        <div><button type="submit" className="u-btn u-btn--primary">Add Note</button></div>
      </form>
      {notes.length ? (
        <ul className="p-responses">
          {notes.map((n) => (
            <li key={n.id}>
              <p className="p-responses__from">{n.by.name} · {n.by.role} · {dt(n.at)}</p>
              <p className="p-responses__text">{n.text}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="p-small p-muted">No internal notes.</p>
      )}
      <SubHeading>Other Admin Actions</SubHeading>
      {PENDING_ACTIONS.map(([label, why]) => (
        <UnavailableAction key={label} label={label} reason={`${NOT_FINALISED}: ${why}.`} />
      ))}
      <UnavailableAction label="Refund" reason={`Refund approval: ${NOT_FINALISED} (PC-12, PP-03). Refunds are processed in Finance → Refunds.`} />
      <SubHeading>History</SubHeading>
      <Timeline items={c.timeline} />
      <SubHeading>Admin Activity</SubHeading>
      <Timeline items={adminHistory} />
    </DetailPanel>
  );
}
