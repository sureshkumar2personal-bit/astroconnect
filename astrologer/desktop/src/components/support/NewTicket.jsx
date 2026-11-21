import { useState } from 'react';
import { navigate } from '@shared/lib/router.js';
import { Field, Sec } from '../section/kit.jsx';
import { SUBCATEGORIES, SUPPORT_CATEGORIES } from '@shared/data/mockSupport.js';
import { newDraft, supportActions } from '@shared/hooks/useSupport.js';

// New support ticket (AD-160): Category*, Subcategory (not defined yet), Issue description*,
// Related ID, Screenshots/documents. Opened from Audience with a user ID it pre-fills a
// user-block request, which Platform Admin reviews (AD-161). Prototype: files are not uploaded.
const goBack = () => { if (window.history.length > 1) window.history.back(); else navigate('/support'); };

export default function NewTicket({ cat, refId, ui }) {
  const [d, setD] = useState(() => newDraft(SUPPORT_CATEGORIES.includes(cat) ? cat : '', refId || ''));
  const [err, setErr] = useState('');
  const set = (part) => { setErr(''); setD({ ...d, ...part }); };
  const submit = () => {
    const r = supportActions.create(d);
    if (r.error) return setErr(r.error);
    ui.toast(`Ticket ${r.id} created`);
    navigate(`/support/t/${r.id}`);
  };
  return (
    <Sec>
      <div className="form">
        <Field label="Category" req>
          <select value={d.cat} onChange={(e) => set({ cat: e.target.value })}>
            {SUPPORT_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Subcategory">
          <select value={d.sub} onChange={(e) => set({ sub: e.target.value })}>
            {SUBCATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </Field>
        <span className="muted sm">Subcategories aren't defined yet.</span>
        <Field label="Issue description" req>
          <textarea value={d.desc} placeholder="Describe the issue" onChange={(e) => set({ desc: e.target.value })} />
        </Field>
        <Field label="Related ID (Question, Appointment, Consultation, Transaction or User)">
          <input type="text" value={d.ref} placeholder="e.g. TQ-98241" onChange={(e) => set({ ref: e.target.value })} />
        </Field>
        <Field label="Screenshots / documents">
          <input type="file" multiple onChange={(e) => set({ files: [...(e.target.files || [])].map((f) => f.name) })} />
        </Field>
        <p className="warn-t sm" role="alert">{err}</p>
        <div className="actions">
          <button type="button" className="btn btn-o" onClick={goBack}>Cancel</button>
          <button type="button" className="btn btn-p" onClick={submit}>Submit ticket</button>
        </div>
      </div>
    </Sec>
  );
}
