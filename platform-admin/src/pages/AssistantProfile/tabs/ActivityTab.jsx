import { useMemo, useState } from 'react';
import { DataTable, Empty, FilterBar, SearchFilter, Section, SelectFilter, usePaged } from '../../UserProfile/components/ui.jsx';
import ExportButtons from '../../AstrologerProfile/components/ExportButtons.jsx';

const date = (iso) => new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
const time = (iso) => new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });

// Tab 4 — Activity. Complete, read-only history (kept after removal). For
// Astrologer Assistants the same records appear in the astrologer's Activity.
export default function ActivityTab({ assistant: a, notify }) {
  const all = useMemo(() => [...a.events].reverse(), [a.events]);
  const [module, setModule] = useState('');
  const [query, setQuery] = useState('');
  const modules = useMemo(() => [...new Set(all.map((e) => e.module))].sort(), [all]);
  const q = query.trim().toLowerCase();
  const rows = all.filter((e) => (!module || e.module === module) && (!q || `${e.action} ${e.description}`.toLowerCase().includes(q)));
  const paged = usePaged(rows, 15, `${module}|${q}`);
  const columns = [
    { header: 'Date', value: (e) => date(e.at), width: 14 },
    { header: 'Time', value: (e) => time(e.at), width: 8 },
    { header: 'Action', value: (e) => e.action, width: 22 },
    { header: 'Module', value: (e) => e.module, width: 20 },
    { header: 'Description', value: (e) => e.description, width: 50 },
    { header: 'By', value: (e) => `${e.by.name} (${e.by.role})`, width: 28 },
  ];
  return (
    <Section
      id="sa-activity"
      title="Activity"
      description={`Invitation, account, permission, task and work activity. Audit history cannot be edited or deleted${a.astrologer ? `, and is also shown in ${a.astrologer.name}’s Activity` : ''}.`}
      actions={<ExportButtons title="Assistant Activity" astrologer={a} columns={columns} rows={rows} fileBase="assistant-activity" notify={notify} label="activities" />}
    >
      <FilterBar canClear={Boolean(module || q)} onClear={() => { setModule(''); setQuery(''); }}>
        <SearchFilter label="Search" value={query} onChange={setQuery} placeholder="Action or description" />
        <SelectFilter label="Module" value={module} onChange={setModule} options={[['', 'All modules'], ...modules]} />
      </FilterBar>
      <DataTable
        caption="Assistant activity"
        rows={paged.rows}
        empty={<Empty icon="activity" title="No matching activity" />}
        columns={[
          { key: 'date', header: 'Date', primary: true, render: (e) => date(e.at) },
          { key: 'time', header: 'Time', render: (e) => time(e.at) },
          { key: 'action', header: 'Action', render: (e) => <span className="p-strong">{e.action}</span> },
          { key: 'module', header: 'Module', render: (e) => e.module },
          { key: 'desc', header: 'Description', className: 'p-wrap', render: (e) => e.description },
          { key: 'by', header: 'By', render: (e) => <span className="p-desc"><span>{e.by.name}</span><span className="p-small">{e.by.role} · {e.by.id}</span></span> },
        ]}
      />
      {paged.pager('activities')}
    </Section>
  );
}
