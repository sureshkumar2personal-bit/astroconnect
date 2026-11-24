import { useEffect } from 'react';
import useCalls, { callsActions, callsStore } from '@/hooks/useCalls.js';
import CallsOverview from '@/components/calls/CallsOverview.jsx';
import ConsultationDetails from '@/components/calls/ConsultationDetails.jsx';
import RequestPopup from '@/components/calls/RequestPopup.jsx';

// Instant Call & Chat (spec 06_INSTANT_CALL_AND_CHAT.md, AD-103 – AD-111). Routes:
//   #/calls           availability, live status, packages, Call / Chat History
//   #/calls/c/:id     Consultation Details
// Availability (Online / Offline / DND, Call / Chat switches) is Home's state, shared via ctx.availability.
const detailId = (route) => (route.parts[0] === 'c' ? route.parts[1] : null);

export function meta(route) {
  const id = detailId(route);
  if (id) {
    const x = callsStore.get().hist.find((h) => h.id === id);
    return { title: `Consultation ${id}`, subtitle: x?.svc, parent: '/calls' };
  }
  // Back goes to the Home dashboard.
  return { title: 'Instant Call & Chat', parent: '/' };
}

export default function CallsPage({ route, ui, ctx }) {
  const st = useCalls();
  useEffect(() => { callsActions.setNotifier(ui.toast); }, [ui]);
  const id = detailId(route);
  return (
    <>
      {id
        ? <ConsultationDetails x={st.hist.find((h) => h.id === id)} />
        : <CallsOverview st={st} av={ctx.availability} ui={ui} />}
      {st.req && <RequestPopup key={`${st.req.s}-${st.req.user}`} req={st.req} />}
    </>
  );
}
