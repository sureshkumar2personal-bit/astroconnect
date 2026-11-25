import { useMemo } from 'react';
import { Grid, Seg } from '@/components/ui/sectionKit.jsx';
import RemedyCard from '@/components/remedies/RemedyCard.jsx';
import UploadPreview from '@/components/remedies/UploadPreview.jsx';
import useRemedies, { buildRemedies, filterRemedies, setRemedyFilter } from '@/hooks/useRemedies.js';
import { REMEDY_FILTERS } from '@/data/mockRemedies.js';

// Remedy Tracker (spec 17_REMEDY_TRACKER.md). Route: #/remedies
// Remedies from Text Question answers and Dispute Answers (AD-39) and every appointment
// attachment (AD-102, AD-163), each linked to the User and the original record.
// Only the User can mark one Completed (AD-22). No subscription, payment or delivery (REM-04).
// Back goes to the Home dashboard.
export const meta = () => ({ title: 'Remedy Tracker', parent: '/' });

export default function RemediesPage({ ctx, ui }) {
  const { filter } = useRemedies();
  const all = useMemo(() => buildRemedies(ctx.apt.list, ctx.tq.questions), [ctx.apt.list, ctx.tq.questions]);
  const list = filterRemedies(all, filter);
  const viewFile = (file) => ui.dialog({ title: 'User upload', body: (close) => <UploadPreview file={file} onClose={close} /> });

  return (
    <>
      <div className="row wrap">
        <Seg label="Filter remedies" options={REMEDY_FILTERS} value={filter} onChange={setRemedyFilter} />
      </div>
      {list.length ? (
        <Grid>{list.map((r) => <RemedyCard key={r.id} r={r} onViewFile={viewFile} />)}</Grid>
      ) : (
        <div className="empty">No remedies</div>
      )}

    </>
  );
}
