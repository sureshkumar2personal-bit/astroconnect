import { useState } from 'react';
import { chg, dl, hm, inB, n, r } from '@/lib/analytics.js';
import { C } from './AnalyticsCharts.jsx';
import { Stat, prevTxt } from './Metric.jsx';
import { Breakdown, DataTable, Disc, Pill, SLAB, TableFoot, usePager } from './AnalyticsTable.jsx';

// Appointments (AD-145): totals by status (Confirmed / Under Review slots stay "Upcoming" until they happen),
// the status breakdown, appointment records filtered by status (or by a day picked in the breakdown table)
// and bookings by day. The Appointments module keeps no separate booking date, so records are counted by
// appointment date and "Booked on" shows "—".
const AS = [['completed', 'Completed', C.pri, false], ['upcoming', 'Upcoming / confirmed', C.sec, false], ['cancelled', 'Cancelled', C.sand, true], ['missed', 'Missed', C.red, true]];
const cnt = (L, s) => L.filter((x) => x.status === s).length;

export default function AnalyticsAppointments({ D, P, cur = '' }) {
  const [st, setSt] = useState(null);
  const [bi, setBi] = useState(null);
  const pg = usePager();
  const aL = inB(D.A, P.tot), aLP = inB(D.A, P.totP);
  const raw = AS.map(([id, label, c, inv]) => ({ id, label, c, n: cnt(aL, id), p: cnt(aLP, id), chg: chg(cnt(aL, id), cnt(aLP, id), inv) }));
  const aB = P.coarse.map((b) => inB(D.A, b)), aBP = P.coarseP.map((b) => inB(D.A, b).length);
  const bSel = bi != null && P.coarse[bi] ? bi : null;
  const base = bSel != null ? aB[bSel] : aL;
  const list = (st ? base.filter((x) => x.status === st) : base).slice().reverse();
  const pickSt = (id) => { setSt(id); pg.reset(); };
  const chips = [['all', 'All'], ...AS.map((a) => [a[0], a[1].replace(' / confirmed', '')])];

  return (
    <section className={'panel' + cur} aria-labelledby="s-a">
      <div className="sh"><h2 className="h2" id="s-a">Bookings and their status</h2></div>
      <div className="cards">
        <Stat name="Total appointments" val={n(aL.length)} chg={chg(aL.length, aLP.length)} sub={prevTxt(aLP.length)} />
        <Stat name="Completed" c={C.pri} val={n(raw[0].n)} chg={raw[0].chg} sub={prevTxt(raw[0].p)} />
        <Stat name="Upcoming" c={C.sec} val={n(raw[1].n)} chg={raw[1].chg} sub={prevTxt(raw[1].p)} />
        <Stat name="Cancelled" c={C.sand} val={n(raw[2].n)} chg={raw[2].chg} sub={prevTxt(raw[2].p)} />
      </div>
      <div className="block">
        <h3 className="bt">Status breakdown</h3>
        <Breakdown segs={raw} total={aL.length} sel={st} onPick={(id) => pickSt(st === id ? null : id)} />
      </div>
      <div className="block">
        <div className="tools">
          <div><h3 className="bt">Appointment records</h3><p className="bs">{bSel != null ? P.coarse[bSel].long : P.label}</p></div>
          <div className="tools-r">
            <div className="chips" role="group" aria-label="Appointment status">
              {chips.map(([id, label]) => {
                const on = (st || 'all') === id;
                return <button key={id} type="button" className={on ? 'on' : ''} aria-pressed={on} onClick={() => pickSt(id === 'all' ? null : id)}>{label} <small>{id === 'all' ? base.length : cnt(base, id)}</small></button>;
              })}
            </div>
            {bSel != null && <button type="button" className="xbtn" onClick={() => { setBi(null); pg.reset(); }}>Show whole period <span aria-hidden="true">×</span></button>}
          </div>
        </div>
        {list.length ? (
          <>
            <DataTable cols={['Customer', 'Booking', 'Booked on', 'Appointment date', 'Consultation', ['Fee (gross)', 'r'], 'Status']}
              rows={list.slice(0, pg.lim).map((x) => ({ key: x.id, cells: [<b key="c">{x.client}</b>, [x.id, 'muted num'], ['—', 'num muted'], [dl(x.day) + ', ' + hm(x.hour, x.min), 'num'], `${x.dur}-min voice consultation`, [r(x.fee), 'r num'], <Pill key="p" s={x.status} label={SLAB[x.status]} />] }))} />
            <TableFoot shown={pg.lim} total={list.length} noun="appointments" onMore={pg.more} />
          </>
        ) : <div className="empty">No {st ? SLAB[st].toLowerCase() + ' ' : ''}appointments {bSel != null ? 'on this ' + P.unit : P.word}.</div>}
      </div>
      <Disc label={'bookings by ' + P.unit}>
        <DataTable tall cols={[P.unit === 'hour' ? 'Hour' : P.unit === 'week' ? 'Week' : 'Day', ['Bookings', 'r'], ['Previous', 'r'], ['Change', 'r'], ['Completed', 'r'], ['Upcoming', 'r'], ['Cancelled', 'r'], ['Missed', 'r']]}
          rows={P.coarse.map((b, i) => {
            const L = aB[i];
            return {
              key: i, cls: bSel === i ? 'on' : '',
              cells: [<button key="b" type="button" className="linkb" onClick={() => { setBi(bSel === i ? null : i); pg.reset(); }}>{b.long}</button>,
                [<b key="n">{L.length}</b>, 'r num'], [aBP[i], 'r num muted'], [<span key="c" className={chg(L.length, aBP[i]).cls}>{chg(L.length, aBP[i]).txt}</span>, 'r'],
                [cnt(L, 'completed'), 'r num'], [cnt(L, 'upcoming'), 'r num'], [cnt(L, 'cancelled'), 'r num'], [cnt(L, 'missed'), 'r num']],
            };
          })} />
      </Disc>
    </section>
  );
}
