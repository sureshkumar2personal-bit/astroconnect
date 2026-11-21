import { useState } from 'react';
import { Field, Seg } from '../section/kit.jsx';
import { liveActions } from '@shared/hooks/useLive.js';
import { AUDIENCES, TIERS } from '@shared/data/mockLive.js';

// Create Live (AD-114): Schedule Live / Start Now, Topic*, Description*, Thumbnail, Date & time, Audience.
export default function LiveCreateForm({ form: f, onPreview, onDone }) {
  const [err, setErr] = useState('');
  const set = (part) => { setErr(''); liveActions.setForm(part); };
  const submit = () => {
    const mode = f.mode;
    const e = liveActions.create();
    if (e) return setErr(e);
    onDone(mode);
  };
  return (
    <div className="form">
      <Seg label="Live type" options={[['schedule', 'Schedule Live'], ['now', 'Start Now']]} value={f.mode} onChange={(mode) => set({ mode })} />
      <Field label="Topic" req>
        <input value={f.topic} placeholder="e.g. Sani Peyarchi Q&A" onChange={(e) => set({ topic: e.target.value })} />
      </Field>
      <Field label="Description" req>
        <textarea className="short" value={f.desc} placeholder="What will you cover?" onChange={(e) => set({ desc: e.target.value })} />
      </Field>
      <Field label="Thumbnail (optional)">
        <input type="file" accept="image/*" onChange={(e) => set({ thumb: e.target.files?.[0]?.name || '' })} />
      </Field>
      {f.mode === 'schedule' && (
        <Field label="Date & time" req>
          <input type="datetime-local" value={f.when} onChange={(e) => set({ when: e.target.value })} />
        </Field>
      )}
      <fieldset>
        <legend>Audience — only they are notified and can comment</legend>
        <Seg label="Audience" options={AUDIENCES} value={f.aud} onChange={(aud) => set({ aud })} />
        {f.aud === 'Specific tiers' && (
          <div className="row wrap live-tiers">
            {TIERS.map((t) => (
              <label key={t} className="check"><input type="checkbox" checked={f.tiers.includes(t)} onChange={() => { setErr(''); liveActions.toggleTier(t); }} /> {t}</label>
            ))}
          </div>
        )}
      </fieldset>
      <p className="warn-t sm" role="alert">{err}</p>
      <div className="actions">
        <button type="button" className="btn btn-o" onClick={onPreview}>Preview / Test</button>
        <button type="button" className="btn btn-p" onClick={submit}>{f.mode === 'schedule' ? 'Schedule Live' : 'Go Live now'}</button>
      </div>
    </div>
  );
}
