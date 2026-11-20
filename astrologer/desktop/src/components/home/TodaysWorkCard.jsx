import Card from '@shared/components/Card.jsx';
import Icon from '@shared/components/Icon.jsx';

// Today's Work (AD-17 – AD-19): Appointments and Text Questions only.
// "View All" destination is pending (AP-01-07), so it does not navigate.
export default function TodaysWorkCard({ work, a }) {
  const { appointments: ap, textQuestions: q } = work;
  return (
    <Card id="h-work" icon="briefcase" title="Today's Work">
      <div className="ac-work-appt">
        <Icon name="calendarPlus" size={32} stroke={1.6} className="ac-icon ac-work__icon" />
        <div>
          <div className="ac-work__label">Appointments</div>
          <div className="ac-work__big"><b className="ac-heading">{ap.today}</b> Today</div>
        </div>
        <div className="ac-vrule" />
        <div className="ac-work-appt__next">
          <div className="ac-work__label">Next Appointment</div>
          <div className="ac-work__time">
            <Icon name="clock" size={18} stroke={2} className="ac-icon ac-work__clock" />
            {ap.next.time} · {ap.next.user}
          </div>
        </div>
        <a href="#" onClick={(e) => e.preventDefault()} className="ac-viewall">View All<Icon name="chevronRight" size={16} stroke={2.2} /></a>
      </div>

      <div className="ac-work-q">
        <Icon name="chat" size={32} stroke={1.6} className="ac-icon ac-work__icon" />
        <div className="ac-work-q__title">Text Questions</div>
        <div className="ac-counts">
          <div><div className="ac-work__label">Received</div><div className="ac-count">{q.received}</div></div>
          <div><div className="ac-work__label">Answered</div><div className="ac-count ac-up">{q.answered}</div></div>
          <div><div className="ac-work__label">Pending</div><div className="ac-count ac-heading">{q.pending}</div></div>
        </div>
      </div>

      <div className="ac-goal">
        <Icon name="target" size={32} stroke={1.7} className="ac-icon ac-work__icon" />
        <div className="ac-goal__body">
          <div className="ac-goal__top">
            <div className="ac-goal__titlebox">
              <div className="ac-goal__title">Daily Answer Goal</div>
              <div className="ac-goal__sub">{work.answeredToday} / {a.goal} completed</div>
            </div>
            <label className="ac-select">
              <span className="ac-sr">Daily answer goal</span>
              <select value={a.goal} onChange={(e) => a.setGoal(e.target.value)}>
                <option value="5">5 per day</option>
                <option value="10">10 per day</option>
                <option value="15">15 per day</option>
              </select>
            </label>
          </div>
          <div className="ac-goal__bar">
            <div role="progressbar" aria-label="Daily answer goal progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow={a.pct} className="ac-progress">
              <div className="ac-progress__fill" style={{ '--pct': `${a.pct}%` }} />
            </div>
            <span className="ac-goal__pct">{a.pct}%</span>
          </div>
          <div className="ac-goal__text">{a.goalText}</div>
        </div>
      </div>
    </Card>
  );
}
