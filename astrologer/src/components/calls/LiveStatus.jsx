import { Badge, BtnRow, Sec } from '@/components/ui/sectionKit.jsx';
import { callsActions, sessionTime, svcName } from '@/hooks/useCalls.js';

// "Live status" card: waiting-request counts and the prototype request simulator, or the
// running session with timer, disconnect and end (AD-107, AD-109).
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
            <button type="button" className="btn btn-o" onClick={() => callsActions.setMode('expanded')}>Open consultation</button>
            <button type="button" className="btn btn-p danger-f" onClick={callsActions.end}>End {c.s === 'call' ? 'call' : 'chat'}</button>
          </BtnRow>
          <span className="muted sm">Prototype — no call, audio or chat is connected.</span>
        </>
      ) : (
        <>
          <div className="row"><span className="grow">Waiting requests</span><Badge kind="info">{`Calls ${st.queue?.call?.length || 0} · Chats ${st.queue?.chat?.length || 0}`}</Badge></div>
          <p className="muted sm">Requests arrive automatically while a service is ON (prototype source: existing customers). For testing, add one now:</p>
          <BtnRow>
            <button type="button" className="btn btn-p" onClick={() => simulate('call')}>Simulate Call request</button>
            <button type="button" className="btn btn-o" onClick={() => simulate('chat')}>Simulate Chat request</button>
          </BtnRow>
        </>
      )}
    </Sec>
  );
}
