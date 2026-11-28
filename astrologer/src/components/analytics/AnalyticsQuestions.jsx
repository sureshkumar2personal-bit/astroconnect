import { useState } from 'react';
import { chg, dl, hm, inB, n, pct } from '@/lib/analytics.js';
import { C, Detail } from './AnalyticsCharts.jsx';
import { Stat, prevTxt } from './Metric.jsx';
import { Breakdown, DataTable, Disc, Pill, SLAB, TableFoot, usePager } from './AnalyticsTable.jsx';

// Text Questions (AD-145): received, answered (Answered and Completed are one status, counted once),
// pending, expired unanswered and the answer rate. Tap a status — or a day in the breakdown — to list
// those questions.
const QS = [['answered', 'Answered / completed', C.pri, 'ans', false], ['pending', 'Pending', C.sec, 'pen', true], ['expired', 'Expired unanswered', C.grey, 'exp', true]];
const stat = (L) => ({ rec: L.length, ans: L.filter((r) => r.status === 'answered').length, pen: L.filter((r) => r.status === 'pending').length, exp: L.filter((r) => r.status === 'expired').length });

export default function AnalyticsQuestions({ D, P, cur = '' }) {
  const [sel, setSel] = useState(null); // 's:<status>' | 't:<bucket index>'
  const pg = usePager();
  const qL = inB(D.Q, P.tot), qLP = inB(D.Q, P.totP);
  const QC = stat(qL), QP = stat(qLP);
  const unitF = P.per === 'daily' ? 'hour' : 'day';
  const pick = (v) => { setSel((x) => (x === v ? null : v)); pg.reset(); };
  const segs = QS.map(([id, label, c, f, inv]) => ({ id, label, c, n: QC[f], chg: chg(QC[f], QP[f], inv) }));

  let detail = null;
  if (sel) {
    let L = null, title, sub;
    if (sel.startsWith('s:')) {
      const id = sel.slice(2), x = segs.find((g) => g.id === id);
      L = qL.filter((r) => r.status === id).slice().reverse(); title = x.label + ' · ' + P.label; sub = n(x.n) + ' of ' + n(QC.rec) + ' received questions (' + pct(x.n, QC.rec) + ')';
    } else {
      const b = P.fine[+sel.slice(2)];
      if (b) { L = inB(D.Q, b).slice().reverse(); const t = stat(L); title = b.long; sub = `${t.rec} received · ${t.ans} answered / completed · ${t.pen} pending · ${t.exp} expired`; }
    }
    if (L) {
      detail = (
        <Detail title={title} sub={sub} onClose={() => setSel(null)}>
          {L.length ? (
            <>
              <DataTable cols={['Question', 'From', 'Topic', 'Received', 'Status']}
                rows={L.slice(0, pg.lim).map((r) => ({ key: r.id, cells: [[r.id, 'muted num'], <b key="w">{r.user}</b>, r.topic, [dl(r.day) + ', ' + hm(r.hour, r.min), 'num'], <Pill key="p" s={r.status} label={SLAB[r.status]} />] }))} />
              <TableFoot shown={pg.lim} total={L.length} noun="questions" onMore={pg.more} />
            </>
          ) : <p className="foot">No questions in this slot.</p>}
        </Detail>
      );
    }
  }

  return (
    <section className={'panel' + cur} aria-labelledby="s-q">
      <div className="sh"><h2 className="h2" id="s-q">Questions received and answered</h2></div>
      <div className="cards">
        <Stat name="Total questions received" val={n(QC.rec)} chg={chg(QC.rec, QP.rec)} sub={prevTxt(QP.rec)} />
        <Stat name="Answered" c={C.pri} val={n(QC.ans)} chg={chg(QC.ans, QP.ans)} sub={prevTxt(QP.ans)} />
        <Stat name="Pending" c={C.sec} val={n(QC.pen)} chg={chg(QC.pen, QP.pen, true)} sub={prevTxt(QP.pen)} />
        <Stat name="Answer rate" val={pct(QC.ans, QC.rec)} sub={'Previous ' + pct(QP.ans, QP.rec)} />
      </div>
      <div className="block g2">
        <div>
          <h3 className="bt">Answer rate</h3>
          <div className="rate"><b className="num">{pct(QC.ans, QC.rec)}</b><span className="muted">{QC.ans} of {QC.rec} received questions answered · previous {pct(QP.ans, QP.rec)}</span></div>
          <div className="pbar" role="img" aria-label={'Answer rate ' + pct(QC.ans, QC.rec)}><span style={{ width: (QC.rec ? QC.ans / QC.rec * 100 : 0).toFixed(1) + '%', background: C.pri }} /></div>
        </div>
        <div>
          <h3 className="bt">Status breakdown</h3>
          <Breakdown segs={segs} total={QC.rec} sel={sel && sel.startsWith('s:') ? sel.slice(2) : null} onPick={(id) => pick('s:' + id)} />
        </div>
      </div>
      {detail}
      <Disc label={'breakdown by ' + unitF}>
        <DataTable tall cols={[unitF === 'hour' ? 'Hour' : 'Day', ['Received', 'r'], ['Answered', 'r'], ['Pending', 'r'], ['Expired', 'r'], ['Answer rate', 'r'], ['Previous received', 'r']]}
          rows={P.fine.map((b, i) => {
            const t = stat(inB(D.Q, b)), pr = inB(D.Q, P.fineP[i]).length;
            return {
              key: i, cls: sel === 't:' + i ? 'on' : '',
              cells: [<button key="b" type="button" className="linkb" onClick={() => pick('t:' + i)}>{P.per === 'daily' ? b.label + ':00' : b.long}</button>,
                [<b key="r">{t.rec}</b>, 'r num'], [t.ans, 'r num'], [t.pen, 'r num'], [t.exp, 'r num'], [pct(t.ans, t.rec), 'r num'], [pr, 'r num muted']],
            };
          })} />
      </Disc>
    </section>
  );
}
