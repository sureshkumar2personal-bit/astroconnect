import { useState } from 'react';
import { DELIVERY, NOTIFICATION_CATEGORIES, NOTIFICATION_GROUPS } from '@/data/mockSettings.js';
import { settingsActions as a } from '@/hooks/useSettings.js';
import PrefSwitch from './PrefSwitch.jsx';
import Ic from './stIcons.jsx';

// Notification Preferences (AD-153): push, sound/vibration, category and event switches.
// Important security alerts are mandatory (AD-150, SET-01). Notification settings never change
// service availability (AD-151, SET-02) — Online/Offline/DND stay on Home.
export default function NotificationPrefs({ s }) {
  const [open, setOpen] = useState({ B: true });
  const onCount = NOTIFICATION_CATEGORIES.filter((c) => s.cats[c.id]).length;
  return (
    <>
      <div className="st-note st-note--ok">
        <Ic n="shieldCheck" size={18} />
        <div>
          <strong>Turning notifications off never changes your service availability.</strong>
          <div>Availability is managed separately on your Home Dashboard.</div>
        </div>
      </div>

      <div className="st-grp">
        <div className="st-gt">Delivery</div>
        <div className="st-panel">
          {DELIVERY.map((g) => (
            <div className="st-row" key={g.key}>
              <span className="st-tile st-tone-neutral"><Ic n={g.icon} /></span>
              <div className="st-rt"><div className="st-rt-t" id={`st-gen-${g.key}`}>{g.name}</div><div className="st-rt-d">{g.desc}</div></div>
              <PrefSwitch on={s[g.key]} labelledBy={`st-gen-${g.key}`} onToggle={() => a.toggle(g.key)} />
            </div>
          ))}
        </div>
        {!s.push && <p className="st-foot">Push alerts are off on this device. Your service availability is unchanged.</p>}
      </div>

      <div className="st-grp">
        <div className="st-gt-row"><div className="st-gt">Categories</div><span className="st-aside">{onCount} of {NOTIFICATION_CATEGORIES.length} on · each category is independent</span></div>
        {NOTIFICATION_GROUPS.map((g) => (
          <div className="st-sub" key={g.id}>
            <div className="st-subgt">{g.title}</div>
            <div className="st-panel st-clip">
              {NOTIFICATION_CATEGORIES.filter((c) => c.group === g.id).map((c) => {
                const on = !!s.cats[c.id];
                const expanded = !!c.events && !!open[c.id];
                return (
                  <div className="st-cat" key={c.id}>
                    <div className="st-row">
                      <span className={`st-tile ${on ? 'st-tone-ok' : 'st-tone-off'}`}><Ic n={c.icon} /></span>
                      <div className="st-rt">
                        <div className="st-rt-t" id={`st-cat-${c.id}`}>{c.name}</div>
                        <div className="st-rt-d">{c.desc}</div>
                        {c.events && (
                          <button type="button" className="st-linksm" aria-expanded={expanded} onClick={() => setOpen({ ...open, [c.id]: !open[c.id] })}>
                            {expanded ? 'Hide alerts' : `Manage ${c.events.length} ${c.events.length > 1 ? 'alerts' : 'alert'}`}
                            <Ic n="chevronDown" size={14} className={expanded ? 'is-flip' : ''} />
                          </button>
                        )}
                      </div>
                      <PrefSwitch on={on} labelledBy={`st-cat-${c.id}`} onToggle={() => a.toggleCategory(c.id)} />
                    </div>
                    {expanded && (
                      <div className="st-events">
                        <div className="st-evbox">
                          {c.events.map((e) => (
                            <div className="st-ev" key={e.id}>
                              <div className="st-rt"><div className="st-ev-t" id={`st-ev-${e.id}`}>{e.name}</div><div className="st-rt-d">{e.desc}</div></div>
                              <PrefSwitch small on={on && !!s.events[e.id]} disabled={!on} labelledBy={`st-ev-${e.id}`} onToggle={() => a.toggleEvent(e.id)} />
                            </div>
                          ))}
                          {!on && <div className="st-evnote">Turn on {c.name} to manage these alerts.</div>}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              {g.id === 'account' && (
                <div className="st-cat">
                  <div className="st-row st-row--sec">
                    <span className="st-tile st-tone-ok"><Ic n="shieldCheck" /></span>
                    <div className="st-rt">
                      <div className="st-rt-line"><span className="st-rt-t">Security alerts</span><span className="st-chip st-tone-ok">Mandatory</span></div>
                      <div className="st-rt-d">New-device sign-ins, password changes and other critical account alerts are always delivered. They can't be turned off.</div>
                    </div>
                    <span className="st-chip st-chip--lg st-chip--line st-tone-ok"><Ic n="check" size={14} />Always on</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
