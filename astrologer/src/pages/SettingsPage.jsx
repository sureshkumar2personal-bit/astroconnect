import { useEffect, useRef, useState } from 'react';
import { navigate } from '@/lib/router.js';
import useSettings from '@/hooks/useSettings.js';
import { SECTIONS } from '@/data/mockSettings.js';
import SettingsModal from '@/components/settings/SettingsDialogs.jsx';
import AccountSettings from '@/components/settings/AccountSettings.jsx';
import NotificationPrefs from '@/components/settings/NotificationPrefs.jsx';
import LanguageRegion from '@/components/settings/LanguageRegion.jsx';
import AppPreferences from '@/components/settings/AppPreferences.jsx';
import PrivacySecurity from '@/components/settings/PrivacySecurity.jsx';
import AboutActions from '@/components/settings/AboutActions.jsx';

// Settings (spec 15_SETTINGS_AND_PREFERENCES.md, AD-152 – AD-157; reference "AstroConnect Settings").
// Routes: #/settings[/<section>] with <section> = account | notifications | language | app | privacy | about.
// A horizontal tab row with the six sections; the selected section's content is shown below it
// (default: account). On narrow screens the row scrolls sideways inside itself.
// Placement within the tabs is AP-GL-02 (sidebar "More" group for now).
const idOf = (route) => (SECTIONS.some((x) => x.id === route.parts[0]) ? route.parts[0] : '');

// Back goes to the Home dashboard.
export const meta = () => ({ title: 'Settings', parent: '/' });

const VIEWS = {
  account: AccountSettings, notifications: NotificationPrefs, language: LanguageRegion,
  app: AppPreferences, privacy: PrivacySecurity, about: AboutActions,
};

// Card layout per section on wide content (see .st-sec in settings.css): number of columns, and
// whether the first card is wider than the second.
const LAYOUT = {
  account: { cols: 2, split: true }, notifications: { cols: 1 }, language: { cols: 2 },
  app: { cols: 2 }, privacy: { cols: 1 }, about: { cols: 2, split: true },
};

export default function SettingsPage({ route, mobile, ui, ctx }) {
  const s = useSettings();
  const [modal, setModal] = useState(null);
  const bar = useRef(null);
  const active = idOf(route) || 'account';
  const go = (to) => navigate(`/settings/${to}`);
  const View = VIEWS[active];
  const cur = SECTIONS.find((x) => x.id === active);

  // Keep the selected tab visible when the row scrolls sideways.
  useEffect(() => {
    const el = bar.current?.querySelector('[data-active="true"]');
    if (!el || !bar.current) return;
    const b = bar.current;
    b.scrollTo({ left: el.offsetLeft - (b.clientWidth - el.offsetWidth) / 2, behavior: 'smooth' });
  }, [active]);

  return (
    <div className={`st${mobile ? ' st--m' : ''}`}>
      <div className="st-layout">
        <nav className="st-nav" aria-label="Settings sections" ref={bar}>
          {SECTIONS.map((x) => (
            <button type="button" key={x.id} className="st-navitem" data-active={x.id === active} aria-current={x.id === active ? 'page' : undefined} onClick={() => go(x.id)}>
              {x.label}
            </button>
          ))}
        </nav>
        <div className="st-cq">
          <section className="st-sec" aria-labelledby="st-h" data-cols={LAYOUT[active].cols} data-split={LAYOUT[active].split ? 'wide-left' : undefined}>
            {!mobile && <h2 className="st-h" id="st-h">{cur.label}</h2>}
            <View s={s} ctx={ctx} ui={ui} go={go} openModal={setModal} />
          </section>
        </div>
      </div>
      <SettingsModal modal={modal} onClose={() => setModal(null)} ui={ui} mobile={mobile} sessions={s.sessions} />
    </div>
  );
}
