import { Prog, Seg } from '@/components/ui/sectionKit.jsx';
import { TABS, countTab, inCat, openCount, priority } from '@/lib/textQuestions.js';
import { navigate, routes } from '@/lib/router.js';

// One summary card holding several sections side by side.
function SumCard({ title, children, foot }) {
  return (
    <section className="kpi tq-sum__card" aria-label={title}>
      <h2 className="tq-sum__title">{title}</h2>
      <div className="tq-sum__parts">{children}</div>
      {foot}
    </section>
  );
}

// A section that filters the list below (replaces the former lifecycle tabs and Urgency chips).
function Part({ label, hint, value, on, onClick, valueClass }) {
  return (
    <button type="button" className={`tq-sum__part${on ? ' on' : ''}`} aria-pressed={on} onClick={onClick}>
      <span className="sm">{label}{hint && <span className="tq-sum__hint">{hint}</span>}</span>
      <b>{valueClass ? <span className={valueClass}>{value}</span> : value}</b>
    </button>
  );
}

// Text Questions header (reference tqHeader): category switch (AD-72), then four summary cards —
// Priority (Priority 1 / 2 urgency filter inside Received, AD-32), Questions (Received, the other
// category, Dispute), History (Completed, Resolved + full History page, AD-47) and, for Text-Based
// Questions only, Target (monthly answer target and slot quota, AD-24, AD-52). Card sections select
// the lifecycle list (AD-46). Drafts / Expired stay as secondary tabs.
// NOTE: AD-46 still describes a lifecycle tab bar; flagged for the product owner.
export default function QHeader({ tq, cat }) {
  const q = tq.questions;
  const mine = inCat(q, cat);
  const isText = cat === 'text';
  const other = isText ? 'sub' : 'text';
  const pct = (tq.alloc / tq.quota) * 100;
  const show = (tab, prio = '') => { tq.setTab(tab); tq.setPrio(prio); navigate(routes.listFor(cat)); };
  const switchCat = (c) => { tq.setTab('received'); tq.setPrio(''); navigate(routes.listFor(c)); };
  const is = (tab, prio = '') => tq.tab === tab && (tab !== 'received' || tq.prio === prio);
  const prioCount = (p) => mine.filter((x) => priority(x) === p).length;

  return (
    <>
      <Seg
        label="Question category"
        value={cat}
        onChange={switchCat}
        options={[['text', `Text-Based Questions (${openCount(q, 'text')})`], ['sub', `Subscription Questions (${openCount(q, 'sub')})`]]}
      />
      <div className="tq-sum">
        <div className={`tq-sum__grid${isText ? '' : ' tq-sum__grid--3'}`}>
          <SumCard title="Priority">
            <Part label="Priority 1" hint="20–30 days" value={prioCount(1)} valueClass="dl" on={is('received', '1')} onClick={() => show('received', '1')} />
            <Part label="Priority 2" hint="1–19 days" value={prioCount(2)} on={is('received', '2')} onClick={() => show('received', '2')} />
          </SumCard>

          <SumCard title="Questions">
            <Part label="Received Questions" value={countTab(q, cat, 'received')} on={is('received')} onClick={() => show('received')} />
            <Part label={isText ? 'Subscription Questions' : 'Text-Based Questions'} value={openCount(q, other)} on={false} onClick={() => switchCat(other)} />
            <Part label="Dispute Questions" value={countTab(q, cat, 'dispute')} on={is('dispute')} onClick={() => show('dispute')} />
          </SumCard>

          <SumCard title="History"
            foot={isText && <a className="go sm tq-sum__more" href={`#${routes.view('history')}`}>View full history ›</a>}>
            <Part label="Completed" value={countTab(q, cat, 'answered')} on={is('answered')} onClick={() => show('answered')} />
            <Part label="Resolved" value={countTab(q, cat, 'solved')} on={is('solved')} onClick={() => show('solved')} />
          </SumCard>

          {isText && (
            <SumCard title="Target">
              <div className="tq-sum__part tq-sum__part--static">
                <span className="sm">Monthly answer target</span>
                <b>{`${tq.answeredMonth} / ${tq.target}`}</b>
                <Prog pct={(tq.answeredMonth / tq.target) * 100} />
              </div>
              <a className="tq-sum__part" href={`#${routes.campaigns}`}>
                <span className="sm">Monthly slot quota</span>
                <b>{tq.quota.toLocaleString('en-IN')}</b>
                <Prog pct={pct} />
                <span className="sm">{tq.alloc} allocated · <span className="ok-t">{tq.free} free</span></span>
              </a>
            </SumCard>
          )}
        </div>
      </div>
      <div className="row wrap tq-more">
        <span className="muted sm">More:</span>
        {TABS.slice(4).map((t) => (
          <button key={t.key} type="button" className={`chip${tq.tab === t.key ? ' on' : ''}`} aria-pressed={tq.tab === t.key} onClick={() => show(t.key)}>
            {t.label} ({countTab(q, cat, t.key)})
          </button>
        ))}
      </div>
    </>
  );
}
