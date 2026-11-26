import Card from '@/components/ui/Card.jsx';
import Icon from '@/components/ui/Icon.jsx';
import PeakDemandCard from '@/components/home/PeakDemandCard.jsx';
import { instantToday } from '@/data/mockHome.js';

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

function InstantStats({ icon, title, d }) {
  const pct = d.received ? Math.round((d.completed / d.received) * 100) : 0;
  const stats = [
    { icon: 'inbox', label: 'Total received', value: d.received },
    { icon: 'checkCircle', label: 'Completed', value: d.completed, tone: 'ok' },
    { icon: 'phoneMissed', label: 'Missed / unanswered', value: d.missed, tone: 'bad' },
    { icon: 'timer', label: 'Total duration', value: d.duration },
  ];
  return (
    <div className="ac-ic__col">
      <h4 className="ac-ic__sub"><Icon name={icon} size={20} className="ac-ic__subicon" />{title}</h4>
      <div className="ac-ic__stats">
        {stats.map((s) => (
          <div key={s.label} className="ac-ic__stat">
            <div className="ac-ic__label"><Icon name={s.icon} size={14} />{s.label}</div>
            <div className={`ac-ic__value${s.tone ? ` is-${s.tone}` : ''}`}>{s.value}</div>
          </div>
        ))}
      </div>
      <div className="ac-ic__bar" role="img" aria-label={`${pct}% completed`}>
        <span className="ac-ic__done" style={{ width: `${pct}%` }} />
        <span className="ac-ic__lost" style={{ width: `${100 - pct}%` }} />
      </div>
      <div className="ac-ic__pct">{pct}% completed</div>
    </div>
  );
}

// Earnings Overview (AD-15): Today's Earnings highlighted, then This Week, This Month and Last Month.
export default function EarningsCard({ data, peak }) {
  return (
    <>
      <Card id="h-earn" icon="coins" title="Earnings Overview" headClass="ac-card__head--tile">
        <div className="ac-eo">
          <Tile p={data.today} hero />
          <Tile p={data.week} />
          <Tile p={data.month} />
          {data.lastMonth && <Tile p={data.lastMonth} />}
        </div>
      </Card>
      <PeakDemandCard data={peak} />
      <Card id="h-instant" icon="phone" title="Instant Calls & Chats" headClass="ac-card__head--tile" extra={<span className="ac-ic__pill">Today</span>}>
        <div className="ac-ic__cols">
          <InstantStats icon="phone" title="Instant Calls" d={instantToday.calls} />
          <InstantStats icon="chat" title="Instant Chats" d={instantToday.chats} />
        </div>
      </Card>
    </>
  );
}
