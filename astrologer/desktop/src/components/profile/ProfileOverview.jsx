import { secondaryNav } from '@shared/data/mockHome.js';
import { completion } from '@shared/hooks/useProfile.js';
import { Grid, Note, PendingTag, Prog, Sec } from '../section/kit.jsx';
import VerificationCard from './VerificationCard.jsx';

// Profile overview (AD-79): identity + completion (AD-86), one card per section with its own
// Edit button, Service Information shortcuts (AD-84) and Verification (AD-85).
// Phones also list the "More" pages here, as in the mobile reference (placement: AP-GL-02).

// Service shortcuts only — pricing and availability live in each module (AD-84, PRF-02).
const SERVICES = [
  ['Text Questions', '#/work/questions'],
  ['Appointments', '#/work/appointments'],
  ['Instant Call', '#/calls'],
  ['Instant Chat', '#/calls'],
];

function SectionCard({ k, sec }) {
  return (
    <Sec title={sec.title} right={<a className="btn btn-o sm" href={`#/profile/${k}`} aria-label={`Edit ${sec.title}`}>Edit</a>}>
      <div className="stack sm">
        {sec.fields.slice(0, 4).map((x) => (
          <div key={x.label} className="row pf-kv"><span className="muted grow">{x.label}</span><b>{x.value}</b></div>
        ))}
      </div>
    </Sec>
  );
}

export default function ProfileOverview({ s, mobile, ui }) {
  const pct = completion(s);
  const pending = Object.keys(s.pending);
  const name = s.sections.personal.fields[0].value;

  return (
    <>
      <div className="row pf-top">
        <a className="btn btn-o" href="#/profile/preview">Profile Preview</a>
      </div>

      <Sec>
        <div className="row wrap pf-id">
          <span className="av av-l pf-av" aria-hidden="true">A</span>
          <div className="grow pf-name">
            <b className="lg">{name}</b>
            <div className="muted sm">{s.id} · {s.verified ? 'Verified Astrologer' : 'Not verified'}</div>
          </div>
          <div className="pf-comp">
            <div className="row sm"><span className="grow">Profile completion</span><b>{pct}%</b></div>
            <Prog pct={pct} />
          </div>
        </div>
        {pending.length > 0 && (
          <Note>
            Waiting for Platform Admin approval: {pending.join(', ')}. Users still see your previously verified details.{' '}
            <PendingTag id="AP-04-02 which changes need approval" />
          </Note>
        )}
      </Sec>

      <Grid>
        {Object.entries(s.sections).map(([k, sec]) => <SectionCard key={k} k={k} sec={sec} />)}
        <Sec title="Service Information">
          <p className="muted sm">Pricing and availability are managed in each service.</p>
          <div className="stack">
            {SERVICES.map(([l, href]) => <a key={l} className="pf-link" href={href}>{l}</a>)}
          </div>
        </Sec>
        <VerificationCard items={s.verification} ui={ui} />
      </Grid>

      {mobile && (
        <Sec title="More">
          <div className="stack">
            {secondaryNav.map((n) => <a key={n.key} className="pf-link" href={n.href}>{n.label}</a>)}
          </div>
          <PendingTag id="AP-GL-02 placement within tabs" />
        </Sec>
      )}
    </>
  );
}
