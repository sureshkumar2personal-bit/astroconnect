import { useState } from 'react';
import { navigate } from '@shared/lib/router.js';
import { profileActions } from '@shared/hooks/useProfile.js';
import { Field, Sec } from '../section/kit.jsx';

// Edit one profile section (AD-79, PRF-01). Fields per section: AD-80 – AD-83.
// Saving may put "important" changes on hold for Platform Admin approval (AD-87; which ones: AP-04-02).
// Required fields, lengths and file formats are not defined in the spec, so none are enforced.
// File pickers are prototype only: only the chosen file name is kept, nothing is uploaded.
const idOf = (i) => `pf${i}`;

function FieldInput({ f, i, value, onChange }) {
  if (f.kind === 'long') {
    return <textarea className="short" id={idOf(i)} value={value} onChange={(e) => onChange(e.target.value)} />;
  }
  if (f.kind === 'file') {
    return (
      <span className="row pf-file">
        <span className="file">{value}</span>
        <input type="file" id={idOf(i)} onChange={(e) => { const n = e.target.files?.[0]?.name; if (n) onChange(n); }} />
      </span>
    );
  }
  return <input id={idOf(i)} value={value} disabled={f.kind === 'locked'} onChange={(e) => onChange(e.target.value)} />;
}

export default function ProfileEdit({ sectionKey, section, ui }) {
  const [values, setValues] = useState(() => Object.fromEntries(section.fields.map((f) => [f.label, f.value])));
  const save = () => {
    profileActions.saveSection(sectionKey, values);
    ui.toast('Section saved');
    navigate('/profile');
  };
  return (
    <Sec className="form">
      {section.fields.map((f, i) => (
        <Field key={f.label} label={f.label}>
          <FieldInput f={f} i={i} value={values[f.label]} onChange={(v) => setValues((s) => ({ ...s, [f.label]: v }))} />
        </Field>
      ))}
      <p className="muted sm">Some important changes need Platform Admin approval; until then users see the previously verified details.</p>
      <div className="actions">
        <button type="button" className="btn btn-o" onClick={() => navigate('/profile')}>Cancel</button>
        <button type="button" className="btn btn-p" onClick={save}>Save section</button>
      </div>
    </Sec>
  );
}
