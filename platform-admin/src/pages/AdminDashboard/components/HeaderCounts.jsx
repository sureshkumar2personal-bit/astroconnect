import { formatNumber } from '../../../components/charts/chartUtils.js';
import { href } from '../../../router/useHashRoute.js';

// Section A — Total Users / Astrologers / Assistants with online counts.
export default function HeaderCounts({ counts }) {
  return (
    <ul className="counts" aria-label="Platform accounts">
      {counts.map((c) => (
        <li key={c.key}>
          <a className="counts__item" href={href(c.path)}>
            <span className="counts__label">Total {c.label}</span>
            <span className="counts__row">
              <span className="counts__total">{formatNumber(c.total)}</span>
              <span className="counts__online">
                <span className="online-dot" aria-hidden="true" />
                {formatNumber(c.online)} online
              </span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
