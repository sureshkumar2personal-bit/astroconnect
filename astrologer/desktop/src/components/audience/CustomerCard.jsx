import { fmtDate, dt } from '@shared/lib/format.js';
import { AVATAR_BG } from '@shared/data/mockAudience.js';
import { isExpired } from '@shared/hooks/useAudience.js';
import { Avatar, Badge } from '../section/kit.jsx';

// Customer card (AD-136): name, User ID, follow + subscription status, dates, View Profile.
export default function CustomerCard({ u }) {
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
      <a className="btn btn-o sm" href={`#/audience/user/${encodeURIComponent(u.uid)}`}>View Profile</a>
    </section>
  );
}
