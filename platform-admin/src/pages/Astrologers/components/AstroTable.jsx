import { href } from '../../../router/useHashRoute.js';
import { astrologerProfilePath } from '../../../router/navigation.js';
import { formatDate } from '../../../data/usersStore.js';
import ActionsMenu from '../../Users/components/ActionsMenu.jsx';
import { Avatar, StatusBadge } from '../../Users/components/UserBits.jsx';
import { AvailabilityBadge, ExperienceText, Rating, ServiceChips, SortIcon, VerificationBadge } from './AstroBits.jsx';

// All fifteen documented columns (astrologer-management.md §2), in order.
const COLUMNS = [
  { key: 'photo', label: 'Photo', className: 'c-photo' },
  { key: 'name', label: 'Name', sortKey: 'name', className: 'c-name' },
  { key: 'id', label: 'Astrologer ID', sortKey: 'id', className: 'c-id' },
  { key: 'mobile', label: 'Mobile', className: 'c-mobile' },
  { key: 'email', label: 'Email', className: 'c-email' },
  { key: 'spec', label: 'Specialization', className: 'c-spec' },
  { key: 'exp', label: 'Experience', sortKey: 'experience', className: 'c-exp' },
  { key: 'services', label: 'Services', className: 'c-services' },
  { key: 'avail', label: 'Availability', className: 'c-avail' },
  { key: 'status', label: 'Account Status', className: 'c-status' },
  { key: 'verify', label: 'Verification Status', className: 'c-verify' },
  { key: 'rating', label: 'Rating', sortKey: 'rating', className: 'c-rating' },
  { key: 'total', label: 'Total Services', sortKey: 'totalServices', className: 'c-total' },
  { key: 'joined', label: 'Joined Date', sortKey: 'joined', className: 'c-date' },
  { key: 'actions', label: 'Actions', className: 'c-actions' },
];

export default function AstroTable({ rows, sort, onSort, onAction }) {
  function onRowClick(event, a) {
    if (event.target.closest('a, button, input, select, [role=menu]')) return;
    window.location.hash = href(astrologerProfilePath(a.id));
  }
  return (
    <div className="u-table-wrap">
      <table className="u-table a-table">
        <caption className="visually-hidden">Astrologers. Select a name to open the astrologer profile.</caption>
        <thead>
          <tr>
            {COLUMNS.map((c) => {
              const active = sort.key === c.sortKey;
              return c.sortKey ? (
                <th key={c.key} scope="col" className={c.className} aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : undefined}>
                  <button type="button" className={`u-sort${active ? ' is-active' : ''}`} onClick={() => onSort(c.sortKey)}>
                    {c.label}
                    <SortIcon active={active} dir={sort.dir} />
                  </button>
                </th>
              ) : (
                <th key={c.key} scope="col" className={c.className}>
                  {c.label}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((a) => {
            const profile = href(astrologerProfilePath(a.id));
            return (
              <tr key={a.id} className={a.status !== 'Active' ? 'is-restricted' : undefined} onClick={(e) => onRowClick(e, a)}>
                <td className="c-photo">
                  <Avatar user={a} size={34} />
                </td>
                <td className="c-name">
                  <a className="u-name" href={profile}>
                    {a.name}
                  </a>
                </td>
                <td className="c-id">{a.id}</td>
                <td className="c-mobile">{a.mobile}</td>
                <td className="c-email">
                  <span className="u-email" title={a.email}>
                    {a.email}
                  </span>
                </td>
                <td className="c-spec">
                  <span className="a-spec" title={a.specializations.join(', ')}>
                    {a.specializations.join(', ')}
                  </span>
                </td>
                <td className="c-exp">
                  <ExperienceText years={a.experience} />
                </td>
                <td className="c-services">
                  <ServiceChips offers={a.offers} />
                </td>
                <td className="c-avail">
                  <AvailabilityBadge value={a.availability} />
                </td>
                <td className="c-status">
                  <StatusBadge status={a.status} />
                </td>
                <td className="c-verify">
                  <VerificationBadge value={a.verification.kyc} />
                </td>
                <td className="c-rating">
                  <Rating value={a.rating} count={a.reviewCount} />
                </td>
                <td className="c-total">{a.totalServices.toLocaleString('en-IN')}</td>
                <td className="c-date">{formatDate(a.joinedAt)}</td>
                <td className="c-actions">
                  <div className="u-row-actions">
                    <a className="u-view" href={profile} aria-label={`View profile of ${a.name}`}>
                      View
                    </a>
                    <ActionsMenu user={a} onAction={onAction} profileHref={profile} />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
