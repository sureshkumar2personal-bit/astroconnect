import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import Icon from '../../components/icons.jsx';
import { formatNumber } from '../../components/charts/chartUtils.js';
import { href } from '../../router/useHashRoute.js';
import { useMediaQuery } from '../../hooks/useMediaQuery.js';
import {
  ACTIONS,
  changeStatus,
  countByStatus,
  filterUsers,
  formatDate,
  loadUsers,
  sortUsers,
} from '../../data/usersStore.js';
import StatusCards from './components/StatusCards.jsx';
import UsersToolbar from './components/UsersToolbar.jsx';
import UsersTable from './components/UsersTable.jsx';
import UserCardList from './components/UserCardList.jsx';
import Pagination from './components/Pagination.jsx';
import StatusActionDialog from './components/StatusActionDialog.jsx';
import './UsersPage.css';

// People Management → Users (docs/03-platform-admin/04-people-management/user-management.md §2, §12).
// Demo data only: 12,450 fictional users; status changes are saved in this browser.

const DEFAULT_SORT = { key: 'registeredAt', dir: 'desc' };
const STATUS_LABEL = {
  all: 'All',
  Active: 'Active',
  Suspended: 'Suspended',
  Blocked: 'Blocked',
  restricted: 'Suspended + Blocked',
};

export default function UsersPage({ session }) {
  const [load, setLoad] = useState({ status: 'loading', users: [], message: '' });
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [sort, setSort] = useState(DEFAULT_SORT);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [dialog, setDialog] = useState(null); // { user, action }
  const [toast, setToast] = useState(null); // { tone, text }
  const [exporting, setExporting] = useState(null);
  const toastTimer = useRef(null);
  const isMobile = useMediaQuery('(max-width: 720px)');

  const fetchUsers = useCallback(() => {
    let cancelled = false;
    setLoad((s) => ({ ...s, status: 'loading' }));
    loadUsers().then(
      (users) => !cancelled && setLoad({ status: 'ready', users, message: '' }),
      (err) => !cancelled && setLoad({ status: 'error', users: [], message: err.message })
    );
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => fetchUsers(), [fetchUsers]);
  useEffect(() => () => clearTimeout(toastTimer.current), []);

  function showToast(tone, text) {
    clearTimeout(toastTimer.current);
    setToast({ tone, text });
    toastTimer.current = setTimeout(() => setToast(null), 6000);
  }

  // ---------- Derived data ----------
  const deferredQuery = useDeferredValue(query);
  const dateError = from && to && from > to ? 'The start date must be on or before the end date.' : '';
  const criteria = useMemo(
    () => ({
      query: deferredQuery,
      status: statusFilter,
      from: dateError ? '' : from,
      to: dateError ? '' : to,
    }),
    [deferredQuery, statusFilter, from, to, dateError]
  );
  const counts = useMemo(() => countByStatus(load.users), [load.users]);
  const filtered = useMemo(() => filterUsers(load.users, criteria), [load.users, criteria]);
  const sorted = useMemo(() => sortUsers(filtered, sort), [filtered, sort]);
  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const rows = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const hasFilters = Boolean(query || statusFilter !== 'all' || from || to);

  // Any change to search or filters returns to page 1.
  const resetPage = () => setPage(1);
  const onQuery = (v) => {
    setQuery(v);
    resetPage();
  };
  const onStatus = (v) => {
    setStatusFilter(v);
    resetPage();
  };
  const onFrom = (v) => {
    setFrom(v);
    resetPage();
  };
  const onTo = (v) => {
    setTo(v);
    resetPage();
  };
  function onReset() {
    setQuery('');
    setStatusFilter('all');
    setFrom('');
    setTo('');
    resetPage();
  }
  function onSort(key) {
    setSort((s) =>
      s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: key === 'name' || key === 'id' || key === 'status' ? 'asc' : 'desc' }
    );
    resetPage();
  }
  function onPageSize(n) {
    setPageSize(n);
    resetPage();
  }
  function onPage(p) {
    setPage(Math.min(Math.max(1, p), pageCount));
    document.getElementById('users-directory')?.scrollIntoView({ block: 'start' });
  }

  function filterSummary() {
    const parts = [];
    // Describe exactly the criteria applied to the exported rows.
    if (criteria.query.trim()) parts.push(`Search "${criteria.query.trim()}"`);
    if (statusFilter !== 'all') parts.push(`Status: ${STATUS_LABEL[statusFilter]}`);
    if ((from || to) && !dateError) {
      parts.push(
        `Registered ${from ? formatDate(`${from}T00:00:00`) : 'any time'} to ${to ? formatDate(`${to}T00:00:00`) : 'today'}`
      );
    }
    return parts.length ? parts.join('; ') : 'None (all users)';
  }

  async function onExport(kind) {
    if (!sorted.length) return;
    setExporting(kind);
    try {
      const exporters = await import('../../data/exporters.js');
      if (kind === 'pdf') await exporters.exportUsersPdf(sorted, filterSummary());
      else await exporters.exportUsersExcel(sorted);
      showToast(
        'success',
        `Exported ${formatNumber(sorted.length)} ${sorted.length === 1 ? 'user' : 'users'} to ${kind === 'pdf' ? 'PDF' : 'Excel'}.`
      );
    } catch (err) {
      console.warn('Export failed', err);
      showToast('error', `The ${kind === 'pdf' ? 'PDF' : 'Excel'} export could not be created. Please try again.`);
    } finally {
      setExporting(null);
    }
  }

  function onConfirmAction({ reason, notes }) {
    const result = changeStatus({ user: dialog.user, action: dialog.action, reason, notes, admin: session });
    if (!result.ok) return result;
    setLoad((s) => ({
      ...s,
      users: s.users.map((u) => (u.id === result.user.id ? result.user : u)),
    }));
    setDialog(null);
    showToast(
      'success',
      `${result.user.name}’s account was ${ACTIONS[dialog.action].past} (${result.entry.previousStatus} → ${result.entry.newStatus}). Recorded in status history.`
    );
    return result;
  }

  // ---------- Render ----------
  let directoryBody;
  if (load.status === 'loading') {
    directoryBody = <TableSkeleton />;
  } else if (load.status === 'error') {
    directoryBody = (
      <div className="u-state u-state--error" role="alert">
        <Icon name="alert" size={22} />
        <p className="u-state__title">Users unavailable</p>
        <p className="u-state__text">{load.message} Please try again.</p>
        <button type="button" className="u-btn" onClick={fetchUsers}>
          <Icon name="refresh" size={16} />
          Retry
        </button>
      </div>
    );
  } else if (!load.users.length) {
    directoryBody = (
      <div className="u-state">
        <Icon name="people" size={22} />
        <p className="u-state__title">No users yet</p>
        <p className="u-state__text">Registered user accounts will appear here.</p>
      </div>
    );
  } else if (!sorted.length) {
    const searchOnly = query.trim() && statusFilter === 'all' && !from && !to;
    directoryBody = (
      <div className="u-state">
        <Icon name="search" size={22} />
        <p className="u-state__title">
          {searchOnly ? `No users match “${query.trim()}”` : 'No users match these filters'}
        </p>
        <p className="u-state__text">
          {searchOnly
            ? 'Check the spelling, or search by User ID, mobile number or email instead.'
            : 'Try a different status or date range, or reset the filters.'}
        </p>
        <button type="button" className="u-btn" onClick={onReset}>
          Reset filters
        </button>
      </div>
    );
  } else {
    directoryBody = (
      <>
        {isMobile ? (
          <UserCardList rows={rows} onAction={(user, action) => setDialog({ user, action })} />
        ) : (
          <UsersTable rows={rows} sort={sort} onSort={onSort} onAction={(user, action) => setDialog({ user, action })} />
        )}
        <Pagination
          page={currentPage}
          pageSize={pageSize}
          total={sorted.length}
          onPage={onPage}
          onPageSize={onPageSize}
        />
      </>
    );
  }

  return (
    <div className="users">
      <header className="u-head">
        <nav aria-label="Breadcrumb" className="u-crumbs">
          <ol>
            <li>
              <a href={href('/dashboard')}>Dashboard</a>
            </li>
            <li>People Management</li>
            <li aria-current="page">Users</li>
          </ol>
        </nav>
        <div className="u-head__row">
          <div>
            <h1 className="u-head__title">Users</h1>
            <p className="u-head__subtitle">Manage registered user accounts and account status.</p>
          </div>
        </div>
      </header>

      {load.status === 'ready' && load.users.length > 0 && (
        <StatusCards
          counts={counts}
          selected={['all', 'Active', 'restricted'].includes(statusFilter) ? statusFilter : null}
          onSelect={onStatus}
        />
      )}

      <section id="users-directory" className="u-directory" aria-labelledby="users-dir-title">
        <div className="u-directory__head">
          <h2 id="users-dir-title" className="u-directory__title">
            User Directory
          </h2>
          {load.status === 'ready' && load.users.length > 0 && (
            <span className="u-directory__count">
              {formatNumber(sorted.length)} {sorted.length === 1 ? 'user' : 'users'}
              {hasFilters ? ' match' : ''}
            </span>
          )}
        </div>
        <UsersToolbar
          query={query}
          onQuery={onQuery}
          status={statusFilter}
          onStatus={onStatus}
          from={from}
          to={to}
          onFrom={onFrom}
          onTo={onTo}
          dateError={dateError}
          hasFilters={hasFilters}
          onReset={onReset}
          exporting={exporting}
          canExport={load.status === 'ready' && sorted.length > 0}
          onExport={onExport}
        />
        {directoryBody}
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
        <StatusActionDialog
          key={`${dialog.user.id}-${dialog.action}`}
          user={dialog.user}
          action={dialog.action}
          onConfirm={onConfirmAction}
          onCancel={() => setDialog(null)}
        />
      )}
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="u-skeleton" role="status" aria-label="Loading users">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="u-skeleton__row" />
      ))}
    </div>
  );
}
