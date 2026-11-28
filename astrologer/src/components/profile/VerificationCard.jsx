import Icon from '@/components/ui/Icon.jsx';
import { profileActions } from '@/hooks/useProfile.js';
import { PendingTag } from '@/components/ui/sectionKit.jsx';

// Verification Documents (AD-85): KYC, identity and certificate verification statuses + re-upload documents.
// Status values and KYC steps are not decided (AP-04-01) — the sample values stay tagged as pending.
// The documents listed are the ones already on file in Profile Media (AD-83); no other categories
// or statuses are invented (PRF-04). Prototype: chosen files are not uploaded anywhere.
const DOC_FIELDS = ['Certificates / Qualification Documents', 'Supporting Documents'];
const EMPTY = '—';

const statusKind = (status) => (status === 'Approved' ? 'ok' : 'warn');

export function StatusPill({ status }) {
  return <span className={`pf-pill pf-pill--${statusKind(status)}`}><span className="pf-pill__dot" aria-hidden="true" />{status}</span>;
}

export default function VerificationCard({ s, ui }) {
  const media = s.sections.media.fields;
  const docs = DOC_FIELDS.map((label) => ({ label, value: media.find((x) => x.label === label)?.value || EMPTY }));

  const reuploadAll = (e) => {
    const n = e.target.files?.length || 0;
    if (n) {
      profileActions.reupload();
      ui.toast(`${n} document(s) uploaded for verification (prototype)`);
    }
    e.target.value = '';
  };
  const reuploadOne = (label) => (e) => {
    const name = e.target.files?.[0]?.name;
    if (name) {
      profileActions.saveSection('media', { [label]: name });
      profileActions.reupload();
      ui.toast('Document uploaded for verification (prototype)');
    }
    e.target.value = '';
  };
  const view = (d) => ui.dialog({
    title: d.value,
    body: (close) => (
      <div className="pf-docview">
        <p className="muted sm">{d.label}</p>
        <div className="pf-docview__box"><Icon name="file" size={28} stroke={1.5} />Document preview is not available in this prototype.</div>
        <div className="pf-actions pf-actions--bare"><button type="button" className="btn pf-btn-p" onClick={close}>Close</button></div>
      </div>
    ),
  });

  return (
    <>
      <h3 className="pf-sub">Verification status</h3>
      {s.verification.map((v) => (
        <div key={v.label} className="pf-srow"><span>{v.label}</span><StatusPill status={v.status} /></div>
      ))}
      <p className="muted sm pf-pendnote">Status values and KYC steps: <PendingTag id="AP-04-01" /></p>

      <h3 className="pf-sub">Uploaded documents</h3>
      {docs.map((d) => (
        <div key={d.label} className="pf-lv">
          <div className="pf-lv__l">{d.label}</div>
          {d.value === EMPTY ? (
            <div className="pf-lv__v muted">No document on file</div>
          ) : (
            <div className="pf-lv__v pf-doc">
              <span className="pf-doc__ic"><Icon name="file" size={18} stroke={1.7} /></span>
              <b className="pf-doc__name">{d.value}</b>
              <span className="pf-doc__btns">
                <button type="button" className="btn btn-o sm" onClick={() => view(d)}>View</button>
                <label className="btn btn-o sm pf-filebtn">
                  Re-upload
                  <input type="file" className="sr" onChange={reuploadOne(d.label)} />
                </label>
              </span>
            </div>
          )}
        </div>
      ))}

      <label className="btn btn-o pf-filebtn pf-upload">
        <Icon name="paperclip" size={16} />Re-upload documents
        <input type="file" className="sr" multiple onChange={reuploadAll} />
      </label>
    </>
  );
}
