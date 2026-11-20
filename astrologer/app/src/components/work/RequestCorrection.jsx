import { dueDate, fmtDate } from '../../lib/textQuestions.js';

export default function RequestCorrection({ q, campaign, onCancel, onSend }) {
  return (
    <>
      <div className="card"><span className="muted sm">{q.id} · sent with a General slot</span><p>{q.text}</p></div>
      <h3>The user will choose</h3>
      <ol className="opts">
        <li><b>Replace with a General question</b><span className="muted sm">Same slot, no extra payment</span></li>
        <li><b>Upgrade to Personal</b><span className="muted sm">Pays only the difference (₹{campaign.pp - campaign.pg}) and resubmits</span></li>
      </ol>
      <p className="sm">
        Original deadline stays <b className="dl">{fmtDate(dueDate(q))}</b>. If the user doesn't respond by then, the question is
        auto-cancelled and refunded. You can request correction again if the resubmitted question is still wrong.
      </p>
      <div className="actions">
        <button type="button" className="btn btn-o" onClick={onCancel}>Cancel</button>
        <button type="button" className="btn btn-p" onClick={onSend}>Send Request</button>
      </div>
    </>
  );
}
