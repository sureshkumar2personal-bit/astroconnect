import { useId, useState } from 'react';
import Icon from '../../../components/icons.jsx';
import { href } from '../../../router/useHashRoute.js';
import { SERVICE_NAMES } from '../../../data/dashboardService.js';
import { EmptyNote, PendingTag, Tag } from './Common.jsx';

const SERVICE_PATHS = {
  text: '/services/text-questions',
  appointment: '/services/appointments',
  call: '/services/instant-call',
  chat: '/services/instant-chat',
};

const STATUS_TONE = { 'Due Today': 'gold', Overdue: 'danger', Urgent: 'danger' };

function Stat({ label, value, tone }) {
  return (
    <div className={`alert-stat${tone ? ` alert-stat--${tone}` : ''}`}>
      <span className="alert-stat__value">{value}</span>
      <span className="alert-stat__label">{label}</span>
    </div>
  );
}

// Section D.1 — Astrologer Tasks & Deadline (03 §6.1).
export function AstrologerTasksAlert({ data }) {
  const [open, setOpen] = useState(false);
  const listId = useId();

  // Task list grouped by Astrologer, then Service.
  const groups = new Map();
  for (const task of data.tasks) {
    if (!groups.has(task.astrologer)) groups.set(task.astrologer, []);
    groups.get(task.astrologer).push(task);
  }
  const grouped = [...groups.entries()]
    .map(([astrologer, tasks]) => ({
      astrologer,
      overdue: tasks.some((t) => t.status === 'Overdue'),
      tasks: tasks.sort((a, b) => a.service.localeCompare(b.service) || a.id.localeCompare(b.id)),
    }))
    .sort((a, b) => Number(b.overdue) - Number(a.overdue) || a.astrologer.localeCompare(b.astrologer));

  return (
    <section className="alert" aria-labelledby={`${listId}-title`}>
      <header className="alert__head">
        <span className="alert__icon">
          <Icon name="clock" size={18} />
        </span>
        <h3 id={`${listId}-title`} className="alert__title">
          Astrologer Tasks &amp; Deadline
        </h3>
      </header>

      <div className="alert__stats">
        <Stat label="Due Today" value={data.dueToday} tone="gold" />
        <Stat label="Overdue" value={data.overdue} tone={data.overdue ? 'danger' : undefined} />
      </div>

      <table className="mini-table">
        <caption className="visually-hidden">Astrologer tasks by service</caption>
        <thead>
          <tr>
            <th scope="col">Service</th>
            <th scope="col">Due Today</th>
            <th scope="col">Overdue</th>
          </tr>
        </thead>
        <tbody>
          {data.summary.map((row) => (
            <tr key={row.key}>
              <th scope="row">
                <a href={href(SERVICE_PATHS[row.key])}>{row.label}</a>
              </th>
              <td>{row.dueToday}</td>
              <td>
                {row.overdue === null ? (
                  <PendingTag id="PP-21">Not defined</PendingTag>
                ) : (
                  <span className={row.overdue ? 'is-danger' : undefined}>{row.overdue}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        type="button"
        className="alert__toggle"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
        disabled={!data.tasks.length}
      >
        {open ? 'Hide task list' : `View task list (${data.tasks.length})`}
        <Icon name="chevronDown" size={16} className="alert__toggle-icon" />
      </button>

      <div id={listId} className="task-groups" hidden={!open}>
        {grouped.map((g) => (
          <div key={g.astrologer} className="task-group">
            <h4 className="task-group__name">{g.astrologer}</h4>
            <table className="task-table">
              <thead className="visually-hidden">
                <tr>
                  <th scope="col">Task ID</th>
                  <th scope="col">Service</th>
                  <th scope="col">Deadline</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {g.tasks.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <a href={href(SERVICE_PATHS[t.service], t.id)}>{t.id}</a>
                    </td>
                    <td>{SERVICE_NAMES[t.service]}</td>
                    <td>{t.deadline}</td>
                    <td>
                      <Tag tone={STATUS_TONE[t.status]}>{t.status}</Tag>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </section>
  );
}

// Section D.2 — Platform Tasks & Urgent alerts (03 §6.2).
export function PlatformTasksAlert({ data }) {
  const titleId = useId();
  return (
    <section className="alert" aria-labelledby={titleId}>
      <header className="alert__head">
        <span className="alert__icon">
          <Icon name="alert" size={18} />
        </span>
        <h3 id={titleId} className="alert__title">
          Platform Tasks &amp; Urgent
        </h3>
      </header>

      <div className="alert__stats">
        <Stat label="Due Today" value={data.dueToday} tone="gold" />
        <Stat label="Overdue" value={data.overdue} tone={data.overdue ? 'danger' : undefined} />
        <Stat label="Urgent" value={data.urgent} tone={data.urgent ? 'danger' : undefined} />
      </div>

      {data.tasks.length ? (
        <ul className="ptask-list">
          {data.tasks.map((t) => (
            <li key={t.id}>
              <a
                className={`ptask${t.emergency ? ' ptask--emergency' : ''}`}
                href={href(t.path, t.ref)}
              >
                <span className="ptask__main">
                  <span className="ptask__meta">
                    {t.emergency && <span className="ptask__flag">Emergency</span>}
                    {t.category} · {t.ref}
                  </span>
                  <span className="ptask__title">{t.title}</span>
                </span>
                <Tag tone={STATUS_TONE[t.status]}>{t.status}</Tag>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyNote>No platform tasks need attention.</EmptyNote>
      )}
    </section>
  );
}
