import { useState } from 'react';
import { navigate } from '@shared/lib/router.js';
import { contentActions, isBenefit } from '@shared/hooks/useContent.js';
import { AUDIENCES, RASI, TIERS } from '@shared/data/mockContent.js';
import { Badge, Field, Seg } from '../section/kit.jsx';
import ContentPreview from './ContentPreview.jsx';

// Content editor (AD-144): split screen — editor on the left, live User App preview on the right;
// Editor/Preview tabs on phones. Fields per kind: General Post Text/Image (AD-139), 12-Rasi template
// (AD-141), special templates (AD-142), custom content (AD-143). Image upload is prototype only:
// only the file name is kept, nothing is uploaded.
const TOAST = { Draft: 'Draft saved', Scheduled: 'Scheduled', Published: 'Published' };

export default function ContentEditor({ s, mobile, ui }) {
  const e = s.ed;
  const [err, setErr] = useState('');
  const set = (part) => { setErr(''); contentActions.set(part); };
  const benefit = isBenefit(e.kind);
  const save = (action) => {
    const m = contentActions.save(action);
    if (m) return setErr(m);
    ui.toast(TOAST[action]);
    navigate('/content');
  };

  const editor = (
    <section className="card sec form cm-ed">
      <span className="cm-kind"><Badge kind="info">{e.kind}</Badge></span>
      <Field label={e.kind === 'Custom' ? 'Custom Title' : 'Title'} req>
        <input value={e.title} onChange={(ev) => set({ title: ev.target.value })} />
      </Field>
      {e.kind === 'General Post' && (
        <div><b className="sm">Format</b><Seg label="Format" options={['Text', 'Image']} value={e.fmt} onChange={(fmt) => set({ fmt })} /></div>
      )}
      {e.rasi ? (
        <div className="stack">
          <b className="sm">Predictions for all 12 Rasis</b>
          {RASI.map((r, i) => (
            <div key={r} className="rasi">
              <b className="sm" id={`cm-rasi-${i}`}>{r}</b>
              <textarea aria-labelledby={`cm-rasi-${i}`} value={e.rasi[i]} placeholder={`Prediction for ${r.split(' ')[0]}`}
                onChange={(ev) => { setErr(''); contentActions.setRasi(i, ev.target.value); }} />
            </div>
          ))}
        </div>
      ) : (
        <Field label="Text / Description" req={e.fmt !== 'Image'}>
          <textarea value={e.text} placeholder="Write your content…" onChange={(ev) => set({ text: ev.target.value })} />
        </Field>
      )}
      {(e.fmt === 'Image' || e.rasi || e.kind !== 'General Post') && (
        <Field label="Image upload">
          <input type="file" accept="image/*" onChange={(ev) => set({ img: ev.target.files?.[0]?.name || '' })} />
        </Field>
      )}
      <fieldset>
        <legend>Audience{benefit ? ' (subscription tiers)' : ''}</legend>
        <div className="row wrap">
          {(benefit ? TIERS : AUDIENCES).map((a) => (
            <label key={a} className="check">
              <input type="checkbox" checked={e.aud.includes(a)} onChange={() => { setErr(''); contentActions.toggleAud(a); }} /> {a}
            </label>
          ))}
        </div>
        {benefit && <span className="muted sm">Each tier can have different content.</span>}
      </fieldset>
      <Field label="Schedule for">
        <input type="datetime-local" value={e.when} onChange={(ev) => set({ when: ev.target.value })} />
      </Field>
      <p className="warn-t sm" role="alert">{err}</p>
      <div className="actions">
        <button type="button" className="btn btn-o" onClick={() => save('Draft')}>Save Draft</button>
        <button type="button" className="btn btn-o" onClick={() => save('Scheduled')}>Schedule</button>
        <button type="button" className="btn btn-p" onClick={() => save('Published')}>Publish Now</button>
      </div>
    </section>
  );

  const preview = (
    <section className="card sec">
      <h2 className="h">Live User App preview</h2>
      <ContentPreview e={e} />
    </section>
  );

  if (mobile) {
    return (
      <>
        <Seg label="Editor or preview" options={[['editor', 'Editor'], ['preview', 'Preview']]} value={s.pv} onChange={contentActions.setPv} />
        {s.pv === 'editor' ? editor : preview}
      </>
    );
  }
  return <div className="split2">{editor}{preview}</div>;
}
