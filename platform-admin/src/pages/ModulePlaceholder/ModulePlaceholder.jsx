import Icon from '../../components/icons.jsx';
import { href } from '../../router/useHashRoute.js';
import './ModulePlaceholder.css';

// Destination for modules that are not built yet, and for unknown routes.
// It never pretends that a record or action exists.
export default function ModulePlaceholder({ route, path, reference }) {
  if (!route) {
    return (
      <section className="placeholder" aria-labelledby="ph-title">
        <h1 id="ph-title" className="placeholder__title">
          Page not found
        </h1>
        <p className="placeholder__text">
          There is no Platform Admin page at <code>{path}</code>.
        </p>
        <a className="placeholder__back" href={href('/dashboard')}>
          <Icon name="dashboard" size={18} />
          Back to Dashboard
        </a>
      </section>
    );
  }

  return (
    <section className="placeholder" aria-labelledby="ph-title">
      {route.group && <p className="placeholder__group">{route.group}</p>}
      <h1 id="ph-title" className="placeholder__title">
        {route.label}
      </h1>
      <p className="placeholder__text">
        This section is coming soon.
      </p>
      {reference && (
        <p className="placeholder__ref">
          Opened from the Dashboard for record <strong>{reference}</strong>.
        </p>
      )}
      <a className="placeholder__back" href={href('/dashboard')}>
        <Icon name="dashboard" size={18} />
        Back to Dashboard
      </a>
    </section>
  );
}
