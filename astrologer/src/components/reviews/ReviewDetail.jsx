import { fmtDateTime, dt } from '@/lib/format.js';
import { reviewsActions, statusKind } from '@/hooks/useReviews.js';
import { Badge, Empty, Note, Stars } from '@/components/ui/sectionKit.jsx';
import ReviewReply from './ReviewReply.jsx';

// Review Details (AD-78): rating, written feedback, service reference, Publish / Hide (AD-130,
// AD-131), any Platform Admin action with its reason (AD-133) and the reply section.

/** Link to the service the review is about; plain text when that record isn't in the prototype data. */
function ServiceRef({ id, tq }) {
  if (!id) return null;
  let href = null;
  if (id.startsWith('APT')) href = `/work/appointments/${id}`;
  else if (id.startsWith('CON')) href = `/calls/c/${id}`;
  else if (id.startsWith('TQ') && tq?.byId?.(id)) href = `/work/questions/${id}`;
  return href ? <a href={`#${href}`}>{id}</a> : <span>{id}</span>;
}

/**
 * A review's full details and actions — compact two columns: feedback, any Platform Admin note and the
 * reply on the left; the review details with Publish / Hide on the right (one column on phones).
 * Shown inside its expanded row on Ratings & Reviews and on the Review Details page.
 */
export function ReviewInfo({ r, ui, ctx }) {
  const setSt = (st) => { reviewsActions.setStatus(r.id, st); ui.toast(`Review ${st.toLowerCase()}`); };
  return (
    <div className="rr-x">
      <div className="rr-x__main">
        <div className="rr-x__sec">
          <span className="rr-x__lbl">Customer feedback</span>
          <p className="rr-x__text">{r.text || <span className="muted">No written feedback</span>}</p>
        </div>
        {r.admin && <Note tone="bad">{r.admin}</Note>}
        <ReviewReply key={r.id} r={r} ui={ui} />
      </div>
      <div className="rr-x__side">
        <span className="rr-x__lbl">Review details</span>
        <dl className="rr-x__dl">
          <dt>Review ID</dt><dd>{r.id}</dd>
          <dt>Customer</dt><dd>{r.user}</dd>
          <dt>Submitted</dt><dd>{fmtDateTime(dt(r.at))}</dd>
          <dt>Service</dt><dd>{r.svc}{r.ref && <> · <ServiceRef id={r.ref} tq={ctx?.tq} /></>}</dd>
          <dt>Rating</dt><dd><Stars n={r.stars} /> <span className="rr-x__n">{r.stars} / 5</span></dd>
          <dt>Status</dt><dd><Badge kind={statusKind(r.st)}>{r.st}</Badge></dd>
        </dl>
        <div className="rr-x__acts">
          {r.st !== 'Published' && <button type="button" className="btn btn-p sm" onClick={() => setSt('Published')}>Publish</button>}
          {r.st !== 'Hidden' && <button type="button" className="btn btn-o sm" onClick={() => setSt('Hidden')}>Hide</button>}
        </div>
      </div>
    </div>
  );
}

// Full page (#/reviews/r/<id>), kept for direct links (e.g. Home's Recent Reviews).
export default function ReviewDetail({ r, ui, ctx }) {
  if (!r) return <Empty title="Review not found">It may have been removed. Go back to Ratings &amp; Reviews.</Empty>;
  return (
    <div className="rr">
      <section className="rr-card rr-page">
        <div className="rr-page__head"><b>{r.user}</b><Stars n={r.stars} /><Badge kind={statusKind(r.st)}>{r.st}</Badge></div>
        <ReviewInfo r={r} ui={ui} ctx={ctx} />
      </section>
    </div>
  );
}
