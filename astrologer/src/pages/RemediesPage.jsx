import useRemedies, { remedyStore, deriveAll } from '@/hooks/useRemedies.js';
import { Toast } from '@/components/remedies/rmShared.jsx';
import RemOverview from '@/components/remedies/RemOverview.jsx';
import RemMethods from '@/components/remedies/RemMethods.jsx';
import RemMethodForm from '@/components/remedies/RemMethodForm.jsx';
import RemAssignments from '@/components/remedies/RemAssignments.jsx';
import RemAssignmentDetail from '@/components/remedies/RemAssignmentDetail.jsx';
import RemAttention from '@/components/remedies/RemAttention.jsx';
import RemHistory from '@/components/remedies/RemHistory.jsx';
import RemHead from '@/components/remedies/RemHead.jsx';
import RemModals from '@/components/remedies/RemModals.jsx';

// Remedy Tracker (spec 17_REMEDY_TRACKER.md; reference "Remedy Tracker"). Route: #/remedies
//   #/remedies                      Overview            #/remedies/methods       Saved Methods
//   #/remedies/assignments          Assignments         #/remedies/attention     Needs Attention
//   #/remedies/history              History             #/remedies/form          create / customise / edit a method
//   #/remedies/remedy/<id>          one remedy's assignments
//   #/remedies/assignment/<id>      one assignment (timeline, final completion, notes, activity)
// Daily statuses and final completion are reported by the User (AD-22); remedies from Text Question
// answers and Appointments (AD-163, AD-39) are listed read-only on the Overview. Back goes to Home
// from a tab, and to the Remedy Tracker from a detail screen.
// One Back button only: the app header's. From a detail screen it returns to the screen you came from
// (the last entry of the Remedy Tracker navigation stack); from Saved Methods, History, Assignments and
// Needs Attention it returns to the Overview; from the Overview it returns to Home.
export const meta = (route) => {
  const p0 = route.parts[0];
  const from = remedyStore.get().stack.slice(-1)[0];
  const defaults = { remedy: '/remedies', assignment: '/remedies/assignments', form: '/remedies/methods' };
  const parent = p0 === 'remedy' || p0 === 'assignment' || p0 === 'form' ? (from || defaults[p0]) : p0 ? '/remedies' : '/';
  return { title: 'Remedy Tracker', parent };
};

export default function RemediesPage({ route, ctx, ui }) {
  const s = useRemedies();
  const d = deriveAll(s);
  const [p0, p1] = route.parts;
  let view;
  if (p0 === 'methods') view = <RemMethods s={s} d={d} />;
  else if (p0 === 'assignments') view = <RemAssignments s={s} d={d} />;
  else if (p0 === 'remedy') view = <RemAssignments s={s} d={d} remedyId={p1} />;
  else if (p0 === 'assignment') view = <RemAssignmentDetail s={s} d={d} id={p1} />;
  else if (p0 === 'attention') view = <RemAttention s={s} d={d} />;
  else if (p0 === 'history') view = <RemHistory s={s} d={d} />;
  else if (p0 === 'form') view = <RemMethodForm s={s} d={d} />;
  else view = <RemOverview s={s} d={d} ctx={ctx} ui={ui} />;
  return (
    <>
      <div className="rm"><div className="rm-cq">
        {(!p0 || p0 === 'methods' || p0 === 'history') && <RemHead d={d} s={s} active={p0 || ''} />}
        {view}
      </div></div>
      <div className="rm"><RemModals s={s} d={d} assignmentId={p0 === 'assignment' ? p1 : ''} /><Toast toast={s.toast} /></div>
    </>
  );
}
