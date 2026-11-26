import { Fragment, useEffect, useRef, useState } from 'react';
import RowChevron from './RowChevron.jsx';

/**
 * Table whose rows expand in place to show their details (no navigation).
 * rows: [{ key, cells: [...], detail: () => node }]. Click, Enter or Space toggles a row. By default
 * one row is open at a time; `multi` lets each row open and close independently. Each row ends with the
 * shared RowChevron in a narrow last column (down when collapsed, up when expanded). `animate` slides the
 * details open and plays the reverse before removing them on collapse. `className` adds
 * a class to the wrapper (e.g. 'card'). Same table styling as sectionKit's Table; on phones each row is a card and its
 * details open inside that card.
 */
export default function ExpandTable({ cols, rows, empty = 'No records for this filter.', multi = false, className = '', animate = false }) {
  const span = cols.length + 1; // + the chevron column
  const [openKeys, setOpenKeys] = useState([]);
  const [closing, setClosing] = useState([]); // keys playing the collapse animation (animate only)
  const timers = useRef({});
  useEffect(() => () => Object.values(timers.current).forEach(clearTimeout), []);
  const close = (k) => {
    if (!animate) return;
    setClosing((c) => (c.includes(k) ? c : [...c, k]));
    clearTimeout(timers.current[k]);
    timers.current[k] = setTimeout(() => setClosing((c) => c.filter((x) => x !== k)), 180);
  };
  const toggle = (k) => setOpenKeys((o) => {
    if (o.includes(k)) { close(k); return o.filter((x) => x !== k); }
    if (!multi) o.forEach(close);
    if (animate) setClosing((c) => c.filter((x) => x !== k));
    return multi ? [...o, k] : [k];
  });
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
        <thead><tr>{cols.map((c) => <th key={c}>{c}</th>)}<th className="xtbl-chevcell"><span className="sr">Expand</span></th></tr></thead>
        <tbody>
          {rows.length ? rows.map((r) => {
            const open = openKeys.includes(r.key);
            const id = `xd-${r.key}`;
            return (
              <Fragment key={r.key}>
                <tr tabIndex={0} className={open ? 'is-open' : undefined} aria-expanded={open} aria-controls={id}
                  onClick={() => toggle(r.key)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(r.key); } }}>
                  {r.cells.map((c, i) => <td key={i} data-label={cols[i]}>{c}</td>)}
                  <td className="xtbl-chevcell"><RowChevron open={open} /></td>
                </tr>
                {(open || closing.includes(r.key)) && (
                  <tr id={id} className={`xtbl-d${animate ? (open ? ' xtbl-d--in' : ' xtbl-d--out') : ''}`}>
                    <td colSpan={span}><div className="xtbl-d__body">{r.detail()}</div></td>
                  </tr>
                )}
              </Fragment>
            );
          }) : (
            <tr><td colSpan={span} className="muted">{empty}</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
