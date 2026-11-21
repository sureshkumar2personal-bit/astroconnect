import { BtnRow, Facts, Sec } from '../section/kit.jsx';
import { ACCOUNT_FACTS, SECURITY_ACTIVITY } from '@shared/data/mockSettings.js';
import { ChangePassword } from './SettingsDialogs.jsx';

// Account Settings (AD-152): account details, registered mobile/email, Change Password,
// Login/Security Activity.
export default function AccountSettings({ ui }) {
  const changePassword = () => ui.dialog({
    title: 'Change Password',
    body: (close) => <ChangePassword onCancel={close} onDone={() => { close(); ui.toast('Password changed · security notification sent'); }} />,
  });
  return (
    <Sec title="Account Settings">
      <Facts items={ACCOUNT_FACTS} />
      <BtnRow><button type="button" className="btn btn-o" onClick={changePassword}>Change Password</button></BtnRow>
      <b className="sm">Login / security activity</b>
      <ul className="st-plain">
        {SECURITY_ACTIVITY.map((x) => <li key={x} className="sm">{x}</li>)}
      </ul>
    </Sec>
  );
}
