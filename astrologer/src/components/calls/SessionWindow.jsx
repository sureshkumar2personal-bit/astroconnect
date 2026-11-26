import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/Icon.jsx';
import RowChevron from '@/components/ui/RowChevron.jsx';
import useCalls, { callsActions, sessionClock, svcName } from '@/hooks/useCalls.js';
import { inr } from '@/lib/format.js';
import { profileFor, RASI_CELLS } from '@/data/mockSessionProfiles.js';

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

const kb = (n) => (n >= 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);
const safeUrl = (u) => { try { const x = new URL(/^[a-z]+:\/\//i.test(u) ? u : `https://${u}`); return /^https?:$/.test(x.protocol) ? x.href : ''; } catch { return ''; } };

function Bubble({ m }) {
  if (m.kind === 'file') return <span className="sw-att"><Icon name="file" size={16} /><span><b>{m.text}</b><small>{m.meta?.size} · attachment</small></span></span>;
  if (m.kind === 'link') { const u = safeUrl(m.text); return <span className="sw-att"><Icon name="link" size={16} />{u ? <a href={u} target="_blank" rel="noopener noreferrer">{m.text}</a> : m.text}</span>; }
  if (m.kind === 'remedy') return <span className="sw-att sw-att--remedy"><Icon name="lotus" size={16} /><span><small>Remedy</small>{m.text}</span></span>;
  return <span>{m.text}</span>;
}

function Messages({ c }) {
  const ref = useRef(null);
  useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [c.msgs.length]);
  return (
    <div className="sw-msgs" ref={ref} aria-live="polite">
      {c.msgs.map((m, i) => (m.from === 'sys'
        ? <div key={i} className="sw-sys">{m.text}</div>
        : <div key={i} className={`sw-m ${m.from === 'astro' ? 'me' : ''}${m.kind ? ' sw-m--att' : ''}`}><Bubble m={m} /><time>{clock(m.t).toUpperCase()}</time></div>))}
    </div>
  );
}

const Speech = typeof window !== 'undefined' ? (window.SpeechRecognition || window.webkitSpeechRecognition) : null;

// Message box. With `tools` (expanded workspace / phone) it adds the attach row: Attach file, Attach PDF,
// Attach link, Attach remedy and Voice to text. Prototype: files are not uploaded; only the name and size
// are posted in the chat.
function Compose({ tools = false }) {
  const [text, setText] = useState('');
  const [panel, setPanel] = useState(null); // null | 'link' | 'remedy'
  const [extra, setExtra] = useState('');
  const [note, setNote] = useState('');
  const [listening, setListening] = useState(false);
  const fileRef = useRef(null); const pdfRef = useRef(null); const recRef = useRef(null); const inRef = useRef(null);
  useEffect(() => () => recRef.current?.abort?.(), []);
  const send = (e) => { e.preventDefault(); callsActions.send(text); setText(''); };
  const open = (p) => { setNote(''); setExtra(''); setPanel((x) => (x === p ? null : p)); };
  const pick = (e) => {
    const f = e.target.files?.[0]; e.target.value = '';
    if (!f) return;
    if (e.target === pdfRef.current && f.type !== 'application/pdf' && !/\.pdf$/i.test(f.name)) { setNote('Choose a PDF file.'); return; }
    callsActions.send(f.name, 'file', { size: kb(f.size) }); setNote('');
  };
  const addExtra = (e) => {
    e.preventDefault();
    const v = extra.trim(); if (!v) return;
    if (panel === 'link' && !safeUrl(v)) { setNote('Enter a valid web link (https://…).'); return; }
    callsActions.send(v, panel); setPanel(null); setExtra(''); setNote('');
  };
  const voice = () => {
    if (!Speech) { setNote('Voice to text is not supported in this browser.'); return; }
    if (listening) { recRef.current?.stop(); return; }
    const r = new Speech(); recRef.current = r;
    r.lang = 'en-IN'; r.interimResults = false;
    r.onresult = (ev) => { const t = Array.from(ev.results).map((x) => x[0].transcript).join(' '); setText((cur) => `${cur ? `${cur} ` : ''}${t}`.trim()); };
    r.onerror = () => setNote('Could not hear you. Check microphone access and try again.');
    r.onend = () => { setListening(false); inRef.current?.focus(); };
    setNote(''); setPanel(null); setListening(true); r.start();
  };
  const tool = (icon, label, onClick, on = false) => (
    <button type="button" className={`sw-tool${on ? ' on' : ''}`} onClick={onClick} aria-pressed={on || undefined}><Icon name={icon} size={15} />{label}</button>
  );
  return (
    <div className="sw-composer">
      {tools && (
        <>
          <div className="sw-tools" role="toolbar" aria-label="Attach">
            {tool('paperclip', 'Attach file', () => { setPanel(null); fileRef.current?.click(); })}
            {tool('file', 'Attach PDF', () => { setPanel(null); pdfRef.current?.click(); })}
            {tool('link', 'Attach link', () => open('link'), panel === 'link')}
            {tool('lotus', 'Attach remedy', () => open('remedy'), panel === 'remedy')}
            {tool('mic', listening ? 'Listening… tap to stop' : 'Voice to text', voice, listening)}
            <input ref={fileRef} type="file" hidden onChange={pick} accept="image/*,.pdf,.doc,.docx,.txt" />
            <input ref={pdfRef} type="file" hidden onChange={pick} accept="application/pdf,.pdf" />
          </div>
          {panel && (
            <form className="sw-extra" onSubmit={addExtra}>
              {panel === 'link'
                ? <input autoFocus value={extra} onChange={(e) => setExtra(e.target.value)} placeholder="Paste a link, e.g. https://…" aria-label="Link" />
                : <textarea autoFocus rows={2} value={extra} onChange={(e) => setExtra(e.target.value)} placeholder="Describe the remedy, e.g. Light a ghee lamp on Fridays for 11 weeks." aria-label="Remedy" />}
              <button type="submit" className="sw-btn sm" disabled={!extra.trim()}>{panel === 'link' ? 'Send link' : 'Send remedy'}</button>
              <button type="button" className="sw-btn sm" onClick={() => { setPanel(null); setNote(''); }}>Cancel</button>
            </form>
          )}
          {note && <p className="sw-note" role="status">{note}</p>}
        </>
      )}
      <form className="sw-compose" onSubmit={send}>
        <input ref={inRef} value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a message" aria-label="Message" />
        <button type="submit" aria-label="Send" disabled={!text.trim()}><Icon name="send" size={17} /></button>
      </form>
    </div>
  );
}

// One collapsible section of the details panel.
function Sec({ id, icon, title, meta, open, onToggle, link, children }) {
  return (
    <section className={`sw-sec${open ? ' open' : ''}`}>
      <button type="button" className="sw-sec__head" aria-expanded={link ? undefined : open} onClick={() => onToggle(id)}>
        <Icon name={icon} size={16} /><b>{title}</b>{meta && <small>{meta}</small>}
        {link ? <Icon name="chevronRight" size={16} className="sw-sec__chev" /> : <RowChevron open={open} className="sw-sec__chev" />}
      </button>
      {open && <div className="sw-sec__body">{children}</div>}
    </section>
  );
}

// Details panel (left column / Details tab): booking, shared horoscope files, birth details, the User's
// question, previous questions and astrology information. Sample data (data/mockSessionProfiles.js).
function Details({ c, left, preview, onPreview }) {
  const pr = profileFor(c.uid);
  const [open, setOpen] = useState({ booking: true, files: true, birth: true, question: true, prev: false, astro: false });
  const toggle = (k) => setOpen((o) => ({ ...o, [k]: !o[k] }));
  const row = (k, v, cls) => <div className="sw-kv" key={k}><span>{k}</span><b className={cls}>{v}</b></div>;
  const today = new Date(c.start).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  return (
    <div className="sw-details">
      <div className="sw-who">
        <Av c={c} size="lg" />
        <div><b>{c.user}</b><small>User ID {c.uid}</small><span className="sw-chip">{pr.topic}</span></div>
      </div>
      <Sec id="booking" icon="book" title="Booking details" open={open.booking} onToggle={toggle}>
        {row('Service', svcName(c.s))}
        {row('Amount paid', inr(c.pk.p))}
        {row('Booked duration', `${c.pk.m} min`)}
        {row('Session started', clock(c.start).toUpperCase())}
        {row('Remaining', mmss(left))}
      </Sec>
      <Sec id="files" icon="file" title="Horoscope files" meta={`${pr.files.length} shared`} open={open.files} onToggle={toggle}>
        {pr.files.map((f) => (
          <div key={f.name} className={`sw-file${preview === f.name ? ' on' : ''}`}>
            <span className="sw-file__ic" aria-hidden="true"><Icon name="file" size={17} /></span>
            <span className="sw-file__txt"><b>{f.name}</b><small>{f.kind}, {f.size}</small></span>
            <button type="button" className="sw-file__btn" onClick={() => onPreview(f.name)} aria-pressed={preview === f.name}><Icon name="eye" size={15} />Preview</button>
          </div>
        ))}
      </Sec>
      <Sec id="birth" icon="sun" title="Birth details" open={open.birth} onToggle={toggle}>
        {row('Date of birth', pr.birth.dob)}
        {row('Birth time', pr.birth.time)}
        {row('Birth place', pr.birth.place)}
        {row('Rasi', pr.birth.rasi)}
        {row('Nakshatra', pr.birth.nakshatra)}
        {row('Lagnam', pr.birth.lagnam)}
      </Sec>
      <Sec id="question" icon="chatQuestion" title="User question" meta={pr.topic} open={open.question} onToggle={toggle}>
        <p className="sw-q">{pr.question}</p>
      </Sec>
      <Sec id="prev" icon="history" title="Previous questions" meta={pr.prev.length ? `${pr.prev.length}` : 'None'} open={open.prev && pr.prev.length > 0} onToggle={toggle} link={!pr.prev.length}>
        {pr.prev.map(([t, id]) => row(t, id))}
      </Sec>
      <Sec id="astro" icon="calendar" title="Astrology information" meta="Today" open={open.astro} onToggle={toggle}>
        {row('Date', today)}
        {row('Birth Rasi', pr.birth.rasi)}
        {row('Birth Nakshatra', pr.birth.nakshatra)}
        <p className="muted sm">Sample: today's planetary positions are not connected yet.</p>
      </Sec>
    </div>
  );
}

// Preview of a shared horoscope file: South-Indian Rasi chart drawn from the sample data.
function FilePreview({ c, name }) {
  const pr = profileFor(c.uid);
  const grid = Array.from({ length: 4 }, () => Array(4).fill(null));
  Object.entries(RASI_CELLS).forEach(([r, [y, x]]) => { grid[y][x] = r; });
  const f = pr.files.find((x) => x.name === name) || pr.files[0];
  return (
    <div className="sw-preview">
      <div className="sw-sheet">
        <h3>Jathagam of {c.user}</h3>
        <p>Born {pr.birth.dob}, {pr.birth.time}, {pr.birth.place}. Rasi {pr.birth.rasi}, Nakshatra {pr.birth.nakshatra}, Lagnam {pr.birth.lagnam}.</p>
        <div className="sw-chart" role="img" aria-label={`Rasi chart of ${c.user}`}>
          {grid.flatMap((r, y) => r.map((rasi, x) => {
            if (y === 1 && x === 1) return <div key="mid" className="sw-chart__mid"><b>Rasi</b><small>Sample chart</small></div>;
            if (!rasi) return null;
            return (
              <div key={rasi} className="sw-chart__cell" style={{ gridRow: y + 1, gridColumn: x + 1 }} title={rasi}>
                {(pr.chart[rasi] || []).map((g) => <span key={g} className={g === 'La' ? 'la' : ''}>{g}</span>)}
              </div>
            );
          }))}
        </div>
        <small className="sw-sheet__foot">Page 1 of {f.pages}. Sample preview of the uploaded PDF.</small>
      </div>
    </div>
  );
}

// File chips above the right side while a file is open (✕ closes the preview).
function FileBar({ c, name, onClose, mainLabel }) {
  return (
    <div className="sw-filebar">
      {mainLabel && <button type="button" className="sw-fchip" onClick={onClose}>{mainLabel}</button>}
      <button type="button" className="sw-fchip on" onClick={onClose} title={`Close ${name}`} aria-label={`${name}, open. Close preview`}><Icon name="file" size={15} />{name}</button>
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
  const [preview, setPreview] = useState(null); // open horoscope file name (desktop: right side; phone: own view)
  useEffect(() => { if (!c) { setAsk(false); setMenu(false); setTab('main'); setPreview(null); } }, [c]);
  if (!c || (availability && !availability[c.s])) return null;

  const { elapsed, left } = sessionClock(c, Math.max(now || 0, Date.now()));
  const pct = Math.min(100, (elapsed / (c.pk.m * 60)) * 100);
  const call = c.s === 'call';
  const word = call ? 'call' : 'chat';
  const status = c.state === 'Active' ? (call ? (c.muted ? 'On call, muted' : 'On call') : 'Active chat') : 'Reconnecting…';
  const mode = mobile ? (c.mode === 'minimized' ? 'minimized' : 'expanded') : (c.mode || 'compact');
  const to = (m) => { setMenu(false); callsActions.setMode(m); };
  const bar = <div className="sw-prog" aria-hidden="true"><i style={{ width: `${100 - pct}%` }} /></div>; // time remaining
  const endBtn = (cls = '', short = false) => (
    <button type="button" className={`sw-btn sw-btn--end ${cls}`} onClick={() => setAsk(true)} aria-label={`End ${word}`}>{short ? 'End' : `End ${word}`}</button>
  );
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
            {!call && <IconBtn icon="expand" label="Expand" onClick={() => to('expanded')} />}
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
              <div className="sw-prog" aria-hidden="true"><i style={{ width: `${100 - pct}%` }} /></div>
              <div className="sw-ctrls">
                <button type="button" className={`sw-cc${c.muted ? ' on' : ''}`} aria-pressed={c.muted} onClick={callsActions.toggleMute}><span><Icon name="mic" size={18} /></span>{c.muted ? 'Unmute' : 'Mute'}</button>
                <button type="button" className={`sw-cc${c.speaker ? ' on' : ''}`} aria-pressed={c.speaker} onClick={callsActions.toggleSpeaker}><span><Icon name="speaker" size={18} /></span>Speaker</button>
                <button type="button" className="sw-cc" onClick={() => to('expanded')}><span><Icon name="eye" size={18} /></span>Details</button>
                <button type="button" className="sw-cc sw-cc--end" onClick={() => setAsk(true)}><span><Icon name="phoneOff" size={18} /></span>End</button>
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
              {endBtn('sm', true)}
            </div>
            {bar}
            <div className="sw-tabs" role="tablist">
              <button type="button" role="tab" aria-selected={tab === 'main'} className={tab === 'main' ? 'on' : ''} onClick={() => setTab('main')}>{call ? 'Call' : 'Chat'}</button>
              <button type="button" role="tab" aria-selected={tab !== 'main'} className={tab !== 'main' ? 'on' : ''} onClick={() => setTab('details')}>Details and files</button>
            </div>
            {tab === 'file' && preview ? (
              <div className="sw-scroll"><FileBar c={c} name={preview} onClose={() => { setPreview(null); setTab('details'); }} /><FilePreview c={c} name={preview} /></div>
            ) : tab === 'details' ? <div className="sw-scroll"><Details c={c} left={left} preview={preview} onPreview={(n) => { setPreview(n); setTab('file'); }} /></div>
              : call ? (
                // Phone call screen (reference): ringed avatar, status, booked / left meter and controls together.
                <div className="sw-scroll sw-mcall">
                  <div className="sw-mcall__in">
                    <Av c={c} size="xl" />
                    <b>{c.user}</b>
                    <span className="sw-mcall__st">{status}, {mmss(elapsed)}</span>
                    <div className="sw-mcall__meter"><div className="sw-meter"><span>Booked {c.pk.m} min</span><span><b>{mmss(left)}</b> left</span></div>{bar}</div>
                    <div className="sw-ctrls">
                      <button type="button" className={`sw-cc${c.muted ? ' on' : ''}`} aria-pressed={c.muted} onClick={callsActions.toggleMute}><span><Icon name="mic" size={18} /></span>{c.muted ? 'Unmute' : 'Mute'}</button>
                      <button type="button" className={`sw-cc${c.speaker ? ' on' : ''}`} aria-pressed={c.speaker} onClick={callsActions.toggleSpeaker}><span><Icon name="speaker" size={18} /></span>Speaker</button>
                      <button type="button" className="sw-cc" onClick={() => { setPreview(profileFor(c.uid).files[0]?.name || null); setTab('file'); }}><span><Icon name="file" size={18} /></span>Horoscope</button>
                      <button type="button" className="sw-cc sw-cc--end" onClick={() => setAsk(true)}><span><Icon name="phoneOff" size={18} /></span>End</button>
                    </div>
                    <span className="muted sm">Prototype — no audio is connected.</span>
                  </div>
                </div>
              ) : (<><Messages c={c} /><Compose tools /></>)}
          </>
        ) : (
          <>
            <div className="sw-ws__left"><Details c={c} left={left} preview={preview} onPreview={(n) => setPreview((p) => (p === n ? null : n))} /></div>
            <div className="sw-ws__right">
              <div className={`sw-head${call ? ' sw-head--call' : ''}`}>
                <Av c={c} />
                <div className="sw-id"><b>{c.user}</b><small><span className="sw-dot" />{status}, {c.pk.m} min booked</small></div>
                <div className="sw-timers"><span><small>{call ? 'Duration' : 'Elapsed'}</small><b>{mmss(elapsed)}</b></span><span><small>Remaining</small><b>{mmss(left)}</b></span></div>
                {call && (
                  <>
                    <IconBtn icon="mic" label={c.muted ? 'Unmute' : 'Mute'} onClick={callsActions.toggleMute} pressed={c.muted} className={c.muted ? 'on' : ''} />
                    <IconBtn icon="speaker" label="Speaker" onClick={callsActions.toggleSpeaker} pressed={c.speaker} className={c.speaker ? 'on' : ''} />
                    <IconBtn icon="phoneOff" label="End call" onClick={() => setAsk(true)} className="sw-ibtn--end" />
                  </>
                )}
                <IconBtn icon="shrink" label="Back to compact window" onClick={() => to('compact')} />
                <IconBtn icon="minimize" label="Minimize" onClick={() => to('minimized')} />
                {!call && endBtn()}
              </div>
              {bar}
              {preview ? (
                <div className="sw-ws__file">
                  <FileBar c={c} name={preview} onClose={() => setPreview(null)} mainLabel={call ? null : 'Chat'} />
                  <FilePreview c={c} name={preview} />
                </div>
              ) : call ? <CallBody c={c} /> : (<><Messages c={c} /><Compose tools /></>)}
            </div>
          </>
        )}
      </div>
      {confirm}
    </>
  );
}
