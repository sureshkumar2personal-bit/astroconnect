// Small shared pieces for My Work → Text-Based / Subscription Questions and Campaign Management
// (reference helpers qstat, typeB, prioB, qav, priceTxt, PH right-side buttons).
import { STATUS_KIND, finalPrice, inr, pendingDay, priority, statusLabel } from '@shared/lib/textQuestions.js';
import { Avatar, Badge, TypeBadge } from '@shared/components/ui.jsx';

export { Avatar, Badge, TypeBadge };

/** Question status badge; "New" reads "New / Received" (AD-51). */
export const QStatus = ({ status }) => <Badge kind={STATUS_KIND[status] || 'info'}>{statusLabel(status)}</Badge>;

/** Priority classification badge (AD-32, AD-33) — not a status. */
export function PrioBadge({ q }) {
  const p = priority(q);
  if (!p) return null;
  return <Badge kind={p === 1 ? 'bad' : 'warn'}>Priority {p} · Day {pendingDay(q)}</Badge>;
}

/** Original price, discount and final payable price, or "No Offer" (AD-56). */
export function PriceText({ price, disc }) {
  if (disc && disc.on && disc.pct) {
    return (
      <span className="price">
        <s className="muted">{inr(price)}</s> <b>{inr(finalPrice(price, disc))}</b> <Badge kind="ok">{disc.pct}% off</Badge>
      </span>
    );
  }
  return <span className="price"><b>{inr(price)}</b> <span className="muted sm">No Offer</span></span>;
}

/** Page-level actions (the reference page header's right-hand buttons) and, on phones, the subtitle. */
export function PageActions({ mobile, subtitle, children }) {
  if (!children && !(mobile && subtitle)) return null;
  return (
    <div className="row wrap ph-act">
      {mobile && subtitle ? <p className="muted grow ph-sub">{subtitle}</p> : <span className="grow" />}
      {children}
    </div>
  );
}

/** Desktop "‹ Back" button (reference backBtn); phones use the header back arrow. */
export const BackBtn = ({ mobile, onClick }) =>
  (mobile ? null : <button type="button" className="btn btn-o sm pg-back" onClick={onClick}>‹ Back</button>);
