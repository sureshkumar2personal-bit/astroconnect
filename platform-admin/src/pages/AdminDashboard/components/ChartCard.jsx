import { EmptyNote } from './Common.jsx';

// Section E — frame for one chart: title, subtitle, legend and empty state.
export default function ChartCard({ id, title, subtitle, legend, isEmpty, emptyText, footer, children, className = '' }) {
  return (
    <section className={`chart-card ${className}`} aria-labelledby={id}>
      <header className="chart-card__head">
        <div>
          <h3 id={id} className="chart-card__title">
            {title}
          </h3>
          {subtitle && <p className="chart-card__subtitle">{subtitle}</p>}
        </div>
        {legend && !isEmpty && legend}
      </header>
      {isEmpty ? <EmptyNote>{emptyText}</EmptyNote> : children}
      {footer && <div className="chart-card__foot">{footer}</div>}
    </section>
  );
}
