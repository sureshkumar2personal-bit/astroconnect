import { useId } from 'react';
import Icon from '../../../components/icons.jsx';

// Search, Account Status and Registration Date filters, reset and exports.
export default function UsersToolbar({
  query,
  onQuery,
  status,
  onStatus,
  from,
  to,
  onFrom,
  onTo,
  dateError,
  hasFilters,
  onReset,
  exporting,
  canExport,
  onExport,
}) {
  const uid = useId();
  return (
    <div className="u-toolbar">
      <div className="u-toolbar__filters">
        <div className="u-field u-field--search">
          <label htmlFor={`${uid}-q`} className="visually-hidden">
            Search users
          </label>
          <Icon name="search" size={18} className="u-search__icon" />
          <input
            id={`${uid}-q`}
            type="search"
            className="u-input u-search"
            placeholder="Search name, ID, mobile, email"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            autoComplete="off"
          />
          {query && (
            <button
              type="button"
              className="u-search__clear"
              aria-label="Clear search"
              onClick={() => onQuery('')}
            >
              <Icon name="close" size={16} />
            </button>
          )}
        </div>

        <div className="u-field">
          <label htmlFor={`${uid}-status`} className="u-label">
            Account Status
          </label>
          <select
            id={`${uid}-status`}
            className="u-input u-select"
            value={status}
            onChange={(e) => onStatus(e.target.value)}
          >
            <option value="all">All</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
            <option value="Blocked">Blocked</option>
            {status === 'restricted' && <option value="restricted">Suspended + Blocked</option>}
          </select>
        </div>

        <fieldset className="u-field u-dates" aria-describedby={dateError ? `${uid}-date-err` : undefined}>
          <legend className="u-label">Registration Date</legend>
          <div className="u-dates__row">
            <label htmlFor={`${uid}-from`} className="visually-hidden">
              Registered from
            </label>
            <input
              id={`${uid}-from`}
              type="date"
              className={`u-input u-date${dateError ? ' has-error' : ''}`}
              value={from}
              max={to || undefined}
              onChange={(e) => onFrom(e.target.value)}
            />
            <span className="u-dates__sep" aria-hidden="true">
              to
            </span>
            <label htmlFor={`${uid}-to`} className="visually-hidden">
              Registered to
            </label>
            <input
              id={`${uid}-to`}
              type="date"
              className={`u-input u-date${dateError ? ' has-error' : ''}`}
              value={to}
              min={from || undefined}
              onChange={(e) => onTo(e.target.value)}
            />
          </div>
          {dateError && (
            <p id={`${uid}-date-err`} className="u-field__error">
              {dateError}
            </p>
          )}
        </fieldset>

        <button type="button" className="u-btn u-btn--ghost" onClick={onReset} disabled={!hasFilters}>
          Reset filters
        </button>
      </div>

      <div className="u-toolbar__export" role="group" aria-label="Export filtered users">
        <button
          type="button"
          className="u-btn"
          onClick={() => onExport('pdf')}
          disabled={!canExport || Boolean(exporting)}
          aria-busy={exporting === 'pdf'}
        >
          <Icon name="download" size={16} />
          {exporting === 'pdf' ? 'Preparing PDF…' : 'Export PDF'}
        </button>
        <button
          type="button"
          className="u-btn"
          onClick={() => onExport('excel')}
          disabled={!canExport || Boolean(exporting)}
          aria-busy={exporting === 'excel'}
        >
          <Icon name="download" size={16} />
          {exporting === 'excel' ? 'Preparing Excel…' : 'Export Excel'}
        </button>
      </div>
    </div>
  );
}
