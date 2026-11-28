import { href } from '../../../router/useHashRoute.js';
import { EmptyNote } from './Common.jsx';

// Section F — last 5–10 activities. No "View All" link (03 §8).
export default function ActivityList({ items }) {
  if (!items.length) return <EmptyNote>No activity recorded today.</EmptyNote>;
  return (
    <ol className="activity">
      {items.map((a) => (
        <li key={a.id}>
          <a className="activity__item" href={href(a.path, a.ref)}>
            <time className="activity__time">{a.time}</time>
            <span className="activity__body">
              <span className="activity__desc">{a.description}</span>
              <span className="activity__actor">{a.actor}</span>
            </span>
            <span className="activity__cat">{a.category}</span>
          </a>
        </li>
      ))}
    </ol>
  );
}
