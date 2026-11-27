import { ABOUT_TEXT, APP_VERSION } from '@/data/mockSettings.js';
import Ic from './stIcons.jsx';

// About and Account Actions (AD-157): app version, About AstroConnect, Logout, and requests for
// account deactivation / deletion — routed to Platform Admin, never applied instantly (SET-04).
export default function AboutActions({ s, openModal }) {
  const pending = (
    <span className="st-chip st-chip--lg st-tone-gold"><Ic n="clock" size={14} />Pending admin review</span>
  );
  return (
    <>
      <div className="st-grp">
        <div className="st-gt">App information</div>
        <div className="st-panel st-clip">
          <div className="st-ident">
            <span className="st-tile st-tile--app"><Ic n="radio" size={22} /></span>
            <div className="st-ident__main"><div className="st-ident__name">AstroConnect</div><div className="st-rt-d">Astrologer Portal</div></div>
          </div>
          <div>
            <div className="st-dl"><span className="st-dl__k">App version</span><span className="st-dl__v">{APP_VERSION}</span></div>
            <div className="st-dl st-dl--top"><span className="st-dl__k">About AstroConnect</span><span className="st-dl__v st-dl__v--text">{ABOUT_TEXT}</span></div>
          </div>
        </div>
      </div>

      <div className="st-grp">
        <div className="st-gt">Session</div>
        <div className="st-panel">
          <div className="st-row st-row--wrap">
            <span className="st-tile st-tone-neutral"><Ic n="logout" /></span>
            <div className="st-rt"><div className="st-rt-t">Log out</div><div className="st-rt-d">Sign out of AstroConnect on this device.</div></div>
            <button type="button" className="st-btn st-btn--sec st-btn--sm" onClick={() => openModal({ type: 'logout' })}>Log out</button>
          </div>
        </div>
      </div>

      <div className="st-grp">
        <div className="st-sep"><span className="st-gt st-gt--bad">Account requests</span></div>
        <p className="st-foot">These are requests to Platform Admin. Your account isn't deactivated or deleted immediately. It stays active until Platform Admin approves the request.</p>
        <div className="st-panel st-panel--bad st-clip">
          <div className="st-row st-row--wrap">
            <span className="st-tile st-tone-neutral"><Ic n="pause" /></span>
            <div className="st-rt"><div className="st-rt-t">Request account deactivation</div><div className="st-rt-d">Ask Platform Admin to temporarily deactivate your account.</div></div>
            {s.deactReq ? pending : <button type="button" className="st-btn st-btn--sec st-btn--sm" onClick={() => openModal({ type: 'deact' })}>Request deactivation</button>}
          </div>
          <div className="st-row st-row--wrap st-row--bad">
            <span className="st-tile st-tone-bad"><Ic n="trash" /></span>
            <div className="st-rt"><div className="st-rt-t st-bad-t">Request account deletion</div><div className="st-rt-d">Ask Platform Admin to permanently delete your account and its data.</div></div>
            {s.delReq ? pending : <button type="button" className="st-btn st-btn--dangerline st-btn--sm" onClick={() => openModal({ type: 'delete' })}>Request deletion</button>}
          </div>
        </div>
      </div>
    </>
  );
}
