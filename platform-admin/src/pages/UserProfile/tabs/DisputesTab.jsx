import { useState } from 'react';
import {
  DataTable,
  DetailPanel,
  Empty,
  Fields,
  Pill,
  Section,
  Stats,
  SubHeading,
  Timeline,
  ViewButton,
  dash,
  dt,
} from '../components/ui.jsx';

// Tab 7 — Disputes (§10). The same records as Dispute & Complaint
// Management (src/data/disputesStore.js). Admin actions happen in that module.
export default function DisputesTab({ profile }) {
  const { disputes, complaints } = profile;
  const [open, setOpen] = useState(null);

  return (
    <div className="p-stack">
      <Stats
        label="Disputes overview"
        items={[
          ['Service Disputes', disputes.length, 'gold'],
          ['Technical Complaints', complaints.length, 'gold'],
          ['Open Items', [...disputes, ...complaints].filter((x) => !['Resolved', 'Rejected', 'Closed', 'Withdrawn by User'].includes(x.status)).length],
        ]}
      />

      <Section
        id="d-disputes"
        title="Service Disputes"
        description="Text Question answers only, one per question. A dispute is raised within 7 days after the answer; the astrologer answers once within 3 days, otherwise it moves to Admin Review."
      >
        <DataTable
          caption="Service disputes"
          rows={disputes}
          onRowClick={setOpen}
          empty={<Empty icon="question" title="No service disputes" />}
          columns={[
            { key: 'id', header: 'Dispute ID', primary: true, render: (r) => <span className="p-mono">{r.id}</span> },
            { key: 'q', header: 'Text Question ID', render: (r) => <span className="p-mono">{r.questionId}</span> },
            { key: 'at', header: 'Date / Time', render: (r) => dt(r.raisedAt) },
            { key: 'cat', header: 'Category', render: (r) => r.category },
            { key: 'astro', header: 'Astrologer', render: (r) => r.astrologer.name },
            { key: 'deadline', header: 'Astrologer Deadline', render: (r) => dt(r.deadline) },
            { key: 'status', header: 'Status', render: (r) => <Pill value={r.status} /> },
            { key: 'actions', header: 'Details', render: (r) => <ViewButton onClick={() => setOpen(r)} /> },
          ]}
        />
      </Section>

      <Section id="d-complaints" title="Technical Complaints" description="Issues with appointments, calls, chats, subscriptions, payments, wallet, login or the app.">
        <DataTable
          caption="Technical complaints"
          rows={complaints}
          onRowClick={setOpen}
          empty={<Empty icon="alert" title="No technical complaints" />}
          columns={[
            { key: 'id', header: 'Complaint ID', primary: true, render: (r) => <span className="p-mono">{r.id}</span> },
            { key: 'cat', header: 'Category', render: (r) => r.category },
            { key: 'svc', header: 'Related Service', render: (r) => <span className="p-mono">{dash(r.serviceId)}</span> },
            { key: 'at', header: 'Date / Time', render: (r) => dt(r.raisedAt) },
            { key: 'issue', header: 'Issue', className: 'p-wrap', render: (r) => r.evidence[0].value },
            { key: 'status', header: 'Status', render: (r) => <Pill value={r.status} /> },
            { key: 'actions', header: 'Details', render: (r) => <ViewButton onClick={() => setOpen(r)} /> },
          ]}
        />
      </Section>

      {open && <RecordDetails record={open} onClose={() => setOpen(null)} />}
    </div>
  );
}

function RecordDetails({ record: r, onClose }) {
  return (
    <DetailPanel title={r.id} subtitle={r.kind} onClose={onClose}>
      <Fields
        columns={2}
        items={[
          [r.questionId ? 'Text Question ID' : 'Related Service', dash(r.questionId ?? r.serviceId)],
          ['Date / Time', dt(r.raisedAt)],
          ['Category', r.category],
          ['Status', <Pill key="s" value={r.status} />],
          ['Deadline', r.deadline ? `Astrologer answer due ${dt(r.deadline)}` : 'Not set', { wide: true }],
        ]}
      />
      <SubHeading>Evidence</SubHeading>
      <ul className="p-evidence">
        {r.evidence.map((e) => (
          <li key={e.label}>
            <span className="p-evidence__type">{e.type}</span>
            {e.type === 'Text' ? <span>{e.value}</span> : <span className="p-file">{e.label} · {e.value}</span>}
          </li>
        ))}
      </ul>
      <SubHeading>Responses</SubHeading>
      {r.responses.length ? (
        <ul className="p-responses">
          {r.responses.map((x) => (
            <li key={x.at}>
              <p className="p-responses__from">
                {x.from} · {dt(x.at)}
              </p>
              <p className="p-responses__text">{x.text}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="p-muted">No responses yet.</p>
      )}
      <SubHeading>Investigation</SubHeading>
      <p className={r.investigation ? '' : 'p-muted'}>{r.investigation || 'No investigation recorded yet.'}</p>
      <SubHeading>Resolution</SubHeading>
      <p className={r.resolution ? '' : 'p-muted'}>{r.resolution || 'Not resolved yet.'}</p>
      <SubHeading>Timeline</SubHeading>
      <Timeline items={r.timeline} />
      <p className="p-small p-muted p-panel__foot">Actions on this record are taken in Dispute &amp; Complaint Management.</p>
    </DetailPanel>
  );
}
