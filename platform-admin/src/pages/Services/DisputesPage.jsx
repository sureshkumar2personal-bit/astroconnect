import { useMemo, useState } from 'react';
import { href } from '../../router/useHashRoute.js';
import { loadServiceIndex, serviceDetails, adminQuestionStatus } from '../../data/serviceIndex.js';
import { DISPUTE_STATUSES } from '../../data/disputesStore.js';
import { getAstrologer } from '../../data/astrologerStatus.js';
import { NOTE_MAX, addDisputeNote, disputeNotes, evidenceViews, logEvidenceView } from '../../data/disputeActions.js';
import { formatNumber } from '../../components/charts/chartUtils.js';
import { DataTable, DateFilter, DetailPanel, Empty, FilterBar, Fields, Pill, SearchFilter, Section, SelectFilter, SubHeading, Timeline, ViewButton, dt, money, usePaged } from '../UserProfile/components/ui.jsx';
import { AstroLink, ErrorState, ExportPair, LoadingState, NOT_FINALISED, PageHead, UnavailableAction, UserLink, useToast } from './components/ServiceBits.jsx';
import { inRange, iso, useLoaded } from '../Finance/components/FinanceBits.jsx';
import '../Users/UsersPage.css';
import '../UserProfile/UserProfilePage.css';
import './ServicesPage.css';

const SERVICE_TYPES = ['Text Question'];
const SORTS = [
  ['raisedAt:desc', 'Newest first'],
  ['raisedAt:asc', 'Oldest first'],
  ['updatedAt:desc', 'Recently updated'],
];
const EMPTY = { query: '', status: 'all', type: 'all', category: 'all', from: '', to: '' };

// Documented actions whose rules are still open (07 §5, §6, §10).
const PENDING_ACTIONS = [
  ['Resolve / Reject / Close', 'Status mapping (PC-11) and resolution outcomes (PP-03)'],
  ['Request More Information', 'Status mapping (PC-11)'],
  ['Public Reply / Contact Parties', 'Admin response deadlines (PP-02)'],
  ['Assign / Change Priority', 'Assignees and priority levels are not defined'],
  ['Escalate to Super Admin', 'Escalation flow is not defined'],
];

// Service Management → Disputes (07-dispute-complaint-management.md).
// Service Disputes are Text Question answer disputes only, one per question
// (ruling C5); records are the same ones the User Profile Disputes tab shows.
// Technical Complaints are a separate section (Operations).
export default function DisputesPage({ session, initialQuery = '' }) {
  const state = useLoaded(loadServiceIndex);
  const [f, setF] = useState({ ...EMPTY, query: initialQuery });
  const [sort, setSort] = useState('raisedAt:desc');
  const [open, setOpen] = useState(null);
  const [notify, toastNode] = useToast();
  const set = (p) => setF((s) => ({ ...s, ...p }));
  const all = state.data?.disputes ?? [];
  const categories = useMemo(() => [...new Set(all.map((d) => d.category))].sort(), [all]);

  const rows = useMemo(() => {
    const q = f.query.trim().toLowerCase();
    const list = all.filter(
      (d) =>
        (f.status === 'all' || d.status === f.status) &&
        (f.type === 'all' || d.serviceType === f.type) &&
        (f.category === 'all' || d.category === f.category) &&
        inRange(d.raisedAt, f.from, f.to) &&
        (!q || [d.id, d.userId, d.userName, d.astroId, d.astroName, d.serviceId].some((v) => v.toLowerCase().includes(q)))
    );
    const [k, dir] = sort.split(':');
    return list.sort((a, b) => (dir === 'asc' ? a[k] - b[k] : b[k] - a[k]) || a.id.localeCompare(b.id));
  }, [all, f, sort]);
  const paged = usePaged(rows, 10, JSON.stringify(f) + sort);
  const counts = useMemo(() => DISPUTE_STATUSES.map((s) => [s, all.filter((d) => d.status === s).length]).filter(([, n]) => n), [all]);

  const columns = [
    { header: 'Dispute ID', value: (d) => d.id, width: 14 },
    { header: 'User', value: (d) => `${d.userName} (${d.userId})`, width: 26 },
    { header: 'Astrologer', value: (d) => `${d.astroName} (${d.astroId})`, width: 26 },
    { header: 'Service Type', value: (d) => d.serviceType, width: 13 },
    { header: 'Service ID', value: (d) => d.serviceId, width: 16 },
    { header: 'Category', value: (d) => d.category, width: 18 },
    { header: 'Description', value: (d) => d.description, width: 48 },
    { header: 'Status', value: (d) => d.status, width: 18 },
    { header: 'Created', value: (d) => dt(iso(d.raisedAt)), width: 20 },
    { header: 'Last Updated', value: (d) => dt(iso(d.updatedAt)), width: 20 },
    { header: 'Payment Transaction', value: (d) => d.payIds.join(', '), width: 18 },
    { header: 'Refund ID', value: (d) => d.refundId ?? '', width: 14 },
  ];

  return (
    <div className="users services">
      <PageHead title="Disputes" subtitle="Text Question answer disputes — one per question. The astrologer answers once within 3 days; otherwise the dispute moves to Admin Review." />
      {state.status === 'loading' && <LoadingState label="Loading disputes" />}
      {state.status === 'error' && <ErrorState message={state.message} />}
      {state.status === 'ready' && (
        <Section
          id="ds-list"
          title="Service Disputes"
          description={counts.map(([s, n]) => `${s} ${formatNumber(n)}`).join(' · ')}
          actions={<ExportPair title="Service Disputes" columns={columns} rows={rows} fileBase="astroconnect-disputes" notify={notify} />}
        >
          <FilterBar canClear={JSON.stringify(f) !== JSON.stringify(EMPTY)} onClear={() => setF(EMPTY)}>
            <SearchFilter label="Search" value={f.query} onChange={(v) => set({ query: v })} placeholder="Dispute ID, User, Astrologer or Service ID" />
            <SelectFilter label="Status" value={f.status} onChange={(v) => set({ status: v })} options={[['all', 'All statuses'], ...DISPUTE_STATUSES]} />
            <SelectFilter label="Service Type" value={f.type} onChange={(v) => set({ type: v })} options={[['all', 'All services'], ...SERVICE_TYPES]} />
            <SelectFilter label="Category" value={f.category} onChange={(v) => set({ category: v })} options={[['all', 'All categories'], ...categories]} />
            <DateFilter label="From" value={f.from} onChange={(v) => set({ from: v })} max={f.to || undefined} />
            <DateFilter label="To" value={f.to} onChange={(v) => set({ to: v })} min={f.from || undefined} />
            <SelectFilter label="Sort by" value={sort} onChange={setSort} options={SORTS} />
          </FilterBar>
          <p className="p-small p-muted">{formatNumber(rows.length)} disputes match.</p>
          <DataTable
            caption="Service disputes"
            rows={paged.rows}
            onRowClick={setOpen}
            empty={<Empty icon="search" title="No matching disputes" text="Change or clear the filters." />}
            columns={[
              { key: 'id', header: 'Dispute ID', primary: true, render: (d) => <span className="p-mono">{d.id}</span> },
              { key: 'u', header: 'User', render: (d) => <UserLink id={d.userId} name={d.userName} /> },
              { key: 'a', header: 'Astrologer', render: (d) => <AstroLink id={d.astroId} name={d.astroName} /> },
              { key: 's', header: 'Service', render: (d) => <span className="p-desc"><span className="p-mono">{d.serviceId}</span><span className="p-small">{d.serviceType}</span></span> },
              { key: 'r', header: 'Reason', className: 'p-wrap', render: (d) => <span className="p-desc"><span>{d.description}</span><span className="p-small">{d.category}</span></span> },
              { key: 'st', header: 'Status', render: (d) => <Pill value={d.status} /> },
              { key: 'd', header: 'Created / Updated', render: (d) => <span className="p-desc"><span>{dt(iso(d.raisedAt))}</span><span className="p-small">Updated {dt(iso(d.updatedAt))}</span></span> },
              { key: 'v', header: 'Details', render: (d) => <ViewButton onClick={() => setOpen(d)} /> },
            ]}
          />
          {paged.pager('disputes')}
          <p className="p-small p-muted">Platform Complaints about a dispute answer (AD-42): placement {NOT_FINALISED.toLowerCase()} (PP-23). Technical Complaints are handled under Operations.</p>
        </Section>
      )}
      {open && <DisputeDetails row={open} session={session} snapshot={state.data.snapshot} notify={notify} onClose={() => setOpen(null)} />}
      {toastNode}
    </div>
  );
}

function DisputeDetails({ row, session, snapshot, notify, onClose }) {
  const details = useMemo(() => serviceDetails(row.userId, row.serviceId), [row]);
  const astrologer = useMemo(() => getAstrologer(row.astroId), [row]);
  const [tick, setTick] = useState(0);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [viewing, setViewing] = useState(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const notes = useMemo(() => disputeNotes(row.id), [row.id, tick]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const views = useMemo(() => evidenceViews(row.id), [row.id, tick]);
  if (!details?.dispute) {
    return (
      <DetailPanel title={row.id} subtitle="Service Dispute" onClose={onClose}>
        <p className="p-muted">This dispute could not be loaded.</p>
      </DetailPanel>
    );
  }
  const { user, service: s, dispute: d, transactions, refund } = details;
  const walletTx = transactions.filter((t) => t.serviceType !== 'Refund');
  const directPays = (s.payments ?? []).filter((p) => p.method !== 'Wallet');
  const adminHistory = [
    ...notes.map((n) => ({ at: n.at, text: `Internal note added by ${n.by.name} (${n.by.role})` })),
    ...views.map((v) => ({ at: v.at, text: `Evidence viewed — ${v.evidence} — by ${v.by.name} (${v.by.role})` })),
  ].sort((a, b) => b.at.localeCompare(a.at));

  function review(e) {
    logEvidenceView(d.id, e.label, session);
    setViewing(e.label);
    setTick((t) => t + 1);
  }
  function submitNote(ev) {
    ev.preventDefault();
    const result = addDisputeNote(d.id, note, session);
    if (!result.ok) return setError(result.error);
    setNote('');
    setError('');
    setTick((t) => t + 1);
    notify('success', `Internal note added to ${d.id}.`);
  }

  return (
    <DetailPanel title={d.id} subtitle={`Service Dispute · ${s.id}`} onClose={onClose}>
      <Fields
        columns={2}
        items={[
          ['Status', <Pill key="s" value={d.status} />],
          ['Category', d.category],
          ['Created', dt(d.raisedAt)],
          ['Last Updated', dt(d.timeline.at(-1)?.at ?? d.raisedAt)],
          ['Astrologer Answer Due', `${dt(d.deadline)} (3 days, AD-41)`],
          ['Status Mapping', `${NOT_FINALISED} (PC-11)`],
        ]}
      />
      <SubHeading>Reason and Evidence</SubHeading>
      <ul className="p-evidence">
        {d.evidence.map((e) => (
          <li key={e.label}>
            <span className="p-evidence__type">{e.type}</span>
            {e.type === 'Text' ? (
              <span>{e.value}</span>
            ) : (
              <span className="p-desc">
                <span className="p-file">{e.label} · {e.value}</span>
                {viewing === e.label ? (
                  <span className="p-small">Access recorded. File preview is not available here.</span>
                ) : (
                  <button type="button" className="p-link" onClick={() => review(e)}>Review evidence</button>
                )}
              </span>
            )}
          </li>
        ))}
      </ul>
      <p className="p-small p-muted">Each evidence access is recorded (who, which evidence, when).</p>

      <SubHeading>User and Astrologer</SubHeading>
      <Fields
        columns={2}
        items={[
          ['User', <UserLink key="u" id={user.id} name={user.name} />],
          ['User Account Status', <Pill key="us" value={user.status} />],
          ['Astrologer', <AstroLink key="a" id={row.astroId} name={astrologer?.name ?? row.astroName} />],
          ['Astrologer Account Status', astrologer ? <Pill key="as" value={astrologer.status} /> : '—'],
        ]}
      />

      <SubHeading>Text Question</SubHeading>
      <Fields
        columns={2}
        items={[
          ['Text Question ID', s.id],
          ['Question Status', adminQuestionStatus(s, d, snapshot)],
          ['Asked', dt(s.createdAt)],
          ['Answered', s.answeredAt ? dt(s.answeredAt) : '—'],
          ['Amount Paid', money(s.amount)],
          ['Question', s.question, { wide: true }],
          ['Answer', s.answer ?? '—', { wide: true }],
        ]}
      />

      <SubHeading>Original Payment</SubHeading>
      <DataTable
        caption="Payment for this question"
        rows={[
          ...walletTx.map((t) => ({ id: t.id, method: 'Wallet', amount: t.debit, status: t.status, at: t.at, ref: t.gatewayRef })),
          ...directPays.map((p) => ({ id: p.id, method: p.method, amount: p.amount, status: refund?.originalTx === p.id ? 'Refunded' : 'Success', at: p.at, ref: p.gatewayRef })),
        ]}
        empty={<p className="p-muted">No payment recorded.</p>}
        columns={[
          { key: 'id', header: 'Transaction ID', primary: true, render: (p) => <span className="p-mono">{p.id}</span> },
          { key: 'm', header: 'Method', render: (p) => p.method },
          { key: 'a', header: 'Amount', className: 'is-num', render: (p) => money(p.amount) },
          { key: 's', header: 'Status', render: (p) => <Pill value={p.status} /> },
          { key: 'd', header: 'Date / Time', render: (p) => dt(p.at) },
        ]}
      />
      <p className="p-small"><a className="u-name" href={href('/finance/payment-transactions')}>Open Payment Transactions</a></p>

      <SubHeading>Refund</SubHeading>
      {refund ? (
        <Fields
          columns={2}
          items={[
            ['Refund ID', <a key="r" className="u-name p-mono" href={href('/finance/refunds', refund.id)}>{refund.id}</a>],
            ['Amount', money(refund.amount)],
            ['Original Transaction', refund.originalTx],
            ['Wallet Credit Transaction', refund.creditTx],
            ['Processed', dt(refund.processedAt)],
            ['Reason', refund.reason],
          ]}
        />
      ) : (
        <p className="p-muted">No refund exists for this question.</p>
      )}
      <UnavailableAction label="Approve Refund" reason={`Refund approval: ${NOT_FINALISED} (PC-12, PP-03). Refunds are processed in Finance → Refunds.`} />

      <SubHeading>Conversation</SubHeading>
      {d.responses.length ? (
        <ul className="p-responses">
          {d.responses.map((x) => (
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
      <Fields columns={2} items={[['Investigation', d.investigation || 'No investigation recorded yet.', { wide: true }], ['Resolution', d.resolution || 'Not resolved yet.', { wide: true }]]} />

      <SubHeading>Internal Notes</SubHeading>
      <form className="p-stack" onSubmit={submitNote} noValidate>
        <label htmlFor={`note-${d.id}`} className="u-label">Add an internal note (Admin only)</label>
        <textarea id={`note-${d.id}`} className="u-input u-textarea" rows={3} maxLength={NOTE_MAX} value={note} onChange={(e) => { setNote(e.target.value); setError(''); }} />
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

      <SubHeading>History</SubHeading>
      <Timeline items={d.timeline} />
      <SubHeading>Admin Activity</SubHeading>
      <Timeline items={adminHistory} />
    </DetailPanel>
  );
}
