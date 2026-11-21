import { useState } from 'react';
import { PendingTag } from '@/components/ui/primitives.jsx';
import { hasActiveSession } from '@/hooks/useCalls.js';

// Planned Unavailability dialog (AD-09): same effect as DND for a future period; profile hidden and
// no new bookings. Confirmed appointments stay valid; closing a date with bookings is a separate
// appointment workflow. Maximum length / notice period: AP-01-15.
export default function PlannedUnavailability({ pu, onSave, onCancelPeriod, onClose }) {
  const [start, setStart] = useState(pu?.start || '2026-12-10');
  const [end, setEnd] = useState(pu?.end || '2026-12-19');
  const [err, setErr] = useState('');
  const save = () => {
    if (!start || !end || end < start) return setErr('Choose a valid date range.');
    if (hasActiveSession()) return setErr('Finish your ongoing Call/Chat first.');
    onSave({ start, end });
  };
  return (
    <>
      <p className="sm">
        Same feature as DND, set for a future period. During it your profile is hidden and no new service can be booked.
        Confirmed appointments remain valid; closing a date with bookings is a separate{' '}
        <a href="#/work/appointments/calendar" onClick={onClose}>appointment workflow</a>.
      </p>
      <div className="form">
        <div className="grid2">
          <label><span className="req">From</span><input type="date" value={start} onChange={(e) => { setErr(''); setStart(e.target.value); }} /></label>
          <label><span className="req">To</span><input type="date" value={end} onChange={(e) => { setErr(''); setEnd(e.target.value); }} /></label>
        </div>
        <span className="muted sm">Maximum length and notice period: <PendingTag id="AP-01-15" /></span>
        <p className="warn-t sm" role="alert">{err}</p>
      </div>
      <div className="actions">
        {pu?.start && <button type="button" className="btn btn-o danger" onClick={onCancelPeriod}>Cancel period</button>}
        <button type="button" className="btn btn-o" onClick={onClose}>Close</button>
        <button type="button" className="btn btn-p" onClick={save}>{pu?.start ? 'Save changes' : 'Set period'}</button>
      </div>
    </>
  );
}
