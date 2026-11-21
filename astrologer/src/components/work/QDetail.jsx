import { useState } from 'react';
import {
  DEADLINE_DAYS, MAX_CHARS, MAX_QUESTION, daysLeft, disputeDaysLeft, disputeDue, dueDate, fmtDate, fmtDateTime, inr, isOpen,
} from '@/lib/textQuestions.js';
import { routes } from '@/lib/router.js';
import { Avatar, PrioBadge, QStatus, TypeBadge } from './bits.jsx';

// Question workspace (AD-34) with answer, dispute (AD-41, AD-44), expiry and correction states
// (reference detailHTML). No Cancel Question option (AD-62).

function DisputeAnswerForm({ onSubmit }) {
  const [text, setText] = useState('');
  const [remedy, setRemedy] = useState('');
  return (
    <section className="card">
      <h3>Your Dispute Answer</h3>
      <label className="sr" htmlFor="tq-dans">Dispute answer</label>
      <textarea id="tq-dans" maxLength={MAX_CHARS} value={text} onChange={(e) => setText(e.target.value)} placeholder="Reply to the user's dispute…" />
      <div className="row sm"><span className="muted grow">Text only. No templates or attachments. You can answer once.</span><span>{text.length} / {MAX_CHARS}</span></div>
      <label className="sm stack-label"><b>Remedy (optional)</b>
        <textarea id="tq-drem" className="short" value={remedy} onChange={(e) => setRemedy(e.target.value)} placeholder="A remedy here also appears in the user's Remedy Tracker" />
      </label>
      <button type="button" className="btn btn-p" onClick={() => onSubmit(text.trim(), remedy.trim())}>Submit Dispute Answer</button>
    </section>
  );
}

export default function QDetail({ q, campaignName, onCorrection, onDisputeSubmit }) {
  const open = isOpen(q);
  const canCorrect = open && q.slot === 'General' && q.status !== 'Correction Requested';
  const facts = [
    ['Campaign', campaignName],
    ['Amount paid · Slots', q.cat === 'sub' ? 'Subscription benefit' : `${inr(q.paid)} · ${q.slots} slot`],
    ['Received', fmtDateTime(q.recv)],
    ['Answer deadline', open ? `${fmtDate(dueDate(q))} · ${daysLeft(q)} days left` : fmtDate(dueDate(q))],
  ];
  const left = q.dispute ? disputeDaysLeft(q) : 0;
  return (
    <>
      <div className="dhead">
        <h2>{q.id}</h2>
        <PrioBadge q={q} />
        <QStatus status={q.status} />
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
        <a className="go" href={`#/audience/user/${q.uid}`}>View Profile ›</a>
      </section>

      <div className="facts">
        {facts.map(([k, v], i) => (
          <div key={k} className="fact"><span className="muted sm">{k}</span><b className={i === 3 && open ? 'dl' : undefined}>{v}</b></div>
        ))}
      </div>

      <section className="card">
        <h3>Question</h3>
        <p className="qfull">{q.text}</p>
        <span className="muted sm">{q.text.length} / {MAX_QUESTION.toLocaleString('en-IN')} characters</span>
      </section>

      <div className="two">
        <section className="card">
          <h3>User attachments</h3>
          <div className="files">
            {q.type === 'General'
              ? <span className="muted sm">General questions have no attachments</span>
              : q.files.length
                ? q.files.map((f, i) => <span key={f} className={`file${i === 0 ? ' horo' : ''}`}>{f}</span>)
                : <span className="muted sm">None supplied</span>}
          </div>
        </section>
        <section className="card">
          <h3>Previous questions ({q.prev.length})</h3>
          {q.prev.length
            ? q.prev.map((p) => (
                <a key={p[0]} className="row sm prev" href={`#${routes.detail(p[0])}`}><span className="grow">{p[0]} · {p[1]}</span><QStatus status={p[2]} /></a>
              ))
            : <span className="muted sm">First question from this user</span>}
        </section>
      </div>

      {canCorrect && (
        <section className="card corr">
          <div className="grow">
            <b>Personal question on a General slot?</b>
            <div className="muted sm">Ask the user to replace it with a General question. The {DEADLINE_DAYS}-day deadline does not restart.</div>
          </div>
          <button type="button" className="btn btn-o" onClick={() => onCorrection(q.id)}>Request Correction</button>
        </section>
      )}

      {q.answer && (
        <section className="card">
          <h3>Your answer <span className="muted sm">· {fmtDateTime(q.answeredAt)}</span></h3>
          <p>{q.answer}</p>
          {q.remedy && <div className="remedy"><b>Remedy prescribed</b>{q.remedy}</div>}
          <p className="muted sm">Submitted answers can't be edited. {q.status === 'Completed' ? 'Becomes Settled if no dispute is raised within 7 days.' : ''}</p>
        </section>
      )}
      {q.dispute && (
        <section className="card disp">
          <h3>Dispute Details <span className="muted sm">· raised {fmtDateTime(q.disputeAt)}</span></h3>
          <p>{q.dispute}</p>
          {q.status === 'Disputed' && (
            <p className="sm">
              <b className="dl">Answer by {fmtDateTime(disputeDue(q))}</b> · {left > 0 ? `${left} day(s) left` : 'Escalated to Admin Review'}. If not answered within 3 days, it is escalated to Admin Review.
            </p>
          )}
        </section>
      )}
      {q.status === 'Disputed' && <DisputeAnswerForm key={q.id} onSubmit={(t, r) => onDisputeSubmit(q.id, t, r)} />}
      {q.disputeAnswer && (
        <section className="card">
          <h3>Your Dispute Answer <span className="muted sm">· {fmtDateTime(q.disputeAnsweredAt)}</span></h3>
          <p>{q.disputeAnswer}</p>
          {q.disputeRemedy && <div className="remedy"><b>Remedy prescribed</b>{q.disputeRemedy}</div>}
          <p className="muted sm">No further dispute is allowed. The user may raise a separate Platform Complaint within 7 days; it doesn't hold your settlement.</p>
        </section>
      )}
      {q.status === 'Expired' && (
        <section className="card disp">
          <h3>Expired</h3>
          <p>Not answered within 30 days. Auto-cancelled on {fmtDate(dueDate(q))} and the user was refunded.</p>
        </section>
      )}
      {q.status === 'Correction Requested' && (
        <section className="card note">
          <h3>Correction requested</h3>
          <p>Waiting for the user to replace it with a General question (same slot, no extra payment). The original deadline ({fmtDate(dueDate(q))}) still applies.</p>
        </section>
      )}

      <div className="actions">
        {open && q.status !== 'Correction Requested' && (
          <a className="btn btn-p" href={`#${routes.editor(q.id)}`}>{q.draft ? 'Continue Answer' : 'Answer Now'}</a>
        )}
        <a className="btn btn-o" href={`#${routes.timeline(q.id)}`}>View Timeline</a>
      </div>
      <p className="muted sm">There is no Cancel Question option; every submitted question must be answered.</p>
    </>
  );
}
