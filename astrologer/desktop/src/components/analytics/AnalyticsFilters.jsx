import { Seg } from '../section/kit.jsx';
import { PERIODS } from '@shared/data/mockAnalytics.js';
import { analyticsActions } from '@shared/hooks/useAnalytics.js';

// Period filter (spec 13, AD-146, ANL-03, ANL-07): Daily / Weekly / Monthly / Custom date range,
// always compared with the previous period; calendar days are IST.
export default function AnalyticsFilters({ s }) {
  return (
    <div className="row wrap an-filters">
      <Seg label="Period" options={PERIODS} value={s.per} onChange={analyticsActions.setPeriod} />
      {s.per === 'Custom' && (
        <span className="row an-range">
          <label className="sr" htmlFor="an-from">From</label>
          <input id="an-from" type="date" value={s.from} max={s.to} onChange={(e) => analyticsActions.setRange({ from: e.target.value })} />
          <span>to</span>
          <label className="sr" htmlFor="an-to">To</label>
          <input id="an-to" type="date" value={s.to} min={s.from} onChange={(e) => analyticsActions.setRange({ to: e.target.value })} />
        </span>
      )}
      <span className="muted sm">Compared with the previous period · IST days</span>
    </div>
  );
}
