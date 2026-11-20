import { TABS, countTab } from '@shared/lib/textQuestions.js';

export default function QuestionTabs({ questions, tab, onChange }) {
  return (
    <div className="tabs" role="tablist" aria-label="Question views">
      {TABS.map((t) => (
        <button key={t.key} type="button" role="tab" aria-selected={tab === t.key} className={`tab${tab === t.key ? ' on' : ''}`} onClick={() => onChange(t.key)}>
          {t.label}
          <span className="n">{countTab(questions, t.key)}</span>
        </button>
      ))}
    </div>
  );
}
