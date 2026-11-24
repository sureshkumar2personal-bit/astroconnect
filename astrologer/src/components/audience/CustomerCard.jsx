import { fmtDate, dt } from '@/lib/format.js';
import { AVATAR_BG } from '@/data/mockAudience.js';
import { isExpired } from '@/hooks/useAudience.js';
import { Avatar, Badge } from '@/components/ui/sectionKit.jsx';

// Customer card (AD-136): name, User ID, follow + subscription status, dates, View Profile (opens a popup).
export default function CustomerCard({ u, onView }) {
  return (
    <section className="card au-card">
      <div className="row">
        <Avatar q={{ color: AVATAR_BG, ini: u.name[0] }} />
        <div className="grow"><b>{u.name}</b><div className="muted sm">{u.uid}</div></div>
      </div>
      <div className="row wrap au-badges">
        {u.follow ? <Badge kind="info">Follower</Badge> : <Badge kind="gen">Not following</Badge>}
        {u.sub && <Badge kind={isExpired(u.sub) ? 'bad' : 'accent'}>{u.sub} subscriber</Badge>}
        {u.blocked && <Badge kind="bad">Block requested</Badge>}
      </div>
      <span className="muted sm">Customer since {fmtDate(dt(u.since))} · last activity {fmtDate(dt(u.last))}</span>
      <button type="button" className="btn btn-o sm" onClick={() => onView(u)} aria-haspopup="dialog">View Profile</button>
    </section>
  );
}
