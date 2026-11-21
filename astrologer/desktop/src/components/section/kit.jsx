// Building blocks for the section pages — React versions of the reference helpers
// (sec, kpi, seg, tbl, field, bars, prog …). Styles: astrology-css/*/work.css, "Section pages".
import Toggle from '@shared/components/Toggle.jsx';

export { Badge, PendingTag, Avatar } from '@shared/components/ui.jsx';
export { Toggle };

/** Card section with a serif heading and optional right-side content (reference `sec`). */
export function Sec({ title, right, className = '', children }) {
  return (
    <section className={`card sec ${className}`}>
      {(title || right) && (
        <div className="row wrap">
          {title && <h2 className="h grow">{title}</h2>}
          {right}
        </div>
      )}
      {children}
    </section>
  );
}

/** Summary tile. With `href` (hash path) or `onClick` it becomes a link/button. */
export function Kpi({ label, value, sub, href, onClick }) {
  const body = (<><span className="sm">{label}</span><b>{value}</b>{sub}</>);
  if (href) return <a className="kpi kpi--link" href={`#${href}`}>{body}</a>;
  if (onClick) return <button type="button" className="kpi kpi--link" onClick={onClick}>{body}</button>;
  return <div className="kpi">{body}</div>;
}

/** Grid of Kpi tiles (reference `grid sm`). */
export const KpiGrid = ({ children }) => <div className="kpis">{children}</div>;

/** Responsive card grid: `size` sm (170px), md (280px, default) or lg (420px) minimum columns. */
export const Grid = ({ size = 'md', children }) => <div className={`pgrid pgrid--${size}`}>{children}</div>;

/** One-of toggle group (reference `seg`). options: [[value, label], …] or [value, …]. */
export function Seg({ label, options, value, onChange, disabled }) {
  return (
    <div className="tabs" role="group" aria-label={label}>
      {options.map((o) => {
        const [v, l] = Array.isArray(o) ? o : [o, o];
        return (
          <button key={String(v)} type="button" className={`tab${v === value ? ' on' : ''}`} aria-pressed={v === value} disabled={disabled} onClick={() => onChange(v)}>{l}</button>
        );
      })}
    </div>
  );
}

/**
 * Data table that turns into stacked cards on tablet/phone (reference `tbl`).
 * rows: [{ key, cells: [node…], onOpen? }]. `bare`: no card frame (when already inside a Sec).
 */
export function Table({ cols, rows, empty = 'No records for this filter.', bare }) {
  return (
    <div className={bare ? 'tw' : 'card tw'}>
      <table className="tbl">
        <thead><tr>{cols.map((c) => <th key={c}>{c}</th>)}</tr></thead>
        <tbody>
          {rows.length ? rows.map((r) => (
            <tr key={r.key} tabIndex={r.onOpen ? 0 : undefined} onClick={r.onOpen} onKeyDown={r.onOpen ? (e) => { if (e.key === 'Enter') r.onOpen(); } : undefined}>
              {r.cells.map((c, i) => <td key={i} data-label={cols[i]}>{c}</td>)}
            </tr>
          )) : (
            <tr><td colSpan={cols.length} className="muted">{empty}</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

/** Labelled form field (reference `field`). `req` adds the red asterisk. */
export function Field({ label, req, children, className }) {
  return (
    <label className={className}>
      <span className={req ? 'req' : undefined}>{label}</span>
      {children}
    </label>
  );
}

/** Switch row: label on the left, switch on the right. */
export function SwitchRow({ label, sub, on, onToggle, disabled }) {
  return (
    <div className="row">
      <span className="grow">{label}{sub && <div className="muted sm">{sub}</div>}</span>
      <Toggle on={on} label={typeof label === 'string' ? label : undefined} onToggle={onToggle} disabled={disabled} />
    </div>
  );
}

/** Vertical bar chart (reference `bars`). `peak` index is highlighted. */
export function Bars({ values, labels, peak }) {
  const max = Math.max(1, ...values);
  const pk = peak ?? values.indexOf(Math.max(...values));
  return (
    <>
      <div className="hbars" role="img" aria-label={labels.map((l, i) => `${l} ${values[i]}`).join(', ')}>
        {values.map((v, i) => (
          <div key={i}><b className="sm">{v}</b><i className={i === pk ? 'pk' : undefined} style={{ '--h': `${(v / max) * 100}%` }} /></div>
        ))}
      </div>
      <div className="hlab">{labels.map((l) => <span key={l}>{l}</span>)}</div>
    </>
  );
}

/** Progress bar (reference `prog`). */
export const Prog = ({ pct, color }) => (
  <div className="prog grow"><span style={{ '--pct': `${Math.min(100, Math.max(0, pct))}%`, ...(color ? { '--bar': color } : {}) }} /></div>
);

export const Pill = ({ children }) => <span className="pill">{children}</span>;
export const Note = ({ children, tone }) => <div className={`note${tone ? ` note--${tone}` : ''}`}>{children}</div>;
export const Empty = ({ title, children }) => <div className="empty"><b>{title}</b>{children && <span className="muted">{children}</span>}</div>;
export const BtnRow = ({ children }) => <div className="btn-row">{children}</div>;

/** Fact tiles (label + value). items: [[label, value], …] */
export function Facts({ items, cols }) {
  return (
    <div className={`facts${cols === 3 ? ' three' : ''}`}>
      {items.map(([k, v]) => <div key={k} className="fact"><span className="muted sm">{k}</span><b>{v}</b></div>)}
    </div>
  );
}

/** Clickable list row (reference `li`): icon tile, text, optional right content. */
export function ListRow({ icon, title, sub, right, href, onClick }) {
  const inner = (<><span className="ic">{icon}</span><div className="grow"><b className="li-title">{title}</b>{sub && <div className="muted sm">{sub}</div>}</div>{right}</>);
  if (href) return <a className="li" href={`#${href}`}>{inner}</a>;
  if (onClick) return <button type="button" className="li li--btn" onClick={onClick}>{inner}</button>;
  return <div className="li">{inner}</div>;
}

/** Star rating display. */
export const Stars = ({ n }) => <span className="stars" aria-label={`${n} out of 5 stars`}>{'★'.repeat(n)}{'☆'.repeat(5 - n)}</span>;
