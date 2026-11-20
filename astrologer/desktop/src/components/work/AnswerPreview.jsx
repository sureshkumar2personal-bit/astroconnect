import { AttachmentList } from './AnswerEditor.jsx';

export default function AnswerPreview({ q, onBack, onSubmit }) {
  const text = q.draft.trim();
  return (
    <>
      <p className="muted sm">This is how {q.name} will see your answer.</p>
      <div className="card">
        <p>{text || <i className="muted">Your answer is empty.</i>}</p>
        {(q.att.length > 0 || q.links.length > 0) && <AttachmentList q={q} />}
        {q.remedy && <div className="remedy"><b>Remedy prescribed</b>{q.remedy}</div>}
      </div>
      <p className="warn-t sm">Once submitted, the user sees it immediately and it can't be edited.</p>
      <div className="actions">
        <button type="button" className="btn btn-o" onClick={onBack}>Back to Edit</button>
        <button type="button" className="btn btn-p" disabled={!text} onClick={onSubmit}>Submit Answer</button>
      </div>
    </>
  );
}
