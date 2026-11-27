import ServiceOverview from '@/components/services/ServiceOverview.jsx';
import TextService from '@/components/services/TextService.jsx';
import AppointmentService from '@/components/services/AppointmentService.jsx';
import RateService from '@/components/services/RateService.jsx';
import LiveService from '@/components/services/LiveService.jsx';

// Service Management (reference "Astrologer Portal: Service Management"). Routes:
//   #/services                 overview
//   #/services/text | appointments | call | chat | live
const TITLES = { text: 'Text-Based Questions', appointments: 'Appointments', call: 'Instant Call', chat: 'Instant Chat', live: 'Live Sessions' };

export function meta(route) {
  const k = route.parts[0];
  if (TITLES[k]) return { title: 'Service Management', parent: '/services' };
  return { title: 'Service Management', parent: '/' };
}

export default function ServiceManagementPage({ route, ui }) {
  const k = route.parts[0];
  if (k === 'text') return <TextService ui={ui} />;
  if (k === 'appointments') return <AppointmentService />;
  if (k === 'call' || k === 'chat') return <RateService key={k} kind={k} />;
  if (k === 'live') return <LiveService />;
  return <ServiceOverview />;
}
