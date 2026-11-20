import Card from '@shared/components/Card.jsx';
import Icon from '@shared/components/Icon.jsx';

// Four latest activities with View All (AD-20). Destination pending (AP-01-07).
export default function RecentActivityCard({ items }) {
  return (
    <Card id="h-act" icon="pulse" iconStroke={1.9} title="Recent Activity" className="ac-activity"
      extra={<a href="#" onClick={(e) => e.preventDefault()} className="ac-viewall">View All<Icon name="chevronRight" size={16} stroke={2.2} /></a>}
    >
      {items.slice(0, 4).map((it) => (
        <div key={it.text} className="ac-activity__item">
          <Icon name={it.icon} size={28} stroke={1.7} className="ac-icon" />
          <span className="ac-activity__text">{it.text}</span>
          <span className="ac-activity__time">{it.time}</span>
        </div>
      ))}
    </Card>
  );
}
