import { useEffect, useMemo, useState } from 'react';
import { CATEGORIES, loadWalletIndex } from '../../data/walletIndex.js';
import { formatNumber } from '../../components/charts/chartUtils.js';
import { DataTable, DateFilter, Empty, FilterBar, Pill, SearchFilter, Section, SelectFilter, ViewButton, dt, usePaged } from '../UserProfile/components/ui.jsx';
import { AstroLink, ErrorState, ExportPair, LoadingState, UserLink, useToast } from '../Services/components/ServiceBits.jsx';
import { Amount, FinanceHead, TxDetails, iso } from './components/FinanceBits.jsx';
import '../Users/UsersPage.css';
import '../UserProfile/UserProfilePage.css';
import '../Services/ServicesPage.css';

const STATUSES = ['Success', 'Pending', 'Failed', 'Reversed', 'Refunded'];
const SORTS = [
  ['at:desc', 'Newest first'],
  ['at:asc', 'Oldest first'],
  ['amount:desc', 'Amount (highest)'],
  ['amount:asc', 'Amount (lowest)'],
];

/**
 * Finance → Payment Transactions (mode "all") and User Wallet Deposits
 * (mode "deposits"). Both read the same wallet index as Wallet Overview and
 * the User Profile Wallet tab.
 */
export default function TransactionsPage({ mode = 'all' }) {
  const deposits = mode === 'deposits';
  const [state, setState] = useState({ status: 'loading', index: null, message: '' });
  const [f, setF] = useState({ query: '', category: 'all', status: 'all', from: '', to: '' });
  const [sort, setSort] = useState('at:desc');
  const [open, setOpen] = useState(null);
  const [notify, toastNode] = useToast();
  useEffect(() => {
    let live = true;
    loadWalletIndex().then((index) => live && setState({ status: 'ready', index, message: '' }), (e) => live && setState({ status: 'error', index: null, message: e.message }));
    return () => {
      live = false;
    };
  }, []);
  const set = (p) => setF((s) => ({ ...s, ...p }));
  const base = useMemo(() => (state.index?.rows ?? []).filter((r) => !deposits || r.category === 'Wallet Deposit'), [state.index, deposits]);
  const rows = useMemo(() => {
    const q = f.query.trim().toLowerCase();
    const from = f.from ? new Date(`${f.from}T00:00:00`).getTime() : null;
    const to = f.to ? new Date(`${f.to}T23:59:59`).getTime() : null;
    const list = base.filter(
      (r) =>
        (f.category === 'all' || r.category === f.category) &&
        (f.status === 'all' || r.status === f.status) &&
        (from === null || r.at >= from) &&
        (to === null || r.at <= to) &&
        (!q || r.id.toLowerCase().includes(q) || r.userId.toLowerCase().includes(q) || r.userName.toLowerCase().includes(q) || (r.serviceId ?? '').toLowerCase().includes(q))
    );
    const [k, dir] = sort.split(':');
    const val = k === 'at' ? (r) => r.at : (r) => r.credit ?? r.debit ?? 0;
    return list.sort((a, b) => (dir === 'asc' ? val(a) - val(b) : val(b) - val(a)) || a.id.localeCompare(b.id));
  }, [base, f, sort]);
  const paged = usePaged(rows, 10, JSON.stringify(f) + sort);

  const columns = [
    { header: 'Transaction ID', value: (r) => r.id, width: 18 },
    { header: 'User', value: (r) => `${r.userName} (${r.userId})`, width: 28 },
    ...(deposits ? [] : [{ header: 'Type', value: (r) => r.category, width: 16 }, { header: 'Service Type', value: (r) => r.serviceType, width: 14 }]),
    { header: deposits ? 'Deposit Amount' : 'Credit', value: (r) => r.credit ?? '', width: 12 },
    ...(deposits ? [] : [{ header: 'Debit', value: (r) => r.debit ?? '', width: 12 }]),
    { header: 'Status', value: (r) => r.status, width: 11 },
    { header: 'Date / Time', value: (r) => dt(iso(r.at)), width: 20 },
    ...(deposits ? [] : [{ header: 'Related Service', value: (r) => r.serviceId ?? '', width: 16 }, { header: 'Astrologer', value: (r) => (r.astroId ? `${r.astroName} (${r.astroId})` : ''), width: 28 }]),
    { header: 'Payment Method', value: (r) => r.method ?? '', width: 14 },
    { header: 'Gateway / Reference', value: (r) => r.gatewayRef ?? '', width: 18 },
  ];

  const statusCounts = useMemo(() => Object.fromEntries(STATUSES.map((s) => [s, base.filter((r) => r.status === s).length])), [base]);

  return (
    <div className="users services">
      <FinanceHead
        title={deposits ? 'User Wallet Deposits' : 'Payment Transactions'}
        subtitle={deposits ? 'Wallet top-ups by users. Only successful deposits increase the wallet balance; Pending, Failed and Reversed deposits do not.' : 'All wallet transactions and direct service payments across the platform.'}
      />
      {state.status === 'loading' && <LoadingState label="Loading transactions" />}
      {state.status === 'error' && <ErrorState message={state.message} />}
      {state.status === 'ready' && (
        <Section id="ft-list" title={deposits ? 'Deposits' : 'Transactions'} description={STATUSES.filter((s) => statusCounts[s]).map((s) => `${s} ${formatNumber(statusCounts[s])}`).join(' · ')} actions={<ExportPair title={deposits ? 'User Wallet Deposits' : 'Payment Transactions'} columns={columns} rows={rows} fileBase={deposits ? 'astroconnect-wallet-deposits' : 'astroconnect-payment-transactions'} notify={notify} />}>
          <FilterBar canClear={JSON.stringify(f) !== JSON.stringify({ query: '', category: 'all', status: 'all', from: '', to: '' })} onClear={() => set({ query: '', category: 'all', status: 'all', from: '', to: '' })}>
            <SearchFilter label="Search" value={f.query} onChange={(v) => set({ query: v })} placeholder={deposits ? 'Transaction ID, User name or ID' : 'Transaction, User or service ID / name'} />
            {!deposits && <SelectFilter label="Transaction Type" value={f.category} onChange={(v) => set({ category: v })} options={[['all', 'All types'], ...CATEGORIES]} />}
            <SelectFilter label="Status" value={f.status} onChange={(v) => set({ status: v })} options={[['all', 'All statuses'], ...STATUSES.filter((s) => !deposits || s !== 'Refunded')]} />
            <DateFilter label="From" value={f.from} onChange={(v) => set({ from: v })} max={f.to || undefined} />
            <DateFilter label="To" value={f.to} onChange={(v) => set({ to: v })} min={f.from || undefined} />
            <SelectFilter label="Sort by" value={sort} onChange={setSort} options={SORTS} />
          </FilterBar>
          <p className="p-small p-muted">{formatNumber(rows.length)} {deposits ? 'deposits' : 'transactions'} match.</p>
          <DataTable
            caption={deposits ? 'Wallet deposits' : 'Payment transactions'}
            rows={paged.rows}
            onRowClick={setOpen}
            empty={<Empty title="No matching transactions" text="Change or clear the filters." />}
            columns={[
              { key: 'id', header: 'Transaction ID', primary: true, render: (r) => <span className="p-mono">{r.id}</span> },
              { key: 'u', header: 'User', render: (r) => <UserLink id={r.userId} name={r.userName} /> },
              ...(deposits ? [] : [{ key: 't', header: 'Type', render: (r) => <span className="p-desc"><span>{r.category}</span><span className="p-small">{r.serviceType}</span></span> }]),
              { key: 'amt', header: deposits ? 'Deposit Amount' : 'Amount', className: 'is-num', render: (r) => <Amount row={r} /> },
              { key: 'st', header: 'Status', render: (r) => <Pill value={r.status} /> },
              { key: 'at', header: 'Date / Time', render: (r) => dt(iso(r.at)) },
              ...(deposits ? [] : [{ key: 'svc', header: 'Related Service / Astrologer', render: (r) => (r.serviceId ? <span className="p-desc"><span className="p-mono">{r.serviceId}</span>{r.astroId && <AstroLink id={r.astroId} name={r.astroName} />}</span> : '—') }]),
              { key: 'm', header: 'Method / Reference', render: (r) => <span className="p-desc"><span>{r.method ?? '—'}</span><span className="p-small p-mono">{r.gatewayRef ?? ''}</span></span> },
              { key: 'v', header: 'Details', render: (r) => <ViewButton onClick={() => setOpen(r)} /> },
            ]}
          />
          {paged.pager(deposits ? 'deposits' : 'transactions')}
        </Section>
      )}
      {open && <TxDetails row={open} rows={state.index.rows} onClose={() => setOpen(null)} onOpen={setOpen} />}
      {toastNode}
    </div>
  );
}
