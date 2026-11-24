import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/Icon.jsx';
import { FILE_TYPES, MAX_CHARS, MAX_FILES, MAX_MB } from '@/lib/textQuestions.js';

// Answer editor (AD-36 – AD-39, AD-45): text up to 1,500 characters, Voice to Text (prototype),
// Save Draft / Auto Save, own templates, up to three JPEG/PDF/TXT attachments of max 10 MB, links,
// optional remedy, Preview before Submit. Shared by the question details pane and the Write Answer screen.
// "Remember This Question" is not included (removed, R-03 / AD-36).
export default function AnswerEditor({ q, tq, onPreview, onAddLink, toast }) {
  const [saved, setSaved] = useState(q.draft ? 'Draft saved' : '');
  const fileRef = useRef(null);
  const remedyRef = useRef(null);
  // The remedy box (AD-39) opens from the Attach Remedy tool; it is open from the start only if a remedy is already written.
  const [remedyOpen, setRemedyOpen] = useState(!!q.remedy);
  useEffect(() => { if (remedyOpen && !q.remedy) remedyRef.current?.focus(); }, [remedyOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const setText = (text) => { tq.setDraft(q.id, text); setSaved('Auto-saved just now'); };
  const applyTemplate = (id) => {
    const t = tq.templates.find((x) => x.id === id);
    if (t) setText((q.draft + (q.draft ? '\n' : '') + t.text).slice(0, MAX_CHARS));
  };
  // The file is only listed in this prototype; nothing is uploaded.
  const pickFile = (e) => {
    const f = e.target.files[0];
    e.target.value = '';
    if (!f) return;
    if (q.att.length >= MAX_FILES) return toast('Maximum three attachments per answer.');
    if (!FILE_TYPES.test(f.name)) return toast('Only JPEG, PDF or TXT files are allowed.');
    if (f.size > MAX_MB * 1048576) return toast('Each file must be 10 MB or smaller.');
    tq.addAttachment(q.id, { name: f.name, size: `${(f.size / 1048576).toFixed(1)} MB` });
  };

  return (
    <>
      <div className="etools">
        <button type="button" className="btn btn-o sm" onClick={() => toast('Voice to Text: speak and your words appear in the answer (prototype).')}>
          <Icon name="mic" size={16} />Voice to Text
        </button>
        <label className="etools__tpl">
          <span className="sr">Use template</span>
          <Icon name="edit" size={16} />
          <select value="" onChange={(e) => applyTemplate(e.target.value)}>
            <option value="">Use Template</option>
            {tq.templates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </label>
        <button type="button" className="btn btn-o sm" onClick={onAddLink}><Icon name="link" size={16} />Add Link</button>
        <button type="button" className="btn btn-o sm" onClick={() => fileRef.current?.click()}>
          <Icon name="paperclip" size={16} />Attach File <span className="muted">{q.att.length}/{MAX_FILES}</span>
        </button>
        <button type="button" className="btn btn-o sm" aria-expanded={remedyOpen} onClick={() => (remedyOpen ? remedyRef.current?.focus() : setRemedyOpen(true))}><Icon name="lotus" size={16} />Attach Remedy</button>
        <input ref={fileRef} type="file" accept=".jpg,.jpeg,.pdf,.txt" className="sr" tabIndex={-1} aria-hidden="true" onChange={pickFile} />
      </div>
      <label className="sr" htmlFor="tq-ans">Your answer</label>
      <textarea id="tq-ans" maxLength={MAX_CHARS} value={q.draft} onChange={(e) => setText(e.target.value)} placeholder="Write your answer here, or use Voice to Text…" />
      <span className="sr" aria-live="polite">{saved}</span>
      {(q.att.length > 0 || q.links.length > 0) && (
        <div className="files">
          {q.att.map((f, i) => (
            <span key={`${f.name}-${i}`} className="file">
              {f.name} <span className="muted">{f.size}</span>
              <button type="button" className="x" aria-label={`Remove ${f.name}`} onClick={() => tq.removeAttachment(q.id, i)}>×</button>
            </span>
          ))}
          {q.links.map((l, i) => <span key={`${l}-${i}`} className="file link">{l}</span>)}
        </div>
      )}
      {remedyOpen && (
        <label className="sm stack-label"><b>Remedy</b>
          <textarea ref={remedyRef} id="tq-rem" className="short" value={q.remedy} onChange={(e) => tq.setRemedy(q.id, e.target.value)} placeholder="Appears in the user's Remedy Tracker" />
        </label>
      )}
      <div className="aed-foot">
        <div className="aed-count" aria-live="off">
          <span><b>{q.draft.length}</b> / {MAX_CHARS.toLocaleString('en-IN')} characters · {(MAX_CHARS - q.draft.length).toLocaleString('en-IN')} left</span>
          <span className="aed-count__bar" aria-hidden="true"><span style={{ width: `${(q.draft.length / MAX_CHARS) * 100}%` }} /></span>
        </div>
        <button type="button" className="aed-btn aed-btn--ghost" onClick={() => { setSaved('Draft saved'); toast('Draft saved'); }}><Icon name="save" size={16} />Save Draft</button>
        <button type="button" className="aed-btn aed-btn--line" onClick={onPreview}><Icon name="eye" size={16} />Preview</button>
        <button type="button" className="aed-btn aed-btn--main" disabled={!q.draft.trim()} onClick={onPreview}><Icon name="send" size={16} />Submit Answer</button>
      </div>
    </>
  );
}
