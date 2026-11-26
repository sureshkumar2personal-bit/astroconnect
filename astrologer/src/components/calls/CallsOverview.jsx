import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/Icon.jsx';
import Toggle from '@/components/ui/Toggle.jsx';
import { Badge } from '@/components/ui/sectionKit.jsx';
import { TODAY, dt, fmtDateTime, inr, inr2 } from '@/lib/format.js';
import {
  CHAT_VISIBLE_HOURS, COMMISSION, MIN_PACKAGE_MINUTES, WAITING_MAX, availableFor, callsActions, sessionClock, svcName, waitingList,
} from '@/hooks/useCalls.js';
import { serviceMessage } from '@/hooks/useAvailability.js';

// Instant Call & Chat page (reference "Instant Call & Chat" redesign). One card with two tabs:
//   Service Settings → Availability & Pricing · Offers · Waiting List · Request History
//   History          → Call History · Chat History (search, date range, expandable rows)
// Availability is shared with the header switches (AD-04 – AD-07, AD-151); packages AD-106; commission
// AD-124; history AD-110; chat transcript 24 hours (AD-111). Call and Chat share one waiting list of at
// most 3 users (useCalls WAITING_MAX). Offers for Call/Chat are a prototype pending product-owner review.

let remembered = { view: 'settings', sub: 'pricing' }; // keep the open tab while moving between pages
const mmss = (t) => `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
const when = (iso) => fmtDateTime(dt(iso));
const ymd = (iso) => String(iso).slice(0, 10);
const todayYmd = `${TODAY.getFullYear()}-${String(TODAY.getMonth() + 1).padStart(2, '0')}-${String(TODAY.getDate()).padStart(2, '0')}`;
const fmtDay = (d) => new Date(`${d}T00:00`).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

function Pills({ label, options, value, onChange }) {
  return (
    <div className="icc-pills" role="tablist" aria-label={label}>
      {options.map(([k, t]) => (
        <button key={k} type="button" role="tab" aria-selected={value === k} className={`icc-pill${value === k ? ' on' : ''}`} onClick={() => onChange(k)}>{t}</button>
      ))}
    </div>
  );
}

const Head = ({ title, note, children }) => (
  <div className="icc-head"><h3>{title}</h3>{note && <span className="icc-head__note">{note}</span>}{children}</div>
);

/** A row that expands in place (▸ / ▾), as in the reference dropdowns. */
function Exp({ id, open, onToggle, cells, children, className = '' }) {
  return (
    <div className={`icc-exp${open ? ' open' : ''} ${className}`}>
      <button type="button" className="icc-exp__row" aria-expanded={open} aria-controls={`${id}-d`} onClick={onToggle}>
        <span className="icc-exp__caret" aria-hidden="true">{open ? '▾' : '▸'}</span>
        {cells}
      </button>
      {open && <div className="icc-exp__body" id={`${id}-d`}>{children}</div>}
    </div>
  );
}

const Fact = ({ k, v }) => <div className="icc-fact"><span>{k}</span><b>{v}</b></div>;

/* ---------- Availability & Pricing ---------- */

function PkRow({ s, i, x, ui }) {
  const [m, setM] = useState(String(x.m));
  const [p, setP] = useState(String(x.p));
  const [err, setErr] = useState('');
  useEffect(() => { setM(String(x.m)); setP(String(x.p)); }, [x.m, x.p]);
  const commit = () => {
    if (String(x.m) === m && String(x.p) === p) { setErr(''); return; }
    const e = callsActions.updatePackage(s, i, m, p);
    if (e) { setErr(e); setM(String(x.m)); setP(String(x.p)); ui.toast(e); } else setErr('');
  };
  const net = Number(p) > 0 ? inr2(Number(p) * (1 - COMMISSION)) : '—';
  return (
    <div className="icc-pk__row">
      <label className="icc-num"><input type="number" min={MIN_PACKAGE_MINUTES} value={m} onChange={(e) => setM(e.target.value)} onBlur={commit}
        onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()} aria-label={`${svcName(s)} package ${i + 1} minutes`} aria-invalid={!!err} /><span>min</span></label>
      <label className="icc-num"><span className="icc-num__pre">₹</span><input type="number" min="1" value={p} onChange={(e) => setP(e.target.value)} onBlur={commit}
        onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()} aria-label={`${svcName(s)} package ${i + 1} price in rupees`} aria-invalid={!!err} /></label>
      <span className="icc-pk__net" title={`After ${COMMISSION * 100}% commission`}>{net}</span>
      <button type="button" className="icc-x" onClick={() => callsActions.removePackage(s, i)} aria-label={`Remove ${x.m}-minute ${svcName(s)} package`}><Icon name="close" size={15} /></button>
    </div>
  );
}

function DraftRow({ s, onDone, ui }) {
  const [m, setM] = useState('');
  const [p, setP] = useState('');
  const ref = useRef(null);
  useEffect(() => { ref.current?.focus(); }, []);
  const save = () => {
    const e = callsActions.addPackage(s, m, p);
    if (e) { ui.toast(e); return; }
    onDone();
  };
  return (
    <div className="icc-pk__row icc-pk__row--new">
      <label className="icc-num"><input ref={ref} type="number" min={MIN_PACKAGE_MINUTES} placeholder={String(MIN_PACKAGE_MINUTES)} value={m} onChange={(e) => setM(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && save()} aria-label={`New ${svcName(s)} package minutes (minimum 5)`} /><span>min</span></label>
      <label className="icc-num"><span className="icc-num__pre">₹</span><input type="number" min="1" placeholder="Price" value={p} onChange={(e) => setP(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && save()} aria-label={`New ${svcName(s)} package price in rupees`} /></label>
      <button type="button" className="icc-btn sm" onClick={save}>Save</button>
      <button type="button" className="icc-x" onClick={onDone} aria-label="Cancel new package"><Icon name="close" size={15} /></button>
    </div>
  );
}

function PriceTable({ s, list, ui }) {
  const [draft, setDraft] = useState(false);
  return (
    <div className="icc-pk">
      <h4>{svcName(s)} packages</h4>
      <div className="icc-pk__head" aria-hidden="true"><span>Duration</span><span>Price</span><span>Your net</span><span /></div>
      {list.map((x, i) => <PkRow key={`${i}-${x.m}-${x.p}`} s={s} i={i} x={x} ui={ui} />)}
      {!list.length && !draft && <p className="icc-empty">No packages yet. Requests can't arrive until you add one.</p>}
      {draft ? <DraftRow s={s} ui={ui} onDone={() => setDraft(false)} />
        : <button type="button" className="icc-btn sm icc-pk__add" onClick={() => setDraft(true)}>Add package</button>}
    </div>
  );
}

function Pricing({ st, av, ui }) {
  const card = (s) => {
    const on = av[s];
    const word = s === 'call' ? 'calls' : 'chats';
    const state = av.dnd ? ['DND is on', 'warn'] : av.mode !== 'online' ? ["You're Offline", 'warn'] : on ? [`Accepting ${word}`, 'ok'] : [`Not accepting ${word}`, 'info'];
    const toggle = () => { (s === 'call' ? av.toggleCall : av.toggleChat)(); ui.toast(serviceMessage(s, !on)); };
    return (
      <div className="icc-avail" key={s}>
        <div><b>{svcName(s)}</b><Badge kind={state[1]}>{state[0]}</Badge></div>
        <Toggle on={on} label={svcName(s)} onToggle={toggle} disabled={av.dnd} />
      </div>
    );
  };
  return (
    <>
      <Head title="Availability" note="Linked to the toggles in the app header. DND stays separate." />
      <div className="icc-avails">{card('call')}{card('chat')}</div>
      <Head title="Service pricing" />
      <div className="icc-pks">
        <PriceTable s="call" list={st.pk.call} ui={ui} />
        <PriceTable s="chat" list={st.pk.chat} ui={ui} />
      </div>
    </>
  );
}

/* ---------- Offers ---------- */

const offerStatus = (o) => (ymd(o.to) < todayYmd ? 'Expired' : o.paused ? 'Paused' : ymd(o.from) > todayYmd ? 'Scheduled' : 'Active');
const OFFER_KIND = { Active: 'ok', Paused: 'warn', Expired: 'info', Scheduled: 'info' };
const svcOf = (v) => ({ both: 'Call & Chat', call: 'Instant Call', chat: 'Instant Chat' }[v]);
const offText = (o) => (o.kind === 'pct' ? `${o.value}% off` : `${inr(o.value)} off`);
const BLANK = { name: '', svc: 'both', kind: 'pct', value: '', from: todayYmd, to: todayYmd, aud: 'All Users' };

function OfferForm({ init, onClose, ui }) {
  const [o, setO] = useState(init);
  const [err, setErr] = useState('');
  const set = (k) => (e) => setO((x) => ({ ...x, [k]: e.target.value }));
  const save = (e) => {
    e.preventDefault();
    const er = callsActions.saveOffer(o);
    if (er) { setErr(er); return; }
    ui.toast(init.id ? 'Offer updated.' : 'Offer created.'); onClose();
  };
  return (
    <form className="icc-offer-form" onSubmit={save} noValidate aria-label={init.id ? `Edit ${init.name}` : 'Create offer'}>
      <label><span>Offer name</span><input value={o.name} onChange={set('name')} placeholder="e.g. First session welcome" autoFocus /></label>
      <label><span>Service</span><select value={o.svc} onChange={set('svc')}><option value="both">Call &amp; Chat</option><option value="call">Instant Call</option><option value="chat">Instant Chat</option></select></label>
      <label><span>Discount</span>
        <span className="icc-offer-form__pair">
          <select value={o.kind} onChange={set('kind')} aria-label="Discount type"><option value="pct">% off</option><option value="flat">₹ off</option></select>
          <input type="number" min="1" max={o.kind === 'pct' ? 99 : undefined} value={o.value} onChange={set('value')} aria-label="Discount value" />
        </span>
      </label>
      <label><span>Who can use it</span><select value={o.aud} onChange={set('aud')}><option>All Users</option><option>New Users only</option><option>Selected Users</option></select></label>
      <label><span>From</span><input type="date" value={o.from} onChange={set('from')} /></label>
      <label><span>To</span><input type="date" value={o.to} onChange={set('to')} /></label>
      {err && <p className="icc-err" role="alert">{err}</p>}
      <div className="icc-offer-form__act">
        <button type="button" className="icc-btn sm" onClick={onClose}>Cancel</button>
        <button type="submit" className="icc-btn sm icc-btn--p">{init.id ? 'Save changes' : 'Create offer'}</button>
      </div>
    </form>
  );
}

function Offers({ st, ui }) {
  const [edit, setEdit] = useState(null); // null | 'new' | offer id
  const list = st.offers || [];
  return (
    <>
      <Head title="Offer management">
        <button type="button" className="icc-btn sm icc-btn--p" onClick={() => setEdit(edit === 'new' ? null : 'new')} aria-expanded={edit === 'new'}>Create offer</button>
      </Head>
      {edit === 'new' && <OfferForm init={BLANK} onClose={() => setEdit(null)} ui={ui} />}
      <div className="icc-list">
        {list.map((o) => {
          const stt = offerStatus(o);
          return (
            <div key={o.id} className="icc-offer-wrap">
              <div className="icc-offer">
                <div className="icc-offer__name"><b>{o.name}</b><small>{svcOf(o.svc)} · {offText(o)}</small></div>
                <span className="icc-offer__dates">{fmtDay(o.from)} – {fmtDay(o.to)}</span>
                <span className="icc-offer__use">{o.aud} · used {o.used}×</span>
                <span className="icc-offer__act">
                  <Badge kind={OFFER_KIND[stt]}>{stt}</Badge>
                  <button type="button" className="icc-btn xs" onClick={() => setEdit(edit === o.id ? null : o.id)} aria-expanded={edit === o.id}>Edit</button>
                  {stt !== 'Expired' && (o.paused
                    ? <button type="button" className="icc-btn xs" onClick={() => { callsActions.toggleOffer(o.id); ui.toast(`${o.name} resumed.`); }}>Resume</button>
                    : <button type="button" className="icc-btn xs icc-btn--danger" onClick={() => { callsActions.toggleOffer(o.id); ui.toast(`${o.name} paused.`); }}>Pause</button>)}
                </span>
              </div>
              {edit === o.id && <OfferForm init={o} onClose={() => setEdit(null)} ui={ui} />}
            </div>
          );
        })}
        {!list.length && <p className="icc-empty">No offers yet.</p>}
      </div>
    </>
  );
}

/* ---------- Waiting List ---------- */

// Shown only while nobody is really waiting (reference layout). Sample people, never real; they can't be
// accepted and are replaced as soon as a real request arrives.
const SAMPLE_SESSION = { user: 'Rohan Mehta', s: 'call', mins: 6 };
const SAMPLE_WAITING = [
  { id: 'S-1', user: 'Ananya Sharma', uid: 'U-20311', s: 'call' },
  { id: 'S-2', user: 'Karthik Raman', uid: 'U-20457', s: 'chat' },
  { id: 'S-3', user: 'Meera Venkat', uid: 'U-21102', s: 'chat' },
];

function Waiting({ st, av }) {
  const real = waitingList(st);
  const sample = !real.length;
  const list = sample ? SAMPLE_WAITING : real;
  const c = st.session;
  const now = Math.max(st.now || 0, Date.now());
  const label = (r, i) => (i === 0 ? 'Next' : 'Waiting');
  return (
    <>
      <Head title="Waiting list" note={`Call and Chat share one list · maximum ${WAITING_MAX} waiting users`}>
        {sample && <Badge kind="info">Sample</Badge>}
      </Head>
      {c ? (
        <div className="icc-insession">
          <Badge kind="ok">In session</Badge>
          <b>{c.user}</b>
          <span>{svcName(c.s)} · started {Math.floor(sessionClock(c, now).elapsed / 60)} min ago · {mmss(sessionClock(c, now).left)} left · not counted in the waiting list</span>
          <button type="button" className="icc-btn xs" onClick={() => callsActions.setMode('expanded')}>Open</button>
        </div>
      ) : sample && (
        <div className="icc-insession">
          <Badge kind="ok">In session</Badge>
          <b>{SAMPLE_SESSION.user}</b>
          <span>{svcName(SAMPLE_SESSION.s)} · started {SAMPLE_SESSION.mins} min ago · not counted in the waiting list</span>
        </div>
      )}
      <ol className="icc-wcards">
        {list.map((r, i) => (
          <li key={r.id} className="icc-wcard">
            <span className="icc-wcard__n">{i + 1}</span>
            <span><b>{r.user}</b><small>{r.s === 'call' ? 'Call' : 'Chat'} · {label(r, i)}{sample ? '' : ` · ${r.left} s left`}{!sample && !av[r.s] ? ' · hidden (switch OFF)' : ''}</small></span>
          </li>
        ))}
      </ol>
      <div className="icc-table" role="table" aria-label="Waiting list">
        <div className="icc-tr icc-tr--h" role="row"><span role="columnheader">Position</span><span role="columnheader">User</span><span role="columnheader">Service</span><span role="columnheader">Status</span></div>
        {list.map((r, i) => (
          <div className="icc-tr" role="row" key={r.id}>
            <span role="cell" data-l="Position">{i + 1}</span>
            <span role="cell" data-l="User">{r.user}</span>
            <span role="cell" data-l="Service">{r.s === 'call' ? 'Call' : 'Chat'}</span>
            <span role="cell" data-l="Status"><Badge kind={i === 0 ? 'ok' : 'info'}>{label(r, i)}</Badge>{!sample && <small className="muted"> {r.left} s left</small>}</span>
          </div>
        ))}
      </div>
    </>
  );
}

/* ---------- Request History ---------- */

const REQ_KIND = { Accepted: 'ok', Declined: 'bad', Missed: 'warn', Cancelled: 'info' };

function Requests({ st }) {
  const [f, setF] = useState('');
  const [open, setOpen] = useState(null);
  const list = (st.reqLog || []).filter((r) => !f || r.status === f);
  return (
    <>
      <Head title="Request history" note="New requests appear in the Incoming requests panel on every page." />
      <select className="icc-select" value={f} onChange={(e) => setF(e.target.value)} aria-label="Filter by status">
        <option value="">All statuses</option>{Object.keys(REQ_KIND).map((k) => <option key={k}>{k}</option>)}
      </select>
      <div className="icc-list">
        {list.map((r) => (
          <Exp key={`${r.id}-${r.at}`} id={`rq-${r.id}`} open={open === r.id} onToggle={() => setOpen(open === r.id ? null : r.id)} className="icc-exp--req"
            cells={<>
              <span className="icc-c-user"><b>{r.user}</b> <small>{r.uid}</small></span>
              <span className="icc-c-svc">{r.s === 'call' ? 'Call' : 'Chat'}</span>
              <span className="icc-c-date">{when(r.at)}</span>
              <span className="icc-c-badge"><Badge kind={REQ_KIND[r.status]}>{r.status}</Badge></span>
            </>}>
            <div className="icc-facts">
              <Fact k="Request ID" v={r.id} /><Fact k="User ID" v={r.uid} /><Fact k="Service" v={svcName(r.s)} />
              <Fact k="Requested at" v={when(r.at)} /><Fact k="Topic" v={r.topic} /><Fact k="Outcome" v={r.outcome} />
            </div>
          </Exp>
        ))}
        {!list.length && <p className="icc-empty">No requests with this status.</p>}
      </div>
    </>
  );
}

/* ---------- History (Call / Chat) ---------- */

function transcriptLeft(x) {
  const h = CHAT_VISIBLE_HOURS - (TODAY - dt(x.at)) / 36e5;
  if (h <= 0) return null;
  const m = Math.floor(h * 60);
  return `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, '0')}m`;
}

function download(x) {
  const lines = (x.msgs || []).map((m) => `${m[0] === 'me' ? 'You' : x.user}: ${m[1]}`).join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([`${svcName('chat')} ${x.id} with ${x.user} (${x.uid}) · ${when(x.at)}\n\n${lines}`], { type: 'text/plain' }));
  a.download = `${x.id}-chat-transcript.txt`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

function SessionDetail({ x }) {
  const chat = x.svc === 'Instant Chat';
  const left = chat ? transcriptLeft(x) : null;
  const earn = x.status === 'Completed' ? inr2(x.amt * (1 - COMMISSION)) : inr2(0);
  return (
    <>
      <div className="icc-facts">
        <Fact k="User" v={x.user} /><Fact k="User ID" v={x.uid} /><Fact k="Session ID" v={x.id} /><Fact k="Booked on" v={when(x.at)} /><Fact k="Duration" v={x.dur} />
        <Fact k="Amount paid" v={`${inr(x.amt)} · ${x.pk}`} /><Fact k="Your earnings" v={earn} /><Fact k="Payment" v={x.pay} /><Fact k="Status" v={x.status} />
      </div>
      <div className="icc-dsec"><h5>User review</h5>
        {x.review ? <p><span className="icc-stars" aria-label={`${x.review.stars} out of 5 stars`}>{'★'.repeat(x.review.stars)}{'☆'.repeat(5 - x.review.stars)}</span> {x.review.text}</p>
          : <p className="muted">{x.status === 'Completed' ? 'The user has not rated this session yet.' : 'No review (session cancelled).'}</p>}
      </div>
      <div className="icc-dsec"><h5>Your notes</h5><p className={x.notes ? '' : 'muted'}>{x.notes || 'No notes.'}</p></div>
      <div className="icc-dsec"><h5>Shared remedies &amp; attachments</h5>
        {(x.remedies || []).length || (x.files || []).length ? (
          <>
            {(x.remedies || []).map((r) => <p key={r}>• {r}</p>)}
            {!!(x.files || []).length && <div className="icc-files">{x.files.map((f) => <span key={f} className="icc-file"><Icon name="paperclip" size={13} />{f}</span>)}</div>}
          </>
        ) : <p className="muted">{x.att ? x.att : 'Nothing shared.'}</p>}
      </div>
      {chat && (
        <div className="icc-dsec"><h5>Chat transcript</h5>
          {left ? (
            <>
              <div className="icc-transcript-note">
                <span>Chat transcript will be available to you for 24 hours. Download it before it expires. <b>{left} left.</b></span>
                <button type="button" className="icc-btn xs icc-btn--p" onClick={() => download(x)} disabled={!(x.msgs || []).length}>Download Chat Transcript</button>
              </div>
              <div className="icc-transcript">
                {(x.msgs || []).length ? x.msgs.map((m, i) => (
                  <p key={i}><b className={m[0] === 'me' ? 'you' : 'them'}>{m[0] === 'me' ? 'You' : x.user.split(' ')[0]}:</b> {m[1]}</p>
                )) : <p className="muted">No messages were exchanged.</p>}
              </div>
            </>
          ) : <p className="muted">Transcript expired (older than 24 hours). Booking, date/time and payment records remain.</p>}
        </div>
      )}
    </>
  );
}

function History({ st }) {
  const [q, setQ] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [open, setOpen] = useState(null);
  const svc = svcName(st.tab);
  const term = q.trim().toLowerCase();
  const list = st.hist.filter((x) => x.svc === svc)
    .filter((x) => !term || [x.user, x.uid, x.id].some((v) => String(v).toLowerCase().includes(term)))
    .filter((x) => (!from || ymd(x.at) >= from) && (!to || ymd(x.at) <= to));
  return (
    <>
      <Pills label="History" options={[['call', 'Call History'], ['chat', 'Chat History']]} value={st.tab} onChange={(t) => { callsActions.setTab(t); setOpen(null); }} />
      <div className="icc-filters">
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by user name, user ID or session ID" aria-label="Search history" />
        <label><span>From</span><input type="date" value={from} max={to || undefined} onChange={(e) => setFrom(e.target.value)} /></label>
        <label><span>To</span><input type="date" value={to} min={from || undefined} onChange={(e) => setTo(e.target.value)} /></label>
        <button type="button" className="icc-btn sm" onClick={() => { setQ(''); setFrom(''); setTo(''); }}>Clear</button>
      </div>
      <div className="icc-list">
        {list.map((x) => {
          const left = x.svc === 'Instant Chat' && x.status === 'Completed' ? transcriptLeft(x) : null;
          return (
            <Exp key={x.id} id={`h-${x.id}`} open={open === x.id} onToggle={() => setOpen(open === x.id ? null : x.id)} className="icc-exp--hist"
              cells={<>
                <span className="icc-c-user"><b>{x.user}</b><small>{x.id}</small></span>
                <span className="icc-c-date">{when(x.at)}</span>
                <span className="icc-c-dur">{x.dur}</span>
                <span className="icc-c-amt">{inr(x.amt)}</span>
                <span className="icc-c-badge">
                  {x.svc === 'Instant Chat' && x.status === 'Completed' && (left ? <Badge kind="warn">Transcript {left}</Badge> : <Badge kind="info">Transcript expired</Badge>)}
                  <Badge kind={x.status === 'Completed' ? 'ok' : 'info'}>{x.status}</Badge>
                </span>
              </>}>
              <SessionDetail x={x} />
            </Exp>
          );
        })}
        {!list.length && <p className="icc-empty">No {st.tab === 'call' ? 'calls' : 'chats'} match your search.</p>}
      </div>
    </>
  );
}

/* ---------- Page ---------- */

export default function CallsOverview({ st, av, ui }) {
  const [view, setView] = useState(remembered.view);
  const [sub, setSub] = useState(remembered.sub);
  useEffect(() => { remembered = { view, sub }; }, [view, sub]);
  return (
    <>
      <section className="card icc" aria-label="Instant Call and Chat">
        <div className="icc-tabs" role="tablist" aria-label="Instant Call and Chat">
          {[['settings', 'Service Settings'], ['history', 'History']].map(([k, t]) => (
            <button key={k} type="button" role="tab" aria-selected={view === k} className={view === k ? 'on' : ''} onClick={() => setView(k)}>{t}</button>
          ))}
        </div>
        <div className="icc-body">
          {view === 'settings' ? (
            <>
              <Pills label="Service settings" value={sub} onChange={setSub}
                options={[['pricing', 'Availability & Pricing'], ['offers', 'Offers'], ['waiting', 'Waiting List'], ['requests', 'Request History']]} />
              {sub === 'pricing' && <Pricing st={st} av={av} ui={ui} />}
              {sub === 'offers' && <Offers st={st} ui={ui} />}
              {sub === 'waiting' && <Waiting st={st} av={av} />}
              {sub === 'requests' && <Requests st={st} />}
            </>
          ) : <History st={st} />}
        </div>
      </section>
    </>
  );
}
