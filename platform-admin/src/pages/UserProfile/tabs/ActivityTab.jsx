import { useState } from 'react';
import Icon from '../../../components/icons.jsx';
import { ACTIVITY_CATEGORIES } from '../../../data/profileStore.js';
import { Empty, FilterBar, SearchFilter, Section, SelectFilter, dt, inMonth, monthLabel, useMonths, usePaged } from '../components/ui.jsx';

const CATEGORY_ICON = {
  'Account Created': 'people',
  'Login / Logout': 'signOut',
  'Last Active': 'clock',
  'Profile Changes': 'people',
  'Birth Details Changes': 'calendar',
  'Profile Photo Changes': 'people',
  'Password Reset': 'refresh',
  'Text Questions': 'question',
  Appointments: 'calendar',
  'Calls / Chats': 'phone',
  'Wallet Top-ups': 'finance',
  Payments: 'finance',
  Refunds: 'finance',
  Withdrawals: 'download',
  'Wallet Adjustments': 'finance',
  'Follow / Unfollow': 'userCheck',
  Subscriptions: 'services',
  Remedies: 'services',
  Disputes: 'alert',
  Notifications: 'activity',
  Consent: 'check',
  'App Version / Device': 'operations',
  'Failed Activities': 'cancel',
};

// Tab 8 — Activity (§11). The user's own activity only; Admin actions are
// in the Account tab. History is never deleted. Passwords and OTPs are never
// recorded — only the password-reset event.
export default function ActivityTab({ profile, notify }) {
  const all = profile.activity;
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [month, setMonth] = useState('');
  const [expanded, setExpanded] = useState(() => new Set());
  const [busy, setBusy] = useState(null);

  const months = useMonths(all.map((a) => a.at));
  const q = query.trim().toLowerCase();
  const rows = all.filter(
    (a) =>
      (!category || a.category === category) &&
      inMonth(a.at, month) &&
      (!q || a.title.toLowerCase().includes(q) || a.ref.toLowerCase().includes(q) || a.category.toLowerCase().includes(q))
  );
  const filtered = Boolean(q || category || month);
  const paged = usePaged(rows, 25, `${q}|${category}|${month}`);

  function summary() {
    const parts = [];
    if (q) parts.push(`Search "${query.trim()}"`);
    if (category) parts.push(`Category: ${category}`);
    if (month) parts.push(`Month: ${monthLabel(month)}`);
    return parts.length ? parts.join('; ') : 'All activity';
  }

  async function exportIt(kind) {
    setBusy(kind);
    try {
      const { exportActivity } = await import('../../../data/exporters.js');
      await exportActivity(kind, profile.user, rows, summary());
      notify('success', `Exported ${rows.length} ${rows.length === 1 ? 'activity' : 'activities'} to ${kind === 'pdf' ? 'PDF' : 'Excel'}.`);
    } catch (err) {
      console.warn(err);
      notify('error', 'The export could not be created. Please try again.');
    } finally {
      setBusy(null);
    }
  }

  // Group the current page by day.
  const groups = [];
  for (const a of paged.rows) {
    const day = new Date(a.at).toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
    if (groups.at(-1)?.day !== day) groups.push({ day, items: [] });
    groups.at(-1).items.push(a);
  }

  return (
    <div className="p-stack">
      <Section
        id="act"
        title="User Activity"
        description="Everything this user did in the app, newest first. Admin actions are recorded separately in the Account tab."
        actions={
          <div className="p-actions">
            <button type="button" className="u-btn" onClick={() => exportIt('pdf')} disabled={!rows.length || Boolean(busy)}>
              <Icon name="download" size={16} />
              {busy === 'pdf' ? 'Preparing…' : 'Export PDF'}
            </button>
            <button type="button" className="u-btn" onClick={() => exportIt('excel')} disabled={!rows.length || Boolean(busy)}>
              <Icon name="download" size={16} />
              {busy === 'excel' ? 'Preparing…' : 'Export Excel'}
            </button>
          </div>
        }
      >
        <FilterBar
          canClear={filtered}
          onClear={() => {
            setQuery('');
            setCategory('');
            setMonth('');
          }}
        >
          <SearchFilter label="Search" value={query} onChange={setQuery} placeholder="Activity or reference" />
          <SelectFilter label="Category" value={category} onChange={setCategory} options={[['', 'All categories'], ...ACTIVITY_CATEGORIES]} />
          <SelectFilter label="Month" value={month} onChange={setMonth} options={[['', 'All months'], ...months.map((m) => [m, monthLabel(m)])]} />
        </FilterBar>
        <p className="p-small p-muted" aria-live="polite">
          {rows.length.toLocaleString('en-IN')} {rows.length === 1 ? 'activity' : 'activities'}
          {filtered ? ' match the filters' : ''}
        </p>

        {rows.length ? (
          <div className="p-activity">
            {groups.map((g) => (
              <section key={g.day} className="p-activity__day" aria-label={g.day}>
                <h4 className="p-activity__date">{g.day}</h4>
                <ol className="p-activity__list">
                  {g.items.map((a) => {
                    const isOpen = expanded.has(a.id);
                    return (
                      <li key={a.id} className={`p-act${a.category === 'Failed Activities' ? ' is-failed' : ''}`}>
                        <span className="p-act__icon" aria-hidden="true">
                          <Icon name={CATEGORY_ICON[a.category] ?? 'activity'} size={16} />
                        </span>
                        <div className="p-act__body">
                          <p className="p-act__title">{a.title}</p>
                          <p className="p-act__meta">
                            <span>{a.category}</span>
                            {a.ref && <span className="p-mono">{a.ref}</span>}
                            <time dateTime={a.at}>{dt(a.at)}</time>
                          </p>
                          {a.details.length > 0 && (
                            <>
                              <button
                                type="button"
                                className="p-act__toggle"
                                aria-expanded={isOpen}
                                onClick={() =>
                                  setExpanded((s) => {
                                    const next = new Set(s);
                                    if (next.has(a.id)) next.delete(a.id);
                                    else next.add(a.id);
                                    return next;
                                  })
                                }
                              >
                                {isOpen ? 'Hide details' : 'Show details'}
                              </button>
                              {isOpen && (
                                <dl className="p-act__details">
                                  {a.details.map(([k, v]) => (
                                    <div key={k}>
                                      <dt>{k}</dt>
                                      <dd>{v}</dd>
                                    </div>
                                  ))}
                                </dl>
                              )}
                            </>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </section>
            ))}
          </div>
        ) : (
          <Empty title="No matching activity" text="Change or clear the filters." />
        )}
        {paged.pager('activities')}
      </Section>
    </div>
  );
}
