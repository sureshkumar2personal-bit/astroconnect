import { NCAT } from '@/data/mockNotifications.js';

// Category filter chips: All + categories A–I (AD-148, AD-149 category filters).
export default function NotificationFilters({ value, onChange }) {
  const chips = [['', 'All'], ...Object.entries(NCAT).map(([k, v]) => [k, `${k}. ${v}`])];
  return (
    <div className="nt-chips" role="group" aria-label="Filter by category">
      {chips.map(([k, label]) => (
        <button key={k || 'all'} type="button" className={`chip${value === k ? ' on' : ''}`} aria-pressed={value === k} onClick={() => onChange(k)}>
          {label}
        </button>
      ))}
    </div>
  );
}
