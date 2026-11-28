import { useState } from 'react';
import Icon from '../../../components/icons.jsx';
import { ASTRO_ACTIVITY_CATEGORIES } from '../../../data/astrologersStore.js';
import { Empty, FilterBar, SearchFilter, Section, SelectFilter, dt, inMonth, monthLabel, useMonths, usePaged } from '../../UserProfile/components/ui.jsx';
import ExportButtons from '../components/ExportButtons.jsx';

const ICONS = {
  Account: 'people',
  'Login / Device': 'signOut',
  'Professional Profile': 'document',
  Services: 'services',
  Wallet: 'finance',
  Subscriptions: 'userCheck',
  Content: 'document',
  Reviews: 'activity',
  Remedies: 'services',
  Disputes: 'alert',
  Availability: 'clock',
  Documents: 'document',
  'Admin Actions': 'operations',
};

// Tab 12 — Activity (§15). Unified timeline including Admin actions (with
// Admin ID and time). The audit trail is never edited or deleted.
export default function ActivityTab({ profile, notify }) {
  const all = profile.activity;
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [month, setMonth] = useState('');
  const months = useMonths(all.map((a) => a.at));
  const q = query.trim().toLowerCase();
  const rows = all.filter((a) => (!category || a.category === category) && inMonth(a.at, month) && (!q || a.title.toLowerCase().includes(q) || a.ref.toLowerCase().includes(q)));
  const paged = usePaged(rows, 25, `${q}|${category}|${month}`);
  const columns = [
    { header: 'Date / Time', value: (a) => dt(a.at), width: 20 },
    { header: 'Category', value: (a) => a.category, width: 18 },
    { header: 'Activity', value: (a) => a.title, width: 56 },
    { header: 'Reference', value: (a) => a.ref, width: 18 },
    { header: 'Admin', value: (a) => (a.admin ? `${a.admin.name} (${a.admin.id})` : ''), width: 24 },
  ];
  return (
    <Section
      id="aac"
      title="Activity"
      description="Account, profile, services, wallet, subscriptions, content, reviews, remedies, disputes, availability, documents and Admin actions."
      actions={<ExportButtons title="Astrologer Activity" astrologer={profile.astrologer} columns={columns} rows={rows} fileBase="astrologer-activity" notify={notify} label="activities" />}
    >
      <FilterBar canClear={Boolean(q || category || month)} onClear={() => { setQuery(''); setCategory(''); setMonth(''); }}>
        <SearchFilter label="Search" value={query} onChange={setQuery} placeholder="Activity or reference" />
        <SelectFilter label="Category" value={category} onChange={setCategory} options={[['', 'All categories'], ...ASTRO_ACTIVITY_CATEGORIES]} />
        <SelectFilter label="Month" value={month} onChange={setMonth} options={[['', 'All months'], ...months.map((m) => [m, monthLabel(m)])]} />
      </FilterBar>
      <p className="p-small p-muted" aria-live="polite">
        {rows.length.toLocaleString('en-IN')} {rows.length === 1 ? 'activity' : 'activities'}
      </p>
      {rows.length ? (
        <ol className="p-activity__list a-activity">
          {paged.rows.map((a) => (
            <li key={a.id} className={`p-act${a.category === 'Admin Actions' ? ' is-admin' : ''}`}>
              <span className="p-act__icon" aria-hidden="true">
                <Icon name={ICONS[a.category] ?? 'activity'} size={16} />
              </span>
              <div className="p-act__body">
                <p className="p-act__title">{a.title}</p>
                <p className="p-act__meta">
                  <span>{a.category}</span>
                  {a.ref && <span className="p-mono">{a.ref}</span>}
                  <time dateTime={a.at}>{dt(a.at)}</time>
                  {a.admin && (
                    <span className="a-admin">
                      By {a.admin.name} · Admin ID {a.admin.id}
                    </span>
                  )}
                </p>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <Empty title="No matching activity" text="Change or clear the filters." />
      )}
      {paged.pager('activities')}
    </Section>
  );
}
