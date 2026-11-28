import Icon from '../../../components/icons.jsx';
import { SERVICE_KEYS } from '../../../data/astrologersStore.js';

const AVAIL_CLASS = { Available: 'is-available', Busy: 'is-busy', Offline: 'is-offline', DND: 'is-dnd' };
const VERIFY_CLASS = { Approved: 'is-approved', Submitted: 'is-submitted', 'Not Submitted': 'is-none', Rejected: 'is-rejected' };

export function AvailabilityBadge({ value }) {
  return (
    <span className={`a-avail ${AVAIL_CLASS[value]}`}>
      <span className="a-avail__dot" aria-hidden="true" />
      {value}
    </span>
  );
}

export function VerificationBadge({ value, label }) {
  return (
    <span className={`a-verify ${VERIFY_CLASS[value]}`} title={label ? `${label}: ${value}` : undefined}>
      {label ? `${label}: ` : ''}
      {value}
    </span>
  );
}

/** Text / Appointment / Call / Chat — offered services are highlighted. */
export function ServiceChips({ offers }) {
  return (
    <span className="a-services" aria-label={`Services: ${SERVICE_KEYS.filter(([k]) => offers[k]).map(([, l]) => l).join(', ') || 'none'}`}>
      {SERVICE_KEYS.map(([k, label]) => (
        <span key={k} className={`a-service${offers[k] ? ' is-on' : ''}`} aria-hidden="true" title={`${label}: ${offers[k] ? 'offered' : 'not offered'}`}>
          {label}
        </span>
      ))}
    </span>
  );
}

export function Rating({ value, count }) {
  if (value === null || value === undefined) return <span className="a-rating is-none">No reviews</span>;
  return (
    <span className="a-rating" aria-label={`Rating ${value} out of 5 from ${count} published reviews`}>
      <span className="a-rating__star" aria-hidden="true">★</span>
      <strong>{value.toFixed(1)}</strong>
      {count !== undefined && <span className="a-rating__count">({count})</span>}
    </span>
  );
}

export function ExperienceText({ years }) {
  return (
    <span>
      {years} yr{years === 1 ? '' : 's'}
    </span>
  );
}

export function SortIcon({ active, dir }) {
  return <Icon name={active ? (dir === 'asc' ? 'sortUp' : 'sortDown') : 'sort'} size={14} className="u-sort__icon" />;
}
