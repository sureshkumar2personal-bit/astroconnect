import { useMemo, useState } from 'react';
import { affectsBalance, CATEGORIES } from '../../data/walletIndex.js';
import { loadWalletIndex } from '../../data/walletIndex.js';
import { loadAstroFinanceIndex } from '../../data/astroFinanceIndex.js';
import { SERVICE_TYPES, loadRevenueData, monthOf } from '../../data/revenueData.js';
import { formatNumber } from '../../components/charts/chartUtils.js';
import { DataTable, DateFilter, Empty, FilterBar, Pill, SearchFilter, Section, SelectFilter, dt, monthLabel, money, usePaged } from '../UserProfile/components/ui.jsx';
import { ErrorState, ExportPair, LoadingState, NOT_FINALISED, useToast } from '../Services/components/ServiceBits.jsx';
import { FinanceHead, inRange, iso, useLoaded } from './components/FinanceBits.jsx';
import '../Users/UsersPage.css';
import '../UserProfile/UserProfilePage.css';
import '../Services/ServicesPage.css';

const astro = (r) => (r.astroId ? `${r.astroName} (${r.astroId})` : '—');
const user = (r) => `${r.userName} (${r.userId})`;
const sum = (rows, fn) => rows.reduce((t, r) => t + (fn(r) ?? 0), 0);
const isCompletedWallet = (r) => (r.direct ? r.status !== 'Failed' : affectsBalance(r));

// Each report reads the same records as its Finance page; nothing is
// recalculated. `measures` are summed per group; a measure returning null for
// a row (for example an unconfirmed commission) is left out and counted as
// "not finalised".
const REPORTS = {
  revenue: {
    label: 'Service Revenue',
    page: 'Service Revenue',
    load: () => loadRevenueData(),
    rows: (d) => d.services,
    id: (r) => r.serviceId,
    date: (r) => r.at,
    search: (r) => [r.serviceId, r.userId, r.userName, r.astroId ?? '', r.astroName ?? ''],
    filters: [{ key: 'type', label: 'Service Type', options: SERVICE_TYPES, test: (r, v) => r.type === v }],
    groups: { service: (r) => r.type, astrologer: astro, month: (r) => monthOf(r.at) },
    measures: [
      { key: 'gross', label: 'Gross Paid', value: (r) => r.gross },
      { key: 'refunded', label: 'Refunded', value: (r) => r.refunded },
      { key: 'net', label: 'Net Revenue', value: (r) => r.net },
      { key: 'commission', label: 'Platform Commission', value: (r) => r.commission },
    ],
    columns: [
      { header: 'Service ID', value: (r) => r.serviceId, width: 16 },
      { header: 'Service Type', value: (r) => r.type, width: 14 },
      { header: 'User', value: user, width: 26 },
      { header: 'Astrologer', value: astro, width: 26 },
      { header: 'Date / Time', value: (r) => dt(iso(r.at)), width: 20 },
      { header: 'Gross Paid', value: (r) => r.gross, width: 12, money: true },
      { header: 'Refunded', value: (r) => r.refunded, width: 11, money: true },
      { header: 'Net Revenue', value: (r) => r.net, width: 12, money: true },
      { header: 'Platform Commission', value: (r) => r.commission ?? NOT_FINALISED, width: 16, money: true },
    ],
    sorts: [['at', 'Date'], ['gross', 'Gross Paid']],
  },
  earnings: {
    label: 'Astrologer Earnings',
    page: 'Astrologer Earnings',
    load: () => loadAstroFinanceIndex(),
    rows: (d) => d.earnings,
    id: (r) => r.id,
    date: (r) => r.at,
    search: (r) => [r.astroId, r.astroName, r.serviceId, r.id],
    filters: [
      { key: 'type', label: 'Service Type', options: SERVICE_TYPES.slice(0, 4), test: (r, v) => r.serviceType === v },
      { key: 'status', label: 'Earnings Status', options: ['Held', 'Awaiting release', 'Released', NOT_FINALISED], test: (r, v) => r.status === v },
    ],
    groups: { service: (r) => r.serviceType, astrologer: astro, month: (r) => monthOf(r.at), status: (r) => r.status },
    measures: [
      { key: 'gross', label: 'Gross', value: (r) => r.gross },
      { key: 'commission', label: 'Platform Commission', value: (r) => r.commission },
      { key: 'net', label: 'Astrologer Net', value: (r) => r.net },
    ],
    columns: [
      { header: 'Earnings ID', value: (r) => r.id, width: 20 },
      { header: 'Astrologer', value: astro, width: 26 },
      { header: 'Service Type', value: (r) => r.serviceType, width: 14 },
      { header: 'Service ID', value: (r) => r.serviceId, width: 16 },
      { header: 'Date / Time', value: (r) => dt(iso(r.at)), width: 20 },
      { header: 'Gross', value: (r) => r.gross, width: 11, money: true },
      { header: 'Commission', value: (r) => r.commission ?? NOT_FINALISED, width: 13, money: true },
      { header: 'Net Earnings', value: (r) => r.net ?? NOT_FINALISED, width: 13, money: true },
      { header: 'Earnings Status', value: (r) => r.status, width: 16, pill: true },
    ],
    sorts: [['at', 'Date'], ['gross', 'Gross']],
  },
  commission: {
    label: 'Platform Commission',
    page: 'Platform Commission',
    load: () => loadAstroFinanceIndex(),
    rows: (d) => d.earnings,
    id: (r) => r.id,
    date: (r) => r.bookedAt,
    search: (r) => [r.astroId, r.astroName, r.serviceId],
    filters: [{ key: 'type', label: 'Service Type', options: SERVICE_TYPES.slice(0, 4), test: (r, v) => r.serviceType === v }],
    groups: { service: (r) => r.serviceType, astrologer: astro, month: (r) => monthOf(r.bookedAt), completion: (r) => (r.status === 'Held' ? 'Not yet completed (Held)' : 'Completed') },
    measures: [
      { key: 'gross', label: 'Gross (confirmed rates)', value: (r) => (r.commission === null ? null : r.gross) },
      { key: 'commission', label: 'Platform Commission', value: (r) => r.commission },
    ],
    columns: [
      { header: 'Service ID', value: (r) => r.serviceId, width: 16 },
      { header: 'Service Type', value: (r) => r.serviceType, width: 14 },
      { header: 'Astrologer', value: astro, width: 26 },
      { header: 'Booked', value: (r) => dt(iso(r.bookedAt)), width: 20 },
      { header: 'Gross', value: (r) => r.gross, width: 11, money: true },
      { header: 'Rate', value: (r) => (r.rate === null ? NOT_FINALISED : `${Math.round(r.rate * 100)}%`), width: 12 },
      { header: 'Platform Commission', value: (r) => r.commission ?? NOT_FINALISED, width: 16, money: true },
    ],
    sorts: [['bookedAt', 'Date'], ['gross', 'Gross']],
  },
  refunds: {
    label: 'Refunds',
    page: 'Refunds',
    load: () => loadWalletIndex(),
    rows: (d) => d.rows.filter((r) => r.category === 'Refund'),
    id: (r) => r.id,
    date: (r) => r.at,
    search: (r) => [r.refundId ?? '', r.id, r.originalTx ?? '', r.serviceId ?? '', r.userId, r.userName],
    filters: [{ key: 'type', label: 'Service Type', options: SERVICE_TYPES, test: (r, v) => r.refundServiceType === v }],
    groups: { service: (r) => r.refundServiceType ?? '—', astrologer: astro, month: (r) => monthOf(r.at) },
    measures: [{ key: 'amount', label: 'Refunded to Wallet', value: (r) => r.credit }],
    columns: [
      { header: 'Refund ID', value: (r) => r.refundId ?? '', width: 16 },
      { header: 'User', value: user, width: 26 },
      { header: 'Service', value: (r) => `${r.serviceId ?? ''} ${r.refundServiceType ?? ''}`.trim(), width: 26 },
      { header: 'Astrologer', value: astro, width: 26 },
      { header: 'Refund Date', value: (r) => dt(iso(r.at)), width: 20 },
      { header: 'Amount', value: (r) => r.credit, width: 11, money: true },
      { header: 'Original Transaction', value: (r) => r.originalTx ?? '', width: 16 },
      { header: 'Credit Transaction', value: (r) => r.id, width: 16 },
      { header: 'Reason', value: (r) => r.refundReason ?? '', width: 30 },
    ],
    sorts: [['at', 'Date'], ['credit', 'Amount']],
  },
  settlements: {
    label: 'Settlements',
    page: 'Settlements',
    load: () => loadAstroFinanceIndex(),
    rows: (d) => d.settlements,
    id: (r) => `${r.astroId}|${r.id}`,
    date: (r) => r.at,
    search: (r) => [r.id, r.astroId, r.astroName],
    filters: [{ key: 'day', label: 'Run Day', options: ['Tuesday', 'Friday'], test: (r, v) => new Date(r.at).toLocaleDateString('en-IN', { weekday: 'long' }) === v }],
    groups: { astrologer: astro, month: (r) => monthOf(r.at), day: (r) => new Date(r.at).toLocaleDateString('en-IN', { weekday: 'long' }) },
    measures: [
      { key: 'services', label: 'Services', value: (r) => r.count, plain: true },
      { key: 'gross', label: 'Gross', value: (r) => r.gross },
      { key: 'commission', label: 'Commission', value: (r) => r.commission },
      { key: 'net', label: 'Net Released', value: (r) => r.net },
    ],
    columns: [
      { header: 'Settlement ID', value: (r) => r.id, width: 16 },
      { header: 'Astrologer', value: astro, width: 26 },
      { header: 'Settlement Run', value: (r) => dt(iso(r.at)), width: 20 },
      { header: 'Services', value: (r) => r.count, width: 9 },
      { header: 'Gross', value: (r) => r.gross, width: 11, money: true },
      { header: 'Commission', value: (r) => r.commission, width: 12, money: true },
      { header: 'Net Released', value: (r) => r.net, width: 13, money: true },
      { header: 'Wallet Transaction', value: (r) => r.walletTx ?? '', width: 16 },
    ],
    sorts: [['at', 'Date'], ['net', 'Net Released']],
  },
  payouts: {
    label: 'Payout Requests',
    page: 'Payout Requests',
    load: () => loadAstroFinanceIndex(),
    rows: (d) => d.payouts,
    id: (r) => r.id,
    date: (r) => r.requestedAt,
    search: (r) => [r.id, r.astroId, r.astroName],
    filters: [
      { key: 'status', label: 'Payout Status', options: ['Pending', 'Processing', 'Paid', 'Failed'], test: (r, v) => r.status === v },
      { key: 'method', label: 'Payout Method', options: ['Bank Account', 'UPI'], test: (r, v) => r.method === v },
    ],
    groups: { status: (r) => r.status, astrologer: astro, month: (r) => monthOf(r.requestedAt), method: (r) => r.method },
    measures: [
      { key: 'requested', label: 'Requested', value: (r) => r.amount },
      { key: 'paid', label: 'Paid', value: (r) => (r.status === 'Paid' ? r.amount : 0) },
      { key: 'progress', label: 'In Progress (Pending / Processing)', value: (r) => (r.status === 'Pending' || r.status === 'Processing' ? r.amount : 0) },
      { key: 'failed', label: 'Failed (returned to Available)', value: (r) => (r.status === 'Failed' ? r.amount : 0) },
    ],
    columns: [
      { header: 'Payout Request ID', value: (r) => r.id, width: 16 },
      { header: 'Astrologer', value: astro, width: 26 },
      { header: 'Amount', value: (r) => r.amount, width: 11, money: true },
      { header: 'Method', value: (r) => r.method, width: 13 },
      { header: 'Requested', value: (r) => dt(iso(r.requestedAt)), width: 20 },
      { header: 'Status', value: (r) => r.status, width: 11, pill: true },
      { header: 'Reference', value: (r) => r.reference ?? '', width: 16 },
    ],
    sorts: [['requestedAt', 'Date'], ['amount', 'Amount']],
  },
  wallet: {
    label: 'Wallet Transactions',
    page: 'Payment Transactions',
    load: () => loadWalletIndex(),
    rows: (d) => d.rows,
    id: (r) => r.id,
    date: (r) => r.at,
    search: (r) => [r.id, r.userId, r.userName, r.serviceId ?? ''],
    filters: [
      { key: 'category', label: 'Transaction Type', options: CATEGORIES, test: (r, v) => r.category === v },
      { key: 'status', label: 'Status', options: ['Success', 'Pending', 'Failed', 'Reversed', 'Refunded'], test: (r, v) => r.status === v },
    ],
    groups: { type: (r) => r.category, status: (r) => r.status, month: (r) => monthOf(r.at) },
    measures: [
      { key: 'credits', label: 'Completed Credits', value: (r) => (r.credit && isCompletedWallet(r) ? r.credit : 0) },
      { key: 'debits', label: 'Completed Debits', value: (r) => (r.debit && isCompletedWallet(r) ? r.debit : 0) },
      { key: 'notDone', label: 'Pending / Failed / Reversed (not counted)', value: (r) => (isCompletedWallet(r) ? 0 : (r.credit ?? r.debit ?? 0)) },
    ],
    columns: [
      { header: 'Transaction ID', value: (r) => r.id, width: 18 },
      { header: 'User', value: user, width: 26 },
      { header: 'Type', value: (r) => r.category, width: 16 },
      { header: 'Credit', value: (r) => r.credit ?? '', width: 11, money: true },
      { header: 'Debit', value: (r) => r.debit ?? '', width: 11, money: true },
      { header: 'Status', value: (r) => r.status, width: 11, pill: true },
      { header: 'Date / Time', value: (r) => dt(iso(r.at)), width: 20 },
      { header: 'Method', value: (r) => r.method ?? '', width: 13 },
    ],
    sorts: [['at', 'Date']],
  },
};

const GROUP_LABELS = { service: 'Service Type', astrologer: 'Astrologer', month: 'Month', status: 'Status', completion: 'Completion', day: 'Run Day', method: 'Payout Method', type: 'Transaction Type' };

// Finance → Financial Reports (06-payments-finance.md §8): reports by service,
// period, astrologer, commission, refunds, settlements and payouts, plus wallet
// transactions. Each report uses the same records as its Finance page.
export default function FinancialReportsPage() {
  const [key, setKey] = useState('revenue');
  return (
    <div className="users services">
      <FinanceHead title="Financial Reports" subtitle="Reports built from the same records as the Finance pages. Only completed transactions are counted as financial activity." />
      <FilterBar>
        <SelectFilter label="Report" value={key} onChange={setKey} options={Object.entries(REPORTS).map(([k, r]) => [k, r.label])} />
      </FilterBar>
      <Report key={key} reportKey={key} def={REPORTS[key]} />
    </div>
  );
}

function Report({ reportKey, def }) {
  const state = useLoaded(def.load);
  const groupKeys = Object.keys(def.groups);
  const empty = { query: '', from: '', to: '', group: groupKeys[0], ...Object.fromEntries(def.filters.map((x) => [x.key, 'all'])) };
  const [f, setF] = useState(empty);
  const [sort, setSort] = useState(`${def.sorts[0][0]}:desc`);
  const [notify, toastNode] = useToast();
  const set = (p) => setF((s) => ({ ...s, ...p }));
  const all = useMemo(() => (state.data ? def.rows(state.data) : []), [state.data, def]);

  const rows = useMemo(() => {
    const q = f.query.trim().toLowerCase();
    const list = all.filter(
      (r) =>
        inRange(def.date(r), f.from, f.to) &&
        def.filters.every((x) => f[x.key] === 'all' || x.test(r, f[x.key])) &&
        (!q || def.search(r).some((v) => v.toLowerCase().includes(q)))
    );
    const [k, dir] = sort.split(':');
    return list.sort((a, b) => (dir === 'asc' ? (a[k] ?? 0) - (b[k] ?? 0) : (b[k] ?? 0) - (a[k] ?? 0)) || def.id(a).localeCompare(def.id(b)));
  }, [all, f, sort, def]);

  const summary = useMemo(() => {
    const groupFn = def.groups[f.group];
    const map = new Map();
    const add = (k, r) => {
      const g = map.get(k) ?? { key: k, count: 0, unknown: 0, ...Object.fromEntries(def.measures.map((m) => [m.key, 0])) };
      g.count += 1;
      for (const m of def.measures) {
        const v = m.value(r);
        if (v === null || v === undefined) {
          if (m.key === 'commission') g.unknown += 1;
        } else g[m.key] += v;
      }
      map.set(k, g);
    };
    for (const r of rows) {
      add(groupFn(r), r);
      add('__total', r);
    }
    const total = map.get('__total');
    map.delete('__total');
    const list = [...map.values()].sort((a, b) => (f.group === 'month' ? b.key.localeCompare(a.key) : f.group === 'astrologer' ? b[def.measures[0].key] - a[def.measures[0].key] : String(a.key).localeCompare(String(b.key))));
    return { list, total };
  }, [rows, f.group, def]);
  const groups = usePaged(summary.list, 10, JSON.stringify(f));
  const paged = usePaged(rows, 10, JSON.stringify(f) + sort);

  const groupLabel = (k) => (f.group === 'month' ? monthLabel(k) : k);
  const fmt = (m, g) => (m.plain ? formatNumber(g[m.key]) : m.key === 'commission' && g.unknown === g.count ? NOT_FINALISED : money(g[m.key]));
  const summaryCols = [
    { header: GROUP_LABELS[f.group], value: (g) => (g.key === 'Total' ? 'Total' : groupLabel(g.key)), width: 26 },
    { header: 'Records', value: (g) => g.count, width: 10 },
    ...def.measures.map((m) => ({ header: m.label, value: (g) => (m.key === 'commission' && g.unknown === g.count ? NOT_FINALISED : g[m.key]), width: 16 })),
    ...(def.measures.some((m) => m.key === 'commission') ? [{ header: 'Commission not finalised (records)', value: (g) => g.unknown, width: 16 }] : []),
  ];
  const totalRow = summary.total ? { ...summary.total, key: 'Total' } : null;

  if (state.status === 'loading') return <LoadingState label={`Preparing ${def.label} report`} />;
  if (state.status === 'error') return <ErrorState message={state.message} />;
  return (
    <>
      <FilterBar canClear={JSON.stringify(f) !== JSON.stringify(empty)} onClear={() => setF(empty)}>
        <DateFilter label="From" value={f.from} onChange={(v) => set({ from: v })} max={f.to || undefined} />
        <DateFilter label="To" value={f.to} onChange={(v) => set({ to: v })} min={f.from || undefined} />
        {def.filters.map((x) => (
          <SelectFilter key={x.key} label={x.label} value={f[x.key]} onChange={(v) => set({ [x.key]: v })} options={[['all', 'All'], ...x.options]} />
        ))}
        <SearchFilter label="Search" value={f.query} onChange={(v) => set({ query: v })} placeholder="ID, name or service" />
        <SelectFilter label="Group by" value={f.group} onChange={(v) => set({ group: v })} options={groupKeys.map((g) => [g, GROUP_LABELS[g]])} />
      </FilterBar>
      <Section
        id={`fr-summary-${reportKey}`}
        title={`${def.label} — Summary`}
        description={`${formatNumber(rows.length)} records. Totals match Finance → ${def.page} for the same filters.`}
        actions={<ExportPair title={`${def.label} Report — Summary by ${GROUP_LABELS[f.group]}`} columns={summaryCols} rows={totalRow ? [...summary.list, totalRow] : []} fileBase={`astroconnect-report-${reportKey}-summary`} notify={notify} />}
      >
        <DataTable
          caption={`${def.label} summary`}
          rows={totalRow ? [...groups.rows, ...(groups.rows.length ? [totalRow] : [])] : []}
          rowKey={(g) => String(g.key)}
          empty={<Empty icon="finance" title="No records for these filters" text="Change or clear the filters." />}
          columns={[
            { key: 'k', header: GROUP_LABELS[f.group], primary: true, render: (g) => (g.key === 'Total' ? <strong>Total (all groups)</strong> : groupLabel(g.key)) },
            { key: 'c', header: 'Records', className: 'is-num', render: (g) => formatNumber(g.count) },
            ...def.measures.map((m) => ({ key: m.key, header: m.label, className: 'is-num', render: (g) => (g.key === 'Total' ? <strong>{fmt(m, g)}</strong> : fmt(m, g)) })),
          ]}
        />
        {groups.pager('groups')}
        {def.measures.some((m) => m.key === 'commission') && summary.total?.unknown > 0 && (
          <p className="p-small p-muted">{formatNumber(summary.total.unknown)} records have no commission: Text Question / Subscription rate not finalised (PP-09).</p>
        )}
      </Section>
      <Section
        id={`fr-detail-${reportKey}`}
        title={`${def.label} — Records`}
        actions={<ExportPair title={`${def.label} Report — Records`} columns={def.columns} rows={rows} fileBase={`astroconnect-report-${reportKey}-records`} notify={notify} />}
      >
        <FilterBar>
          <SelectFilter label="Sort by" value={sort} onChange={setSort} options={def.sorts.flatMap(([k, l]) => [[`${k}:desc`, `${l} (newest / highest)`], [`${k}:asc`, `${l} (oldest / lowest)`]])} />
        </FilterBar>
        <DataTable
          caption={`${def.label} records`}
          rows={paged.rows}
          rowKey={def.id}
          empty={<Empty title="No records for these filters" />}
          columns={def.columns.map((c, i) => ({
            key: `c${i}`,
            header: c.header,
            primary: i === 0,
            className: c.money ? 'is-num' : undefined,
            render: (r) => {
              const v = c.value(r);
              if (c.pill) return <Pill value={v} />;
              if (c.money && typeof v === 'number') return money(v);
              return v === '' ? '—' : v;
            },
          }))}
        />
        {paged.pager('records')}
      </Section>
      {toastNode}
    </>
  );
}
