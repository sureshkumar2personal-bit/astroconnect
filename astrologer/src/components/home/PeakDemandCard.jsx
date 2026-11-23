import Card from '@/components/ui/Card.jsx';
import Icon from '@/components/ui/Icon.jsx';

// Peak Demand Hours (AD-16): last 7 days of Text Question and Appointment bookings, four IST ranges,
// peak period highlighted in amber with a "Peak" label. Bar width = count / highest count.
export default function PeakDemandCard({ data }) {
  const max = Math.max(...data.periods.map((p) => p.value));
  return (
    <Card id="h-peak" icon="bars" iconStroke={2} title="Peak demand hours" className="ac-peakcard ac-pd" headClass="ac-card__head--tile"
      extra={<span className="ac-pd__pill"><Icon name="crown" size={14} className="ac-icon" />Peak: {data.peak}</span>}
    >
      <p className="ac-pd__sub">Bookings by time of day, last 7 days</p>
      <ul className="ac-pd__list">
        {data.periods.map((p) => {
          const peak = p.key === data.peak;
          return (
            <li key={p.key} className={`ac-pd__row${peak ? ' is-peak' : ''}`}>
              <Icon name={p.icon} size={22} stroke={1.7} className="ac-pd__icon" />
              <div className="ac-pd__main">
                <div className="ac-pd__meta">
                  <span className="ac-pd__label">{p.key}</span>
                  <span className="ac-pd__range">{p.range}</span>
                </div>
                <div className="ac-pd__track" role="img"
                  aria-label={`${p.key}, ${p.range}: ${p.value} bookings${peak ? ', peak period' : ''}`}>
                  <div className="ac-pd__fill" style={{ width: `${(p.value / max) * 100}%` }} />
                </div>
              </div>
              <span className="ac-pd__count">{p.value}</span>
            </li>
          );
        })}
      </ul>
      <p className="ac-pd__foot">Last 7 days · text questions and appointments · IST</p>
    </Card>
  );
}
