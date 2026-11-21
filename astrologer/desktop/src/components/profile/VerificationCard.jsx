import { profileActions } from '@shared/hooks/useProfile.js';
import { Badge, PendingTag, Sec } from '../section/kit.jsx';

// Verification (AD-85): KYC, identity and certificate verification statuses + re-upload documents.
// Status values and KYC steps are not decided (AP-04-01) — the sample values stay tagged as pending.
// Prototype: the chosen files are not uploaded anywhere.
export default function VerificationCard({ items, ui }) {
  const onFiles = (e) => {
    const n = e.target.files?.length || 0;
    if (n) {
      profileActions.reupload();
      ui.toast(`${n} document(s) uploaded for verification (prototype)`);
    }
    e.target.value = '';
  };
  return (
    <Sec title="Verification">
      <div className="stack">
        {items.map((v) => (
          <div key={v.label} className="row"><span className="grow">{v.label}</span><Badge kind={v.status === 'Approved' ? 'ok' : 'warn'}>{v.status}</Badge></div>
        ))}
      </div>
      <label className="btn btn-o pf-upload">
        Re-upload documents
        <input type="file" className="sr" multiple onChange={onFiles} />
      </label>
      <span className="muted sm">Status values and KYC steps: <PendingTag id="AP-04-01" /></span>
    </Sec>
  );
}
