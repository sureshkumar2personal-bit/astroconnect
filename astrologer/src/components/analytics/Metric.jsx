import { Kpi } from '@/components/ui/sectionKit.jsx';

// KPI card with the Previous Period Comparison line (spec 13, AD-146 — reference `kpi` + `chg`).
// `href` (hash path) opens the service's own page (drill-down, AD-146).
export const Change = ({ pct }) => (pct >= 0
  ? <span className="up">▲ +{pct}% vs previous</span>
  : <span className="down">▼ {pct}% vs previous</span>);

export default function Metric({ label, value, pct, href }) {
  return <Kpi label={label} value={value} sub={<Change pct={pct} />} href={href} />;
}
