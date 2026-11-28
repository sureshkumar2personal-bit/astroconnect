import { useLayoutEffect, useRef, useState } from 'react';
import { mono, niceMax, tp } from '@/lib/analytics.js';

// Chart building blocks for the Analytics page (reference "AstroConnect · Astrologer Analytics"):
// line chart, multi-line chart, grouped bar chart, tooltip, detail panel and table. Colours are CSS values
// (theme variables), so light and dark mode both work. Hover shows a tooltip; click opens details.

/** Series colours (theme variables in styles/common/analytics.css): the reference teal → burgundy,
 *  blue → champagne gold, gold → bronze, sage → mauve; tints for request bars; semantic red for "missed". */
export const C = {
  pri: 'var(--an-pri)', sec: 'var(--an-sec)', c3: 'var(--an-c3)', c4: 'var(--an-c4)',
  callT: 'var(--an-callT)', chatT: 'var(--an-chatT)', reqAll: 'var(--an-reqall)', accAll: 'var(--an-accall)',
  grey: 'var(--an-grey)', prev: 'var(--an-prev)', red: 'var(--an-red)', sand: 'var(--an-sand)',
  liveLine: 'var(--an-liveline)', liveCm: 'var(--an-livecm)',
};

/** Tooltip. After it appears it measures itself and shifts sideways so it always stays on screen. */
export function Tip({ tip, style }) {
  const ref = useRef(null);
  const [dx, setDx] = useState(0);
  const key = tip ? tip.title + JSON.stringify(tip.pos || {}) : '';
  useLayoutEffect(() => {
    const el = ref.current; if (!el) return;
    // Measure the natural position (without the shift currently applied), then shift only if it overflows.
    const rc = el.getBoundingClientRect(), vw = document.documentElement.clientWidth, m = 8;
    const left = rc.left - dx, right = rc.right - dx;
    setDx(right > vw - m ? vw - m - right : left < m ? m - left : 0);
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!tip) return null;
  const base = { ...tip.pos, ...style };
  const shift = dx ? { translate: `${dx}px 0` } : null;
  return (
    <div ref={ref} className={'tip' + (tip.cls ? ' ' + tip.cls : '')} style={{ ...base, ...shift }}>
      <div className="tip-t">{tip.title}</div>
      {tip.rows.map((x, i) => (
        <div key={i} className={x.cls}><span><i className="sw" style={{ background: x.c }} />{x.k}</span><span className="tip-v">{x.v}</span></div>
      ))}
      {tip.foot && <div className="tip-f">{tip.foot}</div>}
    </div>
  );
}

const Ticks = ({ ticks }) => ticks.map((t, i) => <div key={i} className="grid" style={{ top: t.top }} />);
const YLab = ({ h, ticks }) => <div className="ylab" style={{ height: h }}>{ticks.map((t, i) => <span key={i} style={{ top: t.top }}>{t.lbl}</span>)}</div>;

/**
 * Line chart. main / l2 (second line) / prev (dashed previous period) are value arrays.
 * labels: buckets ({ label }). tipAt(i) → tooltip for the hovered point.
 */
export function LineChart({ H, main, l2, prev, color, color2, labels, hi, si, maxLabels = 8, fmt, aria, onHover, onClick, tipAt, fill = 0.12, w1 = 2.75, w2 = 2.5 }) {
  const W = 1000, len = main.length, pad = len > 1 ? 14 : 0;
  const max = niceMax(Math.max(0, ...main, ...(l2 || []), ...(prev || [])));
  const X = (i) => (len === 1 ? 500 : pad + i * (W - 2 * pad) / (len - 1));
  const Y = (v) => H - 4 - (v / max) * (H - 14);
  const line = (a) => (a && a.length ? mono(a.map((v, i) => [X(i), Y(v)])) : '');
  const p1 = line(main);
  const area = len > 1 ? `${p1} L${X(len - 1).toFixed(1)},${H} L${X(0).toFixed(1)},${H} Z` : '';
  const ticks = [max, max / 2, 0].map((v) => ({ lbl: fmt(v), top: (Y(v) / H * 100).toFixed(2) + '%' }));
  const step = len > 1 ? (W - 2 * pad) / (len - 1) : W;
  const pc = (x) => (x / 10).toFixed(2) + '%';
  const k = Math.max(1, Math.ceil(len / maxLabels));
  const ai = hi != null ? hi : si;
  const h = H + 'px';
  return (
    <div className="chart">
      <YLab h={h} ticks={ticks} />
      <div>
        <div className="plot" style={{ height: h }}>
          <Ticks ticks={ticks} />
          <svg viewBox={`0 0 1000 ${H}`} preserveAspectRatio="none" aria-hidden="true">
            {area && <path d={area} style={{ fill: color }} fillOpacity={fill} stroke="none" />}
            {prev && <path d={line(prev)} fill="none" style={{ stroke: 'var(--an-prevline)' }} strokeWidth="1.5" strokeDasharray="5 5" vectorEffect="non-scaling-stroke" />}
            <path d={p1} fill="none" style={{ stroke: color }} strokeWidth={w1} vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
            {l2 && <path d={line(l2)} fill="none" style={{ stroke: color2 }} strokeWidth={w2} vectorEffect="non-scaling-stroke" strokeLinecap="round" />}
          </svg>
          {ai != null && <div className="vg" style={{ left: pc(X(ai)) }} />}
          {main.map((v, i) => {
            const on = i === hi || i === si;
            return (len <= 14 || on) ? <div key={i} className={'dot' + (on ? ' on' : '')} style={{ left: pc(X(i)), top: (Y(v) / H * 100).toFixed(2) + '%', color }} /> : null;
          })}
          {l2 && hi != null && <div className="dot on" style={{ left: pc(X(hi)), top: (Y(l2[hi]) / H * 100).toFixed(2) + '%', color: color2 }} />}
          {main.map((_, i) => {
            const l = Math.max(0, X(i) - step / 2), rr = Math.min(W, X(i) + step / 2);
            return (
              <button key={i} type="button" className="hit" style={{ left: pc(l), width: pc(rr - l) }} aria-label={aria(i)}
                onMouseEnter={() => onHover(i)} onMouseLeave={() => onHover(null)} onFocus={() => onHover(i)} onBlur={() => onHover(null)} onClick={() => onClick(i)} />
            );
          })}
          {hi != null && <Tip tip={{ ...tipAt(hi), pos: tp(X(hi) / 10) }} style={{ top: 6 }} />}
        </div>
        <div className="xl">{labels.map((b, i) => (i % k === 0 ? <span key={i} style={{ left: pc(X(i)) }}>{b.label}</span> : null))}</div>
      </div>
    </div>
  );
}

/**
 * Grouped bar chart. groups: [{ label, aria, vals: [{ v, c }] }]. minPer: minimum px per group
 * (wider charts scroll sideways inside the card, as in the reference).
 */
export function BarChart({ H, groups, hi, si, minPer = 0, maxLabels = 12, fmt, onHover, onClick, tipAt, basis, scroll = true }) {
  const len = groups.length;
  const max = niceMax(Math.max(0, ...groups.map((g) => Math.max(0, ...g.vals.map((x) => x.v)))));
  const k = Math.max(1, Math.ceil(len / maxLabels));
  const ticks = [max, max / 2, 0].map((v) => ({ lbl: fmt(v), top: ((1 - v / max) * 100).toFixed(2) + '%' }));
  const h = H + 'px';
  const body = (
    <>
      <div className="bars" style={{ height: h }}>
        <Ticks ticks={ticks} />
        {groups.map((g, i) => (
          <button key={i} type="button" className={'bg' + (i === hi || i === si ? ' hot' : '') + (i === si ? ' sel' : '')} aria-label={g.aria}
            onMouseEnter={() => onHover(i)} onMouseLeave={() => onHover(null)} onFocus={() => onHover(i)} onBlur={() => onHover(null)} onClick={() => onClick(i)}>
            {g.vals.map((b, j) => <span key={j} className="bar" style={{ height: (b.v / max * 100).toFixed(2) + '%', background: b.c, ...(basis ? { flexBasis: basis } : {}) }} />)}
          </button>
        ))}
        {hi != null && tipAt && <Tip tip={{ ...tipAt(hi), pos: tp((hi + 0.5) / len * 100) }} style={{ top: 6 }} />}
      </div>
      <div className="xlb">{groups.map((g, i) => <span key={i}>{i % k === 0 ? g.label : ''}</span>)}</div>
    </>
  );
  return (
    <div className="chart">
      <YLab h={h} ticks={ticks} />
      {scroll ? <div className="scroll-x"><div style={{ minWidth: Math.max(0, len * minPer) + 'px' }}>{body}</div></div> : <div>{body}</div>}
    </div>
  );
}

/**
 * Multi-series line chart (Growth & Trends). series: [{ c, vals }]. Hover shows one tooltip for the
 * bucket; click opens its breakdown.
 */
export function MultiLine({ H, series, labels, hi, si, maxLabels = 12, fmt, aria, onHover, onClick, tipAt }) {
  const W = 1000, len = labels.length, pad = len > 1 ? 14 : 0;
  const max = niceMax(Math.max(0, ...series.flatMap((x) => x.vals)));
  const X = (i) => (len === 1 ? 500 : pad + i * (W - 2 * pad) / (len - 1));
  const Y = (v) => H - 4 - (v / max) * (H - 14);
  const ticks = [max, max / 2, 0].map((v) => ({ lbl: fmt(v), top: (Y(v) / H * 100).toFixed(2) + '%' }));
  const step = len > 1 ? (W - 2 * pad) / (len - 1) : W;
  const pc = (x) => (x / 10).toFixed(2) + '%';
  const k = Math.max(1, Math.ceil(len / maxLabels));
  const ai = hi != null ? hi : si;
  const h = H + 'px';
  return (
    <div className="chart">
      <YLab h={h} ticks={ticks} />
      <div>
        <div className="plot" style={{ height: h }}>
          <Ticks ticks={ticks} />
          <svg viewBox={`0 0 1000 ${H}`} preserveAspectRatio="none" aria-hidden="true">
            {series.map((x, j) => <path key={j} d={mono(x.vals.map((v, i) => [X(i), Y(v)]))} fill="none" style={{ stroke: x.c }} strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />)}
          </svg>
          {ai != null && <div className="vg" style={{ left: pc(X(ai)) }} />}
          {series.map((x, j) => x.vals.map((v, i) => {
            const on = i === hi || i === si;
            return (len <= 14 || on) ? <div key={j + ':' + i} className={'dot' + (on ? ' on' : '')} style={{ left: pc(X(i)), top: (Y(v) / H * 100).toFixed(2) + '%', color: x.c }} /> : null;
          }))}
          {labels.map((_, i) => {
            const l = Math.max(0, X(i) - step / 2), rr = Math.min(W, X(i) + step / 2);
            return (
              <button key={i} type="button" className="hit" style={{ left: pc(l), width: pc(rr - l) }} aria-label={aria(i)}
                onMouseEnter={() => onHover(i)} onMouseLeave={() => onHover(null)} onFocus={() => onHover(i)} onBlur={() => onHover(null)} onClick={() => onClick(i)} />
            );
          })}
          {hi != null && <Tip tip={{ ...tipAt(hi), pos: tp(X(hi) / 10) }} style={{ top: 6 }} />}
        </div>
        <div className="xl">{labels.map((b, i) => (i % k === 0 ? <span key={i} style={{ left: pc(X(i)) }}>{b.label}</span> : null))}</div>
      </div>
    </div>
  );
}

/** Drill-down panel under a chart (AD-146: clicking opens the details). */
export function Detail({ title, sub, onClose, children }) {
  return (
    <div className="detail">
      <div className="dh">
        <div><h3 className="dt">{title}</h3>{sub && <p className="ds">{sub}</p>}</div>
        <button type="button" className="xbtn" onClick={onClose}>Close <span aria-hidden="true">×</span></button>
      </div>
      {children}
    </div>
  );
}

/** Table. cols: [label | [label, 'r']]; rows: [{ key, cells: [node | [node, className]] }]. */
export function Tbl({ cols, rows, minWidth, style }) {
  const c = (x) => (Array.isArray(x) ? x : [x, '']);
  return (
    <div className="tblw" style={style}>
      <table className="atbl" style={minWidth ? { minWidth } : undefined}>
        <thead><tr>{cols.map((x, i) => <th key={i} className={c(x)[1]}>{c(x)[0]}</th>)}</tr></thead>
        <tbody>{rows.map((rw) => <tr key={rw.key}>{rw.cells.map((x, i) => <td key={i} className={c(x)[1]}>{c(x)[0]}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}
