import Icon from '@/components/ui/Icon.jsx';
import { AvailCard, Card, PageHead, SaveBar, useDraft, validPrice } from './svShared.jsx';

const COPY = {
  call: { name: 'Instant Call', icon: 'phone', one: 'call', active: 'Active caller · not counted', activeAria: 'One active caller plus up to three users in the waiting list', waitNote: "Up to 3 users waiting. The active caller isn't counted.", unit: 'call' },
  chat: { name: 'Instant Chat', icon: 'chat', one: 'chat', active: 'Active chat · not counted', activeAria: 'One active chat plus up to three users in the waiting list', waitNote: "Up to 3 users waiting. The active chat isn't counted.", unit: 'chat' },
};

/** Service Management → Instant Call / Instant Chat: per-minute rate and the platform rules for reference. */
export default function RateService({ kind }) {
  const c = COPY[kind];
  const f = useDraft({ rate: '25' });
  const ok = validPrice(f.draft.rate);
  const bad = f.tried && !ok;
  const min = ok ? Math.round(Number(f.draft.rate) * 5 * 100) / 100 : null;
  const save = () => { if (!ok) return f.fail('Enter a per-minute rate above ₹0.'); f.commit(); };
  return (
    <div className="sv">
      <PageHead icon={c.icon} title={c.name} />
      <Card title={`${kind === 'call' ? 'Call' : 'Chat'} pricing`} id="sv-pr">
        <label className="sv-f">Your per-minute rate
          <span className={`sv-money${bad ? ' bad' : ''}`}><i>₹</i><input type="text" inputMode="decimal" value={f.draft.rate} aria-invalid={bad} onChange={(e) => f.upd((x) => { x.rate = e.target.value; })} /><em>per minute</em></span>
        </label>
        <p className={`sv-hint${bad ? ' sv-hint--bad' : ''}`}>{ok ? `At this rate, the 5-minute minimum costs the user ₹${min}.` : 'Enter a rate above ₹0.'}</p>
      </Card>
      <Card title={`${kind === 'call' ? 'Call' : 'Chat'} rules`} id="sv-ru">
        <dl className="sv-kv">
          <div><dt>Minimum prepaid duration</dt><dd>5 minutes</dd></div>
          <div><dt>Time to accept a request</dt><dd>30 seconds</dd></div>
          <div><dt>Waiting list</dt><dd>{c.waitNote}</dd></div>
        </dl>
        <div className="sv-queue" role="img" aria-label={c.activeAria}>
          <span className="sv-q sv-q--on">{c.active}</span>
          {[1, 2, 3].map((n) => <span key={n} className="sv-q">Waiting {n}</span>)}
        </div>
      </Card>
      <Card title="Billing, packages & refunds" id="sv-bi">
        <ul className="sv-pol">
          {["Users pay through existing prepaid packages and their AstroConnect wallet.", "Your per-minute rate is applied by the existing billing system. Nothing else about billing changes here.", "Refunds and wallet adjustments follow existing platform rules."].map((t) => <li key={t}><Icon name="check" size={16} /><div><b>{t}</b></div></li>)}
        </ul>
      </Card>
      <Card title="Notifications" id="sv-no">
        <div className="sv-note"><Icon name="info" size={16} /><span>Incoming {c.unit} requests and waiting-list updates reach you through the existing {c.name} notifications. There are no separate settings here.</span></div>
      </Card>
      <AvailCard name={c.name} />
      <SaveBar status={f.status} dirty={f.dirty} onCancel={f.discard} onSave={save} />
    </div>
  );
}
