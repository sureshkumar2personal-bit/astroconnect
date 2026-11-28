// The six profile sections as one horizontal tab bar (reference "AstroConnect – Astrologer My Profile").
// Shared by the profile view and Edit Profile. When they do not fit in one row, the tabs wrap onto further rows.
// Section structure: AD-79 – AD-85 (docs/02-astrologer-app/04_PROFILE_AND_VERIFICATION.md).
export const PROFILE_TABS = [
  { key: 'personal', label: 'Personal Information', desc: '' },
  { key: 'professional', label: 'Professional Information', desc: 'Your background and qualifications, shown to visitors.' },
  { key: 'expertise', label: 'Astrology Expertise', desc: 'What you practise, the topics you advise on and the languages you consult in.' },
  { key: 'media', label: 'Profile Media', desc: 'Your profile photo, optional introduction video and documents.' },
  { key: 'verification', label: 'Verification Documents', desc: 'Your verification status and the documents you have submitted.' },
  { key: 'services', label: 'Service Overview', desc: 'Shortcuts to your services. Pricing and availability are managed in each service.' },
];

export const tabOf = (key) => PROFILE_TABS.find((t) => t.key === key) || null;
export const stepOf = (key) => `Section ${PROFILE_TABS.findIndex((t) => t.key === key) + 1} of ${PROFILE_TABS.length}`;

/** The tab shown when the profile is opened again (e.g. after Save Changes or Cancel). */
export const lastTab = { key: 'personal' };

/** flags: { [key]: title } — a small dot on that tab (e.g. a verification still under review). */
export default function ProfileTabs({ current, onPick, flags = {} }) {
  return (
    <div className="pf-tabs" role="tablist" aria-label="Profile sections">
      {PROFILE_TABS.map((t) => {
        const on = t.key === current;
        return (
          <button
            key={t.key}
            type="button"
            role="tab"
            id={`pf-tab-${t.key}`}
            aria-selected={on}
            aria-controls="pf-panel"
            className={`pf-tab${on ? ' on' : ''}`}
            onClick={() => onPick(t.key)}
          >
            <span>{t.label}</span>
            {flags[t.key] && <span className="pf-tab__dot" title={flags[t.key]} aria-label={flags[t.key]} />}
          </button>
        );
      })}
    </div>
  );
}
