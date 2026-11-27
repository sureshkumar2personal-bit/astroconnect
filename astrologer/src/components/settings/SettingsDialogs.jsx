import { useEffect, useRef, useState } from 'react';
import { PERMISSIONS, PERM_STATUS, LEGAL_DOCS } from '@/data/mockSettings.js';
import { settingsActions, validatePassword } from '@/hooks/useSettings.js';
import Ic from './stIcons.jsx';

// Modals for Settings (reference dialogs). One overlay at a time, opened from the page with
// `modal = { type, ... }`: password · session · others · logout · deact · delete · perm · doc.
// A bottom sheet on phones. Prototype only — nothing is sent, no password or session is really changed.

/** Overlay + card shell: Esc and backdrop close, focus moves into the card. */
function Shell({ tile, tone = 'gold', title, onClose, sheet, children, center }) {
  const ref = useRef(null);
  useEffect(() => {
    const prev = document.activeElement;
    ref.current?.focus();
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); prev?.focus?.(); };
  }, [onClose]);
  return (
    <div className={`st-ovl${sheet ? ' is-sheet' : ''}`} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="st-dlg" role="dialog" aria-modal="true" aria-labelledby="st-dlg-title" tabIndex={-1} ref={ref}>
        <span className="st-grabber" aria-hidden="true" />
        {center ? null : (
          <div className="st-dlg__head">
            <span className={`st-tile st-tile--lg st-tone-${tone}`}><Ic n={tile} size={22} /></span>
            <button type="button" className="st-iconbtn" aria-label="Close" onClick={onClose}><Ic n="x" /></button>
          </div>
        )}
        {title && <h3 className="st-dlg__title" id="st-dlg-title">{title}</h3>}
        {children}
      </div>
    </div>
  );
}

/** Success screen shown after Change Password / Log out / a request. */
function Done({ title, body, refId, cta, onClose, sheet }) {
  return (
    <Shell title={null} onClose={onClose} sheet={sheet} center>
      <div className="st-done">
        <span className="st-done__ic"><Ic n="check" size={26} /></span>
        <h3 className="st-dlg__title" id="st-dlg-title">{title}</h3>
        <p className="st-dlg__body">{body}</p>
        {refId && <div className="st-ref">Reference <strong>{refId}</strong></div>}
      </div>
      <div className="st-dlg__actions st-dlg__actions--center">
        <button type="button" className="st-btn st-btn--pri" onClick={onClose}>{cta}</button>
      </div>
    </Shell>
  );
}

const REQS = [
  ['At least 8 characters', ({ nw }) => nw.length >= 8],
  ['Includes a number', ({ nw }) => /\d/.test(nw)],
  ['Passwords match', ({ nw, cf }) => cf.length > 0 && cf === nw],
];
const PW_FIELDS = [
  ['cur', 'Current password', 'current-password', 'Enter current password'],
  ['nw', 'New password', 'new-password', 'At least 8 characters'],
  ['cf', 'Confirm new password', 'new-password', 'Re-enter new password'],
];

/** Change Password (AD-152). A Password Changed notification follows (AD-148). */
function PasswordModal({ onClose, sheet }) {
  const [pw, setPw] = useState({ cur: '', nw: '', cf: '' });
  const [show, setShow] = useState({});
  const [err, setErr] = useState(null);
  const [done, setDone] = useState(false);
  if (done) {
    return <Done sheet={sheet} onClose={onClose} cta="Done" title="Password updated" body="Your new password is now active. A security notification has been sent." />;
  }
  const submit = () => {
    const e = validatePassword(pw);
    if (e) return setErr(e);
    settingsActions.passwordChanged();
    return setDone(true);
  };
  return (
    <Shell tile="key" title="Change password" onClose={onClose} sheet={sheet}>
      <p className="st-dlg__body">Choose a strong password you don't use anywhere else.</p>
      <form className="st-pw" onSubmit={(e) => { e.preventDefault(); submit(); }} noValidate>
        {PW_FIELDS.map(([k, label, ac, ph]) => (
          <div className="st-field" key={k}>
            <label className="st-label" htmlFor={`st-pw-${k}`}>{label}</label>
            <div className="st-input" data-err={err?.field === k}>
              <input
                id={`st-pw-${k}`}
                type={show[k] ? 'text' : 'password'}
                autoComplete={ac}
                placeholder={ph}
                value={pw[k]}
                onChange={(e) => { setPw({ ...pw, [k]: e.target.value }); setErr(null); }}
              />
              <button type="button" className="st-iconbtn" aria-label={`${show[k] ? 'Hide' : 'Show'} ${label.toLowerCase()}`} aria-pressed={!!show[k]} onClick={() => setShow({ ...show, [k]: !show[k] })}>
                <Ic n={show[k] ? 'eyeOff' : 'eye'} />
              </button>
            </div>
          </div>
        ))}
        <ul className="st-reqs" aria-label="Password requirements">
          {REQS.map(([label, ok]) => (
            <li key={label} className={ok(pw) ? 'is-met' : ''}><Ic n={ok(pw) ? 'check' : 'dot'} size={14} />{label}</li>
          ))}
        </ul>
        {err && <div className="st-err" role="alert"><Ic n="alert" size={16} /><span>{err.message}</span></div>}
        <div className="st-dlg__actions">
          <button type="button" className="st-btn st-btn--ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="st-btn st-btn--pri">Update password</button>
        </div>
      </form>
    </Shell>
  );
}

/** Log out one device / other devices / this device (AD-156, AD-157, SET-05). */
function ConfirmModal({ modal, others, onClose, ui, sheet }) {
  const [done, setDone] = useState(false);
  if (done) return <Done sheet={sheet} onClose={onClose} cta="Done" title="You've been logged out" body="Sign in again to continue using the Astrologer Portal on this device." />;
  let c;
  if (modal.type === 'session') {
    const t = modal.session;
    c = {
      tile: t.icon, tone: 'pri', title: `Log out of ${t.name}?`, cta: 'Log out device', danger: false,
      body: `The session in ${t.place} will be signed out and will need to sign in again. This device stays signed in.`,
      go: () => { settingsActions.logoutSession(t.id); onClose(); ui.toast(`${t.name} logged out`); },
    };
  } else if (modal.type === 'others') {
    c = {
      tile: 'logout', tone: 'bad', title: 'Log out from other devices?', cta: 'Log out other devices', danger: true, list: others,
      body: `The ${others.length > 1 ? `${others.length} sessions` : 'session'} below will be signed out. You'll stay signed in on this device.`,
      go: () => { settingsActions.logoutOthers(); onClose(); ui.toast('Other devices logged out'); },
    };
  } else {
    c = {
      tile: 'logout', tone: 'pri', title: 'Log out of AstroConnect?', cta: 'Log out', danger: false,
      body: "You'll need to sign in again to use the Astrologer Portal on this device.",
      go: () => setDone(true),
    };
  }
  return (
    <Shell tile={c.tile} tone={c.tone} title={c.title} onClose={onClose} sheet={sheet}>
      <p className="st-dlg__body">{c.body}</p>
      {c.list && (
        <ul className="st-cflist">
          {c.list.map((x) => (
            <li key={x.id}>
              <span className="st-tile st-tile--sm st-tone-pri"><Ic n={x.icon} size={16} /></span>
              <span><b>{x.name}</b><small>{x.place} · {x.when}</small></span>
            </li>
          ))}
        </ul>
      )}
      <div className="st-dlg__actions">
        <button type="button" className="st-btn st-btn--ghost" onClick={onClose}>Cancel</button>
        <button type="button" className={`st-btn ${c.danger ? 'st-btn--danger' : 'st-btn--pri'}`} onClick={c.go}>{c.cta}</button>
      </div>
    </Shell>
  );
}

const STEPS = [
  'Your request is sent to Platform Admin.',
  'Platform Admin reviews it. Your account stays active meanwhile.',
  "You're notified of the decision.",
];

/** Request account deactivation / deletion — routed to Platform Admin for approval (AD-157, SET-04). */
function RequestModal({ kind, onClose, sheet }) {
  const del = kind === 'delete';
  const [reason, setReason] = useState('');
  const [ack, setAck] = useState(false);
  const [done, setDone] = useState(false);
  if (done) {
    return (
      <Done
        sheet={sheet}
        onClose={onClose}
        cta="Done"
        refId={del ? 'REQ-DEL-1042' : 'REQ-DEA-1042'}
        title={del ? 'Deletion request submitted' : 'Deactivation request submitted'}
        body={del
          ? "Platform Admin approval is required before anything is deleted. Your account remains active in the meantime, and you'll be notified of the decision."
          : "Platform Admin will review your request. Your account remains fully active until it's approved, and you'll be notified of the decision."}
      />
    );
  }
  return (
    <Shell tile={del ? 'trash' : 'pause'} tone={del ? 'bad' : 'neutral'} title={del ? 'Request account deletion' : 'Request account deactivation'} onClose={onClose} sheet={sheet}>
      <p className="st-dlg__body">
        {del
          ? 'Your request goes to Platform Admin for review. Nothing is deleted now: your account stays active until Platform Admin approves the request.'
          : "Your request goes to Platform Admin for review. Your account isn't deactivated now: it stays active until Platform Admin approves the request."}
      </p>
      {del && (
        <div className="st-note st-note--bad"><Ic n="alert" size={18} /><div><strong>If approved, deletion is permanent.</strong> Your account and its data can't be recovered afterwards.</div></div>
      )}
      <div className="st-steps">
        <div className="st-gt">What happens next</div>
        {STEPS.map((t, i) => <div className="st-step" key={t}><span className="st-step__n">{i + 1}</span><span>{t}</span></div>)}
      </div>
      <div className="st-field st-field--mt">
        <label className="st-label" htmlFor="st-reason">Reason <span className="st-opt">(optional)</span></label>
        <textarea className="st-textarea" id="st-reason" rows={3} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Anything Platform Admin should know" />
      </div>
      {del && (
        <label className="st-check"><input type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} /><span>I understand that an approved deletion can't be undone.</span></label>
      )}
      <div className="st-dlg__actions">
        <button type="button" className="st-btn st-btn--ghost" onClick={onClose}>Cancel</button>
        <button
          type="button"
          className={`st-btn ${del ? 'st-btn--danger' : 'st-btn--pri'}`}
          disabled={del && !ack}
          onClick={() => { settingsActions.sendRequest(kind); setDone(true); }}
        >
          {del ? 'Submit deletion request' : 'Submit request'}
        </button>
      </div>
    </Shell>
  );
}

/** Device permission details (AD-155). The app can't change a device permission itself. */
function PermissionModal({ id, onClose, sheet }) {
  const p = PERMISSIONS.find((x) => x.id === id) || PERMISSIONS[0];
  const ps = PERM_STATUS[p.status];
  return (
    <Shell tile={p.icon} tone="neutral" title={`${p.name} permission`} onClose={onClose} sheet={sheet}>
      <div className="st-permhead">
        <span className={`st-chip st-chip--lg st-tone-${ps.tone}`}><span className="st-dot" />{ps.label}</span>
        <span className="st-mut">Used for: {p.purpose}</span>
      </div>
      <p className="st-dlg__body">{ps.explain}</p>
      <div className="st-note st-note--gold"><Ic n="info" size={18} /><div>AstroConnect can't change device permissions for you. Open your device's settings to change this permission.</div></div>
      <div className="st-dlg__actions">
        <button type="button" className="st-btn st-btn--pri" onClick={onClose}>Close</button>
      </div>
    </Shell>
  );
}

/** Privacy Policy, Terms and Conditions, Data & Privacy Information (AD-156). */
function DocModal({ name, onClose, sheet }) {
  const d = LEGAL_DOCS.find((x) => x.name === name);
  return (
    <Shell tile="file" title={name} onClose={onClose} sheet={sheet}>
      <p className="st-dlg__body">{d?.desc}.</p>
      <p className="st-dlg__body">The full text of this document is provided by the Platform.</p>
      <div className="st-dlg__actions"><button type="button" className="st-btn st-btn--pri" onClick={onClose}>Close</button></div>
    </Shell>
  );
}

export default function SettingsModal({ modal, onClose, ui, mobile, sessions }) {
  if (!modal) return null;
  const sheet = !!mobile;
  const others = sessions.filter((x) => !x.current);
  switch (modal.type) {
    case 'password': return <PasswordModal onClose={onClose} sheet={sheet} />;
    case 'session': case 'others': case 'logout': return <ConfirmModal modal={modal} others={others} onClose={onClose} ui={ui} sheet={sheet} />;
    case 'deact': return <RequestModal kind="deact" onClose={onClose} sheet={sheet} />;
    case 'delete': return <RequestModal kind="delete" onClose={onClose} sheet={sheet} />;
    case 'perm': return <PermissionModal id={modal.id} onClose={onClose} sheet={sheet} />;
    case 'doc': return <DocModal name={modal.name} onClose={onClose} sheet={sheet} />;
    default: return null;
  }
}
