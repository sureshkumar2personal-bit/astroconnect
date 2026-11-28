import { useState } from 'react';
import { DataTable, DetailPanel, Empty, Fields, Pill, Section, Stats, SubHeading, Timeline, ViewButton, dt } from '../../UserProfile/components/ui.jsx';
import ExportButtons from '../components/ExportButtons.jsx';

const CLOSED = ['Resolved', 'Rejected', 'Closed', 'Withdrawn by User'];

// Tab 8 — Disputes & Complaints (§11). The same records as Dispute &
// Complaint Management and the users' profiles (disputesStore). View only.
// No chat transcript or call recording access (PP-04, AD-111).
export default function DisputesTab({ profile, notify }) {
  const { disputes, complaints, astrologer } = profile;
  const [open, setOpen] = useState(null);
  const columns = [
    { header: 'ID', value: (r) => r.id, width: 14 },
    { header: 'Type', value: (r) => r.kind, width: 18 },
    { header: 'Related Service', value: (r) => r.questionId ?? r.serviceId ?? '', width: 16 },
    { header: 'User', value: (r) => `${r.user.name} (${r.user.id})`, width: 28 },
    { header: 'Date / Time', value: (r) => dt(r.raisedAt), width: 20 },
    { header: 'Category', value: (r) => r.category, width: 18 },
    { header: 'Status', value: (r) => r.status, width: 20 },
  ];
  const all = [...disputes, ...complaints];
  return (
    <div className="p-stack">
      <Stats
        label="Disputes overview"
        items={[
          ['Service Disputes', disputes.length, 'gold'],
          ['Technical Complaints', complaints.length, 'gold'],
          ['Open Items', all.filter((x) => !CLOSED.includes(x.status)).length],
          ['Escalated to Admin Review', disputes.filter((x) => x.timeline.some((t) => t.text.includes('Admin Review'))).length],
        ]}
      />
      <Section
        id="adp-disputes"
        title="Service Disputes"
        description="Text Question answer disputes only. The astrologer answers once within 3 days; otherwise the dispute moves to Admin Review."
        actions={<ExportButtons title="Disputes and Complaints" astrologer={astrologer} columns={columns} rows={all} fileBase="astrologer-disputes" notify={notify} label="records" />}
      >
        <DataTable
          caption="Service disputes"
          rows={disputes}
          onRowClick={setOpen}
          empty={<Empty icon="question" title="No service disputes" />}
          columns={[
            { key: 'id', header: 'Dispute ID', primary: true, render: (r) => <span className="p-mono">{r.id}</span> },
            { key: 'q', header: 'Text Question ID', render: (r) => <span className="p-mono">{r.questionId}</span> },
            { key: 'user', header: 'User', render: (r) => `${r.user.name} (${r.user.id})` },
            { key: 'at', header: 'Date / Time', render: (r) => dt(r.raisedAt) },
            { key: 'deadline', header: 'Answer Deadline', render: (r) => dt(r.deadline) },
            { key: 'status', header: 'Status', render: (r) => <Pill value={r.status} /> },
            { key: 'actions', header: 'Details', render: (r) => <ViewButton onClick={() => setOpen(r)} /> },
          ]}
        />
      </Section>
      <Section id="adp-complaints" title="Technical Complaints" description="Complaints linked to this astrologer’s services.">
        <DataTable
          caption="Technical complaints"
          rows={complaints}
          onRowClick={setOpen}
          empty={<Empty icon="alert" title="No technical complaints" />}
          columns={[
            { key: 'id', header: 'Complaint ID', primary: true, render: (r) => <span className="p-mono">{r.id}</span> },
            { key: 'cat', header: 'Category', render: (r) => r.category },
            { key: 'svc', header: 'Related Service', render: (r) => <span className="p-mono">{r.serviceId}</span> },
            { key: 'user', header: 'User', render: (r) => `${r.user.name} (${r.user.id})` },
            { key: 'at', header: 'Date / Time', render: (r) => dt(r.raisedAt) },
            { key: 'status', header: 'Status', render: (r) => <Pill value={r.status} /> },
            { key: 'actions', header: 'Details', render: (r) => <ViewButton onClick={() => setOpen(r)} /> },
          ]}
        />
      </Section>
      {open && (
        <DetailPanel title={open.id} subtitle={`${open.kind} · ${open.user.name} (${open.user.id})`} onClose={() => setOpen(null)}>
          <Fields
            columns={2}
            items={[
              [open.questionId ? 'Text Question ID' : 'Related Service', open.questionId ?? open.serviceId],
              ['Date / Time', dt(open.raisedAt)],
              ['Category', open.category],
              ['Status', <Pill key="s" value={open.status} />],
              ['Deadline', open.deadline ? `Astrologer answer due ${dt(open.deadline)}` : 'Not set', { wide: true }],
            ]}
          />
          <SubHeading>Evidence</SubHeading>
          <ul className="p-evidence">
            {open.evidence.map((e) => (
              <li key={e.label}>
                <span className="p-evidence__type">{e.type}</span>
                {e.type === 'Text' ? <span>{e.value}</span> : <span className="p-file">{e.label} · {e.value}</span>}
              </li>
            ))}
          </ul>
          <SubHeading>Responses and Public Replies</SubHeading>
          {open.responses.length ? (
            <ul className="p-responses">
              {open.responses.map((x) => (
                <li key={x.at}>
                  <p className="p-responses__from">{x.from} · {dt(x.at)}</p>
                  <p className="p-responses__text">{x.text}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-muted">No responses yet.</p>
          )}
          <SubHeading>Investigation and Internal Notes</SubHeading>
          <p className={open.investigation ? '' : 'p-muted'}>{open.investigation || 'No investigation notes recorded yet.'}</p>
          <SubHeading>Resolution</SubHeading>
          <p className={open.resolution ? '' : 'p-muted'}>{open.resolution || 'Not resolved yet.'}</p>
          <Fields columns={2} items={[['Refund Resolution', 'No refund recorded']]} />
          <p className="p-restricted">Chat transcripts and call recordings are not accessible from this view.</p>
          <SubHeading>Timeline</SubHeading>
          <Timeline items={open.timeline} />
          <p className="p-small p-muted p-panel__foot">Actions on this record are taken in Dispute &amp; Complaint Management.</p>
        </DetailPanel>
      )}
    </div>
  );
}
