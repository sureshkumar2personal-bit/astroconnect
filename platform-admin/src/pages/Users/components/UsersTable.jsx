import Icon from '../../../components/icons.jsx';
import { href } from '../../../router/useHashRoute.js';
import { userProfilePath } from '../../../router/navigation.js';
import { formatDate, formatTime } from '../../../data/usersStore.js';
import ActionsMenu from './ActionsMenu.jsx';
import { Avatar, StatusBadge, TypeBadge } from './UserBits.jsx';

// All ten documented columns (user-management.md §2), in order.
const COLUMNS = [
  { key: 'photo', label: 'Photo', className: 'c-photo' },
  { key: 'name', label: 'Name', sortKey: 'name', className: 'c-name' },
  { key: 'id', label: 'ID', sortKey: 'id', className: 'c-id' },
  { key: 'mobile', label: 'Mobile', className: 'c-mobile' },
  { key: 'email', label: 'Email', className: 'c-email' },
  { key: 'type', label: 'Account Type', className: 'c-type' },
  { key: 'status', label: 'Account Status', sortKey: 'status', className: 'c-status' },
  { key: 'registered', label: 'Registration Date', sortKey: 'registeredAt', className: 'c-date' },
  { key: 'lastActive', label: 'Last Active', sortKey: 'lastActiveAt', className: 'c-date' },
  { key: 'actions', label: 'Actions', className: 'c-actions' },
];

function SortHeader({ col, sort, onSort }) {
  const active = sort.key === col.sortKey;
  const dirLabel = active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : null;
  return (
    <th
      scope="col"
      className={col.className}
      aria-sort={active ? dirLabel : undefined}
    >
      <button
        type="button"
        className={`u-sort${active ? ' is-active' : ''}`}
        onClick={() => onSort(col.sortKey)}
        title={`Sort by ${col.label}`}
      >
        {col.label}
        <Icon
          name={active ? (sort.dir === 'asc' ? 'sortUp' : 'sortDown') : 'sort'}
          size={14}
          className="u-sort__icon"
        />
      </button>
    </th>
  );
}

export default function UsersTable({ rows, sort, onSort, onAction }) {
  function onRowClick(event, user) {
    // Ignore clicks on links, buttons and other controls inside the row.
    if (event.target.closest('a, button, input, select, [role=menu]')) return;
    window.location.hash = href(userProfilePath(user.id));
  }

  return (
    <div className="u-table-wrap">
      <table className="u-table">
        <caption className="visually-hidden">
          Users. Select a name to open the user profile. Column headers with buttons can be sorted.
        </caption>
        <thead>
          <tr>
            {COLUMNS.map((col) =>
              col.sortKey ? (
                <SortHeader key={col.key} col={col} sort={sort} onSort={onSort} />
              ) : (
                <th key={col.key} scope="col" className={col.className}>
                  {col.label}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((u) => (
            <tr key={u.id} className={u.status !== 'Active' ? 'is-restricted' : undefined} onClick={(e) => onRowClick(e, u)}>
              <td className="c-photo">
                <Avatar user={u} size={34} />
              </td>
              <td className="c-name">
                <a className="u-name" href={href(userProfilePath(u.id))}>
                  {u.name}
                </a>
              </td>
              <td className="c-id">
                <span className="u-mono">{u.id}</span>
              </td>
              <td className="c-mobile">
                <span className="u-mono">{u.mobile}</span>
              </td>
              <td className="c-email">
                <span className="u-email" title={u.email}>
                  {u.email}
                </span>
              </td>
              <td className="c-type">
                <TypeBadge type={u.accountType} />
              </td>
              <td className="c-status">
                <StatusBadge status={u.status} showRestriction />
              </td>
              <td className="c-date">{formatDate(u.registeredAt)}</td>
              <td className="c-date">
                <span className="u-when">
                  {formatDate(u.lastActiveAt)}
                  <span className="u-when__time">{formatTime(u.lastActiveAt)}</span>
                </span>
              </td>
              <td className="c-actions">
                <div className="u-row-actions">
                  <a className="u-view" href={href(userProfilePath(u.id))} aria-label={`View profile of ${u.name}`}>
                    View
                  </a>
                  <ActionsMenu user={u} onAction={onAction} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
