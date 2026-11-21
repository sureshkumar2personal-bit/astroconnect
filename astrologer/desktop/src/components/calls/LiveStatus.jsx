import { Badge, BtnRow, Sec } from '../section/kit.jsx';
import { callsActions, sessionTime, svcName } from '@shared/hooks/useCalls.js';

// "Live status" card: the single availability lock (AD-105) and the prototype request
// simulator, or the running session with timer, disconnect and end (AD-107, AD-109).
export default function LiveStatus({ st, av, ui }) {
  const c = st.session;
  const simulate = (s) => { const err = callsActions.simulate(s, av); if (err) ui.toast(err); };
  return (
    <Sec title="Live status">
      {c ? (
        <>
          <div className="row">
            <span className="grow">
              <b>{svcName(c.s)} with {c.user}</b>
              <div className="muted sm">{c.pk.m}-minute package · {c.state}</div>
            </span>
            <Badge kind="ok">Live</Badge>
          </div>
          <b className="cc-timer">{sessionTime(c, st.now || Date.now())}</b>
          <p className="muted sm">The user sees an extension option 1 minute before the package ends; if they pay, the same session continues. The other service stays unavailable until this session ends. DND can't be turned on during a session.</p>
          <BtnRow>
            <button type="button" className="btn btn-o" onClick={callsActions.drop} disabled={!!c.dropAt}>Simulate disconnect</button>
            <button type="button" className="btn btn-p danger-f" onClick={callsActions.end}>End session</button>
          </BtnRow>
          <span className="muted sm">Prototype — no call, audio or chat is connected.</span>
        </>
      ) : (
        <>
          <div className="row"><span className="grow">Lock</span><Badge kind="info">{st.lock ? `Busy — ${st.lock}` : 'Free'}</Badge></div>
          <p className="muted sm">Try an incoming request (prototype):</p>
          <BtnRow>
            <button type="button" className="btn btn-p" onClick={() => simulate('call')}>Simulate Call request</button>
            <button type="button" className="btn btn-o" onClick={() => simulate('chat')}>Simulate Chat request</button>
          </BtnRow>
        </>
      )}
    </Sec>
  );
}
