import Icon from '../../components/icons.jsx';
import { href } from '../../router/useHashRoute.js';
import { Avatar, StatusBadge } from '../Users/components/UserBits.jsx';
import { AvailabilityBadge, Rating, VerificationBadge } from '../Astrologers/components/AstroBits.jsx';
import { d, dt } from '../UserProfile/components/ui.jsx';

export default function AstroHeader({ astrologer: a, rating, reviewCount }) {
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
              <a href={href('/people/astrologers')}>Astrologers</a>
            </li>
            <li aria-current="page">Astrologer Profile</li>
          </ol>
        </nav>
        <a className="u-btn p-back" href={href('/people/astrologers')}>
          <Icon name="chevronLeft" size={16} />
          Back to Astrologers
        </a>
      </div>
      <div className="p-summary">
        <div className="p-summary__identity">
          <Avatar user={a} size={72} />
          <div className="p-summary__name-block">
            <h1 className="p-summary__name">{a.name}</h1>
            <p className="p-summary__id">
              {a.id} · {a.specializations.join(', ')}
            </p>
            <div className="p-summary__badges">
              <StatusBadge status={a.status} />
              <AvailabilityBadge value={a.availability} />
              <VerificationBadge value={a.verification.kyc} label="KYC" />
              <Rating value={rating} count={reviewCount} />
            </div>
          </div>
        </div>
        <dl className="p-summary__facts">
          <div>
            <dt>Mobile Number</dt>
            <dd>{a.mobile}</dd>
          </div>
          <div>
            <dt>Email Address</dt>
            <dd className="p-break">{a.email}</dd>
          </div>
          <div>
            <dt>Joined</dt>
            <dd>{d(a.joinedAt)}</dd>
          </div>
          <div>
            <dt>Last Active</dt>
            <dd>{dt(a.lastActiveAt)}</dd>
          </div>
        </dl>
      </div>
    </header>
  );
}
