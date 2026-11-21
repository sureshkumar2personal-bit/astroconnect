import { Kpi, KpiGrid, Prog, Seg } from '@/components/ui/sectionKit.jsx';
import { TABS, countTab, critical, openCount, priority } from '@/lib/textQuestions.js';
import { navigate, routes } from '@/lib/router.js';

// Text Questions header (reference tqHeader): category switch (AD-72), quota / target KPIs for
// Text-Based Questions (AD-24, AD-52), the four lifecycle tabs (AD-46), Drafts / Expired as
// secondary tabs and the Priority 1 / 2 urgency filter inside Received Questions (AD-32, AD-46).
export default function QHeader({ tq, cat }) {
  const q = tq.questions;
  const pct = (tq.alloc / tq.quota) * 100;
  const switchCat = (c) => { tq.setTab('received'); navigate(routes.listFor(c)); };
  return (
    <>
      <Seg
        label="Question category"
        value={cat}
        onChange={switchCat}
        options={[['text', `Text-Based Questions (${openCount(q, 'text')})`], ['sub', `Subscription Questions (${openCount(q, 'sub')})`]]}
      />
      {cat === 'text' && (
        <KpiGrid>
          <Kpi label="Monthly slot quota" value={tq.quota.toLocaleString('en-IN')} href={routes.campaigns}
            sub={<><Prog pct={pct} /><span className="sm">{tq.alloc} allocated · <span className="ok-t">{tq.free} free</span></span></>} />
          <Kpi label="Pending answers" value={countTab(q, 'text', 'received')} />
          <Kpi label="Priority 1 · 20–30 days" value={<span className="dl">{critical(q)}</span>} />
          <Kpi label="Priority 2 · 1–19 days" value={q.filter((x) => x.cat === 'text' && priority(x) === 2).length} />
          <Kpi label="Monthly answer target" value={`${tq.answeredMonth} / ${tq.target}`} sub={<Prog pct={(tq.answeredMonth / tq.target) * 100} />} />
        </KpiGrid>
      )}
      <div className="tabs" role="tablist" aria-label="Lifecycle tabs">
        {TABS.slice(0, 4).map((t) => (
          <button key={t.key} type="button" role="tab" aria-selected={tq.tab === t.key} className={`tab${tq.tab === t.key ? ' on' : ''}`} onClick={() => { tq.setTab(t.key); navigate(routes.listFor(cat)); }}>
            {t.label}<span className="n">{countTab(q, cat, t.key)}</span>
          </button>
        ))}
      </div>
      <div className="row wrap tq-more">
        <span className="muted sm">More:</span>
        {TABS.slice(4).map((t) => (
          <button key={t.key} type="button" className={`chip${tq.tab === t.key ? ' on' : ''}`} aria-pressed={tq.tab === t.key} onClick={() => { tq.setTab(t.key); navigate(routes.listFor(cat)); }}>
            {t.label} ({countTab(q, cat, t.key)})
          </button>
        ))}
        {tq.tab === 'received' && (
          <>
            <span className="muted sm tq-urg">Urgency:</span>
            <div className="chips" role="group" aria-label="Urgency">
              {[['', 'All'], ['1', 'Priority 1'], ['2', 'Priority 2']].map(([v, l]) => (
                <button key={v} type="button" className={`chip${tq.prio === v ? ' on' : ''}`} aria-pressed={tq.prio === v} onClick={() => tq.setPrio(v)}>{l}</button>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
