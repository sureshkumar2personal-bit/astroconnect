import { Ic, Search, Sel, Segc, Tag, Mono, SEL_SERVICE } from './rmShared.jsx';
import * as R from '@/hooks/useRemedies.js';
import { kpis, overview } from '@/lib/remedySelectors.js';

// Overview: remedy list (one row per saved method) with filters, and remedy performance. The summary
// cards and tabs are in RemHead. The panel of read-only remedies from consultations is no longer shown
// here (product owner, 2026-11-28; see AP-17-02); its component and data files are kept.
export default function RemOverview({ s, d, ctx, ui }) {
  const K = kpis(d.all);
  const o = overview(s, d.all, K);
  const set = R.set;
  const ptot = [[K.nonC.length, 'Total'], [K.bt.started, 'Started'], [K.bt.ongoing, 'Ongoing'], [K.bt.skipped, 'Skipped'], [K.bt.completed, 'Completed'], [`${K.rate}%`, 'Completion', 'hl']];
  const reset = () => set({ oq: '', ouq: '', oservice: 'all', ostatus: 'all', ofrom: '', oto: '', osort: 'newest', oseg: 'all' });
  return (
    <section>
      <div className="rm-panel rm-fbar">
        <div className="rm-frow">
          <Search label="Search by remedy name" placeholder="Search remedy name" value={s.oq} onChange={(v) => set({ oq: v })} />
          <Search label="Search by user name" placeholder="Search user name" value={s.ouq} onChange={(v) => set({ ouq: v })} />
          <button type="button" className="rm-btn rm-btn--s rm-ftoggle" onClick={() => set({ ofOpen: !s.ofOpen })}><Ic n="filter" size={16} />{s.ofOpen ? 'Hide filters' : `Filters${o.chips.length ? ` · ${o.chips.length}` : ''}`}</button>
        </div>
        <div className={`rm-fextra${s.ofOpen ? ' open' : ''}`}>
          <Sel label="Service" value={s.oservice} onChange={(v) => set({ oservice: v })} options={SEL_SERVICE} />
          <Sel label="Status" value={s.ostatus} onChange={(v) => set({ ostatus: v })} options={[['all', 'All Statuses'], ['started', 'Started'], ['ongoing', 'Ongoing'], ['skipped', 'Skipped'], ['completed', 'Completed'], ['pending', 'Pending / No Update']]} />
          <label className="rm-dt">Assigned from<input type="date" value={s.ofrom} onChange={(e) => set({ ofrom: e.target.value })} /></label>
          <label className="rm-dt">to<input type="date" value={s.oto} onChange={(e) => set({ oto: e.target.value })} /></label>
          <Sel label="Sort" value={s.osort} onChange={(v) => set({ osort: v })} options={[['newest', 'Sort: Newest'], ['oldest', 'Sort: Oldest'], ['most', 'Sort: Most Used']]} />
          <button type="button" className="rm-btn rm-btn--g rm-btn--sm" onClick={reset}>Reset filters</button>
        </div>
        {o.chips.length > 0 && (
          <div className="rm-chips"><span className="rm-muted rm-sm">Active filters:</span>
            {o.chips.map(([label, clear]) => <button type="button" key={label} className="rm-chip" aria-label={`Remove filter ${label}`} onClick={() => set(clear)}>{label}<span className="x"><Ic n="x" size={14} /></span></button>)}
            <button type="button" className="rm-btn rm-btn--g rm-btn--sm" onClick={reset}>Clear all</button>
          </div>
        )}
      </div>

      <div className="rm-ovgrid">
        <div className="rm-panel">
          <div className="rm-lhead">
            <Segc label="Remedy groups" items={o.segs.map((g) => ({ label: g.label, count: g.count, on: s.oseg === g.id, onClick: () => set({ oseg: g.id }) }))} />
            <span className="rm-muted rm-sm">{o.shown.length} {o.shown.length === 1 ? 'remedy' : 'remedies'}</span>
          </div>
          {o.shown.map((r) => (
            <div className="rm-rrow" key={r.id}>
              <div className="rm-rname">
                <Mono tone={r.tone}>{r.mono}</Mono>
                <div style={{ minWidth: 0 }}>
                  <button type="button" className="rm-stretch rm-rtitle" onClick={() => R.openRemedy(r.id)}>{r.name}</button>
                  {r.tags.length > 0 && <div className="rm-tags">{r.tags.map(([l, c]) => <Tag key={l} cls={c}>{l}</Tag>)}</div>}
                </div>
              </div>
              <div className="rm-quad">
                {[['started', 'Started'], ['ongoing', 'Ongoing'], ['skipped', 'Skipped'], ['completed', 'Completed']].map(([k, l]) => (
                  <div className="rm-q" key={k}><span><i className={`rm-dot d-${k}`} />{l}</span><b>{r.c[k]}</b></div>
                ))}
              </div>
              <div className="rm-rside">
                <div className="big">{r.total} <small>assigned users</small></div>
                <div className="rm-muted">{r.act} active · Last {r.lastF}</div>
                <div className="rm-sbar" aria-hidden="true">{['started', 'ongoing', 'skipped', 'completed'].map((k) => <span key={k} className={`d-${k}`} style={{ width: `${r.w[k]}%` }} />)}</div>
              </div>
              <span className="rm-chev"><Ic n="chevronRight" /></span>
            </div>
          ))}
          {o.shown.length === 0 && (
            <div className="rm-empty"><b>No remedies match these filters</b>Try another service, status or date range.
              <div style={{ marginTop: 12 }}><button type="button" className="rm-btn rm-btn--s rm-btn--sm" onClick={reset}>Reset filters</button></div></div>
          )}
        </div>

        <aside className="rm-panel rm-perf" aria-label="Remedy performance">
          <p className="rm-ptitle">Remedy Performance</p>
          <div className="rm-muted rm-sm">All assignments to date, excluding cancelled</div>
          <div className="rm-pst-grid">{ptot.map(([v, l, c]) => <div key={l} className={`rm-pst ${c || ''}`}><b>{v}</b><span>{l}</span></div>)}</div>
          <p className="rm-phead">Completion rate by remedy</p>
          {o.perf.map((p) => (
            <button type="button" key={p.id} className="rm-prow" onClick={() => R.openRemedy(p.id)}><span className="rm-pn">{p.name}</span><span className="rm-pv">{p.rate}%</span><span className="rm-pbar"><span style={{ width: `${p.rate}%` }} /></span><span className="rm-pm">{p.line}</span></button>
          ))}
          <div className="rm-divider" />
          <p className="rm-phead">Most used remedies</p>
          <div className="rm-most">{o.most.map((m, i) => <button type="button" key={m.id} className="rm-mrank" onClick={() => R.openRemedy(m.id)}><i>{i + 1}</i><span>{m.name}</span><small>{m.total === 1 ? '1 assignment' : `${m.total} assignments`}</small></button>)}</div>
        </aside>
      </div>
    </section>
  );
}
