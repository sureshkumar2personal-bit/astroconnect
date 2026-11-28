import { Ic } from './rmShared.jsx';
import * as R from '@/hooks/useRemedies.js';
import { kpis } from '@/lib/remedySelectors.js';

/** Heading actions and one row of six items: the four summary cards plus the Saved Methods and
 *  History tabs. Shown on the Overview, Saved Methods and History screens (`active` = '' | 'methods' | 'history').
 *  Clicking the active tab returns to the Overview. The first two cards open Assignments / Needs Attention. */
export default function RemHead({ d, s, active }) {
  const K = kpis(d.all);
  const cards = [
    { v: K.active.length, l: 'Active assignments', go: () => R.goTab(R.PATH.assignments) },
    { v: K.attn.length, l: 'Need attention', cls: 'warn', go: () => R.goTab(R.PATH.attention) },
    { v: K.compNov, l: 'Completed in November' },
    { v: `${K.rate}%`, l: 'Overall completion rate' },
  ];
  const histCount = d.all.filter((x) => x.outcome).length;
  const tabs = [
    { id: 'methods', label: 'Saved Methods', count: s.methods.length, path: R.PATH.methods },
    { id: 'history', label: 'History', count: histCount, path: R.PATH.history },
  ];
  return (
    <>
      <div className="rm-ph rm-ph--end">
        <div className="rm-actions">
          <button type="button" className="rm-btn rm-btn--s" onClick={() => R.openAssign()}>Assign Remedy</button>
          <button type="button" className="rm-btn rm-btn--p" onClick={R.createMethod}><Ic n="plus" size={16} />Create New Method</button>
        </div>
      </div>
      <div className="rm-kpis">
        {cards.map((c) => {
          const body = <><span className="v">{c.v}</span><span className="l">{c.l}</span></>;
          return c.go
            ? <button type="button" key={c.l} className={`rm-kpi ${c.cls || ''}`} onClick={c.go}>{body}</button>
            : <div key={c.l} className="rm-kpi">{body}</div>;
        })}
        {tabs.map((t) => (
          <button type="button" key={t.id} className={`rm-kpi rm-kpi--tab${active === t.id ? ' on' : ''}`} aria-current={active === t.id ? 'page' : undefined} onClick={() => R.goTab(active === t.id ? R.PATH.overview : t.path)}>
            <span className="v">{t.count}</span><span className="l">{t.label}</span>
          </button>
        ))}
      </div>
    </>
  );
}
