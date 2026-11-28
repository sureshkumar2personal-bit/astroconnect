import { useState } from 'react';
import { navigate } from '@/lib/router.js';
import { chg, dl, hm, inB, pct, r } from '@/lib/analytics.js';
import { C } from './AnalyticsCharts.jsx';
import Chg from './Metric.jsx';
import { DataTable, Disc, TableFoot, usePager } from './AnalyticsTable.jsx';

// Earnings summary (AD-145): gross revenue by service from the Earnings module's transactions (AD-147),
// before platform commission. Tap a service to filter the transactions. Net earnings, wallet balance and
// payouts stay in the Earnings module (View Earnings).
const ES = [
  { id: 'tq', name: 'Text Questions', c: C.pri },
  { id: 'ap', name: 'Appointments', c: C.sec },
  { id: 'call', name: 'Instant Call', c: C.c4 },
  { id: 'chat', name: 'Instant Chat', c: C.c3 },
];

export default function AnalyticsEarnings({ D, P, cur = '' }) {
  const [sel, setSel] = useState(null);
  const pg = usePager();
  const recs = (id, b) => inB(D.E, b).filter((x) => x.svc === id);
  const sum = (L) => L.reduce((a, x) => a + x.amt, 0);
  const eRec = ES.map((x) => recs(x.id, P.tot));
  const eTot = eRec.map(sum), eTotP = ES.map((x) => sum(recs(x.id, P.totP)));
  const all = eTot.reduce((a, b) => a + b, 0), allP = eTotP.reduce((a, b) => a + b, 0);
  const sv = sel ? ES.find((x) => x.id === sel) : null;
  const tx = [];
  ES.forEach((x, j) => { if (!sel || sel === x.id) eRec[j].forEach((t) => tx.push({ t, x })); });
  tx.sort((a, b) => b.t.day - a.t.day || b.t.hour - a.t.hour || b.t.min - a.t.min);
  const pick = (id) => { setSel((v) => (v === id ? null : id)); pg.reset(); };

  return (
    <section className={'panel' + cur} aria-labelledby="s-e">
      <div className="sh"><h2 className="h2" id="s-e">Gross revenue by service</h2></div>
      <div className="etot">
        <div>
          <div className="l">Total gross revenue</div>
          <div className="v num">{r(all)}</div>
          <div className="srow"><Chg c={chg(all, allP, false, r)} /><span className="ss">Previous period {r(allP)} · before platform commission</span></div>
        </div>
        <button type="button" className="vearn" onClick={() => navigate('/earnings')}>View Earnings <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg></button>
      </div>
      <h3 className="bt bt-gap">Revenue by service</h3>
      <div>
        {ES.map((x, j) => {
          const on = sel === x.id, k = eRec[j].length;
          return (
            <button key={x.id} type="button" className={'erow' + (on ? ' on' : '')} aria-pressed={on} onClick={() => pick(x.id)}>
              <span className="nm"><span className="nm-t"><i className="sw" style={{ background: x.c }} />{x.name}</span><small>{k} transactions · avg {k ? r(eTot[j] / k) : '—'} · prev {r(eTotP[j])}</small></span>
              <span className="pbar pbar--10"><span style={{ width: (all ? eTot[j] / all * 100 : 0).toFixed(1) + '%', background: x.c }} /></span>
              <span className="num ev">{r(eTot[j])}</span>
              <span className="num muted ep">{pct(eTot[j], all)}</span>
              <span className="ec"><Chg c={chg(eTot[j], eTotP[j], false, r)} /></span>
            </button>
          );
        })}
      </div>
      <div className="block">
        <div className="tools">
          <div><h3 className="bt">Recent transactions</h3><p className="bs">{(sv ? sv.name : 'All services') + ' · ' + P.label}</p></div>
          {sv && <button type="button" className="xbtn" onClick={() => { setSel(null); pg.reset(); }}>All services <span aria-hidden="true">×</span></button>}
        </div>
        {tx.length ? (
          <>
            <DataTable cols={['Date', 'Client', 'Service', 'Item', ['Gross', 'r']]}
              rows={tx.slice(0, pg.lim).map(({ t, x }) => ({ key: t.id, cells: [[dl(t.day) + ', ' + hm(t.hour, t.min), 'num'], <b key="w">{t.who}</b>, <span key="s" className="svc"><i className="sw" style={{ background: x.c }} />{x.name}</span>, [t.what, 'muted'], [<b key="a">{r(t.amt)}</b>, 'r num']] }))} />
            <TableFoot shown={pg.lim} total={tx.length} noun="transactions" onMore={pg.more} />
          </>
        ) : <div className="empty">No transactions {P.word}.</div>}
      </div>
      <Disc label={'revenue by ' + P.unit}>
        <DataTable tall cols={[P.unit === 'hour' ? 'Hour' : P.unit === 'week' ? 'Week' : 'Day', ['Text Questions', 'r'], ['Appointments', 'r'], ['Instant Call', 'r'], ['Instant Chat', 'r'], ['Total', 'r'], ['Previous total', 'r']]}
          rows={P.coarse.map((b, i) => {
            const v = ES.map((x) => sum(recs(x.id, b))); const pv = ES.reduce((a, x) => a + sum(recs(x.id, P.coarseP[i])), 0);
            return { key: i, cells: [b.long, [r(v[0]), 'r num'], [r(v[1]), 'r num'], [r(v[2]), 'r num'], [r(v[3]), 'r num'], [<b key="t">{r(v.reduce((a, y) => a + y, 0))}</b>, 'r num'], [r(pv), 'r num muted']] };
          })} />
      </Disc>
      <p className="muted enote">Amounts here are gross. Platform commission, net earnings, wallet balance and payouts live in the Earnings module.</p>
    </section>
  );
}
