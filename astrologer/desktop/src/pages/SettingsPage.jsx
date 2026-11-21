import useSettings from '@shared/hooks/useSettings.js';
import { Grid } from '../components/section/kit.jsx';
import AccountSettings from '../components/settings/AccountSettings.jsx';
import NotificationPrefs from '../components/settings/NotificationPrefs.jsx';
import LanguageRegion from '../components/settings/LanguageRegion.jsx';
import AppPreferences from '../components/settings/AppPreferences.jsx';
import PrivacySecurity from '../components/settings/PrivacySecurity.jsx';
import AboutActions from '../components/settings/AboutActions.jsx';

// Settings (spec 15_SETTINGS_AND_PREFERENCES.md, AD-152 – AD-157). Route: #/settings.
// Placement within the tabs is AP-GL-02 (sidebar "More" group for now).
export const meta = () => ({ title: 'Settings', subtitle: 'Account, notifications, language, app and privacy' });

export default function SettingsPage({ ui, ctx }) {
  const s = useSettings();
  return (
    <Grid size="lg">
      <AccountSettings ui={ui} />
      <NotificationPrefs s={s} />
      <LanguageRegion s={s} ui={ui} />
      <AppPreferences s={s} ctx={ctx} />
      <PrivacySecurity s={s} ui={ui} />
      <AboutActions s={s} ui={ui} />
    </Grid>
  );
}
