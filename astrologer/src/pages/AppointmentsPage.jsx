import AppointmentList from '@/components/appointments/AppointmentList.jsx';
import AppointmentDetails from '@/components/appointments/AppointmentDetails.jsx';
import AppointmentCalendar from '@/components/appointments/AppointmentCalendar.jsx';
import { SUBTITLES } from '@/hooks/useAppointments.js';

// My Work → Appointments (spec 05_APPOINTMENTS.md). Routes:
//   #/work/appointments            list
//   #/work/appointments/:id        Appointment Details
//   #/work/appointments/calendar   Calendar & Availability
export default function AppointmentsPage({ apt, route, mobile, openDialog, toast }) {
  if (route.calendar) return <AppointmentCalendar apt={apt} mobile={mobile} openDialog={openDialog} toast={toast} />;
  if (route.id) return <AppointmentDetails apt={apt} id={route.id} mobile={mobile} openDialog={openDialog} toast={toast} />;
  return <AppointmentList apt={apt} mobile={mobile} openDialog={openDialog} toast={toast} />;
}

/** Header titles: desktop shows the page or appointment; mobile names the screen. */
export function appointmentsTitle(route, mobile) {
  if (route.calendar) return 'Calendar & Availability';
  if (route.id) return mobile ? 'Appointment Details' : route.id;
  return 'Appointments';
}

/** Desktop shows the subtitle in the header; the mobile header has no subtitle, so the screen shows it. */
export function appointmentsSubtitle(route) {
  if (route.calendar) return SUBTITLES.calendar;
  return route.id ? SUBTITLES.detail : SUBTITLES.list;
}
