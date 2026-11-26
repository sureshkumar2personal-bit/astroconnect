import { useEffect, useState } from 'react';
import { STATUS_KIND, inr, isUpcoming } from '@/hooks/useAppointments.js';
import { dt } from '@/lib/textQuestions.js';
import { Badge } from '@/components/ui/primitives.jsx';
import ExpandTable from '@/components/ui/ExpandTable.jsx';
import AppointmentDetails from '@/components/appointments/AppointmentDetails.jsx';
import HistoryPage, { Pager, when } from './HistoryPage.jsx';
import { SearchIcon } from './QuestionToolbar.jsx';

const APT_PAGE = 5;
const PAST_STATUSES = ['Completed', 'Cancelled', 'Missed / No-show'];
const APT_COLS = ['User', 'Appointment ID', 'Type', 'Date & time', 'Duration', 'Amount', 'Status'];

const TABS = [['apt', 'Appointment History'], ['text', 'Text-Based Questions History']];

// My Work → History panel: the existing Appointment history (the Appointments list's History filter,
// rows expand in place) and the existing Text-Based Questions History, as two tabs on the same page.
export default function WorkHistory({ tq, apt, mobile, openDialog, toast }) {
  const [tab, setTab] = useState('apt');
  return (
    <section className="card sec wk-hist" id="wk-history" aria-label="History">
      <div className="tabs wk-hist__tabs" role="tablist" aria-label="History">
        {TABS.map(([k, t]) => (
          <button key={k} type="button" role="tab" aria-selected={tab === k} className={`tab${tab === k ? ' on' : ''}`} onClick={() => setTab(k)}>{t}</button>
        ))}
      </div>
      {tab === 'apt' ? (
        <div className="wk-hist__body" role="tabpanel" aria-label="Appointment History">
          <AppointmentHistory apt={apt} mobile={mobile} openDialog={openDialog} toast={toast} />
        </div>
      ) : (
        <div className="wk-hist__body" role="tabpanel" aria-label="Text-Based Questions History">
          <HistoryPage tq={tq} cat="text" toast={toast} />
        </div>
      )}
    </section>
  );
}

/** Appointment History: past appointments (the Appointments list's History filter), search, Status and
 *  Type filters, expandable rows with the inline Appointment Details (AD-78), 5 rows per page. */
function AppointmentHistory({ apt, mobile, openDialog, toast }) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);
  const term = query.trim().toLowerCase();
  const list = apt.list
    .filter((a) => !isUpcoming(a))
    .filter((a) => !status || a.status === status)
    .filter(() => !type || type === 'Voice-only') // every appointment is voice-only
    .filter((a) => !term || [a.user, a.uid, a.id].some((v) => String(v).toLowerCase().includes(term)))
    .sort((a, b) => dt(b.at) - dt(a.at));
  useEffect(() => { setPage(1); }, [query, status, type]);
  const pages = Math.max(1, Math.ceil(list.length / APT_PAGE));
  const cur = Math.min(page, pages);
  const shown = list.slice((cur - 1) * APT_PAGE, cur * APT_PAGE);
  const from = list.length ? (cur - 1) * APT_PAGE + 1 : 0;
  return (
    <div className="hx">
      <div className="hx-tools">
        <label className="search hx-search">
          <SearchIcon />
          <span className="sr">Search appointment history</span>
          <input type="search" value={query} placeholder="Search by user name, User ID or Appointment ID" onChange={(e) => setQuery(e.target.value)} />
        </label>
        <label className="hx-sel"><span>Status</span>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All statuses</option>
            {PAST_STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>
        <label className="hx-sel"><span>Type</span>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">All types</option>
            <option>Voice-only</option>
          </select>
        </label>
      </div>
      <div className="hx-card hx-card--apt">
        <ExpandTable animate cols={APT_COLS} empty="No appointments match your filters."
          rows={shown.map((a) => ({
            key: a.id,
            cells: [
              <span key="u" className="hx-user"><b>{a.user}</b><small>{a.uid}</small></span>,
              <span key="i" className="hx-aptid"><span className="hx-id">{a.id}</span>{a.pendingAtt && <Badge kind="accent">Attachment pending</Badge>}</span>,
              'Voice-only',
              when(a.at),
              `${a.dur} min`,
              <span key="a" className="hx-amtcell"><b className="hx-amt">{inr(a.amt)}</b>{a.pay !== 'Paid' && <small>{a.pay}</small>}</span>,
              <span key="s" className="hx-status"><Badge kind={STATUS_KIND[a.status]}>{a.status}</Badge></span>,
            ],
            detail: () => <AppointmentDetails inline apt={apt} id={a.id} mobile={mobile} openDialog={openDialog} toast={toast} />,
          }))}
        />
        <Pager cur={cur} pages={pages} from={from} to={from ? from + shown.length - 1 : 0} total={list.length} onPage={setPage} />
      </div>
    </div>
  );
}
