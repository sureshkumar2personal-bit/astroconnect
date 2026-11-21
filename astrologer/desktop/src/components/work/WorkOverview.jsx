import { Kpi, KpiGrid, Grid, Sec, BtnRow, Badge } from '../section/kit.jsx';
import { critical, fmtDate, inCat, isOpen, openCount } from '@shared/lib/textQuestions.js';
import { STATUS_KIND, fmtTime, isUpcoming } from '@shared/hooks/useAppointments.js';
import { routes } from '@shared/lib/router.js';

// My Work overview (reference R.mywork; the same screen on desktop and phone, AD-46).
// Total Work = open Text-Based Questions + open Subscription Questions + upcoming appointments;
// the two question categories are always counted separately (AD-72).
function AptRow({ a }) {
  const [time, ampm] = fmtTime(a.at).split(' ');
  return (
    <a className="li" href={`#${routes.aptDetail(a.id)}`}>
      <span className="ic apt-time">{time}<br />{ampm}</span>
      <div className="grow">
        <b className="li-title">{a.user}</b>
        <div className="muted sm">{fmtDate(a.at)} · {a.dur} min · Voice call · {a.id}</div>
      </div>
      <Badge kind={STATUS_KIND[a.status]}>{a.status}</Badge>
      {a.pendingAtt && <Badge kind="accent">Attachment pending</Badge>}
    </a>
  );
}

export default function WorkOverview({ questions, appointments }) {
  const tOpen = openCount(questions, 'text');
  const sOpen = openCount(questions, 'sub');
  const upcoming = appointments.filter(isUpcoming).sort((a, b) => new Date(a.at) - new Date(b.at));
  const disputes = questions.filter((q) => q.status === 'Disputed').length;
  return (
    <>
      <KpiGrid>
        <Kpi label="Total Work" value={tOpen + sOpen + upcoming.length} />
        <Kpi label="Text Questions" value={tOpen} sub={<span className="muted sm">open</span>} href={routes.list} />
        <Kpi label="Subscription Questions" value={sOpen} sub={<span className="muted sm">open · shown separately</span>} href={routes.subs} />
        <Kpi label="Appointments" value={upcoming.length} sub={<span className="muted sm">upcoming</span>} href={routes.appointments} />
      </KpiGrid>
      <Grid size="lg">
        <Sec title="Text Questions">
          <KpiGrid>
            <Kpi label="Received" value={inCat(questions, 'text').filter(isOpen).length} />
            <Kpi label="Priority 1 · 20–30 days" value={<span className="dl">{critical(questions)}</span>} />
            <Kpi label="Disputes" value={disputes} />
          </KpiGrid>
          <BtnRow>
            <a className="btn btn-p" href={`#${routes.list}`}>Open Text Questions</a>
            <a className="btn btn-o" href={`#${routes.campaigns}`}>Campaign Management</a>
            <a className="btn btn-o" href={`#${routes.view('templates')}`}>Answer Templates</a>
            <a className="btn btn-o" href={`#${routes.view('history')}`}>History</a>
          </BtnRow>
        </Sec>
        <Sec title="Appointments">
          <div className="stack">
            {upcoming.slice(0, 3).map((a) => <AptRow key={a.id} a={a} />)}
            {!upcoming.length && <span className="muted sm">No upcoming appointments.</span>}
          </div>
          <BtnRow>
            <a className="btn btn-p" href={`#${routes.appointments}`}>Open Appointments</a>
            <a className="btn btn-o" href={`#${routes.aptCalendar}`}>Calendar &amp; Availability</a>
          </BtnRow>
        </Sec>
      </Grid>
    </>
  );
}
