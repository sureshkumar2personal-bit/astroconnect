/**
 * Row expand / collapse button used by every expandable row in the app (reference design): a small
 * rounded-square champagne button with a dark solid triangle — ▶ when collapsed, ▼ when expanded (the
 * triangle turns smoothly). Decorative: the row itself is the click / keyboard target, so clicking the
 * button or anywhere on its row toggles the row.
 */
export default function RowChevron({ open = false, className = '' }) {
  return (
    <span className={`row-chev${open ? ' is-open' : ''}${className ? ` ${className}` : ''}`} aria-hidden="true">
      <svg width="10" height="10" viewBox="0 0 10 10" focusable="false"><path d="M2.5 1.2 8.6 5 2.5 8.8z" fill="currentColor" /></svg>
    </span>
  );
}
