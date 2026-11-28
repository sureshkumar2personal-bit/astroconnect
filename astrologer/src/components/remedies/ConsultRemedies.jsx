import { useMemo } from 'react';
import { Seg } from '@/components/ui/sectionKit.jsx';
import RemedyCard from './RemedyCard.jsx';
import UploadPreview from './UploadPreview.jsx';
import useConsultRemedies, { buildRemedies, filterRemedies, setRemedyFilter } from '@/hooks/useConsultRemedies.js';
import { REMEDY_FILTERS } from '@/data/mockRemedies.js';

// Remedies from consultations (spec 17, AD-163, AD-39, AD-22): remedies prescribed in Text Question
// answers and Dispute Answers, and every appointment attachment — read live from those modules,
// each linked to the User and the original record. Only the User marks one Completed (AD-22).
export default function ConsultRemedies({ ctx, ui }) {
  const { filter } = useConsultRemedies();
  const all = useMemo(() => buildRemedies(ctx.apt.list, ctx.tq.questions), [ctx.apt.list, ctx.tq.questions]);
  const list = filterRemedies(all, filter);
  const viewFile = (file) => ui.dialog({ title: 'User upload', body: (close) => <UploadPreview file={file} onClose={close} /> });
  return (
    <section className="rm-panel rm-consult" aria-label="Remedies from consultations">
      <div className="rm-sech">
        <div><p className="rm-ptitle">Remedies from consultations</p><div className="rm-muted rm-sm">Prescribed in Text Question answers and Appointments. The User marks these completed.</div></div>
        <Seg label="Filter remedies" options={REMEDY_FILTERS} value={filter} onChange={setRemedyFilter} />
      </div>
      {list.length
        ? <div className="rm-consult-grid">{list.map((r) => <RemedyCard key={r.id} r={r} onViewFile={viewFile} />)}</div>
        : <div className="rm-empty">No remedies</div>}
    </section>
  );
}
