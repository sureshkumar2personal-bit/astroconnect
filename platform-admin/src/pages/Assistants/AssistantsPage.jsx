import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import Icon from '../../components/icons.jsx';
import { href } from '../../router/useHashRoute.js';
import { assistantProfilePath } from '../../router/navigation.js';
import { useMediaQuery } from '../../hooks/useMediaQuery.js';
import { formatDate, formatDateTime } from '../../data/usersStore.js';
import {
  ACCOUNT_ACTIONS,
  ROLES,
  STATUSES,
  TYPES,
  applyAccountAction,
  availableActions,
  countAssistants,
  filterAssistants,
  inviteAdminAssistant,
  loadAssistants,
  sortAssistants,
} from '../../data/assistantsStore.js';
import Pagination from '../Users/components/Pagination.jsx';
import ActionsMenu from '../Users/components/ActionsMenu.jsx';
import { Avatar } from '../Users/components/UserBits.jsx';
import { ACTION_ICONS, AssistantActionDialog, AssistantStatus, RoleTag, TypeTag } from './components/AssistantBits.jsx';
import InviteDialog from './components/InviteDialog.jsx';
import '../Users/UsersPage.css';
import '../Astrologers/AstrologersPage.css';
import './AssistantsPage.css';


const EMPTY = { query: '', status: 'all', role: 'all', type: 'all', astrologer: 'all' };
const CARDS = [
  { key: 'current', label: 'Total Assistants', icon: 'people', tone: 'gold', count: (c) => c.current, hint: () => 'All accounts except removed', apply: { status: 'current' } },
  { key: 'Active', label: 'Active', icon: 'userCheck', tone: 'green', count: (c) => c.Active, hint: () => 'Signed up and working', apply: { status: 'Active' } },
  { key: 'Pending', label: 'Pending Invitations', icon: 'clock', tone: 'blue', count: (c) => c.Pending, hint: (c) => `${c.Expired} expired invitation${c.Expired === 1 ? '' : 's'}`, apply: { status: 'Pending' } },
  { key: 'Removed', label: 'Removed', icon: 'userBlock', tone: 'amber', count: (c) => c.Removed, hint: () => 'Kept as history; emails blocked', apply: { status: 'Removed' } },
];

export default function AssistantsPage({ session }) {
  const [load, setLoad] = useState({ status: 'loading', list: [], message: '' });
  const [filters, setFilters] = useState(EMPTY);
  const [sort, setSort] = useState({ key: 'invited', dir: 'desc' });
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [dialog, setDialog] = useState(null);
  const [inviting, setInviting] = useState(false);
  const [toast, setToast] = useState(null);
  const [exporting, setExporting] = useState(null);
  const timer = useRef(null);
  const isMobile = useMediaQuery('(max-width: 720px)');
  const uid = useId();

  const fetchList = useCallback(() => {
    let cancelled = false;
    setLoad((s) => ({ ...s, status: 'loading' }));
    loadAssistants().then(
      (list) => !cancelled && setLoad({ status: 'ready', list, message: '' }),
      (err) => !cancelled && setLoad({ status: 'error', list: [], message: err.message })
    );
    return () => {
      cancelled = true;
    };
  }, []);
  useEffect(() => fetchList(), [fetchList]);
  useEffect(() => () => clearTimeout(timer.current), []);
  const notify = (tone, text) => {
    clearTimeout(timer.current);
    setToast({ tone, text });
    timer.current = setTimeout(() => setToast(null), 6000);
  };
  const reload = () => loadAssistants().then((list) => setLoad({ status: 'ready', list, message: '' }));

  const counts = useMemo(() => countAssistants(load.list), [load.list]);
  const astrologers = useMemo(() => {
    const m = new Map(load.list.filter((a) => a.astrologer).map((a) => [a.astrologer.id, a.astrologer.name]));
    return [...m.entries()].sort((x, y) => x[1].localeCompare(y[1]));
  }, [load.list]);
  const sorted = useMemo(() => sortAssistants(filterAssistants(load.list, filters), sort), [load.list, filters, sort]);
  const pages = Math.max(1, Math.ceil(sorted.length / size));
  const current = Math.min(page, pages);
  const rows = sorted.slice((current - 1) * size, current * size);
  const hasFilters = JSON.stringify(filters) !== JSON.stringify(EMPTY);
  const activeCard = CARDS.find((c) => c.apply.status === filters.status)?.key ?? null;
  const set = (patch) => {
    setFilters((f) => ({ ...f, ...patch }));
    setPage(1);
  };
  const onSort = (key) => {
    setSort((s) => (s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: key === 'name' || key === 'id' ? 'asc' : 'desc' }));
    setPage(1);
  };
  const actionList = (a) => availableActions(a).map((key) => ({ key, label: ACCOUNT_ACTIONS[key].label, icon: ACTION_ICONS[key], danger: ACCOUNT_ACTIONS[key].danger }));
  const onAction = (a, action) => setDialog({ assistant: a, action });

  async function onExport(kind) {
    setExporting(kind);
    try {
      const { exportTable } = await import('../../data/exporters.js');
      await exportTable(kind, {
        title: 'AstroConnect - Assistants',
        lines: [`Generated ${formatDateTime(new Date().toISOString())}.`, `Records: ${sorted.length}.`],
        columns: [
          { header: 'Name', value: (a) => a.name, width: 22 },
          { header: 'Assistant ID', value: (a) => a.id, width: 14 },
          { header: 'Email', value: (a) => a.email, width: 30 },
          { header: 'Role', value: (a) => a.role, width: 11 },
          { header: 'Assistant Type', value: (a) => a.type, width: 20 },
          { header: 'Departments', value: (a) => a.departments.join(', '), width: 28 },
          { header: 'Assigned Astrologer', value: (a) => (a.astrologer ? `${a.astrologer.name} (${a.astrologer.id})` : ''), width: 28 },
          { header: 'Status', value: (a) => a.status, width: 11 },
          { header: 'Created / Invitation Date', value: (a) => formatDate(a.invitedAt), width: 16 },
          { header: 'Last Active', value: (a) => (a.lastActiveAt ? formatDateTime(a.lastActiveAt) : ''), width: 20 },
        ],
        rows: sorted,
        fileBase: 'astroconnect-assistants',
        sheet: 'Assistants',
      });
      notify('success', `Exported ${sorted.length} assistant${sorted.length === 1 ? '' : 's'} to ${kind === 'pdf' ? 'PDF' : 'Excel'}.`);
    } catch (err) {
      console.warn(err);
      notify('error', 'The export could not be created. Please try again.');
    } finally {
      setExporting(null);
    }
  }

  const select = (key, label, options) => (
    <div className="u-field">
      <label htmlFor={`${uid}-${key}`} className="u-label">
        {label}
      </label>
      <select id={`${uid}-${key}`} className="u-input u-select" value={filters[key]} onChange={(e) => set({ [key]: e.target.value })}>
        {options.map(([v, t]) => (
          <option key={v} value={v}>
            {t}
          </option>
        ))}
      </select>
    </div>
  );

  const sortHead = (key, label, cls) => {
    const active = sort.key === key;
    return (
      <th scope="col" className={cls} aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : undefined}>
        <button type="button" className={`u-sort${active ? ' is-active' : ''}`} onClick={() => onSort(key)}>
          {label}
          <Icon name={active ? (sort.dir === 'asc' ? 'sortUp' : 'sortDown') : 'sort'} size={14} className="u-sort__icon" />
        </button>
      </th>
    );
  };

  let body;
  if (load.status === 'loading') {
    body = (
      <div className="u-skeleton" role="status" aria-label="Loading assistants">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="u-skeleton__row" />
        ))}
      </div>
    );
  } else if (load.status === 'error') {
    body = (
      <div className="u-state u-state--error" role="alert">
        <Icon name="alert" size={22} />
        <p className="u-state__title">Assistants unavailable</p>
        <p className="u-state__text">{load.message} Please try again.</p>
        <button type="button" className="u-btn" onClick={fetchList}>
          <Icon name="refresh" size={16} />
          Retry
        </button>
      </div>
    );
  } else if (!load.list.length) {
    body = (
      <div className="u-state">
        <Icon name="people" size={22} />
        <p className="u-state__title">No assistants yet</p>
        <p className="u-state__text">Invited assistants will appear here.</p>
      </div>
    );
  } else if (!sorted.length) {
    body = (
      <div className="u-state">
        <Icon name="search" size={22} />
        <p className="u-state__title">No assistants match these filters</p>
        <button type="button" className="u-btn" onClick={() => set(EMPTY)}>
          Clear filters
        </button>
      </div>
    );
  } else if (isMobile) {
    body = (
      <>
        <ul className="u-records" aria-label="Assistants">
          {rows.map((a) => {
            const profile = href(assistantProfilePath(a.id));
            return (
              <li key={a.id} className={`u-record${a.status === 'Removed' ? ' is-restricted' : ''}`}>
                <div className="u-record__head">
                  <Avatar user={a} size={40} />
                  <div className="u-record__id">
                    <a className="u-name" href={profile}>
                      {a.name}
                    </a>
                    <span className="u-record__uid">{a.id}</span>
                  </div>
                  <ActionsMenu user={a} onAction={onAction} profileHref={profile} actionList={actionList(a)} />
                </div>
                <div className="u-record__badges">
                  <AssistantStatus status={a.status} />
                  <RoleTag role={a.role} />
                  <TypeTag type={a.type} />
                </div>
                <dl className="u-record__fields">
                  <div>
                    <dt>Assigned Astrologer</dt>
                    <dd>{a.astrologer ? `${a.astrologer.name} (${a.astrologer.id})` : '—'}</dd>
                  </div>
                  <div>
                    <dt>Email</dt>
                    <dd className="u-email-full">{a.email}</dd>
                  </div>
                  <div>
                    <dt>Created / Invited</dt>
                    <dd>{formatDate(a.invitedAt)}</dd>
                  </div>
                  <div>
                    <dt>Last Active</dt>
                    <dd>{a.lastActiveAt ? formatDateTime(a.lastActiveAt) : '—'}</dd>
                  </div>
                </dl>
                <a className="u-record__view" href={profile}>
                  View Profile
                </a>
              </li>
            );
          })}
        </ul>
        <Pagination page={current} pageSize={size} total={sorted.length} onPage={setPage} onPageSize={(n) => { setSize(n); setPage(1); }} itemLabel="assistants" />
      </>
    );
  } else {
    body = (
      <>
        <div className="u-table-wrap">
          <table className="u-table as-table">
            <caption className="visually-hidden">Assistants. Select a name to open the assistant profile.</caption>
            <thead>
              <tr>
                <th scope="col" className="c-photo">Photo</th>
                {sortHead('name', 'Name', 'c-name')}
                {sortHead('id', 'Assistant ID', 'c-id')}
                <th scope="col" className="c-email">Email</th>
                <th scope="col">Role</th>
                <th scope="col">Assistant Type</th>
                <th scope="col">Assigned Astrologer</th>
                <th scope="col">Status</th>
                {sortHead('invited', 'Created / Invitation Date', 'c-date')}
                {sortHead('lastActive', 'Last Active', 'c-date')}
                <th scope="col" className="c-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((a) => {
                const profile = href(assistantProfilePath(a.id));
                return (
                  <tr
                    key={a.id}
                    className={a.status === 'Removed' ? 'is-restricted' : undefined}
                    onClick={(e) => {
                      if (!e.target.closest('a, button, [role=menu]')) window.location.hash = profile;
                    }}
                  >
                    <td className="c-photo">
                      <Avatar user={a} size={34} />
                    </td>
                    <td className="c-name">
                      <a className="u-name" href={profile}>
                        {a.name}
                      </a>
                    </td>
                    <td className="c-id">{a.id}</td>
                    <td className="c-email">
                      <span className="u-email" title={a.email}>
                        {a.email}
                      </span>
                    </td>
                    <td>
                      <RoleTag role={a.role} />
                    </td>
                    <td>
                      <TypeTag type={a.type} />
                    </td>
                    <td>{a.astrologer ? <span className="p-desc"><span>{a.astrologer.name}</span><span className="p-small">{a.astrologer.id}</span></span> : <span className="p-small">Not applicable</span>}</td>
                    <td>
                      <AssistantStatus status={a.status} />
                    </td>
                    <td className="c-date">{formatDate(a.invitedAt)}</td>
                    <td className="c-date">{a.lastActiveAt ? formatDateTime(a.lastActiveAt) : '—'}</td>
                    <td className="c-actions">
                      <div className="u-row-actions">
                        <a className="u-view" href={profile}>
                          View
                        </a>
                        <ActionsMenu user={a} onAction={onAction} profileHref={profile} actionList={actionList(a)} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <Pagination page={current} pageSize={size} total={sorted.length} onPage={(p) => setPage(Math.min(Math.max(1, p), pages))} onPageSize={(n) => { setSize(n); setPage(1); }} itemLabel="assistants" />
      </>
    );
  }

  return (
    <div className="users assistants">
      <header className="u-head">
        <nav aria-label="Breadcrumb" className="u-crumbs">
          <ol>
            <li>
              <a href={href('/dashboard')}>Dashboard</a>
            </li>
            <li>People Management</li>
            <li aria-current="page">Assistants</li>
          </ol>
        </nav>
        <div className="u-head__row">
          <div>
            <h1 className="u-head__title">Assistants</h1>
            <p className="u-head__subtitle">Admin Assistants and Astrologer Assistants, their invitations, roles and access.</p>
          </div>
          <button type="button" className="u-btn u-btn--primary" onClick={() => setInviting(true)} disabled={load.status !== 'ready'}>
            Invite Admin Assistant
          </button>
        </div>
      </header>

      {load.status === 'ready' && load.list.length > 0 && (
        <div className="u-cards a-cards" role="group" aria-label="Filter assistants">
          {CARDS.map((c) => {
            const selected = activeCard === c.key;
            return (
              <button key={c.key} type="button" className={`u-card u-card--${c.tone}${selected ? ' is-selected' : ''}`} aria-pressed={selected} onClick={() => set(c.apply)}>
                <span className="u-card__icon">
                  <Icon name={c.icon} size={20} />
                </span>
                <span className="u-card__body">
                  <span className="u-card__label">{c.label}</span>
                  <span className="u-card__count">{c.count(counts)}</span>
                  <span className="u-card__hint">{c.hint(counts)}</span>
                </span>
              </button>
            );
          })}
        </div>
      )}

      <section className="u-directory" aria-labelledby="as-dir-title">
        <div className="u-directory__head">
          <h2 id="as-dir-title" className="u-directory__title">
            Assistant Directory
          </h2>
          {load.status === 'ready' && (
            <span className="u-directory__count">
              {sorted.length} assistant{sorted.length === 1 ? '' : 's'}
              {hasFilters ? ' match' : ''}
            </span>
          )}
        </div>
        <div className="u-toolbar a-toolbar">
          <div className="a-toolbar__row">
            <div className="u-field u-field--search">
              <label htmlFor={`${uid}-q`} className="visually-hidden">
                Search assistants
              </label>
              <Icon name="search" size={18} className="u-search__icon" />
              <input id={`${uid}-q`} type="search" className="u-input u-search" placeholder="Search name, email or Assistant ID" value={filters.query} onChange={(e) => set({ query: e.target.value })} autoComplete="off" />
            </div>
            <div className="u-toolbar__export" role="group" aria-label="Export assistants">
              <button type="button" className="u-btn" onClick={() => onExport('pdf')} disabled={!sorted.length || Boolean(exporting)}>
                <Icon name="download" size={16} />
                {exporting === 'pdf' ? 'Preparing…' : 'Export PDF'}
              </button>
              <button type="button" className="u-btn" onClick={() => onExport('excel')} disabled={!sorted.length || Boolean(exporting)}>
                <Icon name="download" size={16} />
                {exporting === 'excel' ? 'Preparing…' : 'Export Excel'}
              </button>
            </div>
          </div>
          <div className="a-filters">
            {select('status', 'Status', [['all', 'All'], ...(filters.status === 'current' ? [['current', 'All except removed']] : []), ...STATUSES.map((s) => [s, s])])}
            {select('role', 'Role', [['all', 'All'], ...ROLES.map((r) => [r, r])])}
            {select('type', 'Assistant Type', [['all', 'All'], ...TYPES.map((t) => [t, t])])}
            {select('astrologer', 'Assigned Astrologer', [['all', 'All'], ...astrologers])}
            <button type="button" className="u-btn u-btn--ghost" onClick={() => set(EMPTY)} disabled={!hasFilters}>
              Clear filters
            </button>
          </div>
        </div>
        {body}
      </section>

      <div className="u-toast-region" aria-live="polite" role="status">
        {toast && (
          <div className={`u-toast u-toast--${toast.tone}`}>
            <Icon name={toast.tone === 'success' ? 'check' : 'alert'} size={18} />
            <span>{toast.text}</span>
            <button type="button" className="u-toast__close" aria-label="Dismiss" onClick={() => setToast(null)}>
              <Icon name="close" size={16} />
            </button>
          </div>
        )}
      </div>

      {dialog && (
        <AssistantActionDialog
          assistant={dialog.assistant}
          action={dialog.action}
          onCancel={() => setDialog(null)}
          onConfirm={(reason) => {
            const result = applyAccountAction(dialog.assistant.id, dialog.action, reason, session);
            if (!result.ok) return result;
            setDialog(null);
            reload();
            notify('success', `${ACCOUNT_ACTIONS[dialog.action].label} completed for ${result.assistant.name} (${result.assistant.status}). Recorded in Activity.`);
            return result;
          }}
        />
      )}
      {inviting && (
        <InviteDialog
          onClose={() => setInviting(false)}
          onInvite={(values) => {
            const result = inviteAdminAssistant(values, session);
            if (!result.ok) return result;
            setInviting(false);
            reload();
            notify('success', `Invitation sent to ${result.assistant.email}. Assistant ID ${result.assistant.id} is Pending.`);
            return result;
          }}
        />
      )}
    </div>
  );
}
