import { taskState } from '../../../data/assistantsStore.js';
import { DataTable, Empty, Pill, Section, Stats, dt, usePaged } from '../../UserProfile/components/ui.jsx';

const PRIORITY_CLASS = { High: 'is-high', Medium: 'is-medium', Low: 'is-low' };

// Tab 3 — Assigned Tasks (view only). Pending / Completed; Overdue is shown
// automatically for Pending tasks past their due date.
export default function TasksTab({ assistant: a }) {
  const rows = a.tasks.map((t) => ({ ...t, state: taskState(t) }));
  const paged = usePaged(rows, 10);
  if (a.type === 'Astrologer Assistant') {
    return (
      <Section id="st-none" title="Assigned Tasks">
        <Empty icon="document" title="No tasks assigned" text="Astrologer Assistants do not receive tasks." />
      </Section>
    );
  }
  return (
    <div className="p-stack">
      <Stats
        label="Task overview"
        items={[
          ['Assigned', rows.length, 'gold'],
          ['Pending', rows.filter((t) => t.state === 'Pending').length],
          ['Overdue', rows.filter((t) => t.state === 'Overdue').length, 'danger'],
          ['Completed', rows.filter((t) => t.state === 'Completed').length, 'green'],
        ]}
      />
      <Section id="st-list" title="Assigned Tasks" description="View only.">
        <DataTable
          caption="Assigned tasks"
          rows={paged.rows}
          empty={<Empty icon="document" title="No tasks assigned" />}
          columns={[
            { key: 'task', header: 'Task', primary: true, render: (t) => <span className="p-desc"><span className="p-strong">{t.name}</span><span className="p-small">{t.id}</span></span> },
            { key: 'dept', header: 'Module / Department', render: (t) => t.department },
            { key: 'desc', header: 'Description', className: 'p-wrap', render: (t) => t.description },
            { key: 'assigned', header: 'Assigned Date', render: (t) => dt(t.assignedAt) },
            { key: 'due', header: 'Due Date', render: (t) => dt(t.dueAt) },
            { key: 'priority', header: 'Priority', render: (t) => <span className={`sp-priority ${PRIORITY_CLASS[t.priority]}`}>{t.priority}</span> },
            { key: 'status', header: 'Status', render: (t) => <span className="p-desc"><Pill value={t.state} />{t.completedAt && <span className="p-small">{dt(t.completedAt)}</span>}</span> },
            { key: 'by', header: 'Assigned By', render: (t) => t.assignedBy.name },
          ]}
        />
        {paged.pager('tasks')}
      </Section>
    </div>
  );
}
