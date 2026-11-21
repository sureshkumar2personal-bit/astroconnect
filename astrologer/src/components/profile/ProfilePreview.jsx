import { inr } from '@/lib/format.js';
import { CALL_CHAT_PACKAGES, TQ_FROM_PRICE } from '@/data/mockProfile.js';
import { fieldOf, publicValue } from '@/hooks/useProfile.js';

// Profile Preview (AD-86): the profile as users see it in the User App. Changes waiting for
// Platform Admin approval are not shown — users keep seeing the verified values (AD-87, PRF-06).
// During DND the profile is hidden from all users (AD-74, PRF-07).
const pk = (list) => list.map((p) => `${p.m}m ${inr(p.p)}`).join(' · ');

export default function ProfilePreview({ s, ctx }) {
  const v = (key, label) => publicValue(s, fieldOf(s, key, label));
  const p15 = ctx?.apt?.settings?.p15 ?? 300;
  const services = [
    ['Text Questions', `from ${inr(TQ_FROM_PRICE)}`],
    ['Appointment (voice)', `${inr(p15)} / 15 min`],
    ['Instant Call', pk(CALL_CHAT_PACKAGES.call)],
    ['Instant Chat', pk(CALL_CHAT_PACKAGES.chat)],
  ];
  return (
    <div className="preview pf-preview">
      <div className="row">
        <span className="av av-l pf-av" aria-hidden="true">A</span>
        <div className="grow">
          <b className="lg">{v('personal', 'Full Name')}</b>
          <div className="sm">{v('expertise', 'Astrology types')} · {v('professional', 'Years of Experience')} yrs</div>
          <div className="stars" aria-label="5 out of 5 stars">★★★★★</div>
        </div>
      </div>
      <p className="sm">{v('personal', 'About Me / Bio')}</p>
      <div className="row wrap">
        {v('expertise', 'Specializations').split(',').map((x) => x.trim()).filter(Boolean).map((x) => <span key={x} className="pill">{x}</span>)}
      </div>
      <b className="sm">Services</b>
      <div className="stack sm">
        {services.map(([l, price]) => <div key={l} className="row"><span className="grow">{l}</span><span>{price}</span></div>)}
      </div>
      {Object.keys(s.pending).length > 0 && <p className="muted sm">Pending changes are not shown until approved.</p>}
      {ctx?.availability?.dnd && <p className="warn-t sm">DND is on — your profile is hidden from all users.</p>}
    </div>
  );
}
