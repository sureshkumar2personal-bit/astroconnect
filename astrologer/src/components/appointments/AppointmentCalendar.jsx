import { useState } from 'react';
import { Badge } from '@/components/ui/primitives.jsx';
import { navigate, routes } from '@/lib/router.js';
import { DAY, TODAY, fmtDate } from '@/lib/textQuestions.js';
import { DAYS, STATUS_KIND, SUBTITLES, fmtTime, isoDay, sameDay } from '@/hooks/useAppointments.js';
import { Seg } from './AppointmentList.jsx';

// The prototype calendar shows the week of 16 Nov 2026 and the month of November 2026.
const WEEK_START = new Date('2026-11-16T00:00');
const MONTH_START = new Date('2026-11-01T00:00');

const AptRow = ({ a }) => (
  <a className="li" href={`#${routes.aptDetail(a.id)}`}>
    <span className="ic">{fmtTime(a.at).replace(' ', '\n')}</span>
    <div className="grow"><b>{a.user}</b><div className="muted sm">{fmtDate(new Date(a.at))} · {a.dur} min · Voice call · {a.id}</div></div>
    <Badge kind={STATUS_KIND[a.status]}>{a.status}</Badge>
  </a>
);

// Calendar & Availability (AD-90, AD-92 – AD-94). Reference "05 Appointments" → aptCal.
export default function AppointmentCalendar({ apt, mobile, openDialog, toast }) {
  const { list, settings: s, calView, setCalView } = apt;
  const [brk, setBrk] = useState(['17:30', '18:00']);
  const [date, setDate] = useState('2026-11-21');
  const booked = (d) => list.filter((a) => sameDay(a.at, d) && a.status !== 'Cancelled');

  const week = DAYS.map((d, i) => {
    const day = new Date(+WEEK_START + i * DAY);
    const closed = s.closed.includes(isoDay(day));
    return (
      <div key={d}>
        <b>{d} {day.getDate()}</b>
        {closed ? <span className="cl">Closed</span>
          : s.week[d].length ? s.week[d].map((r) => <span key={r.join()} className="slot">{r[0]}–{r[1]}</span>)
            : <span className="muted">Unavailable</span>}
        {booked(day).map((a) => <a key={a.id} className="bk" href={`#${routes.aptDetail(a.id)}`}>{fmtTime(a.at)} {a.user}</a>)}
      </div>
    );
  });

  const month = Array.from({ length: 30 }, (_, i) => {
    const day = new Date(+MONTH_START + i * DAY);
    const n = booked(day).length;
    return (
      <div key={i} className="mday">
        <b>{i + 1}</b>
        {s.closed.includes(isoDay(day)) ? <span className="cl">Closed</span> : n ? <span className="bk">{n} booked</span> : null}
      </div>
    );
  });

  const price = (key) => (e) => {
    const v = Math.max(0, Number(e.target.value) || 0);
    apt.setPrice(key, v);
  };

  return (
    <>
      <div className="row wrap apt-ph">
        {mobile ? <p className="muted grow">{SUBTITLES.calendar}</p> : <button type="button" className="btn btn-o sm" onClick={() => navigate(routes.appointments)}>‹ Back</button>}
      </div>
      <div className="row wrap">
        <Seg label="Calendar view" options={['Daily', 'Weekly', 'Monthly'].map((v) => [v, v])} value={calView} onChange={setCalView} />
        <span className="pill">Week of 16 Nov 2026</span>
      </div>

      {calView === 'Daily' && (
        <section className="card">
          <h2 className="h">Friday, 20 Nov 2026</h2>
          <div className="stack">{list.filter((a) => sameDay(a.at, TODAY)).map((a) => <AptRow key={a.id} a={a} />)}</div>
          <span className="muted sm">Open slots: 09:00–12:00, 16:00–20:00 (break 13:00–14:00)</span>
        </section>
      )}
      {calView === 'Weekly' && <div className="wcal">{week}</div>}
      {calView === 'Monthly' && <div className="wcal wcal--month">{month}</div>}

      <div className="grid-lg">
        <section className="card">
          <h2 className="h">Appointment settings</h2>
          <div className="form">
            <div className="stack-sm">
              <b className="sm">Duration for this schedule period</b>
              <Seg label="Duration" options={[[15, '15 minutes'], [30, '30 minutes']]} value={s.dur} onChange={apt.setDuration} />
            </div>
            <div className="grid2">
              <label>Price · 15 min (₹)<input type="number" min="0" value={s.p15} onChange={price('p15')} onBlur={() => toast('Price saved · applies to future bookings only')} /></label>
              <label>Price · 30 min (₹)<input type="number" min="0" value={s.p30} onChange={price('p30')} onBlur={() => toast('Price saved · applies to future bookings only')} /></label>
            </div>
            <span className="muted sm">Price changes apply only to future bookings.</span>
            <div className="stack-sm">
              <b className="sm">Buffer after each appointment</b>
              <Seg label="Buffer" options={[[5, '5 minutes'], [10, '10 minutes']]} value={s.buffer} onChange={apt.setBuffer} />
            </div>
          </div>
        </section>

        <section className="card">
          <h2 className="h">Recurring weekly availability</h2>
          <div className="stack">
            {DAYS.map((d) => (
              <div key={d} className="row wrap">
                <b className="apt-day">{d}</b>
                <span className="grow sm">{s.week[d].map((r) => r.join(' – ')).join(', ') || <span className="muted">Unavailable</span>}</span>
                <button type="button" className="btn btn-o sm" onClick={() => openDialog('aptDay', d)}>Edit</button>
              </div>
            ))}
          </div>
        </section>

        <section className="card">
          <h2 className="h">Breaks</h2>
          <div className="stack">
            {s.breaks.map((b, i) => (
              <div key={i} className="row">
                <span className="grow">{b[0]} – {b[1]}</span>
                <button type="button" className="btn btn-o sm danger" onClick={() => apt.removeBreak(i)}>Remove</button>
              </div>
            ))}
          </div>
          <div className="row wrap">
            <label className="sr" htmlFor="bk1">Break from</label>
            <input id="bk1" type="time" value={brk[0]} onChange={(e) => setBrk([e.target.value, brk[1]])} />
            <label className="sr" htmlFor="bk2">Break to</label>
            <input id="bk2" type="time" value={brk[1]} onChange={(e) => setBrk([brk[0], e.target.value])} />
            <button type="button" className="btn btn-o sm" onClick={() => (brk[0] && brk[1] && brk[1] > brk[0] ? apt.addBreak(brk[0], brk[1]) : toast('Choose a valid break time.'))}>Add break</button>
          </div>
          <span className="muted sm">A slot is hidden if it can't finish before the next break.</span>
        </section>

        <section className="card">
          <h2 className="h">Overrides &amp; closed dates</h2>
          <div className="stack">
            {s.overrides.map((o, i) => <div key={i} className="note">{fmtDate(new Date(`${o.date}T00:00`))} · {o.note}</div>)}
            {s.closed.map((c) => (
              <div key={c} className="row"><span className="grow">Closed: {fmtDate(new Date(`${c}T00:00`))}</span><Badge kind="bad">Closed</Badge></div>
            ))}
          </div>
          <span className="muted sm">Overrides don't change the recurring schedule.</span>
          <div className="row wrap">
            <label className="sr" htmlFor="cd">Date</label>
            <input id="cd" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            <button type="button" className="btn btn-o sm" onClick={() => (date ? apt.addOverride(date) : toast('Choose a date.'))}>Add override</button>
            <button type="button" className="btn btn-o sm danger" onClick={() => (date ? openDialog('aptClose', date) : toast('Choose a date.'))}>Close this date</button>
          </div>
        </section>
      </div>
    </>
  );
}
