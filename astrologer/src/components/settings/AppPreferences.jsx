import { PERMISSIONS, PERM_STATUS } from '@/data/mockSettings.js';
import Ic from './stIcons.jsx';

// App Preferences (AD-155): Light Mode / Dark Mode and device permissions.
// Appearance is the app's real theme (same as the header theme button): ctx.theme / ctx.onToggleTheme.
// Device permissions can't be changed from the app, so each row only opens its details.
export default function AppPreferences({ ctx, ui, openModal }) {
  const pick = (v) => {
    if (v === ctx.theme) return;
    ctx.onToggleTheme?.();
    ui.toast(v === 'dark' ? 'Dark mode selected' : 'Light mode selected');
  };
  const themes = [
    ['light', 'Light', 'sun'],
    ['dark', 'Dark', 'moon'],
  ];
  return (
    <>
      <div className="st-grp">
        <div className="st-gt">Appearance</div>
        <div className="st-grid2" role="radiogroup" aria-label="Appearance">
          {themes.map(([id, label, icon]) => {
            const on = ctx.theme === id;
            return (
              <button type="button" key={id} className="st-theme" role="radio" aria-checked={on} data-on={on} onClick={() => pick(id)}>
                <div className={`st-thprev st-thprev--${id}`} aria-hidden="true">
                  <div className="st-thprev__side"><span /><span /><span /></div>
                  <div className="st-thprev__main"><span /><span /><span /></div>
                </div>
                <span className="st-thfoot">
                  <span className="st-radio" data-on={on} />
                  <Ic n={icon} size={17} />
                  <span>{label}</span>
                  {on && <span className="st-thcur">Selected</span>}
                </span>
              </button>
            );
          })}
        </div>
        <p className="st-foot" aria-live="polite">
          {ctx.theme === 'light' ? 'Light mode is on. Warm cream surfaces with deep burgundy accents.' : 'Dark mode is on and applies across the app.'}
        </p>
      </div>

      <div className="st-grp">
        <div className="st-gt">Device permissions</div>
        <div className="st-panel">
          {PERMISSIONS.map((p) => {
            const ps = PERM_STATUS[p.status];
            return (
              <div className="st-row" key={p.id}>
                <span className="st-tile st-tone-neutral"><Ic n={p.icon} /></span>
                <div className="st-rt">
                  <div className="st-rt-line"><span className="st-rt-t">{p.name}</span><span className={`st-chip st-tone-${ps.tone}`}><span className="st-dot" />{ps.label}</span></div>
                  <div className="st-rt-d">{p.purpose}</div>
                </div>
                <button type="button" className="st-btn st-btn--ghost st-btn--sm" aria-label={`${p.name} permission details`} onClick={() => openModal({ type: 'perm', id: p.id })}>
                  Details<Ic n="chevronRight" size={14} />
                </button>
              </div>
            );
          })}
        </div>
        <p className="st-foot">Permissions are managed in your device settings.</p>
      </div>
    </>
  );
}
