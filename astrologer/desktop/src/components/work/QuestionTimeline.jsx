import { timelineEvents } from '@shared/lib/textQuestions.js';
import { Avatar, StatusBadge } from '@shared/components/ui.jsx';

export default function QuestionTimeline({ q, campaignName }) {
  return (
    <>
      <div className="row">
        <Avatar q={q} />
        <div className="grow"><b>{q.id}</b><div className="muted sm">{q.name} · {campaignName}</div></div>
        <StatusBadge status={q.status} />
      </div>
      <ol className="tl">
        {timelineEvents(q).map(([title, detail, kind], i) => (
          <li key={i} className={kind}><b>{title}</b><span className="muted sm">{detail}</span></li>
        ))}
      </ol>
    </>
  );
}
