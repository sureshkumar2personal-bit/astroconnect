import { useState } from 'react';
import ChartTooltip from './ChartTooltip.jsx';
import { niceTicks, useElementWidth } from './chartUtils.js';
import './charts.css';

const MARGIN = { top: 10, right: 8, bottom: 28, left: 44 };

/**
 * Vertical bar chart, grouped or stacked.
 * data:   [{ label, shortLabel?, fullLabel, values: { [seriesKey]: number } }]
 *         shortLabel is used on the axis when columns are narrow.
 * series: [{ key, label, color }]
 */
export default function BarChart({
  data,
  series,
  stacked = false,
  height = 240,
  integer = false,
  formatValue = String,
  formatTick = formatValue,
  totalLabel = 'Total',
  ariaLabel,
}) {
  const [ref, width] = useElementWidth();
  const [active, setActive] = useState(null);

  const innerW = Math.max(0, width - MARGIN.left - MARGIN.right);
  const innerH = height - MARGIN.top - MARGIN.bottom;
  const valueOf = (d, key) => d.values[key] ?? 0;
  const totals = data.map((d) => series.reduce((s, se) => s + valueOf(d, se.key), 0));
  const peaks = data.map((d, i) =>
    stacked ? totals[i] : Math.max(...series.map((se) => valueOf(d, se.key)))
  );
  const ticks = niceTicks(Math.max(0, ...peaks), 4, integer);
  const top = ticks.at(-1);
  const y = (v) => innerH - (v / top) * innerH;

  const band = data.length ? innerW / data.length : 0;
  const pad = band * (stacked ? 0.24 : 0.18);
  const areaW = Math.max(0, band - pad * 2);
  const barW = stacked ? areaW : areaW / series.length;

  const activeItem = active === null ? null : data[active];

  return (
    <div className="chart" ref={ref} style={{ height }}>
      {width > 0 && (
        <svg width={width} height={height} role="group" aria-label={ariaLabel}>
          <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
            {ticks.map((t) => (
              <g key={t}>
                <line className="chart__grid" x1={0} x2={innerW} y1={y(t)} y2={y(t)} />
                <text className="chart__tick" x={-8} y={y(t)} dy="0.32em" textAnchor="end">
                  {formatTick(t)}
                </text>
              </g>
            ))}

            {data.map((d, i) => {
              const x0 = i * band;
              let acc = 0;
              return (
                <g key={d.label}>
                  {active === i && (
                    <rect className="chart__hover" x={x0} y={0} width={band} height={innerH} rx={6} />
                  )}
                  {series.map((se, j) => {
                    const v = valueOf(d, se.key);
                    let bx;
                    let by;
                    let bh;
                    if (stacked) {
                      bx = x0 + pad;
                      by = y(acc + v);
                      bh = y(acc) - y(acc + v);
                      acc += v;
                    } else {
                      bx = x0 + pad + j * barW;
                      by = y(v);
                      bh = innerH - y(v);
                    }
                    return (
                      <rect
                        key={se.key}
                        x={bx}
                        y={by}
                        width={Math.max(0, stacked ? barW : barW - 2)}
                        height={Math.max(0, bh)}
                        rx={stacked ? 1.5 : 3}
                        fill={se.color}
                      />
                    );
                  })}
                  <text
                    className="chart__tick"
                    x={x0 + band / 2}
                    y={innerH + 18}
                    textAnchor="middle"
                  >
                    {band < 84 && d.shortLabel ? d.shortLabel : d.label}
                  </text>
                  <rect
                    className="chart__hit"
                    x={x0}
                    y={0}
                    width={band}
                    height={innerH}
                    tabIndex={0}
                    role="img"
                    aria-label={`${d.fullLabel ?? d.label}: ${series
                      .map((se) => `${se.label} ${formatValue(valueOf(d, se.key))}`)
                      .join(', ')}${stacked ? `, ${totalLabel} ${formatValue(totals[i])}` : ''}`}
                    onMouseEnter={() => setActive(i)}
                    onMouseLeave={() => setActive(null)}
                    onFocus={() => setActive(i)}
                    onBlur={() => setActive(null)}
                  />
                </g>
              );
            })}
            <line className="chart__axis" x1={0} x2={innerW} y1={innerH} y2={innerH} />
          </g>
        </svg>
      )}
      {activeItem && (
        <ChartTooltip
          x={MARGIN.left + (active + 0.5) * band}
          containerWidth={width}
          title={activeItem.fullLabel ?? activeItem.label}
          rows={series.map((se) => ({
            label: se.label,
            color: se.color,
            value: formatValue(valueOf(activeItem, se.key)),
          }))}
          total={stacked ? { label: totalLabel, value: formatValue(totals[active]) } : null}
        />
      )}
    </div>
  );
}
