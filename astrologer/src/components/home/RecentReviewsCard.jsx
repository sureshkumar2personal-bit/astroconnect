import Card from '@/components/ui/Card.jsx';
import Icon from '@/components/ui/Icon.jsx';
import useReviews, { publishedOnly } from '@/hooks/useReviews.js';
import { fmtDate } from '@/lib/format.js';

const Stars = ({ n }) => (
  <span className="ac-rev__stars" role="img" aria-label={`${n} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((i) => <span key={i} className={i <= n ? 'is-on' : ''} aria-hidden="true">★</span>)}
  </span>
);

// The three latest published reviews (what users can see; AD-131). Each opens Review Details;
// View all opens Ratings & Reviews.
export default function RecentReviewsCard() {
  const { list } = useReviews();
  const latest = [...publishedOnly(list)].sort((a, b) => (a.at < b.at ? 1 : -1)).slice(0, 3);
  return (
    <Card id="h-rev" icon="star" title="Recent Reviews" className="ac-reviews" headClass="ac-card__head--tile"
      extra={<a href="#/reviews" className="ac-viewall">View all<Icon name="chevronRight" size={16} stroke={2.2} /></a>}
    >
      {latest.length ? (
        <div className="ac-rev">
          {latest.map((r) => (
            <a key={r.id} href={`#/reviews/r/${r.id}`} className="ac-rev__item">
              <span className="ac-rev__av" aria-hidden="true">{r.user.charAt(0)}</span>
              <span className="ac-rev__body">
                <span className="ac-rev__head"><b>{r.user}</b><Stars n={r.stars} /></span>
                <span className={`ac-rev__text${r.text ? '' : ' is-empty'}`}>{r.text || `Rated ${r.stars} stars — no written review.`}</span>
                <span className="ac-rev__meta">{r.svc} · {fmtDate(r.at).replace(/ \d{4}$/, '')}</span>
              </span>
            </a>
          ))}
        </div>
      ) : <p className="ac-card__caption">No published reviews yet.</p>}
    </Card>
  );
}
