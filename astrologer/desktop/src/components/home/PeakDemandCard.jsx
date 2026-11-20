import Card from '@shared/components/Card.jsx';
import Icon from '@shared/components/Icon.jsx';

// Compact four-period chart; peak highlighted in gold with a "Peak Time" label (AD-16).
export default function PeakDemandCard({ data }) {
  const aria = 'Requests by period: ' + data.periods.map((p) => `${p.key} ${p.value}${p.key === data.peak ? ' (peak)' : ''}`).join(', ');
  return (
    <Card id="h-peak" icon="bars" iconStroke={3} title="Peak Demand Hours" info className="ac-peakcard"
      extra={<span className="ac-peakchip ac-peakchip--head"><Icon name="crown" size={22} className="ac-icon" />Peak Time: {data.peak}</span>}
    >
      <div className="ac-peakchip ac-peakchip--body"><Icon name="crown" size={22} className="ac-icon" />Peak Time: {data.peak}</div>
      <div role="img" aria-label={aria} className="ac-bars">
        {data.periods.map((p) => (
          <div key={p.key} className="ac-bar">
            <span className="ac-bar__value">{p.value}</span>
            <div className={`ac-bar__fill ${p.key === data.peak ? 'is-peak' : ''}`} style={{ '--v': p.value }} />
          </div>
        ))}
      </div>
      <div className="ac-bars-labels">
        {data.periods.map((p) => (
          <div key={p.key} className={`ac-barlabel ${p.key === data.peak ? 'is-peak' : ''}`}>
            <Icon name={p.icon} size={22} stroke={p.key === data.peak ? 1.8 : 1.7} className="ac-barlabel__icon" />
            {p.key}
          </div>
        ))}
      </div>
    </Card>
  );
}
