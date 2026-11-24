import { fmtDateTime, dt } from '@/lib/format.js';
import { reviewsActions, statusKind } from '@/hooks/useReviews.js';
import { Badge, Empty, Note, Stars } from '@/components/ui/sectionKit.jsx';
import ReviewReply from './ReviewReply.jsx';

// Review Details (AD-78): rating, written feedback, service reference, Publish / Hide (AD-130,
// AD-131), any Platform Admin action with its reason (AD-133) and the reply section.

/** Link to the service the review is about; plain text when that record isn't in the prototype data. */
function ServiceRef({ id, tq }) {
  let href = null;
  if (id.startsWith('APT')) href = `/work/appointments/${id}`;
  else if (id.startsWith('CON')) href = `/calls/c/${id}`;
  else if (id.startsWith('TQ') && tq?.byId?.(id)) href = `/work/questions/${id}`;
  return href ? <a href={`#${href}`}>{id}</a> : <span>{id}</span>;
}

/** A review's full details and actions, shown inside its expanded row on Ratings & Reviews. */
export function ReviewInfo({ r, ui, ctx }) {
  const setSt = (st) => { reviewsActions.setStatus(r.id, st); ui.toast(`Review ${st.toLowerCase()}`); };
  return (
    <>
      <div className="row wrap rv-info__head">
        <b className="grow">{r.user}</b>
        <Stars n={r.stars} />
        <Badge kind={statusKind(r.st)}>{r.st}</Badge>
      </div>
      <p className="rv-info__text">{r.text || <span className="muted">No written feedback</span>}</p>
      <span className="muted sm">{fmtDateTime(dt(r.at))} · <ServiceRef id={r.ref} tq={ctx?.tq} /></span>
      {r.admin && <Note tone="bad">{r.admin}</Note>}
      <div className="btn-row">
        {r.st !== 'Published' && <button type="button" className="btn btn-p" onClick={() => setSt('Published')}>Publish</button>}
        {r.st !== 'Hidden' && <button type="button" className="btn btn-o" onClick={() => setSt('Hidden')}>Hide</button>}
      </div>
      <ReviewReply key={r.id} r={r} ui={ui} />
    </>
  );
}

// Full page (#/reviews/r/<id>), kept for direct links (e.g. Home's Recent Reviews).
export default function ReviewDetail({ r, ui, ctx }) {
  if (!r) return <Empty title="Review not found">It may have been removed. Go back to Ratings &amp; Reviews.</Empty>;
  const setSt = (st) => { reviewsActions.setStatus(r.id, st); ui.toast(`Review ${st.toLowerCase()}`); };

  return (
    <>
      <section className="card sec">
        <div className="row wrap">
          <b className="lg grow">{r.user}</b>
          <Stars n={r.stars} />
          <Badge kind={statusKind(r.st)}>{r.st}</Badge>
        </div>
        <p>{r.text || <span className="muted">No written feedback</span>}</p>
        <span className="muted sm">{fmtDateTime(dt(r.at))} · <ServiceRef id={r.ref} tq={ctx?.tq} /></span>
        {r.admin && <Note tone="bad">{r.admin}</Note>}
        <div className="btn-row">
          {r.st !== 'Published' && <button type="button" className="btn btn-p" onClick={() => setSt('Published')}>Publish</button>}
          {r.st !== 'Hidden' && <button type="button" className="btn btn-o" onClick={() => setSt('Hidden')}>Hide</button>}
        </div>
      </section>
      <ReviewReply key={r.id} r={r} ui={ui} />
    </>
  );
}
