import Card from '@/components/ui/Card.jsx';
import Icon from '@/components/ui/Icon.jsx';
import { Badge } from '@/components/ui/primitives.jsx';
import { TODAY, dt, fmtDate, fmtDateTime, fmtTime, sameDay } from '@/lib/format.js';
import { STATUS_KIND, isUpcoming } from '@/hooks/useAppointments.js';
import { answeredToday, critical, disputeDue, openDisputes, pendingToday, receivedToday } from '@/lib/textQuestions.js';

// Today's Work (AD-17 – AD-19), as in the reference Home: Appointments (today's count + next 3
// upcoming), Text-Based Questions with the Daily Answer Goal, Subscription Questions (shown
// separately), Campaign Questions and open Disputes (shown separately).

const ViewAll = ({ href, children = 'View All' }) => (
  <a href={href} className="ac-viewall">{children}<Icon name="chevronRight" size={16} stroke={2.2} /></a>
);

function Counts({ items }) {
  return (
    <div className="ac-counts ac-tw__counts">
      {items.map(([label, value, cls]) => (
        <div key={label}><div className="ac-work__label">{label}</div><div className={`ac-count ${cls || ''}`}>{value}</div></div>
      ))}
    </div>
  );
}

export default function TodaysWorkSection({ tq, apt, a }) {
  const qs = tq.questions;
  const appts = apt.list;
  const todayCount = appts.filter((x) => sameDay(x.at, TODAY) && x.status !== 'Cancelled').length;
  const next3 = appts.filter((x) => isUpcoming(x) && dt(x.at) >= TODAY).sort((x, y) => dt(x.at) - dt(y.at)).slice(0, 3);
  const done = answeredToday(qs, 'text');
  const rcv = receivedToday(qs, 'text');
  const crit = critical(qs);
  const disputes = openDisputes(qs);
  const bars = [['ok', 'Received today', rcv], ['goal', 'Daily goal', a.goal], ['bad', 'Critical (Priority 1)', crit]];
  const max = Math.max(rcv, a.goal, crit, 1);

  return (
    <Card id="h-work" icon="briefcase" title="Today's Work" className="ac-tw-section">
      <div className="ac-tw">
        <div className="ac-tw__card ac-tw__card--appt">
          <div className="ac-tw__head"><b>Appointments · {todayCount} today</b><ViewAll href="#/work/appointments" /></div>
          <div className="ac-tw__timeline">
          {next3.length ? next3.map((x) => (
            <a key={x.id} href={`#/work/appointments/${x.id}`} className="ac-tw__row">
              <span className="ac-tw__time">{fmtTime(x.at)}</span>
              <span className="ac-tw__main"><b>{x.user}</b><span className="ac-tw__sub">{fmtDate(dt(x.at))} · {x.dur} min · Voice call · {x.id}</span></span>
              <span className="tq ac-tw__badge"><Badge kind={STATUS_KIND[x.status]}>{x.status}</Badge></span>
            </a>
          )) : <span className="ac-tw__sub">No upcoming appointments</span>}
          </div>
        </div>

        <div className="ac-tw__card ac-tw__card--text">
          <div className="ac-tw__head"><b>Text-Based Questions · today</b><ViewAll href="#/work/questions">Open</ViewAll></div>
          <Counts items={[['Received', rcv], ['Answered', done, 'ac-up'], ['Pending', pendingToday(qs, 'text'), 'ac-heading']]} />
          <div className="ac-goal__top">
            <div className="ac-goal__titlebox">
              <div className="ac-goal__title">Daily Answer Goal</div>
              <div className="ac-goal__sub">{done} / {a.goal} completed</div>
            </div>
            <label className="ac-select">
              <span className="ac-sr">Daily goal</span>
              <select value={a.goal} onChange={(e) => a.setGoal(e.target.value)}>
                {[5, 10, 15].map((v) => <option key={v} value={v}>{v} per day</option>)}
              </select>
            </label>
          </div>
          <div className="ac-goal__bar">
            <div role="progressbar" aria-label="Daily answer goal progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow={a.pct} className="ac-progress">
              <div className="ac-progress__fill" style={{ '--pct': `${a.pct}%` }} />
            </div>
            <span className="ac-goal__pct">{a.pct}%</span>
          </div>
          <div className="ac-goal__text">{a.goalText} · Dispute answers don't count.</div>
        </div>

        <div className="ac-tw__card ac-tw__card--sub">
          <div className="ac-tw__head"><b>Subscription Questions · today</b><ViewAll href="#/work/subscriptions">Open</ViewAll></div>
          <Counts items={[['Received', receivedToday(qs, 'sub')], ['Answered', answeredToday(qs, 'sub'), 'ac-up'], ['Pending', pendingToday(qs, 'sub'), 'ac-heading']]} />
        </div>

        <div className="ac-tw__card ac-tw__card--camp">
          <div className="ac-tw__head"><b>Campaign Questions</b></div>
          {bars.map(([k, label, v]) => (
            <div key={k} className="ac-tw__bar">
              <span className="ac-tw__barlabel"><span className={`ac-tw__dot ac-tw__dot--${k}`} />{label}</span>
              <span className="ac-tw__track"><span className={`ac-tw__fill ac-tw__fill--${k}`} style={{ '--pct': `${(v / max) * 100}%` }} /></span>
              <b>{v}</b>
            </div>
          ))}
        </div>

        <div className="ac-tw__card ac-tw__card--bad ac-tw__card--disp">
          <div className="ac-tw__head"><b>Disputes · {disputes.length} open</b></div>
          {disputes.length ? disputes.map((q) => (
            <a key={q.id} href={`#/work/questions/${q.id}`} className="ac-tw__row">
              <span className="ac-tw__time ac-tw__time--bad">!</span>
              <span className="ac-tw__main"><b>{q.id} · {q.name}</b><span className="ac-tw__sub">Answer by {fmtDateTime(disputeDue(q))} · else Admin Review</span></span>
              <span className="ac-viewall">Dispute Details<Icon name="chevronRight" size={16} stroke={2.2} /></span>
            </a>
          )) : <span className="ac-tw__sub">No open disputes</span>}
        </div>
      </div>
    </Card>
  );
}
