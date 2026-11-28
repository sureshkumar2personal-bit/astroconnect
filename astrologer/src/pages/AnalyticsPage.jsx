import { useMemo } from 'react';
import useAnalytics, { analyticsActions } from '@/hooks/useAnalytics.js';
import useCalls from '@/hooks/useCalls.js';
import useLive from '@/hooks/useLive.js';
import useContent from '@/hooks/useContent.js';
import useEarnings from '@/hooks/useEarnings.js';
import { buildRecords, period } from '@/lib/analytics.js';
import AnalyticsFilters from '@/components/analytics/AnalyticsFilters.jsx';
import AnalyticsProfile from '@/components/analytics/AnalyticsProfile.jsx';
import AnalyticsQuestions from '@/components/analytics/AnalyticsQuestions.jsx';
import AnalyticsAppointments from '@/components/analytics/AnalyticsAppointments.jsx';
import AnalyticsCalls from '@/components/analytics/AnalyticsCalls.jsx';
import AnalyticsLive from '@/components/analytics/AnalyticsLive.jsx';
import AnalyticsContent from '@/components/analytics/AnalyticsContent.jsx';
import AnalyticsGrowth from '@/components/analytics/AnalyticsGrowth.jsx';
import AnalyticsEarnings from '@/components/analytics/AnalyticsEarnings.jsx';

// Analytics and Performance (spec 13_ANALYTICS_AND_PERFORMANCE.md, AD-145 – AD-147), laid out as the
// reference "AstroConnect · Astrologer Analytics" (simplified dashboard + mobile): sticky period bar,
// then eight sections. On a phone, section tabs show one section at a time. Route: #/analytics.
// Figures are counted from each module's own records (AD-147); see lib/analytics.js and data/mockAnalytics.js.
export const meta = () => ({ title: 'Analytics', parent: '/' });

const SECS = [['prof', 'Profile'], ['q', 'Questions'], ['a', 'Appointments'], ['i', 'Instant Call & Chat'], ['l', 'Live'], ['c', 'Content'], ['g', 'Growth'], ['e', 'Earnings']];

export default function AnalyticsPage({ ctx }) {
  const s = useAnalytics();
  const { hist } = useCalls();
  const { past } = useLive();
  const { posts } = useContent();
  const { tx } = useEarnings();
  const D = useMemo(
    () => buildRecords({ questions: ctx.tq.questions, apts: ctx.apt.list, hist, past, posts, tx }),
    [ctx.tq.questions, ctx.apt.list, hist, past, posts, tx],
  );
  const P = useMemo(() => period(s.per, s.from, s.to), [s.per, s.from, s.to]);
  // A new period starts every section with nothing hovered or opened (as in the reference).
  const key = `${P.s}:${P.e}:${s.per}`;
  const sec = s.sec || 'prof';
  const cur = (id) => (sec === id ? ' is-cur' : '');

  return (
    <div className="an">
      <AnalyticsFilters s={s} P={P} />
      <nav className="stabs" aria-label="Analytics sections">
        {SECS.map(([id, label]) => (
          <button key={id} type="button" className={sec === id ? 'on' : ''} aria-pressed={sec === id} onClick={() => analyticsActions.set({ sec: id })}>{label}</button>
        ))}
      </nav>
      <div className="an-main">
        <AnalyticsProfile key={'p' + key} s={s} P={P} cur={cur('prof')} />
        <AnalyticsQuestions key={'q' + key} D={D} P={P} cur={cur('q')} />
        <AnalyticsAppointments key={'a' + key} D={D} P={P} cur={cur('a')} />
        <AnalyticsCalls key={'i' + key} D={D} P={P} s={s} cur={cur('i')} />
        <AnalyticsLive key={'l' + key} D={D} P={P} cur={cur('l')} />
        <AnalyticsContent key={'c' + key} D={D} P={P} s={s} cur={cur('c')} />
        <AnalyticsGrowth key={'g' + key} D={D} P={P} s={s} cur={cur('g')} />
        <AnalyticsEarnings key={'e' + key} D={D} P={P} cur={cur('e')} />
      </div>
    </div>
  );
}
