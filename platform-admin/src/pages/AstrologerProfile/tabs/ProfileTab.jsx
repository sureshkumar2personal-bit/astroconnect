import { useEffect, useId, useRef, useState } from 'react';
import Icon from '../../../components/icons.jsx';
import { EDITABLE_FIELDS, addAstrologerNote, saveProfileEdit } from '../../../data/astrologerStatus.js';
import { Avatar, StatusBadge } from '../../Users/components/UserBits.jsx';
import { ServiceChips, VerificationBadge } from '../../Astrologers/components/AstroBits.jsx';
import { DataTable, Empty, Fields, Section, d, dt, money } from '../../UserProfile/components/ui.jsx';

// Tab 1 — Profile (§4). Admin may edit the documented personal and
// professional details (decision 4); every edit needs a reason and is
// recorded with Admin ID and time. Charges are managed in their service
// modules (AD-84) and are shown read-only here.
export default function ProfileTab({ profile, session, refresh, notify }) {
  const a = profile.astrologer;
  const [editing, setEditing] = useState(false);
  const pkgs = a.charges.packages.map((p) => `${p.minutes} min ${money(p.price)}`).join(' · ');
  const updated = profile.edits[0]?.at ?? a.joinedAt;

  return (
    <div className="p-stack">
      <Section
        id="ap-personal"
        title="Personal Details"
        actions={
          <button type="button" className="u-btn" onClick={() => setEditing(true)}>
            Edit Profile Details
          </button>
        }
      >
        <Fields
          items={[
            ['Astrologer ID', a.id],
            ['Profile Photo', <Avatar key="p" user={a} size={32} />],
            ['Full Name', a.name],
            ['Gender', a.gender],
            ['Date of Birth', d(a.dateOfBirth)],
            ['Mobile', a.mobile],
            ['Email', <span className="p-break" key="e">{a.email}</span>],
            ['Location / Address', a.location],
            ['Preferred Language', a.preferredLanguage],
            ['Registration Date', dt(a.joinedAt)],
            ['Registration Method', a.registrationMethod],
          ]}
        />
      </Section>

      <Section id="ap-professional" title="Professional Details">
        <Fields
          items={[
            ['Display Name', a.displayName],
            ['Specializations', a.specializations.join(', ')],
            ['Astrology Types', a.astrologyTypes.join(', ')],
            ['Experience', `${a.experience} years`],
            ['Languages', a.languages.join(', ')],
            ['Qualifications', a.qualifications.join(', ')],
            ['Bio', a.bio, { wide: true }],
            ['Professional Introduction', a.introduction, { wide: true }],
            ['Services Offered', <ServiceChips key="s" offers={a.offers} />, { wide: true }],
          ]}
        />
        <h4 className="p-subhead">Individual Service Charges</h4>
        <Fields
          items={[
            ['Text Question', a.offers.text ? money(a.charges.text) : 'Not offered'],
            ['Appointment (15 min)', a.offers.appointment ? money(a.charges.appointment15) : 'Not offered'],
            ['Appointment (30 min)', a.offers.appointment ? money(a.charges.appointment30) : 'Not offered'],
            ['Instant Call packages', a.offers.call ? pkgs : 'Not offered', { wide: true }],
            ['Instant Chat packages', a.offers.chat ? pkgs : 'Not offered', { wide: true }],
          ]}
        />
        <p className="p-small p-muted">Charges are managed in the respective service modules. Calls and chats are sold as prepaid packages.</p>
      </Section>

      <Section id="ap-account" title="Account and Platform">
        <Fields
          items={[
            ['Account Type', 'Astrologer'],
            ['Account Status', <StatusBadge key="s" status={a.status} />],
            ['Verification Status (KYC)', <VerificationBadge key="v" value={a.verification.kyc} />],
            ['Last Login', dt(a.lastLoginAt)],
            ['Last Active', dt(a.lastActiveAt)],
            ['Profile Created', dt(a.joinedAt)],
            ['Profile Updated', dt(updated)],
          ]}
        />
      </Section>

      <Section id="ap-edits" title="Profile Edit History" description="Changes made by Admin users, with the reason for each change.">
        <DataTable
          caption="Profile edit history"
          rows={profile.edits}
          empty={<Empty icon="document" title="No profile edits by Admin" />}
          columns={[
            { key: 'at', header: 'Date / Time', primary: true, render: (e) => dt(e.at) },
            { key: 'changes', header: 'Changes', className: 'p-wrap', render: (e) => e.changes.map((c) => `${c.label}: “${c.from}” → “${c.to}”`).join('; ') },
            { key: 'reason', header: 'Reason', className: 'p-wrap', render: (e) => e.reason },
            { key: 'admin', header: 'Admin ID / Name', render: (e) => <span className="p-desc"><span>{e.adminName}</span><span className="p-small">{e.adminId}</span></span> },
          ]}
        />
      </Section>

      <Notes profile={profile} session={session} refresh={refresh} notify={notify} />

      {editing && (
        <EditDialog
          astrologer={a}
          onClose={() => setEditing(false)}
          onSave={(values, reason) => {
            const result = saveProfileEdit(a.id, values, reason, session);
            if (!result.ok) return result;
            setEditing(false);
            refresh();
            notify('success', `Profile details updated (${result.entry.changes.map((c) => c.label).join(', ')}). Recorded in Activity.`);
            return result;
          }}
        />
      )}
    </div>
  );
}

function Notes({ profile, session, refresh, notify }) {
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const id = useId();
  return (
    <Section id="ap-notes" title="Internal Admin Notes" description="Visible to authorised Admin users only. Notes cannot be edited or deleted.">
      <form
        className="p-note-form"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          const result = addAstrologerNote(profile.astrologer.id, text, session);
          if (!result.ok) return setError(result.error);
          setText('');
          setError('');
          refresh();
          notify('success', 'Internal note added.');
        }}
      >
        <label htmlFor={id} className="u-label">
          Add an internal note
        </label>
        <textarea id={id} className={`u-input u-textarea${error ? ' has-error' : ''}`} rows={2} maxLength={1000} value={text} onChange={(e) => { setText(e.target.value); setError(''); }} />
        {error && <p className="u-field__error">{error}</p>}
        <button type="submit" className="u-btn u-btn--primary p-note-form__submit">
          Add Note
        </button>
      </form>
      {profile.notes.length ? (
        <ol className="p-notes">
          {profile.notes.map((n) => (
            <li key={n.id} className="p-note">
              <p className="p-note__text">{n.text}</p>
              <p className="p-note__meta">
                {n.by.name} · {n.by.role} · Admin ID {n.by.id} · {dt(n.at)}
              </p>
            </li>
          ))}
        </ol>
      ) : (
        <Empty icon="document" title="No internal notes yet" />
      )}
    </Section>
  );
}

function EditDialog({ astrologer, onClose, onSave }) {
  const ref = useRef(null);
  const uid = useId();
  const [values, setValues] = useState(() =>
    Object.fromEntries(EDITABLE_FIELDS.map(([k, , type]) => [k, type === 'list' ? astrologer[k].join(', ') : String(astrologer[k] ?? '')]))
  );
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
    if (!ref.current.open) ref.current.showModal();
  }, []);
  function submit(e) {
    e.preventDefault();
    if (!reason.trim()) return setError('A reason is required for every profile change.');
    const result = onSave(values, reason);
    if (result && !result.ok) setError(result.error);
  }
  return (
    <dialog ref={ref} className="u-dialog a-edit-dialog" aria-labelledby={`${uid}-t`} onCancel={(e) => { e.preventDefault(); onClose(); }}>
      <form className="u-dialog__form" onSubmit={submit} noValidate>
        <header className="u-dialog__head">
          <h2 id={`${uid}-t`} className="u-dialog__title">
            Edit Profile Details
          </h2>
          <button type="button" className="u-dialog__close" aria-label="Cancel" onClick={onClose}>
            <Icon name="close" size={18} />
          </button>
        </header>
        <p className="u-dialog__note">
          {astrologer.name} ({astrologer.id}). Separate lists with commas.
        </p>
        <div className="a-edit-grid">
          {EDITABLE_FIELDS.map(([key, label, type, options]) => (
            <div key={key} className={`u-dialog__field${type === 'textarea' ? ' is-wide' : ''}`}>
              <label htmlFor={`${uid}-${key}`} className="u-label">
                {label}
              </label>
              {type === 'textarea' ? (
                <textarea id={`${uid}-${key}`} className="u-input u-textarea" rows={2} value={values[key]} onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))} />
              ) : type === 'select' ? (
                <select id={`${uid}-${key}`} className="u-input u-select" value={values[key]} onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}>
                  {options.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              ) : (
                <input id={`${uid}-${key}`} type={type === 'list' ? 'text' : type} min={type === 'number' ? 0 : undefined} className="u-input" value={values[key]} onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))} />
              )}
            </div>
          ))}
        </div>
        <div className="u-dialog__field">
          <label htmlFor={`${uid}-reason`} className="u-label">
            Reason for change <span className="u-required">(required)</span>
          </label>
          <textarea id={`${uid}-reason`} className={`u-input u-textarea${error ? ' has-error' : ''}`} rows={2} value={reason} onChange={(e) => { setReason(e.target.value); setError(''); }} />
        </div>
        {error && (
          <p className="u-field__error" role="alert">
            {error}
          </p>
        )}
        <footer className="u-dialog__actions">
          <button type="button" className="u-btn u-btn--ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="u-btn u-btn--primary">
            Save Changes
          </button>
        </footer>
      </form>
    </dialog>
  );
}
