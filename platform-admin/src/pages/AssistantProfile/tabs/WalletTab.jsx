import { useEffect, useState } from 'react';
import { requestsByAssistant } from '../../../data/assistantsStore.js';
import { getAstrologerProfile, NOT_FINALISED } from '../../../data/astrologersStore.js';
import { DataTable, Empty, Fields, Pill, Section, dt, money } from '../../UserProfile/components/ui.jsx';

// Tab 5 — Wallet Access. Read only: shows only what the assistant may view.
// No transfers, withdrawals, adjustments or approvals.
export default function WalletTab({ assistant: a }) {
  if (a.type === 'Astrologer Assistant') return <AstrologerWallet a={a} />;
  return <AdminWallet a={a} />;
}

function AdminWallet({ a }) {
  const viewable = Object.entries(a.permissions).filter(([m, acts]) => acts.includes('View') && a.departments.includes('Finance') && ['Wallet Overview', 'Service Revenue', 'Platform Commission', 'Astrologer Earnings', 'User Wallet Deposits', 'Payment Transactions', 'Refunds', 'Settlements', 'Payouts', 'Commission Settings', 'Financial Reports'].includes(m));
  const canRequest = (a.permissions['Wallet Overview'] ?? []).includes('Create') || (a.permissions['User Wallet Deposits'] ?? []).includes('Create');
  const [requests, setRequests] = useState(null);
  useEffect(() => {
    let live = true;
    requestsByAssistant(a.id).then((r) => live && setRequests(r));
    return () => {
      live = false;
    };
  }, [a.id]);
  return (
    <div className="p-stack">
      <Section id="sw-access" title="Permitted Financial Access" description="Read only. Approvals of wallet adjustments, transfers, payouts and settlements belong to Super Admin and can never be granted to an assistant.">
        {viewable.length ? (
          <Fields columns={2} items={[['Viewable finance modules', viewable.map(([m]) => m).join(', '), { wide: true }], ['Wallet adjustment requests', canRequest ? 'May create requests (Super Admin approves)' : 'Not permitted'], ['Approval authority', 'None']]} />
        ) : (
          <Empty icon="finance" title="No wallet or financial access granted" />
        )}
      </Section>
      <Section id="sw-requests" title="Wallet Adjustment Requests Created">
        {requests === null ? (
          <div className="u-skeleton" role="status" aria-label="Loading requests"><div className="u-skeleton__row" /><div className="u-skeleton__row" /></div>
        ) : (
          <DataTable
            caption="Adjustment requests created by this assistant"
            rows={requests}
            empty={<Empty icon="finance" title="No adjustment requests created" />}
            columns={[
              { key: 'id', header: 'Request ID', primary: true, render: (r) => <span className="p-mono">{r.id}</span> },
              { key: 'user', header: 'User', render: (r) => `${r.user.name} (${r.user.id})` },
              { key: 'type', header: 'Type', render: (r) => r.type },
              { key: 'amt', header: 'Amount', className: 'is-num', render: (r) => money(r.amount) },
              { key: 'req', header: 'Requested', render: (r) => dt(r.requestedAt) },
              { key: 'status', header: 'Status', render: (r) => <Pill value={r.status} /> },
              { key: 'dec', header: 'Decided By', render: (r) => (r.decidedBy ? `${r.decidedBy.name} · ${dt(r.decidedAt)}` : '—') },
            ]}
          />
        )}
      </Section>
    </div>
  );
}

function AstrologerWallet({ a }) {
  const canView = (a.permissions['Wallet & Earnings'] ?? []).includes('View');
  if (!canView) {
    return (
      <Section id="sw-none" title="Wallet Access">
        <Empty icon="finance" title="No wallet access granted" text={`${a.astrologer.name} has not granted Wallet & Earnings access.`} />
      </Section>
    );
  }
  const w = getAstrologerProfile(a.astrologer.id).wallet;
  return (
    <div className="p-stack">
      <Section id="sw-astro" title={`${a.astrologer.name}’s Wallet (view only)`} description="Wallet transfers, withdrawals and approvals can never be granted to an assistant.">
        <Fields
          columns={3}
          items={[
            ['Available Balance', money(w.available)],
            ['Pending Balance', NOT_FINALISED],
            ['Held Balance', money(w.held)],
            ['Total Earnings', money(w.totalEarnings)],
            ['Total Withdrawn', money(w.totalWithdrawn)],
            ['Total Refunded', money(w.totalRefunded)],
          ]}
        />
      </Section>
      <Section id="sw-recent" title="Recent Financial Activity">
        <DataTable
          caption="Recent settlements and withdrawals"
          rows={w.transactions.filter((t) => t.serviceType === 'Settlement' || t.serviceType === 'Withdrawal').slice(0, 10)}
          empty={<Empty icon="finance" title="No settlements or withdrawals yet" />}
          columns={[
            { key: 'id', header: 'Transaction ID', primary: true, render: (t) => <span className="p-mono">{t.id}</span> },
            { key: 'at', header: 'Date / Time', render: (t) => dt(t.at) },
            { key: 'desc', header: 'Description', className: 'p-wrap', render: (t) => t.description },
            { key: 'amt', header: 'Amount', className: 'is-num', render: (t) => money(t.credit ?? t.debit) },
            { key: 'status', header: 'Status', render: (t) => <Pill value={t.status} /> },
          ]}
        />
      </Section>
    </div>
  );
}
