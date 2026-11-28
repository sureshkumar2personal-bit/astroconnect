import { useState } from 'react';
import { navigate } from '@/lib/router.js';
import { profileActions } from '@/hooks/useProfile.js';
import { lastTab, stepOf, tabOf } from './ProfileTabs.jsx';
import VerificationCard from './VerificationCard.jsx';
import { ServiceList } from './ProfileOverview.jsx';

// Edit Profile: one section at a time (AD-79, PRF-01), chosen with the horizontal tabs.
// Fields per section: AD-80 – AD-83. Saving may put "important" changes on hold for Platform Admin
// approval (AD-87; which ones: AP-04-02). Required fields, lengths and file formats are not defined
// in the spec, so none are enforced. File pickers are prototype only: only the file name is kept.
//
// Unsaved edits are kept per tab while Edit Profile is open, so switching tabs loses nothing.
// Save Changes saves only the section on screen (AD-79); Cancel discards all unsaved edits.
export const drafts = {};
export const clearDrafts = () => { Object.keys(drafts).forEach((k) => delete drafts[k]); };

const idOf = (i) => `pf${i}`;

function FieldInput({ f, i, value, onChange }) {
  if (f.kind === 'long') {
    return <textarea className="short" id={idOf(i)} value={value} onChange={(e) => onChange(e.target.value)} />;
  }
  if (f.kind === 'file') {
    return (
      <span className="pf-file">
        <span className="pf-file__name">{value}</span>
        <label className="btn btn-o sm pf-filebtn">
          Choose file
          <input type="file" id={idOf(i)} className="sr" onChange={(e) => { const n = e.target.files?.[0]?.name; if (n) onChange(n); }} />
        </label>
      </span>
    );
  }
  return <input id={idOf(i)} value={value} disabled={f.kind === 'locked'} onChange={(e) => onChange(e.target.value)} />;
}

function SectionForm({ sectionKey, section, ui }) {
  const [values, setValues] = useState(
    () => drafts[sectionKey] || Object.fromEntries(section.fields.map((f) => [f.label, f.value])),
  );
  const set = (label, v) => setValues((s) => {
    const next = { ...s, [label]: v };
    drafts[sectionKey] = next;
    return next;
  });
  const save = () => {
    profileActions.saveSection(sectionKey, values);
    delete drafts[sectionKey];
    ui.toast('Section saved');
    lastTab.key = sectionKey;
    navigate('/profile');
  };
  const cancel = () => {
    clearDrafts();
    lastTab.key = sectionKey;
    navigate('/profile');
  };
  return (
    <>
      <div className="pf-form">
        {section.fields.map((f, i) => (
          <div key={f.label} className={`pf-field${f.kind === 'long' ? ' pf-field--wide' : ''}`}>
            <label htmlFor={idOf(i)}>{f.label}{f.kind === 'locked' && <span className="muted"> · cannot be changed</span>}</label>
            <FieldInput f={f} i={i} value={values[f.label]} onChange={(v) => set(f.label, v)} />
          </div>
        ))}
      </div>
      <p className="muted sm pf-formnote">Some important changes need Platform Admin approval; until then users see the previously verified details.</p>
      <div className="pf-actions">
        <button type="button" className="btn btn-o" onClick={cancel}>Cancel</button>
        <button type="button" className="btn pf-btn-p" onClick={save}>Save Changes</button>
      </div>
    </>
  );
}

export default function ProfileEdit({ sectionKey, s, ui, ctx }) {
  const tab = tabOf(sectionKey);
  const section = s.sections[sectionKey];
  const done = () => { lastTab.key = sectionKey; navigate('/profile'); };
  return (
    <section className="pf-card" role="tabpanel" id="pf-panel" aria-labelledby={`pf-tab-${sectionKey}`}>
      <div className="pf-card__h">
        <div className="pf-card__t">
          <div className="pf-eyebrow">Edit · {stepOf(sectionKey)}</div>
          <h2>{tab.label}</h2>
          <p>{tab.desc}</p>
        </div>
      </div>
      <div className="pf-card__b">
        {section ? (
          <SectionForm key={sectionKey} sectionKey={sectionKey} section={section} ui={ui} />
        ) : (
          <>
            {sectionKey === 'verification' ? <VerificationCard s={s} ui={ui} /> : <ServiceList ctx={ctx} />}
            <div className="pf-actions">
              <button type="button" className="btn btn-o" onClick={done}>Done</button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
