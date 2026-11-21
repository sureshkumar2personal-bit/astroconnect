import { Seg, Sec } from '../section/kit.jsx';
import { settingsActions } from '@shared/hooks/useSettings.js';
import PrefSwitch from './PrefSwitch.jsx';

// App Preferences (AD-155): Light Mode / Dark Mode and device permissions.
// Appearance is the app's real theme (same as the header theme button): ctx.theme / ctx.onToggleTheme.
// Prototype: permission switches do not request or change any real device permission.
export default function AppPreferences({ s, ctx }) {
  const setTheme = (v) => { if (v !== ctx.theme) ctx.onToggleTheme?.(); };
  return (
    <Sec title="App Preferences">
      <div className="row wrap st-appearance">
        <b className="sm">Appearance</b>
        <Seg label="Appearance" options={[['light', 'Light Mode'], ['dark', 'Dark Mode']]} value={ctx.theme} onChange={setTheme} />
      </div>
      {Object.keys(s.perm).map((p) => (
        <PrefSwitch key={p} label={p} on={s.perm[p]} onToggle={() => settingsActions.togglePermission(p)}>{p} permission</PrefSwitch>
      ))}
    </Sec>
  );
}
