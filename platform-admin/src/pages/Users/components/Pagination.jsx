import { useId } from 'react';
import Icon from '../../../components/icons.jsx';
import { formatNumber } from '../../../components/charts/chartUtils.js';

export const PAGE_SIZES = [10, 25, 50, 100];

/** Page numbers with ellipses: 1 … 4 5 6 … 20 */
function pageList(page, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, page - 1, page, page + 1]);
  if (page <= 3) [2, 3, 4].forEach((p) => pages.add(p));
  if (page >= total - 2) [total - 3, total - 2, total - 1].forEach((p) => pages.add(p));
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push(`gap-${p}`);
    out.push(p);
  });
  return out;
}

export default function Pagination({ page, pageSize, total, onPage, onPageSize, itemLabel = 'users', sizes = PAGE_SIZES }) {
  const uid = useId();
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const first = total ? (page - 1) * pageSize + 1 : 0;
  const last = Math.min(total, page * pageSize);

  return (
    <nav className="u-pager" aria-label={`${itemLabel[0].toUpperCase()}${itemLabel.slice(1)} pages`}>
      <p className="u-pager__info" aria-live="polite">
        Showing <strong>{formatNumber(first)}</strong>–<strong>{formatNumber(last)}</strong> of{' '}
        <strong>{formatNumber(total)}</strong> {itemLabel}
      </p>

      <div className="u-pager__size">
        <label htmlFor={`${uid}-size`}>Rows per page</label>
        <select
          id={`${uid}-size`}
          className="u-input u-select u-select--sm"
          value={pageSize}
          onChange={(e) => onPageSize(Number(e.target.value))}
        >
          {sizes.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      <div className="u-pager__pages">
        <button
          type="button"
          className="u-page u-page--nav"
          onClick={() => onPage(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
        >
          <Icon name="chevronLeft" size={16} />
          <span className="u-page__text">Previous</span>
        </button>
        <ul className="u-page-list">
          {pageList(page, pages).map((p) =>
            typeof p === 'string' ? (
              <li key={p} className="u-page-gap" aria-hidden="true">
                …
              </li>
            ) : (
              <li key={p}>
                <button
                  type="button"
                  className={`u-page${p === page ? ' is-current' : ''}`}
                  aria-current={p === page ? 'page' : undefined}
                  aria-label={`Page ${p}`}
                  onClick={() => onPage(p)}
                >
                  {formatNumber(p)}
                </button>
              </li>
            )
          )}
        </ul>
        <span className="u-page-compact">
          Page {formatNumber(page)} of {formatNumber(pages)}
        </span>
        <button
          type="button"
          className="u-page u-page--nav"
          onClick={() => onPage(page + 1)}
          disabled={page >= pages}
          aria-label="Next page"
        >
          <span className="u-page__text">Next</span>
          <Icon name="chevronRight" size={16} />
        </button>
      </div>
    </nav>
  );
}
