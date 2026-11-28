import { useMemo, useState } from 'react';
import { loadAstroFinanceIndex } from '../../data/astroFinanceIndex.js';
import { formatNumber } from '../../components/charts/chartUtils.js';
import { DataTable, DateFilter, DetailPanel, Empty, FilterBar, Fields, Pill, SearchFilter, Section, SelectFilter, SubHeading, ViewButton, dt, money, usePaged } from '../UserProfile/components/ui.jsx';
import { AstroLink, ErrorState, ExportPair, LoadingState, NOT_FINALISED, UnavailableAction, useToast } from '../Services/components/ServiceBits.jsx';
import { FinanceHead, inRange, iso, useLoaded } from './components/FinanceBits.jsx';
import '../Users/UsersPage.css';
import '../UserProfile/UserProfilePage.css';
import '../Services/ServicesPage.css';

// Approved payout rules (Astrologer AD-125, AD-126).
export const PAYOUT_MIN = 500;
const STATUSES = ['Pending', 'Processing', 'Paid', 'Failed'];
const METHODS = ['Bank Account', 'UPI'];
const SORTS = [
  ['requestedAt:desc', 'Newest first'],
  ['requestedAt:asc', 'Oldest first'],
  ['amount:desc', 'Amount (highest)'],
  ['amount:asc', 'Amount (lowest)'],
];
const EMPTY = { query: '', status: 'all', method: 'all', from: '', to: '' };

// Finance → Payouts (Payout Requests): astrologer withdrawal requests, read
// from the same wallet records as the Astrologer Profile. View only — the
// Admin steps for moving a payout through its statuses are not documented.
export default function PayoutRequestsPage() {
  const state = useLoaded(loadAstroFinanceIndex);
  const [f, setF] = useState(EMPTY);
  const [sort, setSort] = useState('requestedAt:desc');
  const [open, setOpen] = useState(null);
  const [notify, toastNode] = useToast();
  const set = (p) => setF((s) => ({ ...s, ...p }));
  const all = state.data?.payouts ?? [];

  const rows = useMemo(() => {
    const q = f.query.trim().toLowerCase();
    const list = all.filter(
      (r) =>
        (f.status === 'all' || r.status === f.status) &&
        (f.method === 'all' || r.method === f.method) &&
        inRange(r.requestedAt, f.from, f.to) &&
        (!q || r.id.toLowerCase().includes(q) || r.astroId.toLowerCase().includes(q) || r.astroName.toLowerCase().includes(q))
    );
    const [k, dir] = sort.split(':');
    return list.sort((a, b) => (dir === 'asc' ? a[k] - b[k] : b[k] - a[k]) || a.id.localeCompare(b.id));
  }, [all, f, sort]);
  const paged = usePaged(rows, 10, JSON.stringify(f) + sort);
  const counts = useMemo(() => Object.fromEntries(STATUSES.map((s) => [s, all.filter((r) => r.status === s).length])), [all]);

  const columns = [
    { header: 'Payout Request ID', value: (r) => r.id, width: 16 },
    { header: 'Astrologer', value: (r) => `${r.astroName} (${r.astroId})`, width: 28 },
    { header: 'Requested Amount', value: (r) => r.amount, width: 14 },
    { header: 'Payout Method', value: (r) => r.method, width: 14 },
    { header: 'Request Date', value: (r) => dt(iso(r.requestedAt)), width: 20 },
    { header: 'Status', value: (r) => r.status, width: 11 },
    { header: 'Payout Reference', value: (r) => r.reference ?? '', width: 18 },
    { header: 'Paid On', value: (r) => (r.paidAt ? dt(iso(r.paidAt)) : ''), width: 20 },
    { header: 'Failure Reason', value: (r) => r.failureReason, width: 30 },
    { header: 'Wallet Transaction', value: (r) => r.walletTx ?? '', width: 16 },
  ];

  return (
    <div className="users services">
      <FinanceHead title="Payout Requests" subtitle="Astrologer withdrawal requests. Minimum ₹500 · Bank Account or UPI · processing target within 3 working days · earnings released on Tuesday and Friday." />
      {state.status === 'loading' && <LoadingState label="Loading payout requests" />}
      {state.status === 'error' && <ErrorState message={state.message} />}
      {state.status === 'ready' && (
        <Section
          id="po-list"
          title="Payout Requests"
          description={STATUSES.map((s) => `${s} ${formatNumber(counts[s])}`).join(' · ')}
          actions={<ExportPair title="Payout Requests" columns={columns} rows={rows} fileBase="astroconnect-payout-requests" notify={notify} />}
        >
          <FilterBar canClear={JSON.stringify(f) !== JSON.stringify(EMPTY)} onClear={() => setF(EMPTY)}>
            <SearchFilter label="Search" value={f.query} onChange={(v) => set({ query: v })} placeholder="Astrologer name or ID, Payout ID" />
            <SelectFilter label="Status" value={f.status} onChange={(v) => set({ status: v })} options={[['all', 'All statuses'], ...STATUSES]} />
            <SelectFilter label="Payout Method" value={f.method} onChange={(v) => set({ method: v })} options={[['all', 'All methods'], ...METHODS]} />
            <DateFilter label="From" value={f.from} onChange={(v) => set({ from: v })} max={f.to || undefined} />
            <DateFilter label="To" value={f.to} onChange={(v) => set({ to: v })} min={f.from || undefined} />
            <SelectFilter label="Sort by" value={sort} onChange={setSort} options={SORTS} />
          </FilterBar>
          <p className="p-small p-muted">{formatNumber(rows.length)} requests match.</p>
          <DataTable
            caption="Payout requests"
            rows={paged.rows}
            onRowClick={setOpen}
            empty={<Empty title="No matching payout requests" text="Change or clear the filters." />}
            columns={[
              { key: 'id', header: 'Payout ID', primary: true, render: (r) => <span className="p-mono">{r.id}</span> },
              { key: 'a', header: 'Astrologer', render: (r) => <AstroLink id={r.astroId} name={r.astroName} tab="wallet" /> },
              { key: 'amt', header: 'Amount', className: 'is-num', render: (r) => money(r.amount) },
              { key: 'm', header: 'Method', render: (r) => r.method },
              { key: 'd', header: 'Requested', render: (r) => dt(iso(r.requestedAt)) },
              { key: 's', header: 'Status', render: (r) => <Pill value={r.status} /> },
              { key: 'ref', header: 'Reference', render: (r) => <span className="p-mono">{r.reference ?? '—'}</span> },
              { key: 'v', header: 'Details', render: (r) => <ViewButton onClick={() => setOpen(r)} /> },
            ]}
          />
          {paged.pager('requests')}
        </Section>
      )}
      {open && <PayoutDetails row={open} history={all.filter((r) => r.astroId === open.astroId).sort((a, b) => b.requestedAt - a.requestedAt)} onOpen={setOpen} onClose={() => setOpen(null)} />}
      {toastNode}
    </div>
  );
}

const STATUS_NOTE = {
  Pending: 'Requested; awaiting Platform verification.',
  Processing: 'Platform verification completed; payout in progress.',
  Paid: 'Paid to the astrologer’s account.',
  Failed: 'Payout failed; the amount was returned to the Available Balance.',
};

function PayoutDetails({ row: r, history, onOpen, onClose }) {
  const paged = usePaged(history, 5, r.astroId);
  return (
    <DetailPanel title={r.id} subtitle={`Payout request · ${r.astroName} (${r.astroId})`} onClose={onClose}>
      <Fields
        columns={2}
        items={[
          ['Status', <Pill key="s" value={r.status} />],
          ['Requested Amount', money(r.amount)],
          ['Astrologer', <AstroLink key="a" id={r.astroId} name={r.astroName} tab="wallet" />],
          ['Payout Method', r.method],
          ['Request Date', dt(iso(r.requestedAt))],
          ['Processing Target', `${dt(iso(r.targetAt))} (3 working days)`],
          ['Paid On', r.paidAt ? dt(iso(r.paidAt)) : '—'],
          ['Payout Reference', r.reference ?? '—'],
          ['Wallet Transaction', r.walletTx ?? '—'],
          ['Minimum Payout', `${money(PAYOUT_MIN)} · ${r.amount >= PAYOUT_MIN ? 'met' : 'not met'}`],
          ['Status Meaning', STATUS_NOTE[r.status], { wide: true }],
          ...(r.failureReason ? [['Failure Reason', r.failureReason, { wide: true }]] : []),
        ]}
      />
      <UnavailableAction label="Update Payout Status" reason={`Admin payout processing steps: ${NOT_FINALISED}.`} />
      <SubHeading>Payout History · {r.astroName}</SubHeading>
      <DataTable
        caption="Payout history for this astrologer"
        rows={paged.rows}
        columns={[
          { key: 'id', header: 'Payout ID', primary: true, render: (h) => (h.id === r.id ? <strong className="p-mono">{h.id}</strong> : <button type="button" className="p-link" onClick={() => onOpen(h)}>{h.id}</button>) },
          { key: 'd', header: 'Requested', render: (h) => dt(iso(h.requestedAt)) },
          { key: 'a', header: 'Amount', className: 'is-num', render: (h) => money(h.amount) },
          { key: 's', header: 'Status', render: (h) => <Pill value={h.status} /> },
        ]}
      />
      {paged.pager('requests')}
    </DetailPanel>
  );
}
