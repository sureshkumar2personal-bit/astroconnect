import { useState } from 'react';

// Dialog bodies for Appointments (rendered inside WorkPage's shared <Dialog>).

/** Astrologer cancellation (AD-91, AD-98). */
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
