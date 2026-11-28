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
  d,
  dt,
} from '../components/ui.jsx';

const STATUSES = ['Suggested', 'In Progress', 'Completed', 'Overdue', 'Cancelled'];

// Tab 6 — Remedies (§9, 08-remedy-management.md). View only.
export default function RemediesTab({ profile }) {
  const { remedies } = profile;
  const [open, setOpen] = useState(null);

  return (
    <div className="p-stack">
      <Stats
        label="Remedy overview"
        items={[
          ['Total', remedies.length, 'gold'],
          ...STATUSES.map((s) => [s, remedies.filter((r) => r.status === s).length, s === 'Overdue' ? 'danger' : s === 'Completed' ? 'green' : undefined]),
        ]}
      />
      <Section id="rm-list" title="Remedy Records" description="Duration starts when the user starts a remedy (Day 1). A missed day never cancels or resets a remedy.">
        <DataTable
          caption="Remedies"
          rows={remedies}
          onRowClick={setOpen}
          empty={<Empty icon="services" title="No remedies" text="Remedies suggested by astrologers will appear here." />}
          columns={[
            { key: 'id', header: 'Remedy ID', primary: true, render: (r) => <span className="p-mono">{r.id}</span> },
            { key: 'title', header: 'Remedy', render: (r) => <span className="p-desc"><span>{r.title}</span><span className="p-small">{r.astrologer.name} · {r.serviceId}</span></span> },
            { key: 'sug', header: 'Suggested Date', render: (r) => d(r.suggestedAt) },
            { key: 'start', header: 'Start Date', render: (r) => d(r.startAt) },
            { key: 'dur', header: 'Duration', render: (r) => `${r.duration} days` },
            { key: 'due', header: 'Due Date', render: (r) => d(r.dueAt) },
            { key: 'prog', header: 'Daily Progress', render: (r) => <ProgressBar remedy={r} /> },
            { key: 'status', header: 'Status', render: (r) => <Pill value={r.status} /> },
            { key: 'actions', header: 'Details', render: (r) => <ViewButton onClick={() => setOpen(r)} /> },
          ]}
        />
      </Section>
      {open && <RemedyDetails remedy={open} onClose={() => setOpen(null)} />}
    </div>
  );
}

const VALUE_CLASS = {
  'Completed for Today': 'is-done',
  'Not Done': 'is-not',
  'Unable to Do': 'is-unable',
  'Missed Update': 'is-missed',
};

function ProgressBar({ remedy }) {
  if (!remedy.progress.length) return <span className="p-small">Not started</span>;
  const done = remedy.progress.filter((p) => p.value === 'Completed for Today').length;
  return (
    <span className="p-desc">
      <span className="p-dots" aria-hidden="true">
        {remedy.progress.slice(-14).map((p) => (
          <span key={p.day} className={`p-dot ${VALUE_CLASS[p.value]}`} />
        ))}
      </span>
      <span className="p-small">
        {done} of {remedy.progress.length} days completed
      </span>
    </span>
  );
}

function RemedyDetails({ remedy: r, onClose }) {
  return (
    <DetailPanel title={`${r.id} · ${r.title}`} subtitle={`${r.astrologer.name} · from ${r.serviceId}`} onClose={onClose}>
      <Fields
        columns={2}
        items={[
          ['Status', <Pill key="s" value={r.status} />],
          ['Suggested Date', dt(r.suggestedAt)],
          ['Start Date', dt(r.startAt)],
          ['Duration', `${r.duration} days`],
          ['Due Date', d(r.dueAt)],
          ['Completed', dt(r.completedAt)],
          ['Instructions', r.instructions, { wide: true }],
        ]}
      />
      <SubHeading>Steps</SubHeading>
      <ol className="p-list p-list--num">
        {r.steps.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ol>

      <SubHeading>Daily Progress</SubHeading>
      {r.progress.length ? (
        <>
          <ul className="p-legend">
            {Object.entries(VALUE_CLASS).map(([label, cls]) => (
              <li key={label}>
                <span className={`p-dot ${cls}`} aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
          <ol className="p-days">
            {r.progress.map((p) => (
              <li key={p.day} className={`p-day ${VALUE_CLASS[p.value]}`} title={`Day ${p.day}: ${p.value}`}>
                <span className="p-day__n">Day {p.day}</span>
                <span className="p-day__v">{p.value}</span>
                {p.reason && <span className="p-day__r">{p.reason}</span>}
                {p.value !== 'Missed Update' && <span className="p-day__t">{dt(p.at)}</span>}
              </li>
            ))}
          </ol>
        </>
      ) : (
        <p className="p-muted">The user has not started this remedy.</p>
      )}

      <SubHeading>Completion Proof</SubHeading>
      {r.proof.length ? (
        <ul className="p-list">
          {r.proof.map((p) => (
            <li key={p.name}>
              <span className="p-file">{p.name}</span> · {p.type} · {dt(p.at)}
            </li>
          ))}
        </ul>
      ) : (
        <p className="p-muted">No proof uploaded. Proof is optional.</p>
      )}

      <SubHeading>Reminder History</SubHeading>
      <DataTable
        caption="Reminder history"
        rows={r.reminders.slice(-10).reverse()}
        rowKey={(m) => `${m.at}-${m.day}`}
        empty={<p className="p-muted">No reminders sent.</p>}
        columns={[
          { key: 'type', header: 'Reminder Type', primary: true, render: (m) => m.type },
          { key: 'day', header: 'Day', render: (m) => `Day ${m.day}` },
          { key: 'at', header: 'Date / Time', render: (m) => dt(m.at) },
          { key: 'status', header: 'Status', render: (m) => <Pill value={m.status} /> },
          { key: 'fail', header: 'Failure Reason', render: (m) => m.failureReason || '—' },
        ]}
      />
      {r.reminders.length > 10 && <p className="p-small p-muted">Showing the latest 10 of {r.reminders.length} reminders.</p>}

      <SubHeading>Edit / Cancel History</SubHeading>
      {r.history.length ? (
        <ul className="p-list">
          {r.history.map((h) => (
            <li key={h.at}>
              <strong>{h.action}</strong> by {h.by} on {dt(h.at)} — {h.detail}
            </li>
          ))}
        </ul>
      ) : (
        <p className="p-muted">No edits or cancellations.</p>
      )}

      <SubHeading>Timeline</SubHeading>
      <Timeline items={r.timeline} />
    </DetailPanel>
  );
}
