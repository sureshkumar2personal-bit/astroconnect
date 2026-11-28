import { useState } from 'react';
import { analyticsActions } from '@/hooks/useAnalytics.js';
import { HIDDEN_CHG, chg, dl, hm, inB, n, pct, r, row } from '@/lib/analytics.js';
import { BarChart, C } from './AnalyticsCharts.jsx';
import Chg, { Stat, prevTxt } from './Metric.jsx';
import { DataTable, Pill, SLAB, TableFoot, usePager } from './AnalyticsTable.jsx';

// Instant Call & Chat (AD-145): one record per request in the call history. Accepted requests start a
// session; a completed session is an accepted one that ran. Hover a day for its numbers; click it to list
// that day's requests. All / Instant Call / Instant Chat filters the cards, chart and request table.
const SV = [['call', 'Instant Call', C.c4], ['chat', 'Instant Chat', C.c3]];
const stat = (L, f) => {
  const X = f === 'all' ? L : L.filter((x) => x.svc === f);
  return { req: X.length, acc: X.filter((x) => x.out === 'accepted').length, dec: X.filter((x) => x.out === 'declined').length, nr: X.filter((x) => x.out === 'noresp').length, done: X.filter((x) => x.done).length, mins: X.reduce((a, x) => a + x.mins, 0), gross: X.reduce((a, x) => a + x.gross, 0) };
};

export default function AnalyticsCalls({ D, P, s, cur = '' }) {
  const [hi, setHi] = useState(null);
  const [si, setSi] = useState(null);
  const pg = usePager();
  const f = s.svc || 'all';
  const iL = inB(D.I, P.tot), iLP = inB(D.I, P.totP);
  const IC = stat(iL, f), IP = stat(iLP, f);
  const show = SV.filter((x) => f === 'all' || f === x[0]);
  const iB = P.coarse.map((b) => { const L = inB(D.I, b); return { L, call: stat(L, 'call'), chat: stat(L, 'chat') }; });
  const iBP = P.coarseP.map((b) => { const L = inB(D.I, b); return { call: stat(L, 'call'), chat: stat(L, 'chat') }; });
  const sSel = si != null && P.coarse[si] ? si : null;
  const svcName = f === 'call' ? 'Instant Call' : 'Instant Chat';

  const tipAt = (i) => {
    const b = P.coarse[i], x = iB[i], all = stat(x.L, f);
    const prevReq = f === 'all' ? iBP[i].call.req + iBP[i].chat.req : iBP[i][f].req; const c = chg(all.req, prevReq);
    return {
      title: b.long + (f === 'all' ? '' : ' · ' + svcName),
      rows: [...show.map((v) => row(v[1], `${x[v[0]].req} req · ${x[v[0]].acc} acc · ${x[v[0]].dec} dec · ${x[v[0]].mins} min`, v[2])),
        row('Completed sessions', all.done, null, 'sep'), row('Acceptance rate', pct(all.acc, all.req)), row('Usage', all.mins + ' min'), row('Requests, previous', prevReq), row('Change', c.txt)],
      foot: 'Acceptance rate = accepted ÷ requests × 100',
    };
  };

  const acc = (name, x, c) => ({ name, c, rate: pct(x.acc, x.req), w: (x.req ? x.acc / x.req * 100 : 0).toFixed(1) + '%', note: `${x.acc} of ${x.req} accepted · ${x.dec} declined · ${x.nr} not responded · ${x.done} completed (${pct(x.done, x.acc)} of accepted)` });
  const accs = [...(f === 'all' ? [acc('All requests', IC, C.pri)] : []), ...show.map((v) => acc(v[1], stat(iL, v[0]), v[2]))];
  const sC = stat(iL, 'call'), sH = stat(iL, 'chat'), pC = stat(iLP, 'call'), pH = stat(iLP, 'chat');
  const avg = (x) => (x.done ? (x.mins / x.done).toFixed(1) + ' min' : '—');
  const cmp = [['Requests', 'req', false], ['Accepted', 'acc', false], ['Declined', 'dec', true], ['Not responded', 'nr', true], ['Completed sessions', 'done', false], ['Usage (min)', 'mins', false]]
    .map(([k, fl, inv]) => ({ k, a: n(sC[fl]), b: n(sH[fl]), ac: chg(sC[fl], pC[fl], inv), bc: chg(sH[fl], pH[fl], inv) }))
    .concat([
      { k: 'Acceptance rate', a: pct(sC.acc, sC.req), b: pct(sH.acc, sH.req), ac: HIDDEN_CHG, bc: HIDDEN_CHG },
      { k: 'Average session', a: avg(sC), b: avg(sH), ac: HIDDEN_CHG, bc: HIDDEN_CHG },
      { k: 'Gross', a: r(sC.gross), b: r(sH.gross), ac: chg(sC.gross, pC.gross, false, r), bc: chg(sH.gross, pH.gross, false, r) },
    ]);
  const base = sSel != null ? iB[sSel].L : iL;
  const list = (f === 'all' ? base : base.filter((x) => x.svc === f)).slice().reverse();

  return (
    <section className={'panel' + cur} aria-labelledby="s-i">
      <div className="sh">
        <h2 className="h2" id="s-i">On-demand sessions</h2>
        <div className="seg light" role="group" aria-label="Service">
          {[['all', 'All'], ['call', 'Instant Call'], ['chat', 'Instant Chat']].map(([id, label]) => (
            <button key={id} type="button" className={f === id ? 'on' : ''} aria-pressed={f === id} onClick={() => { analyticsActions.set({ svc: id }); setHi(null); pg.reset(); }}>{label}</button>
          ))}
        </div>
      </div>
      <div className="cards c5">
        <Stat name="Total requests" val={n(IC.req)} chg={chg(IC.req, IP.req)} sub={prevTxt(IP.req)} />
        <Stat name="Accepted" val={n(IC.acc)} chg={chg(IC.acc, IP.acc)} sub={pct(IC.acc, IC.req) + ' acceptance'} />
        <Stat name="Declined" val={n(IC.dec)} chg={chg(IC.dec, IP.dec, true)} sub={pct(IC.dec, IC.req) + ' of requests'} />
        <Stat name="Completed sessions" val={n(IC.done)} chg={chg(IC.done, IP.done)} sub={pct(IC.done, IC.acc) + ' of accepted'} />
        <Stat name="Total usage time" val={n(IC.mins) + ' min'} chg={chg(IC.mins, IP.mins)} sub={(IC.mins / 60).toFixed(1) + ' hours'} />
      </div>
      <div className="block g2 wide">
        <div>
          <div className="bh">
            <h3 className="bt">{f === 'all' ? `Requests per ${P.unit}: Call vs Chat` : `${svcName} requests per ${P.unit}`}</h3>
            <div className="mini-leg">{show.map((v) => <span key={v[0]}><i className="sq" style={{ background: v[2] }} />{v[1]} requests</span>)}</div>
          </div>
          <BarChart H={220} fmt={n} hi={hi} si={sSel} minPer={f === 'all' ? 44 : 30} maxLabels={14}
            groups={P.coarse.map((b, i) => ({ label: b.label, aria: b.long + ': ' + show.map((v) => iB[i][v[0]].req + ' ' + v[1] + ' requests').join(', '), vals: show.map((v) => ({ v: iB[i][v[0]].req, c: v[2] })) }))}
            onHover={setHi} onClick={(i) => { setSi((x) => (x === i ? null : i)); pg.reset(); }} tipAt={tipAt} />
        </div>
        <div>
          <h3 className="bt">Acceptance rate</h3>
          <div className="acc">
            {accs.map((a) => (
              <div key={a.name}>
                <div className="al"><span className="al-n"><i className="sw" style={{ background: a.c }} />{a.name}</span><b className="num">{a.rate}</b></div>
                <div className="pbar"><span style={{ width: a.w, background: a.c }} /></div>
                <div className="acc-n">{a.note}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="block">
        <h3 className="bt bt-gap">Instant Call vs Instant Chat</h3>
        <DataTable cmp cols={['Metric', ['Instant Call', 'r'], ['Change', 'r'], ['Instant Chat', 'r'], ['Change', 'r']]}
          rows={cmp.map((m) => ({ key: m.k, cells: [m.k, [<b key="a">{m.a}</b>, 'r num'], [<Chg key="ac" c={m.ac} />, 'r'], [<b key="b">{m.b}</b>, 'r num'], [<Chg key="bc" c={m.bc} />, 'r']] }))} />
      </div>
      <div className="block">
        <div className="tools">
          <div><h3 className="bt">Request details</h3><p className="bs">{(sSel != null ? P.coarse[sSel].long : P.label) + ' · ' + (f === 'all' ? 'both services' : svcName)}</p></div>
          {sSel != null && <button type="button" className="xbtn" onClick={() => { setSi(null); pg.reset(); }}>Show whole period <span aria-hidden="true">×</span></button>}
        </div>
        {list.length ? (
          <>
            <DataTable cols={['Request', 'Service', 'Client', 'Time', 'Outcome', ['Minutes', 'r'], ['Gross', 'r']]}
              rows={list.slice(0, pg.lim).map((x) => ({
                key: x.id,
                cells: [[x.id, 'muted num'], <span key="s" className="svc"><i className="sw" style={{ background: x.svc === 'call' ? C.c4 : C.c3 }} />{x.svc === 'call' ? 'Instant Call' : 'Instant Chat'}</span>,
                  <b key="c">{x.client}</b>, [dl(x.day) + ', ' + hm(x.hour, x.min), 'num'], <Pill key="o" s={x.out} label={SLAB[x.out]} />, [x.mins ? x.mins + ' min' : '—', 'r num'], [x.gross ? r(x.gross) : '—', 'r num']],
              }))} />
            <TableFoot shown={pg.lim} total={list.length} noun="requests" onMore={pg.more} />
          </>
        ) : <div className="empty">No requests {sSel != null ? 'in this ' + P.unit : P.word}.</div>}
      </div>
    </section>
  );
}
