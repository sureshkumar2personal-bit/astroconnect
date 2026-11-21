import { useRef, useState } from 'react';
import { Sec } from '../section/kit.jsx';
import { FILE_TYPES, MAX_CHARS, MAX_FILES, MAX_MB, daysLeft, dueDate, fmtDate } from '@shared/lib/textQuestions.js';
import { Avatar, TypeBadge } from './bits.jsx';
import { AnswerPreviewCard } from './QDialogs.jsx';

// Write Answer (reference TQSUB.answer; AD-36 – AD-39, AD-45): text up to 1,500 characters,
// Voice to Text (prototype), Save Draft / Auto Save, own templates, up to three JPEG/PDF/TXT
// attachments of max 10 MB, links, optional remedy, Preview before Submit, and a live preview.
// "Remember This Question" is not included (removed, R-03 / AD-36).
export default function AnswerPage({ q, tq, onPreview, onAddLink, toast }) {
  const [saved, setSaved] = useState(q.draft ? 'Draft saved' : '');
  const fileRef = useRef(null);

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
    <div className="split2">
      <Sec>
        <div className="row">
          <Avatar q={q} />
          <div className="grow"><b>{q.name}</b><div className="muted sm">Due {fmtDate(dueDate(q))} · {daysLeft(q)} days left</div></div>
          <TypeBadge type={q.type} />
        </div>
        <div className="note">{q.text}</div>
        <div className="etools">
          <label>
            <span className="sr">Use template</span>
            <select value="" onChange={(e) => applyTemplate(e.target.value)}>
              <option value="">Use Template…</option>
              {tq.templates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </label>
          <button type="button" className="btn btn-o sm" onClick={() => toast('Voice to Text: speak and your words appear in the answer (prototype).')}>Voice to Text</button>
          <button type="button" className="btn btn-o sm" onClick={onAddLink}>Add Link</button>
          <button type="button" className="btn btn-o sm" onClick={() => fileRef.current?.click()}>Attach File</button>
          <input ref={fileRef} type="file" accept=".jpg,.jpeg,.pdf,.txt" className="sr" tabIndex={-1} aria-hidden="true" onChange={pickFile} />
        </div>
        <label className="sr" htmlFor="tq-ans">Your answer</label>
        <textarea id="tq-ans" maxLength={MAX_CHARS} value={q.draft} onChange={(e) => setText(e.target.value)} placeholder="Type or dictate your answer… (text only, no audio answers)" />
        <div className="row sm"><span className="ok-t grow" aria-live="polite">{saved}</span><span>{q.draft.length} / {MAX_CHARS}</span></div>
        <div className="files">
          {q.att.map((f, i) => (
            <span key={`${f.name}-${i}`} className="file">
              {f.name} <span className="muted">{f.size}</span>
              <button type="button" className="x" aria-label={`Remove ${f.name}`} onClick={() => tq.removeAttachment(q.id, i)}>×</button>
            </span>
          ))}
          {q.links.map((l, i) => <span key={`${l}-${i}`} className="file link">{l}</span>)}
          <span className="muted sm">{q.att.length} / {MAX_FILES} files · JPEG, PDF, TXT · max {MAX_MB} MB each</span>
        </div>
        <label className="sm stack-label"><b>Prescribe remedy / atonement (optional)</b>
          <textarea id="tq-rem" className="short" value={q.remedy} onChange={(e) => tq.setRemedy(q.id, e.target.value)} placeholder="Appears in the user's Remedy Tracker" />
        </label>
        <div className="actions">
          <button type="button" className="btn btn-o" onClick={() => { setSaved('Draft saved'); toast('Draft saved'); }}>Save Draft</button>
          <button type="button" className="btn btn-o" onClick={onPreview}>Preview</button>
          <button type="button" className="btn btn-p" onClick={onPreview}>Submit…</button>
        </div>
        <p className="muted sm">Answers can't be edited after you submit. Use Preview to review and correct first.</p>
      </Sec>
      <Sec title="Live preview">
        <div className="preview"><AnswerPreviewCard q={q} text={q.draft} /></div>
      </Sec>
    </div>
  );
}
