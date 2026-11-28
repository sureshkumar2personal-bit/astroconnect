import { useState } from 'react';
import { Avatar } from '../../Users/components/UserBits.jsx';
import {
  DataTable,
  DetailPanel,
  Empty,
  Fields,
  Pill,
  Section,
  Stats,
  SubHeading,
  ViewButton,
  d,
  dt,
  money,
} from '../components/ui.jsx';

const DAY = 24 * 60 * 60 * 1000;

// Tab 5 — Subscriptions (§8). View only: Admin cannot change subscription or
// payment status. Failed payments are listed separately and never counted.
export default function SubscriptionsTab({ profile }) {
  const { subscriptions, subscriptionFailures } = profile;
  const [open, setOpen] = useState(null);
  const count = (s) => subscriptions.filter((x) => x.status === s).length;

  return (
    <div className="p-stack">
      <Stats
        label="Subscription overview"
        items={[
          ['Active', count('Active'), 'green'],
          ['Expired', count('Expired')],
          ['Cancelled', count('Cancelled')],
          ['Total Purchases', subscriptions.length, 'gold'],
        ]}
      />

      <Section id="sub-list" title="Subscription Records" description="Purchase → successful payment → Active → renewal or cancellation → Expired. Access stops after expiry; records are never deleted.">
        <DataTable
          caption="Subscriptions"
          rows={subscriptions}
          onRowClick={setOpen}
          empty={<Empty icon="services" title="No subscriptions" text="Paid subscriptions to astrologers will appear here." />}
          columns={[
            { key: 'id', header: 'Subscription ID', primary: true, render: (s) => <span className="p-mono">{s.id}</span> },
            {
              key: 'astro',
              header: 'Astrologer',
              render: (s) => (
                <span className="p-inline">
                  <Avatar user={s.astrologer} size={28} />
                  <span className="p-desc">
                    <span>{s.astrologer.name}</span>
                    <span className="p-small p-mono">{s.astrologer.id}</span>
                  </span>
                </span>
              ),
            },
            { key: 'plan', header: 'Plan', render: (s) => s.plan },
            { key: 'amt', header: 'Amount', className: 'is-num', render: (s) => money(s.amount) },
            { key: 'buy', header: 'Purchase Date / Time', render: (s) => dt(s.purchasedAt) },
            { key: 'start', header: 'Start Date', render: (s) => d(s.startAt) },
            { key: 'exp', header: 'Expiry Date', render: (s) => d(s.expiryAt) },
            { key: 'status', header: 'Status', render: (s) => <Pill value={s.status} /> },
            { key: 'auto', header: 'Auto-Renewal', render: (s) => (s.autoRenew ? 'On' : 'Off') },
            { key: 'actions', header: 'Details', render: (s) => <ViewButton onClick={() => setOpen(s)} /> },
          ]}
        />
      </Section>

      <Section id="sub-failed" title="Failed Payment Attempts" description="Failed payments are not subscriptions and are not counted above.">
        <DataTable
          caption="Failed subscription payments"
          rows={subscriptionFailures}
          rowKey={(f) => f.txId}
          empty={<Empty icon="finance" title="No failed payment attempts" />}
          columns={[
            { key: 'tx', header: 'Transaction ID', primary: true, render: (f) => <span className="p-mono">{f.txId}</span> },
            { key: 'astro', header: 'Astrologer', render: (f) => f.astrologer.name },
            { key: 'plan', header: 'Plan', render: (f) => f.plan },
            { key: 'amt', header: 'Amount', className: 'is-num', render: (f) => money(f.amount) },
            { key: 'method', header: 'Method', render: (f) => f.method },
            { key: 'at', header: 'Date / Time', render: (f) => dt(f.at) },
            { key: 'status', header: 'Payment Status', render: (f) => <Pill value={f.status} /> },
            { key: 'reason', header: 'Reason', render: (f) => f.reason },
          ]}
        />
      </Section>

      {open && <SubscriptionDetails sub={open} all={subscriptions} onClose={() => setOpen(null)} />}
    </div>
  );
}

function SubscriptionDetails({ sub: s, all, onClose }) {
  const days = Math.round((new Date(s.expiryAt) - new Date(s.startAt)) / DAY);
  const renewedBy = all.find((x) => x.renewalOf === s.id);
  const access = s.status === 'Active' ? `Available until ${d(s.expiryAt)}` : s.status === 'Cancelled' ? `Cancelled on ${d(s.cancelledAt)}` : `Ended on ${d(s.expiryAt)}`;
  const pay = s.payments?.[0];

  return (
    <DetailPanel title={s.id} subtitle={`${s.plan} plan · ${s.astrologer.name} (${s.astrologer.id})`} onClose={onClose}>
      <SubHeading>Plan Details</SubHeading>
      <Fields
        columns={2}
        items={[
          ['Plan', s.plan],
          ['Subscription Amount', money(s.amount)],
          ['Duration', `${days} days (${d(s.startAt)} – ${d(s.expiryAt)})`],
          ['Status', <Pill key="st" value={s.status} />],
          ['Benefits', `${s.benefits} benefit question${s.benefits === 1 ? '' : 's'}`],
          ['Subscriber-only Content', access],
          ['Daily / Weekly Predictions', access],
        ]}
      />
      <SubHeading>Renewal and Cancellation</SubHeading>
      <Fields
        columns={2}
        items={[
          ['Auto-Renewal', s.autoRenew ? 'On' : 'Off'],
          ['Renewal Of', s.renewalOf ?? '—'],
          ['Renewed As', renewedBy?.id ?? '—'],
          ['Cancellation', s.cancelledAt ? `Cancelled by user on ${dt(s.cancelledAt)}` : '—'],
        ]}
      />
      <SubHeading>Payment Details</SubHeading>
      <Fields
        columns={2}
        items={[
          ['Transaction ID', pay?.id ?? '—'],
          ['Amount', money(pay?.amount ?? s.amount)],
          ['Payment Method', pay?.method ?? s.method],
          ['Date / Time', dt(pay?.at ?? s.purchasedAt)],
          ['Payment Status', <Pill key="ps" value="Success" />],
          ['Wallet / Gateway Reference', pay?.gatewayRef ?? (pay?.method === 'Wallet' ? `Wallet · ${pay.id}` : '—')],
          ['Refund Details', 'No refund recorded'],
        ]}
      />
    </DetailPanel>
  );
}
