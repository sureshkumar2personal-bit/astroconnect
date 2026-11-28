import { Fragment, useState } from 'react';
import { STATUS, TODAY_ISO, dateOfA, initials, inr, isOpenStatus, minsFromNow, payCls, stOf, whenShort } from '@/lib/appointments.js';
import AppointmentDetailPanel from './AppointmentDetailPanel.jsx';
import RowChevron from '@/components/ui/RowChevron.jsx';
import { Ico } from './CalendarGrid.jsx';

// Appointments list (reference "AstroConnect – Astrologer Appointments", List mode): tabs, filters, sortable table,
// 6 rows per page; one row at a time opens its details in place. The chosen tab is kept in the shared store (apt.tab)
// so the My Work overview can open a specific tab.
const PER = 6;
const TABS = [
  ['today', 'Today', (a) => dateOfA(a) === TODAY_ISO],
  ['upcoming', 'Upcoming', (a) => minsFromNow(a) > 0 && isOpenStatus(a)],
  ['completed', 'Completed', (a) => a.status === 'Completed'],
  ['cancelled', 'Cancelled', (a) => a.status === 'Cancelled'],
  ['all', 'All', () => true],
];
const SORTS = [['date-asc', 'Date · earliest'], ['date-desc', 'Date · latest'], ['amt-desc', 'Amount · high to low'], ['amt-asc', 'Amount · low to high'], ['status', 'Status']];
const tabKey = (t) => (TABS.some(([k]) => k === t) ? t : t === 'history' ? 'all' : 'upcoming');

export default function AppointmentList({ apt, ui, expanded, setExpanded, onJoin, onCancel, onProfile }) {
  const tab = tabKey(apt.tab);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('all');
  const [dur, setDur] = useState('all');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [sort, setSort] = useState('date-asc');
  const [page, setPage] = useState(1);
  const reset = (fn) => (v) => { fn(v); setPage(1); setExpanded(null); };

  const test = TABS.find(([k]) => k === tab)[2];
  const qq = q.trim().toLowerCase();
  const rows = apt.list.filter(test)
    .filter((a) => !qq || `${a.id} ${a.user} ${a.uid}`.toLowerCase().includes(qq))
    .filter((a) => status === 'all' || a.status === status)
    .filter((a) => dur === 'all' || String(a.dur) === dur)
    .filter((a) => (!from || dateOfA(a) >= from) && (!to || dateOfA(a) <= to))
    .sort((x, y) => {
      if (sort === 'date-desc') return new Date(y.at) - new Date(x.at);
      if (sort === 'amt-desc') return y.amt - x.amt || new Date(x.at) - new Date(y.at);
      if (sort === 'amt-asc') return x.amt - y.amt || new Date(x.at) - new Date(y.at);
      if (sort === 'status') return stOf(x).order - stOf(y).order || new Date(x.at) - new Date(y.at);
      return new Date(x.at) - new Date(y.at);
    });
  const pages = Math.max(1, Math.ceil(rows.length / PER)), pg = Math.min(page, pages), slice = rows.slice((pg - 1) * PER, pg * PER);

  return (
    <section className="list">
      <div className="tabs" role="group" aria-label="Appointment sections">
        {TABS.map(([k, l, f]) => (
          <button key={k} type="button" className={'tab' + (tab === k ? ' on' : '')} aria-pressed={tab === k} onClick={() => { apt.setTab(k); setPage(1); setExpanded(null); }}>{l}<span className="tab-c">{apt.list.filter(f).length}</span></button>
        ))}
      </div>
      <div className="filters">
        <label className="fld srch"><span className="sr">Search</span><Ico n="search" /><input className="inp" type="search" placeholder="Search appointment ID or client" value={q} onChange={(e) => reset(setQ)(e.target.value)} /></label>
        <label className="fld">Status<select className="inp" value={status} onChange={(e) => reset(setStatus)(e.target.value)}><option value="all">All statuses</option>{Object.entries(STATUS).map(([k, s]) => <option key={k} value={k}>{s.label}</option>)}</select></label>
        <label className="fld">Duration<select className="inp" value={dur} onChange={(e) => reset(setDur)(e.target.value)}><option value="all">Any</option><option value="15">15 min</option><option value="30">30 min</option></select></label>
        <label className="fld">From<input className="inp" type="date" value={from} onChange={(e) => reset(setFrom)(e.target.value)} /></label>
        <label className="fld">To<input className="inp" type="date" value={to} onChange={(e) => reset(setTo)(e.target.value)} /></label>
        <label className="fld">Sort by<select className="inp" value={sort} onChange={(e) => reset(setSort)(e.target.value)}>{SORTS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></label>
        {/* Clear resets every filter and shows the complete list (All tab). */}
        <button type="button" className="btn btn-ghost" onClick={() => { setQ(''); setStatus('all'); setDur('all'); setFrom(''); setTo(''); setSort('date-asc'); setPage(1); setExpanded(null); apt.setTab('all'); }}>Clear</button>
      </div>
      <div className="tbl">
        <div className="tr th">
          <div className="td td-id">Appt ID</div><div className="td">Client</div><div className="td td-uid">User ID</div>
          <div className="td td-dt"><button type="button" onClick={() => reset(setSort)(sort === 'date-asc' ? 'date-desc' : 'date-asc')}>Date &amp; time <span>{sort === 'date-desc' ? '↓' : '↑'}</span></button></div>
          <div className="td td-dur">Duration</div><div className="td">Status</div><div className="td">Payment</div><div className="td"><span className="sr">Details</span></div>
        </div>
        {slice.map((a) => {
          const open = expanded === a.id, st = stOf(a);
          return (
            <Fragment key={a.id}>
              {/* The whole row toggles its details (same ▶/▼ RowChevron as Help & Support → Your Tickets). */}
              <div className={'tr row' + (open ? ' exp' : '')} role="button" tabIndex={0} aria-expanded={open} aria-label={`${open ? 'Collapse' : 'Expand'} details for ${a.id}`}
                onClick={() => setExpanded(open ? null : a.id)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpanded(open ? null : a.id); } }}>
                <div className="td td-id">{a.id}</div>
                <div className="td td-user"><span className="av">{initials(a.user)}</span><span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.user}</span></div>
                <div className="td td-uid td-mut">{a.uid}</div>
                <div className="td td-dt">{whenShort(a)}<span className="lbl-m td-mut"> · {a.dur} min</span></div>
                <div className="td td-dur">{a.dur} min</div>
                <div className="td td-st"><span className={'badge ' + st.b}>{st.label}</span></div>
                <div className="td td-pay"><strong>{inr(a.amt)}</strong> · <span className={payCls(a.pay)}>{a.pay}</span></div>
                <div className="td td-x"><RowChevron open={open} /></div>
              </div>
              {open && <div className="tr-det"><AppointmentDetailPanel a={a} apt={apt} ui={ui} onJoin={onJoin} onCancel={onCancel} onProfile={onProfile} /></div>}
            </Fragment>
          );
        })}
        {!rows.length && <div className="empty"><strong>No appointments match.</strong><div className="muted">Try another section or clear the filters.</div></div>}
      </div>
      <div className="pager">
        <span className="muted">{rows.length ? `Showing ${(pg - 1) * PER + 1}–${(pg - 1) * PER + slice.length} of ${rows.length}` : 'No results'}</span>
        {pages > 1 && (
          <div className="pages">
            <button type="button" className="apg" aria-label="Previous page" disabled={pg === 1} onClick={() => { setPage(pg - 1); setExpanded(null); }}><Ico n="left" s={14} /></button>
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => <button key={n} type="button" className={'apg' + (n === pg ? ' on' : '')} aria-current={n === pg ? 'page' : undefined} onClick={() => { setPage(n); setExpanded(null); }}>{n}</button>)}
            <button type="button" className="apg" aria-label="Next page" disabled={pg === pages} onClick={() => { setPage(pg + 1); setExpanded(null); }}><Ico n="right" s={14} /></button>
          </div>
        )}
      </div>
    </section>
  );
}
