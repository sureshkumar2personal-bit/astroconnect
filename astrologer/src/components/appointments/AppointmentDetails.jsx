import { Fragment, useEffect, useState } from 'react';
import { Badge, PendingTag } from '@/components/ui/primitives.jsx';
import { navigate, routes } from '@/lib/router.js';
import { dt, fmtDateTime } from '@/lib/textQuestions.js';
import { ATTACHMENT_TYPES, STATUS_KIND, inr, isUpcoming, joinWindow } from '@/hooks/useAppointments.js';

// Appointment Details (AD-101), joining (AD-96), cancellation (AD-98) and
// post-consultation attachments (AD-102). Reference "05 Appointments" → aptDetail.
export default function AppointmentDetails({ apt, id, mobile, openDialog, toast, inline = false }) {
  const a = apt.byId(id);
  const { open } = apt;
  useEffect(() => { if (a) open(id); }, [id, !!a, open]); // eslint-disable-line react-hooks/exhaustive-deps

  const [note, setNote] = useState(a?.pnotes || '');
  const [attType, setAttType] = useState(ATTACHMENT_TYPES[0]);
  const [attText, setAttText] = useState('');
  const [files, setFiles] = useState([]);
  const [needRemedy, setNeedRemedy] = useState(false);
  const [remedyText, setRemedyText] = useState('');
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { setNote(a?.pnotes || ''); setAttText(''); setFiles([]); setNeedRemedy(false); setRemedyText(''); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps
  const onCall = !!a?.callStart && !a?.callEnd;
  useEffect(() => {
    if (!onCall) return undefined;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [onCall]);

  if (!a) return <div className="empty">Appointment not found</div>;

  const { opens, canJoin } = joinWindow(a);
  const Wrap = inline ? 'div' : Fragment; // inline: inside an expanded Appointments-list row
  const facts = [
    ['User', `${a.user} · ${a.uid}`],
    ['Booking date/time', fmtDateTime(dt(a.at))],
    ['Duration', `${a.dur} minutes`],
    ['Type', 'Voice-only'],
    ['Payment', `${inr(a.amt)} · ${a.pay}`],
    ['Purpose', a.purpose],
    ['Uploaded horoscope', a.horo || '—'],
    ['Saved horoscope', a.saved || '—'],
  ];

  const saveNote = () => { if (note !== a.pnotes) { apt.setNote(a.id, note); toast('Private note saved'); } };
  const mmss = (secs) => `${Math.floor(secs / 60)} min ${String(secs % 60).padStart(2, '0')} s`;
  const postCall = !!a.callEnd && a.status !== 'Completed'; // call ended, attachment (and remedy if needed) not sent yet
  const connect = () => { apt.startCall(a.id); toast('Call connected (prototype — no real call is placed)'); };
  const endCall = () => { apt.endCall(a.id); toast('Call ended. Send the attachment to complete the appointment.'); };
  const sendAll = () => {
    const text = attText.trim();
    if (!text && !files.length) return toast('Add a note or choose a file to send.');
    if (needRemedy && !remedyText.trim()) return toast('Write the remedy (Pariharam) or switch off "Remedy needed".');
    const body = [text, files.length ? `Files: ${files.join(', ')}` : ''].filter(Boolean).join(' — ');
    apt.completeAppointment(a.id, { attachments: [{ type: attType, text: body }], remedy: needRemedy ? remedyText : '' });
    setAttText(''); setFiles([]); setNeedRemedy(false); setRemedyText('');
    toast('Sent. Appointment completed.');
  };
  if (a.callSecs != null) facts.splice(3, 0, ['Call duration', `${mmss(a.callSecs)} (booked ${a.dur} min)`]);

  // Join / on-call card, and the after-call card (attachment + optional remedy), shared by both layouts.
  // A plain function (not a component) so the forms inside keep focus while typing.
  const card = (title, children) => (inline
    ? <section className="card apx-card"><h3 className="apx-h">{title}</h3>{children}</section>
    : <section className="card"><h2 className="h">{title}</h2>{children}</section>);
  const joinCard = isUpcoming(a) && !postCall && (
    card(onCall ? 'Call in progress' : 'Join call', (
      onCall ? (
        <>
          <p className="sm" aria-live="polite">Connected · {mmss(Math.max(0, Math.round((now - a.callStart) / 1000)))}</p>
          <button type="button" className="btn danger-f" onClick={endCall}>End call</button>
        </>
      ) : (
        <>
          <p className="sm">Joining opens 5 minutes before the scheduled time, with a 5-minute grace period after it. If the call drops, reconnection is tried for 5 minutes and remaining time is kept.</p>
          <button type="button" className="btn btn-p" disabled={!canJoin} onClick={connect}>
            {canJoin ? 'Join voice call' : `Join opens ${fmtDateTime(opens)}`}
          </button>
          <button type="button" className="btn btn-o danger" onClick={() => openDialog('aptCancel', a.id)}>Cancel appointment</button>
        </>
      )
    ))
  );
  const afterCallCard = postCall && (
    card('After the call', (
      <>
      <p className="sm">The call has ended ({mmss(a.callSecs || 0)}). Send the consultation attachment{needRemedy ? ' and the remedy' : ''} to complete this appointment.</p>
      <div className="form">
        <label>Attachment type
          <select value={attType} onChange={(e) => setAttType(e.target.value)}>
            {ATTACHMENT_TYPES.filter((t) => t !== 'Remedy').map((t) => <option key={t}>{t}</option>)}
          </select>
        </label>
        <label className="sr" htmlFor={`apt-att-${a.id}`}>Attachment text</label>
        <textarea id={`apt-att-${a.id}`} className="short" placeholder="Write notes, recommendations or a report" value={attText} onChange={(e) => setAttText(e.target.value)} />
        <label className="sm">Files (up to 3 · JPEG, PDF, TXT · 10 MB each)
          <input type="file" accept=".jpg,.jpeg,.pdf,.txt" multiple onChange={(e) => setFiles([...e.target.files].slice(0, 3).map((f) => f.name))} />
        </label>
        <label className="sm" style={{ flexDirection: "row", alignItems: "center", gap: "8px" }}><input type="checkbox" checked={needRemedy} onChange={(e) => setNeedRemedy(e.target.checked)} /> Remedy (Pariharam) needed</label>
        {needRemedy && (
          <>
            <label className="sr" htmlFor={`apt-rem-${a.id}`}>Remedy details</label>
            <textarea id={`apt-rem-${a.id}`} className="short" placeholder="Write the remedy details" value={remedyText} onChange={(e) => setRemedyText(e.target.value)} />
          </>
        )}
        <button type="button" className="btn btn-p" onClick={sendAll}>Send and complete</button>
      </div>
      </>
    ))
  );
  const attachmentsCard = card('Post-consultation attachments', (
    a.att.length ? a.att.map((x, i) => <div key={i} className="remedy"><b>{x.type}</b>{x.text}</div>) : <span className="muted sm">None yet</span>
  ));

  // Inline (inside an expanded list / history row): compact two-card layout.
  if (inline) {
    const box = [
      ['Booking', fmtDateTime(dt(a.at))],
      ['Duration', `${a.dur} min`],
      ['Payment', `${inr(a.amt)} · ${a.pay}`],
      ['Purpose', a.purpose],
      ['Uploaded horoscope', a.horo || '—'],
      ['Saved horoscope', a.saved || '—'],
    ];
    if (a.callSecs != null) box.splice(2, 0, ['Call duration', `${mmss(a.callSecs)} (booked ${a.dur} min)`]);
    return (
      <div className="apt-inline apx">
        <section className="card apx-card">
          <h3 className="apx-h">Appointment Details</h3>
          <div className="apx-facts">
            {box.map(([k, v]) => <div key={k} className="apx-fact"><span>{k}</span><b>{v}</b></div>)}
            <div className="apx-fact apx-fact--wide"><span>Birth details</span><b>{a.birth || 'Not shared — no user consent'}</b></div>
          </div>
          {a.unotes && <div className="note"><b>User's private note:</b> {a.unotes}</div>}
          {a.cancelBy && <div className="note">Cancelled by {a.cancelBy}</div>}
          {a.noShow && <div className="note">{a.noShow}. Late-cancellation policy applies <PendingTag id="AP-05-01 percentage" /></div>}
          <label className="sr" htmlFor={`apt-note-${a.id}`}>Private preparation notes</label>
          <textarea id={`apt-note-${a.id}`} className="apx-notes" rows={1} placeholder="Private preparation notes — only you can see these" value={note} onChange={(e) => setNote(e.target.value)} onBlur={saveNote} />
          {/* Audience module not built yet — link kept inert, like the other unbuilt destinations. */}
          <a className="go" href="#" aria-disabled="true" onClick={(e) => e.preventDefault()}>View user profile ›</a>
        </section>
        <div className="apx-col">
          {joinCard}
          {afterCallCard}
          {attachmentsCard}
        </div>
      </div>
    );
  }

  return (
    <Wrap {...(inline ? { className: 'apt-inline' } : {})}>
      {!inline && <div className="row wrap apt-ph">
        {!mobile && <button type="button" className="btn btn-o sm" onClick={() => navigate(routes.appointments)}>‹ Back</button>}
        {mobile ? (
          <div className="grow"><h2 className="apt-id">{a.id}</h2><p className="muted">Voice-only appointment</p></div>
        ) : <span className="grow" />}
        <Badge kind={STATUS_KIND[a.status]}>{a.status}</Badge>
      </div>}
      <div className="split2">
        <div className="stack">
          <section className="card">
            <h2 className="h">Appointment Details</h2>
            <div className="facts">
              {facts.map(([k, v]) => <div key={k} className="fact"><span className="muted sm">{k}</span><b>{v}</b></div>)}
            </div>
            <div className="fact">
              <span className="muted sm">Birth details</span>
              <b>{a.birth || <span className="muted">Not shared — the user hasn't given consent</span>}</b>
            </div>
            {a.unotes && <div className="note"><b>User's private note:</b> {a.unotes}</div>}
            {a.cancelBy && <div className="note">Cancelled by {a.cancelBy}</div>}
            {a.noShow && <div className="note">{a.noShow}. Late-cancellation policy applies <PendingTag id="AP-05-01 percentage" /></div>}
            {/* Audience module not built yet — link kept inert, like the other unbuilt destinations. */}
            <a className="go" href="#" aria-disabled="true" onClick={(e) => e.preventDefault()}>View user profile ›</a>
          </section>
          <section className="card">
            <h2 className="h">Private preparation notes</h2>
            <label className="sr" htmlFor="apt-note">Private preparation notes</label>
            <textarea id="apt-note" className="short" placeholder="Only you can see these notes" value={note} onChange={(e) => setNote(e.target.value)} onBlur={saveNote} />
          </section>
        </div>
        <div className="stack">
          {joinCard}
          {afterCallCard}
          {attachmentsCard}
        </div>
      </div>
    </Wrap>
  );
}
