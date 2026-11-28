import { useEffect, useMemo, useState } from 'react';
import { href } from '../../router/useHashRoute.js';
import { userProfilePath } from '../../router/navigation.js';
import { loadWalletIndex, walletSummary } from '../../data/walletIndex.js';
import { formatNumber } from '../../components/charts/chartUtils.js';
import { DataTable, Empty, Fields, Pill, Section, Stats, ViewButton, dt, money } from '../UserProfile/components/ui.jsx';
import { ErrorState, LoadingState, UserLink } from '../Services/components/ServiceBits.jsx';
import { Amount, FinanceHead, TxDetails, iso } from './components/FinanceBits.jsx';
import '../Users/UsersPage.css';
import '../UserProfile/UserProfilePage.css';
import '../Services/ServicesPage.css';

// Finance → Wallet Overview. Every figure is a sum over the same wallet
// records used by Payment Transactions and the User Profile Wallet tab.
// Refunds are counted once (their single wallet credit); debits that were
// later refunded stay as debits, so nothing is double-counted.
export default function WalletOverviewPage() {
  const [state, setState] = useState({ status: 'loading', index: null, message: '' });
  const [open, setOpen] = useState(null);
  useEffect(() => {
    let live = true;
    loadWalletIndex().then((index) => live && setState({ status: 'ready', index, message: '' }), (e) => live && setState({ status: 'error', index: null, message: e.message }));
    return () => {
      live = false;
    };
  }, []);
  const s = useMemo(() => (state.index ? walletSummary(state.index) : null), [state.index]);
  const recent = useMemo(() => (state.index ? state.index.rows.filter((r) => !r.direct).sort((a, b) => b.at - a.at).slice(0, 10) : []), [state.index]);
  const adj = useMemo(() => {
    const list = state.index?.adjustments ?? [];
    return { list: [...list].sort((a, b) => b.requestedAt.localeCompare(a.requestedAt)), pending: list.filter((a) => a.status === 'Pending').length, approved: list.filter((a) => a.status === 'Approved').length, rejected: list.filter((a) => a.status === 'Rejected').length };
  }, [state.index]);

  return (
    <div className="users services">
      <FinanceHead title="Wallet Overview" subtitle="User wallet balances and movements, calculated from completed wallet transactions only." />
      {state.status === 'loading' && <LoadingState label="Loading wallet records" />}
      {state.status === 'error' && <ErrorState message={state.message} />}
      {s && (
        <>
          <Stats
            label="Wallet overview"
            items={[
              ['Total User Wallet Balance', money(s.balanceFromUsers), 'gold'],
              ['Successful Deposits', money(s.deposits.success), 'green'],
              ['Total Wallet Credits', money(s.credits)],
              ['Refunds Credited', money(s.refunds)],
              ['Total Wallet Debits', money(s.debits)],
            ]}
          />
          <div className="p-grid-2">
            <Section id="wo-credits" title="Credits and Debits" description="Only completed transactions change balances. Pending, Failed and Reversed transactions are excluded.">
              <Fields
                columns={2}
                items={[
                  ['Deposits (Success)', `${money(s.deposits.success)} · ${formatNumber(s.deposits.successCount)}`],
                  ['Refund credits', `${money(s.refunds)} · ${formatNumber(s.refundCount)}`],
                  ['Approved adjustment credits', money(s.adjustmentsCredit)],
                  ['Total credits', money(s.credits)],
                  ['Service payments from Wallet', money(s.walletPayments)],
                  ['Withdrawals (Success)', money(s.withdrawals)],
                  ['Approved adjustment debits', money(s.adjustmentsDebit)],
                  ['Total debits', money(s.debits)],
                  ['Balance (credits − debits)', money(s.balanceFromRows), { wide: true }],
                ]}
              />
              <p className="p-small p-muted">
                Reconciles with the sum of {formatNumber(Object.keys(state.index.balances).length)} user balances ({money(s.balanceFromUsers)}); {formatNumber(s.usersWithBalance)} users hold a balance. Payments later refunded remain debits and their refund is credited once.
              </p>
            </Section>
            <Section id="wo-excluded" title="Not Affecting Balances">
              <Fields
                columns={2}
                items={[
                  ['Pending deposits', `${formatNumber(s.deposits.pending)} · ${money(s.deposits.pendingAmount)}`],
                  ['Failed deposits', formatNumber(s.deposits.failed)],
                  ['Reversed deposits', formatNumber(s.deposits.reversed)],
                  ['Direct (UPI / card) service payments', money(s.directPayments)],
                ]}
              />
              <p className="p-small p-muted">Direct payments are paid outside the wallet; any refund of them is credited to the wallet once.</p>
            </Section>
          </div>
          <Section id="wo-adj" title="Wallet Adjustment Requests" description="Requests change a balance only after Super Admin approval; rejections keep their reason. Decisions are made in the user’s Wallet tab.">
            <p className="p-small">
              Pending {adj.pending} · Approved {formatNumber(adj.approved)} · Rejected {formatNumber(adj.rejected)}
            </p>
            <DataTable
              caption="Recent wallet adjustment requests"
              rows={adj.list.slice(0, 8)}
              empty={<Empty icon="finance" title="No adjustment requests" />}
              columns={[
                { key: 'id', header: 'Request ID', primary: true, render: (a) => <a className="u-name p-mono" href={`${href(userProfilePath(a.userId))}?tab=wallet`}>{a.id}</a> },
                { key: 'u', header: 'User', render: (a) => <UserLink id={a.userId} name={a.userName} /> },
                { key: 't', header: 'Type / Amount', render: (a) => `${a.type} · ${money(a.amount)}` },
                { key: 'r', header: 'Requested', render: (a) => <span className="p-desc"><span>{dt(a.requestedAt)}</span><span className="p-small">{a.requestedBy.name}</span></span> },
                { key: 's', header: 'Status', render: (a) => <span className="p-desc"><Pill value={a.status} />{a.rejectionReason && <span className="p-small">{a.rejectionReason}</span>}</span> },
              ]}
            />
          </Section>
          <Section id="wo-recent" title="Recent Wallet Transactions">
            <DataTable
              caption="Recent wallet transactions"
              rows={recent}
              onRowClick={setOpen}
              columns={[
                { key: 'id', header: 'Transaction ID', primary: true, render: (r) => <span className="p-mono">{r.id}</span> },
                { key: 'u', header: 'User', render: (r) => <UserLink id={r.userId} name={r.userName} /> },
                { key: 't', header: 'Type', render: (r) => r.category },
                { key: 'a', header: 'Amount', className: 'is-num', render: (r) => <Amount row={r} /> },
                { key: 's', header: 'Status', render: (r) => <Pill value={r.status} /> },
                { key: 'd', header: 'Date / Time', render: (r) => dt(iso(r.at)) },
                { key: 'v', header: 'Details', render: (r) => <ViewButton onClick={() => setOpen(r)} /> },
              ]}
            />
          </Section>
        </>
      )}
      {open && <TxDetails row={open} rows={state.index.rows} onClose={() => setOpen(null)} onOpen={setOpen} />}
    </div>
  );
}
