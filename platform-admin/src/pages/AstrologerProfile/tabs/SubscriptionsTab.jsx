import { useState } from 'react';
import { href } from '../../../router/useHashRoute.js';
import { userProfilePath } from '../../../router/navigation.js';
import { DataTable, DetailPanel, Empty, Fields, Pill, Section, Stats, SubHeading, ViewButton, d, dt, money, usePaged } from '../../UserProfile/components/ui.jsx';
import ExportButtons from '../components/ExportButtons.jsx';

const BENEFITS = { Silver: 1, Gold: 3, Platinum: 4 };
const DAY = 24 * 60 * 60 * 1000;

// Tab 6 — Subscriptions & Subscribers (§9). View only. Tiers and benefit
// questions per AD-65 / D-31; amounts and periods are recorded values
// (PP-16). Failed payments are not subscriptions.
export default function SubscriptionsTab({ profile, notify }) {
  const { subscriptions, failures, astrologer: a, todayStart, monthStart } = profile;
  const [open, setOpen] = useState(null);
  const count = (s) => subscriptions.filter((x) => x.status === s).length;
  const newSince = (ts) => subscriptions.filter((s) => !s.renewalOf && new Date(s.purchasedAt).getTime() >= ts).length;
  const paged = usePaged(subscriptions, 10);
  const columns = [
    { header: 'Subscription ID', value: (s) => s.id, width: 16 },
    { header: 'User', value: (s) => `${s.user.name} (${s.user.id})`, width: 28 },
    { header: 'Plan', value: (s) => s.plan, width: 10 },
    { header: 'Purchase', value: (s) => dt(s.purchasedAt), width: 20 },
    { header: 'Start', value: (s) => d(s.startAt), width: 14 },
    { header: 'Expiry', value: (s) => d(s.expiryAt), width: 14 },
    { header: 'Amount', value: (s) => s.amount, width: 10 },
    { header: 'Status', value: (s) => s.status, width: 12 },
    { header: 'Auto-Renewal', value: (s) => (s.autoRenew ? 'On' : 'Off'), width: 12 },
  ];

  return (
    <div className="p-stack">
      <Stats
        label="Subscriptions overview"
        items={[
          ['Active', count('Active'), 'green'],
          ['Expired', count('Expired')],
          ['Cancelled', count('Cancelled')],
          ['Total Purchases', subscriptions.length, 'gold'],
          ['New Subscribers Today', newSince(todayStart)],
          ['New This Month', newSince(monthStart)],
        ]}
      />
      <Section id="asb-plans" title="Subscription Plans" description="Benefit questions are shown separately from normal paid questions. Price, duration, renewal and cancellation rules are on hold; amounts are the recorded plan values.">
        <DataTable
          caption="Subscription plans"
          rows={['Silver', 'Gold', 'Platinum']}
          rowKey={(p) => p}
          columns={[
            { key: 'plan', header: 'Plan', primary: true, render: (p) => p },
            { key: 'amount', header: 'Recorded Amount', className: 'is-num', render: (p) => money(a.plans[p]) },
            { key: 'benefits', header: 'Benefit Questions', className: 'is-num', render: (p) => BENEFITS[p] },
            { key: 'active', header: 'Active Subscribers', className: 'is-num', render: (p) => subscriptions.filter((s) => s.plan === p && s.status === 'Active').length },
          ]}
        />
      </Section>
      <Section id="asb-list" title="Subscribers" actions={<ExportButtons title="Subscribers" astrologer={a} columns={columns} rows={subscriptions} fileBase="astrologer-subscribers" notify={notify} label="subscriptions" />}>
        <DataTable
          caption="Subscribers"
          rows={paged.rows}
          onRowClick={setOpen}
          empty={<Empty icon="services" title="No subscribers yet" />}
          columns={[
            { key: 'id', header: 'Subscription ID', primary: true, render: (s) => <span className="p-mono">{s.id}</span> },
            { key: 'user', header: 'User / ID', render: (s) => <span className="p-desc"><a className="u-name" href={href(userProfilePath(s.user.id))}>{s.user.name}</a><span className="p-small">{s.user.id}</span></span> },
            { key: 'plan', header: 'Plan', render: (s) => s.plan },
            { key: 'buy', header: 'Purchase', render: (s) => dt(s.purchasedAt) },
            { key: 'start', header: 'Start', render: (s) => d(s.startAt) },
            { key: 'exp', header: 'Expiry', render: (s) => d(s.expiryAt) },
            { key: 'amt', header: 'Amount', className: 'is-num', render: (s) => money(s.amount) },
            { key: 'status', header: 'Status', render: (s) => <Pill value={s.status} /> },
            { key: 'auto', header: 'Auto-Renewal', render: (s) => (s.autoRenew ? 'On' : 'Off') },
            { key: 'actions', header: 'Details', render: (s) => <ViewButton onClick={() => setOpen(s)} /> },
          ]}
        />
        {paged.pager('subscriptions')}
      </Section>
      <Section id="asb-failed" title="Failed Payment Attempts" description="Not counted as subscriptions.">
        <DataTable
          caption="Failed payments"
          rows={failures}
          rowKey={(f) => f.txId}
          empty={<Empty icon="finance" title="No failed payment attempts" />}
          columns={[
            { key: 'tx', header: 'Transaction ID', primary: true, render: (f) => <span className="p-mono">{f.txId}</span> },
            { key: 'user', header: 'User', render: (f) => `${f.user.name} (${f.user.id})` },
            { key: 'plan', header: 'Plan', render: (f) => f.plan },
            { key: 'amt', header: 'Amount', className: 'is-num', render: (f) => money(f.amount) },
            { key: 'at', header: 'Date / Time', render: (f) => dt(f.at) },
            { key: 'status', header: 'Status', render: (f) => <Pill value={f.status} /> },
            { key: 'reason', header: 'Reason', render: (f) => f.reason },
          ]}
        />
      </Section>
      {open && <Details sub={open} all={subscriptions} onClose={() => setOpen(null)} />}
    </div>
  );
}

function Details({ sub: s, all, onClose }) {
  const renewedBy = all.find((x) => x.renewalOf === s.id);
  const days = Math.round((new Date(s.expiryAt) - new Date(s.startAt)) / DAY);
  const access = s.status === 'Active' ? `Available until ${d(s.expiryAt)}` : s.status === 'Cancelled' ? `Cancelled on ${d(s.cancelledAt)}` : `Ended on ${d(s.expiryAt)}`;
  const pay = s.payments?.[0];
  return (
    <DetailPanel title={s.id} subtitle={`${s.plan} · ${s.user.name} (${s.user.id})`} onClose={onClose}>
      <Fields columns={2} items={[['Plan', s.plan], ['Amount', money(s.amount)], ['Duration', `${days} days`], ['Status', <Pill key="s" value={s.status} />], ['Benefit Questions', BENEFITS[s.plan]], ['Auto-Renewal', s.autoRenew ? 'On' : 'Off']]} />
      <SubHeading>Renewal, Cancellation and Refund</SubHeading>
      <Fields columns={2} items={[['Renewal Of', s.renewalOf ?? '—'], ['Renewed As', renewedBy?.id ?? '—'], ['Cancellation', s.cancelledAt ? `Cancelled by user on ${dt(s.cancelledAt)}` : '—'], ['Refund', 'No refund recorded']]} />
      <SubHeading>Subscriber Content Access</SubHeading>
      <Fields columns={2} items={[['Subscriber-only Content', access], ['Daily / Weekly Predictions', access]]} />
      <SubHeading>Payment Details</SubHeading>
      <Fields columns={2} items={[['Transaction ID', pay?.id ?? '—'], ['Method', pay?.method ?? s.method], ['Date / Time', dt(pay?.at ?? s.purchasedAt)], ['Payment Status', <Pill key="p" value="Success" />], ['Wallet / Gateway Reference', pay?.gatewayRef ?? (pay ? `Wallet · ${pay.id}` : '—'), { wide: true }]]} />
      <p className="p-small p-muted">Payment records are managed in Payments &amp; Finance.</p>
    </DetailPanel>
  );
}
