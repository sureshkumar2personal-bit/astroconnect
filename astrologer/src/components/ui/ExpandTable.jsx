import { Fragment, useEffect, useRef, useState } from 'react';
import Icon from './Icon.jsx';

/**
 * Table whose rows expand in place to show their details (no navigation).
 * rows: [{ key, cells: [...], detail: () => node }]. Click, Enter or Space toggles a row. By default
 * one row is open at a time; `multi` lets each row open and close independently. `className` adds
 * a class to the wrapper (e.g. 'card'). Same table styling as sectionKit's Table; on phones each row is a card and its
 * details open inside that card.
 */
export default function ExpandTable({ cols, rows, empty = 'No records for this filter.', multi = false, className = '' }) {
  const [openKeys, setOpenKeys] = useState([]);
  const toggle = (k) => setOpenKeys((o) => (o.includes(k) ? o.filter((x) => x !== k) : multi ? [...o, k] : [k]));
  // When the table is wider than its card (it scrolls sideways), keep the open details within the
  // visible width: --xw is the visible width, used by .xtbl-d__body.
  const wrap = useRef(null);
  useEffect(() => {
    const el = wrap.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const set = () => el.style.setProperty('--xw', `${el.clientWidth}px`);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={wrap} className={`tw${className ? ` ${className}` : ''}`}>
      <table className="tbl xtbl">
        <thead><tr>{cols.map((c) => <th key={c}>{c}</th>)}</tr></thead>
        <tbody>
          {rows.length ? rows.map((r) => {
            const open = openKeys.includes(r.key);
            const id = `xd-${r.key}`;
            return (
              <Fragment key={r.key}>
                <tr tabIndex={0} className={open ? 'is-open' : undefined} aria-expanded={open} aria-controls={id}
                  onClick={() => toggle(r.key)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(r.key); } }}>
                  {r.cells.map((c, i) => (
                    <td key={i} data-label={cols[i]}>
                      {i === 0 ? <span className="xtbl-id"><Icon name="chevronDown" size={16} className="xtbl-chev" />{c}</span> : c}
                    </td>
                  ))}
                </tr>
                {open && (
                  <tr id={id} className="xtbl-d">
                    <td colSpan={cols.length}><div className="xtbl-d__body">{r.detail()}</div></td>
                  </tr>
                )}
              </Fragment>
            );
          }) : (
            <tr><td colSpan={cols.length} className="muted">{empty}</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
