import { useEffect } from 'react';
import { Badge } from '@/components/ui/primitives.jsx';
import { routes } from '@/lib/router.js';
import ExpandTable from '@/components/ui/ExpandTable.jsx';
import AppointmentDetails from './AppointmentDetails.jsx';
import { dt, fmtDateTime } from '@/lib/textQuestions.js';
import { STATUS_KIND, SUBTITLES, inr } from '@/hooks/useAppointments.js';

// Past appointments are under My Work → History → Appointment History.
const TABS = [['upcoming', 'Upcoming'], ['today', 'Today']];
const COLS = ['Appointment', 'User', 'Date & time', 'Duration', 'Status', 'Payment'];

export const Kpi = ({ label, value, children }) => (
  <div className="kpi"><span className="sm">{label}</span><b>{value}</b>{children}</div>
);

/** Toggle group used by the reference ("seg"): one pressed button at a time. */
export function Seg({ label, options, value, onChange }) {
  return (
    <div className="tabs" role="group" aria-label={label}>
      {options.map(([v, l]) => (
        <button key={v} type="button" className={`tab${v === value ? ' on' : ''}`} aria-pressed={v === value} onClick={() => onChange(v)}>{l}</button>
      ))}
    </div>
  );
}

/** Appointments table: a row expands in place to show the Appointment Details (AD-78); one row open at a time.
 *  Used by the Appointments list and by My Work → History → Appointment History. */
export function AppointmentTable({ list, apt, mobile, openDialog, toast }) {
  return (
    <ExpandTable className="card" cols={COLS}
      rows={list.map((a) => ({
        key: a.id,
        cells: [
          <span key="i"><b>{a.id}</b>{a.pendingAtt && <> <Badge kind="accent">Attachment pending</Badge></>}</span>,
          <span key="u">{a.user}<div className="muted sm">{a.uid}</div></span>,
          fmtDateTime(dt(a.at)),
          `${a.dur} min`,
          <Badge key="s" kind={STATUS_KIND[a.status]}>{a.status}</Badge>,
          `${inr(a.amt)} · ${a.pay}`,
        ],
        detail: () => <AppointmentDetails inline apt={apt} id={a.id} mobile={mobile} openDialog={openDialog} toast={toast} />,
      }))}
    />
  );
}

// Appointments list (reference "05 Appointments" → list view).
export default function AppointmentList({ apt, mobile, openDialog, toast }) {
  const { visible, counts, settings, tab, setTab, query, setQuery } = apt;
  // The list no longer has a History tab; fall back to Upcoming if it was still selected.
  useEffect(() => { if (tab === 'history') setTab('upcoming'); }, [tab, setTab]);
  return (
    <>
      <div className="row wrap apt-ph">
        {mobile ? <p className="muted grow">{SUBTITLES.list}</p> : <span className="grow" />}
        <a className="btn btn-p" href={`#${routes.aptCalendar}`}>Calendar &amp; Availability</a>
      </div>
      <div className="kpis">
        <Kpi label="Today" value={counts.today} />
        <Kpi label="Upcoming" value={counts.upcoming} />
        <Kpi label="Attachment pending" value={counts.pendingAtt} />
        <Kpi label="Durations" value="15 / 30 min"><span className="sm">{inr(settings.p15)} · {inr(settings.p30)}</span></Kpi>
      </div>
      <div className="row wrap">
        <Seg label="Appointments" options={TABS} value={tab} onChange={setTab} />
        <label className="search">
          <span className="sr">Search</span>
          <input type="search" placeholder="Search name, User ID, Appointment ID" value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
      </div>
      <AppointmentTable list={visible} apt={apt} mobile={mobile} openDialog={openDialog} toast={toast} />
    </>
  );
}
