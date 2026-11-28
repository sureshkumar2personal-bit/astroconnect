import { useMemo, useState } from 'react';
import { href } from '../../router/useHashRoute.js';
import { userProfilePath } from '../../router/navigation.js';
import { loadWalletIndex } from '../../data/walletIndex.js';
import { decideAdjustment, getProfile } from '../../data/profileStore.js';
import { formatNumber } from '../../components/charts/chartUtils.js';
import { DataTable, DateFilter, DetailPanel, Empty, FilterBar, Fields, Pill, SearchFilter, Section, SelectFilter, SubHeading, ViewButton, dt, money, usePaged } from '../UserProfile/components/ui.jsx';
import { DecisionDialog } from '../UserProfile/tabs/WalletTab.jsx';
import { ErrorState, ExportPair, LoadingState, NOT_FINALISED, UserLink, useToast } from '../Services/components/ServiceBits.jsx';
import { FinanceHead, inRange, useLoaded } from './components/FinanceBits.jsx';
import '../Users/UsersPage.css';
import '../UserProfile/UserProfilePage.css';
import '../Services/ServicesPage.css';

const STATUSES = ['Pending', 'Approved', 'Rejected'];
const SORTS = [
  ['at:desc', 'Newest first'],
  ['at:asc', 'Oldest first'],
  ['amount:desc', 'Amount (highest)'],
  ['amount:asc', 'Amount (lowest)'],
];
const EMPTY = { query: '', account: 'all', status: 'all', type: 'all', from: '', to: '' };
const ms = (v) => (v ? new Date(v).getTime() : 0);
const key = (a) => `${a.id}|${a.userId}`;

// Finance → Wallet Adjustments. All Wallet Adjustment Requests across user
// wallets — the same requests as each User Profile Wallet tab. Approve /
// Reject uses the same Super Admin workflow (profileStore.decideAdjustment):
// only Pending requests can be decided, a rejection needs a reason, and only
// an approved request posts one wallet transaction. Astrologer wallet
// adjustments have no documented request process (Not finalised).
export default function WalletAdjustmentsPage({ session }) {
  const state = useLoaded(loadWalletIndex);
  const [f, setF] = useState(EMPTY);
  const [sort, setSort] = useState('at:desc');
  const [openId, setOpenId] = useState(null);
  const [deciding, setDeciding] = useState(null);
  const [notify, toastNode] = useToast();
  const set = (p) => setF((s) => ({ ...s, ...p }));

  const all = useMemo(() => (state.data?.adjustments ?? []).map((a) => ({ ...a, accountType: 'User', at: ms(a.requestedAt) })), [state.data]);
  const rows = useMemo(() => {
    const q = f.query.trim().toLowerCase();
    const list = all.filter(
      (a) =>
        (f.account === 'all' || a.accountType === f.account) &&
        (f.status === 'all' || a.status === f.status) &&
        (f.type === 'all' || a.type === f.type) &&
        inRange(a.at, f.from, f.to) &&
        (!q || a.id.toLowerCase().includes(q) || a.userId.toLowerCase().includes(q) || a.userName.toLowerCase().includes(q))
    );
    const [k, dir] = sort.split(':');
    return list.sort((a, b) => (dir === 'asc' ? a[k] - b[k] : b[k] - a[k]) || a.id.localeCompare(b.id));
  }, [all, f, sort]);
  const paged = usePaged(rows, 10, JSON.stringify(f) + sort);
  const counts = useMemo(() => Object.fromEntries(STATUSES.map((s) => [s, all.filter((a) => a.status === s).length])), [all]);
  const open = openId ? all.find((a) => key(a) === openId) ?? null : null;

  const columns = [
    { header: 'Adjustment ID', value: (a) => a.id, width: 18 },
    { header: 'Account Type', value: (a) => a.accountType, width: 12 },
    { header: 'Account', value: (a) => `${a.userName} (${a.userId})`, width: 28 },
    { header: 'Credit / Debit', value: (a) => a.type, width: 11 },
    { header: 'Amount', value: (a) => a.amount, width: 10 },
    { header: 'Reason', value: (a) => a.reason, width: 36 },
    { header: 'Supporting Reference', value: (a) => a.reference || '', width: 16 },
    { header: 'Requested By', value: (a) => `${a.requestedBy.name} (${a.requestedBy.role})`, width: 30 },
    { header: 'Request Date', value: (a) => dt(a.requestedAt), width: 20 },
    { header: 'Status', value: (a) => a.status, width: 10 },
    { header: 'Decided By', value: (a) => a.decidedBy?.name ?? '', width: 22 },
    { header: 'Decision Date', value: (a) => (a.decidedAt ? dt(a.decidedAt) : ''), width: 20 },
    { header: 'Rejection Reason', value: (a) => a.rejectionReason || '', width: 30 },
    { header: 'Wallet Transaction', value: (a) => a.txId ?? '', width: 18 },
  ];

  return (
    <div className="users services">
      <FinanceHead title="Wallet Adjustments" subtitle="Wallet Adjustment Requests. A balance changes only after Super Admin approval; rejected requests keep their reason." />
      {state.status === 'loading' && <LoadingState label="Loading adjustment requests" />}
      {state.status === 'error' && <ErrorState message={state.message} />}
      {state.status === 'ready' && (
        <Section
          id="wa-list"
          title="Adjustment Requests"
          description={`${STATUSES.map((s) => `${s} ${formatNumber(counts[s])}`).join(' · ')}. Astrologer wallet adjustments: ${NOT_FINALISED}.`}
          actions={<ExportPair title="Wallet Adjustments" columns={columns} rows={rows} fileBase="astroconnect-wallet-adjustments" notify={notify} />}
        >
          <FilterBar canClear={JSON.stringify(f) !== JSON.stringify(EMPTY)} onClear={() => setF(EMPTY)}>
            <SearchFilter label="Search" value={f.query} onChange={(v) => set({ query: v })} placeholder="Account name or ID, Adjustment ID" />
            <SelectFilter label="Account Type" value={f.account} onChange={(v) => set({ account: v })} options={[['all', 'All accounts'], 'User', 'Astrologer']} />
            <SelectFilter label="Status" value={f.status} onChange={(v) => set({ status: v })} options={[['all', 'All statuses'], ...STATUSES]} />
            <SelectFilter label="Adjustment Type" value={f.type} onChange={(v) => set({ type: v })} options={[['all', 'Credit and Debit'], 'Credit', 'Debit']} />
            <DateFilter label="From" value={f.from} onChange={(v) => set({ from: v })} max={f.to || undefined} />
            <DateFilter label="To" value={f.to} onChange={(v) => set({ to: v })} min={f.from || undefined} />
            <SelectFilter label="Sort by" value={sort} onChange={setSort} options={SORTS} />
          </FilterBar>
          <p className="p-small p-muted">{formatNumber(rows.length)} requests match.</p>
          <DataTable
            caption="Wallet adjustment requests"
            rows={paged.rows}
            rowKey={key}
            onRowClick={(a) => setOpenId(key(a))}
            empty={
              <Empty
                icon="finance"
                title="No matching adjustment requests"
                text={f.account === 'Astrologer' ? `Astrologer wallet adjustment requests are ${NOT_FINALISED.toLowerCase()}; none exist.` : 'Change or clear the filters.'}
              />
            }
            columns={[
              { key: 'id', header: 'Adjustment ID', primary: true, render: (a) => <span className="p-mono">{a.id}</span> },
              { key: 'acc', header: 'Account', render: (a) => <span className="p-desc"><UserLink id={a.userId} name={a.userName} /><span className="p-small">{a.accountType}</span></span> },
              { key: 't', header: 'Type / Amount', className: 'is-num', render: (a) => <span className={a.type === 'Credit' ? 'p-credit' : 'p-debit'}>{a.type === 'Credit' ? '+' : '−'}{money(a.amount)}</span> },
              { key: 'r', header: 'Reason', className: 'p-wrap', render: (a) => a.reason },
              { key: 'req', header: 'Requested', render: (a) => <span className="p-desc"><span>{a.requestedBy.name}</span><span className="p-small">{dt(a.requestedAt)}</span></span> },
              {
                key: 's',
                header: 'Status',
                render: (a) => (
                  <span className="p-desc">
                    <Pill value={a.status} />
                    {a.decidedBy && <span className="p-small">{a.decidedBy.name} · {dt(a.decidedAt)}</span>}
                    {a.rejectionReason && <span className="p-small">Reason: {a.rejectionReason}</span>}
                  </span>
                ),
              },
              {
                key: 'actions',
                header: 'Approval',
                render: (a) =>
                  a.status === 'Pending' ? (
                    <span className="p-actions">
                      <button type="button" className="p-view" onClick={(e) => { e.stopPropagation(); setDeciding({ request: a, approve: true }); }}>Approve</button>
                      <button type="button" className="p-view p-view--danger" onClick={(e) => { e.stopPropagation(); setDeciding({ request: a, approve: false }); }}>Reject</button>
                    </span>
                  ) : (
                    <ViewButton onClick={() => setOpenId(key(a))} />
                  ),
              },
            ]}
          />
          {paged.pager('requests')}
        </Section>
      )}
      {open && <AdjustmentDetails a={open} onClose={() => setOpenId(null)} onDecide={(approve) => setDeciding({ request: open, approve })} />}
      {deciding && (
        <DecisionDialog
          {...deciding}
          onClose={() => setDeciding(null)}
          onSubmit={(rejectionReason) => {
            const r = deciding.request;
            const result = decideAdjustment(r.userId, r.id, { approve: deciding.approve, rejectionReason }, session);
            if (!result.ok) return result;
            setDeciding(null);
            state.reload();
            notify('success', deciding.approve ? `Request ${r.id} approved. ${r.type} of ${money(r.amount)} posted to ${r.userName}’s Wallet.` : `Request ${r.id} rejected. The balance is unchanged.`);
            return result;
          }}
        />
      )}
      {toastNode}
    </div>
  );
}

function AdjustmentDetails({ a, onClose, onDecide }) {
  // Audit entries for this request, from the user's wallet audit.
  const audit = useMemo(() => (getProfile(a.userId)?.walletAudit ?? []).filter((e) => e.action.includes(a.id)), [a]);
  return (
    <DetailPanel title={a.id} subtitle={`Wallet Adjustment Request · ${a.userName} (${a.userId})`} onClose={onClose}>
      <Fields
        columns={2}
        items={[
          ['Status', <Pill key="s" value={a.status} />],
          ['Account Type', a.accountType],
          ['Account', <UserLink key="u" id={a.userId} name={a.userName} />],
          ['Credit / Debit', a.type],
          ['Amount', money(a.amount)],
          ['Supporting Reference', a.reference || '—'],
          ['Requested By', `${a.requestedBy.name} · ${a.requestedBy.role}`],
          ['Request Date', dt(a.requestedAt)],
          ['Decided By', a.decidedBy ? `${a.decidedBy.name} · ${a.decidedBy.role}` : '—'],
          ['Decision Date', a.decidedAt ? dt(a.decidedAt) : '—'],
          ['Wallet Transaction', a.txId ?? (a.status === 'Pending' ? 'None until approved' : 'None — balance unchanged')],
          ['Balance Effect', a.status === 'Approved' ? `${a.type} of ${money(a.amount)} posted once` : 'No change'],
          ['Reason', a.reason, { wide: true }],
          ...(a.rejectionReason ? [['Rejection Reason', a.rejectionReason, { wide: true }]] : []),
        ]}
      />
      {a.status === 'Pending' && (
        <p className="p-actions">
          <button type="button" className="u-btn u-btn--primary" onClick={() => onDecide(true)}>Approve</button>
          <button type="button" className="u-btn u-btn--danger" onClick={() => onDecide(false)}>Reject</button>
        </p>
      )}
      <SubHeading>Audit History</SubHeading>
      <DataTable
        caption="Audit history for this request"
        rows={audit}
        empty={<p className="p-small p-muted">No audit entries.</p>}
        columns={[
          { key: 'at', header: 'Date / Time', primary: true, render: (e) => dt(e.at) },
          { key: 'a', header: 'Action', render: (e) => e.action },
          { key: 'by', header: 'By', render: (e) => (e.by ? `${e.by.name} · ${e.by.role}` : '—') },
        ]}
      />
      <p className="p-small p-muted">
        New requests are created from the <a className="u-name" href={`${href(userProfilePath(a.userId))}?tab=wallet`}>user’s Wallet</a>.
      </p>
    </DetailPanel>
  );
}
