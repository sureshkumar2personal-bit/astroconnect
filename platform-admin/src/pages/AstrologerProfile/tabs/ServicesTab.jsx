import { useMemo, useState } from 'react';
import { href } from '../../../router/useHashRoute.js';
import { userProfilePath } from '../../../router/navigation.js';
import { NOT_FINALISED } from '../../../data/astrologersStore.js';
import {
  DataTable,
  DateFilter,
  DetailPanel,
  Empty,
  Fields,
  FilterBar,
  Pill,
  SearchFilter,
  Section,
  SelectFilter,
  SubHeading,
  Timeline,
  ViewButton,
  dt,
  money,
  usePaged,
} from '../../UserProfile/components/ui.jsx';
import ExportButtons from '../components/ExportButtons.jsx';

const TYPES = ['Text Question', 'Appointment', 'Instant Call', 'Instant Chat'];

function earningsOf(service, wallet) {
  const e = wallet.earnings.find((x) => x.service.id === service.id);
  if (!e) return { label: 'No earnings', value: null };
  if (e.net === null) return { label: NOT_FINALISED, value: null, state: e.state };
  return { label: money(e.net), value: e.net, state: e.state, commission: e.commission };
}

const COLUMNS = (wallet) => [
  { header: 'Service ID', value: (s) => s.id, width: 16 },
  { header: 'Type', value: (s) => s.type, width: 14 },
  { header: 'User', value: (s) => `${s.user.name} (${s.user.id})`, width: 28 },
  { header: 'Created', value: (s) => dt(s.createdAt), width: 20 },
  { header: 'Service Date', value: (s) => (s.type === 'Text Question' ? '' : dt(s.serviceAt)), width: 20 },
  { header: 'User Paid Amount', value: (s) => s.amount, width: 12 },
  { header: 'Astrologer Earnings', value: (s) => earningsOf(s, wallet).value ?? earningsOf(s, wallet).label, width: 14 },
  { header: 'Service Status', value: (s) => s.status, width: 16 },
  { header: 'Payment Status', value: (s) => s.paymentStatus, width: 12 },
];

// Tab 4 — Services (§7). View only; shows astrologer earnings and prepaid
// packages. No call audio or chat transcript access (PP-04, AD-111).
export default function ServicesTab({ profile, notify }) {
  const { services, wallet, astrologer } = profile;
  const [type, setType] = useState('all');
  const [status, setStatus] = useState('all');
  const [payment, setPayment] = useState('all');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(null);

  const statuses = useMemo(() => [...new Set(services.map((s) => s.status))].sort(), [services]);
  const payments = useMemo(() => [...new Set(services.map((s) => s.paymentStatus))].sort(), [services]);
  const q = query.trim().toLowerCase();
  const fromTs = from ? new Date(`${from}T00:00:00`).getTime() : null;
  const toTs = to ? new Date(`${to}T23:59:59`).getTime() : null;
  const rows = services.filter((s) => {
    const c = new Date(s.createdAt).getTime();
    return (type === 'all' || s.type === type) && (status === 'all' || s.status === status) && (payment === 'all' || s.paymentStatus === payment) && (fromTs === null || c >= fromTs) && (toTs === null || c <= toTs) && (!q || s.id.toLowerCase().includes(q) || s.user.id.toLowerCase().includes(q) || s.user.name.toLowerCase().includes(q));
  });
  const paged = usePaged(rows, 10, [type, status, payment, from, to, q].join('|'));

  // Per-service status counts (approved statuses; no invented groupings).
  const overview = TYPES.map((t) => {
    const list = services.filter((s) => s.type === t);
    const byStatus = {};
    for (const s of list) byStatus[s.status] = (byStatus[s.status] ?? 0) + 1;
    return { type: t, total: list.length, byStatus };
  });

  return (
    <div className="p-stack">
      <Section id="as-overview" title="Service Overview" description="Totals by approved service status (Text Questions AD-51, Appointments AD-89, Instant Call and Chat sessions).">
        <DataTable
          caption="Service overview"
          rows={overview}
          rowKey={(r) => r.type}
          columns={[
            { key: 'type', header: 'Service', primary: true, render: (r) => r.type },
            { key: 'total', header: 'Total', className: 'is-num', render: (r) => <strong>{r.total}</strong> },
            { key: 'status', header: 'By Status', className: 'p-wrap', render: (r) => (r.total ? Object.entries(r.byStatus).map(([k, v]) => `${k} ${v}`).join(' · ') : '—') },
          ]}
        />
      </Section>

      <Section id="as-list" title="Service History" description="View only. Changes to services are made in Service Management." actions={<ExportButtons title="Services" astrologer={astrologer} columns={COLUMNS(wallet)} rows={rows} fileBase="astrologer-services" notify={notify} label="services" />}>
        <FilterBar canClear={type !== 'all' || status !== 'all' || payment !== 'all' || from || to || q} onClear={() => { setType('all'); setStatus('all'); setPayment('all'); setFrom(''); setTo(''); setQuery(''); }}>
          <SearchFilter label="Search" value={query} onChange={setQuery} placeholder="Service ID, user name or ID" />
          <SelectFilter label="Service Type" value={type} onChange={setType} options={[['all', 'All types'], ...TYPES]} />
          <SelectFilter label="Service Status" value={status} onChange={setStatus} options={[['all', 'All statuses'], ...statuses]} />
          <SelectFilter label="Payment Status" value={payment} onChange={setPayment} options={[['all', 'All'], ...payments]} />
          <DateFilter label="Created from" value={from} onChange={setFrom} max={to || undefined} />
          <DateFilter label="Created to" value={to} onChange={setTo} min={from || undefined} />
        </FilterBar>
        <DataTable
          caption="Service history"
          rows={paged.rows}
          onRowClick={setOpen}
          empty={services.length ? <Empty title="No matching services" text="Change or clear the filters." /> : <Empty icon="services" title="No services yet" />}
          columns={[
            { key: 'id', header: 'Service ID', primary: true, render: (s) => <span className="p-mono">{s.id}</span> },
            { key: 'type', header: 'Type', render: (s) => s.type },
            { key: 'user', header: 'User Name / ID', render: (s) => <span className="p-desc"><a className="u-name" href={href(userProfilePath(s.user.id))}>{s.user.name}</a><span className="p-small">{s.user.id}</span></span> },
            { key: 'created', header: 'Created Date', render: (s) => dt(s.createdAt) },
            { key: 'svc', header: 'Service Date', render: (s) => (s.type === 'Text Question' ? '—' : dt(s.serviceAt)) },
            { key: 'paid', header: 'User Paid Amount', className: 'is-num', render: (s) => money(s.amount) },
            { key: 'earn', header: 'Astrologer Earnings', className: 'is-num', render: (s) => { const e = earningsOf(s, wallet); return <span className={e.value === null ? 'a-soft' : ''}>{e.label}</span>; } },
            { key: 'status', header: 'Service Status', render: (s) => <Pill value={s.status} /> },
            { key: 'pay', header: 'Payment Status', render: (s) => <Pill value={s.paymentStatus} /> },
            { key: 'actions', header: 'View Details', render: (s) => <ViewButton onClick={() => setOpen(s)} /> },
          ]}
        />
        {paged.pager('services')}
      </Section>
      {open && <Details service={open} wallet={wallet} onClose={() => setOpen(null)} />}
    </div>
  );
}

function Details({ service: s, wallet, onClose }) {
  const e = earningsOf(s, wallet);
  const earn = wallet.earnings.find((x) => x.service.id === s.id);
  return (
    <DetailPanel title={s.id} subtitle={`${s.type} · ${s.user.name} (${s.user.id})`} onClose={onClose}>
      {s.type === 'Text Question' && (
        <>
          <Fields columns={2} items={[['Received', dt(s.createdAt)], ['Deadline (30 days)', dt(s.deadline)], ['Status', <Pill key="s" value={s.status} />], ['Answered', dt(s.answeredAt)], ['Birth Details Used', s.birthDetailsUsed, { wide: true }]]} />
          <SubHeading>Question</SubHeading>
          <p className="p-quote">{s.question}</p>
          <SubHeading>Answer</SubHeading>
          <p className="p-quote">{s.answer ?? 'Not answered yet.'}</p>
          <SubHeading>Attachments</SubHeading>
          {s.attachments.length ? (
            <ul className="p-list">
              {s.attachments.map((f) => (
                <li key={f.name}>
                  <span className="p-file">{f.name}</span> · {f.sender} · {dt(f.at)}
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-muted">No attachments.</p>
          )}
        </>
      )}
      {s.type === 'Appointment' && (
        <>
          <Fields
            columns={2}
            items={[
              ['Booked', dt(s.createdAt)],
              ['Slot', dt(s.serviceAt)],
              ['Duration', `${s.duration} minutes (voice only)`],
              ['Status', <Pill key="s" value={s.status} />],
              ['Attendance', s.status === 'Completed' ? 'Attended' : s.status === 'Cancelled' ? 'Not held — cancelled by astrologer' : 'Upcoming'],
              ['Reschedule', s.reschedules.length ? `Rescheduled once by the user (${dt(s.reschedules[0].from)} → ${dt(s.reschedules[0].to)})` : 'Not rescheduled'],
              ['Cancellation', s.cancellation ? `${s.cancellation.reason} (${dt(s.cancellation.at)})` : '—', { wide: true }],
            ]}
          />
          <SubHeading>Notifications</SubHeading>
          <Timeline items={s.notifications} />
        </>
      )}
      {(s.type === 'Instant Call' || s.type === 'Instant Chat') && (
        <>
          <Fields
            columns={2}
            items={[
              ['Requested', dt(s.requestedAt)],
              ['Connected', dt(s.connectedAt)],
              ['Ended', dt(s.endedAt)],
              ['Session Duration', `${s.usedMinutes} min`],
              ['Package', `${s.package.minutes} minutes · ${money(s.package.price)}`],
              ['Extensions', s.extensions ? `${s.extensions} × ${s.package.minutes}-minute package` : 'None'],
              ['Termination Reason', s.termination],
              ['Status', <Pill key="s" value={s.status} />],
            ]}
          />
          <p className="p-restricted">
            {s.type === 'Instant Call' ? 'Calls are not recorded.' : 'Messages are available to the user and the astrologer for 24 hours only. Platform Admin can view the conversation for 3 months in Service Management → Instant Chat.'}
          </p>
        </>
      )}
      <SubHeading>Earnings and Payment</SubHeading>
      <Fields
        columns={2}
        items={[
          ['User Paid Amount', money(s.amount)],
          ['Commission', earn ? (earn.commission === null ? NOT_FINALISED : `${money(earn.commission)} (${Math.round(earn.rate * 100)}%)`) : 'No earnings'],
          ['Astrologer Earnings', e.label],
          ['Earnings Status', earn ? earn.state + (earn.settlementId ? ` · ${earn.settlementId}` : '') : s.cancellation ? 'No earnings (cancelled by astrologer)' : '—'],
          ['Payment Status', <Pill key="p" value={s.paymentStatus} />],
          ['Payment Method', s.payments?.[0]?.method ?? s.method],
          ['Payment Transaction ID', (s.payments ?? []).map((p) => p.id).join(', ') || '—', { wide: true }],
          ['Refund', s.refundInfo ? `${money(s.refundInfo.amount)} refunded to the user's Wallet (${s.refundInfo.id})` : '—', { wide: true }],
        ]}
      />
    </DetailPanel>
  );
}
