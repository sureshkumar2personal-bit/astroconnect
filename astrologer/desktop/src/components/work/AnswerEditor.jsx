import { useState } from 'react';
import { MAX_CHARS, MAX_FILES, daysLeft, dueDate, fmtDate } from '@shared/lib/textQuestions.js';
import { Avatar, PendingTag, TypeBadge } from '@shared/components/ui.jsx';

export function AttachmentList({ q, onRemove }) {
  return (
    <div className="files">
      {q.att.map((f, i) => (
        <span key={`${f}-${i}`} className="file">
          {f}
          {onRemove && <button type="button" className="x" aria-label={`Remove ${f}`} onClick={() => onRemove(i)}>×</button>}
        </span>
      ))}
      {q.links.map((l, i) => <span key={`${l}-${i}`} className="file link">{l}</span>)}
      {onRemove && <span className="muted sm">{q.att.length} / {MAX_FILES} attachments <PendingTag id="AP-02-06 file types" /></span>}
    </div>
  );
}

export default function AnswerEditor({ q, templates, tq, autoFocus, onPreview, onAddLink, toast }) {
  const [saved, setSaved] = useState(q.draft ? 'Draft saved' : '');
  const [remedyOpen] = useState(!!q.remedy); // initial state only; the user toggles it afterwards

  const setText = (text) => {
    tq.setDraft(q.id, text);
    setSaved('Auto-saved just now');
  };
  const applyTemplate = (id) => {
    const t = templates.find((x) => x.id === id);
    if (t) setText(q.draft + (q.draft ? '\n' : '') + t.text);
  };
  const attach = () => {
    if (!tq.addAttachment(q)) toast('Maximum two attachments per question.');
  };

  return (
    <>
      <div className="ehead">
        <Avatar q={q} />
        <div className="grow">
          <b>{q.name}</b>
          <div className="muted sm">{q.id} · Due {fmtDate(dueDate(q))} · {daysLeft(q)} days left</div>
        </div>
        <TypeBadge type={q.type} />
      </div>

      <div className="etools">
        <label>
          <span className="sr">Use template</span>
          <select value="" onChange={(e) => applyTemplate(e.target.value)}>
            <option value="">Use Template…</option>
            {templates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </label>
        <button type="button" className="btn btn-o sm" onClick={() => toast('Voice to Text would start listening here (prototype).')}>Voice to Text</button>
        <button type="button" className="btn btn-o sm" onClick={onAddLink}>Add Link</button>
        <button type="button" className="btn btn-o sm" onClick={attach}>Attach File</button>
      </div>

      <label className="sr" htmlFor="tq-ans">Your answer</label>
      <textarea id="tq-ans" autoFocus={autoFocus} maxLength={MAX_CHARS} value={q.draft} onChange={(e) => setText(e.target.value)} placeholder="Write your answer…" />
      <div className="row sm"><span className="ok-t grow" aria-live="polite">{saved}</span><span>{q.draft.length} / {MAX_CHARS}</span></div>

      <AttachmentList q={q} onRemove={(i) => tq.removeAttachment(q.id, i)} />

      <label className="check">
        <input type="checkbox" checked={q.remember} onChange={(e) => tq.updateQuestion(q.id, { remember: e.target.checked })} />
        Remember This Question <PendingTag id="AP-02-05 purpose" />
      </label>

      <details className="card" open={remedyOpen}>
        <summary><b>Prescribe remedy / atonement</b> <span className="muted sm">(optional)</span></summary>
        <label className="sr" htmlFor="tq-rem">Remedy</label>
        <textarea id="tq-rem" className="short" value={q.remedy} onChange={(e) => tq.updateQuestion(q.id, { remedy: e.target.value })} placeholder="Describe the remedy…" />
        <p className="muted sm">Appears in the user's Remedy Tracker. Only the user can mark it Completed. <PendingTag id="X-08 fields" /></p>
      </details>

      <p className="muted sm">Answers can't be edited after you submit. Use Preview first.</p>
      <div className="actions">
        <button type="button" className="btn btn-o" onClick={() => { setSaved('Draft saved'); toast('Draft saved'); }}>Save Draft</button>
        <button type="button" className="btn btn-o" onClick={onPreview}>Preview</button>
        <button type="button" className="btn btn-p" onClick={onPreview}>Submit…</button>
      </div>
    </>
  );
}
