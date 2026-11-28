import { useMemo, useState } from 'react';
import { loadAstroFinanceIndex } from '../../data/astroFinanceIndex.js';
import { formatNumber } from '../../components/charts/chartUtils.js';
import { DataTable, DateFilter, DetailPanel, Empty, FilterBar, Fields, Pill, SearchFilter, Section, SelectFilter, SubHeading, ViewButton, dt, money, usePaged } from '../UserProfile/components/ui.jsx';
import { AstroLink, ErrorState, ExportPair, LoadingState, NOT_FINALISED, UserLink, useToast } from '../Services/components/ServiceBits.jsx';
import { FinanceHead, inRange, iso, useLoaded } from './components/FinanceBits.jsx';
import '../Users/UsersPage.css';
import '../UserProfile/UserProfilePage.css';
import '../Services/ServicesPage.css';

const TYPES = ['Text Question', 'Appointment', 'Instant Call', 'Instant Chat'];
const STATUSES = ['Held', 'Awaiting release', 'Released', NOT_FINALISED];
const SORTS = [
  ['at:desc', 'Newest first'],
  ['at:asc', 'Oldest first'],
  ['gross:desc', 'Gross (highest)'],
  ['gross:asc', 'Gross (lowest)'],
];
const EMPTY = { query: '', type: 'all', status: 'all', from: '', to: '' };
const rateLabel = (r) => (r.rate === null ? NOT_FINALISED : `${Math.round(r.rate * 100)}%`);
const amt = (v) => (v === null || v === undefined ? NOT_FINALISED : money(v));
const STATUS_NOTE = {
  Held: 'Service not yet completed (AD-126).',
  'Awaiting release': 'Completed; released in the next Tuesday / Friday settlement after 3 days.',
  Released: 'Released in a Tuesday / Friday settlement to the Available Balance.',
  [NOT_FINALISED]: 'Completed. Release date not finalised (Instant Call / Chat — PP-10); Text Question commission not finalised (PP-09).',
};

// Finance → Astrologer Earnings. One record per astrologer service, read from
// the same wallet records as the Astrologer Profile Wallet tab. Commission and
// net earnings are calculated only for confirmed rates (Call / Chat 2%,
// Appointment 3%); Text Question figures stay "Not finalised" (PP-09).
export default function AstrologerEarningsPage() {
  const state = useLoaded(loadAstroFinanceIndex);
  const [f, setF] = useState(EMPTY);
  const [sort, setSort] = useState('at:desc');
  const [open, setOpen] = useState(null);
  const [notify, toastNode] = useToast();
  const set = (p) => setF((s) => ({ ...s, ...p }));
  const all = state.data?.earnings ?? [];

  const rows = useMemo(() => {
    const q = f.query.trim().toLowerCase();
    const list = all.filter(
      (r) =>
        (f.type === 'all' || r.serviceType === f.type) &&
        (f.status === 'all' || r.status === f.status) &&
        inRange(r.at, f.from, f.to) &&
        (!q || r.astroId.toLowerCase().includes(q) || r.astroName.toLowerCase().includes(q) || r.serviceId.toLowerCase().includes(q) || r.id.toLowerCase().includes(q))
    );
    const [k, dir] = sort.split(':');
    return list.sort((a, b) => (dir === 'asc' ? a[k] - b[k] : b[k] - a[k]) || a.id.localeCompare(b.id));
  }, [all, f, sort]);
  const paged = usePaged(rows, 10, JSON.stringify(f) + sort);

  // Totals for the filtered records; commission / net only where the rate is confirmed.
  const totals = useMemo(() => {
    const known = rows.filter((r) => r.rate !== null);
    const s = (list, k) => list.reduce((t, r) => t + (r[k] ?? 0), 0);
    return { gross: s(rows, 'gross'), knownGross: s(known, 'gross'), commission: s(known, 'commission'), net: s(known, 'net'), unknown: rows.length - known.length };
  }, [rows]);

  const columns = [
    { header: 'Earnings ID', value: (r) => r.id, width: 20 },
    { header: 'Astrologer', value: (r) => `${r.astroName} (${r.astroId})`, width: 28 },
    { header: 'Service Type', value: (r) => r.serviceType, width: 14 },
    { header: 'Service ID', value: (r) => r.serviceId, width: 16 },
    { header: 'Gross Amount', value: (r) => r.gross, width: 12 },
    { header: 'Commission Rate', value: rateLabel, width: 13 },
    { header: 'Platform Commission', value: (r) => r.commission ?? NOT_FINALISED, width: 14 },
    { header: 'Net Earnings', value: (r) => r.net ?? NOT_FINALISED, width: 13 },
    { header: 'Earnings Status', value: (r) => r.status, width: 16 },
    { header: 'Date / Time', value: (r) => dt(iso(r.at)), width: 20 },
    { header: 'Payment Transactions', value: (r) => r.payments.map((p) => p.id).join(', '), width: 30 },
  ];

  return (
    <div className="users services">
      <FinanceHead title="Astrologer Earnings" subtitle="Earnings from astrologer services. Commission: Instant Call 2%, Instant Chat 2%, Appointment 3% on the amount the user paid; Text Question commission is not finalised." />
      {state.status === 'loading' && <LoadingState label="Calculating astrologer earnings" />}
      {state.status === 'error' && <ErrorState message={state.message} />}
      {state.status === 'ready' && (
        <Section
          id="ae-list"
          title="Earnings Records"
          description={`Gross ${money(totals.gross)} · Commission ${money(totals.commission)} · Net ${money(totals.net)} (confirmed rates only${totals.unknown ? `; ${formatNumber(totals.unknown)} Text Question records not finalised` : ''})`}
          actions={<ExportPair title="Astrologer Earnings" columns={columns} rows={rows} fileBase="astroconnect-astrologer-earnings" notify={notify} />}
        >
          <FilterBar canClear={JSON.stringify(f) !== JSON.stringify(EMPTY)} onClear={() => setF(EMPTY)}>
            <SearchFilter label="Search" value={f.query} onChange={(v) => set({ query: v })} placeholder="Astrologer name or ID, Service ID" />
            <SelectFilter label="Service Type" value={f.type} onChange={(v) => set({ type: v })} options={[['all', 'All services'], ...TYPES]} />
            <SelectFilter label="Earnings Status" value={f.status} onChange={(v) => set({ status: v })} options={[['all', 'All statuses'], ...STATUSES]} />
            <DateFilter label="From" value={f.from} onChange={(v) => set({ from: v })} max={f.to || undefined} />
            <DateFilter label="To" value={f.to} onChange={(v) => set({ to: v })} min={f.from || undefined} />
            <SelectFilter label="Sort by" value={sort} onChange={setSort} options={SORTS} />
          </FilterBar>
          <p className="p-small p-muted">{formatNumber(rows.length)} records match.</p>
          <DataTable
            caption="Astrologer earnings"
            rows={paged.rows}
            onRowClick={setOpen}
            empty={<Empty title="No matching earnings" text="Change or clear the filters." />}
            columns={[
              { key: 'svc', header: 'Service ID', primary: true, render: (r) => <span className="p-desc"><span className="p-mono">{r.serviceId}</span><span className="p-small">{r.serviceType}</span></span> },
              { key: 'a', header: 'Astrologer', render: (r) => <AstroLink id={r.astroId} name={r.astroName} tab="wallet" /> },
              { key: 'g', header: 'Gross', className: 'is-num', render: (r) => money(r.gross) },
              { key: 'c', header: 'Commission', className: 'is-num', render: (r) => (r.rate === null ? <span className="p-muted">{NOT_FINALISED}</span> : <span className="p-desc"><span>{money(r.commission)}</span><span className="p-small">{rateLabel(r)}</span></span>) },
              { key: 'n', header: 'Net Earnings', className: 'is-num', render: (r) => (r.net === null ? <span className="p-muted">{NOT_FINALISED}</span> : money(r.net)) },
              { key: 's', header: 'Status', render: (r) => <Pill value={r.status} /> },
              { key: 'd', header: 'Date / Time', render: (r) => dt(iso(r.at)) },
              { key: 'v', header: 'Details', render: (r) => <ViewButton onClick={() => setOpen(r)} /> },
            ]}
          />
          {paged.pager('records')}
        </Section>
      )}
      {open && <EarningsDetails row={open} onClose={() => setOpen(null)} />}
      {toastNode}
    </div>
  );
}

function EarningsDetails({ row: r, onClose }) {
  return (
    <DetailPanel title={r.id} subtitle={`${r.serviceType} · ${r.astroName} (${r.astroId})`} onClose={onClose}>
      <Fields
        columns={2}
        items={[
          ['Earnings Status', <Pill key="s" value={r.status} />],
          ['Date / Time', dt(iso(r.at))],
          ['Astrologer', <AstroLink key="a" id={r.astroId} name={r.astroName} tab="wallet" />],
          ['User', <UserLink key="u" id={r.userId} name={r.userName} />],
          ['Service Type', r.serviceType],
          ['Service ID', r.serviceId],
          ['Service Status', r.serviceStatus],
          ['Booked', dt(iso(r.bookedAt))],
          ['Completed', r.completedAt ? dt(iso(r.completedAt)) : 'Not yet completed'],
          ['Status Meaning', STATUS_NOTE[r.status] ?? '—', { wide: true }],
        ]}
      />
      <SubHeading>Calculation</SubHeading>
      <Fields
        columns={2}
        items={[
          ['Gross (amount the user paid)', money(r.gross)],
          ['Commission Rate', rateLabel(r)],
          ['Platform Commission', amt(r.commission)],
          ['Astrologer Net Earnings', amt(r.net)],
          ['Settlement Release', r.releaseAt ? dt(iso(r.releaseAt)) : r.serviceType === 'Appointment' ? 'After completion + 3 days, next Tuesday / Friday' : NOT_FINALISED],
          ['Settlement ID', r.settlementId ?? '—'],
        ]}
      />
      <SubHeading>Payment Transactions</SubHeading>
      <DataTable
        caption="Payment transactions for this service"
        rows={r.payments}
        columns={[
          { key: 'id', header: 'Transaction ID', primary: true, render: (p) => <span className="p-mono">{p.id}</span> },
          { key: 'm', header: 'Method', render: (p) => p.method },
          { key: 'a', header: 'Amount', className: 'is-num', render: (p) => money(p.amount) },
          { key: 'd', header: 'Date / Time', render: (p) => dt(iso(p.at)) },
        ]}
      />
      <p className="p-small p-muted">The same transactions appear in Finance → Payment Transactions and in the user’s Wallet. Pending Balance is not finalised (PP-11).</p>
    </DetailPanel>
  );
}
