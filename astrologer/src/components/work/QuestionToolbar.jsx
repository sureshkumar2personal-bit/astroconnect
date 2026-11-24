import Icon from '@/components/ui/Icon.jsx';
import { activeFilterCount } from '@/lib/textQuestions.js';

export const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" />
  </svg>
);

export default function QuestionToolbar({ filters, onSearch, onOpenFilters }) {
  const n = activeFilterCount(filters);
  return (
    <div className="toolbar">
      <label className="search">
        <span className="sr">Search by User ID or Question ID</span>
        <SearchIcon />
        <input type="search" placeholder="Search by User ID or Question ID" value={filters.q} onChange={(e) => onSearch(e.target.value)} />
      </label>
      <button type="button" className={`btn btn-navy tq-filterbtn${n ? ' is-active' : ''}`} onClick={onOpenFilters}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0" /><circle cx="16" cy="6" r="2" /><circle cx="10" cy="12" r="2" /><circle cx="18" cy="18" r="2" />
        </svg>
        Filters{n ? ` (${n})` : ''}
        <Icon name="chevronDown" size={16} stroke={2} />
      </button>
    </div>
  );
}
