import { inr2 } from '@shared/lib/format.js';
import { offerRows } from '@shared/hooks/useEarnings.js';
import { DISCOUNT_EXAMPLE } from '@shared/data/mockEarnings.js';
import { PendingTag, Sec, Table } from '../section/kit.jsx';

// Offer performance (AD-128) and how discounts affect earnings (AD-127). Reference "09 Offers".
// Text Question commission is not decided (AP-08-02), so commission and net stay pending.
export default function OfferPerformance({ campaigns }) {
  const rows = offerRows(campaigns);
  return (
    <>
      <Sec title="How discounts affect earnings">
        <p className="sm">You bear the discount. Commission is charged on the amount the user actually pays, at the finalised rate for that service.</p>
        <Table bare cols={['Item', 'Value']} rows={DISCOUNT_EXAMPLE.map(([k, v]) => ({ key: k, cells: [k, v] }))} />
        <p className="muted sm">10% is only an example rate.</p>
      </Sec>
      <Sec title="November 2026 offers">
        <Table bare
          cols={['Offer', 'Discount', 'Original revenue', 'Discount amount', 'Collected', 'Commission', 'Net', 'Purchased']}
          rows={rows.map((o) => ({
            key: o.name,
            cells: [o.name, `${o.pct}%`, inr2(o.orig), inr2(o.disc), inr2(o.coll), <PendingTag id="AP-08-02" />, '—', o.sold],
          }))} />
        <p className="muted sm">Offer usage and month-wise performance; Text Question commission rate is pending, so net isn't shown yet.</p>
      </Sec>
    </>
  );
}
