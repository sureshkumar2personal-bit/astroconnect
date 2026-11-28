import { useState } from 'react';
import { href } from '../../../router/useHashRoute.js';
import { userProfilePath } from '../../../router/navigation.js';
import { DataTable, DetailPanel, Empty, Fields, Pill, Section, Stats, SubHeading, Timeline, ViewButton, d, dt, usePaged } from '../../UserProfile/components/ui.jsx';
import ExportButtons from '../components/ExportButtons.jsx';

const STATUSES = ['Suggested', 'In Progress', 'Completed', 'Overdue', 'Cancelled'];
const VALUE_CLASS = { 'Completed for Today': 'is-done', 'Not Done': 'is-not', 'Unable to Do': 'is-unable', 'Missed Update': 'is-missed' };

// Tab 7 — Remedies (§10, 08-remedy-management.md). View only (decision 5):
// moderation happens in Remedy Management; hidden remedies show "Hidden".
export default function RemediesTab({ profile, notify }) {
  const { remedies, astrologer } = profile;
  const [open, setOpen] = useState(null);
  const paged = usePaged(remedies, 10);
  const columns = [
    { header: 'Remedy ID', value: (r) => r.id, width: 16 },
    { header: 'Remedy', value: (r) => r.title, width: 30 },
    { header: 'User', value: (r) => `${r.user.name} (${r.user.id})`, width: 28 },
    { header: 'Related Service', value: (r) => r.serviceId, width: 16 },
    { header: 'Suggested', value: (r) => d(r.suggestedAt), width: 14 },
    { header: 'Start', value: (r) => d(r.startAt), width: 14 },
    { header: 'Duration (days)', value: (r) => r.duration, width: 10 },
    { header: 'Due', value: (r) => d(r.dueAt), width: 14 },
    { header: 'Status', value: (r) => r.status, width: 12 },
    { header: 'Visibility', value: (r) => r.visibility, width: 10 },
  ];
  return (
    <div className="p-stack">
      <Stats
        label="Remedy overview"
        items={[
          ['Total', remedies.length, 'gold'],
          ...STATUSES.map((s) => [s, remedies.filter((r) => r.status === s).length, s === 'Overdue' ? 'danger' : s === 'Completed' ? 'green' : undefined]),
          ['Hidden', remedies.filter((r) => r.visibility === 'Hidden').length],
        ]}
      />
      <Section id="ar-list" title="Remedies" description="View only. Moderation (flag, review, hide) is handled in Remedy Management." actions={<ExportButtons title="Remedies" astrologer={astrologer} columns={columns} rows={remedies} fileBase="astrologer-remedies" notify={notify} label="remedies" />}>
        <DataTable
          caption="Remedies"
          rows={paged.rows}
          onRowClick={setOpen}
          empty={<Empty icon="services" title="No remedies suggested" />}
          columns={[
            { key: 'id', header: 'Remedy ID', primary: true, render: (r) => <span className="p-mono">{r.id}</span> },
            { key: 'title', header: 'Remedy', render: (r) => <span className="p-desc"><span>{r.title}</span><span className="p-small">{r.serviceId}</span></span> },
            { key: 'user', header: 'User', render: (r) => <a className="u-name" href={href(userProfilePath(r.user.id))}>{r.user.name}</a> },
            { key: 'sug', header: 'Suggested', render: (r) => d(r.suggestedAt) },
            { key: 'start', header: 'Start', render: (r) => d(r.startAt) },
            { key: 'dur', header: 'Duration', render: (r) => `${r.duration} days` },
            { key: 'due', header: 'Due', render: (r) => d(r.dueAt) },
            { key: 'status', header: 'Status', render: (r) => <span className="p-inline"><Pill value={r.status} />{r.visibility === 'Hidden' && <span className="a-hidden-tag">Hidden</span>}</span> },
            { key: 'actions', header: 'Details', render: (r) => <ViewButton onClick={() => setOpen(r)} /> },
          ]}
        />
        {paged.pager('remedies')}
      </Section>
      {open && <Details remedy={open} onClose={() => setOpen(null)} />}
    </div>
  );
}

function Details({ remedy: r, onClose }) {
  return (
    <DetailPanel title={`${r.id} · ${r.title}`} subtitle={`${r.user.name} (${r.user.id}) · from ${r.serviceId}`} onClose={onClose}>
      <Fields columns={2} items={[['Status', <Pill key="s" value={r.status} />], ['Visibility', r.visibility === 'Hidden' ? 'Hidden from the User App' : 'Visible'], ['Suggested', dt(r.suggestedAt)], ['Start (Day 1)', dt(r.startAt)], ['Duration', `${r.duration} days`], ['Due', d(r.dueAt)], ['Instructions', r.instructions, { wide: true }]]} />
      {r.moderation && (
        <p className="p-restricted">
          {r.moderation.action} by {r.moderation.by} on {dt(r.moderation.at)} — {r.moderation.reason}
        </p>
      )}
      <SubHeading>Steps</SubHeading>
      <ol className="p-list p-list--num">
        {r.steps.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ol>
      <SubHeading>Daily Progress</SubHeading>
      {r.progress.length ? (
        <ol className="p-days">
          {r.progress.map((p) => (
            <li key={p.day} className={`p-day ${VALUE_CLASS[p.value]}`}>
              <span className="p-day__n">Day {p.day}</span>
              <span className="p-day__v">{p.value}</span>
              {p.reason && <span className="p-day__r">{p.reason}</span>}
            </li>
          ))}
        </ol>
      ) : (
        <p className="p-muted">Not started by the user.</p>
      )}
      <SubHeading>Completion Proof</SubHeading>
      {r.proof.length ? <ul className="p-list">{r.proof.map((p) => <li key={p.name}><span className="p-file">{p.name}</span> · {dt(p.at)}</li>)}</ul> : <p className="p-muted">No proof uploaded. Proof is optional.</p>}
      <SubHeading>Reminder History</SubHeading>
      <p className="p-small">
        {r.reminders.length} reminders · {r.reminders.filter((m) => m.status === 'Delivered').length} delivered · {r.reminders.filter((m) => m.status === 'Failed').length} failed
      </p>
      <SubHeading>Edit / Cancel History</SubHeading>
      {r.history.length ? <ul className="p-list">{r.history.map((h) => <li key={h.at}><strong>{h.action}</strong> on {dt(h.at)} — {h.detail}</li>)}</ul> : <p className="p-muted">No edits or cancellations.</p>}
      <SubHeading>Timeline</SubHeading>
      <Timeline items={r.timeline} />
    </DetailPanel>
  );
}
