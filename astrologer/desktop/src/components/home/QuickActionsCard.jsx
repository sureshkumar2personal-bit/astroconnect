import Card from '@shared/components/Card.jsx';
import Icon from '@shared/components/Icon.jsx';

// Exactly four Quick Actions (AD-21). Destinations are pending (AP-01-08, AP-01-11),
// so the tiles do not navigate yet.
export default function QuickActionsCard({ actions }) {
  return (
    <Card id="h-qa" icon="bolt" title="Quick Actions">
      <div className="ac-qa">
        {actions.map((q) => (
          <a key={q.label} href="#" onClick={(e) => e.preventDefault()} className="ac-qa__tile">
            <Icon name={q.icon} size={34} stroke={1.7} className="ac-icon ac-qa__icon" />
            {q.label}
          </a>
        ))}
      </div>
    </Card>
  );
}
