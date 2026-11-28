import { useMemo, useState } from 'react';
import { SERVICE_TYPES, groupTotals, loadRevenueData, monthOf } from '../../data/revenueData.js';
import { formatNumber } from '../../components/charts/chartUtils.js';
import { DataTable, DateFilter, DetailPanel, Empty, FilterBar, Fields, Pill, SearchFilter, Section, SelectFilter, ViewButton, dt, monthLabel, money, usePaged } from '../UserProfile/components/ui.jsx';
import { AstroLink, ErrorState, ExportPair, LoadingState, NOT_FINALISED, UserLink, useToast } from '../Services/components/ServiceBits.jsx';
import { FinanceHead, inRange, iso, useLoaded } from './components/FinanceBits.jsx';
import '../Users/UsersPage.css';
import '../UserProfile/UserProfilePage.css';
import '../Services/ServicesPage.css';

const EMPTY = { query: '', type: 'all', from: '', to: '' };
const SORTS = [
  ['at:desc', 'Newest first'],
  ['at:asc', 'Oldest first'],
  ['gross:desc', 'Amount (highest)'],
  ['gross:asc', 'Amount (lowest)'],
];
const commissionCell = (g) => (g.commissionUnknown === g.count ? NOT_FINALISED : `${money(g.commission)}${g.commissionUnknown ? ` (+ ${formatNumber(g.commissionUnknown)} not finalised)` : ''}`);
const RATE = { 'Instant Call': '2%', 'Instant Chat': '2%', Appointment: '3%', 'Text Question': NOT_FINALISED, Subscription: NOT_FINALISED };

// Finance → Service Revenue: what users paid for services (Payment
// Transactions), refunds credited back to the wallet, and net revenue.
// Commission only at confirmed rates; Text Questions / Subscriptions: PP-09.
export default function ServiceRevenuePage() {
  const state = useLoaded(loadRevenueData);
  const [f, setF] = useState(EMPTY);
  const [sort, setSort] = useState('at:desc');
  const [open, setOpen] = useState(null);
  const [notify, toastNode] = useToast();
  const set = (p) => setF((s) => ({ ...s, ...p }));
  const all = state.data?.services ?? [];

  const inPeriod = useMemo(() => all.filter((s) => (f.type === 'all' || s.type === f.type) && inRange(s.at, f.from, f.to)), [all, f.type, f.from, f.to]);
  const byType = useMemo(() => {
    const g = groupTotals(inPeriod, (s) => s.type);
    return SERVICE_TYPES.filter((t) => g.has(t)).map((t) => g.get(t));
  }, [inPeriod]);
  const total = useMemo(() => groupTotals(inPeriod, () => 'Total').get('Total'), [inPeriod]);
  const byMonth = useMemo(() => [...groupTotals(inPeriod, (s) => monthOf(s.at)).values()].sort((a, b) => b.key.localeCompare(a.key)), [inPeriod]);
  const months = usePaged(byMonth, 12, JSON.stringify(f));
  const records = useMemo(() => {
    const q = f.query.trim().toLowerCase();
    const list = q ? inPeriod.filter((s) => s.serviceId.toLowerCase().includes(q) || s.userId.toLowerCase().includes(q) || s.userName.toLowerCase().includes(q) || (s.astroId ?? '').toLowerCase().includes(q) || (s.astroName ?? '').toLowerCase().includes(q)) : [...inPeriod];
    const [k, dir] = sort.split(':');
    return list.sort((a, b) => (dir === 'asc' ? a[k] - b[k] : b[k] - a[k]) || a.serviceId.localeCompare(b.serviceId));
  }, [inPeriod, f.query, sort]);
  const paged = usePaged(records, 10, JSON.stringify(f) + sort);

  const typeCols = [
    { header: 'Service', value: (g) => g.key, width: 16 },
    { header: 'Services', value: (g) => g.count, width: 10 },
    { header: 'Gross Paid', value: (g) => g.gross, width: 14 },
    { header: 'Refunded', value: (g) => g.refunded, width: 12 },
    { header: 'Net Revenue', value: (g) => g.net, width: 14 },
    { header: 'Commission Rate', value: (g) => RATE[g.key] ?? '', width: 14 },
    { header: 'Platform Commission', value: (g) => (g.commissionUnknown === g.count ? NOT_FINALISED : g.commission), width: 16 },
    { header: 'Astrologer Net', value: (g) => (g.commissionUnknown === g.count ? NOT_FINALISED : g.astroNet), width: 14 },
  ];
  const recordCols = [
    { header: 'Service ID', value: (s) => s.serviceId, width: 16 },
    { header: 'Service Type', value: (s) => s.type, width: 14 },
    { header: 'User', value: (s) => `${s.userName} (${s.userId})`, width: 26 },
    { header: 'Astrologer', value: (s) => (s.astroId ? `${s.astroName} (${s.astroId})` : ''), width: 26 },
    { header: 'Date / Time', value: (s) => dt(iso(s.at)), width: 20 },
    { header: 'Gross Paid', value: (s) => s.gross, width: 12 },
    { header: 'Refunded', value: (s) => s.refunded, width: 10 },
    { header: 'Net Revenue', value: (s) => s.net, width: 12 },
    { header: 'Platform Commission', value: (s) => s.commission ?? NOT_FINALISED, width: 16 },
    { header: 'Payment Transactions', value: (s) => s.payments.join(', '), width: 30 },
  ];

  return (
    <div className="users services">
      <FinanceHead title="Service Revenue" subtitle="Amounts users paid for services, refunds credited back to the wallet, and net revenue. Commission is shown only for confirmed rates." />
      {state.status === 'loading' && <LoadingState label="Calculating service revenue" />}
      {state.status === 'error' && <ErrorState message={state.message} />}
      {state.status === 'ready' && (
        <>
          <FilterBar canClear={JSON.stringify(f) !== JSON.stringify(EMPTY)} onClear={() => setF(EMPTY)}>
            <SelectFilter label="Service Type" value={f.type} onChange={(v) => set({ type: v })} options={[['all', 'All services'], ...SERVICE_TYPES]} />
            <DateFilter label="From" value={f.from} onChange={(v) => set({ from: v })} max={f.to || undefined} />
            <DateFilter label="To" value={f.to} onChange={(v) => set({ to: v })} min={f.from || undefined} />
          </FilterBar>
          <Section
            id="sr-type"
            title="Revenue by Service"
            description="Gross = payments for services (wallet and direct). Refunds are counted once, by their wallet credit. Wallet top-ups are not service revenue."
            actions={<ExportPair title="Service Revenue by Service" columns={typeCols} rows={total ? [...byType, total] : byType} fileBase="astroconnect-service-revenue" notify={notify} />}
          >
            <DataTable
              caption="Revenue by service"
              rows={total ? [...byType, total] : []}
              rowKey={(g) => g.key}
              empty={<Empty title="No revenue in this period" />}
              columns={[
                { key: 'k', header: 'Service', primary: true, render: (g) => (g.key === 'Total' ? <strong>Total</strong> : g.key) },
                { key: 'c', header: 'Services', className: 'is-num', render: (g) => formatNumber(g.count) },
                { key: 'g', header: 'Gross Paid', className: 'is-num', render: (g) => money(g.gross) },
                { key: 'r', header: 'Refunded', className: 'is-num', render: (g) => money(g.refunded) },
                { key: 'n', header: 'Net Revenue', className: 'is-num', render: (g) => <strong>{money(g.net)}</strong> },
                { key: 'rate', header: 'Rate', render: (g) => RATE[g.key] ?? 'Confirmed rates only' },
                { key: 'cm', header: 'Platform Commission', className: 'is-num', render: (g) => commissionCell(g) },
              ]}
            />
          </Section>
          <Section id="sr-month" title="Monthly Revenue" actions={<ExportPair title="Monthly Service Revenue" columns={[{ header: 'Month', value: (g) => monthLabel(g.key), width: 18 }, ...typeCols.slice(1, 5), typeCols[6]]} rows={byMonth} fileBase="astroconnect-monthly-revenue" notify={notify} />}>
            <DataTable
              caption="Monthly revenue"
              rows={months.rows}
              rowKey={(g) => g.key}
              empty={<Empty title="No revenue in this period" />}
              columns={[
                { key: 'm', header: 'Month', primary: true, render: (g) => monthLabel(g.key) },
                { key: 'c', header: 'Services', className: 'is-num', render: (g) => formatNumber(g.count) },
                { key: 'g', header: 'Gross Paid', className: 'is-num', render: (g) => money(g.gross) },
                { key: 'r', header: 'Refunded', className: 'is-num', render: (g) => money(g.refunded) },
                { key: 'n', header: 'Net Revenue', className: 'is-num', render: (g) => money(g.net) },
                { key: 'cm', header: 'Platform Commission', className: 'is-num', render: (g) => commissionCell(g) },
              ]}
            />
            {months.pager('months')}
          </Section>
          <Section id="sr-records" title="Service Revenue Records" actions={<ExportPair title="Service Revenue Records" columns={recordCols} rows={records} fileBase="astroconnect-service-revenue-records" notify={notify} />}>
            <FilterBar>
              <SearchFilter label="Search" value={f.query} onChange={(v) => set({ query: v })} placeholder="Service ID, User or Astrologer" />
              <SelectFilter label="Sort by" value={sort} onChange={setSort} options={SORTS} />
            </FilterBar>
            <p className="p-small p-muted">{formatNumber(records.length)} services match.</p>
            <DataTable
              caption="Service revenue records"
              rows={paged.rows}
              rowKey={(s) => s.serviceId}
              onRowClick={setOpen}
              empty={<Empty title="No matching services" text="Change or clear the filters." />}
              columns={[
                { key: 'id', header: 'Service ID', primary: true, render: (s) => <span className="p-desc"><span className="p-mono">{s.serviceId}</span><span className="p-small">{s.type}</span></span> },
                { key: 'u', header: 'User', render: (s) => <UserLink id={s.userId} name={s.userName} /> },
                { key: 'a', header: 'Astrologer', render: (s) => (s.astroId ? <AstroLink id={s.astroId} name={s.astroName} /> : '—') },
                { key: 'g', header: 'Gross Paid', className: 'is-num', render: (s) => money(s.gross) },
                { key: 'r', header: 'Refunded', className: 'is-num', render: (s) => (s.refunded ? money(s.refunded) : '—') },
                { key: 'c', header: 'Commission', className: 'is-num', render: (s) => (s.commission === null ? <span className="p-muted">{NOT_FINALISED}</span> : money(s.commission)) },
                { key: 'd', header: 'Date / Time', render: (s) => dt(iso(s.at)) },
                { key: 'v', header: 'Details', render: (s) => <ViewButton onClick={() => setOpen(s)} /> },
              ]}
            />
            {paged.pager('services')}
          </Section>
        </>
      )}
      {open && <RevenueDetails s={open} onClose={() => setOpen(null)} />}
      {toastNode}
    </div>
  );
}

export function RevenueDetails({ s, onClose }) {
  return (
    <DetailPanel title={s.serviceId} subtitle={`${s.type} · ${s.userName} (${s.userId})`} onClose={onClose}>
      <Fields
        columns={2}
        items={[
          ['Service Type', s.type],
          ['Date / Time', dt(iso(s.at))],
          ['User', <UserLink key="u" id={s.userId} name={s.userName} />],
          ['Astrologer', s.astroId ? <AstroLink key="a" id={s.astroId} name={s.astroName} tab="wallet" /> : '—'],
          ['Gross Paid', money(s.gross)],
          ['Refunded to Wallet', s.refunded ? money(s.refunded) : '—'],
          ['Net Revenue', money(s.net)],
          ['Commission', s.commission === null ? NOT_FINALISED : `${money(s.commission)} · ${s.commissionNote}`],
          ['Astrologer Net Earnings', s.astroNet === null ? NOT_FINALISED : money(s.astroNet)],
          ['Earnings Status', s.earningsStatus ? <Pill key="e" value={s.earningsStatus} /> : '—'],
          ['Payment Transactions', s.payments.join(', '), { wide: true }],
          ['Refund Credit Transactions', s.refundIds.length ? s.refundIds.join(', ') : '—', { wide: true }],
        ]}
      />
    </DetailPanel>
  );
}
