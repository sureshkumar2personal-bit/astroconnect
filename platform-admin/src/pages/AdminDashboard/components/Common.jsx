import Icon from '../../../components/icons.jsx';
import { href } from '../../../router/useHashRoute.js';

/** Small status / note label. tone: neutral | gold | danger | success | pending */
export function Tag({ tone = 'neutral', children, title }) {
  return (
    <span className={`tag tag--${tone}`} title={title}>
      {children}
    </span>
  );
}

/** Tag for a value whose definition is still pending a product decision. */
export function PendingTag({ id, children = 'Pending decision' }) {
  return (
    <Tag tone="pending" title={`Not finalized — see ${id} in the Platform Admin review list`}>
      {children} · {id}
    </Tag>
  );
}

export function SectionHeading({ id, title, meta }) {
  return (
    <div className="section-head">
      <h2 id={id} className="section-head__title">
        {title}
      </h2>
      {meta && <div className="section-head__meta">{meta}</div>}
    </div>
  );
}

/** Text link with an arrow that opens a module route. */
export function ModuleLink({ path, reference, children, className = '' }) {
  return (
    <a className={`module-link ${className}`} href={href(path, reference)}>
      {children}
      <Icon name="arrowRight" size={15} />
    </a>
  );
}

export function EmptyNote({ children }) {
  return <p className="empty-note">{children}</p>;
}
