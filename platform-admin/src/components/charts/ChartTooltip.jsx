// Tooltip shown for the hovered or focused chart column.
export default function ChartTooltip({ x, containerWidth, title, rows, total }) {
  // Keep the tooltip inside the chart: anchor left/right near the edges.
  let transform = 'translateX(-50%)';
  if (x < 90) transform = 'translateX(-12px)';
  else if (x > containerWidth - 90) transform = 'translateX(calc(-100% + 12px))';

  return (
    <div className="chart-tooltip" style={{ left: x, transform }} aria-hidden="true">
      <div className="chart-tooltip__title">{title}</div>
      {rows.map((row) => (
        <div key={row.label} className="chart-tooltip__row">
          <span className="chart-swatch" style={{ background: row.color }} />
          <span className="chart-tooltip__label">{row.label}</span>
          <span className="chart-tooltip__value">{row.value}</span>
        </div>
      ))}
      {total && (
        <div className="chart-tooltip__row chart-tooltip__total">
          <span className="chart-tooltip__label">{total.label}</span>
          <span className="chart-tooltip__value">{total.value}</span>
        </div>
      )}
    </div>
  );
}
