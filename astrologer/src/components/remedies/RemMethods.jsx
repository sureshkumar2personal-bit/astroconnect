import { Ic, Search, Sel, Segc, Tag, Mono, SEL_CATEGORY } from './rmShared.jsx';
import { fD, mono, plural } from '@/lib/remedyModel.js';
import * as R from '@/hooks/useRemedies.js';
import { methodsView } from '@/lib/remedySelectors.js';

// Saved Methods: Platform templates (read-only, provided by Platform Admin) and My Saved Methods.
export default function RemMethods({ s, d }) {
  const V = methodsView(s, d.all);
  const mineTab = s.mtab === 'mine';
  const askM = (m, n, kind) => {
    if (kind === 'archive') return R.ask({ action: 'archive', id: m.id, title: `Archive “${m.name}”?`, body: `Archived methods can’t be used for new assignments. ${n ? `The ${plural(n, 'existing assignment')} stay exactly as they are.` : 'You can restore it any time from History.'}`, confirmLabel: 'Archive method', danger: false, needReason: false });
    if (kind === 'restore') return R.ask({ action: 'restore', id: m.id, title: `Restore “${m.name}”?`, body: 'The method becomes available for new assignments again.', confirmLabel: 'Restore method', danger: false, needReason: false });
    if (n > 0) return R.toast('This method has assignment history and can’t be deleted. Archive it instead.', 'err');
    return R.ask({ action: 'delete', id: m.id, title: `Delete “${m.name}”?`, body: 'This method has never been assigned, so no history is affected. This can’t be undone.', confirmLabel: 'Delete method', danger: true, needReason: false });
  };
  return (
    <section>
      <div className="rm-ph rm-ph--between">
        <h1 className="rm-h1">Saved Methods</h1>
        <Segc role="tablist" label="Library" items={[
          { label: 'Platform Templates', count: R.TEMPLATES.length, on: !mineTab, onClick: () => R.set({ mtab: 'templates' }) },
          { label: 'My Saved Methods', count: s.methods.length, on: mineTab, onClick: () => R.set({ mtab: 'mine' }) },
        ]} />
      </div>

      {!mineTab && (
        <div className="rm-panel">
          <div className="rm-lhead">
            <div className="rm-frow" style={{ flex: 1 }}>
              <Search label="Search templates" placeholder="Search templates" value={s.tq} onChange={(v) => R.set({ tq: v })} style={{ maxWidth: 360 }} />
              <Sel label="Category" value={s.tcat} onChange={(v) => R.set({ tcat: v })} options={SEL_CATEGORY} />
            </div>
            <Tag cls="t-gold">Provided by Platform Admin · read-only</Tag>
          </div>
          {V.tpls.map((t) => (
            <div className="rm-trow" key={t.id}>
              <div className="rm-tname"><Mono tone={t.tone}>{mono(t.name)}</Mono><div style={{ minWidth: 0 }}><b>{t.name}</b><p>{t.short}</p></div></div>
              <span className="hide-m"><Tag cls="t-teal">{t.category}</Tag></span>
              <span className="hide-m rm-muted rm-sm">{t.duration} days · {plural(t.steps.length, 'step')}</span>
              <div className="rm-racts">
                <button type="button" className="rm-btn rm-btn--s rm-btn--sm" onClick={() => R.set({ modal: 'tpl', tplId: t.id })}>Preview</button>
                <button type="button" className="rm-btn rm-btn--p rm-btn--sm" onClick={() => R.useTemplate(t)}>Use Template</button>
              </div>
            </div>
          ))}
          {V.tpls.length === 0 && <div className="rm-empty"><b>No templates found</b>Try a different name or category.</div>}
        </div>
      )}

      {mineTab && (
        <>
          <div className="rm-panel">
            <div className="rm-lhead">
              <div className="rm-frow" style={{ flex: 1 }}>
                <Search label="Search methods" placeholder="Search by method name" value={s.mq} onChange={(v) => R.set({ mq: v })} style={{ maxWidth: 300 }} />
                <Sel label="Category" value={s.mcat} onChange={(v) => R.set({ mcat: v })} options={SEL_CATEGORY} />
                <Sel label="Usage" value={s.mflag} onChange={(v) => R.set({ mflag: v })} options={[['all', 'All usage'], ['recent', 'Recently used'], ['frequent', 'Frequently used']]} />
              </div>
              <Segc label="Status" items={[['all', 'All'], ['active', 'Active'], ['draft', 'Draft'], ['archived', 'Archived']].map(([id, l]) => ({ label: l, on: s.mstatus === id, onClick: () => R.set({ mstatus: id }) }))} />
            </div>
            <div className="rm-mtrow rm-mthead"><span>Method</span><span className="hide-m">Category</span><span className="hide-m">Duration</span><span className="hide-m hide-t">Created</span><span className="hide-m hide-t">Last used</span><span className="hide-m">Assignments</span><span className="hide-m hide-t">Status</span><span /></div>
            {V.mine.map(({ m, n, last, recent, freq }) => (
              <div className="rm-mtrow" key={m.id}>
                <div className="rm-tname"><Mono tone={m.tone || 'tone-teal'}>{mono(m.name)}</Mono><div style={{ minWidth: 0 }}><b>{m.name}</b>
                  <div className="rm-tags" style={{ marginTop: 3 }}><span className={`rm-src ${m.source === 'template' ? 'src-t' : 'src-m'}`}>{m.source === 'template' ? 'Platform Template' : 'Created by Me'}</span>{recent && <Tag cls="t-teal">Recently used</Tag>}{freq && <Tag cls="t-gold">Frequently used</Tag>}</div></div></div>
                <span className="hide-m rm-sm">{m.category}</span>
                <span className="hide-m rm-sm">{m.duration} days</span>
                <span className="hide-m hide-t rm-sm">{fD(m.created)}</span>
                <span className="hide-m hide-t rm-sm">{last ? fD(last) : 'Never'}</span>
                <span className="hide-m rm-sm">{plural(n, 'assignment')}</span>
                <span className="hide-t"><span className={`rm-pill sm ${m.status === 'active' ? 's-completed' : m.status === 'draft' ? 's-pending' : 's-cancelled'}`}>{m.status === 'active' ? 'Active' : m.status === 'draft' ? 'Draft' : 'Archived'}</span></span>
                <div className="rm-racts">
                  <button type="button" className="rm-lbtn" onClick={() => R.set({ modal: 'method', viewMethodId: m.id })}>View</button>
                  <button type="button" className="rm-lbtn" onClick={() => R.editMethod(m)}>Edit</button>
                  <button type="button" className="rm-lbtn" onClick={() => R.dupMethod(m)}>Duplicate</button>
                  {m.status !== 'archived' ? <button type="button" className="rm-lbtn" onClick={() => askM(m, n, 'archive')}>Archive</button> : <button type="button" className="rm-lbtn" onClick={() => askM(m, n, 'restore')}>Restore</button>}
                  <button type="button" className="rm-lbtn danger" title={n > 0 ? `Can’t delete: ${plural(n, 'assignment')} depend on this method. Archive it instead.` : 'Delete method'} aria-disabled={n > 0} onClick={() => askM(m, n, 'delete')}>Delete</button>
                </div>
              </div>
            ))}
            {V.mine.length === 0 && <div className="rm-empty"><b>No saved methods match</b>Change the filters or create a new method.</div>}
          </div>
          <p className="rm-muted rm-sm" style={{ marginTop: 10 }}>Delete is only allowed for methods that have never been assigned. Methods with history can be archived instead — archived methods can’t be used for new assignments.</p>
        </>
      )}
    </section>
  );
}
