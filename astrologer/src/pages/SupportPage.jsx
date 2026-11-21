import useSupport, { findTicket } from '@/hooks/useSupport.js';
import SupportHome from '@/components/support/SupportHome.jsx';
import NewTicket from '@/components/support/NewTicket.jsx';
import TicketDetail from '@/components/support/TicketDetail.jsx';

// Help & Support (spec 16_HELP_AND_SUPPORT.md, AD-158 – AD-162). Routes:
//   #/support                          tickets, categories, which channel to use
//   #/support/new[/<category>[/<id>]]  new ticket (Audience links here with a user ID — AD-161)
//   #/support/t/<ticket id>            ticket detail
export function meta(route) {
  const [sub, a] = route.parts;
  if (sub === 't') {
    const t = findTicket(a);
    return { title: a || 'Ticket', subtitle: t?.cat, parent: '/support' };
  }
  if (sub === 'new') return { title: 'New support ticket', subtitle: 'Platform will reply in this ticket', parent: '/support' };
  return { title: 'Help & Support', subtitle: 'For issues you raise with the Platform' };
}

export default function SupportPage({ route, ui }) {
  const { tickets } = useSupport();
  const [sub, a, b] = route.parts;
  if (sub === 't') return <TicketDetail key={a} t={tickets.find((t) => t.id === a)} />;
  if (sub === 'new') return <NewTicket key={`${a}|${b}`} cat={a} refId={b} ui={ui} />;
  return <SupportHome tickets={tickets} />;
}
