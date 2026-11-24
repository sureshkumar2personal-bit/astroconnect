import Icon from '@/components/ui/Icon.jsx';
import { Prog, Seg } from '@/components/ui/sectionKit.jsx';
import { TABS, countTab, inCat, openCount, priority } from '@/lib/textQuestions.js';
import { navigate, routes } from '@/lib/router.js';

// One summary card holding several sections side by side.
function SumCard({ title, icon, tone = '', lead = false, children, foot }) {
  return (
    <section className={`kpi tq-sum__card${tone ? ` tq-sum__card--${tone}` : ''}${lead ? ' tq-sum__card--lead' : ''}`} aria-label={title}>
      {lead
        ? <span className="tq-sum__lead" aria-hidden="true"><Icon name={icon} size={26} stroke={2.4} /></span>
        : <h2 className="tq-sum__title"><Icon name={icon} size={20} className="tq-sum__icon" />{title}</h2>}
      {lead
        ? (<div className="tq-sum__lead-body"><h2 className="tq-sum__title tq-sum__title--lead">{title}</h2><div className="tq-sum__parts">{children}</div></div>)
        : <div className="tq-sum__parts">{children}</div>}
      {foot}
    </section>
  );
}

// A section that filters the list below (replaces the former lifecycle tabs and Urgency chips).
function Part({ label, hint, value, on, onClick, valueClass, icon }) {
  return (
    <button type="button" className={`tq-sum__part${on ? ' on' : ''}`} aria-pressed={on} onClick={onClick}>
      <span className="sm tq-sum__lab">{icon && <Icon name={icon} size={16} className="tq-sum__pico" />}<span>{label}{hint && <span className="tq-sum__hint">{hint}</span>}</span></span>
      <b>{valueClass ? <span className={valueClass}>{value}</span> : value}</b>
    </button>
  );
}

// Text Questions header (reference tqHeader). Row 1: Priority, Questions, History. Row 2: Target (Text-Based only),
// Quick links (Drafts / Expired) and Search + Filters.
// Original description:: category switch (AD-72), then four summary cards —
// Priority (Priority 1 / 2 urgency filter inside Received, AD-32), Questions (Received, the other
// category, Dispute), History (Completed, Resolved + full History page, AD-47) and, for Text-Based
// Questions only, Target (monthly answer target and slot quota, AD-24, AD-52). Card sections select
// the lifecycle list (AD-46). Drafts / Expired stay as secondary tabs.
// NOTE: AD-46 still describes a lifecycle tab bar; flagged for the product owner.
export default function QHeader({ tq, cat, toolbar }) {
  const q = tq.questions;
  const mine = inCat(q, cat);
  const isText = cat === 'text';
  const other = isText ? 'sub' : 'text';
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
        <div className="tq-sum__grid">
          <SumCard title="Priority" icon="check" tone="prio" lead>
            <Part label="Priority 1" hint="20–30 days" value={prioCount(1)} valueClass="dl" on={is('received', '1')} onClick={() => show('received', '1')} />
            <Part label="Priority 2" hint="1–19 days" value={prioCount(2)} on={is('received', '2')} onClick={() => show('received', '2')} />
          </SumCard>

          <SumCard title="Questions Overview" icon="bars" tone="info">
            <Part icon="inbox" label="Received" value={countTab(q, cat, 'received')} on={is('received')} onClick={() => show('received')} />
            <Part icon={isText ? 'crown' : 'chat'} label={isText ? 'Subscription' : 'Text-Based'} value={openCount(q, other)} on={false} onClick={() => switchCat(other)} />
            <Part icon="scales" label="Disputes" value={countTab(q, cat, 'dispute')} on={is('dispute')} onClick={() => show('dispute')} />
          </SumCard>

          <SumCard title="History" icon="clock" tone="info"
            foot={isText && <a className="go sm tq-sum__more" href={`#${routes.view('history')}`}>View Full History →</a>}>
            <Part icon="checkCircle" label="Completed" value={countTab(q, cat, 'answered')} on={is('answered')} onClick={() => show('answered')} />
            <Part icon="headset" label="Resolved" value={countTab(q, cat, 'solved')} on={is('solved')} onClick={() => show('solved')} />
          </SumCard>
        </div>

        <div className={`tq-sum__row2${isText ? '' : ' tq-sum__row2--2'}`}>
          {isText && (
            <SumCard title="Monthly Target" icon="target">
              <div className="tq-sum__part tq-sum__part--static">
                <span className="sm">Monthly Answer Target</span>
                <b>{tq.answeredMonth}<span className="tq-sum__of"> / {tq.target}</span></b>
                <Prog pct={(tq.answeredMonth / tq.target) * 100} />
              </div>
              <a className="tq-sum__part" href={`#${routes.campaigns}`}>
                <span className="sm">Monthly Slot Quota</span>
                <b>{tq.quota.toLocaleString('en-IN')}</b>
                <span className="sm">{tq.alloc} allocated · <span className="ok-t">{tq.free} free</span></span>
              </a>
            </SumCard>
          )}
          <SumCard title="Quick Links" icon="bolt" tone="quick">
            <div className="tq-sum__chips">
              {TABS.slice(4).map((t) => (
                <button key={t.key} type="button" className={`chip${tq.tab === t.key ? ' on' : ''}`} aria-pressed={tq.tab === t.key} onClick={() => show(t.key)}>
                  {t.label} ({countTab(q, cat, t.key)})
                </button>
              ))}
            </div>
          </SumCard>
          <div className="tq-sum__tools">{toolbar}</div>
        </div>
      </div>
    </>
  );
}
