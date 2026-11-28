import { useEffect, useRef, useState } from 'react';
import {
  activityOf, canCancel, cancelInfo, dateOfA, firstName, fmtDShort, fmtStamp, inr, isOpenStatus, joinState, payCls,
  stOf, whenLong,
} from '@/lib/appointments.js';
import { Ico } from './CalendarGrid.jsx';

// Appointment details panel (spec AD-101/102; reference "AstroConnect – Astrologer Appointments"): used in place under a
// list row and in the calendar's details drawer. Join follows the join window (AD-96). After the call ends, sharing
// the post-call items completes the appointment (AD-89, AD-102). Preparation notes are private.
// Prototype: chosen files are not uploaded — only the file name and size are kept.
const KIND = { text: ['TXT', 'k-text'], pdf: ['PDF', 'k-pdf'], link: ['LINK', 'k-link'], image: ['IMG', 'k-image'] };
const size = (b) => (b >= 1048576 ? (b / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB');

function Share({ a, apt, ui }) {
  const [type, setType] = useState('text');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [url, setUrl] = useState('');
  const [label, setLabel] = useState('');
  const [err, setErr] = useState('');
  const [pending, setPending] = useState([]);
  const [preview, setPreview] = useState(false);
  const pdfIn = useRef(null), imgIn = useRef(null);
  const first = firstName(a.user);
  const add = (item) => { setPending((p) => [...p, item]); setErr(''); };
  const addText = () => {
    const m = body.trim(); if (!m) return setErr('Write a message first.');
    add({ kind: 'text', title: title.trim() || 'Note from Ananya', meta: m.length > 70 ? m.slice(0, 70) + '…' : m }); setTitle(''); setBody('');
  };
  const addLink = () => {
    if (!/^https:\/\/\S+\.\S+/.test(url.trim())) return setErr('Enter a full link starting with https://');
    add({ kind: 'link', title: label.trim() || url.trim(), meta: url.trim() }); setUrl(''); setLabel('');
  };
  const pick = (kind) => (e) => { const f = e.target.files?.[0]; if (f) add({ kind, title: f.name, meta: `${kind === 'pdf' ? 'PDF' : 'Image'} · ${size(f.size)}` }); e.target.value = ''; };
  const share = () => {
    const completes = a.callEnd && a.status !== 'Completed';
    apt.shareItems(a.id, pending); setPending([]);
    ui.toast(completes ? `Shared with ${a.user}. The appointment is now completed.` : `Shared with ${a.user}. They can open it in the User App.`);
  };
  const shared = [...a.att].reverse().map((x, i) => ({ key: i, kind: x.kind || 'text', title: x.title || x.type, meta: x.meta || x.text, at: x.at }));
  const Item = ({ p, children }) => <li className="item"><span className={'kind ' + KIND[p.kind][1]}>{KIND[p.kind][0]}</span><div className="item-b"><div className="item-t">{p.title}</div><div className="item-m">{p.meta}{p.at ? ` · shared ${fmtStamp(p.at)}` : ''}</div></div>{children}</li>;
  return (
    <div className="att">
      <div className="sec-h"><div><h4>Share after consultation</h4></div><button type="button" className="btn btn-sm btn-ghost" onClick={() => setPreview((v) => !v)}>{preview ? 'Hide User App preview' : 'Preview as client'}</button></div>
      <div className="att-types" role="group" aria-label="Item type">
        {[['text', 'Add text'], ['pdf', 'Upload PDF'], ['link', 'Add link'], ['image', 'Upload image']].map(([k, l]) => (
          <button key={k} type="button" className={'att-t' + (type === k ? ' on' : '')} aria-pressed={type === k} onClick={() => { setType(k); setErr(''); }}>{l}</button>
        ))}
      </div>
      {type === 'text' && (
        <div className="att-form">
          <label className="fld full">Title<input className="inp" value={title} placeholder="e.g. Summary of today’s reading" onChange={(e) => setTitle(e.target.value)} /></label>
          <label className="fld full">Message<textarea className="inp ta" value={body} placeholder="Key points, remedies, dates to remember…" onChange={(e) => setBody(e.target.value)} /></label>
          <div className="row full"><button type="button" className="btn btn-sm" onClick={addText}>Add text</button></div>
        </div>
      )}
      {type === 'pdf' && (
        <div className="att-form"><div className="drop"><div><strong>Upload a PDF</strong></div><button type="button" className="btn btn-sm" onClick={() => pdfIn.current?.click()}>Choose PDF</button><input ref={pdfIn} type="file" accept="application/pdf,.pdf" hidden onChange={pick('pdf')} /></div></div>
      )}
      {type === 'link' && (
        <div className="att-form">
          <label className="fld">Link URL<input className="inp" value={url} placeholder="https://" onChange={(e) => setUrl(e.target.value)} /></label>
          <label className="fld">Label<input className="inp" value={label} placeholder="e.g. Hanuman Chalisa recitation" onChange={(e) => setLabel(e.target.value)} /></label>
          <div className="row full"><button type="button" className="btn btn-sm" onClick={addLink}>Add link</button></div>
        </div>
      )}
      {type === 'image' && (
        <div className="att-form"><div className="drop"><div><strong>Upload an image</strong></div><button type="button" className="btn btn-sm" onClick={() => imgIn.current?.click()}>Choose image</button><input ref={imgIn} type="file" accept="image/png,image/jpeg" hidden onChange={pick('image')} /></div></div>
      )}
      {err && <div className="err">{err}</div>}
      {pending.length > 0 && (
        <>
          <ul className="items">{pending.map((p, i) => <Item key={i} p={p}><button type="button" className="icon-btn xs" aria-label={`Remove ${p.title}`} onClick={() => setPending((x) => x.filter((_, j) => j !== i))}><Ico n="x" s={14} /></button></Item>)}</ul>
          <div className="row"><button type="button" className="btn btn-primary btn-sm" onClick={share}>Share {pending.length} item{pending.length > 1 ? 's' : ''} with {first}</button><span className="muted" style={{ fontSize: 12.5 }}>Nothing is sent until you share.</span></div>
        </>
      )}
      <div className="dsec">
        <h4>Previously shared</h4>
        {shared.length ? <ul className="items">{shared.map((p) => <Item key={p.key} p={p} />)}</ul> : <div className="muted" style={{ fontSize: 13 }}>Nothing shared yet.</div>}
      </div>
      {preview && (
        <div className="uprev">
          <div className="uprev-cap">User App preview · what {first} sees</div>
          <div className="uprev-h">From Ananya R. · {fmtDShort(dateOfA(a))} consultation</div>
          {shared.map((p) => <div key={p.key} className="item"><span className={'kind ' + KIND[p.kind][1]}>{KIND[p.kind][0]}</span><div className="item-b"><div className="item-t">{p.title}</div><div className="item-m">{p.meta}</div></div></div>)}
          {!shared.length && <div className="muted" style={{ fontSize: 12.5 }}>No materials shared yet.</div>}
          <div className="uprev-cap">Your preparation notes are never shown here.</div>
        </div>
      )}
    </div>
  );
}

export default function AppointmentDetailPanel({ a, apt, ui, onJoin, onCancel, onProfile }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(a.pnotes || '');
  useEffect(() => { setEditing(false); setDraft(a.pnotes || ''); }, [a.id]); // eslint-disable-line react-hooks/exhaustive-deps
  const st = stOf(a), j = joinState(a), c = a.status === 'Cancelled' ? cancelInfo(a) : null;
  const saveNote = () => { apt.setNote(a.id, draft.trim()); setEditing(false); ui.toast('Private note saved. It is never shown to the client.'); };
  const showShare = a.status === 'Completed' || (a.callEnd && a.status !== 'Cancelled');
  return (
    <div className="det">
      <div className="det-head">
        <div>
          <div className="eyebrow">{a.id} · Voice consultation</div>
          <h3 className="det-title">{a.user}</h3>
          <div className="muted">{whenLong(a)} · {a.dur} min</div>
        </div>
        <span className={'badge ' + st.b}>{st.label}</span>
      </div>
      <div className="actbar">
        {j.on ? <button type="button" className="btn btn-primary" onClick={() => onJoin(a)}><Ico n="phone" />Join call</button> : <button type="button" className="btn" disabled>{j.label}</button>}
        <span className={'join-hint' + (j.live ? ' live' : '')}>{j.on && <i className="pulse" />}{j.hint}</span>
        <span className="sp" />
        {canCancel(a) && <button type="button" className="btn btn-ghost btn-dl" onClick={() => onCancel(a)}>Cancel appointment</button>}
      </div>
      {c && <div className="cx-info"><strong>Cancelled by {c.by}</strong>{c.at ? ` · ${c.at}` : ''}<br />Reason: {c.reason}{c.note ? ` · Message: “${c.note}”` : ''}</div>}
      {a.status === 'Missed / No-show' && a.noShow && <div className="cx-info"><strong>Missed / No-show</strong><br />{a.noShow}</div>}
      <div className="det-grid">
        <div className="dsec">
          <h4>Booking</h4>
          <dl className="dl">
            <dt>Appointment ID</dt><dd>{a.id}</dd>
            <dt>Booked on</dt><dd>{a.bookedAt ? fmtStamp(a.bookedAt) : '—'}</dd>
            <dt>Scheduled</dt><dd>{whenLong(a)}</dd>
            <dt>Duration</dt><dd>{a.dur} min · Voice call</dd>
            <dt>Status</dt><dd>{st.label}</dd>
            <dt>Amount</dt><dd>{inr(a.amt)} (booked rate)</dd>
            <dt>Payment</dt><dd><span className={payCls(a.pay)}>{a.pay}</span></dd>
          </dl>
        </div>
        <div className="dsec">
          <h4>Client</h4>
          <dl className="dl">
            <dt>Name</dt><dd>{a.user}</dd>
            <dt>User ID</dt><dd>{a.uid}</dd>
            <dt>Purpose</dt><dd>{a.purpose}</dd>
            <dt>Birth details</dt><dd>{a.birth || '—'}</dd>
            <dt>Saved chart</dt><dd>{a.saved || '—'}</dd>
            <dt>Uploaded</dt><dd>{a.horo ? <span className="file"><Ico n="file" s={14} />{a.horo}</span> : <span className="muted">No horoscope uploaded</span>}</dd>
          </dl>
          <button type="button" className="link-btn" style={{ alignSelf: 'flex-start' }} onClick={() => onProfile(a)}>View user profile →</button>
        </div>
        <div className="dsec">
          <h4>Client’s note to you</h4>
          <div className="quote">{a.unotes || 'No note from the client.'}</div>
          <div className="pnote">
            <div className="sec-h"><h4 style={{ textTransform: 'none', letterSpacing: 0, color: 'var(--a-ink)', fontSize: 13.5 }}>Preparation notes</h4><span className="lock"><Ico n="lock" s={12} />Private · never shown to the client</span></div>
            {editing ? (
              <>
                <label className="sr" htmlFor={'pn-' + a.id}>Preparation notes</label>
                <textarea id={'pn-' + a.id} className="inp ta" value={draft} placeholder="Chart observations, dasha periods, remedies to discuss…" onChange={(e) => setDraft(e.target.value)} />
                <div className="row"><button type="button" className="btn btn-sm btn-primary" onClick={saveNote}>Save note</button><button type="button" className="btn btn-sm btn-ghost" onClick={() => { setDraft(a.pnotes || ''); setEditing(false); }}>Cancel</button></div>
              </>
            ) : (
              <>
                <p className="pnote-t">{a.pnotes || 'No preparation notes yet.'}</p>
                <button type="button" className="link-btn" style={{ alignSelf: 'flex-start' }} onClick={() => setEditing(true)}>{a.pnotes ? 'Edit note' : 'Add note'}</button>
              </>
            )}
          </div>
        </div>
      </div>
      {isOpenStatus(a) && !a.callEnd && <div className="lock-note"><Ico n="lock" s={14} />Post-consultation sharing (notes, PDFs, links, images) unlocks once this call has ended.</div>}
      {showShare && <Share key={a.id} a={a} apt={apt} ui={ui} />}
      <div className="dsec">
        <h4>Activity</h4>
        <ul className="alog">{activityOf(a).map((l, i) => <li key={i}><time>{l.at}</time><span>{l.text}</span></li>)}</ul>
      </div>
    </div>
  );
}
