import { Grid } from '@/components/ui/sectionKit.jsx';
import WorkHistory from './WorkHistory.jsx';
import { critical, inCat, isOpen, openCount } from '@/lib/textQuestions.js';
import { isUpcoming } from '@/hooks/useAppointments.js';
import { routes } from '@/lib/router.js';
import Icon from '@/components/ui/Icon.jsx';

// My Work overview (reference R.mywork; the same screen on desktop and phone, AD-46).
// Top row: Total Work (open Text-Based Questions + upcoming appointments), Text Questions and
// Appointments. Subscription Questions are not counted here (removed on request; AD-72 flagged).
/** One summary card: icon tile, title + description, big number. Links when `href` is given. */
function Stat({ icon, title, sub, value, href, hero, onClick, toggle, on }) {
  const body = (
    <>
      <span className="wk-stat__ic" aria-hidden="true"><Icon name={icon} size={22} stroke={1.8} /></span>
      <span className="wk-stat__txt"><b>{title}</b>{sub && <span>{sub}</span>}</span>
      <span className="wk-stat__n">{value}</span>
    </>
  );
  const cls = `wk-stat${hero ? ' wk-stat--hero' : ''}`;
  // The History card opens the History route; `on` highlights it while that page is shown.
  if (toggle) return <button type="button" className={`${cls} wk-stat--link wk-stat--toggle${on ? ' on' : ''}`} aria-expanded={on} onClick={onClick}>{body}</button>;
  return href ? <a className={`${cls} wk-stat--link`} href={`#${href}`} onClick={onClick}>{body}</a> : <div className={cls}>{body}</div>;
}

/** Card header: icon tile, serif title and a count pill. */
function CardHead({ icon, title, count, unit }) {
  return (
    <div className="wk-head">
      <span className="wk-head__ic" aria-hidden="true"><Icon name={icon} size={22} stroke={1.8} /></span>
      <h2 className="wk-head__t">{title}</h2>
      <span className="wk-pill"><b>{count}</b> {unit}</span>
    </div>
  );
}

/** Small tile: icon or status dot, title + description, number. */
function Tile({ icon, dot, tone, title, sub, value, valueTone }) {
  return (
    <div className="wk-tile">
      {icon && <span className={`wk-tile__ic wk-tone--${tone}`} aria-hidden="true"><Icon name={icon} size={18} stroke={1.9} /></span>}
      {dot && <span className={`wk-dot wk-tone--${dot}`} aria-hidden="true" />}
      <span className="wk-tile__txt"><b>{title}</b><span>{sub}</span></span>
      <span className={`wk-tile__n${valueTone ? ` wk-n--${valueTone}` : ''}`}>{value}</span>
    </div>
  );
}

const LinkIc = ({ href, icon, children }) => (
  <a className="wk-link" href={`#${href}`}><Icon name={icon} size={18} stroke={1.8} />{children}</a>
);

// Upcoming appointment statuses (appointments are confirmed on payment, no approval step).
const APT_STATUSES = [
  { st: 'Confirmed', sub: 'Paid and booked', tone: 'blue' },
  { st: 'Under Review', sub: 'Being reviewed', tone: 'gold' },
];

export default function WorkOverview({ questions, appointments, onAptTab, tq, apt, mobile, openDialog, toast, historyOpen, onOpenHistory }) {
  const showHistory = !!historyOpen; // true on the History route (#/work/history)
  const tOpen = openCount(questions, 'text');
  const upcoming = appointments.filter(isUpcoming).sort((a, b) => new Date(a.at) - new Date(b.at));
  const disputes = questions.filter((q) => q.status === 'Disputed').length;
  // Where the pending Text-Based Questions come from: Open Questions or a campaign.
  const pendingText = inCat(questions, 'text').filter(isOpen);
  const openQ = pendingText.filter((q) => q.camp === 'open').length;
  const campQ = pendingText.length - openQ;
  return (
    <>
      <div className="wk-stats">
        <Stat hero icon="briefcase" title="Total Work" value={tOpen + upcoming.length}
          sub={`${tOpen} question${tOpen === 1 ? '' : 's'} + ${upcoming.length} appointment${upcoming.length === 1 ? '' : 's'}`} />
        <Stat icon="chatQuestion" title="Text Questions" sub="Pending, all question types" value={tOpen} href={routes.list} />
        <Stat icon="calendar" title="Appointments" sub="Upcoming" value={upcoming.length} href={routes.appointments} onClick={() => onAptTab?.('upcoming')} />
        <Stat icon="history" title="History" value={appointments.filter((a) => !isUpcoming(a)).length} toggle on={showHistory} onClick={onOpenHistory} />
      </div>
      {/* History active: only the History panel below the summary row; the cards below are hidden (not removed). */}
      {showHistory ? <WorkHistory tq={tq} apt={apt} mobile={mobile} openDialog={openDialog} toast={toast} /> : (
      <Grid size="lg">
        <section className="card sec wk-card">
          <CardHead icon="chatQuestion" title="Text Questions" count={tOpen} unit="pending" />
          <span className="wk-sub">Needs attention</span>
          <div className="wk-tiles wk-tiles--2">
            <Tile icon="flag" tone="red" title="Priority 1" sub="20–30 days waiting" value={critical(questions)} valueTone="red" />
            <Tile icon="alert" tone="gold" title="Disputes" sub="Awaiting your answer" value={disputes} />
          </div>
          <span className="wk-sub">Pending count includes</span>
          <div className="wk-chips">
            <span className="wk-chip"><Icon name="chatQuestion" size={16} />Open Questions · {openQ}</span>
            <span className="wk-chip"><Icon name="megaphone" size={16} />Campaign · {campQ}</span>
          </div>
          <div className="wk-actions">
            <a className="wk-cta" href={`#${routes.list}`}>Open Text Questions<Icon name="chevronRight" size={18} stroke={2.2} /></a>
            <LinkIc href={routes.campaigns} icon="megaphone">Campaign Management</LinkIc>
            <LinkIc href={routes.view('templates')} icon="book">Answer Templates</LinkIc>
          </div>
        </section>
        <section className="card sec wk-card">
          <CardHead icon="calendar" title="Appointments" count={upcoming.length} unit="upcoming" />
          <span className="wk-sub">Upcoming by status</span>
          <div className="wk-tiles" style={{ '--n': APT_STATUSES.length }}>
            {APT_STATUSES.map((x) => (
              <Tile key={x.st} dot={x.tone} title={x.st} sub={x.sub} value={upcoming.filter((a) => a.status === x.st).length} />
            ))}
          </div>
          {upcoming.length > 0 && (
            <div className="wk-bar" role="img" aria-label={APT_STATUSES.map((x) => `${x.st} ${upcoming.filter((a) => a.status === x.st).length}`).join(', ')}>
              {APT_STATUSES.map((x) => {
                const n = upcoming.filter((a) => a.status === x.st).length;
                return n ? <span key={x.st} className={`wk-tone--${x.tone}`} style={{ flexGrow: n }} /> : null;
              })}
            </div>
          )}
          <p className="wk-note">
            Breakdown of the {upcoming.length} upcoming appointment{upcoming.length === 1 ? '' : 's'}. Completed and settled appointments move to history.
          </p>
          <div className="wk-actions">
            <a className="wk-cta" href={`#${routes.appointments}`} onClick={() => onAptTab?.('upcoming')}>Open Appointments<Icon name="chevronRight" size={18} stroke={2.2} /></a>
            <LinkIc href={routes.aptCalendar} icon="calendarPlus">Calendar &amp; Availability</LinkIc>
          </div>
        </section>
      </Grid>
      )}
    </>
  );
}
