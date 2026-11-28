import { Ic, Segc, Search, Sel, Mono, SEL_SERVICE } from './rmShared.jsx';
import { Svc, User } from './RemAssignments.jsx';
import * as R from '@/hooks/useRemedies.js';
import { history } from '@/lib/remedySelectors.js';
import { mono } from '@/lib/remedyModel.js';

const OUTCOME = { completed: 'Completed', completed_skipped: 'Completed with Skipped Days', stopped: 'Stopped', cancelled: 'Cancelled' };

// History: completed, stopped and cancelled assignments (nothing is deleted) and archived methods.
export default function RemHistory({ s, d }) {
  const H = history(s, d.all);
  const showArchived = s.hfilter === 'archived';
  const reset = () => R.set({ hq: '', hservice: 'all', hfrom: '', hto: '', hfilter: 'all' });
  return (
    <section>
      <div className="rm-ph"><div><h1 className="rm-h1">History</h1></div></div>
      <Segc label="History filters" style={{ marginBottom: 14 }} items={H.chips.map((c) => ({ label: c.label, count: c.count, on: s.hfilter === c.id, onClick: () => R.set({ hfilter: c.id }) }))} />
      <div className="rm-panel rm-fbar">
        <div className="rm-frow">
          <Search label="Search by user or remedy name" placeholder="Search user or remedy name" value={s.hq} onChange={(v) => R.set({ hq: v })} />
          <Sel label="Service" value={s.hservice} onChange={(v) => R.set({ hservice: v })} options={SEL_SERVICE} />
          <label className="rm-dt">Closed from<input type="date" value={s.hfrom} onChange={(e) => R.set({ hfrom: e.target.value })} /></label>
          <label className="rm-dt">to<input type="date" value={s.hto} onChange={(e) => R.set({ hto: e.target.value })} /></label>
          <button type="button" className="rm-btn rm-btn--g rm-btn--sm" onClick={reset}>Reset</button>
        </div>
      </div>
      {!showArchived && (
        <div className="rm-panel">
          {H.items.map((x) => (
            <div className="rm-hrow" key={x.id}>
              <User d={x} idLine={`${x.id} · ${x.userRef}`} />
              <div className="rm-cell"><span className="rm-ml">Remedy</span>{x.remedyName}</div>
              <div className="rm-cell"><span className="rm-ml">Service</span><Svc d={x} /></div>
              <div className="rm-cell"><span className="rm-ml">Dates</span>{x.assignedF}<div className="rm-uid">{x.closedLabel} {x.closedF}</div></div>
              <div className="rm-cell"><span className="rm-ml">Daily progress</span>{x.durationLabel}<div className="rm-minidots">{x.dots.map((g, i) => <span key={i} className={g.cls.replace('seg', 'rm-seg')} title={g.title} />)}</div></div>
              <div className="rm-cell"><span className="rm-ml">Photos</span>{x.photoLine}</div>
              <div className="rm-cell wide2"><span className={`rm-pill ${x.statusCls.replace('pill ', '')}`}>{OUTCOME[x.outcome]}</span></div>
              <span className="rm-chev"><Ic n="chevronRight" /></span>
              {x.reason && <div className="rm-reason">Reason: {x.reason}</div>}
            </div>
          ))}
          {H.items.length === 0 && <div className="rm-empty"><b>No history records match</b>Change the filters to see more.</div>}
        </div>
      )}
      {showArchived && (
        <div className="rm-panel">
          <div className="rm-lhead"><b>Archived Methods</b><span className="rm-muted rm-sm">Archived methods can’t be assigned. Their past assignments stay in History.</span></div>
          {H.archived.map(({ m, line }) => (
            <div className="rm-arch" key={m.id}>
              <Mono tone={m.tone || 'tone-teal'} size="sm">{mono(m.name)}</Mono>
              <div><b>{m.name}</b><div className="rm-muted rm-sm">{m.category} · {line}</div></div>
              <button type="button" className="rm-btn rm-btn--s rm-btn--sm" onClick={() => R.ask({ action: 'restore', id: m.id, title: `Restore “${m.name}”?`, body: 'The method becomes available for new assignments again.', confirmLabel: 'Restore method', danger: false, needReason: false })}>Restore</button>
            </div>
          ))}
          {H.archived.length === 0 && <div className="rm-empty"><b>No archived methods</b></div>}
        </div>
      )}
    </section>
  );
}
