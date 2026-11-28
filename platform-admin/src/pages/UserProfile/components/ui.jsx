import { useEffect, useId, useMemo, useRef, useState } from 'react';
import Icon from '../../../components/icons.jsx';
import { useMediaQuery } from '../../../hooks/useMediaQuery.js';
import Pagination, { PAGE_SIZES } from '../../Users/components/Pagination.jsx';
import { formatDate, formatDateTime } from '../../../data/usersStore.js';

// ---------- formatting ----------
const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
const inr2 = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 });
// Whole rupees show no decimals; fractional amounts always show two.
export const money = (v) => (v === null || v === undefined ? '—' : Number.isInteger(v) ? inr.format(v) : inr2.format(v));
export const dt = (v) => (v ? formatDateTime(v) : '—');
export const d = (v) => (v ? formatDate(v) : '—');
export const dash = (v) => (v === null || v === undefined || v === '' ? '—' : v);

export function monthLabel(month) {
  const [y, m] = month.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
}

// ---------- status pill ----------
const TONES = {
  success: ['Success', 'Completed', 'Active', 'Approved', 'Resolved', 'Delivered', 'Completed for Today', 'Accepted', 'Granted', 'Followed', 'Refunded to Wallet'],
  gold: ['Pending', 'Confirmed', 'In Progress', 'New / Received', 'Suggested', 'Open', 'Under Investigation', 'Waiting for User Response', 'Waiting for Astrologer Response', 'Sent'],
  danger: ['Failed', 'Overdue', 'Blocked', 'Rejected', 'Missed Update'],
  amber: ['Suspended', 'Unable to Do', 'Not Done'],
  info: ['Refunded', 'Reversed'],
};

export function Pill({ value }) {
  const tone = Object.keys(TONES).find((k) => TONES[k].includes(value)) ?? 'neutral';
  return <span className={`p-pill p-pill--${tone}`}>{value}</span>;
}

// ---------- layout ----------
export function Section({ title, description, actions, children, id, className = '' }) {
  return (
    <section className={`p-section ${className}`} aria-labelledby={id}>
      {(title || actions) && (
        <header className="p-section__head">
          <div>
            {title && (
              <h3 id={id} className="p-section__title">
                {title}
              </h3>
            )}
            {description && <p className="p-section__desc">{description}</p>}
          </div>
          {actions && <div className="p-section__actions">{actions}</div>}
        </header>
      )}
      {children}
    </section>
  );
}

/** Label / value grid. items: [[label, value, { wide }?]] */
export function Fields({ items, columns = 3 }) {
  return (
    <dl className={`p-fields p-fields--${columns}`}>
      {items.map(([label, value, opts]) => (
        <div key={label} className={opts?.wide ? 'is-wide' : undefined}>
          <dt>{label}</dt>
          <dd>{value === null || value === undefined || value === '' ? '—' : value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Stats({ items, label }) {
  return (
    <ul className="p-stats" aria-label={label}>
      {items.map(([name, value, tone]) => (
        <li key={name} className={tone ? `p-stat p-stat--${tone}` : 'p-stat'}>
          <span className="p-stat__value">{value}</span>
          <span className="p-stat__label">{name}</span>
        </li>
      ))}
    </ul>
  );
}

export function Empty({ icon = 'search', title, text, action }) {
  return (
    <div className="p-empty">
      <Icon name={icon} size={20} />
      <p className="p-empty__title">{title}</p>
      {text && <p className="p-empty__text">{text}</p>}
      {action}
    </div>
  );
}

// ---------- paging ----------
export function usePaged(rows, initialSize = 10, resetKey = '') {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(initialSize);
  useEffect(() => setPage(1), [resetKey, size]);
  const pages = Math.max(1, Math.ceil(rows.length / size));
  const current = Math.min(page, pages);
  return {
    rows: rows.slice((current - 1) * size, current * size),
    pager: (label) =>
      rows.length > size || size !== initialSize ? (
        <Pagination
          page={current}
          pageSize={size}
          total={rows.length}
          onPage={(p) => setPage(Math.min(Math.max(1, p), pages))}
          onPageSize={setSize}
          itemLabel={label}
          sizes={PAGE_SIZES.includes(initialSize) ? PAGE_SIZES : [initialSize, ...PAGE_SIZES]}
        />
      ) : null,
  };
}

// ---------- responsive table ----------
/**
 * columns: [{ key, header, render(row), className, primary? }]
 * On narrow screens rows become cards: the `primary` column is the title.
 */
export function DataTable({ columns, rows, rowKey = (r) => r.id, caption, onRowClick, empty }) {
  const narrow = useMediaQuery('(max-width: 720px)');
  if (!rows.length) return empty ?? null;
  if (narrow) {
    const primary = columns.find((c) => c.primary) ?? columns[0];
    const rest = columns.filter((c) => c !== primary);
    return (
      <ul className="p-cards" aria-label={caption}>
        {rows.map((row) => (
          <li key={rowKey(row)} className="p-card">
            <div className="p-card__title">{primary.render(row)}</div>
            <dl className="p-card__fields">
              {rest.map((c) => (
                <div key={c.key} className={c.key === 'actions' ? 'is-actions' : undefined}>
                  {c.key !== 'actions' && <dt>{c.header}</dt>}
                  <dd>{c.render(row)}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <div className="p-table-wrap">
      <table className="p-table">
        {caption && <caption className="visually-hidden">{caption}</caption>}
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} scope="col" className={c.className}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              className={onRowClick ? 'is-clickable' : undefined}
              onClick={
                onRowClick
                  ? (e) => {
                      if (!e.target.closest('a, button, input, select, textarea')) onRowClick(row);
                    }
                  : undefined
              }
            >
              {columns.map((c) => (
                <td key={c.key} className={c.className}>
                  {c.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---------- details side panel ----------
export function DetailPanel({ title, subtitle, onClose, children }) {
  const ref = useRef(null);
  const uid = useId();
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog.open) dialog.showModal();
    dialog.querySelector('.p-panel__close')?.focus();
  }, []);
  return (
    <dialog
      ref={ref}
      className="p-panel"
      aria-labelledby={`${uid}-t`}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      <div className="p-panel__inner">
        <header className="p-panel__head">
          <div>
            <h2 id={`${uid}-t`} className="p-panel__title">
              {title}
            </h2>
            {subtitle && <p className="p-panel__subtitle">{subtitle}</p>}
          </div>
          <button type="button" className="p-panel__close" aria-label="Close details" onClick={onClose}>
            <Icon name="close" size={18} />
          </button>
        </header>
        <div className="p-panel__body">{children}</div>
      </div>
    </dialog>
  );
}

export function SubHeading({ children }) {
  return <h4 className="p-subhead">{children}</h4>;
}

// ---------- timeline ----------
export function Timeline({ items }) {
  if (!items.length) return <p className="p-muted">No events recorded.</p>;
  return (
    <ol className="p-timeline">
      {items.map((t, i) => (
        <li key={`${t.at}-${i}`}>
          <span className="p-timeline__dot" aria-hidden="true" />
          <span className="p-timeline__text">{t.text}</span>
          <time className="p-timeline__time" dateTime={t.at}>
            {dt(t.at)}
          </time>
        </li>
      ))}
    </ol>
  );
}

// ---------- filters ----------
export function FilterBar({ children, onClear, canClear }) {
  return (
    <div className="p-filters">
      {children}
      {onClear && (
        <button type="button" className="u-btn u-btn--ghost p-filters__clear" onClick={onClear} disabled={!canClear}>
          Clear filters
        </button>
      )}
    </div>
  );
}

export function SelectFilter({ label, value, onChange, options }) {
  const id = useId();
  return (
    <div className="u-field p-filter">
      <label htmlFor={id} className="u-label">
        {label}
      </label>
      <select id={id} className="u-input u-select" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => {
          const [val, text] = Array.isArray(o) ? o : [o, o];
          return (
            <option key={val} value={val}>
              {text}
            </option>
          );
        })}
      </select>
    </div>
  );
}

export function SearchFilter({ label, value, onChange, placeholder }) {
  const id = useId();
  return (
    <div className="u-field u-field--search p-filter p-filter--search">
      <label htmlFor={id} className="u-label">
        {label}
      </label>
      <Icon name="search" size={18} className="u-search__icon" />
      <input
        id={id}
        type="search"
        className="u-input u-search"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
      />
      {value && (
        <button type="button" className="u-search__clear" aria-label={`Clear ${label.toLowerCase()}`} onClick={() => onChange('')}>
          <Icon name="close" size={16} />
        </button>
      )}
    </div>
  );
}

export function DateFilter({ label, value, onChange, min, max }) {
  const id = useId();
  return (
    <div className="u-field p-filter">
      <label htmlFor={id} className="u-label">
        {label}
      </label>
      <input id={id} type="date" className="u-input u-date" value={value} min={min} max={max} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

/** Distinct "YYYY-MM" values (newest first) from ISO dates. */
export function useMonths(dates) {
  return useMemo(() => {
    const set = new Set(dates.filter(Boolean).map(monthKey));
    return [...set].sort().reverse();
  }, [dates]);
}

/** Local-time "YYYY-MM" key of an ISO date. */
export function monthKey(isoDate) {
  const local = new Date(isoDate);
  return `${local.getFullYear()}-${String(local.getMonth() + 1).padStart(2, '0')}`;
}

export function inMonth(isoDate, month) {
  return !month || monthKey(isoDate) === month;
}

export function ViewButton({ onClick, label = 'View Details' }) {
  return (
    <button type="button" className="p-view" onClick={onClick}>
      {label}
    </button>
  );
}
