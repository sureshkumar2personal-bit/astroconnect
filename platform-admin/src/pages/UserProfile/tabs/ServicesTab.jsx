import { useMemo, useState } from 'react';
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
  Stats,
  SubHeading,
  Timeline,
  ViewButton,
  dt,
  money,
  usePaged,
} from '../components/ui.jsx';

const TYPES = ['Text Question', 'Appointment', 'Instant Call', 'Instant Chat'];
const TYPE_PLURAL = { 'Text Question': 'Text Questions', Appointment: 'Appointments', 'Instant Call': 'Instant Calls', 'Instant Chat': 'Instant Chats' };

// Tab 3 — Services (§6). View only: operational changes happen in the
// standalone service modules. Shows the User Paid Amount only — never
// platform commission or astrologer earnings.
export default function ServicesTab({ profile }) {
  const services = profile.services;
  const [type, setType] = useState('all');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [status, setStatus] = useState('all');
  const [payment, setPayment] = useState('all');
  const [astro, setAstro] = useState('all');
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(null);
  const [preview, setPreview] = useState(null);

  const statuses = useMemo(() => [...new Set(services.map((s) => s.status))].sort(), [services]);
  const paymentStatuses = useMemo(() => [...new Set(services.map((s) => s.paymentStatus))].sort(), [services]);
  const astrologers = useMemo(() => {
    const map = new Map(services.map((s) => [s.astrologer.id, s.astrologer.name]));
    return [...map.entries()].sort((a, b) => a[1].localeCompare(b[1]));
  }, [services]);

  const q = query.trim().toLowerCase();
  const fromTs = from ? new Date(`${from}T00:00:00`).getTime() : null;
  const toTs = to ? new Date(`${to}T23:59:59`).getTime() : null;
  const rows = services.filter((s) => {
    const created = new Date(s.createdAt).getTime();
    return (
      (type === 'all' || s.type === type) &&
      (status === 'all' || s.status === status) &&
      (payment === 'all' || s.paymentStatus === payment) &&
      (astro === 'all' || s.astrologer.id === astro) &&
      (fromTs === null || created >= fromTs) &&
      (toTs === null || created <= toTs) &&
      (!q || s.id.toLowerCase().includes(q))
    );
  });
  const filtered = Boolean(type !== 'all' || from || to || status !== 'all' || payment !== 'all' || astro !== 'all' || q);
  const paged = usePaged(rows, 10, [type, from, to, status, payment, astro, q].join('|'));

  const attachments = services.flatMap((s) => (s.attachments ?? []).map((a) => ({ ...a, serviceId: s.id, key: `${s.id}-${a.name}` })));

  return (
    <div className="p-stack">
      <Stats
        label="Service overview"
        items={[
          ...TYPES.map((t) => [TYPE_PLURAL[t], services.filter((s) => s.type === t).length]),
          ['Total Services', services.length, 'gold'],
        ]}
      />

      <Section id="s-list" title="Service History" description="View only. Changes to services are made in Service Management.">
        <FilterBar
          canClear={filtered}
          onClear={() => {
            setType('all');
            setFrom('');
            setTo('');
            setStatus('all');
            setPayment('all');
            setAstro('all');
            setQuery('');
          }}
        >
          <SearchFilter label="Service ID" value={query} onChange={setQuery} placeholder="Search service ID" />
          <SelectFilter label="Service Type" value={type} onChange={setType} options={[['all', 'All types'], ...TYPES]} />
          <SelectFilter label="Service Status" value={status} onChange={setStatus} options={[['all', 'All statuses'], ...statuses]} />
          <SelectFilter label="Payment Status" value={payment} onChange={setPayment} options={[['all', 'All'], ...paymentStatuses]} />
          <SelectFilter label="Astrologer" value={astro} onChange={setAstro} options={[['all', 'All astrologers'], ...astrologers]} />
          <DateFilter label="Created from" value={from} onChange={setFrom} max={to || undefined} />
          <DateFilter label="Created to" value={to} onChange={setTo} min={from || undefined} />
        </FilterBar>
        <DataTable
          caption="Service history"
          rows={paged.rows}
          onRowClick={setOpen}
          empty={
            services.length ? (
              <Empty title="No matching services" text="Change or clear the filters." />
            ) : (
              <Empty icon="services" title="No services yet" text="Services booked by this user will appear here." />
            )
          }
          columns={[
            { key: 'id', header: 'Service ID', primary: true, render: (s) => <span className="p-mono">{s.id}</span> },
            { key: 'type', header: 'Service Type', render: (s) => s.type },
            { key: 'astro', header: 'Astrologer', render: (s) => <Astro a={s.astrologer} /> },
            { key: 'created', header: 'Created Date', render: (s) => dt(s.createdAt) },
            { key: 'svc', header: 'Service Date', render: (s) => (s.type === 'Text Question' ? '—' : dt(s.serviceAt)) },
            { key: 'paid', header: 'User Paid Amount', className: 'is-num', render: (s) => money(s.amount) },
            { key: 'pay', header: 'Payment Status', render: (s) => <Pill value={s.paymentStatus} /> },
            { key: 'status', header: 'Service Status', render: (s) => <Pill value={s.status} /> },
            { key: 'actions', header: 'View Details', render: (s) => <ViewButton onClick={() => setOpen(s)} /> },
          ]}
        />
        {paged.pager('services')}
      </Section>

      <Section id="s-att" title="Attachments" description="Files shared by the user and the astrologer in services.">
        <DataTable
          caption="Service attachments"
          rows={attachments}
          rowKey={(a) => a.key}
          empty={<Empty icon="document" title="No attachments" />}
          columns={[
            { key: 'file', header: 'File', primary: true, render: (a) => <span className="p-file">{a.name}</span> },
            { key: 'type', header: 'Type', render: (a) => `${a.type} · ${a.size}` },
            { key: 'sender', header: 'Sender', render: (a) => a.sender },
            { key: 'svc', header: 'Service', render: (a) => <span className="p-mono">{a.serviceId}</span> },
            { key: 'at', header: 'Timestamp', render: (a) => dt(a.at) },
            { key: 'actions', header: 'Preview', render: (a) => <ViewButton label="Preview" onClick={() => setPreview(a)} /> },
          ]}
        />
      </Section>

      {open && <ServiceDetails service={open} user={profile.user} onClose={() => setOpen(null)} onPreview={setPreview} />}
      {preview && (
        <DetailPanel title={preview.name} subtitle={`${preview.type} · ${preview.size}`} onClose={() => setPreview(null)}>
          <div className="p-preview">
            <span className="p-preview__icon">{preview.type}</span>
            <p className="p-muted">A preview is not available for this file.</p>
          </div>
          <Fields
            columns={2}
            items={[
              ['Sender', preview.sender],
              ['Uploaded', dt(preview.at)],
              ['Related Service', preview.serviceId ?? '—'],
              ['File Type', preview.type],
            ]}
          />
        </DetailPanel>
      )}
    </div>
  );
}

function Astro({ a }) {
  return (
    <span className="p-desc">
      <span>{a.name}</span>
      <span className="p-small p-mono">{a.id}</span>
    </span>
  );
}

function PaymentDetails({ service }) {
  const p = service.payments ?? [];
  return (
    <>
      <SubHeading>Payment Details</SubHeading>
      <Fields
        columns={2}
        items={[
          ['User Paid Amount', money(service.amount)],
          ['Payment Status', <Pill key="ps" value={service.paymentStatus} />],
          ['Payment Method', p[0]?.method ?? service.method],
          ['Payment Date / Time', dt(p[0]?.at ?? service.createdAt)],
          ['Payment Transaction ID', p.map((x) => x.id).join(', ') || '—', { wide: true }],
          ['Gateway Reference', p.map((x) => x.gatewayRef).filter(Boolean).join(', ') || '—'],
          ['Refund Amount', service.refundInfo ? `${money(service.refundInfo.amount)} · ${service.refundInfo.status}` : '—'],
        ]}
      />
    </>
  );
}

function ServiceDetails({ service: s, user, onClose, onPreview }) {
  return (
    <DetailPanel title={s.id} subtitle={`${s.type} · ${s.astrologer.name} (${s.astrologer.id})`} onClose={onClose}>
      {s.type === 'Text Question' && (
        <>
          <Fields
            columns={2}
            items={[
              ['Question ID', s.id],
              ['User / Astrologer', `${user.name} / ${s.astrologer.name}`],
              ['Submitted', dt(s.createdAt)],
              ['Deadline (30 days)', dt(s.deadline)],
              ['Status shown to user', <Pill key="st" value={s.status} />],
              ['Answer Date / Time', dt(s.answeredAt)],
              ['Birth Details Used', s.birthDetailsUsed, { wide: true }],
            ]}
          />
          <SubHeading>Question</SubHeading>
          <p className="p-quote">{s.question}</p>
          <SubHeading>Answer</SubHeading>
          <p className="p-quote">{s.answer ?? 'The astrologer has not answered yet.'}</p>
          <Attachments list={s.attachments} serviceId={s.id} onPreview={onPreview} />
        </>
      )}

      {s.type === 'Appointment' && (
        <>
          <Fields
            columns={2}
            items={[
              ['Appointment ID', s.id],
              ['Astrologer', `${s.astrologer.name} (${s.astrologer.id})`],
              ['Booking Date / Time', dt(s.createdAt)],
              ['Appointment Slot', dt(s.serviceAt)],
              ['Duration', `${s.duration} minutes`],
              ['Appointment Type', 'Voice only'],
              ['Status', <Pill key="st" value={s.status} />],
              ['Cancellation Reason', s.cancellation ? `${s.cancellation.reason} (${dt(s.cancellation.at)})` : '—', { wide: true }],
              ['Refund Amount / Status', s.refundInfo ? `${money(s.refundInfo.amount)} · ${s.refundInfo.status} (${s.refundInfo.id})` : '—', { wide: true }],
            ]}
          />
          <SubHeading>Reschedule History</SubHeading>
          {s.reschedules.length ? (
            <ul className="p-list">
              {s.reschedules.map((r) => (
                <li key={r.at}>
                  Rescheduled by {r.by.toLowerCase()} on {dt(r.at)}: {dt(r.from)} → {dt(r.to)}
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-muted">Not rescheduled. The user can reschedule an appointment once.</p>
          )}
          <SubHeading>Notifications</SubHeading>
          <Timeline items={s.notifications} />
        </>
      )}

      {(s.type === 'Instant Call' || s.type === 'Instant Chat') && (
        <>
          <Fields
            columns={2}
            items={[
              ['Session ID', s.id],
              ['Astrologer', `${s.astrologer.name} (${s.astrologer.id})`],
              ['Requested', dt(s.requestedAt)],
              [s.type === 'Instant Call' ? 'Connected' : 'Started', dt(s.connectedAt)],
              ['Ended', dt(s.endedAt)],
              ['Duration', `${s.usedMinutes} min`],
              ['Status', <Pill key="st" value={s.status} />],
              ['Termination Reason', s.termination],
              ['Package Purchased', `${s.package.minutes}-minute package`],
              ['Package Duration', `${s.package.minutes} min`],
              ['Package Price', money(s.package.price)],
              ['Extensions', s.extensions ? `${s.extensions} × ${s.package.minutes}-minute package` : 'None'],
              ['User Charged Amount', money(s.amount)],
              ['Wallet Transaction', s.payments?.filter((x) => x.method === 'Wallet').map((x) => x.id).join(', ') || 'Paid directly'],
            ]}
          />
          <p className="p-muted p-small">
            Prepaid package. Ending a session early does not create a refund.
          </p>
          <SubHeading>{s.type === 'Instant Call' ? 'Call Audio' : 'Chat Transcript'}</SubHeading>
          <p className="p-restricted">
            {s.type === 'Instant Call'
              ? 'Calls are not recorded.'
              : 'Chat messages are available to the user and the astrologer for 24 hours only. Platform Admin can view the conversation for 3 months in Service Management → Instant Chat.'}
          </p>
        </>
      )}

      <PaymentDetails service={s} />
    </DetailPanel>
  );
}

function Attachments({ list, serviceId, onPreview }) {
  return (
    <>
      <h4 className="p-subhead">Attachments</h4>
      {list?.length ? (
        <ul className="p-list">
          {list.map((a) => (
            <li key={a.name} className="p-inline">
              <span className="p-file">{a.name}</span>
              <span className="p-small">
                {a.sender} · {dt(a.at)}
              </span>
              <button type="button" className="p-view" onClick={() => onPreview({ ...a, serviceId })}>
                Preview
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="p-muted">No attachments.</p>
      )}
    </>
  );
}
