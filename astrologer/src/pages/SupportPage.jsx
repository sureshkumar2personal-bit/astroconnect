import { useEffect, useState } from 'react';
import { navigate } from '@/lib/router.js';
import useSupport from '@/hooks/useSupport.js';
import useCalls from '@/hooks/useCalls.js';
import useEarnings from '@/hooks/useEarnings.js';
import useReviews from '@/hooks/useReviews.js';
import useAudience from '@/hooks/useAudience.js';
import useLive from '@/hooks/useLive.js';
import useContent from '@/hooks/useContent.js';
import SupportHome from '@/components/support/SupportHome.jsx';
import NewTicket from '@/components/support/NewTicket.jsx';
import TicketDetail from '@/components/support/TicketDetail.jsx';

// Help & Support (spec 16_HELP_AND_SUPPORT.md, AD-158 – AD-162), laid out as the reference "Help & Support".
// Routes (unchanged):
//   #/support                          tickets, categories, which channel to use
//   #/support/new[/<category>[/<id>]]  the page with the New Ticket popup open (Audience links here with a
//                                      user ID to pre-fill a block request — AD-161)
//   #/support/t/<ticket id>            the page with that ticket's conversation open
export function meta(route) {
  // Back goes to the Home dashboard (from a popup / conversation route: to Help & Support).
  return { title: 'Help & Support', parent: route.parts[0] ? '/support' : '/' };
}

const fromRoute = (parts) => {
  const [sub, a, b] = parts;
  if (sub === 'new') return { modal: { cat: a || '', ref: b || '' }, drawer: null };
  if (sub === 't' && a) return { modal: null, drawer: { id: a, focus: false } };
  return { modal: null, drawer: null };
};

export default function SupportPage({ route, ui, ctx }) {
  const { tickets } = useSupport();
  const { hist } = useCalls();
  const { wd, tx } = useEarnings();
  const { list: reviews } = useReviews();
  const { list: customers } = useAudience();
  const { past } = useLive();
  const { posts } = useContent();
  const refs = { questions: ctx.tq.questions, campaigns: ctx.tq.campaigns || [], apts: ctx.apt.list, hist, wd, tx, reviews, customers, past, posts };

  const [view, setView] = useState(() => fromRoute(route.parts));
  const [focusId, setFocusId] = useState(null);
  const key = route.parts.join('/');
  useEffect(() => { setView(fromRoute(route.parts)); }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  // While a popup or the conversation is open the page behind does not scroll; Escape closes it.
  const overlay = !!(view.modal || view.drawer);
  useEffect(() => {
    if (!overlay) return undefined;
    const prev = document.body.style.overflow; document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; document.removeEventListener('keydown', onKey); };
  }); // eslint-disable-line react-hooks/exhaustive-deps

  function close() {
    setView({ modal: null, drawer: null });
    if (route.parts.length) navigate('/support');
  }
  const openTicket = (id, focus) => setView({ modal: null, drawer: { id, focus } });

  return (
    <>
      <SupportHome tickets={tickets} ui={ui} focusId={focusId} onNew={() => setView({ modal: { cat: '', ref: '' }, drawer: null })} onOpen={openTicket} />
      {view.modal && (
        <div className="spx">
          <NewTicket init={view.modal} refs={refs} ui={ui} onClose={close}
            onView={(id) => { setFocusId(id); openTicket(id, false); }} />
        </div>
      )}
      {view.drawer && (
        <div className="spx">
          <TicketDetail key={view.drawer.id} t={tickets.find((t) => t.id === view.drawer.id)} ui={ui} focusReply={view.drawer.focus} onClose={close} />
        </div>
      )}
    </>
  );
}
