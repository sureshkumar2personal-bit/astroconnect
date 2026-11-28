import { useEffect, useRef, useState } from 'react';
import { PendingTag } from '@/components/ui/sectionKit.jsx';
import { CLOSED_STATUSES } from '@/data/mockSupport.js';
import { lastUpdate, supportActions } from '@/hooks/useSupport.js';

// Ticket conversation panel (AD-160; reference "Help & Support" drawer): status notice, the original
// issue, Platform Admin replies and your replies (Ticket History), a reply box with attachments, and
// Reopen "where allowed" (AP-16-02). Prototype: attachments are not uploaded — only file names are kept.
// Also exports the small shared pieces used by SupportHome and NewTicket (icons, status pill, files, dates).

const P = {
  plus: 'M12 5v14M5 12h14', search: 'M11 4a7 7 0 1 0 0 14a7 7 0 1 0 0-14zM20 20l-3.5-3.5', down: 'M6 9l6 6 6-6', right: 'M9 6l6 6-6 6', left: 'M15 6l-6 6 6 6',
  arrow: 'M5 12h14M13 6l6 6-6 6', x: 'M6 6l12 12M18 6L6 18', clip: 'M21 11.5l-8.6 8.6a5 5 0 01-7.1-7.1l8.6-8.6a3.5 3.5 0 015 5l-8.6 8.6a2 2 0 01-2.8-2.8l7.9-7.9',
  send: 'M21 3L10 14M21 3l-6.5 18-4-8-8-4z', file: 'M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8zM14 3v5h5', check: 'M5 12.5l4.5 4.5L19 7',
  clock: 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18zM12 7v5l3 2', reopen: 'M3 12a9 9 0 103-6.7L3 8M3 3v5h5', msg: 'M21 12a8 8 0 01-11.6 7.1L4 20l1.2-4.4A8 8 0 1121 12z',
  info: 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18zM12 11v5M12 8h.01', alert: 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18zM12 7.5v5.5M12 16.5h.01',
  open: 'M14 4h6v6M20 4l-9 9M19 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1h5', shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z',
  lock: 'M7 11h10a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6a2 2 0 012-2zM8 11V8a4 4 0 018 0v3', inbox: 'M3 13l3-8h12l3 8v6a1 1 0 01-1 1H4a1 1 0 01-1-1zM3 13h5l1.5 2.5h5L16 13h5',
  user: 'M12 4a4 4 0 1 0 0 8a4 4 0 1 0 0-8zM4 21a8 8 0 0116 0', question: 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18zM9.5 9a2.5 2.5 0 015 .4c0 1.6-2.5 2-2.5 3.6M12 17h.01',
  scale: 'M12 3v18M5 7h14M8 21h8M5 7l-3 6a3 3 0 006 0zM19 7l-3 6a3 3 0 006 0z', mega: 'M3 10.5v3a1 1 0 001 1h3l7 4.5V5L7 9.5H4a1 1 0 00-1 1zM17.5 9a4 4 0 010 6',
  cal: 'M5 5h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2zM3 10h18M8 3v4M16 3v4', phone: 'M5 3h4l2 5-2.5 1.5a11 11 0 005 5L15 12l5 2v4a2 2 0 01-2 2A16 16 0 013 5a2 2 0 012-2z',
  wallet: 'M3 7a2 2 0 012-2h12v4M3 7v11a2 2 0 002 2h15V9H5a2 2 0 01-2-2zM16 14.5h.01', tag: 'M3 12V4h8l10 10-8 8zM7.5 7.5h.01',
  star: 'M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8-4.3-4.1 5.9-.8z', users: 'M9 4.5a3.5 3.5 0 1 0 0 7a3.5 3.5 0 1 0 0-7zM2.5 20a6.5 6.5 0 0113 0M16 4.6a3.5 3.5 0 010 6.8M21.5 20a6.5 6.5 0 00-3.5-5.8',
  live: 'M12 10a2 2 0 1 0 0 4a2 2 0 1 0 0-4zM8.5 8.5a5 5 0 000 7M15.5 8.5a5 5 0 010 7M5.6 5.6a9 9 0 000 12.8M18.4 5.6a9 9 0 010 12.8',
  post: 'M5 4h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2zM3 16l5-5 4 4 3-3 6 6M15.5 7a1.5 1.5 0 1 0 0 3a1.5 1.5 0 1 0 0-3z',
  leaf: 'M5 19C5 11 11 5 20 5c0 9-6 14-15 14zM5 19l7-7', bell: 'M6 16v-5a6 6 0 0112 0v5l2 2H4zM10 21h4', device: 'M9 2.5h6a2 2 0 012 2v15a2 2 0 01-2 2H9a2 2 0 01-2-2v-15a2 2 0 012-2zM11 18h2',
  buoy: 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18zM12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8zM5.6 5.6l3.6 3.6M14.8 14.8l3.6 3.6M18.4 5.6l-3.6 3.6M9.2 14.8l-3.6 3.6',
};
export const Ic = ({ n }) => <svg className="i" viewBox="0 0 24 24" aria-hidden="true"><path d={P[n] || ''} /></svg>;

const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const pad = (n) => (n < 10 ? '0' : '') + n;
const asD = (s) => new Date(s);
export const fmtDate = (s) => { const d = asD(s); return pad(d.getDate()) + ' ' + MON[d.getMonth()] + ' ' + d.getFullYear(); };
export const fmtTime = (s) => { const d = asD(s); const h = d.getHours(); return pad(h % 12 || 12) + ':' + pad(d.getMinutes()) + ' ' + (h >= 12 ? 'PM' : 'AM'); };
export const fmt = (s) => fmtDate(s) + ', ' + fmtTime(s);

const SCLS = { Open: 's-open', 'Under Review': 's-admin', 'Awaiting Astrologer Response': 's-astro', Resolved: 's-resolved', Closed: 's-closed' };
export const Pill = ({ st }) => <span className={'pill ' + (SCLS[st] || 's-closed')}><i />{st}</span>;

/** File chips. list: file names. onRemove(i) shows a remove button. */
export function Files({ list, onRemove }) {
  if (!list?.length) return null;
  return (
    <ul className="files">
      {list.map((f, i) => (
        <li key={f + i} className="file"><Ic n="file" /><span>{f}</span>
          {onRemove && <button type="button" onClick={() => onRemove(i)} aria-label={'Remove ' + f}><Ic n="x" /></button>}
        </li>
      ))}
    </ul>
  );
}

/** The ticket's history after "Ticket created": Platform replies (by 'pf') and your replies (by 'me'). */
export const msgsOf = (t) => t.hist.slice(1).map((h) => ({ from: h.by === 'pf' ? 'admin' : 'me', time: h.at, text: h.text, files: h.files || [] }));
export const createdOf = (t) => t.hist[0].at;
export const isFinal = (t) => CLOSED_STATUSES.includes(t.status);
export const needsReply = (t) => { const m = t.hist[t.hist.length - 1]; return t.status === 'Awaiting Astrologer Response' && m?.by === 'pf'; };
export const allFiles = (t) => [...t.files, ...msgsOf(t).flatMap((m) => m.files)];
export const ADMIN = 'AstroConnect Support';

function Banner({ t }) {
  const N = ({ cls, icon, b, s }) => <div className={'notice ' + cls}><Ic n={icon} /><div><b>{b}</b><span>{s}</span></div></div>;
  if (t.status === 'Awaiting Astrologer Response') {
    return needsReply(t)
      ? <N cls="n-rose" icon="alert" b="Platform Admin needs your reply" s="Answer below so they can continue working on this ticket." />
      : <N cls="n-blue" icon="check" b="Reply sent" s="Platform Admin will review it and update the status." />;
  }
  if (t.status === 'Under Review') return <N cls="n-gold" icon="clock" b="Waiting for Platform Admin" s="You’ll see their response here. You can still add details below." />;
  if (t.status === 'Open') return <N cls="n-blue" icon="info" b="Submitted" s="Platform Admin will pick this up and reply here." />;
  const res = t.status === 'Resolved';
  return <N cls={res ? 'n-green' : 'n-grey'} icon={res ? 'check' : 'lock'} b={(res ? 'Resolved on ' : 'Closed on ') + fmtDate(lastUpdate(t)) + '.'} s="This ticket stays in your history. If the issue returns, you can reopen it." />;
}

function Thread({ t }) {
  const msgs = msgsOf(t);
  let lastDay = createdOf(t).slice(0, 10);
  return (
    <>
      <div className="origin">
        <div className="msg-head"><b>You</b><span className="role">Astrologer</span><span>{fmt(createdOf(t))}</span></div>
        <p>{t.desc}</p>
        <Files list={t.files} />
      </div>
      {msgs.length === 0 ? (
        <div className="empty small"><div className="e-mark"><Ic n="msg" /></div><h3>No messages yet</h3><p>Platform Admin’s response will appear here.</p></div>
      ) : (
        <div className="thread">
          {msgs.map((m, i) => {
            const day = m.time.slice(0, 10); const showDay = day !== lastDay; lastDay = day; const me = m.from === 'me';
            return (
              <div key={i} style={{ display: 'contents' }}>
                {showDay && <span className="day">{fmtDate(m.time)}</span>}
                <div className={'msg ' + (me ? 'me' : 'admin')}>
                  <div className="msg-head"><b>{me ? 'You' : ADMIN}</b><span className="role">{me ? 'Astrologer' : 'Platform Admin'}</span><span>{fmtTime(m.time)}</span></div>
                  <div className="bubble">{m.text}</div>
                  <Files list={m.files} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

function Composer({ t, ui, focus }) {
  const [text, setText] = useState('');
  const [files, setFiles] = useState([]);
  const input = useRef(null), ta = useRef(null);
  useEffect(() => { if (focus) ta.current?.focus(); }, [focus]);
  const send = () => {
    const v = text.trim(); if (!v) return;
    supportActions.reply(t.id, v, files); setText(''); setFiles([]); ui.toast('Reply sent successfully');
  };
  return (
    <div className="composer">
      <label htmlFor="sp-reply">Your reply</label>
      <textarea ref={ta} className="textarea" id="sp-reply" rows={3} maxLength={1000} value={text} onChange={(e) => setText(e.target.value)}
        placeholder={needsReply(t) ? 'Answer Platform Admin’s question…' : 'Add more details for Platform Admin…'} />
      {files.length > 0 && <div className="comp-files"><Files list={files} onRemove={(i) => setFiles((f) => f.filter((_, k) => k !== i))} /></div>}
      <div className="comp-row">
        <button type="button" className="btn btn-quiet btn-sm" onClick={() => input.current?.click()}><Ic n="clip" />Attach file</button>
        <input ref={input} type="file" multiple hidden onChange={(e) => { const n = [...(e.target.files || [])].map((f) => f.name); setFiles((f) => [...f, ...n]); e.target.value = ''; }} />
        <button type="button" className="btn btn-primary" disabled={!text.trim()} onClick={send}><Ic n="send" />Send Reply</button>
      </div>
    </div>
  );
}

/** Reopen (AD-160 "where allowed"; conditions AP-16-02) — keeps the existing behaviour: the ticket reopens. */
export function ReopenButton({ t, ui, sm }) {
  return (
    <button type="button" className={'btn btn-quiet' + (sm ? ' btn-sm' : '')} onClick={() => { supportActions.reopen(t.id); ui.toast(`Ticket ${t.id} reopened`); }}>
      <Ic n="reopen" />Reopen ticket
    </button>
  );
}

/** Conversation side panel. */
export default function TicketDetail({ t, ui, focusReply, onClose }) {
  const body = useRef(null), closeBtn = useRef(null);
  useEffect(() => { if (body.current) body.current.scrollTop = body.current.scrollHeight; }, [t?.hist.length]);
  useEffect(() => { if (!focusReply) closeBtn.current?.focus(); }, [focusReply]);
  if (!t) {
    return (
      <div className="drawer-wrap"><div className="overlay" onClick={onClose} />
        <div className="drawer" role="dialog" aria-modal="true" aria-label="Ticket not found">
          <div className="dr-head"><div className="dr-top"><b>Ticket not found</b><button type="button" className="icon-btn" onClick={onClose} aria-label="Close"><Ic n="x" /></button></div></div>
          <div className="dr-body"><div className="empty small"><div className="e-mark"><Ic n="inbox" /></div><h3>Ticket not found</h3><p>It may have been removed.</p></div></div>
        </div>
      </div>
    );
  }
  return (
    <div className="drawer-wrap">
      <div className="overlay" onClick={onClose} />
      <div className="drawer" role="dialog" aria-modal="true" aria-labelledby="sp-dr-title">
        <div className="dr-head">
          <div className="dr-top">
            <div className="dr-id">{t.id}<Pill st={t.status} /></div>
            <button ref={closeBtn} type="button" className="icon-btn" onClick={onClose} aria-label="Close conversation"><Ic n="x" /></button>
          </div>
          <h2 id="sp-dr-title">{t.subject}</h2>
          <div className="dr-meta">
            <span>Category <b>{t.cat}{t.sub ? ' / ' + t.sub : ''}</b></span><span>Related ID <b>{t.ref || '—'}</b></span><span>Created <b>{fmt(createdOf(t))}</b></span>
          </div>
          <div className="managed"><Ic n="shield" />Status is updated by Platform Admin</div>
        </div>
        <div className="dr-body" ref={body}>
          <Banner t={t} />
          <Thread t={t} />
        </div>
        <div className="dr-foot">
          {isFinal(t) ? (
            <div className="reopen-box">
              <p>Replies are turned off for {t.status.toLowerCase()} tickets. Reopen it if the issue is back. <PendingTag id="AP-16-02" /></p>
              <ReopenButton t={t} ui={ui} />
            </div>
          ) : <Composer key={t.id} t={t} ui={ui} focus={focusReply} />}
        </div>
      </div>
    </div>
  );
}
