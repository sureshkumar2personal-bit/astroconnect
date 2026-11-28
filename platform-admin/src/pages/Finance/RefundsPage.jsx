import { useMemo, useState } from 'react';
import { loadWalletIndex } from '../../data/walletIndex.js';
import { formatNumber } from '../../components/charts/chartUtils.js';
import { DataTable, DateFilter, DetailPanel, Empty, FilterBar, Fields, Pill, SearchFilter, Section, SelectFilter, SubHeading, ViewButton, dt, money, usePaged } from '../UserProfile/components/ui.jsx';
import { AstroLink, ErrorState, ExportPair, LoadingState, NOT_FINALISED, UnavailableAction, UserLink, useToast } from '../Services/components/ServiceBits.jsx';
import { FinanceHead, inRange, iso, useLoaded } from './components/FinanceBits.jsx';
import '../Users/UsersPage.css';
import '../UserProfile/UserProfilePage.css';
import '../Services/ServicesPage.css';

const EMPTY = { query: '', type: 'all', from: '', to: '' };
const SORTS = [
  ['at:desc', 'Newest first'],
  ['at:asc', 'Oldest first'],
  ['amount:desc', 'Amount (highest)'],
  ['amount:asc', 'Amount (lowest)'],
];

// Finance → Refunds (Refund Management). Every refund is one wallet credit
// linked to its original payment (06-payments-finance.md §5); the original
// shows status Refunded. Records come from the same wallet records as Payment
// Transactions and the User Profile. Refund approval actions stay unavailable:
// Super Admin approval of automatic refunds (PC-12) and dispute / complaint
// refunds (PP-03) are not finalised.
export default function RefundsPage({ initialQuery = '' }) {
  const state = useLoaded(loadWalletIndex);
  const [f, setF] = useState({ ...EMPTY, query: initialQuery });
  const [sort, setSort] = useState('at:desc');
  const [open, setOpen] = useState(null);
  const [notify, toastNode] = useToast();
  const set = (p) => setF((s) => ({ ...s, ...p }));

  const all = useMemo(() => {
    const rows = state.data?.rows ?? [];
    const byKey = new Map(rows.map((r) => [`${r.userId}|${r.id}`, r]));
    return rows
      .filter((r) => r.category === 'Refund')
      .map((r) => {
        const original = byKey.get(`${r.userId}|${r.originalTx}`) ?? null;
        return { ...r, amount: r.credit, original, serviceTypeOf: r.refundServiceType ?? original?.serviceType ?? '—' };
      });
  }, [state.data]);
  const types = useMemo(() => [...new Set(all.map((r) => r.serviceTypeOf))].sort(), [all]);
  const rows = useMemo(() => {
    const q = f.query.trim().toLowerCase();
    const list = all.filter(
      (r) =>
        (f.type === 'all' || r.serviceTypeOf === f.type) &&
        inRange(r.at, f.from, f.to) &&
        (!q || [r.refundId, r.id, r.originalTx, r.serviceId, r.userId, r.userName].some((v) => (v ?? '').toLowerCase().includes(q)))
    );
    const [k, dir] = sort.split(':');
    return list.sort((a, b) => (dir === 'asc' ? a[k] - b[k] : b[k] - a[k]) || a.id.localeCompare(b.id));
  }, [all, f, sort]);
  const paged = usePaged(rows, 10, JSON.stringify(f) + sort);
  const total = useMemo(() => rows.reduce((t, r) => t + r.amount, 0), [rows]);

  const columns = [
    { header: 'Refund ID', value: (r) => r.refundId ?? '', width: 16 },
    { header: 'User', value: (r) => `${r.userName} (${r.userId})`, width: 26 },
    { header: 'Service Type', value: (r) => r.serviceTypeOf, width: 14 },
    { header: 'Service ID', value: (r) => r.serviceId ?? '', width: 16 },
    { header: 'Astrologer', value: (r) => (r.astroId ? `${r.astroName} (${r.astroId})` : ''), width: 26 },
    { header: 'Refund Amount', value: (r) => r.amount, width: 12 },
    { header: 'Reason', value: (r) => r.refundReason ?? '', width: 30 },
    { header: 'Refund Date', value: (r) => dt(iso(r.at)), width: 20 },
    { header: 'Status', value: (r) => r.status, width: 10 },
    { header: 'Original Transaction', value: (r) => r.originalTx ?? '', width: 16 },
    { header: 'Original Status', value: (r) => r.original?.status ?? '', width: 12 },
    { header: 'Wallet Credit Transaction', value: (r) => r.id, width: 18 },
  ];

  return (
    <div className="users services">
      <FinanceHead title="Refunds" subtitle="Refunds credited to user wallets. Each refund is credited once and stays linked to its original payment." />
      {state.status === 'loading' && <LoadingState label="Loading refunds" />}
      {state.status === 'error' && <ErrorState message={state.message} />}
      {state.status === 'ready' && (
        <Section
          id="rf-list"
          title="Refund Records"
          description={`${formatNumber(rows.length)} refunds · ${money(total)} credited to wallets. Approval of automatic refunds (PC-12) and dispute / complaint refunds (PP-03): ${NOT_FINALISED}.`}
          actions={<ExportPair title="Refunds" columns={columns} rows={rows} fileBase="astroconnect-refunds" notify={notify} />}
        >
          <FilterBar canClear={JSON.stringify(f) !== JSON.stringify(EMPTY)} onClear={() => setF(EMPTY)}>
            <SearchFilter label="Search" value={f.query} onChange={(v) => set({ query: v })} placeholder="Refund, Transaction, Service or User" />
            <SelectFilter label="Service Type" value={f.type} onChange={(v) => set({ type: v })} options={[['all', 'All services'], ...types]} />
            <DateFilter label="From" value={f.from} onChange={(v) => set({ from: v })} max={f.to || undefined} />
            <DateFilter label="To" value={f.to} onChange={(v) => set({ to: v })} min={f.from || undefined} />
            <SelectFilter label="Sort by" value={sort} onChange={setSort} options={SORTS} />
          </FilterBar>
          <p className="p-small p-muted">{formatNumber(rows.length)} refunds match.</p>
          <DataTable
            caption="Refund records"
            rows={paged.rows}
            onRowClick={setOpen}
            empty={<Empty icon="finance" title="No matching refunds" text="Change or clear the filters." />}
            columns={[
              { key: 'id', header: 'Refund ID', primary: true, render: (r) => <span className="p-mono">{r.refundId}</span> },
              { key: 'u', header: 'User', render: (r) => <UserLink id={r.userId} name={r.userName} /> },
              { key: 's', header: 'Service', render: (r) => <span className="p-desc"><span className="p-mono">{r.serviceId}</span><span className="p-small">{r.serviceTypeOf}</span></span> },
              { key: 'a', header: 'Amount', className: 'is-num', render: (r) => <span className="p-credit">+{money(r.amount)}</span> },
              { key: 'o', header: 'Original Payment', render: (r) => <span className="p-desc"><span className="p-mono">{r.originalTx}</span>{r.original && <Pill value={r.original.status} />}</span> },
              { key: 'd', header: 'Refund Date', render: (r) => dt(iso(r.at)) },
              { key: 'v', header: 'Details', render: (r) => <ViewButton onClick={() => setOpen(r)} /> },
            ]}
          />
          {paged.pager('refunds')}
        </Section>
      )}
      {open && <RefundDetails r={open} credits={all.filter((x) => x.userId === open.userId && x.originalTx === open.originalTx).length} onClose={() => setOpen(null)} />}
      {toastNode}
    </div>
  );
}

function RefundDetails({ r, credits, onClose }) {
  const o = r.original;
  return (
    <DetailPanel title={r.refundId ?? r.id} subtitle={`Refund · ${r.userName} (${r.userId})`} onClose={onClose}>
      <Fields
        columns={2}
        items={[
          ['Status', <Pill key="s" value={r.status} />],
          ['Refund Amount', money(r.amount)],
          ['Refund Date', dt(iso(r.at))],
          ['Refunded To', 'User Wallet'],
          ['User', <UserLink key="u" id={r.userId} name={r.userName} />],
          ['Astrologer', r.astroId ? <AstroLink key="a" id={r.astroId} name={r.astroName} /> : '—'],
          ['Service Type', r.serviceTypeOf],
          ['Service ID', r.serviceId ?? '—'],
          ['Reason', r.refundReason ?? '—', { wide: true }],
        ]}
      />
      <SubHeading>Original Payment</SubHeading>
      <Fields
        columns={2}
        items={[
          ['Original Transaction', r.originalTx ?? '—'],
          ['Original Status', o ? <Pill key="os" value={o.status} /> : '—'],
          ['Amount Paid', o ? money(o.debit) : '—'],
          ['Paid By', o ? (o.direct ? `${o.method} (direct)` : 'Wallet') : '—'],
          ['Paid On', o ? dt(iso(o.at)) : '—'],
          ['Gateway Reference', o?.gatewayRef ?? '—'],
        ]}
      />
      <SubHeading>Wallet Credit</SubHeading>
      <Fields
        columns={2}
        items={[
          ['Credit Transaction', r.id],
          ['Wallet Balance After', money(r.balanceAfter)],
          ['Credits for this payment', `${credits} (credited once)`],
        ]}
      />
      <UnavailableAction label="Approve Refund" reason={`Refund approval workflow: ${NOT_FINALISED} (PC-12, PP-03).`} />
    </DetailPanel>
  );
}
