import { useEffect, useRef, useState } from 'react';
import { ACTIVITY_SINCE, LAST_LABEL } from '@/data/mockAudience.js';
import { subsOf, termOf } from '@/hooks/useAudience.js';
import { Avatar, FollowBadge, Ic, TierBadge, blockLabel, fmtD } from './CustomerCard.jsx';

// User Profile opened from View Profile (AD-78, AD-137): customer information, subscription details and history,
// activity history and blocked-user context. Blocking is a request to Platform Admin (AD-161).
// The Interactions card was removed on request; AD-137 still lists interactions (flagged).

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const dayMon = (iso) => `${iso.slice(8, 10)} ${SHORT[Number(iso.slice(5, 7)) - 1]}`;
const TONE = { follow: 'follow', unfollow: 'muted', sub: 'gold', renew: 'gold', expired: 'bad', appt: 'ok', booked: 'ok', content: 'pri', saved: 'pri' };
const SHOWN = 7;

function BlockPanel({ b }) {
  const decided = b.s === 'Approved' || b.s === 'Rejected';
  const steps = [['Submitted', 'done'], ['Under review', decided ? 'done' : b.s !== 'Requested' ? 'cur' : ''], [b.s === 'Approved' ? 'Approved' : b.s === 'Rejected' ? 'Declined' : 'Admin decision', decided ? 'done' : '']];
  const note = {
    Requested: 'Your request has reached Platform Admin and is waiting to be picked up for review.',
    'Under review': 'Platform Admin is reviewing this request. You’ll be notified in Help & Support when a decision is made.',
    Approved: `Platform Admin approved this request${b.dec ? ` on ${fmtD(b.dec)}` : ''}.`,
    Rejected: `Platform Admin reviewed and declined this request${b.dec ? ` on ${fmtD(b.dec)}` : ''}. You can follow up in Help & Support.`,
  }[b.s];
  return (
    <div className={`au-blkp${b.s === 'Approved' ? ' is-ok' : b.s === 'Rejected' ? ' is-no' : ''}`}>
      <div className="au-blkp__h"><Ic n="flag" size={15} /><div><b>Block request · {b.s}</b><small>Submitted {fmtD(b.at)} via Help &amp; Support{b.ref ? ` · Ref ${b.ref}` : ''}</small></div></div>
      <ol className="au-steps" aria-label="Review progress">{steps.map(([l, c]) => <li key={l} className={c}><i />{l}</li>)}</ol>
      {b.reason && <p><b>Reason:</b> {b.reason}</p>}
      <p>{note}</p>
      <p className="au-blkp__rule">Only Platform Admin can approve or reject block requests. <a href="#/support">View in Help &amp; Support</a></p>
    </div>
  );
}

export default function CustomerProfile({ u }) {
  const [all, setAll] = useState(false);
  useEffect(() => setAll(false), [u.uid]);
  const subs = subsOf(u);
  const cur = subs[subs.length - 1];
  const first = u.name.split(' ')[0];
  const recent = (u.events || []).filter((e) => e[0] >= ACTIVITY_SINCE);
  const shown = all ? recent : recent.slice(0, SHOWN);
  const groups = [];
  shown.forEach(([date, time, k, t, d]) => {
    const key = date.slice(0, 7);
    let g = groups[groups.length - 1];
    if (!g || g.key !== key) { g = { key, label: `${MONTHS[Number(key.slice(5)) - 1]} ${key.slice(0, 4)}`, items: [] }; groups.push(g); }
    g.items.push({ k, t, d, when: `${dayMon(date)} · ${time}` });
  });
  const term = cur && cur.status === 'Active' ? termOf(cur) : null;
  const info = [
    ['Customer name', u.name, ''],
    ['User ID', u.uid, ''],
    ['Customer since', fmtD(u.since), ''],
    ['Current follow status', u.follow ? 'Following' : 'Not following', u.follow ? `Since ${fmtD(u.since)}` : u.unf ? `Unfollowed ${fmtD(u.unf)}` : 'Has never followed you'],
    ['Last activity', fmtD(u.last), LAST_LABEL[u.lastType] || ''],
  ];
  // A block request with full details, or the existing request note for a customer without them.
  const block = u.block || null;

  return (
    <div className="au-prof">
      <div className="au-prof__id">
        <Avatar u={u} large />
        <div><h2 className="au-prof__name">{u.name}</h2><div className="au-prof__uid">{u.uid} · Customer since {fmtD(u.since)}</div></div>
      </div>
      <div className="au-prof__badges">
        <FollowBadge u={u} /><TierBadge u={u} />
        {block && <span className={`au-blk${block.s === 'Approved' ? ' is-ok' : ''}`}><Ic n="flag" size={11} />{blockLabel(block)}</span>}
      </div>

      {block && <BlockPanel b={block} />}
      {!block && u.blocked && <p className="au-blkp">{u.blocked}</p>}

      <section className="au-ps">
        <h3>Customer information</h3>
        <dl className="au-kv">{info.map(([k, v, sub]) => <div key={k}><dt>{k}</dt><dd>{v}{sub && <small>{sub}</small>}</dd></div>)}</dl>
        <p className="au-ps__note">Birth details only where the user has given consent.</p>
      </section>

      <section className="au-ps">
        <h3>Subscription details</h3>
        {cur ? (
          <div className={`au-subcard${cur.status === 'Active' ? ` is-active t-${cur.tier.toLowerCase()}` : ''}`}>
            <div className="au-subcard__h">
              <div><b><Ic n="diamond" size={12} />{cur.plan}</b><small>{cur.status === 'Active' ? `${cur.period} plan · renews manually` : `Ended ${fmtD(cur.end)}${u.follow ? ' · still follows you' : ''}`}</small></div>
              <span className={`au-st${cur.status === 'Active' ? ' is-a' : ''}`}>{cur.status}</span>
            </div>
            <dl className="au-kv">
              <div><dt>Plan name</dt><dd>{cur.plan}</dd></div>
              <div><dt>Subscription tier</dt><dd>{cur.tier}</dd></div>
              <div><dt>Start date</dt><dd>{fmtD(cur.start)}</dd></div>
              <div><dt>{cur.status === 'Active' ? 'Expiry date' : 'Expired on'}</dt><dd>{fmtD(cur.end)}</dd></div>
            </dl>
            {term && (
              <div className="au-term">
                <div className="au-term__bar"><i style={{ width: `${term.pct}%` }} /></div>
                <div className="au-term__t"><span>Day {term.used} of {term.total}</span><span>{term.left} {term.left === 1 ? 'day' : 'days'} remaining</span></div>
              </div>
            )}
          </div>
        ) : u.sub ? (
          <p className="au-mini"><b>{u.sub}</b></p>
        ) : (
          <div className="au-mini"><b>No subscription yet</b><span>{first} hasn’t subscribed to any of your plans yet. Plan details will appear here once they do.</span></div>
        )}
      </section>

      <section className="au-ps">
        <h3>Subscription history {subs.length > 0 && <span>{subs.length} {subs.length === 1 ? 'record' : 'records'}</span>}</h3>
        {subs.length ? (
          <ul className="au-hist">
            {subs.slice().reverse().map((h) => (
              <li key={h.start}>
                <div><b className={`t-${h.tier.toLowerCase()}`}><Ic n="diamond" size={11} />{h.plan}</b><span> · {h.period}</span><small>{fmtD(h.start)} – {fmtD(h.end)}</small></div>
                <span className={`au-st${h.status === 'Active' ? ' is-a' : ''}`}>{h.status}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="au-mini"><b>No subscription history</b><span>Past and current plans will be listed here once this customer subscribes.</span></div>
        )}
      </section>

      <section className="au-ps">
        <h3>Activity history {recent.length > 0 && <span>{recent.length} in the last 12 months</span>}</h3>
        {recent.length ? (
          <>
            {groups.map((g) => (
              <div className="au-tlg" key={g.key}>
                <p className="au-tlg__m">{g.label}</p>
                <ol className="au-tl">
                  {g.items.map((e, i) => (
                    <li key={i}><span className={`au-tl__ic tone-${TONE[e.k] || 'info'}`}><Ic n={e.k} size={14} /></span><div><b>{e.t}</b><small>{e.d}</small></div><span className="au-tl__w">{e.when}</span></li>
                  ))}
                </ol>
              </div>
            ))}
            {recent.length > SHOWN && <button type="button" className="au-more" onClick={() => setAll(!all)}>{all ? 'Show fewer' : `Show all ${recent.length} activities`}</button>}
          </>
        ) : (
          <div className="au-mini"><b>No activity in the last 12 months</b><span>{first}’s last interaction was on {fmtD(u.last)}. Interactions older than 12 months are archived.</span></div>
        )}
      </section>

      {!block && !u.blocked && (
        <div className="au-blkp is-none">
          <div className="au-blkp__h"><Ic n="flag" size={15} /><div><b>Concerned about this customer?</b><small>You can't block a user directly. Send a request and Platform Admin will review it. Admin makes the final decision.</small></div></div>
          <a className="au-btn au-btn--danger" href={`#/support/new/Audience%2FCustomers/${encodeURIComponent(u.uid)}`}>Request to block this user</a>
        </div>
      )}
    </div>
  );
}

/** The profile in a side panel over the Audience list (a full-screen sheet on phones). Closing returns to the list as it was. */
export function ProfilePanel({ u, onClose }) {
  const closeBtn = useRef(null);
  const back = useRef(null);
  useEffect(() => {
    back.current = document.activeElement;
    closeBtn.current?.focus();
    const esc = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', esc);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', esc); document.body.style.overflow = prev; back.current?.focus?.(); };
  }, [onClose]);
  return (
    <div className="au-ovl" role="dialog" aria-modal="true" aria-label={`Profile of ${u.name}`}>
      <button type="button" className="au-scrim" aria-label="Close profile" tabIndex={-1} onClick={onClose} />
      <div className="au-panel">
        <button type="button" ref={closeBtn} className="au-ibtn au-panel__close" aria-label="Close profile" onClick={onClose}><Ic n="x" size={18} /></button>
        <div className="au-panel__body"><CustomerProfile u={u} /></div>
      </div>
    </div>
  );
}
