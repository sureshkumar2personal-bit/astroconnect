import useReviews, { reviewsStore } from '@/hooks/useReviews.js';
import ReviewList from '@/components/reviews/ReviewList.jsx';
import ReviewDetail from '@/components/reviews/ReviewDetail.jsx';

// Ratings & Reviews (spec 10_RATINGS_AND_REVIEWS.md, AD-129 – AD-134). Routes:
//   #/reviews           ratings summary + review list
//   #/reviews/r/<id>    Review Details (AD-78)
const detailId = (route) => (route.parts[0] === 'r' ? route.parts[1] : null);

export function meta(route) {
  const id = detailId(route);
  if (id) {
    const r = reviewsStore.get().list.find((x) => x.id === id);
    return { title: `Review ${id}`, subtitle: r?.svc, parent: '/reviews' };
  }
  return { title: 'Ratings & Reviews', subtitle: 'A 1–5 star rating is mandatory after every service; written feedback is optional' };
}

export default function ReviewsPage({ route, ui, ctx }) {
  const s = useReviews();
  const id = detailId(route);
  if (id) return <ReviewDetail r={s.list.find((x) => x.id === id)} ui={ui} ctx={ctx} />;
  return <ReviewList s={s} />;
}
