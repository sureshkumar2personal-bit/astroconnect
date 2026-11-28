import { useEffect, useRef, useState } from 'react';
import { Ico } from './CalendarGrid.jsx';

// Voice call panel (reference "AstroConnect – Astrologer Appointments"; AD-96/97). Prototype: no real call is placed —
// the countdown is local. A disconnection starts a 5-minute reconnection window during which consultation time is
// paused and preserved (AD-97). Ending the call unlocks the post-call sharing that completes the appointment (AD-102).
const mmss = (s) => `${String(Math.floor(Math.max(0, s) / 60)).padStart(2, '0')}:${String(Math.max(0, s) % 60).padStart(2, '0')}`;

export default function CallPanel({ a, onEnd, onLog, ui }) {
  const total = a.dur * 60;
  const [remain, setRemain] = useState(total);
  const [muted, setMuted] = useState(false);
  const [re, setRe] = useState(null); // seconds left in the reconnection window, or null when connected
  const ended = useRef(false);
  const usedMin = () => Math.max(1, Math.round((total - remain) / 60));

  const finish = (failed) => {
    if (ended.current) return; ended.current = true;
    const used = usedMin();
    onEnd({ usedMin: used, note: failed ? `Call ended: reconnection window (5 min) expired · ${used} of ${a.dur} min used` : `Call ended · ${used} of ${a.dur} min` });
    ui.toast(failed ? 'Reconnection failed. The consultation was closed; share the post-call attachment to complete it.' : 'Call ended. Share the post-call attachment to complete the appointment.');
  };

  useEffect(() => {
    const t = setInterval(() => {
      if (ended.current) return;
      if (re != null) setRe((r) => (r == null ? r : r - 1));
      else setRemain((r) => r - 1);
    }, 1000);
    return () => clearInterval(t);
  }, [re]);
  useEffect(() => { if (re != null && re <= 0) finish(true); }, [re]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (remain <= 0) finish(false); }, [remain]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={'dock' + (re != null ? ' re' : '')} role="region" aria-label="Call in progress">
      <div className="dock-h"><span className="dock-ic"><Ico n="phone" /></span><div><div className="dock-n">{a.user}</div><div className="dock-s">{a.id} · {a.dur} min voice consultation</div></div></div>
      <div><div className="dock-t">{mmss(remain)}</div><div className="dock-l">{re != null ? 'remaining · paused while reconnecting' : `remaining · connected${muted ? ' · muted' : ''}`}</div></div>
      {re != null && <div className="dock-re" role="status">Reconnecting… {mmss(re)} left in the 5-minute window. Consultation time is paused and preserved.</div>}
      <div className="dock-b">
        {re == null ? (
          <>
            <button type="button" className="btn" onClick={() => setMuted((m) => !m)}>{muted ? 'Unmute' : 'Mute'}</button>
            <button type="button" className="btn" onClick={() => { setRe(300); onLog(`Call disconnected · reconnecting (5-min window) · ${mmss(remain)} preserved`); }}>Simulate disconnect</button>
            <button type="button" className="btn" onClick={() => setRemain((r) => Math.max(0, r - 300))}>Skip 5 min</button>
          </>
        ) : (
          <>
            <button type="button" className="btn" onClick={() => { setRe(null); onLog(`Reconnected · resumed with ${mmss(remain)} left`); ui.toast(`Reconnected. ${mmss(remain)} of consultation time remains.`); }}>Reconnected</button>
            <button type="button" className="btn" onClick={() => finish(true)}>Let window expire</button>
          </>
        )}
        <button type="button" className="btn end" onClick={() => finish(false)}>End consultation</button>
      </div>
    </div>
  );
}
