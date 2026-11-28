import Icon from '../../../components/icons.jsx';
import { href } from '../../../router/useHashRoute.js';

// Section B — one clickable KPI. `children` holds the figure(s).
export default function KpiCard({ label, path, caption, children, className = '' }) {
  return (
    <a className={`kpi ${className}`} href={href(path)}>
      <span className="kpi__label">
        {label}
        <Icon name="chevronRight" size={16} className="kpi__arrow" />
      </span>
      <span className="kpi__value">{children}</span>
      {caption && <span className="kpi__caption">{caption}</span>}
    </a>
  );
}
