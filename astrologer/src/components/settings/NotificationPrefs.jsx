import { Sec } from '@/components/ui/sectionKit.jsx';
import { NOTIFICATION_CATEGORIES } from '@/data/mockSettings.js';
import { settingsActions } from '@/hooks/useSettings.js';
import PrefSwitch from './PrefSwitch.jsx';

// Notification Preferences (AD-153): push, sound/vibration, category and event switches.
// Important security alerts are mandatory (AD-150, SET-01). Notification settings never change
// service availability (AD-151, SET-02) — Online/Offline/DND stay on Home (ctx.availability).
export default function NotificationPrefs({ s }) {
  const a = settingsActions;
  return (
    <Sec title="Notification Preferences">
      <PrefSwitch label="Push" on={s.push} onToggle={() => a.toggle('push')}>Push notifications</PrefSwitch>
      <PrefSwitch label="Sound" on={s.sound} onToggle={() => a.toggle('sound')}>Sound</PrefSwitch>
      <PrefSwitch label="Vibration" on={s.vib} onToggle={() => a.toggle('vib')}>Vibration</PrefSwitch>
      <b className="sm">Categories</b>
      {Object.entries(NOTIFICATION_CATEGORIES).map(([k, v]) => (
        <PrefSwitch key={k} small label={v} on={s.cats[k]} onToggle={() => a.toggleCategory(k)}>{k}. {v}</PrefSwitch>
      ))}
      <b className="sm">Events</b>
      {Object.keys(s.ev).map((e) => (
        <PrefSwitch key={e} small label={e} on={s.ev[e]} onToggle={() => a.toggleEvent(e)}>{e}</PrefSwitch>
      ))}
      <PrefSwitch small label="Security alerts" on disabled><b>Important security alerts</b> · mandatory</PrefSwitch>
      <span className="muted sm">Turning notifications off never changes your service availability.</span>
    </Sec>
  );
}
