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
  useEffect(() => { setNote(a?.pnotes || ''); setAttText(''); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

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
  const saveAttachment = () => {
    if (!attText.trim()) return toast('Write something to attach.');
    apt.addAttachment(a.id, attType, attText.trim());
    setAttText('');
    toast('Attachment saved to Appointment History');
  };

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
          {isUpcoming(a) && (
            <section className="card apx-card">
              <h3 className="apx-h">Join call</h3>
              <p className="sm">Joining opens 5 minutes before the scheduled time, with a 5-minute grace period after it. If the call drops, reconnection is tried for 5 minutes and remaining time is kept.</p>
              <button type="button" className="btn btn-p" disabled={!canJoin} onClick={() => toast('Connecting voice call… (prototype — no real call is placed)')}>
                {canJoin ? 'Join voice call' : `Join opens ${fmtDateTime(opens)}`}
              </button>
              <button type="button" className="btn btn-o danger" onClick={() => openDialog('aptCancel', a.id)}>Cancel appointment</button>
            </section>
          )}
          <section className="card apx-card">
            <h3 className="apx-h">Post-consultation attachments</h3>
            {a.pendingAtt && <div className="note note--bad">Attachment pending — reminders continue until you add it. Completion and settlement are not affected.</div>}
            {a.att.map((x, i) => <div key={i} className="remedy"><b>{x.type}</b>{x.text}</div>)}
            {a.status === 'Completed' ? (
              <>
                <div className="apx-row">
                  <label className="sr" htmlFor={`apt-att-type-${a.id}`}>Attachment type</label>
                  <select id={`apt-att-type-${a.id}`} value={attType} onChange={(e) => setAttType(e.target.value)}>
                    {ATTACHMENT_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                  <label className="sr" htmlFor={`apt-att-${a.id}`}>Attachment text</label>
                  <input id={`apt-att-${a.id}`} type="text" placeholder="Write notes, remedies, recommendations or reports" value={attText} onChange={(e) => setAttText(e.target.value)} />
                </div>
                <div className="apx-row">
                  <label className="apx-file">
                    <span>⬆ Choose files · up to 3 · JPEG, PDF, TXT · 10 MB each</span>
                    <input type="file" accept=".jpg,.jpeg,.pdf,.txt" multiple />
                  </label>
                  <button type="button" className="btn apx-save" onClick={saveAttachment}>Save attachment</button>
                </div>
                <span className="muted sm">Saved in Appointment History and the Remedy Tracker.</span>
              </>
            ) : (
              !a.att.length && <span className="muted sm">Available after the call is completed.</span>
            )}
          </section>
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
          {isUpcoming(a) && (
            <section className="card">
              <h2 className="h">Join call</h2>
              <p className="sm">Joining opens 5 minutes before the scheduled time, with a 5-minute grace period after it. If the call drops, reconnection is tried for 5 minutes and remaining time is kept.</p>
              <button type="button" className="btn btn-p" disabled={!canJoin} onClick={() => toast('Connecting voice call… (prototype — no real call is placed)')}>
                {canJoin ? 'Join voice call' : `Join opens ${fmtDateTime(opens)}`}
              </button>
              <button type="button" className="btn btn-o danger" onClick={() => openDialog('aptCancel', a.id)}>Cancel appointment</button>
            </section>
          )}
          <section className="card">
            <h2 className="h">Post-consultation attachments</h2>
            {a.pendingAtt && <div className="note note--bad">Attachment pending — reminders continue until you add it. Completion and settlement are not affected.</div>}
            {a.att.length ? a.att.map((x, i) => <div key={i} className="remedy"><b>{x.type}</b>{x.text}</div>) : <span className="muted sm">None yet</span>}
            {a.status === 'Completed' ? (
              <div className="form">
                <label>Type
                  <select value={attType} onChange={(e) => setAttType(e.target.value)}>
                    {ATTACHMENT_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </label>
                <label className="sr" htmlFor="apt-att">Attachment text</label>
                <textarea id="apt-att" className="short" placeholder="Write notes, remedies, recommendations or reports" value={attText} onChange={(e) => setAttText(e.target.value)} />
                <label className="sm">Files (up to 3 · JPEG, PDF, TXT · 10 MB each)<input type="file" accept=".jpg,.jpeg,.pdf,.txt" multiple /></label>
                <button type="button" className="btn btn-p" onClick={saveAttachment}>Save attachment</button>
                <span className="muted sm">Saved in Appointment History and the Remedy Tracker.</span>
              </div>
            ) : (
              <span className="muted sm">Available after the call is completed.</span>
            )}
          </section>
        </div>
      </div>
    </Wrap>
  );
}
