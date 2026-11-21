import { contentActions } from '@shared/hooks/useContent.js';
import { BENEFIT_KINDS } from '@shared/data/mockContent.js';
import { Grid, Sec, SwitchRow } from '../section/kit.jsx';
import { create } from './nav.js';

// Subscriber Benefit Content (AD-140): Daily, Weekly, Monthly and Special Predictions, separate content per
// tier, Daily/Weekly recurring schedules; expired subscribers have no access.
export default function BenefitTab({ recur }) {
  return (
    <>
      <Grid>
        {BENEFIT_KINDS.map((k) => (
          <Sec key={k} title={k}>
            <p className="muted sm">{k === 'Special Prediction' ? 'Use a special astrology template or custom content.' : '12-Rasi template · Text + Image · separate content per tier'}</p>
            <button type="button" className="btn btn-p cm-start" onClick={() => create(k)}>Create {k}</button>
          </Sec>
        ))}
      </Grid>
      <Sec title="Recurring schedules">
        <SwitchRow label="Daily prediction · every day 6:00 AM" on={recur.daily} onToggle={() => contentActions.toggleRecur('daily')} />
        <SwitchRow label="Weekly prediction · every Monday 6:00 AM" on={recur.weekly} onToggle={() => contentActions.toggleRecur('weekly')} />
        <span className="muted sm">Users with expired subscriptions can't access subscriber-only content.</span>
      </Sec>
    </>
  );
}
