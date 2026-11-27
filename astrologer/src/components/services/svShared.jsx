import { useState } from 'react';
import Icon from '@/components/ui/Icon.jsx';

// Shared building blocks for Service Management (reference "Astrologer Portal: Service Management").

export const clone = (x) => JSON.parse(JSON.stringify(x));
export const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
export const validPrice = (v) => { const s = String(v == null ? '' : v).trim(); return /^\d+(\.\d{1,2})?$/.test(s) && Number(s) > 0; };

/**
 * Draft / saved state for one service page. Save keeps the draft in memory for this page only, exactly like the
 * reference ("Saved in this prototype only"): no other section's settings are touched.
 */
export function useDraft(initial) {
  const [saved, setSaved] = useState(() => clone(initial));
  const [draft, setDraft] = useState(() => clone(initial));
  const [tried, setTried] = useState(false);
  const [error, setError] = useState('');
  const [flash, setFlash] = useState('');
  const dirty = !same(draft, saved);
  const upd = (fn) => { setDraft((d) => { const x = clone(d); fn(x); return x; }); setFlash(''); setError(''); };
  const status = error ? { text: error, tone: 'bad' }
    : dirty ? { text: 'You have unsaved changes.', tone: 'warn' }
      : flash === 'saved' ? { text: 'Saved in this prototype only. No live service settings were changed.', tone: 'ok' }
        : flash === 'discarded' ? { text: 'Changes discarded.', tone: 'mut' }
          : { text: 'No unsaved changes.', tone: 'mut' };
  return {
    draft, saved, dirty, upd, tried, status,
    fail: (msg) => { setTried(true); setError(msg); },
    setError,
    commit: () => { setSaved(clone(draft)); setTried(false); setError(''); setFlash('saved'); },
    discard: () => { setDraft(clone(saved)); setTried(false); setError(''); setFlash('discarded'); },
  };
}

export const PageHead = ({ icon, title }) => (
  <div className="sv-head">
    {icon && <span className="sv-head__ic"><Icon name={icon} size={24} /></span>}
    <div><h1 className="sv-h1">{title}</h1></div>
  </div>
);

export const Card = ({ title, right, children, id }) => (
  <section className="sv-card" aria-labelledby={id}>
    <header className="sv-card__h"><div><h2 id={id}>{title}</h2></div>{right}</header>
    {children}
  </section>
);

export const Chip = ({ tone = 'gold', children }) => <span className={`sv-chip sv-chip--${tone}`}>{children}</span>;

/** Switch used by the services (role=switch, labelled). */
export const Sw = ({ on, label, onClick }) => (
  <button type="button" role="switch" aria-checked={on} aria-label={label} className={`sv-sw${on ? ' on' : ''}`} onClick={onClick}><span /></button>
);

/** Same Home Dashboard note used by every service: availability is switched on the Home Dashboard. */
export function AvailCard({ name }) {
  return (
    <Card title="Availability" id="sv-avail">
      <div className="sv-note"><Icon name="info" size={16} /><span>{name} availability is controlled from the Home Dashboard. There is no separate on/off switch here, so the two can never disagree.</span></div>
      <a className="btn btn-o sv-link" href="#/">Go to Home Dashboard</a>
    </Card>
  );
}

/** Sticky Save / Cancel bar with the reference's status text. */
export function SaveBar({ status, dirty, onCancel, onSave }) {
  return (
    <div className="sv-bar" role="region" aria-label="Save changes">
      <span className={`sv-bar__st sv-bar__st--${status.tone}`} role="status" aria-live="polite">{status.text}</span>
      <div className="sv-bar__btns">
        <button type="button" className="btn btn-o" onClick={onCancel} disabled={!dirty}>Cancel</button>
        <button type="button" className="btn sv-btn" onClick={onSave}>Save changes</button>
      </div>
    </div>
  );
}
