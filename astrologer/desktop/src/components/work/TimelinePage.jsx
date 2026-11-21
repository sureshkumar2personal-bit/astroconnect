import { Sec } from '../section/kit.jsx';
import { timelineEvents } from '@shared/lib/textQuestions.js';
import { routes } from '@shared/lib/router.js';
import { Avatar, QStatus } from './bits.jsx';

// Question Timeline (reference TQSUB.timeline; AD-50).
export default function TimelinePage({ q, campaignName }) {
  return (
    <Sec>
      <div className="row">
        <Avatar q={q} />
        <div className="grow"><b>{q.name}</b><div className="muted sm">{campaignName}</div></div>
        <QStatus status={q.status} />
      </div>
      <ol className="tl">
        {timelineEvents(q).map(([title, detail, kind], i) => (
          <li key={i} className={kind || undefined}><b>{title}</b><span className="muted sm">{detail}</span></li>
        ))}
      </ol>
      <a className="btn btn-o tl-open" href={`#${routes.detail(q.id)}`}>Open question</a>
    </Sec>
  );
}
