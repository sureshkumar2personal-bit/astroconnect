import Card from '@/components/ui/Card.jsx';
import Icon from '@/components/ui/Icon.jsx';

// Four latest activities; each opens its detail, View All opens the Recent Activity tab (AD-20).
export default function RecentActivityCard({ items }) {
  return (
    <Card id="h-act" icon="pulse" iconStroke={1.9} title="Recent Activity" className="ac-activity"
      extra={<a href="#/activity" className="ac-viewall">View All<Icon name="chevronRight" size={16} stroke={2.2} /></a>}
    >
      {items.slice(0, 4).map((it) => (
        <a key={it.text} href={it.href} className="ac-activity__item">
          <Icon name={it.icon} size={28} stroke={1.7} className="ac-icon" />
          <span className="ac-activity__text">{it.text}</span>
          <span className="ac-activity__time">{it.time}</span>
        </a>
      ))}
    </Card>
  );
}
