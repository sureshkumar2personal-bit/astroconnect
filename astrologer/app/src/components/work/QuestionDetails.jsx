import { useState } from 'react';
import { MAX_CHARS, daysLeft, dt, dueDate, fmtDate, fmtDateTime, isOpen } from '../../lib/textQuestions.js';
import { Avatar, PendingTag, PriorityBadge, StatusBadge, TypeBadge } from './ui.jsx';

function Facts({ q, campaignName }) {
  const open = isOpen(q);
  const facts = [
    ['Campaign', campaignName],
    ['Amount paid · Slots', `₹${q.paid} · ${q.slots} slot${q.slots > 1 ? 's' : ''}`],
    ['Received', fmtDateTime(dt(q.recv))],
    ['Answer deadline', open ? `${fmtDate(dueDate(q))} · ${daysLeft(q)} days left` : fmtDate(dueDate(q))],
  ];
  return (
    <div className="facts">
      {facts.map(([k, v], i) => (
        <div key={k} className="fact"><span className="muted sm">{k}</span><b className={i === 3 && open ? 'dl' : ''}>{v}</b></div>
      ))}
    </div>
  );
}

function DisputeAnswerForm({ onSubmit }) {
  const [text, setText] = useState('');
  return (
    <section className="card">
      <h3>Your Dispute Answer</h3>
      <label className="sr" htmlFor="tq-dans">Dispute answer</label>
      <textarea id="tq-dans" maxLength={MAX_CHARS} value={text} onChange={(e) => setText(e.target.value)} placeholder="Reply to the user's dispute…" />
      <div className="row sm"><span className="muted grow">Text only. No templates or attachments. You can answer once.</span><span>{text.length} / {MAX_CHARS}</span></div>
      <div className="row wrap"><PendingTag id="AP-02-11 deadline" /><PendingTag id="AP-02-12 remedy" /></div>
      <button type="button" className="btn btn-p" onClick={() => onSubmit(text.trim())}>Submit Dispute Answer</button>
    </section>
  );
}

export default function QuestionDetails({ q, campaignName, onAnswer, onTimeline, onCorrection, onDisputeSubmit }) {
  if (!q) {
    return (
      <div className="empty"><b>Select a question</b><span className="muted">Its details and actions appear here.</span></div>
    );
  }
  const open = isOpen(q);
  const canCorrect = open && q.slot === 'General' && q.status !== 'Correction Requested';
  return (
    <>
      <div className="dhead">
        <h2>{q.id}</h2>
        <PriorityBadge q={q} />
        <StatusBadge status={q.status} />
        <span className="grow" />
        <span className="muted sm">Type</span><TypeBadge type={q.type} />
        <span className="muted sm">Slot</span><TypeBadge type={q.slot} />
      </div>

      <section className="card user">
        <Avatar q={q} large />
        <div><b className="lg">{q.name}</b><div className="muted sm">User ID: {q.uid}</div></div>
        <div><span className="muted sm">Age</span><b>{q.age}</b></div>
        <div><span className="muted sm">Gender</span><b>{q.gender}</b></div>
        <div><span className="muted sm">Location</span><b>{q.loc}</b></div>
      </section>

      <Facts q={q} campaignName={campaignName} />

      <section className="card"><h3>Question</h3><p className="qfull">{q.text}</p></section>

      <div className="two">
        <section className="card">
          <h3>Attachments</h3>
          <div className="files">
            {q.horo && <span className="file horo">Horoscope chart</span>}
            {q.files.map((f) => <span key={f} className="file">{f}</span>)}
            {!q.horo && !q.files.length && <span className="muted sm">None supplied</span>}
          </div>
        </section>
        <section className="card">
          <h3>Previous questions ({q.prev.length})</h3>
          {q.prev.length
            ? q.prev.map((p) => (
                <div key={p[0]} className="row sm"><span className="grow">{p[0]} · {p[1]}</span><StatusBadge status={p[2]} /></div>
              ))
            : <span className="muted sm">First question from this user</span>}
        </section>
      </div>

      {canCorrect && (
        <section className="card corr">
          <div className="grow">
            <b>Personal question on a General slot?</b>
            <div className="muted sm">Ask the user to correct it. The 30-day deadline does not restart.</div>
          </div>
          <button type="button" className="btn btn-o" onClick={() => onCorrection(q.id)}>Request Correction</button>
        </section>
      )}

      {q.answer && (
        <section className="card">
          <h3>Your answer <span className="muted sm">· {fmtDateTime(dt(q.answeredAt))}</span></h3>
          <p>{q.answer}</p>
          {q.remedy && <div className="remedy"><b>Remedy prescribed</b>{q.remedy}</div>}
          <p className="muted sm">Submitted answers can't be edited.</p>
        </section>
      )}
      {q.dispute && (
        <section className="card disp">
          <h3>Dispute <span className="muted sm">· raised {fmtDateTime(dt(q.disputeAt))}</span></h3>
          <p>{q.dispute}</p>
        </section>
      )}
      {q.status === 'Disputed' && <DisputeAnswerForm key={q.id} onSubmit={(t) => onDisputeSubmit(q.id, t)} />}
      {q.disputeAnswer && (
        <section className="card">
          <h3>Your Dispute Answer</h3>
          <p>{q.disputeAnswer}</p>
          <p className="muted sm">No further dispute is allowed. The user may raise a separate Platform Complaint within 7 days.</p>
        </section>
      )}
      {q.status === 'Expired' && (
        <section className="card disp">
          <h3>Expired</h3>
          <p>Not answered within 30 days. The question was auto-cancelled on {fmtDate(dueDate(q))} and the user was refunded.</p>
        </section>
      )}
      {q.status === 'Correction Requested' && (
        <section className="card note">
          <h3>Correction requested</h3>
          <p>Waiting for the user to replace the question or upgrade to Personal. The original deadline ({fmtDate(dueDate(q))}) still applies.</p>
        </section>
      )}

      <div className="actions">
        {open && <button type="button" className="btn btn-p" onClick={() => onAnswer(q.id)}>{q.draft ? 'Continue Answer' : 'Answer Now'}</button>}
        <button type="button" className="btn btn-o" onClick={() => onTimeline(q.id)}>View Timeline</button>
      </div>
    </>
  );
}
