import Card from '@/components/ui/Card.jsx';
import Icon from '@/components/ui/Icon.jsx';

// Four latest activities as a small timeline: tinted icon, title, detail line, time.
// Each opens its detail; View All opens the Recent Activity tab (AD-20).
export default function RecentActivityCard({ items }) {
  return (
    <Card id="h-act" icon="pulse" iconStroke={1.9} title="Recent Activity" className="ac-activity" headClass="ac-card__head--tile"
      extra={<a href="#/activity" className="ac-viewall">View All<Icon name="chevronRight" size={16} stroke={2.2} /></a>}
    >
      <div className="ac-activity__list">
        {items.slice(0, 4).map((it) => (
          <a key={it.text} href={it.href} className="ac-activity__item">
            <span className={`ac-activity__ic ac-activity__ic--${it.tone || 'plain'}`} aria-hidden="true"><Icon name={it.icon} size={17} stroke={1.8} /></span>
            <span className="ac-activity__body">
              <span className="ac-activity__text">{it.text}</span>
              {it.sub && <span className="ac-activity__sub">{it.sub}</span>}
            </span>
            <span className="ac-activity__time">{it.time}</span>
          </a>
        ))}
      </div>
    </Card>
  );
}
