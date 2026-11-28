import { useEffect, useRef } from 'react';
import { Ic, Tile, Mono } from './rmShared.jsx';
import { mono, plural } from '@/lib/remedyModel.js';
import { CATEGORIES, imgOf } from '@/data/remedyData.js';
import * as R from '@/hooks/useRemedies.js';

const size = (b) => (b >= 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);

/** Create New Method / Customize Template / Edit Method: five sections with a live preview.
 *  The remedy image is a real file chosen from the device; it is only kept in this session. */
export default function RemMethodForm({ s, d }) {
  const f = s.form; const fileRef = useRef(null);
  useEffect(() => { if (!f) R.ensureForm(); }, [f]);
  if (!f) return null;
  const editing = f.mode === 'edit'; const img = imgOf(f.image);
  const n = editing ? d.all.filter((x) => x.methodId === f.methodId).length : 0;
  const pickFile = (e) => {
    const file = e.target.files?.[0]; e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) { R.toast('Please choose a JPG or PNG image.', 'err'); return; }
    R.setF('image', { url: URL.createObjectURL(file), file: file.name, size: size(file.size) });
  };
  const pvMats = f.materials.filter((x) => x.name.trim()); const pvSteps = f.steps.filter((x) => x.title.trim() || x.detail.trim());
  const title = editing ? 'Edit Method' : f.mode === 'template' ? 'Customize Template' : 'Create New Method';
  return (
    <section>
      <div className="rm-ph"><div><h1 className="rm-h1">{title}</h1></div></div>
      {f.mode === 'template' && <div className="rm-info gold"><Ic n="info" /><span>Customizing the Platform Template <b>{f.templateName}</b>. Saving creates your own copy in My Saved Methods — the original template is never modified, and future template updates won’t change your copy.</span></div>}
      {editing && <div className="rm-info"><Ic n="info" /><span>Edits apply to future assignments only. {plural(n, 'existing assignment')} {n === 1 ? 'keeps its' : 'keep their'} snapshot from the day it was assigned — they won’t change.</span></div>}

        <div className="rm-fsecs">
          <section className="rm-fsec">
            <div className="rm-fsec__h"><span className="num">1</span>Basic Details</div>
            <div className="rm-fbody rm-fgrid">
              <label className="rm-full"><span className="rm-lab">Remedy Name *</span><input className="rm-inp" type="text" value={f.name} onChange={(e) => R.setF('name', e.target.value)} placeholder="e.g. Ganapathi Homam" /></label>
              <label><span className="rm-lab">Category</span><select className="rm-sel" style={{ width: '100%' }} value={f.category} onChange={(e) => R.setF('category', e.target.value)}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></label>
              <label><span className="rm-lab">Recommended Duration (days) *</span><input className="rm-inp" type="number" min="1" max="60" value={f.duration} onChange={(e) => R.setF('duration', e.target.value)} /><span className="rm-hint">You can customize the duration for each User when assigning.</span></label>
              <label className="rm-full"><span className="rm-lab">Short Description</span><input className="rm-inp" type="text" value={f.short} onChange={(e) => R.setF('short', e.target.value)} placeholder="One line shown in lists" /></label>
              <label className="rm-full"><span className="rm-lab">Detailed Description</span><textarea className="rm-inp" rows={4} value={f.description} onChange={(e) => R.setF('description', e.target.value)} placeholder="Purpose, ideal timing and who it suits" /></label>
            </div>
          </section>
          <div className="rm-fcol">
          <section className="rm-fsec">
            <div className="rm-fsec__h"><span className="num">2</span>Remedy Image<span className="meta">Optional</span></div>
            <div className="rm-fbody">
              <input ref={fileRef} type="file" accept="image/png,image/jpeg" className="rm-sr" tabIndex={-1} aria-hidden="true" onChange={pickFile} />
              {img ? (
                <div className="rm-imgwrap">
                  <Tile img={img} size="wide" />
                  <div><b>{img.file}</b><div className="rm-muted rm-sm">{img.size}</div>
                    <div className="rm-simrow"><button type="button" className="rm-btn rm-btn--s rm-btn--sm" onClick={() => fileRef.current?.click()}>Replace Image</button><button type="button" className="rm-btn rm-btn--dt rm-btn--sm" onClick={() => R.setF('image', null)}>Remove</button></div></div>
                </div>
              ) : (
                <button type="button" className="rm-dropzone" onClick={() => fileRef.current?.click()}><Ic n="image" size={28} /><b>Add Remedy Image</b><span className="rm-sm">JPG or PNG from this device</span></button>
              )}
            </div>
          </section>
          <section className="rm-fsec">
            <div className="rm-fsec__h"><span className="num">3</span>Additional Notes<span className="meta">Optional</span></div>
            <div className="rm-fbody"><label><span className="rm-sr">Additional notes</span><textarea className="rm-inp" rows={3} value={f.notes} onChange={(e) => R.setF('notes', e.target.value)} placeholder="Anything else the User should know" /></label></div>
          </section>
          </div>
          <section className="rm-fsec">
            <div className="rm-fsec__h"><span className="num">4</span>Required Materials<span className="meta">{f.materials.length} items</span></div>
            <div className="rm-fbody">
              {f.materials.map((m, i) => (
                <div className="rm-mrow" key={m.id}>
                  <label><span className="rm-sr">Material {i + 1} name</span><input className="rm-inp" type="text" value={m.name} onChange={(e) => R.setFL('materials', i, 'name', e.target.value)} placeholder="Material name" /></label>
                  <label><span className="rm-sr">Material {i + 1} quantity</span><input className="rm-inp" type="text" value={m.qty} onChange={(e) => R.setFL('materials', i, 'qty', e.target.value)} placeholder="Quantity (optional)" /></label>
                  <button type="button" className="rm-iconbtn" aria-label={`Remove material ${i + 1}`} onClick={() => R.delFL('materials', i)}><Ic n="trash" /></button>
                </div>
              ))}
              <button type="button" className="rm-btn rm-btn--g rm-btn--sm" onClick={() => R.addFL('materials', { name: '', qty: '' })}><Ic n="plus" size={15} />Add Material</button>
            </div>
          </section>
          <section className="rm-fsec">
            <div className="rm-fsec__h"><span className="num">5</span>Step-by-Step Instructions<span className="meta">{f.steps.length} steps</span></div>
            <div className="rm-fbody">
              {f.steps.map((x, i) => (
                <div className="rm-srow" key={x.id}>
                  <span className="rm-snum">{i + 1}</span>
                  <div className="rm-sfields">
                    <label><span className="rm-sr">Step {i + 1} title</span><input className="rm-inp" type="text" value={x.title} onChange={(e) => R.setFL('steps', i, 'title', e.target.value)} placeholder="Step title" /></label>
                    <label><span className="rm-sr">Step {i + 1} instructions</span><textarea className="rm-inp" rows={2} style={{ minHeight: 64 }} value={x.detail} onChange={(e) => R.setFL('steps', i, 'detail', e.target.value)} placeholder="Detailed instructions" /></label>
                  </div>
                  <div className="rm-sctl">
                    <button type="button" className="rm-iconbtn" aria-label={`Move step ${i + 1} up`} disabled={i === 0} onClick={() => R.moveFL('steps', i, -1)}><Ic n="up" /></button>
                    <button type="button" className="rm-iconbtn" aria-label={`Move step ${i + 1} down`} disabled={i === f.steps.length - 1} onClick={() => R.moveFL('steps', i, 1)}><Ic n="down" /></button>
                    <button type="button" className="rm-iconbtn" aria-label={`Remove step ${i + 1}`} onClick={() => R.delFL('steps', i)}><Ic n="trash" /></button>
                  </div>
                </div>
              ))}
              <button type="button" className="rm-btn rm-btn--g rm-btn--sm" onClick={() => R.addFL('steps', { title: '', detail: '' })}><Ic n="plus" size={15} />Add Step</button>
            </div>
          </section>
        </div>
        <section className="rm-panel rm-preview" aria-label="Method preview">
          <div className="rm-eyebrow">Preview · how this method will appear</div>
          <div className="rm-pvgrid">
            <div>
          {img && <div style={{ marginTop: 10 }}><Tile img={img} size="wide" /></div>}
          <div className="rm-pvtop"><Mono tone="tone-teal" size="lg">{mono(f.name || 'New Method')}</Mono><div><div className="rm-pvname">{f.name.trim() || 'Untitled Method'}</div><div className="rm-muted rm-sm">{f.category} · {parseInt(f.duration, 10) || 0} days · {f.templateId ? `Platform Template · ${f.templateName}` : 'Created by Me'}</div></div></div>
          <p style={{ fontSize: 13.5 }}>{f.short || 'Add a short description to help you recognise this method.'}</p>
          {f.description.trim() && <p className="rm-muted" style={{ margin: '8px 0 0', fontSize: 13 }}>{f.description}</p>}
            </div>
            <div>
          <p className="rm-phead">Materials</p>
          {pvMats.length ? <div className="rm-mats">{pvMats.map((x) => <span className="rm-mat" key={x.id}>{x.name}{x.qty ? ` · ${x.qty}` : ''}</span>)}</div> : <p className="rm-muted rm-sm">No materials added yet.</p>}
            </div>
            <div>
          <p className="rm-phead">Steps</p>
          {pvSteps.length ? <div className="rm-ol">{pvSteps.map((x, i) => <div className="rm-oli" key={x.id}><i>{i + 1}</i><div><b>{x.title || 'Step'}</b>{x.detail}</div></div>)}</div> : <p className="rm-muted rm-sm">No steps added yet.</p>}
          {f.notes.trim() && <div className="rm-anote">{f.notes}</div>}
            </div>
          </div>
        </section>
      <div className="rm-formbar">
        <button type="button" className="rm-btn rm-btn--g" onClick={() => R.back(R.PATH.methods)}>Cancel</button>
        <div className="rm-formbar__main">
          <button type="button" className="rm-btn rm-btn--s" onClick={() => R.saveForm(true)}>Save as Draft</button>
          <button type="button" className="rm-btn rm-btn--p" onClick={() => R.saveForm(false)}><Ic n="check" size={16} />Save Method</button>
        </div>
      </div>
    </section>
  );
}
