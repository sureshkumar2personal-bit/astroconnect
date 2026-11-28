import { useEffect, useState } from 'react';
import { navigate, routes } from '@/lib/router.js';
import useAudience from '@/hooks/useAudience.js';
import { dateOfA, fmtDW, hm12, startOf, summary } from '@/lib/appointments.js';
import AppointmentList from '@/components/appointments/AppointmentList.jsx';
import AppointmentDetailPanel from '@/components/appointments/AppointmentDetailPanel.jsx';
import AppointmentCalendar from '@/components/appointments/AppointmentCalendar.jsx';
import CalendarGrid, { Ico } from '@/components/appointments/CalendarGrid.jsx';
import CallPanel from '@/components/appointments/CallPanel.jsx';
import { CancelModal, ProfileModal } from '@/components/appointments/AppointmentDialogs.jsx';

// My Work → Appointments (spec 05_APPOINTMENTS.md; reference "AstroConnect – Astrologer Appointments"). Routes:
//   #/work/appointments            Appointments: summary, Calendar (Day / Week / Month) or List, details, call
//   #/work/appointments/:id        the same screen with that appointment's details open
//   #/work/appointments/calendar   Calendar & Availability
// Opening an appointment's details puts a Confirmed booking Under Review (AD-89).
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const modeMem = { mode: 'calendar' };

function AppointmentsScreen({ apt, route, toast }) {
  const [mode, setModeS] = useState(modeMem.mode);
  const setMode = (m) => { modeMem.mode = m; setModeS(m); setExpanded(null); };
  const [drawer, setDrawer] = useState(route.id || null);
  const [expanded, setExpanded] = useState(null);
  const [cancelFor, setCancelFor] = useState(null);
  const [profileFor, setProfileFor] = useState(null);
  const [callId, setCallId] = useState(null);
  const { list: customers } = useAudience();
  const ui = { toast };

  useEffect(() => { setDrawer(route.id || null); }, [route.id]);
  const openId = drawer || expanded;
  useEffect(() => { if (openId && apt.byId(openId)) apt.open(openId); }, [openId]); // eslint-disable-line react-hooks/exhaustive-deps

  const closeDrawer = () => { setDrawer(null); if (route.id) navigate(routes.appointments); };
  useEffect(() => {
    if (!drawer && !cancelFor && !profileFor) return undefined;
    const prev = document.body.style.overflow; document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key !== 'Escape') return; if (cancelFor) setCancelFor(null); else if (profileFor) setProfileFor(null); else closeDrawer(); };
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; document.removeEventListener('keydown', onKey); };
  });

  const onJoin = (a) => {
    if (callId && callId !== a.id) { toast('Finish the current call first.'); return; }
    apt.startCall(a.id); setCallId(a.id); toast('Call connected (prototype — no real call is placed).');
  };
  const handlers = { onJoin, onCancel: (a) => setCancelFor(a.id), onProfile: (a) => setProfileFor(a.id) };
  const da = drawer ? apt.byId(drawer) : null;
  const ca = callId ? apt.byId(callId) : null;
  const cx = cancelFor ? apt.byId(cancelFor) : null;
  const pa = profileFor ? apt.byId(profileFor) : null;
  const profileData = (a) => {
    const c = customers.find((x) => x.uid === a.uid);
    const d = c?.since ? new Date(`${c.since}T00:00`) : null;
    const mine = apt.list.filter((x) => x.uid === a.uid);
    const done = mine.filter((x) => x.status === 'Completed').length;
    return { since: d ? `${MON[d.getMonth()]} ${d.getFullYear()}` : '—', lang: c?.lang || '—', count: `${mine.length} consultation${mine.length === 1 ? '' : 's'} · ${done} completed` };
  };

  return (
    <div className="aps">
      <div className="wrap">
        <div className="pagehead">
          <div />
          <div className="head-actions">
            <div className="seg" role="group" aria-label="View">
              <button type="button" className={mode === 'calendar' ? 'on' : ''} aria-pressed={mode === 'calendar'} onClick={() => setMode('calendar')}><Ico n="cal" />Calendar</button>
              <button type="button" className={mode === 'list' ? 'on' : ''} aria-pressed={mode === 'list'} onClick={() => setMode('list')}><Ico n="list" />List</button>
            </div>
            <button type="button" className="btn" onClick={() => navigate(routes.aptCalendar)}><Ico n="clock" />Manage availability</button>
          </div>
        </div>
        <section className="kpis" aria-label="Appointments summary">
          {summary(apt.list).map((k) => (
            <div key={k.label} className="kpi"><div className="kpi-l"><i style={{ background: k.color }} />{k.label}</div><div className={'kpi-v ' + (k.cls || '')}>{k.value}</div><div className={'kpi-s ' + (k.cls || '')}>{k.sub}</div></div>
          ))}
        </section>
        {mode === 'calendar'
          ? <CalendarGrid apt={apt} selId={drawer} onOpen={(id) => setDrawer(id)} srcLabel={`Availability from live schedule ${(apt.versions.find((v) => v.status === 'published') || {}).id || ''} · IST`} />
          : <AppointmentList apt={apt} ui={ui} expanded={expanded} setExpanded={setExpanded} {...handlers} />}
      </div>

      {da && (
        <div className="scrim scrim-r" onClick={(e) => e.target === e.currentTarget && closeDrawer()}>
          <aside className="drawer" role="dialog" aria-modal="true" aria-label="Appointment details">
            <div className="drawer-h"><span>Appointment details</span><button type="button" className="icon-btn" aria-label="Close details" onClick={closeDrawer}><Ico n="x" /></button></div>
            <div className="drawer-b"><AppointmentDetailPanel a={da} apt={apt} ui={ui} {...handlers} /></div>
          </aside>
        </div>
      )}
      {ca && <CallPanel key={ca.id} a={ca} ui={ui} onLog={(text) => apt.logEvent(ca.id, text)} onEnd={(r) => { apt.endCall(ca.id, r); setCallId(null); }} />}
      {cx && (
        <CancelModal a={cx} summary={`${cx.user} · ${fmtDW(dateOfA(cx))}, ${hm12(startOf(cx))} IST · ${cx.dur} min`} onKeep={() => setCancelFor(null)}
          onConfirm={(r) => { apt.cancel(cx.id, r); setCancelFor(null); toast(`${cx.id} cancelled. It stays visible in red on your calendar and in history.`); }} />
      )}
      {pa && <ProfileModal a={pa} {...profileData(pa)} onClose={() => setProfileFor(null)} />}
    </div>
  );
}

export default function AppointmentsPage({ apt, route, toast }) {
  if (route.calendar) return <AppointmentCalendar apt={apt} toast={toast} />;
  return <AppointmentsScreen apt={apt} route={route} toast={toast} />;
}

/** Header titles: the details open as a panel on the Appointments screen, so its title stays "Appointments". */
export function appointmentsTitle(route) {
  return route.calendar ? 'Calendar & Availability' : 'Appointments';
}

/** Neither screen shows a subtitle (descriptions under headings removed). */
export function appointmentsSubtitle() {
  return '';
}
