import { useEffect } from 'react';
import { Ic, Search, Sel, SEL_SERVICE } from './rmShared.jsx';
import { fT, fD } from '@/lib/remedyModel.js';
import * as R from '@/hooks/useRemedies.js';
import { assignmentList } from '@/lib/remedySelectors.js';

const Pill = ({ cls, children }) => <span className={`rm-pill ${cls}`}>{children}</span>;
export const Flags = ({ d }) => (<><Pill cls={d.statusCls.replace('pill ', '')}>{d.label}</Pill>{d.flags.map((f) => <Pill key={f.label} cls={f.cls.replace('pill ', '')}>{f.label}</Pill>)}</>);
export const Svc = ({ d }) => <span className={`rm-svc svc-${d.service}`}>{d.serviceLabel}</span>;
export const User = ({ d, idLine }) => (
  <div className="rm-auser"><span className="rm-av">{d.initials}</span><div style={{ minWidth: 0 }}><button type="button" className="rm-stretch rm-uname" onClick={() => R.openA(d.id)}>{d.userName}</button><div className="rm-uid">{idLine}</div></div></div>
);

/** All Assignments tab, and the assignments of one remedy (route /remedies/remedy/<id>). */
export default function RemAssignments({ s, d, remedyId }) {
  const m = remedyId ? d.M[remedyId] : null;
  const L = assignmentList(s, d.all, remedyId);
  const set = R.setL;
  const reset = () => set({ lq: '', lservice: 'all', lstatus: 'all', lfrom: '', lto: '', lsort: 'newest' });
  useEffect(() => { if (remedyId && !m) { R.toast('That remedy is no longer available.', 'err'); R.goTab(R.PATH.overview); } }, [remedyId, m]);
  if (remedyId && !m) return null;
  return (
    <section>
      <div className="rm-ph">
        <div>
          <h1 className="rm-h1">{remedyId ? m.name : 'All Assignments'}</h1>
          <div className="rm-lquad">
            <div><b>{L.totalLine}</b></div>
            {[['started', 'Started'], ['ongoing', 'Ongoing'], ['skipped', 'Skipped'], ['completed', 'Completed']].map(([k, l]) => <div key={k}><i className={`rm-dot d-${k}`} />{l} <b>{L.lc[k]}</b></div>)}
          </div>
        </div>
        <div className="rm-actions">
          {!remedyId && <button type="button" className="rm-btn rm-btn--p" onClick={() => R.openAssign()}><Ic n="plus" size={16} />Assign Remedy</button>}
          {remedyId && m.status === 'active' && <button type="button" className="rm-btn rm-btn--p" onClick={() => R.openAssign({ methodId: remedyId })}><Ic n="plus" size={16} />Assign this Remedy</button>}
          {remedyId && m.status !== 'active' && <span className="rm-tag t-grey">Not available for new assignments</span>}
        </div>
      </div>

      <div className="rm-panel rm-fbar">
        <div className="rm-frow">
          <Search label="Search users, remedies or IDs" placeholder="Search user, remedy or assignment ID" value={s.lq} onChange={(v) => set({ lq: v })} />
          <Sel label="Service" value={s.lservice} onChange={(v) => set({ lservice: v })} options={SEL_SERVICE} />
          <Sel label="Status" value={s.lstatus} onChange={(v) => set({ lstatus: v })} options={[['all', 'All Statuses'], ['started', 'Started'], ['ongoing', 'Ongoing'], ['skipped', 'Skipped / Stopped'], ['completed', 'Completed'], ['pending', 'Pending / No Update'], ['overdue', 'Overdue'], ['cancelled', 'Cancelled']]} />
          <label className="rm-dt">From<input type="date" value={s.lfrom} onChange={(e) => set({ lfrom: e.target.value })} /></label>
          <label className="rm-dt">to<input type="date" value={s.lto} onChange={(e) => set({ lto: e.target.value })} /></label>
          <Sel label="Sort" value={s.lsort} onChange={(v) => set({ lsort: v })} options={[['newest', 'Newest assigned'], ['oldest', 'Oldest assigned'], ['progress', 'Most progress'], ['updated', 'Recently updated'], ['name', 'User name']]} />
          {L.filtersOn && <button type="button" className="rm-btn rm-btn--g rm-btn--sm" onClick={reset}>Reset</button>}
        </div>
      </div>

      <div className="rm-panel">
        <div className="rm-ahead"><span>User</span><span>Remedy</span><span>Service</span><span>Assigned</span><span>Days</span><span>Progress</span><span>Status</span><span>Updated</span><span /></div>
        {L.items.map((x) => {
          const exp = !!s.expanded[x.id];
          return (
            <div className="rm-arow" key={x.id}>
              <User d={x} idLine={`${x.id} · ${x.userRef}`} />
              <div className="rm-cell rm-rcell"><span className="rm-ml">Remedy</span>{x.remedyName}</div>
              <div className="rm-cell"><span className="rm-ml">Service</span><Svc d={x} /></div>
              <div className="rm-cell"><span className="rm-ml">Assigned</span>{x.assignedF}<div className="rm-uid">Starts {x.startF}</div></div>
              <div className="rm-cell"><span className="rm-ml">Duration</span>{x.durationLabel}</div>
              <div className="rm-cell rm-prog"><span className="rm-ml">Progress</span><span className="rm-sm"><b>{x.progressLabel}</b></span><div className="rm-pb"><span style={{ width: `${x.pct}%` }} /></div></div>
              <div className="rm-cell rm-stcell"><span className="rm-ml" style={{ width: '100%' }}>Status</span><Flags d={x} /></div>
              <div className="rm-cell"><span className="rm-ml">Last updated</span>{x.lastUpdF}</div>
              <button type="button" className={`rm-iconbtn rm-exp rm-xbtn${exp ? ' on' : ''}`} aria-label={exp ? 'Collapse details' : 'Expand details'} aria-expanded={exp} onClick={() => R.toggleExpanded(x.id)}><Ic n="chevronDown" /></button>
              {exp && (
                <div className="rm-exprow">
                  <div><span className="rm-lab">Daily progress</span><div className="rm-minidots">{x.dots.map((g, i) => <span key={i} className={g.cls.replace('seg', 'rm-seg')} title={g.title} />)}</div><div className="rm-hint">{x.doneLine} · ends {x.endF}</div></div>
                  <div><span className="rm-lab">Latest activity</span><div className="rm-sm">{x.lastAct}</div><div className="rm-hint">{fD(x.acts[0]?.d)}, {fT(x.acts[0]?.t)}</div></div>
                  <button type="button" className="rm-btn rm-btn--p rm-btn--sm" onClick={() => R.openA(x.id)}>Open details <Ic n="chevronRight" size={14} /></button>
                </div>
              )}
            </div>
          );
        })}
        {L.total === 0 && <div className="rm-empty"><b>No assignments match</b>Try a different search, service, status or date.</div>}
        <div className="rm-pager">
          <span className="rm-muted rm-sm">{L.showing}</span>
          {L.pages > 1 && (
            <div className="rm-pgs">
              <button type="button" className="rm-pg" aria-label="Previous page" disabled={L.page <= 1} onClick={() => R.set({ lpage: Math.max(1, L.page - 1) })}>‹</button>
              {Array.from({ length: L.pages }, (_, i) => <button type="button" key={i} className={`rm-pg${i + 1 === L.page ? ' on' : ''}`} onClick={() => R.set({ lpage: i + 1 })}>{i + 1}</button>)}
              <button type="button" className="rm-pg" aria-label="Next page" disabled={L.page >= L.pages} onClick={() => R.set({ lpage: Math.min(L.pages, L.page + 1) })}>›</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
