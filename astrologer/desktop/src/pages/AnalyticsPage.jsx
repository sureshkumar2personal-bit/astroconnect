import { Grid, KpiGrid, Sec } from '../components/section/kit.jsx';
import Metric from '../components/analytics/Metric.jsx';
import AnalyticsFilters from '../components/analytics/AnalyticsFilters.jsx';
import AnalyticsContent from '../components/analytics/AnalyticsContent.jsx';
import AnalyticsCharts from '../components/analytics/AnalyticsCharts.jsx';
import useAnalytics from '@shared/hooks/useAnalytics.js';
import useLive from '@shared/hooks/useLive.js';
import { isOpen } from '@shared/lib/textQuestions.js';
import { CHANGE as C, callChat, profilePerformance as pp } from '@shared/data/mockAnalytics.js';

// Analytics and Performance (spec 13_ANALYTICS_AND_PERFORMANCE.md). Route: #/analytics
// AD-145 metric groups, AD-146 KPI cards + graphs + period filter + previous-period comparison +
// drill-down to each service, AD-147 figures from the owning module (Text Questions, Appointments
// and Live are counted from their live state; "Answered/Completed" is one metric, AP-13-01).
export const meta = () => ({ title: 'Analytics', subtitle: 'Simple overview · figures match each module and Wallet' });

export default function AnalyticsPage({ ctx }) {
  const s = useAnalytics();
  const live = useLive();
  const qs = ctx.tq.questions;
  const apts = ctx.apt.list;
  const lastLive = live.past[0] || { parts: 0, comments: 0 };

  return (
    <>
      <AnalyticsFilters s={s} />

      <Sec title="Profile performance">
        <KpiGrid>
          <Metric label="Profile views" value={pp.views} pct={C.views} />
          <Metric label="Followers growth" value={pp.followers} pct={C.followers} />
          <Metric label="Subscribers growth" value={pp.subscribers} pct={C.subscribers} />
        </KpiGrid>
      </Sec>

      <Sec title="Text Questions">
        <KpiGrid>
          <Metric label="Received" value={qs.length} pct={C.tqReceived} href="/work/questions" />
          <Metric label="Answered / Completed" value={qs.filter((q) => q.answeredAt).length} pct={C.tqAnswered} href="/work/questions" />
          <Metric label="Pending" value={qs.filter(isOpen).length} pct={C.tqPending} href="/work/questions" />
        </KpiGrid>
        <span className="muted sm">Answered and Completed are one metric — never counted twice.</span>
      </Sec>

      <Sec title="Appointments">
        <KpiGrid>
          <Metric label="Bookings" value={apts.length} pct={C.aptBookings} href="/work/appointments" />
          <Metric label="Completed" value={apts.filter((a) => a.status === 'Completed').length} pct={C.aptCompleted} href="/work/appointments" />
          <Metric label="Cancelled" value={apts.filter((a) => a.status === 'Cancelled').length} pct={C.aptCancelled} href="/work/appointments" />
          <Metric label="Missed" value={apts.filter((a) => /Missed/.test(a.status)).length} pct={C.aptMissed} href="/work/appointments" />
        </KpiGrid>
      </Sec>

      <Sec title="Instant Call & Chat">
        <KpiGrid>
          <Metric label="Requests" value={callChat.requests} pct={C.callRequests} href="/calls" />
          <Metric label="Accepted" value={callChat.accepted} pct={C.callAccepted} href="/calls" />
          <Metric label="Declined" value={callChat.declined} pct={C.callDeclined} href="/calls" />
          <Metric label="Completed sessions" value={callChat.completed} pct={C.callCompleted} href="/calls" />
          <Metric label="Usage" value={callChat.usage} pct={C.callUsage} href="/calls" />
        </KpiGrid>
      </Sec>

      <Grid>
        <Sec title="Live">
          <KpiGrid>
            <Metric label="Live sessions" value={live.past.length} pct={C.liveSessions} href="/live" />
            <Metric label="Participants" value={lastLive.parts} pct={C.liveParts} href="/live" />
            <Metric label="Comments" value={lastLive.comments} pct={C.liveComments} href="/live" />
          </KpiGrid>
        </Sec>
        <AnalyticsContent />
      </Grid>

      <AnalyticsCharts />
    </>
  );
}
