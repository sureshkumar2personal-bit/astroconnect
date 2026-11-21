import { Badge } from '@shared/components/ui.jsx';
import { navigate, routes } from '@shared/lib/router.js';
import { dt, fmtDateTime } from '@shared/lib/textQuestions.js';
import { STATUS_KIND, SUBTITLES, inr } from '@shared/hooks/useAppointments.js';

const TABS = [['upcoming', 'Upcoming'], ['today', 'Today'], ['history', 'History']];
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

// Appointments list (reference "05 Appointments" → list view).
export default function AppointmentList({ apt, mobile }) {
  const { visible, counts, settings, tab, setTab, query, setQuery } = apt;
  const go = (id) => navigate(routes.aptDetail(id));
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
      <div className="card tw">
        <table className="tbl">
          <thead><tr>{COLS.map((c) => <th key={c}>{c}</th>)}</tr></thead>
          <tbody>
            {visible.length ? visible.map((a) => (
              <tr key={a.id} tabIndex={0} onClick={() => go(a.id)} onKeyDown={(e) => { if (e.key === 'Enter') go(a.id); }}>
                <td data-label={COLS[0]}><span><b>{a.id}</b>{a.pendingAtt && <> <Badge kind="accent">Attachment pending</Badge></>}</span></td>
                <td data-label={COLS[1]}><span>{a.user}<div className="muted sm">{a.uid}</div></span></td>
                <td data-label={COLS[2]}>{fmtDateTime(dt(a.at))}</td>
                <td data-label={COLS[3]}>{a.dur} min</td>
                <td data-label={COLS[4]}><Badge kind={STATUS_KIND[a.status]}>{a.status}</Badge></td>
                <td data-label={COLS[5]}>{inr(a.amt)} · {a.pay}</td>
              </tr>
            )) : (
              <tr><td colSpan={COLS.length} className="muted">No records for this filter.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="muted sm">Appointment status and payment settlement status are tracked separately. Settlement: 3% commission, eligible 3 days after completion (Wallet).</p>
    </>
  );
}
