import { href } from '../../../router/useHashRoute.js';
import { astrologerProfilePath } from '../../../router/navigation.js';
import { formatDate } from '../../../data/usersStore.js';
import ActionsMenu from '../../Users/components/ActionsMenu.jsx';
import { Avatar, StatusBadge } from '../../Users/components/UserBits.jsx';
import { AvailabilityBadge, Rating, ServiceChips, VerificationBadge } from './AstroBits.jsx';

// Mobile record layout: all fifteen documented fields are kept.
export default function AstroCardList({ rows, onAction }) {
  return (
    <ul className="u-records" aria-label="Astrologers">
      {rows.map((a) => {
        const profile = href(astrologerProfilePath(a.id));
        return (
          <li key={a.id} className={`u-record${a.status !== 'Active' ? ' is-restricted' : ''}`}>
            <div className="u-record__head">
              <Avatar user={a} size={40} />
              <div className="u-record__id">
                <a className="u-name" href={profile}>
                  {a.name}
                </a>
                <span className="u-record__uid">{a.id}</span>
              </div>
              <ActionsMenu user={a} onAction={onAction} profileHref={profile} />
            </div>
            <div className="u-record__badges">
              <StatusBadge status={a.status} />
              <AvailabilityBadge value={a.availability} />
              <VerificationBadge value={a.verification.kyc} label="KYC" />
            </div>
            <dl className="u-record__fields">
              <div>
                <dt>Mobile</dt>
                <dd>{a.mobile}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd className="u-email-full">{a.email}</dd>
              </div>
              <div>
                <dt>Experience</dt>
                <dd>{a.experience} years</dd>
              </div>
              <div className="a-wide">
                <dt>Specialization</dt>
                <dd>{a.specializations.join(', ')}</dd>
              </div>
              <div className="a-wide">
                <dt>Services</dt>
                <dd>
                  <ServiceChips offers={a.offers} />
                </dd>
              </div>
              <div>
                <dt>Rating</dt>
                <dd>
                  <Rating value={a.rating} count={a.reviewCount} />
                </dd>
              </div>
              <div>
                <dt>Total Services</dt>
                <dd>{a.totalServices.toLocaleString('en-IN')}</dd>
              </div>
              <div>
                <dt>Joined</dt>
                <dd>{formatDate(a.joinedAt)}</dd>
              </div>
            </dl>
            <a className="u-record__view" href={profile}>
              View Profile
            </a>
          </li>
        );
      })}
    </ul>
  );
}
