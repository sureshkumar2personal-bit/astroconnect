import { useState } from 'react';
import Icon from '../../../components/icons.jsx';
import { href } from '../../../router/useHashRoute.js';
import { astrologerProfilePath, userProfilePath } from '../../../router/navigation.js';

export const NOT_FINALISED = 'Not finalised';
export const DAY = 24 * 60 * 60 * 1000;

export function startOfDay(ms) {
  const d = new Date(ms);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function UserLink({ id, name }) {
  return (
    <span className="p-desc">
      <a className="u-name" href={href(userProfilePath(id))}>{name}</a>
      <span className="p-small">{id}</span>
    </span>
  );
}

export function AstroLink({ id, name, tab }) {
  return (
    <span className="p-desc">
      <a className="u-name" href={`${href(astrologerProfilePath(id))}${tab ? `?tab=${tab}` : ''}`}>{name}</a>
      <span className="p-small">{id}</span>
    </span>
  );
}

export function PageHead({ title, subtitle, section = 'Service Management' }) {
  return (
    <header className="u-head">
      <nav aria-label="Breadcrumb" className="u-crumbs">
        <ol>
          <li>
            <a href={href('/dashboard')}>Dashboard</a>
          </li>
          {section && <li>{section}</li>}
          <li aria-current="page">{title}</li>
        </ol>
      </nav>
      <div className="u-head__row">
        <div>
          <h1 className="u-head__title">{title}</h1>
          <p className="u-head__subtitle">{subtitle}</p>
        </div>
      </div>
    </header>
  );
}

export function LoadingState({ label }) {
  return (
    <div className="u-directory">
      <div className="u-skeleton" role="status" aria-label={label}>
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="u-skeleton__row" />
        ))}
      </div>
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="u-state u-state--error" role="alert">
      <Icon name="alert" size={22} />
      <p className="u-state__title">Service records unavailable</p>
      <p className="u-state__text">{message} Please try again.</p>
      {onRetry && (
        <button type="button" className="u-btn" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}

/** PDF / Excel export of the currently filtered rows. */
export function ExportPair({ title, columns, rows, fileBase, notify }) {
  const [busy, setBusy] = useState(null);
  async function run(kind) {
    setBusy(kind);
    try {
      const { exportTable } = await import('../../../data/exporters.js');
      await exportTable(kind, { title: `AstroConnect - ${title}`, lines: [`Generated ${new Date().toLocaleString('en-IN')}.`, `Records: ${rows.length}.`], columns, rows, fileBase, sheet: title.slice(0, 30) });
      notify('success', `Exported ${rows.length.toLocaleString('en-IN')} records to ${kind === 'pdf' ? 'PDF' : 'Excel'}.`);
    } catch (err) {
      console.warn(err);
      notify('error', 'The export could not be created. Please try again.');
    } finally {
      setBusy(null);
    }
  }
  return (
    <div className="p-actions">
      <button type="button" className="u-btn" onClick={() => run('pdf')} disabled={!rows.length || Boolean(busy)}>
        <Icon name="download" size={16} />
        {busy === 'pdf' ? 'Preparing…' : 'Export PDF'}
      </button>
      <button type="button" className="u-btn" onClick={() => run('excel')} disabled={!rows.length || Boolean(busy)}>
        <Icon name="download" size={16} />
        {busy === 'excel' ? 'Preparing…' : 'Export Excel'}
      </button>
    </div>
  );
}

export function useToast() {
  const [toast, setToast] = useState(null);
  const notify = (tone, text) => {
    setToast({ tone, text });
    setTimeout(() => setToast(null), 6000);
  };
  const node = (
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
  );
  return [notify, node];
}

/** An action whose rule is not approved yet: shown but unavailable. */
export function UnavailableAction({ label, reason }) {
  return (
    <span className="sv-unavailable">
      <button type="button" className="u-btn" disabled>
        {label}
      </button>
      <span className="p-small">{reason}</span>
    </span>
  );
}
