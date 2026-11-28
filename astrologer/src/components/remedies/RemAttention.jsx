import { Ic, Segc, Sel, SEL_SERVICE } from './rmShared.jsx';
import { Svc, User } from './RemAssignments.jsx';
import * as R from '@/hooks/useRemedies.js';
import { attention } from '@/lib/remedySelectors.js';

// Needs Attention: assignments that may need a follow-up. Daily statuses are user-reported — a missed
// update stays Pending and never turns a remedy into Skipped.
export default function RemAttention({ s, d }) {
  const A = attention(s, d.all);
  return (
    <section>
      <div className="rm-ph"><div><h1 className="rm-h1">Needs Attention</h1></div></div>
      <div className="rm-panel rm-rules">
        <b className="rm-sm">Attention rules</b>
        <span className="rm-rule"><i className="rm-seg sg-pending" style={{ width: 8, height: 8, display: 'inline-block' }} />One missed day → Pending</span>
        <label className="rm-rule"><i className="d-skipped" />Needs attention after
          <select className="rm-sel" value={s.rconsec} onChange={(e) => R.set({ rconsec: e.target.value })}>{['2', '3', '4'].map((n) => <option key={n} value={n}>{n}</option>)}</select>consecutive days without an update</label>
        <label className="rm-rule"><i style={{ background: 'var(--c-overdue)' }} />Overdue
          <select className="rm-sel" value={s.rgrace} onChange={(e) => R.set({ rgrace: e.target.value })}><option value="0">right after</option><option value="1">1 day after</option><option value="2">2 days after</option></select>the end date without final completion</label>
      </div>
      <div className="rm-frow" style={{ marginBottom: 14 }}>
        <Segc label="Attention reasons" items={A.groups.map((g) => ({ label: g.label, count: g.count, on: s.agroup === g.id, onClick: () => R.set({ agroup: g.id }) }))} />
        <span style={{ marginLeft: 'auto' }}><Sel label="Service" value={s.aservice} onChange={(v) => R.set({ aservice: v })} options={SEL_SERVICE} /></span>
      </div>
      <div className="rm-panel">
        {A.items.map((x) => (
          <div className="rm-attrow" key={x.id}>
            <User d={x} idLine={x.id} />
            <div className="rm-cell"><span className="rm-ml">Remedy</span>{x.remedyName}</div>
            <div className="rm-cell"><span className="rm-ml">Service</span><Svc d={x} /></div>
            <div className="rm-cell"><span className="rm-ml">Last update</span>{x.lastUserF}</div>
            <div className="rm-cell rm-prog"><span className="rm-ml">Progress</span><span className="rm-sm"><b>{x.progressLabel}</b></span><div className="rm-pb"><span style={{ width: `${x.pct}%` }} /></div></div>
            <div className="rm-reasons">{x.reasons.map((r) => <span key={r.label} className={`rm-pill ${r.cls.replace('pill ', '')}`}>{r.label}</span>)}</div>
            <span className="rm-chev"><Ic n="chevronRight" /></span>
          </div>
        ))}
        {A.items.length === 0 && <div className="rm-empty"><b>Nothing needs attention here</b>All matching Users are up to date.</div>}
      </div>
    </section>
  );
}
