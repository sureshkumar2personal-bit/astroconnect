import { useState } from 'react';

// Appointments dialogs: CancelModal / ProfileModal (Appointments screen, own modals) and the dialog bodies rendered
// inside WorkPage's shared <Dialog>: CancelAppointment (My Work → History) and EditDay / CloseDate (Calendar & Availability).

const REASONS = ['Personal emergency', 'Unwell', 'Unavoidable schedule conflict', 'Technical issue', 'Other'];

/**
 * Cancel an appointment (reference dialog; rules AD-91, AD-98): a reason is required, a message is optional. The client
 * chooses a reschedule or a full Wallet refund; the astrologer receives no earnings. Rendered inside .apx (own modal).
 */
export function CancelModal({ a, summary, onKeep, onConfirm }) {
  const [reason, setReason] = useState('');
  const [note, setNote] = useState('');
  const [err, setErr] = useState('');
  return (
    <div className="scrim" onClick={(e) => e.target === e.currentTarget && onKeep()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="cx-t">
        <h3 id="cx-t">Cancel {a.id}?</h3>
        <p>{summary}</p>
        <div className="warn">The client chooses a reschedule or a full refund to their Wallet, and you receive no earnings for it. The client is notified, and the appointment stays in your history and calendar, marked Cancelled.</div>
        <label className="fld">Reason (required)
          <select className="inp" value={reason} onChange={(e) => { setReason(e.target.value); setErr(''); }}>
            <option value="">Select a reason</option>
            {REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </label>
        <label className="fld">Message to client (optional)<textarea className="inp ta" value={note} placeholder="A short note the client will see" onChange={(e) => setNote(e.target.value)} /></label>
        {err && <div className="err">{err}</div>}
        <div className="m-act">
          <button type="button" className="btn btn-ghost" onClick={onKeep}>Keep appointment</button>
          <button type="button" className="btn btn-danger" onClick={() => (reason ? onConfirm({ reason, note: note.trim() }) : setErr('Choose a reason so the client understands the change.'))}>Cancel appointment</button>
        </div>
      </div>
    </div>
  );
}

/** Client profile (reference): only what the app knows about the client; contact details stay hidden. */
export function ProfileModal({ a, since, lang, count, onClose }) {
  const ini = a.user.split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  return (
    <div className="scrim" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="pf-t">
        <div className="row" style={{ gap: 14 }}><span className="avatar" style={{ width: 52, height: 52, fontSize: 17 }}>{ini}</span><div><h3 id="pf-t">{a.user}</h3><div className="muted">{a.uid} · AstroConnect member since {since}</div></div></div>
        <dl className="dl">
          <dt>Birth details</dt><dd>{a.birth || '—'}</dd>
          <dt>Saved chart</dt><dd>{a.saved || '—'}</dd>
          <dt>Language</dt><dd>{lang}</dd>
          <dt>With you</dt><dd>{count}</dd>
        </dl>
        <div className="muted" style={{ fontSize: 12.5 }}>Contact details stay hidden. All communication happens through AstroConnect.</div>
        <div className="m-act"><button type="button" className="btn btn-primary" onClick={onClose}>Done</button></div>
      </div>
    </div>
  );
}

/** Astrologer cancellation (AD-91, AD-98) — dialog body used by My Work → History's appointment details. */
export function CancelAppointment({ onKeep, onConfirm }) {
  return (
    <>
      <ul className="cons">
        <li>You receive <b>no earnings</b> for an appointment you cancel.</li>
        <li>The user chooses a reschedule (once) or a full refund to their User Wallet. You can't reschedule for them.</li>
        <li>Both parties are notified immediately.</li>
      </ul>
      <div className="actions">
        <button type="button" className="btn btn-o" onClick={onKeep}>Keep</button>
        <button type="button" className="btn danger-f" onClick={onConfirm}>Cancel appointment</button>
      </div>
    </>
  );
}

/** Edit one day of the recurring weekly availability (AD-92). */
export function EditDay({ ranges, onCancel, onSave }) {
  const [from, setFrom] = useState(ranges[0]?.[0] || '09:00');
  const [to, setTo] = useState(ranges[0]?.[1] || '12:00');
  const [off, setOff] = useState(!ranges.length);
  const [err, setErr] = useState('');
  const save = () => {
    if (!off && !(from && to && to > from)) return setErr('Choose a valid time range.');
    onSave(off ? [] : [[from, to]]);
  };
  return (
    <>
      <div className="form">
        <label>From<input type="time" value={from} disabled={off} onChange={(e) => setFrom(e.target.value)} /></label>
        <label>To<input type="time" value={to} disabled={off} onChange={(e) => setTo(e.target.value)} /></label>
        <label className="check"><input type="checkbox" checked={off} onChange={(e) => setOff(e.target.checked)} /> Unavailable this day</label>
        <p className="warn-t sm">{err}</p>
      </div>
      <div className="actions">
        <button type="button" className="btn btn-o" onClick={onCancel}>Cancel</button>
        <button type="button" className="btn btn-p" onClick={save}>Save</button>
      </div>
    </>
  );
}

/** Close a date; affected users get a reschedule or full refund (AD-93, AD-94). */
export function CloseDate({ booked, onCancel, onConfirm }) {
  if (!booked.length) {
    return (
      <>
        <p>No confirmed appointments on this date.</p>
        <div className="actions">
          <button type="button" className="btn btn-o" onClick={onCancel}>Cancel</button>
          <button type="button" className="btn btn-p" onClick={onConfirm}>Close date</button>
        </div>
      </>
    );
  }
  return (
    <>
      <p>This date has <b>{booked.length}</b> confirmed appointment(s): {booked.map((a) => a.user).join(', ')}.</p>
      <ul className="cons">
        <li>Each user is offered a reschedule (once) or a full refund to their User Wallet.</li>
        <li>You can't reschedule their booking yourself.</li>
        <li>If you can't inform them in advance, all of that day's appointments are cancelled automatically and refunded.</li>
      </ul>
      <p className="muted sm">This is separate from DND — DND never cancels confirmed appointments.</p>
      <div className="actions">
        <button type="button" className="btn btn-o" onClick={onCancel}>Keep open</button>
        <button type="button" className="btn danger-f" onClick={onConfirm}>Close date &amp; notify users</button>
      </div>
    </>
  );
}
