import Icon from '../../components/icons.jsx';
import { href } from '../../router/useHashRoute.js';
import { Avatar, StatusBadge, TypeBadge } from '../Users/components/UserBits.jsx';
import { d, dt } from './components/ui.jsx';

// Breadcrumb, Back to Users and the profile summary (sections A and B).
export default function ProfileHeader({ user }) {
  return (
    <header className="p-header">
      <div className="p-header__nav">
        <nav aria-label="Breadcrumb" className="u-crumbs">
          <ol>
            <li>
              <a href={href('/dashboard')}>Dashboard</a>
            </li>
            <li>People Management</li>
            <li>
              <a href={href('/people/users')}>Users</a>
            </li>
            <li aria-current="page">User Profile</li>
          </ol>
        </nav>
        <a className="u-btn p-back" href={href('/people/users')}>
          <Icon name="chevronLeft" size={16} />
          Back to Users
        </a>
      </div>

      <div className="p-summary">
        <div className="p-summary__identity">
          <Avatar user={user} size={72} />
          <div className="p-summary__name-block">
            <h1 className="p-summary__name">{user.name}</h1>
            <p className="p-summary__id">{user.id}</p>
            <div className="p-summary__badges">
              <StatusBadge status={user.status} />
              <TypeBadge type={user.accountType} />
              {user.status !== 'Active' && <span className="p-summary__restricted">Login and services disabled</span>}
            </div>
          </div>
        </div>
        <dl className="p-summary__facts">
          <div>
            <dt>Mobile Number</dt>
            <dd>{user.mobile}</dd>
          </div>
          <div>
            <dt>Email Address</dt>
            <dd className="p-break">{user.email}</dd>
          </div>
          <div>
            <dt>Registration Date</dt>
            <dd>{d(user.registeredAt)}</dd>
          </div>
          <div>
            <dt>Last Active</dt>
            <dd>{dt(user.lastActiveAt)}</dd>
          </div>
        </dl>
      </div>
    </header>
  );
}
