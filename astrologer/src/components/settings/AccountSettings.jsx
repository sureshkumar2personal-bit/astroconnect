import { navigate } from '@/lib/router.js';
import { ACCOUNT, ACTIVITY_KIND } from '@/data/mockSettings.js';
import { fmtDate } from '@/hooks/useSettings.js';
import Ic from './stIcons.jsx';

// Account Settings (AD-152): account details, registered mobile/email, Change Password,
// Login/Security Activity. Two cards: the account (identity + password) and the sign-in activity.
export default function AccountSettings({ s, ui, openModal, go }) {
  const copyId = () => {
    try { navigator.clipboard?.writeText(ACCOUNT.id); } catch { /* clipboard unavailable */ }
    ui.toast(`Account ID ${ACCOUNT.id} copied`);
  };
  return (
    <>
      <div className="st-card">
        <section className="st-card__sec">
          <div className="st-card__h"><span className="st-gt">Account identity</span></div>
          <div className="st-ident">
            <span className="st-avatar">{ACCOUNT.initials}</span>
            <div className="st-ident__main">
              <div className="st-ident__name">{ACCOUNT.name}</div>
              <div className="st-ident__id">
                <span>Account ID</span><b>{ACCOUNT.id}</b>
                <button type="button" className="st-iconbtn st-iconbtn--sm" aria-label="Copy account ID" onClick={copyId}><Ic n="copy" size={15} /></button>
              </div>
            </div>
            <button type="button" className="st-btn st-btn--sec st-btn--sm" onClick={() => navigate('/profile')}>View My Profile</button>
          </div>
          <div>
            <div className="st-dl"><span className="st-dl__k">Account type</span><span className="st-dl__v"><span className="st-chip st-tone-gold"><Ic n="user" size={12} />{ACCOUNT.type}</span></span></div>
            <div className="st-dl"><span className="st-dl__k">Registered mobile</span><span className="st-dl__v">{ACCOUNT.mobile}</span></div>
            <div className="st-dl"><span className="st-dl__k">Registered email</span><span className="st-dl__v">{ACCOUNT.email}</span></div>
          </div>
        </section>
        <section className="st-card__sec">
          <div className="st-card__h"><span className="st-gt">Password</span></div>
          <div className="st-row st-row--wrap">
            <span className="st-tile st-tone-gold"><Ic n="key" /></span>
            <div className="st-rt"><div className="st-rt-t">Password</div><div className="st-rt-d">Last changed {fmtDate(s.pwChanged, s.fmt)}</div></div>
            <button type="button" className="st-btn st-btn--sec st-btn--sm" onClick={() => openModal({ type: 'password' })}>Change password</button>
          </div>
        </section>
      </div>

      <div className="st-card">
        <section className="st-card__sec">
          <div className="st-card__h"><span className="st-gt">Sign-in &amp; security activity</span><span className="st-aside">Most recent first</span></div>
          <div className="st-acts">
            {s.activity.map((a) => {
              const k = ACTIVITY_KIND[a.kind];
              return (
                <div className="st-act" key={a.id || `${a.kind}-${a.date.join('')}-${a.time}`}>
                  <span className={`st-tile st-tile--sm st-tone-${k.tone}`}><Ic n={k.icon} size={17} /></span>
                  <div className="st-rt">
                    <div className="st-rt-line"><span className="st-rt-t">{k.title}</span><span className={`st-chip st-tone-${k.tone}`}>{k.tag}</span></div>
                    <div className="st-rt-d">{a.detail}</div>
                  </div>
                  <div className="st-act__when"><b>{fmtDate(a.date, s.fmt)}</b><span>{a.time}</span></div>
                </div>
              );
            })}
          </div>
        </section>
        <p className="st-foot st-card__foot">Don't recognise an activity? <button type="button" className="st-link" onClick={() => go('privacy')}>Review active sessions</button></p>
      </div>
    </>
  );
}
