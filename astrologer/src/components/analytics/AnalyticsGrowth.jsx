import { useState } from 'react';
import { analyticsActions } from '@/hooks/useAnalytics.js';
import { chg, inB, n, pct, row } from '@/lib/analytics.js';
import { C, Detail, MultiLine } from './AnalyticsCharts.jsx';
import Chg, { Stat, prevTxt } from './Metric.jsx';

// Growth & Trends (AD-145): Text Questions, Appointments, Instant Calls and Instant Chats per day (per hour
// for Daily, per week for long ranges). Tap a category card to show or hide it; hover a point for its
// numbers, click it for the breakdown.
const GS = [
  { id: 'tq', name: 'Text Questions', c: C.pri, f: (D, b) => inB(D.Q, b).length },
  { id: 'ap', name: 'Appointments', c: C.sec, f: (D, b) => inB(D.A, b).length },
  { id: 'call', name: 'Instant Calls', c: C.c4, f: (D, b) => inB(D.I, b).filter((x) => x.svc === 'call').length },
  { id: 'chat', name: 'Instant Chats', c: C.c3, f: (D, b) => inB(D.I, b).filter((x) => x.svc === 'chat').length },
];

export default function AnalyticsGrowth({ D, P, s, cur = '' }) {
  const [hi, setHi] = useState(null);
  const [si, setSi] = useState(null);
  const hid = s.hidden || {};
  const vis = GS.filter((g) => !hid[g.id]);
  const gM = P.coarse.map((b) => GS.map((g) => g.f(D, b))), gMP = P.coarseP.map((b) => GS.map((g) => g.f(D, b)));
  const visSum = (rw) => GS.reduce((a, g, j) => a + (hid[g.id] ? 0 : rw[j]), 0);
  const tot = gM.reduce((a, rw) => a + visSum(rw), 0), totP = gMP.reduce((a, rw) => a + visSum(rw), 0);

  const tipAt = (i) => {
    const rw = gM[i], rp = gMP[i];
    const rows = vis.map((g) => { const j = GS.indexOf(g); const c = chg(rw[j], rp[j]); return row(g.name, `${rw[j]}  (prev ${rp[j]}, ${c.txt.replace('↑ ', '').replace('↓ ', '')})`, g.c); });
    const t = visSum(rw), tp = visSum(rp), c = chg(t, tp);
    const hiddenNames = GS.filter((g) => hid[g.id]).map((g) => g.name);
    return { title: P.coarse[i].long, rows: [...rows, row('Total activity', t, null, 'strong sep'), row('Previous · ' + P.coarseP[i].long, tp), row('Change', c.txt)], foot: hiddenNames.length ? 'Hidden categories excluded: ' + hiddenNames.join(', ') : c.calc };
  };

  let detail = null;
  if (si != null && P.coarse[si] && vis.length) {
    const rw = gM[si], rp = gMP[si], t = visSum(rw);
    detail = (
      <Detail title={'Activity breakdown · ' + P.coarse[si].long} sub={`${t} activities · previous ${visSum(rp)}`} onClose={() => setSi(null)}>
        {vis.map((g) => {
          const j = GS.indexOf(g);
          return (
            <div key={g.id} className="share">
              <span className="share-n"><i className="sw" style={{ background: g.c }} />{g.name}</span>
              <span className="pbar pbar--10"><span style={{ width: (t ? rw[j] / t * 100 : 0).toFixed(1) + '%', background: g.c }} /></span>
              <span className="num share-v">{rw[j]}</span>
              <span className="num muted share-p">{pct(rw[j], t)}</span>
              <span className="hs share-c">Previous {rp[j]} <Chg c={chg(rw[j], rp[j])} /></span>
            </div>
          );
        })}
      </Detail>
    );
  }

  return (
    <section className={'panel' + cur} aria-labelledby="s-g">
      <div className="sh"><h2 className="h2" id="s-g">Activity over time</h2></div>
      <div className="cards c5">
        <Stat hero name="Total activity" val={n(tot)} chg={chg(tot, totP)} sub={(vis.length < 4 ? 'Shown categories · ' : '') + prevTxt(totP)} />
        {GS.map((g, j) => {
          const t = gM.reduce((a, rw) => a + rw[j], 0), tp = gMP.reduce((a, rw) => a + rw[j], 0); const off = !!hid[g.id];
          return <Stat key={g.id} name={g.name} c={g.c} val={n(t)} chg={chg(t, tp)} sub={off ? 'Hidden · tap to show' : prevTxt(tp)} off={off} onClick={() => { analyticsActions.toggleSeries(g.id); setHi(null); }} />;
        })}
      </div>
      <div className="block">
        <div className="bh">
          <h3 className="bt">Activity per {P.unit}</h3>
          <div className="mini-leg">{vis.map((g) => <span key={g.id}><i style={{ background: g.c }} />{g.name}</span>)}</div>
        </div>
        {!vis.length ? <div className="empty">All categories are hidden. Turn one on above to see activity.</div> : (
          <MultiLine H={260} labels={P.coarse} fmt={n} hi={hi} si={si} maxLabels={12}
            series={vis.map((g) => ({ c: g.c, vals: gM.map((rw) => rw[GS.indexOf(g)]) }))}
            aria={(i) => `${P.coarse[i].long}: ${visSum(gM[i])} activities`}
            onHover={setHi} onClick={(i) => setSi((x) => (x === i ? null : i))} tipAt={tipAt} />
        )}
      </div>
      {detail}
    </section>
  );
}
