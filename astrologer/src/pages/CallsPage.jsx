import { useEffect } from 'react';
import useCalls, { callsActions, callsStore } from '@/hooks/useCalls.js';
import CallsOverview from '@/components/calls/CallsOverview.jsx';
import ConsultationDetails from '@/components/calls/ConsultationDetails.jsx';
import { navigate } from '@/lib/router.js';

// Instant Call & Chat (spec 06_INSTANT_CALL_AND_CHAT.md, AD-103 – AD-111). Routes:
//   #/calls           Service Settings (availability & pricing, offers, waiting list, request history) · History
//   #/calls/c/:id     Consultation Details
//   #/calls/live      opens the active session's workspace (the session window lives in App)
// Availability (Online / Offline / DND, Call / Chat switches) is Home's state, shared via ctx.availability.
const detailId = (route) => (route.parts[0] === 'c' ? route.parts[1] : null);

export function meta(route) {
  if (route.parts[0] === 'live') {
    const c = callsStore.get().session;
    return { title: c ? `${c.s === 'call' ? 'Instant Call' : 'Instant Chat'} with ${c.user}` : 'Active consultation', subtitle: c ? `${c.uid} · ${c.pk.m}-minute package` : '', parent: '/calls' };
  }
  const id = detailId(route);
  if (id) {
    const x = callsStore.get().hist.find((h) => h.id === id);
    return { title: `Consultation ${id}`, subtitle: x?.svc, parent: '/calls' };
  }
  // Back goes to the Home dashboard.
  return { title: 'Instant Call & Chat', parent: '/' };
}

/** Old #/calls/live links: open the session workspace over the dashboard (or say there is none). */
function OpenSession() {
  const has = !!callsStore.get().session;
  useEffect(() => { if (has) { callsActions.setMode('expanded'); navigate('/'); } }, [has]);
  return has ? null : <div className="empty"><b>No active consultation</b><a className="go" href="#/calls">Instant Call &amp; Chat ›</a></div>;
}

export default function CallsPage({ route, ui, ctx }) {
  const st = useCalls();
  useEffect(() => { callsActions.setNotifier(ui.toast); }, [ui]);
  const id = detailId(route);
  return (
    <>
      {route.parts[0] === 'live' ? <OpenSession />
        : id ? <ConsultationDetails x={st.hist.find((h) => h.id === id)} />
          : <CallsOverview st={st} av={ctx.availability} ui={ui} />}
    </>
  );
}
