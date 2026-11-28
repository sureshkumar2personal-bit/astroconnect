import { useEffect, useRef } from 'react';
import { closeModal } from '@/hooks/useRemedies.js';

// Shared building blocks for the Remedy Tracker views (reference classes → .rm-* in remedies.css).
const P = {
  search: 'M11 4a7 7 0 1 0 0 14a7 7 0 1 0 0-14z M21 21l-4.3-4.3',
  filter: 'M3 5h18l-7 8v6l-4-2v-4z',
  plus: 'M12 5v14 M5 12h14',
  x: 'M18 6L6 18 M6 6l12 12',
  chevronRight: 'M9 18l6-6-6-6', chevronDown: 'M6 9l6 6 6-6', arrowLeft: 'M19 12H5 M12 19l-7-7 7-7',
  trash: 'M3 6h18 M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6 M10 11v6 M14 11v6 M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2',
  up: 'M12 19V5 M5 12l7-7 7 7', down: 'M12 5v14 M19 12l-7 7-7-7',
  info: 'M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20z M12 16v-4 M12 8h.01',
  lock: 'M5 11h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2z M7 11V7a5 5 0 0 1 10 0v4',
  check: 'M20 6L9 17l-5-5', clock: 'M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20z M12 6v6l4 2',
  flame: 'M12 2c1 4 5 6 5 11a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-4-1-6 1-10z',
  lotus: 'M12 20c-4 0-8-2-9-7 4 0 7 1 9 4 2-3 5-4 9-4-1 5-5 7-9 7z M12 17c-2-2-3-5 0-12 3 7 2 10 0 12z',
  image: 'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z M8.5 7a1.5 1.5 0 1 0 0 3a1.5 1.5 0 1 0 0-3z M21 15l-5-5L5 21',
  flag: 'M4 22V4 M4 4h12l-2 4 2 4H4',
};
export function Ic({ n, size = 18, className }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d={P[n]} />
    </svg>
  );
}

export const Search = ({ value, onChange, label, placeholder, style }) => (
  <label className="rm-field" style={style}><Ic n="search" size={16} /><span className="rm-sr">{label}</span><input type="search" placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} /></label>
);
export const Sel = ({ value, onChange, label, options }) => (
  <label><span className="rm-sr">{label}</span><select className="rm-sel" value={value} onChange={(e) => onChange(e.target.value)}>{options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></label>
);
export const SEL_SERVICE = [['all', 'All Services'], ['text', 'Text Questions'], ['appt', 'Appointments'], ['chat', 'Instant Chat'], ['call', 'Instant Call']];
export const SEL_CATEGORY = [['all', 'All Categories'], ['Homam', 'Homam'], ['Pooja', 'Pooja'], ['Parihara', 'Parihara'], ['Mantra', 'Mantra']];

/** Segmented control: items = [{label, count?, on, onClick}]. */
export const Segc = ({ label, items, style, role = 'group' }) => (
  <div className="rm-segc" role={role} aria-label={label} style={style}>
    {items.map((x) => <button type="button" key={x.label} className={x.on ? 'on' : ''} onClick={x.onClick}>{x.label}{x.count !== undefined && <> <b>{x.count}</b></>}</button>)}
  </div>
);

export const Pill = ({ cls, children }) => <span className={`rm-pill ${cls}`}>{children}</span>;
export const Tag = ({ cls, children }) => <span className={`rm-tag ${cls}`}>{children}</span>;
export const Mono = ({ tone, size = '', children }) => <span className={`rm-mono ${size} ${tone}`}>{children}</span>;

/** Photo tile: a real image (from the device) or a sample placeholder. */
export function Tile({ img, caption, size = '', onClick, label }) {
  const inner = (
    <>
      {img?.url ? <img src={img.url} alt={caption || img.file || ''} /> : <Ic n={img?.lotus ? 'lotus' : 'flame'} size={40} />}
      {caption && <span className="cap">{caption}</span>}
    </>
  );
  const cls = `rm-phtile ${size} ${img?.tone || 'tone-gold'}`;
  return onClick ? <button type="button" className={cls} aria-label={label} onClick={onClick}>{inner}</button> : <div className={cls}>{inner}</div>;
}

export const Hint = ({ children, style }) => <div className="rm-hint" style={style}>{children}</div>;

/** Overlay dialog: Esc and backdrop close; focus moves into the card. */
export function Modal({ label, wide, children, onClose = closeModal, style }) {
  const ref = useRef(null);
  useEffect(() => {
    const prev = document.activeElement;
    ref.current?.focus();
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); prev?.focus?.(); };
  }, [onClose]);
  return (
    <div className="rm-ovl" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={`rm-modal${wide ? ' wide' : ''}`} role="dialog" aria-modal="true" aria-label={label} tabIndex={-1} ref={ref} style={style}>{children}</div>
    </div>
  );
}
export const ModalHead = ({ children, onClose = closeModal }) => (
  <div className="rm-mh"><div style={{ minWidth: 0 }}>{children}</div><button type="button" className="rm-iconbtn" aria-label="Close" onClick={onClose}><Ic n="x" /></button></div>
);

export function Toast({ toast }) {
  if (!toast) return null;
  return <div className={`rm-toast${toast.kind === 'err' ? ' err' : ''}`} role="status" aria-live="polite"><i />{toast.msg}</div>;
}
