import Icon from '../../../components/icons.jsx';
import { formatNumber } from '../../../components/charts/chartUtils.js';

const CARDS = [
  { key: 'all', countKey: 'total', label: 'Total Users', icon: 'people', tone: 'gold', hint: 'All accounts' },
  { key: 'Active', countKey: 'Active', label: 'Active Users', icon: 'userCheck', tone: 'green', hint: 'Can log in and use services' },
  {
    key: 'restricted',
    countKey: 'restricted',
    label: 'Restricted Users',
    icon: 'userBlock',
    tone: 'amber',
    hint: null, // built from counts below
  },
];

// Three summary cards; each one also works as a status filter.
export default function StatusCards({ counts, selected, onSelect }) {
  return (
    <div className="u-cards" role="group" aria-label="Filter by account status">
      {CARDS.map((card) => {
        const isSelected = selected === card.key;
        const hint =
          card.hint ??
          `${formatNumber(counts.Suspended)} suspended · ${formatNumber(counts.Blocked)} blocked`;
        return (
          <button
            key={card.key}
            type="button"
            className={`u-card u-card--${card.tone}${isSelected ? ' is-selected' : ''}`}
            aria-pressed={isSelected}
            onClick={() => onSelect(card.key)}
          >
            <span className="u-card__icon">
              <Icon name={card.icon} size={20} />
            </span>
            <span className="u-card__body">
              <span className="u-card__label">{card.label}</span>
              <span className="u-card__count">{formatNumber(counts[card.countKey])}</span>
              <span className="u-card__hint">{hint}</span>
            </span>
            {isSelected && (
              <span className="u-card__check" aria-hidden="true">
                <Icon name="check" size={14} />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
