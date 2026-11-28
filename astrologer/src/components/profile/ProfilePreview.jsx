import Icon from '@/components/ui/Icon.jsx';
import { inr } from '@/lib/format.js';
import { CALL_CHAT_PACKAGES, TQ_FROM_PRICE } from '@/data/mockProfile.js';
import { fieldOf, publicValue } from '@/hooks/useProfile.js';
import { availabilityChip, initials } from './ProfileOverview.jsx';

// Profile Preview (AD-86): the profile as users see it in the User App (reference "Profile Preview ·
// User App view"). Changes waiting for Platform Admin approval are not shown — users keep seeing the
// verified values (AD-87, PRF-06). During DND the profile is hidden from all users (AD-74, PRF-07).
// The Chat / Book buttons are shown as in the User App but do nothing here.
const EMPTY = '—';
const list = (v) => (!v || v === EMPTY ? [] : v.split(',').map((x) => x.trim()).filter(Boolean));
const pk = (packages) => packages.map((p) => `${p.m}m ${inr(p.p)}`).join(' · ');

function ChipRow({ label, items, last }) {
  return (
    <div className={`pv-group${last ? ' pv-group--last' : ''}`}>
      <div className="pv-label">{label}</div>
      {items.length ? <div className="pf-chips">{items.map((t) => <span key={t} className="pf-chip">{t}</span>)}</div> : <span className="muted sm">Not added</span>}
    </div>
  );
}

export default function ProfilePreview({ s, ctx }) {
  const v = (key, label) => publicValue(s, fieldOf(s, key, label));
  const a = ctx?.availability;
  const name = v('personal', 'Full Name');
  const first = name.split(/\s+/)[0];
  const years = v('professional', 'Years of Experience');
  const langs = v('expertise', 'Consultation languages');
  const types = list(v('expertise', 'Astrology types'));
  const bio = v('personal', 'About Me / Bio');
  const chip = availabilityChip(a, 'Online now');
  const p15 = ctx?.apt?.settings?.p15 ?? 300;
  const live = (sw) => !!a?.[sw] && a?.mode === 'online' && !a?.dnd;
  const services = [
    { name: 'Text Questions', price: `from ${inr(TQ_FROM_PRICE)}` },
    { name: 'Appointment (voice)', price: `${inr(p15)} / 15 min` },
    { name: 'Instant Call', price: pk(CALL_CHAT_PACKAGES.call), on: live('call') },
    { name: 'Instant Chat', price: pk(CALL_CHAT_PACKAGES.chat), on: live('chat') },
  ];
  const quals = [['Education', v('professional', 'Education')], ['Certification', v('professional', 'Certifications')]];

  return (
    <div className="pfx pv">
      <div className="pv-bar">
        <Icon name="eye" size={17} />
        <span><b>Profile preview</b> · This is how User App visitors see your profile.</span>
      </div>
      {Object.keys(s.pending).length > 0 && <p className="pf-note"><Icon name="info" size={16} /><span>Pending changes are not shown until approved.</span></p>}
      {a?.dnd && <p className="pf-note pf-note--warn"><Icon name="alert" size={16} /><span>DND is on — your profile is hidden from all users.</span></p>}

      <section className="pf-card pv-top" aria-label="Astrologer summary">
        <span className="pf-av pf-av--lg" role="img" aria-label={`Photo of ${name}`}>{initials(name)}</span>
        <div className="pv-top__id">
          <div className="pv-top__name">
            <h2 className="pf-name pf-name--lg">{name}</h2>
            {s.verified && <span className="pf-pill pf-pill--gold"><Icon name="checkCircle" size={14} stroke={2} />Verified</span>}
            {chip && <span className={`pf-pill pf-pill--${chip.kind}`}><span className="pf-pill__dot" aria-hidden="true" />{chip.text}</span>}
          </div>
          {types.length > 0 && <div className="pv-types">{types.join(' · ')}</div>}
          <div className="pv-facts">
            {years && years !== EMPTY && <span><b>{/^\d+$/.test(years.trim()) ? `${years.trim()} years` : years}</b> experience</span>}
            {langs && langs !== EMPTY && <span>Speaks <b>{langs}</b></span>}
          </div>
        </div>
        <div className="pv-cta">
          <button type="button" className="btn pf-btn-p" aria-disabled="true" title="Shown as in the User App">Chat now</button>
          <button type="button" className="btn btn-o" aria-disabled="true" title="Shown as in the User App">Book an appointment</button>
        </div>
      </section>

      <div className="pv-cols">
        <section className="pf-card pv-main" aria-labelledby="pv-exp">
          {bio && bio !== EMPTY && (
            <>
              <h2 className="pv-h">About</h2>
              <p className="pv-bio">{bio}</p>
            </>
          )}
          <h2 id="pv-exp" className="pv-h">Expertise</h2>
          <ChipRow label="Astrology types" items={types} />
          <ChipRow label="Specializations" items={list(v('expertise', 'Specializations'))} />
          <ChipRow label="Expertise areas" items={list(v('expertise', 'Expertise areas'))} last />
          <h2 className="pv-h pv-h--gap">Qualifications</h2>
          {quals.map(([l, val], i) => (
            <div key={l} className={`pv-q${i === quals.length - 1 ? ' pv-q--last' : ''}`}><span className="muted">{l}</span><b>{val && val !== EMPTY ? val : '—'}</b></div>
          ))}
        </section>

        <section className="pf-card pv-side" aria-labelledby="pv-svc">
          <h2 id="pv-svc" className="pv-h">Consult with {first}</h2>
          {services.map((x) => (
            <div key={x.name} className="pv-svc">
              <div className="pv-svc__t">
                <b className={x.on === false ? 'muted' : ''}>{x.name}</b>
                {x.on !== undefined && <span className={`pv-avail${x.on ? ' on' : ''}`}>{x.on ? 'Available' : 'Unavailable'}</span>}
              </div>
              <span className="muted sm">{x.price}</span>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
