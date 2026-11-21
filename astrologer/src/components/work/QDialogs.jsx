import { useState } from 'react';
import { Field } from '@/components/ui/sectionKit.jsx';
import { STATUS_KIND, dueDate, fmtDate } from '@/lib/textQuestions.js';
import { astrologerProfile } from '@/data/mockTextQuestions.js';

// Dialog bodies for Text Questions (reference A.corr, A.tqFilters, A.previewAns) and the
// answer preview card shared by the editor's live preview (reference pvHTML).

/** How the user will see the answer: astrologer, text, attachments/links, remedy. */
export function AnswerPreviewCard({ q, text }) {
  return (
    <>
      <div className="row">
        <span className="av av-me" aria-hidden="true">{astrologerProfile.initial}</span>
        <div><b>{astrologerProfile.name}</b><div className="muted sm">Answer to {q.id}</div></div>
      </div>
      <p className="pv-text">{text || <i className="muted">Your answer appears here as you type.</i>}</p>
      {(q.att.length > 0 || q.links.length > 0) && (
        <div className="files">
          {q.att.map((f, i) => <span key={`${f.name}-${i}`} className="file">{f.name}</span>)}
          {q.links.map((l, i) => <span key={`${l}-${i}`} className="file link">{l}</span>)}
        </div>
      )}
      {q.remedy && <div className="remedy"><b>Remedy prescribed</b>{q.remedy}</div>}
    </>
  );
}

/** Preview before submission (AD-36, AD-37). Submit is disabled for an empty answer. */
export function PreviewBody({ q, text, onBack, onSubmit }) {
  return (
    <>
      <p className="muted sm">This is how {q.name} will see your answer.</p>
      <div className="preview"><AnswerPreviewCard q={q} text={text} /></div>
      <p className="warn-t sm">Once submitted, the user sees it immediately and it can't be edited.</p>
      <div className="actions">
        <button type="button" className="btn btn-o" onClick={onBack}>Back to Edit</button>
        <button type="button" className="btn btn-p" disabled={!text} onClick={onSubmit}>Submit Answer</button>
      </div>
    </>
  );
}

/** Request Correction (AD-35): replace with another General question; no upgrade to Personal. */
export function CorrectionBody({ q, onCancel, onSend }) {
  return (
    <>
      <div className="note">{q.id} · sent with a General slot<br />{q.text}</div>
      <p>The user will be asked to <b>replace it with another General question</b>, using the same slot, with no extra payment. Upgrading to Personal isn't available.</p>
      <p className="sm">
        Original deadline stays <b className="dl">{fmtDate(dueDate(q))}</b>. If the user doesn't respond by then, the question is auto-cancelled and refunded.
        You can request correction again if the resubmitted question is still wrong.
      </p>
      <div className="actions">
        <button type="button" className="btn btn-o" onClick={onCancel}>Cancel</button>
        <button type="button" className="btn btn-p" onClick={onSend}>Send Request</button>
      </div>
    </>
  );
}

const Select = ({ value, onChange, options }) => (
  <select value={value} onChange={(e) => onChange(e.target.value)}>
    {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
  </select>
);

/** Filters (AD-49). Date range and month are shown as in the reference, which does not filter on them. */
export function FiltersBody({ filters, campaigns, onApply, onReset }) {
  const [f, setF] = useState(filters);
  const set = (k) => (v) => setF((cur) => ({ ...cur, [k]: v }));
  const live = campaigns.filter((c) => c.status !== 'Deleted');
  return (
    <>
      <div className="form">
        <div className="grid2">
          <Field label="From"><input type="date" defaultValue="2026-10-01" /></Field>
          <Field label="To"><input type="date" defaultValue="2026-11-20" /></Field>
        </div>
        <Field label="Month"><select defaultValue="November 2026"><option>November 2026</option><option>October 2026</option></select></Field>
        <Field label="Campaign"><Select value={f.camp} onChange={set('camp')} options={[['', 'All campaigns'], ...live.map((c) => [c.id, c.name]), ['open', 'Open Questions']]} /></Field>
        <Field label="General / Personal"><Select value={f.type} onChange={set('type')} options={[['', 'Both'], ['General', 'General'], ['Personal', 'Personal']]} /></Field>
        <Field label="Question status"><Select value={f.status} onChange={set('status')} options={[['', 'Any status'], ...Object.keys(STATUS_KIND).map((s) => [s, s])]} /></Field>
        <Field label="Search"><input value={f.q} onChange={(e) => set('q')(e.target.value)} placeholder="User ID / Question ID" /></Field>
        <p className="muted sm">Priority 1 / 2 filters are on the Received Questions tab.</p>
      </div>
      <div className="actions">
        <button type="button" className="btn btn-o" onClick={onReset}>Reset</button>
        <button type="button" className="btn btn-p" onClick={() => onApply(f)}>Apply Filters</button>
      </div>
    </>
  );
}
