import { useState } from 'react';
import { liveWindows } from '@/data/mockAnalytics.js';
import { chg, dl, hm, inB, n, row, wd, dateOf } from '@/lib/analytics.js';
import { C, LineChart } from './AnalyticsCharts.jsx';
import Chg, { Stat, prevTxt } from './Metric.jsx';
import RowChevron from '@/components/ui/RowChevron.jsx';

// Live sessions (AD-145): sessions, participants, comments and peak viewers from the Live module's past
// sessions. Select a session (row toggle, same ▶/▼ chevron as the rest of the app) to see how viewers joined
// and commented through it; viewers per 5-minute window are an illustrative sample (data/mockAnalytics.js).
export default function AnalyticsLive({ D, P, cur = '' }) {
  const [open, setOpen] = useState(null);
  const [hi, setHi] = useState(null);
  const lL = inB(D.L, P.tot), lLP = inB(D.L, P.totP);
  const W = (x) => liveWindows({ ...x, day: x.day });
  const peakOf = (x) => x.peak || Math.max(0, ...W(x).viewers);
  const sum = (L, f) => L.reduce((a, x) => a + x[f], 0);
  const lPeak = (L) => (L.length ? Math.max(...L.map(peakOf)) : 0);
  const when = (x) => wd(x.day) + ', ' + dl(x.day) + ' · ' + hm(x.hour, x.min);
  const toggle = (id) => { setOpen((v) => (v === id ? null : id)); setHi(null); };

  const detail = (x) => {
    const { viewers, cm } = W(x);
    const end = (k) => { const t = x.hour * 60 + x.min + k * 5; return hm(Math.floor(t / 60) % 24, t % 60); };
    const tl = viewers.map((_, k) => ({ label: end(k), long: end(k) + '–' + end(k + 1) }));
    const prevS = D.L.filter((y) => y.day < x.day).sort((a, b) => a.day - b.day).pop();
    const avgV = Math.round(viewers.reduce((a, b) => a + b, 0) / Math.max(1, viewers.length));
    const stats = [['Participants', n(x.participants), chg(x.participants, prevS ? prevS.participants : null)], ['Comments', n(x.comments), chg(x.comments, prevS ? prevS.comments : null)],
      ['Peak viewers', n(peakOf(x))], ['Avg concurrent', n(avgV)], ['Comments / participant', x.participants ? (x.comments / x.participants).toFixed(2) : '—'], ['Duration', (x.durMin || viewers.length * 5) + ' min']];
    const tipAt = (i) => ({
      title: dl(x.day) + ' · ' + tl[i].long,
      rows: [row('Concurrent viewers', n(viewers[i]), C.pri, 'strong'), row('Comments in window', cm[i]), row('Comments per 100 viewers', viewers[i] ? (cm[i] / viewers[i] * 100).toFixed(1) : '—'), row('Session participants', n(x.participants), null, 'sep')],
    });
    return (
      <div className="ldet">
        <p className="ds">{wd(x.day)}, {dl(x.day)} {dateOf(x.day).getUTCFullYear()} · {tl[0]?.label}–{end(viewers.length)} IST · {prevS ? 'Changes compared with the previous session on ' + dl(prevS.day) : 'No earlier session to compare'}</p>
        <div className="kgrid">{stats.map(([k, v, c]) => <div key={k}><div className="l">{k}</div><div className="kv"><span className="v num">{v}</span><Chg c={c} /></div></div>)}</div>
        <div className="bh">
          <h3 className="bt bt-sm">Viewer activity</h3>
          <div className="mini-leg"><span><i style={{ background: C.pri }} />Concurrent viewers</span></div>
        </div>
        <LineChart H={180} main={viewers} color={C.pri} labels={tl} hi={hi} si={null} maxLabels={6} fmt={n} fill={0.1}
          aria={(i) => `${tl[i].long}: ${viewers[i]} viewers, ${cm[i]} comments`} onHover={setHi} onClick={(i) => setHi((v) => (v === i ? null : i))} tipAt={tipAt} />
      </div>
    );
  };

  return (
    <section className={'panel' + cur} aria-labelledby="s-l">
      <div className="sh"><h2 className="h2" id="s-l">Live audience &amp; engagement</h2></div>
      <div className="cards">
        <Stat name="Total live sessions" val={n(lL.length)} chg={chg(lL.length, lLP.length)} sub={prevTxt(lLP.length)} />
        <Stat name="Total participants" val={n(sum(lL, 'participants'))} chg={chg(sum(lL, 'participants'), sum(lLP, 'participants'))} sub={prevTxt(sum(lLP, 'participants'))} />
        <Stat name="Total comments" val={n(sum(lL, 'comments'))} chg={chg(sum(lL, 'comments'), sum(lLP, 'comments'))} sub={prevTxt(sum(lLP, 'comments'))} />
        <Stat name="Peak viewers" val={lL.length ? n(lPeak(lL)) : '—'} chg={lL.length ? chg(lPeak(lL), lLP.length ? lPeak(lLP) : null) : null} sub="Highest concurrent in one session" />
      </div>
      <div className="block">
        <h3 className="bt bt-gap">Sessions in this period</h3>
        {!lL.length ? <div className="empty">No live sessions {P.word} (previous period: {lLP.length}).</div> : (
          <div className="list">
            <div className="lhead"><span>Session</span><span className="hm">Date</span><span className="r">Participants</span><span className="r">Comments</span><span className="r">Peak viewers</span><span /></div>
            {lL.slice().reverse().map((x) => {
              const on = open === x.id;
              return (
                <div key={x.id} className={'lrow' + (on ? ' on' : '')}>
                  <div className="lrh" role="button" tabIndex={0} aria-expanded={on} aria-label={`${on ? 'Collapse' : 'Expand'} ${x.title}`}
                    onClick={() => toggle(x.id)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(x.id); } }}>
                    <span className="lt"><span className="t">{x.title}</span><span className="m">{when(x)} · {n(x.participants)} participants · {n(x.comments)} comments</span></span>
                    <span className="hm muted lsm">{when(x)}</span>
                    <span className="n num hm">{n(x.participants)}</span>
                    <span className="n num hm">{n(x.comments)}</span>
                    <span className="n num">{n(peakOf(x))}<small>peak</small></span>
                    <RowChevron open={on} />
                  </div>
                  {on && detail(x)}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
