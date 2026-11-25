import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/Icon.jsx';
import useCalls, { callsActions, sessionClock, svcName } from '@/hooks/useCalls.js';
import { inr } from '@/lib/format.js';

// The active Instant Call / Instant Chat session window, as in the prototype. One window that follows
// every page; it reads and changes only the shared session (hooks/useCalls.js), so switching mode never
// resets the conversation, call state or timer.
//   Desktop: Accept → compact window (bottom-right) → Expand → split workspace over the dashboard
//            (Shrink back to compact) → Minimize → pill (Restore → compact).
//   Phone:   Accept → full screen → Minimize → bar above the bottom navigation (Open → full screen).
//   End call / End chat asks for confirmation, then the session ends and the window is gone.
// Hidden while that service's switch is OFF (the session itself is kept).

export const initials = (name) => name.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
const mmss = (t) => `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
const clock = (ms) => new Date(ms).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });

function useMobile() {
  const q = '(max-width: 760px)';
  const [m, setM] = useState(() => window.matchMedia(q).matches);
  useEffect(() => { const mq = window.matchMedia(q); const f = () => setM(mq.matches); mq.addEventListener('change', f); return () => mq.removeEventListener('change', f); }, []);
  return m;
}

const Av = ({ c, size = '' }) => (
  <span className={`sw-av ${size}`} aria-hidden="true">{initials(c.user)}<i /></span>
);

function Messages({ c }) {
  const ref = useRef(null);
  useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [c.msgs.length]);
  return (
    <div className="sw-msgs" ref={ref} aria-live="polite">
      {c.msgs.map((m, i) => (m.from === 'sys'
        ? <div key={i} className="sw-sys">{m.text}</div>
        : <div key={i} className={`sw-m ${m.from === 'astro' ? 'me' : ''}`}><span>{m.text}</span><time>{clock(m.t)}</time></div>))}
    </div>
  );
}

function Compose() {
  const [text, setText] = useState('');
  const send = (e) => { e.preventDefault(); callsActions.send(text); setText(''); };
  return (
    <form className="sw-compose" onSubmit={send}>
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a message" aria-label="Message" />
      <button type="submit" aria-label="Send" disabled={!text.trim()}><Icon name="send" size={17} /></button>
    </form>
  );
}

function Details({ c, left }) {
  const row = (k, v) => <div className="sw-kv" key={k}><span>{k}</span><b>{v}</b></div>;
  return (
    <div className="sw-details">
      <div className="sw-who">
        <Av c={c} size="lg" />
        <div><b>{c.user}</b><small>User ID {c.uid}</small>{c.sub && <span className="sw-chip">{c.sub} subscriber</span>}</div>
      </div>
      <section>
        <h3><Icon name="book" size={16} />Booking details</h3>
        {row('Service', svcName(c.s))}
        {row('Amount paid', inr(c.pk.p))}
        {row('Booked duration', `${c.pk.m} min`)}
        {row('Session started', clock(c.start))}
        {row('Remaining', mmss(left))}
        {row('Status', c.state)}
      </section>
    </div>
  );
}

function CallBody({ c }) {
  return (
    <div className="sw-callbody">
      <Av c={c} size="xl" />
      <b>{c.user}</b>
      <span className="muted">{c.state === 'Active' ? (c.muted ? 'On call, muted' : 'On call') : c.state}</span>
      <span className="muted sm">Prototype — no audio is connected.</span>
    </div>
  );
}

const IconBtn = ({ icon, label, onClick, className = '', pressed }) => (
  <button type="button" className={`sw-ibtn ${className}`} onClick={onClick} aria-label={label} title={label} aria-pressed={pressed}>
    <Icon name={icon} size={17} stroke={2} />
  </button>
);

function EndConfirm({ c, left, onCancel }) {
  const word = c.s === 'call' ? 'call' : 'chat';
  const keep = useRef(null);
  useEffect(() => { keep.current?.focus(); }, []);
  return (
    <div className="sw-modal" role="dialog" aria-modal="true" aria-labelledby="sw-end-h" onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
      onKeyDown={(e) => { if (e.key === 'Escape') onCancel(); }}>
      <div className="sw-modal__box">
        <h2 id="sw-end-h">End {word} with {c.user}?</h2>
        <p>{mmss(left)} of the booked {c.pk.m} min remain. {c.user} will be notified that the session has ended.</p>
        <div className="sw-modal__act">
          <button type="button" className="sw-btn" ref={keep} onClick={onCancel}>Keep {c.s === 'call' ? 'talking' : 'chatting'}</button>
          <button type="button" className="sw-btn sw-btn--end" onClick={callsActions.end}>End {word}</button>
        </div>
      </div>
    </div>
  );
}

export default function SessionWindow({ availability }) {
  const { session: c, now } = useCalls();
  const mobile = useMobile();
  const [ask, setAsk] = useState(false);
  const [menu, setMenu] = useState(false);
  const [tab, setTab] = useState('main');
  useEffect(() => { if (!c) { setAsk(false); setMenu(false); setTab('main'); } }, [c]);
  if (!c || (availability && !availability[c.s])) return null;

  const { elapsed, left } = sessionClock(c, Math.max(now || 0, Date.now()));
  const pct = Math.min(100, (elapsed / (c.pk.m * 60)) * 100);
  const call = c.s === 'call';
  const word = call ? 'call' : 'chat';
  const status = c.state === 'Active' ? (call ? (c.muted ? 'On call, muted' : 'On call') : 'Active chat') : 'Reconnecting…';
  const mode = mobile ? (c.mode === 'minimized' ? 'minimized' : 'expanded') : (c.mode || 'compact');
  const to = (m) => { setMenu(false); callsActions.setMode(m); };
  const bar = <div className="sw-prog" aria-hidden="true"><i style={{ width: `${pct}%` }} /></div>;
  const endBtn = (cls = '') => <button type="button" className={`sw-btn sw-btn--end ${cls}`} onClick={() => setAsk(true)}>End {word}</button>;
  const confirm = ask && <EndConfirm c={c} left={left} onCancel={() => setAsk(false)} />;
  const label = `${svcName(c.s)} with ${c.user}`;

  // Minimized: pill (desktop) / bar above the bottom navigation (phone).
  if (mode === 'minimized') {
    return (
      <>
        <div className={`sw-pill sw-pill--${c.s}${mobile ? ' sw-pill--bar' : ''}`} role="region" aria-label={label}>
          <button type="button" className="sw-pill__main" onClick={() => to(mobile ? 'expanded' : 'compact')} aria-label={`Open ${label}`}>
            <Av c={c} />
            <span className="sw-pill__txt"><b>{c.user}</b><small>{status}, {mmss(left)} left</small></span>
          </button>
          <button type="button" className="sw-pill__open" onClick={() => to(mobile ? 'expanded' : 'compact')} aria-label={`Restore ${label}`}>
            {mobile && 'Open'}<Icon name="chevronDown" size={16} stroke={2.2} className="sw-up" />
          </button>
        </div>
        {confirm}
      </>
    );
  }

  // Compact window (desktop).
  if (mode === 'compact') {
    return (
      <>
        <div className={`sw-compact sw-compact--${c.s}`} role="dialog" aria-label={label}>
          <div className="sw-head">
            <Av c={c} />
            <div className="sw-id"><b>{c.user}</b><small><span className="sw-dot" />{status}, {mmss(elapsed)}</small></div>
            {!call && <span className="sw-left">{mmss(left)} left</span>}
            <IconBtn icon="expand" label="Expand" onClick={() => to('expanded')} />
            <IconBtn icon="minimize" label="Minimize" onClick={() => to('minimized')} />
            {!call && (
              <span className="sw-morewrap">
                <IconBtn icon="more" label="More options" onClick={() => setMenu((m) => !m)} pressed={menu} />
                {menu && (
                  <div className="sw-menu" role="menu">
                    <button type="button" role="menuitem" onClick={() => to('expanded')}><Icon name="eye" size={16} />Open user details</button>
                    <button type="button" role="menuitem" className="sw-menu__end" onClick={() => { setMenu(false); setAsk(true); }}><Icon name="phoneEnd" size={16} />End chat</button>
                  </div>
                )}
              </span>
            )}
          </div>
          {call ? (
            <>
              <div className="sw-meter"><span>Booked {c.pk.m} min</span><span><b>{mmss(left)}</b> left</span></div>
              {bar}
              <div className="sw-ctrls">
                <button type="button" className={`sw-cc${c.muted ? ' on' : ''}`} aria-pressed={c.muted} onClick={callsActions.toggleMute}><span><Icon name="mic" size={18} /></span>{c.muted ? 'Unmute' : 'Mute'}</button>
                <button type="button" className={`sw-cc${c.speaker ? ' on' : ''}`} aria-pressed={c.speaker} onClick={callsActions.toggleSpeaker}><span><Icon name="speaker" size={18} /></span>Speaker</button>
                <button type="button" className="sw-cc" onClick={() => to('expanded')}><span><Icon name="eye" size={18} /></span>Details</button>
                <button type="button" className="sw-cc sw-cc--end" onClick={() => setAsk(true)}><span><Icon name="phoneEnd" size={18} /></span>End</button>
              </div>
            </>
          ) : (
            <>
              {bar}
              <Messages c={c} />
              <Compose />
            </>
          )}
        </div>
        {confirm}
      </>
    );
  }

  // Expanded workspace (desktop: split over the dashboard; phone: full screen with tabs).
  return (
    <>
      <div className={`sw-ws${mobile ? ' sw-ws--full' : ''}`} role="dialog" aria-label={`${call ? 'Call' : 'Chat'} workspace with ${c.user}`}>
        {mobile ? (
          <>
            <div className="sw-head">
              <IconBtn icon="chevronDown" label="Minimize" onClick={() => to('minimized')} />
              <Av c={c} />
              <div className="sw-id"><b>{c.user}</b><small><span className="sw-dot" />{status}, {mmss(left)} left</small></div>
              {endBtn('sm')}
            </div>
            {bar}
            <div className="sw-tabs" role="tablist">
              <button type="button" role="tab" aria-selected={tab === 'main'} className={tab === 'main' ? 'on' : ''} onClick={() => setTab('main')}>{call ? 'Call' : 'Chat'}</button>
              <button type="button" role="tab" aria-selected={tab === 'details'} className={tab === 'details' ? 'on' : ''} onClick={() => setTab('details')}>Details</button>
            </div>
            {tab === 'details' ? <div className="sw-scroll"><Details c={c} left={left} /></div>
              : call ? (
                <>
                  <CallBody c={c} />
                  <div className="sw-ctrls">
                    <button type="button" className={`sw-cc${c.muted ? ' on' : ''}`} aria-pressed={c.muted} onClick={callsActions.toggleMute}><span><Icon name="mic" size={18} /></span>{c.muted ? 'Unmute' : 'Mute'}</button>
                    <button type="button" className={`sw-cc${c.speaker ? ' on' : ''}`} aria-pressed={c.speaker} onClick={callsActions.toggleSpeaker}><span><Icon name="speaker" size={18} /></span>Speaker</button>
                    <button type="button" className="sw-cc sw-cc--end" onClick={() => setAsk(true)}><span><Icon name="phoneEnd" size={18} /></span>End</button>
                  </div>
                </>
              ) : (<><Messages c={c} /><Compose /></>)}
          </>
        ) : (
          <>
            <div className="sw-ws__left"><Details c={c} left={left} /></div>
            <div className="sw-ws__right">
              <div className={`sw-head${call ? ' sw-head--call' : ''}`}>
                <Av c={c} />
                <div className="sw-id"><b>{c.user}</b><small><span className="sw-dot" />{status}, {c.pk.m} min booked</small></div>
                <div className="sw-timers"><span><small>{call ? 'Duration' : 'Elapsed'}</small><b>{mmss(elapsed)}</b></span><span><small>Remaining</small><b>{mmss(left)}</b></span></div>
                {call && (
                  <>
                    <IconBtn icon="mic" label={c.muted ? 'Unmute' : 'Mute'} onClick={callsActions.toggleMute} pressed={c.muted} className={c.muted ? 'on' : ''} />
                    <IconBtn icon="speaker" label="Speaker" onClick={callsActions.toggleSpeaker} pressed={c.speaker} className={c.speaker ? 'on' : ''} />
                  </>
                )}
                <IconBtn icon="shrink" label="Back to compact window" onClick={() => to('compact')} />
                <IconBtn icon="minimize" label="Minimize" onClick={() => to('minimized')} />
                {endBtn()}
              </div>
              {bar}
              {call ? <CallBody c={c} /> : (<><Messages c={c} /><Compose /></>)}
            </div>
          </>
        )}
      </div>
      {confirm}
    </>
  );
}
