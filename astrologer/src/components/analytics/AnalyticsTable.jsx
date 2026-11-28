import { useState } from 'react';
import Chg from './Metric.jsx';

// Shared Analytics blocks (reference "AstroConnect · Astrologer Analytics"): record tables with
// "Showing x of y" + Show more, the "Show … by day" disclosure button, and the status breakdown
// (split bar + tappable status rows). Colours come from styles/common/analytics.css.

export const PAGE = 8;

/** Rows shown per table (8, then +20 per "Show more"); reset() when the filter changes. */
export function usePager() {
  const [lim, setLim] = useState(PAGE);
  return { lim, more: () => setLim((x) => x + 20), reset: () => setLim(PAGE) };
}

/**
 * Table that stacks into label / value rows on a phone (reference `.tbl.stk`).
 * cols: [label | [label, 'r']]; rows: [{ key, cls?, cells: [node | [node, className]] }].
 */
export function DataTable({ cols, rows, tall, cmp }) {
  const c = (x) => (Array.isArray(x) ? x : [x, '']);
  return (
    <div className={'tblw' + (tall ? ' tall' : '')}>
      <table className={'atbl ' + (cmp ? 'cmp' : 'stk')}>
        <thead><tr>{cols.map((x, i) => <th key={i} className={c(x)[1]}>{c(x)[0]}</th>)}</tr></thead>
        <tbody>
          {rows.map((rw) => (
            <tr key={rw.key} className={rw.cls || undefined}>
              {rw.cells.map((x, i) => <td key={i} className={c(x)[1]} data-label={c(cols[i])[0]}>{c(x)[0]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** "Showing 8 of 17 appointments" + Show more. */
export function TableFoot({ shown, total, noun, onMore }) {
  if (!total) return null;
  return (
    <div className="tfoot">
      <span>Showing {Math.min(shown, total)} of {total.toLocaleString('en-IN')} {noun}</span>
      {total > shown && <button type="button" className="morebtn" onClick={onMore}>Show more</button>}
    </div>
  );
}

/** "Show breakdown by day" — a separate outlined button with a chevron; the table opens directly below it. */
export function Disc({ label, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="discw">
      <button type="button" className={'disc' + (open ? ' open' : '')} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        <span>{(open ? 'Hide ' : 'Show ') + label}</span>
        <span className="disc-ic" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
        </span>
      </button>
      {open && <div className="disc-b">{children}</div>}
    </div>
  );
}

/** Status breakdown: split bar and one tappable row per status (count, share, change). */
export function Breakdown({ segs, total, sel, onPick }) {
  return (
    <>
      <div className="sbar" aria-hidden="true">{segs.map((x) => <span key={x.id} style={{ width: (total ? x.n / total * 100 : 0).toFixed(2) + '%', background: x.c }} />)}</div>
      <div className="legs">
        {segs.map((x) => (
          <button key={x.id} type="button" className={'leg' + (sel === x.id ? ' on' : '')} aria-pressed={sel === x.id} onClick={() => onPick(x.id)}>
            <i style={{ background: x.c }} />
            <span>{x.label}</span>
            <span className="n num">{x.n.toLocaleString('en-IN')}</span>
            <span className="p num">{total ? (x.n / total * 100).toFixed(1) + '%' : '—'}</span>
            <span className="c"><Chg c={x.chg} /></span>
          </button>
        ))}
      </div>
    </>
  );
}

/** Status pill (reference `.pill`). */
export const Pill = ({ s, label }) => <span className={'pill ' + s}>{label}</span>;
export const SLAB = { answered: 'Answered', pending: 'Pending', expired: 'Expired', completed: 'Completed', upcoming: 'Upcoming', cancelled: 'Cancelled', missed: 'Missed', accepted: 'Accepted', declined: 'Declined', noresp: 'Not responded' };
