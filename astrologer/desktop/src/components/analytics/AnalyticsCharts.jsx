import { Bars, Grid, Sec } from '../section/kit.jsx';
import { earningsSummary, growthTrend } from '@shared/data/mockAnalytics.js';

// Growth & trends and the service-wise Earnings summary (spec 13, AD-145, ANL-02).
// Earnings are an overview only — transactions stay in Wallet.
export default function AnalyticsCharts() {
  return (
    <Grid>
      <Sec title="Growth & trends">
        <Bars values={growthTrend.values} labels={growthTrend.labels} />
        <span className="muted sm">Questions + bookings per day this week</span>
      </Sec>
      <Sec title="Earnings summary">
        <Bars values={earningsSummary.values} labels={earningsSummary.labels} />
        <span className="muted sm">Gross revenue in ₹ thousands, this month. Details are in <a href="#/earnings">Wallet</a>.</span>
      </Sec>
    </Grid>
  );
}
