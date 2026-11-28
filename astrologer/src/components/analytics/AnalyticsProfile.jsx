import { useState } from 'react';
import { analyticsActions } from '@/hooks/useAnalytics.js';
import { profileValue } from '@/data/mockAnalytics.js';
import { chg, n, row } from '@/lib/analytics.js';
import { C, Detail, LineChart } from './AnalyticsCharts.jsx';
import { Stat } from './Metric.jsx';

// Profile performance (AD-145): Profile views, Followers gained, Subscribers gained. Tap a card to chart it;
// hover a point for its numbers, click it for the full breakdown. Day-by-day profile figures are an
// illustrative sample (data/mockAnalytics.js) until the profile module records them.
const PM = [
  { id: 'views', name: 'Profile views', plus: false, c: C.pri },
  { id: 'followers', name: 'Followers gained', plus: true, c: C.sec },
  { id: 'subs', name: 'Subscribers gained', plus: true, c: C.c4 },
];
const sgn = (m, v) => (m.plus && v > 0 ? '+' : '') + n(v);

export default function AnalyticsProfile({ s, P, cur: curCls = '' }) {
  const [hi, setHi] = useState(null);
  const [si, setSi] = useState(null);
  const cur = PM.find((m) => m.id === s.prof) || PM[0];
  const pv = (m, b) => profileValue(m.id, b);
  const main = P.fine.map((b) => pv(cur, b));
  const prev = P.fineP.map((b) => pv(cur, b));
  const unitF = P.per === 'daily' ? 'hour' : 'day';

  const tipAt = (i) => {
    const b = P.fine[i], bp = P.fineP[i]; const vv = PM.map((m) => pv(m, b));
    const cv = pv(cur, b), pvv = pv(cur, bp); const c = chg(cv, pvv);
    return {
      title: b.long,
      rows: [row('Profile views', n(vv[0]), C.pri), row('Followers gained', '+' + vv[1], C.sec), row('Subscribers gained', '+' + vv[2], C.c4),
        row(cur.name, sgn(cur, cv), null, 'strong sep'), row('Previous · ' + bp.label, sgn(cur, pvv)), row('Change', c.txt)],
      foot: c.calc,
    };
  };

  let detail = null;
  if (si != null && P.fine[si]) {
    const b = P.fine[si], bp = P.fineP[si];
    const vw = pv(PM[0], b), fl = pv(PM[1], b), sb = pv(PM[2], b);
    detail = (
      <Detail title={b.long} sub={'Compared with ' + bp.long} onClose={() => { setSi(null); setHi(null); }}>
        <div className="cards c3">
          {PM.map((m) => {
            const v = pv(m, b), p = pv(m, bp), t = pv(m, P.tot);
            return <Stat key={m.id} name={m.name} c={m.c} val={sgn(m, v)} chg={chg(v, p)} sub={'Previous ' + sgn(m, p) + ' · ' + (t ? (v / t * 100).toFixed(1) + '% of period total' : '—')} />;
          })}
        </div>
        <p className="foot">View-to-follow rate {vw ? (fl / vw * 100).toFixed(2) + '%' : '—'} · Followers who subscribed {fl ? (sb / fl * 100).toFixed(1) + '%' : '—'}</p>
      </Detail>
    );
  }

  return (
    <section className={'panel' + curCls} aria-labelledby="s-prof">
      <div className="sh"><h2 className="h2" id="s-prof">How your profile is growing</h2></div>
      <div className="cards c3" role="group" aria-label="Profile metric">
        {PM.map((m) => {
          const v = pv(m, P.tot), pr = pv(m, P.totP);
          return (
            <Stat key={m.id} name={m.name} c={m.c} val={sgn(m, v)} chg={chg(v, pr)} sub={'Previous ' + sgn(m, pr)} on={m.id === cur.id}
              onClick={() => { analyticsActions.set({ prof: m.id }); setHi(null); }} />
          );
        })}
      </div>
      <div className="block">
        <div className="bh">
          <h3 className="bt">{cur.name} per {unitF}</h3>
          <div className="mini-leg"><span><i style={{ background: cur.c }} />This period</span><span><i className="dash" />Previous period</span></div>
        </div>
        <LineChart H={240} main={main} prev={prev} color={cur.c} labels={P.fine} hi={hi} si={si} fmt={n} fill={0.1}
          aria={(i) => `${P.fine[i].long}: ${main[i]} ${cur.name.toLowerCase()}`}
          onHover={setHi} onClick={(i) => setSi((x) => (x === i ? null : i))} tipAt={tipAt} />
      </div>
      {detail}
    </section>
  );
}
