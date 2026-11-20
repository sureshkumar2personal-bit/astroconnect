import { useState } from 'react';
import { STATUS_KIND } from '../../lib/textQuestions.js';

function Select({ value, onChange, options }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
    </select>
  );
}

// Date range and month are shown as in the reference prototype, which does not
// filter on them yet.
export default function QuestionFilters({ filters, campaigns, onApply, onReset }) {
  const [f, setF] = useState(filters);
  const set = (k) => (v) => setF((cur) => ({ ...cur, [k]: v }));
  return (
    <>
      <div className="form">
        <div className="grid2">
          <label>From<input type="date" defaultValue="2026-10-01" /></label>
          <label>To<input type="date" defaultValue="2026-11-20" /></label>
        </div>
        <label>Month<select defaultValue="November 2026"><option>November 2026</option><option>October 2026</option></select></label>
        <label>Campaign<Select value={f.camp} onChange={set('camp')} options={[['', 'All campaigns'], ...campaigns.map((c) => [c.id, c.name])]} /></label>
        <div className="grid2">
          <label>Question type<Select value={f.type} onChange={set('type')} options={[['', 'General & Personal'], ['General', 'General'], ['Personal', 'Personal']]} /></label>
          <label>Priority<Select value={f.prio} onChange={set('prio')} options={[['', 'Priority 1 & 2'], ['1', 'Priority 1'], ['2', 'Priority 2']]} /></label>
        </div>
        <label>Question status<Select value={f.status} onChange={set('status')} options={[['', 'Any status'], ...Object.keys(STATUS_KIND).map((s) => [s, s])]} /></label>
        <label>Search<input type="search" value={f.q} onChange={(e) => set('q')(e.target.value)} placeholder="User ID / Question ID" /></label>
      </div>
      <div className="actions">
        <button type="button" className="btn btn-o" onClick={onReset}>Reset</button>
        <button type="button" className="btn btn-p" onClick={() => onApply(f)}>Apply Filters</button>
      </div>
    </>
  );
}
