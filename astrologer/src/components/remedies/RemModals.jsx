import { Ic, Tile, Mono, Modal, ModalHead, Search, Segc, Tag } from './rmShared.jsx';
import { SERVICE_NAMES, addD, fD, initials, mono, plural } from '@/lib/remedyModel.js';
import { TEMPLATES, imgOf } from '@/data/remedyData.js';
import * as R from '@/hooks/useRemedies.js';
import { minDur } from '@/hooks/useRemedies.js';

const Steps = ({ steps }) => <div className="rm-ol">{steps.map((x, i) => <div className="rm-oli" key={i}><i>{i + 1}</i><div><b>{x.title}</b>{x.detail}</div></div>)}</div>;
const Mats = ({ list }) => <div className="rm-mats">{list.map((m) => <span className="rm-mat" key={m.name}>{m.name} · {m.qty}</span>)}</div>;

/** Assign Remedy: pick a User, the service, a saved (active) method, then review and customise. */
function AssignModal({ s, d }) {
  const f = s.assign;
  const uq = f.userQ.trim().toLowerCase(); const mq = f.methodQ.trim().toLowerCase();
  const m = d.M[f.methodId]; const u = d.U[f.userId];
  const users = s.users.filter((x) => !uq || x.name.toLowerCase().includes(uq) || x.ref.toLowerCase().includes(uq));
  const meths = s.methods.filter((x) => x.status === 'active' && (!mq || x.name.toLowerCase().includes(mq)));
  const dup = u && m ? d.all.filter((x) => x.userId === u.id && x.methodId === m.id) : [];
  const dur = parseInt(f.duration, 10) || 0;
  const set = R.setAsg;
  return (
    <Modal wide label="Assign Remedy">
      <ModalHead><p className="rm-ptitle lg">Assign Remedy</p></ModalHead>
      <div className="rm-mb">
        <div className="rm-steplabel">1 · Select User</div>
        <Search label="Search users" placeholder="Search by name or User ID" value={f.userQ} onChange={(v) => set({ userQ: v })} style={{ flex: 'none' }} />
        <div className="rm-picklist">{users.map((x) => {
          const n = d.all.filter((y) => y.userId === x.id && y.active).length;
          return <button type="button" key={x.id} className={`rm-pick${f.userId === x.id ? ' on' : ''}`} onClick={() => set({ userId: x.id })}><span className="rm-av">{initials(x.name)}</span><span><b>{x.name}</b><small>{x.ref} · {n ? plural(n, 'active remedy').replace('remedys', 'remedies') : 'No active remedies'}</small></span></button>;
        })}</div>
        {users.length === 0 && <p className="rm-hint">No Users match that search.</p>}
        <div className="rm-steplabel">2 · Service Reference</div>
        <Segc label="Service reference" items={Object.keys(SERVICE_NAMES).map((k) => ({ label: SERVICE_NAMES[k], on: f.service === k, onClick: () => set({ service: k }) }))} />
        <div className="rm-steplabel">3 · Select Saved Method</div>
        <Search label="Search methods" placeholder="Search your active methods" value={f.methodQ} onChange={(v) => set({ methodQ: v })} style={{ flex: 'none' }} />
        <div className="rm-picklist">{meths.map((x) => (
          <button type="button" key={x.id} className={`rm-pick${f.methodId === x.id ? ' on' : ''}`} onClick={() => set({ methodId: x.id, duration: String(x.duration), instructions: x.description })}><Mono tone={x.tone || 'tone-teal'} size="sm">{mono(x.name)}</Mono><span><b>{x.name}</b><small>{x.category} · {x.duration} days</small></span></button>
        ))}</div>
        {m && (
          <>
            <div className="rm-steplabel">4 · Review &amp; customize</div>
            <div className="rm-review"><Mono tone="tone-teal">{mono(m.name)}</Mono><div><b>{m.name}</b> <span className="rm-muted rm-sm">· {m.category} · {m.source === 'template' ? 'Platform Template' : 'Created by Me'}</span><p>{m.short}</p><div className="rm-hint">Default {m.duration} days · {plural(m.materials.length, 'material')} · {plural(m.steps.length, 'step')}. A snapshot is saved with this assignment.</div></div></div>
            {dup.length > 0 && <div className="rm-info amber"><Ic n="info" /><span>{u.name} already has {plural(dup.length, `${m.name} assignment`)}. This creates a separate assignment with its own ID, schedule and history — earlier ones stay unchanged.</span></div>}
            <div className="rm-fgrid">
              <label><span className="rm-lab">Assignment Date</span><input className="rm-inp" type="date" value={f.assigned} onChange={(e) => set({ assigned: e.target.value })} /></label>
              <label><span className="rm-lab">Start Date</span><input className="rm-inp" type="date" value={f.start} onChange={(e) => set({ start: e.target.value })} /><span className="rm-hint">{f.start && dur ? `Ends ${fD(addD(f.start, dur - 1))}` : ''}</span></label>
              <label><span className="rm-lab">Duration in Days</span><input className="rm-inp" type="number" min="1" max="60" value={f.duration} onChange={(e) => set({ duration: e.target.value })} /><span className="rm-hint">Method default: {m.duration} days{dur && dur !== m.duration ? ' · customized for this User' : ''}</span></label>
              <div />
              <label className="rm-full"><span className="rm-lab">Customized Instructions</span><textarea className="rm-inp" rows={3} value={f.instructions} onChange={(e) => set({ instructions: e.target.value })} /></label>
              <label className="rm-full"><span className="rm-lab">Astrologer Note <span className="rm-muted">(optional, shown to the User)</span></span><textarea className="rm-inp" rows={2} style={{ minHeight: 64 }} value={f.note} onChange={(e) => set({ note: e.target.value })} placeholder="e.g. Begin on Wednesday morning" /></label>
            </div>
          </>
        )}
      </div>
      <div className="rm-mf">
        <span className="rm-muted rm-sm">{u && m ? `${u.name} · ${m.name} · ${dur || '?'} days · ${SERVICE_NAMES[f.service]}` : 'Select a User and a Saved Method'}</span>
        <div className="btns"><button type="button" className="rm-btn rm-btn--g" onClick={R.closeModal}>Cancel</button><button type="button" className="rm-btn rm-btn--p" onClick={R.confirmAssign}><Ic n="check" size={16} />Assign Remedy</button></div>
      </div>
    </Modal>
  );
}

function EditModal({ s, d, id }) {
  const cd = d.byId[id]; const e = s.editA; if (!cd || !e) return null;
  const min = minDur(cd.a); const dur = parseInt(e.duration, 10) || 0;
  return (
    <Modal label="Edit Assignment">
      <ModalHead><p className="rm-ptitle lg">Edit Assignment</p><div className="rm-muted rm-sm">{cd.userName} · {cd.remedyName}</div></ModalHead>
      <div className="rm-mb">
        <label><span className="rm-lab">Duration in Days</span><input className="rm-inp" type="number" min={min} max="60" value={e.duration} onChange={(ev) => R.setEdit({ duration: ev.target.value })} />
          <span className="rm-hint">{cd.hasLogs ? `Minimum ${min} days — Day 1–${min} already have user-reported statuses, which are preserved.` : 'No days recorded yet.'}</span>
          <span className="rm-hint" style={{ display: 'block' }}>{dur ? `Schedule will end ${fD(addD(cd.start, dur - 1))} (currently ${cd.endF})` : ''}</span></label>
        <label><span className="rm-lab">Instructions for the remaining days</span><textarea className="rm-inp" rows={4} value={e.instructions} onChange={(ev) => R.setEdit({ instructions: ev.target.value })} /></label>
        <label><span className="rm-lab">Assignment Note</span><textarea className="rm-inp" rows={2} style={{ minHeight: 64 }} value={e.note} onChange={(ev) => R.setEdit({ note: ev.target.value })} /></label>
        <div className="rm-info" style={{ margin: 0 }}><Ic n="info" /><span>Completed and skipped days, their dates and timestamps are preserved. The change is recorded in Activity History with the previous value.</span></div>
      </div>
      <div className="rm-mf"><div className="btns"><button type="button" className="rm-btn rm-btn--g" onClick={R.closeModal}>Cancel</button><button type="button" className="rm-btn rm-btn--p" onClick={R.saveEdit}>Save Changes</button></div></div>
    </Modal>
  );
}

function ConfirmModal({ c }) {
  return (
    <Modal label={c.title} style={{ maxWidth: 480, marginTop: '10vh' }}>
      <ModalHead><p className="rm-ptitle lg">{c.title}</p></ModalHead>
      <div className="rm-mb">
        <p>{c.body}</p>
        {c.needReason && <label><span className="rm-lab">{c.reasonLabel}</span><textarea className="rm-inp" rows={3} value={c.reason} onChange={(e) => R.set({ confirm: { ...c, reason: e.target.value } })} placeholder="This is saved in the assignment history" /></label>}
      </div>
      <div className="rm-mf"><div className="btns"><button type="button" className="rm-btn rm-btn--g" onClick={R.closeModal}>Go back</button><button type="button" className={`rm-btn ${c.danger ? 'rm-btn--d' : 'rm-btn--p'}`} onClick={R.doConfirm}>{c.confirmLabel}</button></div></div>
    </Modal>
  );
}

function TemplateModal({ id }) {
  const t = TEMPLATES.find((x) => x.id === id); if (!t) return null;
  return (
    <Modal label="Template preview" style={{ maxWidth: 640 }}>
      <ModalHead><div className="rm-pvtop" style={{ margin: 0 }}><Mono tone={t.tone} size="lg">{mono(t.name)}</Mono><div><Tag cls="t-gold">Platform Template</Tag><div className="rm-pvname">{t.name}</div><div className="rm-muted rm-sm">{t.category} · {t.duration} days</div></div></div></ModalHead>
      <div className="rm-mb">
        <p><b>{t.short}</b></p><p className="rm-muted">{t.description}</p>
        <div><p className="rm-phead">Materials</p><Mats list={t.materials} /></div>
        <div><p className="rm-phead">Steps</p><Steps steps={t.steps} /></div>
      </div>
      <div className="rm-mf"><span className="rm-muted rm-sm">Using it creates your own editable copy.</span><div className="btns"><button type="button" className="rm-btn rm-btn--g" onClick={R.closeModal}>Close</button><button type="button" className="rm-btn rm-btn--p" onClick={() => R.useTemplate(t)}>Use Template</button></div></div>
    </Modal>
  );
}

function MethodModal({ s, d, id }) {
  const m = d.M[id]; if (!m) return null;
  const n = d.all.filter((x) => x.methodId === m.id).length; const img = imgOf(m.image);
  const meta = [['Source', m.source === 'template' ? `Platform Template · ${m.templateName}` : 'Created by Me'], ['Status', m.status === 'active' ? 'Active' : m.status === 'draft' ? 'Draft' : 'Archived'], ['Created', fD(m.created)], ['Last edited', fD(m.edited)], ['Assignments', String(n)]];
  return (
    <Modal label="Method details" style={{ maxWidth: 640 }}>
      <ModalHead><div className="rm-pvtop" style={{ margin: 0 }}><Mono tone={m.tone || 'tone-teal'} size="lg">{mono(m.name)}</Mono><div><div className="rm-pvname">{m.name}</div><div className="rm-muted rm-sm">{m.category} · {m.duration} days</div></div></div></ModalHead>
      <div className="rm-mb">
        {img && <Tile img={img} size="wide" caption={img.file} />}
        <div className="rm-facts" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', margin: 0 }}>{meta.map(([l, v]) => <div className="rm-fact" key={l}><span>{l}</span><b>{v}</b></div>)}</div>
        <p><b>{m.short}</b></p><p className="rm-muted">{m.description}</p>
        <div><p className="rm-phead">Materials</p><Mats list={m.materials} /></div>
        <div><p className="rm-phead">Steps</p><Steps steps={m.steps} /></div>
        {m.notes && <div className="rm-anote">{m.notes}</div>}
      </div>
      <div className="rm-mf"><div className="btns"><button type="button" className="rm-btn rm-btn--g" onClick={R.closeModal}>Close</button><button type="button" className="rm-btn rm-btn--s" onClick={() => R.editMethod(m)}>Edit</button>{m.status === 'active' && <button type="button" className="rm-btn rm-btn--p" onClick={() => R.openAssign({ methodId: m.id })}>Assign this Remedy</button>}</div></div>
    </Modal>
  );
}

function Lightbox({ lb }) {
  const p = lb.photos[lb.idx]; const n = lb.photos.length;
  const go = (dir) => R.set({ lightbox: { ...lb, idx: (lb.idx + dir + n) % n } });
  return (
    <div className="rm-lbox" role="dialog" aria-modal="true" aria-label="Photo preview">
      <div className="rm-lbtop"><span>{lb.idx + 1} / {n} · Final completion photos</span><button type="button" className="rm-iconbtn" aria-label="Close preview" onClick={R.closeModal}><Ic n="x" /></button></div>
      <div className="rm-lbstage">
        {n > 1 && <button type="button" className="rm-iconbtn" aria-label="Previous photo" onClick={() => go(-1)}><Ic n="arrowLeft" /></button>}
        <Tile img={p} size="big" />
        {n > 1 && <button type="button" className="rm-iconbtn" aria-label="Next photo" onClick={() => go(1)}><Ic n="chevronRight" /></button>}
      </div>
      <div className="rm-lbcap">{p.caption}</div>
    </div>
  );
}

/** The one open dialog (store.modal). `assignmentId` is the assignment open in the page, if any. */
export default function RemModals({ s, d, assignmentId }) {
  if (s.modal === 'assign' && s.assign) return <AssignModal s={s} d={d} />;
  if (s.modal === 'edit') return <EditModal s={s} d={d} id={assignmentId} />;
  if (s.modal === 'confirm' && s.confirm) return <ConfirmModal c={s.confirm} />;
  if (s.modal === 'tpl') return <TemplateModal id={s.tplId} />;
  if (s.modal === 'method') return <MethodModal s={s} d={d} id={s.viewMethodId} />;
  if (s.modal === 'lightbox' && s.lightbox) return <Lightbox lb={s.lightbox} />;
  return null;
}
