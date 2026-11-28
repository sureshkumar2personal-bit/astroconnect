import { href } from '../../../router/useHashRoute.js';
import { userProfilePath } from '../../../router/navigation.js';
import { formatDate, formatDateTime } from '../../../data/usersStore.js';
import ActionsMenu from './ActionsMenu.jsx';
import { Avatar, StatusBadge, TypeBadge } from './UserBits.jsx';

// Mobile record layout: every one of the ten documented fields is kept.
export default function UserCardList({ rows, onAction }) {
  return (
    <ul className="u-records" aria-label="Users">
      {rows.map((u) => (
        <li key={u.id} className={`u-record${u.status !== 'Active' ? ' is-restricted' : ''}`}>
          <div className="u-record__head">
            <Avatar user={u} size={40} />
            <div className="u-record__id">
              <a className="u-name" href={href(userProfilePath(u.id))}>
                {u.name}
              </a>
              <span className="u-mono u-record__uid">{u.id}</span>
            </div>
            <ActionsMenu user={u} onAction={onAction} />
          </div>
          <div className="u-record__badges">
            <StatusBadge status={u.status} showRestriction />
            <TypeBadge type={u.accountType} />
          </div>
          <dl className="u-record__fields">
            <div>
              <dt>Mobile</dt>
              <dd className="u-mono">{u.mobile}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd className="u-email-full">{u.email}</dd>
            </div>
            <div>
              <dt>Registered</dt>
              <dd>{formatDate(u.registeredAt)}</dd>
            </div>
            <div>
              <dt>Last Active</dt>
              <dd>{formatDateTime(u.lastActiveAt)}</dd>
            </div>
          </dl>
          <a className="u-record__view" href={href(userProfilePath(u.id))}>
            View Profile
          </a>
        </li>
      ))}
    </ul>
  );
}
