import { Empty, Kpi, KpiGrid, Note } from '../section/kit.jsx';

// Post-Live summary (AD-119): duration, participants, comments.
export default function LiveSummary({ last }) {
  if (!last) return <Empty title="No Live has ended yet." />;
  return (
    <>
      <KpiGrid>
        <Kpi label="Duration" value={last.dur} />
        <Kpi label="Participants" value={last.parts} />
        <Kpi label="Comments" value={last.comments} />
      </KpiGrid>
      {last.auto && <Note tone="bad">The Live ended automatically because it stayed paused for 5 minutes.</Note>}
      <p className="muted sm">No participant capacity limits. No recording or replay is available.</p>
      <a className="btn btn-p live-back" href="#/live">Back to Live</a>
    </>
  );
}
