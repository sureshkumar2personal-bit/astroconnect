import Card from '@/components/ui/Card.jsx';

// Growth shown in green; decreases shown honestly in red (AD-15).
function Change({ value, versus }) {
  const up = value >= 0;
  return (
    <div className="ac-eo__change">
      <span className={up ? 'ac-up' : 'ac-down'}>{up ? '▲' : '▼'} {Math.abs(value)}%</span> vs {versus}
    </div>
  );
}

function Tile({ p, hero }) {
  return (
    <div className={`ac-eo__tile${hero ? ' ac-eo__tile--hero' : ''}`}>
      <div className="ac-eo__label">{p.label}</div>
      <div className="ac-eo__amount">{p.amount}</div>
      <Change value={p.change} versus={p.versus} />
    </div>
  );
}

// Earnings Overview (AD-15): Today's Earnings highlighted, then This Week, This Month and Last Month.
export default function EarningsCard({ data }) {
  return (
    <Card id="h-earn" icon="coins" title="Earnings Overview" headClass="ac-card__head--tile">
      <div className="ac-eo">
        <Tile p={data.today} hero />
        <Tile p={data.week} />
        <Tile p={data.month} />
        {data.lastMonth && <Tile p={data.lastMonth} />}
      </div>
      <p className="ac-card__caption">Net earnings after platform commission. Refunds appear only in <a href="#/earnings">Wallet</a>. Sample figures.</p>
    </Card>
  );
}
