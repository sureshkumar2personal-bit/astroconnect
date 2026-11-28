import { useCallback, useDeferredValue, useEffect, useId, useMemo, useRef, useState } from 'react';
import Icon from '../../components/icons.jsx';
import { formatNumber } from '../../components/charts/chartUtils.js';
import { href } from '../../router/useHashRoute.js';
import { useMediaQuery } from '../../hooks/useMediaQuery.js';
import { ACTIONS, formatDate } from '../../data/usersStore.js';
import { changeAstrologerStatus } from '../../data/astrologerStatus.js';
import {
  AVAILABILITY,
  EXPERIENCE_BANDS,
  RATING_BANDS,
  SERVICE_KEYS,
  SPECIALIZATIONS,
  VERIFICATION,
  countAstrologers,
  filterAstrologers,
  loadAstrologers,
  sortAstrologers,
} from '../../data/astrologersStore.js';
import Pagination from '../Users/components/Pagination.jsx';
import StatusActionDialog from '../Users/components/StatusActionDialog.jsx';
import AstroTable from './components/AstroTable.jsx';
import AstroCardList from './components/AstroCardList.jsx';
import '../Users/UsersPage.css';
import './AstrologersPage.css';

// People Management → Astrologers (docs/03-platform-admin/04-people-management/astrologer-management.md §2).

const EMPTY_FILTERS = {
  query: '',
  status: 'all',
  availability: 'all',
  specialization: 'all',
  service: 'all',
  experience: 'all',
  verification: 'all',
  rating: 'all',
  from: '',
  to: '',
};

const SORT_OPTIONS = [
  ['joined:desc', 'Newest joined'],
  ['joined:asc', 'Oldest joined'],
  ['name:asc', 'Name A–Z'],
  ['name:desc', 'Name Z–A'],
  ['experience:desc', 'Experience (most)'],
  ['experience:asc', 'Experience (least)'],
  ['rating:desc', 'Rating (highest)'],
  ['totalServices:desc', 'Total services (most)'],
];

const CARDS = [
  { key: 'all', label: 'Total Astrologers', icon: 'people', tone: 'gold', count: (c) => c.total, hint: () => 'All accounts', apply: { status: 'all', availability: 'all' } },
  { key: 'Active', label: 'Active', icon: 'userCheck', tone: 'green', count: (c) => c.Active, hint: () => 'Can log in and provide services', apply: { status: 'Active', availability: 'all' } },
  { key: 'restricted', label: 'Restricted', icon: 'userBlock', tone: 'amber', count: (c) => c.restricted, hint: (c) => `${formatNumber(c.Suspended)} suspended · ${formatNumber(c.Blocked)} blocked`, apply: { status: 'restricted', availability: 'all' } },
  { key: 'available', label: 'Available Now', icon: 'phone', tone: 'blue', count: (c) => c.available, hint: () => 'Accepting instant requests', apply: { status: 'all', availability: 'Available' } },
];

export default function AstrologersPage({ session }) {
  const [load, setLoad] = useState({ status: 'loading', list: [], message: '' });
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [sort, setSort] = useState({ key: 'joined', dir: 'desc' });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [dialog, setDialog] = useState(null);
  const [toast, setToast] = useState(null);
  const [exporting, setExporting] = useState(null);
  const toastTimer = useRef(null);
  const isMobile = useMediaQuery('(max-width: 720px)');
  const uid = useId();

  const fetchList = useCallback(() => {
    let cancelled = false;
    setLoad((s) => ({ ...s, status: 'loading' }));
    loadAstrologers().then(
      (list) => !cancelled && setLoad({ status: 'ready', list, message: '' }),
      (err) => !cancelled && setLoad({ status: 'error', list: [], message: err.message })
    );
    return () => {
      cancelled = true;
    };
  }, []);
  useEffect(() => fetchList(), [fetchList]);
  useEffect(() => () => clearTimeout(toastTimer.current), []);

  function notify(tone, text) {
    clearTimeout(toastTimer.current);
    setToast({ tone, text });
    toastTimer.current = setTimeout(() => setToast(null), 6000);
  }

  const query = useDeferredValue(filters.query);
  const dateError = filters.from && filters.to && filters.from > filters.to ? 'The start date must be on or before the end date.' : '';
  const criteria = useMemo(() => ({ ...filters, query, from: dateError ? '' : filters.from, to: dateError ? '' : filters.to }), [filters, query, dateError]);
  const counts = useMemo(() => countAstrologers(load.list), [load.list]);
  const filtered = useMemo(() => filterAstrologers(load.list, criteria), [load.list, criteria]);
  const sorted = useMemo(() => sortAstrologers(filtered, sort), [filtered, sort]);
  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const rows = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const hasFilters = JSON.stringify(filters) !== JSON.stringify(EMPTY_FILTERS);
  const activeCard = CARDS.find((c) => filters.status === c.apply.status && filters.availability === c.apply.availability)?.key ?? null;

  const set = (patch) => {
    setFilters((f) => ({ ...f, ...patch }));
    setPage(1);
  };

  function onSort(key) {
    setSort((s) => (s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: key === 'name' || key === 'id' ? 'asc' : 'desc' }));
    setPage(1);
  }

  function summary() {
    const parts = [];
    const f = criteria;
    if (f.query.trim()) parts.push(`Search "${f.query.trim()}"`);
    if (f.status !== 'all') parts.push(`Status: ${f.status === 'restricted' ? 'Suspended + Blocked' : f.status}`);
    if (f.availability !== 'all') parts.push(`Availability: ${f.availability}`);
    if (f.specialization !== 'all') parts.push(`Specialization: ${f.specialization}`);
    if (f.service !== 'all') parts.push(`Service: ${SERVICE_KEYS.find(([k]) => k === f.service)[1]}`);
    if (f.experience !== 'all') parts.push(`Experience: ${EXPERIENCE_BANDS.find((b) => b[0] === f.experience)[1]}`);
    if (f.verification !== 'all') parts.push(`KYC: ${f.verification}`);
    if (f.rating !== 'all') parts.push(`Rating: ${RATING_BANDS.find((b) => b[0] === f.rating)[1]}`);
    if (f.from || f.to) parts.push(`Joined ${f.from ? formatDate(`${f.from}T00:00:00`) : 'any time'} to ${f.to ? formatDate(`${f.to}T00:00:00`) : 'today'}`);
    return parts.length ? parts.join('; ') : 'None (all astrologers)';
  }

  async function onExport(kind) {
    setExporting(kind);
    try {
      const { exportAstrologers } = await import('../../data/exporters.js');
      await exportAstrologers(kind, sorted, summary());
      notify('success', `Exported ${formatNumber(sorted.length)} astrologer${sorted.length === 1 ? '' : 's'} to ${kind === 'pdf' ? 'PDF' : 'Excel'}.`);
    } catch (err) {
      console.warn(err);
      notify('error', 'The export could not be created. Please try again.');
    } finally {
      setExporting(null);
    }
  }

  function onConfirm({ reason, notes }) {
    const result = changeAstrologerStatus({ user: dialog.user, action: dialog.action, reason, notes, admin: session });
    if (!result.ok) return result;
    setLoad((s) => ({
      ...s,
      list: s.list.map((a) => (a.id === result.user.id ? { ...a, status: result.user.status, availability: result.user.status === 'Active' ? a.availability : 'Offline' } : a)),
    }));
    setDialog(null);
    notify('success', `${result.user.name}’s account was ${ACTIONS[dialog.action].past} (${result.entry.previousStatus} → ${result.entry.newStatus}). Recorded in the account history.`);
    return result;
  }

  let body;
  if (load.status === 'loading') {
    body = (
      <div className="u-skeleton" role="status" aria-label="Loading astrologers">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="u-skeleton__row" />
        ))}
      </div>
    );
  } else if (load.status === 'error') {
    body = (
      <div className="u-state u-state--error" role="alert">
        <Icon name="alert" size={22} />
        <p className="u-state__title">Astrologers unavailable</p>
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
        <p className="u-state__title">No astrologers yet</p>
        <p className="u-state__text">Registered astrologer accounts will appear here.</p>
      </div>
    );
  } else if (!sorted.length) {
    body = (
      <div className="u-state">
        <Icon name="search" size={22} />
        <p className="u-state__title">No astrologers match these filters</p>
        <p className="u-state__text">Try a different search or filter, or clear the filters.</p>
        <button type="button" className="u-btn" onClick={() => set(EMPTY_FILTERS)}>
          Clear filters
        </button>
      </div>
    );
  } else {
    const onAction = (user, action) => setDialog({ user, action });
    body = (
      <>
        {isMobile ? <AstroCardList rows={rows} onAction={onAction} /> : <AstroTable rows={rows} sort={sort} onSort={onSort} onAction={onAction} />}
        <Pagination page={currentPage} pageSize={pageSize} total={sorted.length} onPage={(p) => setPage(Math.min(Math.max(1, p), pageCount))} onPageSize={(n) => { setPageSize(n); setPage(1); }} itemLabel="astrologers" />
      </>
    );
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

  return (
    <div className="users astrologers">
      <header className="u-head">
        <nav aria-label="Breadcrumb" className="u-crumbs">
          <ol>
            <li>
              <a href={href('/dashboard')}>Dashboard</a>
            </li>
            <li>People Management</li>
            <li aria-current="page">Astrologers</li>
          </ol>
        </nav>
        <div className="u-head__row">
          <div>
            <h1 className="u-head__title">Astrologers</h1>
            <p className="u-head__subtitle">Manage astrologer accounts, availability, verification and account status.</p>
          </div>
        </div>
      </header>

      {load.status === 'ready' && load.list.length > 0 && (
        <div className="u-cards a-cards" role="group" aria-label="Filter astrologers">
          {CARDS.map((c) => {
            const selected = activeCard === c.key;
            return (
              <button key={c.key} type="button" className={`u-card u-card--${c.tone}${selected ? ' is-selected' : ''}`} aria-pressed={selected} onClick={() => set(c.apply)}>
                <span className="u-card__icon">
                  <Icon name={c.icon} size={20} />
                </span>
                <span className="u-card__body">
                  <span className="u-card__label">{c.label}</span>
                  <span className="u-card__count">{formatNumber(c.count(counts))}</span>
                  <span className="u-card__hint">{c.hint(counts)}</span>
                </span>
                {selected && (
                  <span className="u-card__check" aria-hidden="true">
                    <Icon name="check" size={14} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      <section id="astro-directory" className="u-directory" aria-labelledby="astro-dir-title">
        <div className="u-directory__head">
          <h2 id="astro-dir-title" className="u-directory__title">
            Astrologer Directory
          </h2>
          {load.status === 'ready' && load.list.length > 0 && (
            <span className="u-directory__count">
              {formatNumber(sorted.length)} astrologer{sorted.length === 1 ? '' : 's'}
              {hasFilters ? ' match' : ''}
            </span>
          )}
        </div>

        <div className="u-toolbar a-toolbar">
          <div className="a-toolbar__row">
            <div className="u-field u-field--search">
              <label htmlFor={`${uid}-q`} className="visually-hidden">
                Search astrologers
              </label>
              <Icon name="search" size={18} className="u-search__icon" />
              <input id={`${uid}-q`} type="search" className="u-input u-search" placeholder="Search name, ID, mobile, email" value={filters.query} onChange={(e) => set({ query: e.target.value })} autoComplete="off" />
              {filters.query && (
                <button type="button" className="u-search__clear" aria-label="Clear search" onClick={() => set({ query: '' })}>
                  <Icon name="close" size={16} />
                </button>
              )}
            </div>
            <div className="u-field">
              <label htmlFor={`${uid}-sort`} className="u-label">
                Sort by
              </label>
              <select
                id={`${uid}-sort`}
                className="u-input u-select"
                value={SORT_OPTIONS.some(([v]) => v === `${sort.key}:${sort.dir}`) ? `${sort.key}:${sort.dir}` : ''}
                onChange={(e) => {
                  const [key, dir] = e.target.value.split(':');
                  setSort({ key, dir });
                  setPage(1);
                }}
              >
                {!SORT_OPTIONS.some(([v]) => v === `${sort.key}:${sort.dir}`) && <option value="">Custom column sort</option>}
                {SORT_OPTIONS.map(([v, t]) => (
                  <option key={v} value={v}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="u-toolbar__export" role="group" aria-label="Export filtered astrologers">
              <button type="button" className="u-btn" onClick={() => onExport('pdf')} disabled={!sorted.length || Boolean(exporting) || load.status !== 'ready'}>
                <Icon name="download" size={16} />
                {exporting === 'pdf' ? 'Preparing PDF…' : 'Export PDF'}
              </button>
              <button type="button" className="u-btn" onClick={() => onExport('excel')} disabled={!sorted.length || Boolean(exporting) || load.status !== 'ready'}>
                <Icon name="download" size={16} />
                {exporting === 'excel' ? 'Preparing Excel…' : 'Export Excel'}
              </button>
            </div>
          </div>
          <div className="a-filters">
            {select('status', 'Account Status', [['all', 'All'], ['Active', 'Active'], ['Suspended', 'Suspended'], ['Blocked', 'Blocked'], ...(filters.status === 'restricted' ? [['restricted', 'Suspended + Blocked']] : [])])}
            {select('availability', 'Availability', [['all', 'All'], ...AVAILABILITY.map((v) => [v, v])])}
            {select('specialization', 'Specialization', [['all', 'All'], ...SPECIALIZATIONS.map((v) => [v, v])])}
            {select('service', 'Service Type', [['all', 'All'], ...SERVICE_KEYS])}
            {select('experience', 'Experience', [['all', 'All'], ...EXPERIENCE_BANDS.map((b) => [b[0], b[1]])])}
            {select('verification', 'Verification (KYC)', [['all', 'All'], ...VERIFICATION.map((v) => [v, v])])}
            {select('rating', 'Rating', [['all', 'All'], ...RATING_BANDS.map((b) => [b[0], b[1]])])}
            <div className="u-field u-dates" role="group" aria-labelledby={`${uid}-joined`}>
              <span id={`${uid}-joined`} className="u-label">
                Joined Date
              </span>
              <div className="u-dates__row">
                <label htmlFor={`${uid}-from`} className="visually-hidden">
                  Joined from
                </label>
                <input id={`${uid}-from`} type="date" className={`u-input u-date${dateError ? ' has-error' : ''}`} value={filters.from} max={filters.to || undefined} onChange={(e) => set({ from: e.target.value })} />
                <span className="u-dates__sep" aria-hidden="true">
                  to
                </span>
                <label htmlFor={`${uid}-to`} className="visually-hidden">
                  Joined to
                </label>
                <input id={`${uid}-to`} type="date" className={`u-input u-date${dateError ? ' has-error' : ''}`} value={filters.to} min={filters.from || undefined} onChange={(e) => set({ to: e.target.value })} />
              </div>
              {dateError && <p className="u-field__error">{dateError}</p>}
            </div>
            <button type="button" className="u-btn u-btn--ghost" onClick={() => set(EMPTY_FILTERS)} disabled={!hasFilters}>
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
        <StatusActionDialog key={`${dialog.user.id}-${dialog.action}`} user={dialog.user} action={dialog.action} subject="astrologer" onConfirm={onConfirm} onCancel={() => setDialog(null)} />
      )}
    </div>
  );
}
