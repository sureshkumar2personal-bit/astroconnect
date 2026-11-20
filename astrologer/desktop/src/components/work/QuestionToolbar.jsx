import { activeFilterCount } from '@shared/lib/textQuestions.js';

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
        <input type="search" placeholder="Search User ID / Question ID" value={filters.q} onChange={(e) => onSearch(e.target.value)} />
      </label>
      <button type="button" className="btn btn-o" onClick={onOpenFilters}>Filters{n ? ` (${n})` : ''}</button>
    </div>
  );
}
