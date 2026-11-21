import { Badge, Sec } from '../section/kit.jsx';
import { LEGAL_DOCS } from '@shared/data/mockSettings.js';
import { settingsActions } from '@shared/hooks/useSettings.js';
import { PlatformDoc } from './SettingsDialogs.jsx';

// Privacy & Security (AD-156): policy documents, Active Login Sessions, Logout from other devices
// (ends the other sessions listed, SET-05). Prototype: no session is really ended.
export function openDoc(ui, name) {
  ui.dialog({ title: name, body: (close) => <PlatformDoc name={name} onClose={close} /> });
}

export default function PrivacySecurity({ s, ui }) {
  const others = s.sessions.some((x) => !x.current);
  return (
    <Sec title="Privacy & Security">
      <div className="stack">
        {LEGAL_DOCS.map((d) => <button key={d} type="button" className="st-link" onClick={() => openDoc(ui, d)}>{d}</button>)}
      </div>
      <b className="sm">Active login sessions</b>
      {s.sessions.map((x) => (
        <div key={x.id} className="row">
          <span className="grow sm"><b>{x.name}</b><br />{x.where}</span>
          {x.current && <Badge kind="ok">This device</Badge>}
        </div>
      ))}
      <button type="button" className="btn btn-o danger" disabled={!others}
        onClick={() => { settingsActions.logoutOthers(); ui.toast('Logged out from other devices'); }}>
        Logout from other devices
      </button>
    </Sec>
  );
}
