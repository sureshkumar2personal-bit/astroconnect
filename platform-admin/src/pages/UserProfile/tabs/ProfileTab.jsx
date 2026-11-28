import { useId, useState } from 'react';
import { addNote } from '../../../data/profileStore.js';
import { Avatar } from '../../Users/components/UserBits.jsx';
import { DataTable, Empty, Fields, Pill, Section, d, dt } from '../components/ui.jsx';

const onOff = (v) => (v ? 'On' : 'Off');

// Tab 1 — Profile (§4). Read-only; Admin may add internal notes only.
// Password and OTP are never part of the profile data.
export default function ProfileTab({ profile, session, refresh, notify }) {
  const { user, personal, account, preferences: pref, referral } = profile;

  return (
    <div className="p-stack">
      <Section id="pf-personal" title="Personal Information">
        <Fields
          items={[
            ['User ID', user.id],
            [
              'Profile Photo',
              <span className="p-inline" key="photo">
                <Avatar user={user} size={32} />
              </span>,
            ],
            ['Full Name', user.name],
            ['Gender', personal.gender],
            ['Date of Birth', d(personal.dateOfBirth)],
            ['Mobile', user.mobile],
            ['Email', <span className="p-break" key="e">{user.email}</span>],
            ['Location / Address', personal.location, { wide: true }],
          ]}
        />
      </Section>

      <div className="p-grid-2">
        <Section id="pf-birth" title="Birth Details" description="Mandatory profile details used for consultations, shared with an astrologer only with the user’s consent.">
          <Fields
            columns={3}
            items={[
              ['Birth Date', d(personal.birth.date)],
              ['Birth Time', personal.birth.time],
              ['Birth Place', personal.birth.place],
            ]}
          />
        </Section>

        <Section id="pf-account" title="Account Information">
          <Fields
            columns={2}
            items={[
              ['Last Login', dt(account.lastLoginAt)],
              ['Last Active', dt(user.lastActiveAt)],
              ['Account Created', dt(user.registeredAt)],
              ['Registration Method', account.registrationMethod],
              ['Account Type', user.accountType],
            ]}
          />
        </Section>
      </div>

      <Section id="pf-pref" title="Preferences and Consent">
        <Fields
          items={[
            ['Preferred Language', pref.language],
            [
              'Notification Preferences',
              `Push ${onOff(pref.notifications.push)} · Email ${onOff(pref.notifications.email)} · SMS ${onOff(pref.notifications.sms)}`,
            ],
            ['Preferred Communication', pref.communication],
            ['Terms Accepted', dt(pref.termsAcceptedAt)],
            ['Privacy Policy Accepted', dt(pref.privacyAcceptedAt)],
            ['Marketing Notifications', pref.marketingConsent ? 'Consent given' : 'No consent'],
          ]}
        />
        <h4 className="p-subhead">Consent History</h4>
        <ConsentTable rows={pref.consentHistory} />
      </Section>

      <Section id="pf-ref" title="Referral Information">
        <Fields
          items={[
            ['Referred By', referral.referredBy ? referral.referredBy.id : 'Not referred'],
            ['Referral Code Used', referral.referralCodeUsed ?? '—'],
            ['User’s Own Referral Code', referral.ownCode],
          ]}
        />
      </Section>

      <AdminNotes profile={profile} session={session} refresh={refresh} notify={notify} />
    </div>
  );
}

export function ConsentTable({ rows }) {
  return (
    <DataTable
      caption="Consent history"
      rowKey={(r) => `${r.at}-${r.item}`}
      rows={[...rows].reverse()}
      columns={[
        { key: 'at', header: 'Date / Time', render: (r) => dt(r.at), primary: true },
        { key: 'item', header: 'Consent', render: (r) => r.item },
        { key: 'action', header: 'Action', render: (r) => <Pill value={r.action} /> },
        { key: 'version', header: 'Version', render: (r) => r.version },
      ]}
    />
  );
}

function AdminNotes({ profile, session, refresh, notify }) {
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const id = useId();

  function submit(e) {
    e.preventDefault();
    const result = addNote(profile.userId, text, session);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setText('');
    setError('');
    refresh();
    notify('success', 'Internal note added.');
  }

  return (
    <Section
      id="pf-notes"
      title="Admin Notes"
      description="Internal notes for authorised Admin users only. They are never shown to the user and cannot be edited or deleted."
    >
      <form className="p-note-form" onSubmit={submit} noValidate>
        <label htmlFor={id} className="u-label">
          Add an internal note
        </label>
        <textarea
          id={id}
          className={`u-input u-textarea${error ? ' has-error' : ''}`}
          rows={2}
          maxLength={1000}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (error) setError('');
          }}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-err` : undefined}
        />
        {error && (
          <p id={`${id}-err`} className="u-field__error">
            {error}
          </p>
        )}
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
