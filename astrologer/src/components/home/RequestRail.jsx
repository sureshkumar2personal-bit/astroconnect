import Icon from '@/components/ui/Icon.jsx';
import useCalls, { callsActions, svcName } from '@/hooks/useCalls.js';
import { inr } from '@/lib/format.js';

// Request strip under the page header on every page (from the Instant Call & Chat prototype "rail").
// One "Incoming requests" card, all requests in a single row, oldest first. Call and Chat still keep
// their own FIFO queues: each tile is tagged Instant Call / Instant Chat, and only the first request of
// each service can be accepted. A service's requests show only while its switch is ON.
// With no requests it says whether requests can arrive. DND has its own banner, so it is hidden then.
const VISIBLE = 3; // per service
const initials = (name) => name.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
const mmss = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
const arrived = (ms) => new Date(ms).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

function Requests({ queue, svcs, busy, now, onToast }) {
  // Oldest first across the services that are ON; each service keeps its own order.
  const rows = svcs.flatMap((svc) => queue[svc].slice(0, VISIBLE).map((r, i) => ({ ...r, first: i === 0 })))
    .sort((x, y) => x.at - y.at);
  const more = svcs.reduce((n, svc) => n + Math.max(0, queue[svc].length - VISIBLE), 0);
  const total = svcs.reduce((n, svc) => n + queue[svc].length, 0);
  // Accept opens the session window (compact on desktop, full screen on phones), as in the prototype.
  const accept = (id) => { const err = callsActions.accept(id); if (err) onToast?.(err); };
  return (
    <section className="ac-rail ac-rail--list" aria-label="Incoming requests">
      <div className="ac-rail__head">
        <b className="ac-rail__title">Incoming requests <span className="ac-rail__count">{total}</span></b>
        <span className="ac-rail__note">Oldest first</span>
      </div>
      <ol className="ac-rail__list">
        {rows.map((r, i) => {
          const icon = r.s === 'call' ? 'phone' : 'chat';
          const waited = Math.max(0, Math.round((now - r.at) / 1000));
          return (
            <li key={r.id} className={`ac-rail__req ac-rail__req--${r.s}`} data-id={r.id} data-svc={r.s}>
              <span className="ac-rail__pos" aria-label={`Position ${i + 1}`}>{i + 1}</span>
              <span className="ac-rail__av" aria-hidden="true">{initials(r.user)}</span>
              <div className="ac-rail__who">
                <b>{r.user}</b>
                <span className={`ac-rail__tag ac-rail__tag--${r.s}`}><Icon name={icon} size={13} />{svcName(r.s)}</span>
              </div>
              <span className="ac-rail__ago" title={`Arrived ${arrived(r.at)} · ${r.left} s left to accept`}>
                <Icon name="clock" size={13} /><span aria-label={`Waiting ${waited} seconds, ${r.left} seconds left to accept`}>{mmss(waited)}</span>
              </span>
              <span className="ac-rail__meta">{r.uid}{r.sub ? ` · ${r.sub}` : ''} · {r.pk.m} min, {inr(r.pk.p)} paid · arrived {arrived(r.at)}</span>
              <div className="ac-rail__act">
                <button type="button" className="ac-rail__btn" onClick={() => callsActions.decline(r.id)}>Decline</button>
                <button type="button" className="ac-rail__btn ac-rail__btn--ok" onClick={() => accept(r.id)} disabled={!r.first || busy}
                  title={busy ? 'Finish your current session first' : !r.first ? `Accept the first ${svcName(r.s)} request in line first` : undefined}>
                  <Icon name={icon} size={14} />Accept
                </button>
              </div>
            </li>
          );
        })}
      </ol>
      {more > 0 && <p className="ac-rail__more">{more} more waiting in line.</p>}
    </section>
  );
}

export default function RequestRail({ a, home = false, onToast }) {
  const { queue: q, session, now } = useCalls();
  const queue = { call: q?.call || [], chat: q?.chat || [] }; // tolerate older in-memory state
  if (a.dnd) return null;
  const t = Math.max(now || 0, Date.now());
  // A queue card shows only while its own service is ON; requests stay in the store either way.
  const has = (svc) => !!a[svc] && queue[svc].length > 0;
  const svcs = ['call', 'chat'].filter(has);
  if (svcs.length) return <Requests queue={queue} svcs={svcs} busy={!!session} now={t} onToast={onToast} />;
  const live = a.mode === 'online' && (a.call || a.chat);
  let icon; let text;
  if (live) { icon = 'clock'; text = 'Waiting for requests. New ones appear here on every screen.'; }
  else if (!home) return null;
  else if (a.mode !== 'online') { icon = 'info'; text = "You're Offline. Instant Call and Instant Chat requests can't arrive until you go Online."; }
  else { icon = 'info'; text = 'Instant Call and Instant Chat are off. Turn one on in the header to receive live requests.'; }
  return (
    <div className="ac-rail" role="status">
      <Icon name={icon} size={17} />
      <span className="ac-rail__txt">{text}</span>
    </div>
  );
}
