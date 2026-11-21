import { BtnRow, Note, Sec } from '../section/kit.jsx';
import { APP_VERSION } from '@shared/data/mockSettings.js';
import { settingsActions } from '@shared/hooks/useSettings.js';
import { AccountRequest } from './SettingsDialogs.jsx';
import { openDoc } from './PrivacySecurity.jsx';

// About & Account Actions (AD-157): App Version, About AstroConnect, Logout, Request Account
// Deactivation / Deletion. Requests go to Platform Admin for approval — never applied instantly
// (SET-04). Request statuses are not defined in the spec. Prototype: Logout does not sign out.
export default function AboutActions({ s, ui }) {
  const request = (kind) => ui.dialog({
    title: kind,
    body: (close) => <AccountRequest onCancel={close} onSend={() => { settingsActions.sendRequest(kind); close(); }} />,
  });
  return (
    <Sec title="About & Account Actions">
      <div className="row"><span className="grow">App version</span><b>{APP_VERSION}</b></div>
      <button type="button" className="st-link" onClick={() => openDoc(ui, 'About AstroConnect')}>About AstroConnect</button>
      {s.request && <Note>{s.request} sent to Platform Admin for approval.</Note>}
      <BtnRow>
        <button type="button" className="btn btn-o" onClick={() => ui.toast('Logout (prototype)')}>Logout</button>
        <button type="button" className="btn btn-o danger" onClick={() => request('Account deactivation request')}>Request Account Deactivation</button>
        <button type="button" className="btn btn-o danger" onClick={() => request('Account deletion request')}>Request Account Deletion</button>
      </BtnRow>
      <span className="muted sm">Requests go to Platform Admin; nothing is deactivated or deleted instantly.</span>
    </Sec>
  );
}
