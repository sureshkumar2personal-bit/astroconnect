import { Toggle } from '@/components/ui/sectionKit.jsx';
import { finalPrice, inr } from '@/lib/textQuestions.js';

// Optional discount for one question type (reference discUI; AD-56): on/off, a − / + selector
// (1–99 %, no default), original price, percentage and final payable price; "No Offer" when off.
export const stepDisc = (d, delta) => ({ ...d, pct: Math.max(1, Math.min(99, (d.pct || 0) + delta)) });

export default function Discount({ kind, disc, price, onChange }) {
  const fin = finalPrice(price || 0, disc);
  const name = kind === 'G' ? 'General' : 'Personal';
  return (
    <div className="disc">
      <div className="row wrap">
        <span className="grow sm">Discount (optional)</span>
        <Toggle on={disc.on} label={`Discount for ${name}`} onToggle={() => onChange({ on: !disc.on, pct: 0 })} />
      </div>
      {disc.on ? (
        <>
          <div className="row wrap">
            <button type="button" className="btn btn-o sm" aria-label={`Decrease ${name} discount`} onClick={() => onChange(stepDisc(disc, -1))}>−</button>
            <b className="disc-pct" aria-live="polite">{disc.pct ? `${disc.pct}%` : 'Select'}</b>
            <button type="button" className="btn btn-o sm" aria-label={`Increase ${name} discount`} onClick={() => onChange(stepDisc(disc, 1))}>+</button>
          </div>
          <div className="disc-break" aria-live="polite">
            <div><span>Original price</span><span>{inr(price || 0)}</span></div>
            <div><span>Discount ({disc.pct || 0}%)</span><span>− {inr((price || 0) - fin)}</span></div>
            <div className="fin"><span>Final price</span><b>{inr(fin)}</b></div>
          </div>
          <span className="muted sm">Maximum 99%. No default percentage.</span>
        </>
      ) : (
        <>
          <span className="muted sm">No Offer</span>
          {price > 0
            ? <div className="disc-break only"><div className="fin"><span>Final price</span><b>{inr(price)}</b></div></div>
            : <div className="disc-break hint">Enter a price to see the final amount</div>}
        </>
      )}
    </div>
  );
}
