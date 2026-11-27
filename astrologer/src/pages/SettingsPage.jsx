import { useState } from 'react';
import { navigate } from '@/lib/router.js';
import useSettings from '@/hooks/useSettings.js';
import { SECTIONS } from '@/data/mockSettings.js';
import Ic from '@/components/settings/stIcons.jsx';
import SettingsModal from '@/components/settings/SettingsDialogs.jsx';
import AccountSettings from '@/components/settings/AccountSettings.jsx';
import NotificationPrefs from '@/components/settings/NotificationPrefs.jsx';
import LanguageRegion from '@/components/settings/LanguageRegion.jsx';
import AppPreferences from '@/components/settings/AppPreferences.jsx';
import PrivacySecurity from '@/components/settings/PrivacySecurity.jsx';
import AboutActions from '@/components/settings/AboutActions.jsx';

// Settings (spec 15_SETTINGS_AND_PREFERENCES.md, AD-152 – AD-157; reference "AstroConnect Settings").
// Routes: #/settings[/<section>] with <section> = account | notifications | language | app | privacy | about.
// Desktop: vertical section navigation on the left, the selected section on the right (default: account).
// Phone: a list of the six sections; opening one shows it with a back button to the list.
// Placement within the tabs is AP-GL-02 (sidebar "More" group for now).
const idOf = (route) => (SECTIONS.some((x) => x.id === route.parts[0]) ? route.parts[0] : '');

export const meta = (route, ctx, mobile) => {
  const sec = SECTIONS.find((x) => x.id === idOf(route));
  // Phone detail: the header shows the section name and goes back to the list; otherwise back to Home.
  if (mobile && sec) return { title: sec.label, parent: '/settings' };
  return { title: 'Settings', parent: '/' };
};

const VIEWS = {
  account: AccountSettings, notifications: NotificationPrefs, language: LanguageRegion,
  app: AppPreferences, privacy: PrivacySecurity, about: AboutActions,
};

export default function SettingsPage({ route, mobile, ui, ctx }) {
  const s = useSettings();
  const [modal, setModal] = useState(null);
  const id = idOf(route);
  const active = id || 'account';
  const go = (to) => navigate(`/settings/${to}`);
  const View = VIEWS[active];
  const cur = SECTIONS.find((x) => x.id === active);

  const nav = (
    <nav className="st-nav" aria-label="Settings sections">
      {SECTIONS.map((x) => (
        <button type="button" key={x.id} className="st-navitem" data-active={x.id === active} aria-current={x.id === active ? 'page' : undefined} onClick={() => go(x.id)}>
          <Ic n={x.icon} size={19} /><span>{x.label}</span>
        </button>
      ))}
    </nav>
  );
  const list = (
    <nav className="st-list st-panel st-clip" aria-label="Settings sections">
      {SECTIONS.map((x) => (
        <button type="button" key={x.id} className="st-linkrow" onClick={() => go(x.id)}>
          <span className="st-tile st-tone-neutral"><Ic n={x.icon} /></span>
          <span className="st-rt"><span className="st-rt-t">{x.label}</span></span>
          <Ic n="chevronRight" size={16} />
        </button>
      ))}
    </nav>
  );

  return (
    <div className={`st${mobile ? ' st--m' : ''}`}>
      {mobile && !id ? list : (
        <div className={mobile ? 'st-body' : 'st-layout'}>
          {!mobile && nav}
          <section className="st-sec" aria-labelledby="st-h">
            {!mobile && <h2 className="st-h" id="st-h">{cur.label}</h2>}
            <View s={s} ctx={ctx} ui={ui} go={go} openModal={setModal} />
          </section>
        </div>
      )}
      <SettingsModal modal={modal} onClose={() => setModal(null)} ui={ui} mobile={mobile} sessions={s.sessions} />
    </div>
  );
}
