import { useState } from 'react';
import ChartTooltip from './ChartTooltip.jsx';
import { niceTicks, useElementWidth } from './chartUtils.js';
import './charts.css';

const MARGIN = { top: 12, right: 12, bottom: 26, left: 36 };

/**
 * Single-series line chart with an area fill.
 * data: [{ label, fullLabel, value }]
 */
export default function LineChart({
  data,
  color,
  seriesLabel,
  height = 150,
  integer = false,
  formatValue = String,
  ariaLabel,
}) {
  const [ref, width] = useElementWidth();
  const [active, setActive] = useState(null);

  const innerW = Math.max(0, width - MARGIN.left - MARGIN.right);
  const innerH = height - MARGIN.top - MARGIN.bottom;
  const ticks = niceTicks(Math.max(0, ...data.map((d) => d.value)), 3, integer);
  const top = ticks.at(-1);
  const step = data.length > 1 ? innerW / (data.length - 1) : 0;
  const x = (i) => i * step;
  const y = (v) => innerH - (v / top) * innerH;

  const points = data.map((d, i) => `${x(i)},${y(d.value)}`).join(' ');
  const area = data.length
    ? `M0,${innerH} L${points.replaceAll(' ', ' L')} L${x(data.length - 1)},${innerH} Z`
    : '';
  // Thin out x labels when the chart is narrow.
  const labelEvery = step >= 26 ? 1 : step >= 13 ? 2 : 3;
  const lastIndex = data.length - 1;

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
                  {t}
                </text>
              </g>
            ))}
            <path d={area} fill={color} opacity="0.1" />
            <polyline
              points={points}
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {active !== null && (
              <line className="chart__guide" x1={x(active)} x2={x(active)} y1={0} y2={innerH} />
            )}
            {data.map((d, i) => (
              <circle
                key={d.fullLabel ?? d.label}
                cx={x(i)}
                cy={y(d.value)}
                r={active === i ? 4.5 : i === lastIndex ? 3.5 : 2.2}
                fill={active === i || i === lastIndex ? color : '#fffdf8'}
                stroke={color}
                strokeWidth="1.5"
              />
            ))}
            {data.map((d, i) =>
              (lastIndex - i) % labelEvery === 0 ? (
                <text
                  key={`l-${d.fullLabel ?? d.label}`}
                  className={`chart__tick${i === lastIndex ? ' is-strong' : ''}`}
                  x={x(i)}
                  y={innerH + 18}
                  textAnchor="middle"
                >
                  {i === lastIndex ? 'Today' : d.label}
                </text>
              ) : null
            )}
            <line className="chart__axis" x1={0} x2={innerW} y1={innerH} y2={innerH} />
            {data.map((d, i) => (
              <rect
                key={`h-${d.fullLabel ?? d.label}`}
                className="chart__hit"
                x={x(i) - step / 2}
                y={0}
                width={step || innerW}
                height={innerH}
                tabIndex={0}
                role="img"
                aria-label={`${d.fullLabel ?? d.label}: ${formatValue(d.value)} ${seriesLabel}`}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
              />
            ))}
          </g>
        </svg>
      )}
      {activeItem && (
        <ChartTooltip
          x={MARGIN.left + x(active)}
          containerWidth={width}
          title={activeItem.fullLabel ?? activeItem.label}
          rows={[{ label: seriesLabel, color, value: formatValue(activeItem.value) }]}
        />
      )}
    </div>
  );
}
