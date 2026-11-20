import QuestionCard from './QuestionCard.jsx';

export default function QuestionList({ items, selectedId, campaignName, onSelect, hasFilters, onClearFilters }) {
  if (!items.length) {
    return (
      <div className="empty">
        <b>No questions here</b>
        <span className="muted">Try another tab or clear filters.</span>
        {hasFilters && <button type="button" className="btn btn-o" onClick={onClearFilters}>Clear filters</button>}
      </div>
    );
  }
  return (
    <div className="list">
      {items.map((q) => (
        <QuestionCard key={q.id} q={q} campaignName={campaignName(q.camp)} selected={q.id === selectedId} onSelect={onSelect} />
      ))}
    </div>
  );
}
