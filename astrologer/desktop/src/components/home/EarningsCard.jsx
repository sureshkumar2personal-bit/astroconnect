import Card from '@shared/components/Card.jsx';
import Icon from '@shared/components/Icon.jsx';

// Growth shown in green; decreases shown honestly (AD-15).
function Change({ value }) {
  const up = value >= 0;
  return (
    <span className={up ? 'ac-up' : 'ac-down'}>
      {up ? '▲ +' : '▼ '}
      {value}%
    </span>
  );
}

function Period({ p }) {
  return (
    <div className="ac-period">
      <Icon name="calendarPlus" size={24} className="ac-icon ac-period__icon" />
      <div>
        <div className="ac-period__label">{p.label}</div>
        <div className="ac-period__amount">{p.amount}</div>
        <div className="ac-period__change">
          <Change value={p.change} /> <span className="ac-period__vs">vs {p.versus}</span>
        </div>
      </div>
    </div>
  );
}

export default function EarningsCard({ data }) {
  return (
    <Card id="h-earn" icon="coins" title="Today's Earnings" info extra={<span className="ac-badge">Illustrative Data</span>} headClass="ac-card__head--earn">
      <div className="ac-earn">
      <div className="ac-today">
        <div className="ac-today__main">
          <div className="ac-today__amount">{data.today.amount}</div>
          <div className="ac-today__label">Today</div>
        </div>
        <div className="ac-today__rule" />
        <div className="ac-today__change">
          <div className="ac-today__pct"><Change value={data.today.change} /></div>
          <div className="ac-today__vs">vs {data.today.versus}</div>
        </div>
      </div>
      <div className="ac-periods">
        <Period p={data.week} />
        <Period p={data.month} />
      </div>
      </div>
    </Card>
  );
}
