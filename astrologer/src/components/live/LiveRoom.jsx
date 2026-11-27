import { useEffect, useState } from 'react';
import { Badge, BtnRow, Sec } from '@/components/ui/sectionKit.jsx';
import { PAUSE_LIMIT_MS, liveActions } from '@/hooks/useLive.js';
import { navigate } from '@/lib/router.js';
import { ConfirmEnd } from './LiveDialogs.jsx';

const mmss = (ms) => { const t = Math.max(0, Math.ceil(ms / 1000)); return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`; };

// The Live screen (AD-115, AD-116): stream panel, Pause/Resume/End, audience comments with Mute/Remove.
const RANK = { followers: { follower: 0, subscriber: 1, public: 2 }, subscribers: { subscriber: 0, follower: 1, public: 2 } };
const COMMENTERS = { everyone: 'Everyone', followers: 'Followers', subscribers: 'Subscribers', tiers: 'Specific subscription tiers' };

export default function LiveRoom({ live: l, ui, settings: st }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!l.paused) return undefined;
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [l.paused]);
  const left = l.paused ? Math.min(PAUSE_LIMIT_MS, PAUSE_LIMIT_MS - (now - l.pausedAt)) : 0;

  const endLive = () => ui.dialog({
    title: 'End Live',
    body: (close) => <ConfirmEnd onKeep={close} onConfirm={() => { liveActions.end(); close(); navigate('/live/summary'); }} />,
  });

  return (
    <div className="split2">
      <Sec>
        <div className={`preview live-stage${l.paused ? ' is-paused' : ''}`} aria-live="polite">
          {l.paused ? (
            <>
              <b className="lg">Paused</b>
              <span className="sm warn-t">Resume within 5 minutes or the Live ends automatically.</span>
              <span className="live-count">{mmss(left)}</span>
            </>
          ) : (
            <><span className="live-dot" aria-hidden="true" /><b className="lg">You are live</b></>
          )}
          <span className="sm">{l.parts} watching</span>
          <span className="muted sm">Prototype — no camera, stream or audience is connected.</span>
        </div>
        <BtnRow>
          {l.paused
            ? <button type="button" className="btn btn-p" onClick={liveActions.resume}>Resume</button>
            : <button type="button" className="btn btn-o" onClick={liveActions.pause}>Pause</button>}
          <button type="button" className="btn danger-f" onClick={endLive}>End Live</button>
        </BtnRow>
        <p className="muted sm">No recording or replay. If the connection drops, resuming is attempted; if it can't continue, the interruption is recorded and viewers are notified.</p>
      </Sec>
      <Sec title="Comments (selected audience only)">
        {st.comment === 'off' ? (
          <span className="muted sm">Comments are turned off for your lives (Live Settings).</span>
        ) : (
          <>
            <span className="muted sm">Who can comment: {COMMENTERS[st.comment]}{st.slow ? ' · Slow mode: viewers can comment once every 10 seconds.' : ''}</span>
            <div className="stack">
              {l.comments.length ? l.comments
                .map((c, i) => ({ c, i }))
                .sort((a, b) => (Number(!!b.c.pinned) - Number(!!a.c.pinned)) || ((RANK[st.priority]?.[a.c.role] ?? 0) - (RANK[st.priority]?.[b.c.role] ?? 0)) || (a.i - b.i))
                .map(({ c, i }) => (
                  <div key={`${c.name}-${i}`} className="li">
                    <span className="ic" aria-hidden="true">{c.name[0]}</span>
                    <div className="grow">
                      <b className="sm">{c.name}</b> {c.pinned && <Badge kind="info">Pinned</Badge>} {c.muted && <Badge kind="warn">Muted</Badge>}
                      <div>{c.text}</div>
                    </div>
                    {st.pin && <button type="button" className="btn btn-o sm" onClick={() => { liveActions.pin(i); ui.toast(c.pinned ? 'Comment unpinned' : 'Comment pinned'); }}>{c.pinned ? 'Unpin' : 'Pin'}</button>}
                    {st.mute && <button type="button" className="btn btn-o sm" disabled={c.muted} onClick={() => { liveActions.mute(i); ui.toast(`${c.name} muted`); }}>{c.muted ? 'Muted' : 'Mute'}</button>}
                    {st.block && <button type="button" className="btn btn-o sm danger" onClick={() => { liveActions.remove(i); ui.toast('User removed from this Live'); }}>Remove</button>}
                  </div>
                )) : <span className="muted sm">No comments.</span>}
            </div>
          </>
        )}
        <span className="muted sm">Answer comments at your discretion — there's no obligation to reply to every one.</span>
      </Sec>
    </div>
  );
}
