import { fmtDate, dt } from '@/lib/format.js';
import { LAST_LABEL } from '@/data/mockAudience.js';
import { subStatus, tierOf } from '@/hooks/useAudience.js';

// Shared bits for the Audience screens (reference "AstroConnect – Audience"), styled under .au in sections.css.
const P = {
  search: 'M4 11a7 7 0 1 0 14 0a7 7 0 1 0-14 0M20 20l-3.5-3.5', filter: 'M3 5h18l-7 8.5V20l-4-2v-4.5z',
  calendar: 'M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM16 2v4M8 2v4M3 10h18',
  arrow: 'M5 12h14M13 6l6 6-6 6', x: 'M18 6 6 18M6 6l12 12', flag: 'M5 22V4M5 4h11l-2 4 2 4H5', diamond: 'M12 3l7 9-7 9-7-9z',
  chevL: 'M15 18l-6-6 6-6', chevR: 'M9 18l6-6-6-6', users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M5 7a4 4 0 1 0 8 0a4 4 0 1 0-8 0M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8',
  follow: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M5 7a4 4 0 1 0 8 0a4 4 0 1 0-8 0M19 8v6M22 11h-6',
  unfollow: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M5 7a4 4 0 1 0 8 0a4 4 0 1 0-8 0M22 11h-6',
  sub: 'M6 3h12l4 6-10 12L2 9zM2 9h20M10 3 8 9l4 12 4-12-2-6',
  renew: 'M3 12a9 9 0 0 1 15.5-6.3L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.5 6.3L3 16M3 21v-5h5',
  expired: 'M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0M12 7v5l3 2',
  question: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2zM9.5 8.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5M12 14.5h.01',
  appt: 'M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM16 2v4M8 2v4M3 10h18M9 16l2 2 4-4',
  call: 'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z',
  chat: 'M7.9 20A9 9 0 1 0 4 16.1L2 22zM8 12h.01M12 12h.01M16 12h.01',
  content: 'M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z',
  saved: 'M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z', info: 'M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20zM12 16v-4M12 8h.01',
};
export function Ic({ n, size = 16 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d={P[n] || P.chat} /></svg>;
}
P.booked = P.appt;

export const fmtD = (iso) => (iso ? fmtDate(dt(iso)) : '');
export const initials = (name) => { const p = name.split(' '); return (p[0][0] + (p[1] ? p[1][0] : '')).toUpperCase(); };

export function Avatar({ u, large }) {
  const st = subStatus(u);
  return <span className={`au-av${large ? ' au-av--lg' : ''}${st === 'active' ? ` is-ring t-${tierOf(u).toLowerCase()}` : ''}`} aria-hidden="true">{initials(u.name)}</span>;
}
export const FollowBadge = ({ u }) => <span className={`au-follow${u.follow ? ' is-on' : ''}`}><i />{u.follow ? 'Following' : 'Not following'}</span>;
export function TierBadge({ u }) {
  const st = subStatus(u);
  if (st === 'none') return <span className="au-nosub">No subscription</span>;
  const t = tierOf(u);
  return <span className={`au-tier t-${t.toLowerCase()}${st === 'expired' ? ' is-exp' : ''}`}><Ic n="diamond" size={11} />{t}<em>· {st === 'active' ? 'Active' : 'Expired'}</em></span>;
}
/** Block request label shown beside a name (a declined request isn't flagged in the list). */
export function blockLabel(b) {
  if (!b) return '';
  return { Approved: 'Blocked by admin', 'Under review': 'Block under review', Rejected: 'Block request declined' }[b.s] || 'Block requested';
}

// One customer in the Audience list (AD-136): name, User ID, follow + subscription status, dates, last activity, View profile.
// A table row on wide screens and a compact card on phones (container queries in sections.css).
export default function CustomerCard({ u, onView }) {
  const b = u.block && u.block.s !== 'Rejected' ? u.block : null;
  return (
    <li className="au-row">
      <div className="au-cust">
        <Avatar u={u} />
        <div className="au-cust__t">
          <span className="au-cust__n"><b>{u.name}</b>{b && <span className={`au-blk${b.s === 'Approved' ? ' is-ok' : ''}`}><Ic n="flag" size={11} />{blockLabel(b)}</span>}</span>
          <span className="au-cust__id">{u.uid}</span>
        </div>
      </div>
      <div className="au-rel" data-label="Relationship"><FollowBadge u={u} /><TierBadge u={u} /></div>
      <div className="au-since" data-label="Customer since">{fmtD(u.since)}</div>
      <div className="au-last" data-label="Last activity">{fmtD(u.last)}<small>{LAST_LABEL[u.lastType] || ''}</small></div>
      <div className="au-act">
        <button type="button" className="au-btn" onClick={() => onView(u)} aria-label={`View profile of ${u.name}`} aria-haspopup="dialog">View profile<Ic n="arrow" size={14} /></button>
      </div>
    </li>
  );
}
