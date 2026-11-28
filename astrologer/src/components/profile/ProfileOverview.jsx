import { useEffect, useState } from 'react';
import Icon from '@/components/ui/Icon.jsx';
import { navigate } from '@/lib/router.js';
import { secondaryNav } from '@/data/mockHome.js';
import { completion } from '@/hooks/useProfile.js';
import { PendingTag } from '@/components/ui/sectionKit.jsx';
import ProfileTabs, { lastTab, stepOf, tabOf } from './ProfileTabs.jsx';
import ProfileEdit, { clearDrafts } from './ProfileEdit.jsx';
import VerificationCard from './VerificationCard.jsx';

// My Profile (reference "AstroConnect – Astrologer My Profile"), themed Royal Burgundy + Champagne Gold.
// Header (identity, completion — AD-86, Profile Preview), six horizontal section tabs (AD-79 – AD-85)
// and one card for the chosen section. Editing happens in the same card (ProfileEdit).
// Phones also list the "More" pages here, as in the mobile reference (placement: AP-GL-02).
const EMPTY = '—';
const isEmpty = (v) => !v || v.trim() === '' || v === EMPTY;
const list = (v) => (isEmpty(v) ? [] : v.split(',').map((x) => x.trim()).filter(Boolean));
export const initials = (name) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('') || 'A';
const INTRO = 'Introduction Video (optional)';

/** Availability chip from the shared availability state (AD-04 – AD-08). */
export function availabilityChip(a, online = 'Online') {
  if (!a) return null;
  if (a.dnd) return { kind: 'warn', text: 'DND on' };
  if (a.mode === 'online') return { kind: 'ok', text: online };
  if (a.mode === 'offline') return { kind: 'off', text: 'Offline' };
  return null;
}

// Service shortcuts only — pricing and availability live in each module (AD-84, PRF-02).
// Instant Call / Instant Chat show their real On/Off switch from the Home Dashboard (AD-04 – AD-06).
const SERVICES = [
  { name: 'Text Questions', href: '#/work/questions' },
  { name: 'Appointments', href: '#/work/appointments' },
  { name: 'Instant Call', href: '#/calls', sw: 'call' },
  { name: 'Instant Chat', href: '#/calls', sw: 'chat' },
];

export function ServiceList({ ctx }) {
  const a = ctx?.availability;
  return (
    <>
      {SERVICES.map((x) => {
        const on = x.sw ? !!a?.[x.sw] : null;
        return (
          <div key={x.name} className="pf-srow">
            <b className="pf-srow__name">{x.name}</b>
            <span className="pf-srow__end">
              {on !== null && <span className={`pf-state${on ? ' on' : ''}`}><span className="pf-state__dot" aria-hidden="true" />{on ? 'On' : 'Off'}</span>}
              <a className="pf-link" href={x.href}>Open<Icon name="chevronRight" size={14} stroke={2.2} /></a>
            </span>
          </div>
        );
      })}
      <p className="muted sm pf-foot">Pricing and availability are managed in each service. Switch Instant Call and Instant Chat on or off from your Home Dashboard.</p>
    </>
  );
}

function Row({ label, hint, children, pending }) {
  return (
    <div className="pf-lv">
      <div className="pf-lv__l">{label}{hint && <div className="pf-lv__hint">{hint}</div>}</div>
      <div className="pf-lv__v">{children}{pending && <span className="pf-pill pf-pill--warn pf-await">Awaiting approval</span>}</div>
    </div>
  );
}

function FileValue({ value, ok = 'Uploaded' }) {
  if (isEmpty(value)) return <span className="muted">Not uploaded</span>;
  return <span className="pf-okval"><Icon name="check" size={16} stroke={2.2} />{ok}<span className="muted sm">{value}</span></span>;
}

function Chips({ items, alt }) {
  if (!items.length) return <span className="muted">Not added</span>;
  return <span className="pf-chips">{items.map((t) => <span key={t} className={`pf-chip${alt ? ' pf-chip--alt' : ''}`}>{t}</span>)}</span>;
}

const EXPERTISE = [
  ['Astrology types', 'Systems you practise'],
  ['Specializations', 'Life areas you advise on'],
  ['Expertise areas', 'Specific services and methods'],
  ['Consultation languages', 'Languages you consult in'],
];

function SectionView({ k, s, ui, ctx, pick }) {
  const pend = (label) => label in s.pending;
  const fields = s.sections[k]?.fields || [];
  if (k === 'personal' || k === 'professional') {
    const certReview = s.verification.find((v) => v.label === 'Certificate verification');
    return fields.map((f) => (
      <Row key={f.label} label={f.label} pending={pend(f.label)}>
        {f.kind === 'file' ? <FileValue value={f.value} /> : (
          <span className={isEmpty(f.value) ? 'muted' : 'pf-val'}>
            {isEmpty(f.value) ? 'Not added' : f.label === 'Years of Experience' && /^\d+$/.test(f.value.trim()) ? `${f.value.trim()} years` : f.value}
          </span>
        )}
        {f.label === 'Certifications' && certReview && certReview.status !== 'Approved' && (
          <button type="button" className="pf-linkbtn" onClick={() => pick('verification')}>Certificate {certReview.status.toLowerCase()} · see Verification Documents</button>
        )}
      </Row>
    ));
  }
  if (k === 'expertise') {
    return EXPERTISE.map(([label, hint], i) => {
      const f = fields.find((x) => x.label === label);
      return <Row key={label} label={label} hint={hint} pending={pend(label)}><Chips items={list(f?.value)} alt={i === 3} /></Row>;
    });
  }
  if (k === 'media') {
    return fields.map((f) => {
      if (f.label === INTRO) {
        return (
          <Row key={f.label} label="Introduction Video" hint={<span className="pf-optional">Optional</span>}>
            {isEmpty(f.value) ? (
              <div className="pf-drop">
                <span className="pf-drop__ic"><Icon name="live" size={22} stroke={1.7} /></span>
                <div className="pf-drop__t"><b>Not uploaded</b><span className="muted sm">A short introduction helps visitors get to know you before a consultation.</span></div>
                <button type="button" className="btn btn-o sm" onClick={() => navigate('/profile/media')}><Icon name="paperclip" size={15} />Upload video</button>
              </div>
            ) : <FileValue value={f.value} />}
          </Row>
        );
      }
      return <Row key={f.label} label={f.label} pending={pend(f.label)}><FileValue value={f.value} ok={f.label === 'Profile Photo' ? 'Uploaded' : 'On file'} /></Row>;
    });
  }
  if (k === 'verification') return <VerificationCard s={s} ui={ui} />;
  return <ServiceList ctx={ctx} />;
}

function ProfileHeader({ s, ctx, pick }) {
  const pct = completion(s);
  const name = s.sections.personal.fields.find((x) => x.label === 'Full Name')?.value || '';
  const chip = availabilityChip(ctx?.availability);
  const all = Object.values(s.sections).flatMap((sec) => sec.fields);
  const missing = all.filter((x) => isEmpty(x.value));
  const introMissing = missing.some((x) => x.label === INTRO);
  return (
    <header className="pf-card pf-head">
      <span className="pf-av" role="img" aria-label={`Profile photo of ${name}`}>{initials(name)}</span>
      <div className="pf-head__id">
        <h2 className="pf-name">{name}</h2>
        <div className="pf-meta">
          <span className="muted">Astrologer ID <b className="pf-idv">{s.id}</b></span>
          <span className="pf-sep" aria-hidden="true" />
          {s.verified
            ? <span className="pf-pill pf-pill--gold"><Icon name="checkCircle" size={14} stroke={2} />Verified Astrologer</span>
            : <span className="pf-pill pf-pill--off">Not verified</span>}
          {chip && <span className={`pf-pill pf-pill--${chip.kind}`}><span className="pf-pill__dot" aria-hidden="true" />{chip.text}</span>}
        </div>
      </div>
      <div className="pf-comp">
        <div className="pf-comp__row"><span>Profile completion</span><b>{pct}%</b></div>
        <div className="pf-bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Profile completion"><span style={{ width: `${pct}%` }} /></div>
        {introMissing && (
          <button type="button" className="pf-linkbtn" onClick={() => pick('media')}>
            {missing.length === 1 ? 'Add an introduction video to finish' : 'Add an introduction video'}
          </button>
        )}
      </div>
      <a className="btn btn-o pf-prevbtn" href="#/profile/preview"><Icon name="eye" size={17} />Profile Preview</a>
    </header>
  );
}

export default function ProfileOverview({ s, mobile, ui, ctx, editKey }) {
  const [viewTab, setViewTab] = useState(lastTab.key);
  const current = editKey || viewTab;
  // Back on the profile view: the edit session is over, so unsaved edits are dropped.
  // Returning from Edit Profile shows the tab that was being edited.
  useEffect(() => {
    if (!editKey) { clearDrafts(); setViewTab(lastTab.key); }
  }, [editKey]);

  const pick = (key) => {
    lastTab.key = key;
    if (editKey) navigate(`/profile/${key}`);
    else setViewTab(key);
  };
  const pending = Object.keys(s.pending);
  const review = s.verification.filter((v) => v.status !== 'Approved').length;
  const flags = review ? { verification: `${review} item${review > 1 ? 's' : ''} under review` } : {};
  const tab = tabOf(current);

  return (
    <div className="pfx">
      <ProfileHeader s={s} ctx={ctx} pick={pick} />
      {pending.length > 0 && (
        <div className="pf-note">
          <Icon name="info" size={16} />
          <span>Waiting for Platform Admin approval: {pending.join(', ')}. Users still see your previously verified details.{' '}
            <PendingTag id="AP-04-02 which changes need approval" /></span>
        </div>
      )}
      <ProfileTabs current={current} onPick={pick} flags={flags} />

      {editKey ? (
        <ProfileEdit sectionKey={editKey} s={s} ui={ui} ctx={ctx} />
      ) : (
        <section className="pf-card" role="tabpanel" id="pf-panel" aria-labelledby={`pf-tab-${current}`}>
          <div className="pf-card__h">
            <div className="pf-card__t">
              <div className="pf-eyebrow">{stepOf(current)}</div>
              <h2>{tab.label}</h2>
               {tab.desc && <p>{tab.desc}</p>}
            </div>
            {current === 'services' ? (
              <a className="btn pf-btn-p" href="#/services">Manage Services<Icon name="chevronRight" size={15} stroke={2.2} /></a>
            ) : current !== 'verification' && (
              <a className="btn btn-o" href={`#/profile/${current}`} aria-label={`Edit ${tab.label}`}><Icon name="edit" size={15} />Edit</a>
            )}
          </div>
          <div className="pf-card__b">
            <SectionView k={current} s={s} ui={ui} ctx={ctx} pick={pick} />
          </div>
        </section>
      )}

      {mobile && (
        <section className="pf-card">
          <div className="pf-card__h"><div className="pf-card__t"><h2>More</h2></div></div>
          <div className="pf-card__b pf-more">
            {secondaryNav.map((n) => <a key={n.key} className="pf-link" href={n.href}>{n.label}</a>)}
            <PendingTag id="AP-GL-02 placement within tabs" />
          </div>
        </section>
      )}
    </div>
  );
}
