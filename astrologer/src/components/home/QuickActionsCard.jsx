import Card from '@/components/ui/Card.jsx';
import Icon from '@/components/ui/Icon.jsx';

// Exactly four Quick Actions and their destinations (AD-21).
export default function QuickActionsCard({ actions }) {
  return (
    <Card id="h-qa" icon="bolt" title="Quick Actions">
      <div className="ac-qa">
        {actions.map((q) => (
          <a key={q.label} href={q.href} className="ac-qa__tile">
            <Icon name={q.icon} size={34} stroke={1.7} className="ac-icon ac-qa__icon" />
            {q.label}
          </a>
        ))}
      </div>
    </Card>
  );
}
