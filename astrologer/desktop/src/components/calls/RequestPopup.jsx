import { useEffect, useRef } from 'react';
import { inr } from '@shared/lib/format.js';
import { ACCEPT_SECONDS, callsActions, tabLabel } from '@shared/hooks/useCalls.js';
import { navigate } from '@shared/lib/router.js';

// Incoming request popup (AD-104): accept within 30 seconds or it expires; Decline → Declined.
// Prototype: the request is simulated; accepting opens a simulated session (no call/audio).
export default function RequestPopup({ req }) {
  const box = useRef(null);
  useEffect(() => { box.current?.focus(); }, []);
  const accept = () => { callsActions.accept(); navigate('/calls'); };
  return (
    <div className="overlay">
      <div className="callpop" role="alertdialog" aria-label="Incoming request" aria-describedby="cc-req-desc" tabIndex={-1} ref={box}>
        <span className="muted">Incoming Instant {tabLabel(req.s)}</span>
        <b className="lg">{req.user}</b>
        <span id="cc-req-desc">{req.pk.m}-minute package · {inr(req.pk.p)} prepaid</span>
        <div className="ring2" aria-label={`${req.left} seconds left`}>{req.left}</div>
        <span className="muted sm">Accept within {ACCEPT_SECONDS} seconds or it expires.</span>
        <div className="actions">
          <button type="button" className="btn btn-o danger" onClick={callsActions.decline}>Decline</button>
          <button type="button" className="btn btn-p" onClick={accept}>Accept</button>
        </div>
      </div>
    </div>
  );
}
