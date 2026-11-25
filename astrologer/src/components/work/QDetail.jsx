import { useState } from 'react';
import {
  DEADLINE_DAYS, MAX_CHARS, MAX_QUESTION, daysLeft, disputeDaysLeft, disputeDue, dueDate, fmtDate, fmtDateTime, inr, isOpen, pendingDay,
} from '@/lib/textQuestions.js';
import { routes } from '@/lib/router.js';
import { Avatar, QStatus, TypeBadge } from './bits.jsx';
import AnswerEditor from './AnswerEditor.jsx';
import { priority } from '@/lib/textQuestions.js';

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

// The Question tab first shows a limited amount of text; Read More shows all of it, Read Less folds it back.
const PREVIEW_CHARS = 100;

export default function QDetail({ q, campaignName, onCorrection, onDisputeSubmit, tq, onPreview, onAddLink, onOpenFile, toast }) {
  const [tab, setTab] = useState('q');
  const [full, setFull] = useState(false);
  const open = isOpen(q);
  const long = q.text.length > PREVIEW_CHARS;
  const canAnswer = open && q.status !== 'Correction Requested';
  const p = priority(q);
  const left = q.dispute ? disputeDaysLeft(q) : 0;
  const tabs = [
    ['q', 'Question'],
    ['p', `Previous questions (${q.prev.length})`],
  ];
  // User attachments (Personal questions only, AD-45) appear under the full question text, only while it is expanded.
  const files = q.type === 'General' ? [] : q.files;
  const expandable = long || files.length > 0;
  return (
    <>
      <div className="qd-head">
        <Avatar q={q} />
        <div className="qd-head__main">
          <div className="qd-head__id"><a className="qd-head__name" href={`#/audience/user/${q.uid}`}><b>{q.name}</b></a><span className="muted sm">{q.uid} · {q.id}</span></div>
          <div className="qd-head__chips">
            {p ? <span className={`qd-prio qd-prio--${p}`}>Priority {p}</span> : null}
            <span className="qchip">{campaignName}</span>
            <TypeBadge type={q.type} />
            <QStatus status={q.status} />
          </div>
        </div>
        <div className="qd-head__due">
          <b>{open ? `Answer by ${fmtDate(dueDate(q))}` : `Deadline ${fmtDate(dueDate(q))}`}</b>
          {open && <span className="muted sm">{pendingDay(q)} {pendingDay(q) === 1 ? 'day' : 'days'} pending</span>}
        </div>
      </div>

      <div className="qd-tabs" role="tablist" aria-label="Question information">
        {tabs.map(([k, label]) => (
          <button key={k} type="button" role="tab" id={`qd-tab-${k}`} aria-selected={tab === k} aria-controls="qd-panel" className={`qd-tab${tab === k ? ' on' : ''}`} onClick={() => setTab(k)}>{label}</button>
        ))}
      </div>
      <div className="qd-panel" id="qd-panel" role="tabpanel" aria-labelledby={`qd-tab-${tab}`}>
        {tab === 'q' && (
          <>
            <p className="qfull">{expandable && !full && long ? `${q.text.slice(0, PREVIEW_CHARS).trimEnd()}…` : q.text}</p>
            {expandable && (
              <button type="button" className="qd-more" aria-expanded={full} onClick={() => setFull((v) => !v)}>
                {full ? 'Show Less' : 'Read Full Question'}
              </button>
            )}
            {full && (
              <div className="qd-files" aria-label="User attachments">
                {files.length
                  ? files.map((f, i) => (
                      <button key={f} type="button" className={`file file--btn${i === 0 ? ' horo' : ''}`} onClick={() => onOpenFile(f)}>{f}</button>
                    ))
                  : <span className="muted sm">No attachments supplied</span>}
              </div>
            )}
            <span className="muted sm">{q.text.length} / {MAX_QUESTION.toLocaleString('en-IN')} characters</span>
          </>
        )}
        {tab === 'p' && (
          q.prev.length
            ? q.prev.map((x) => (
                <a key={x[0]} className="row sm prev" href={`#${routes.detail(x[0])}`}><span className="grow">{x[0]} · {x[1]}</span><QStatus status={x[2]} /></a>
              ))
            : <span className="muted sm">First question from this user</span>
        )}
      </div>

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

      {canAnswer && (
        <section className="qd-answer" aria-label="Your answer">
          <div className="row">
            <h3 className="grow">Your answer</h3>
            <span className="qd-autosave"><span className="qd-autosave__dot" aria-hidden="true" />Auto Save on</span>
          </div>
          <AnswerEditor key={q.id} q={q} tq={tq} onPreview={onPreview} onAddLink={onAddLink} toast={toast} />
        </section>
      )}

    </>
  );
}
