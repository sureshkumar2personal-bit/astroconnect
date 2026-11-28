import { PERIODS } from '@/data/mockAnalytics.js';
import { analyticsActions } from '@/hooks/useAnalytics.js';
import { TODAY_DAY, isoOf } from '@/lib/analytics.js';

// Sticky period bar (spec 13, AD-146, ANL-03, ANL-07): Daily / Weekly / Monthly / Custom date range,
// always compared with the previous period; calendar days are IST.
export default function AnalyticsFilters({ s, P }) {
  const today = isoOf(TODAY_DAY);
  // The Start / End boxes always show the selected period's dates; editing either one switches to Custom.
  const custom = s.per === 'custom';
  const from = custom ? s.from : isoOf(P.s);
  const to = custom ? s.to : isoOf(P.e);
  return (
    <div className="fbar">
      <div className="fbar__in">
        <div className="fbar__l">
          <div className="seg" role="group" aria-label="Date range">
            {PERIODS.map(([id, label]) => (
              <button key={id} type="button" className={s.per === id ? 'on' : ''} aria-pressed={s.per === id} onClick={() => analyticsActions.set({ per: id })}>{label}</button>
            ))}
          </div>
          <div className="dates">
            <label>Start<input type="date" value={from} max={today} onChange={(e) => analyticsActions.set({ per: 'custom', from: e.target.value, to })} /></label>
            <label>End<input type="date" value={to} max={today} onChange={(e) => analyticsActions.set({ per: 'custom', from, to: e.target.value })} /></label>
          </div>
        </div>
        <div className="fbar__r">
          <div className="fbar__range">{P.label} <span>· {P.len === 1 ? '24 hourly points' : `${P.len} days · ${P.coarse.length} ${P.unit}s`}</span></div>
          <div className="fbar__cmp">Compared with the previous period ({P.prevLabel})</div>
          {P.err && <div className="fbar__err">{P.err}</div>}
        </div>
      </div>
    </div>
  );
}
