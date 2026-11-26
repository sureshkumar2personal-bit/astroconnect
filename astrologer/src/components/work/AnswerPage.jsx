import { Sec } from '@/components/ui/sectionKit.jsx';
import { answerBy, daysLeft, fmtDate } from '@/lib/textQuestions.js';
import { Avatar, TypeBadge } from './bits.jsx';
import { AnswerPreviewCard } from './QDialogs.jsx';
import AnswerEditor from './AnswerEditor.jsx';

// Write Answer screen (reference TQSUB.answer): the shared answer editor beside a live preview.
export default function AnswerPage({ q, tq, onPreview, onAddLink, toast }) {
  return (
    <div className="split2">
      <Sec>
        <div className="row">
          <Avatar q={q} />
          <div className="grow"><b>{q.name}</b><div className="muted sm">Answer by {fmtDate(answerBy(q))} · {daysLeft(q)} days left</div></div>
          <TypeBadge type={q.type} />
        </div>
        <div className="note">{q.text}</div>
        <AnswerEditor q={q} tq={tq} onPreview={onPreview} onAddLink={onAddLink} toast={toast} />
      </Sec>
      <Sec title="Live preview">
        <div className="preview"><AnswerPreviewCard q={q} text={q.draft} /></div>
      </Sec>
    </div>
  );
}
