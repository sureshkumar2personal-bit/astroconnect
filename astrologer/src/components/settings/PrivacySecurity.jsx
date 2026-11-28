import { LEGAL_DOCS } from '@/data/mockSettings.js';
import Ic from './stIcons.jsx';

// Privacy and Security (AD-156): policies, active login sessions, logout from other devices (SET-05).
export default function PrivacySecurity({ s, openModal }) {
  const others = s.sessions.filter((x) => !x.current);
  return (
    <>
      <div className="st-card">
        <section className="st-card__sec">
          <div className="st-card__h"><span className="st-gt">Policies &amp; documents</span></div>
          <div className="st-docs">
            {LEGAL_DOCS.map((d) => (
              <button type="button" className="st-linkrow" key={d.name} onClick={() => openModal({ type: 'doc', name: d.name })}>
                <span className="st-tile st-tone-gold"><Ic n="file" /></span>
                <span className="st-rt"><span className="st-rt-t">{d.name}</span><span className="st-rt-d">{d.desc}</span></span>
                <Ic n="chevronRight" size={16} />
              </button>
            ))}
          </div>
        </section>
      </div>

      <div className="st-card">
        <section className="st-card__sec">
          <div className="st-card__h"><span className="st-gt">Active sessions</span><span className="st-aside">{s.sessions.length} active {s.sessions.length > 1 ? 'sessions' : 'session'}</span></div>
          {s.sessions.map((x) => (
            <div className={`st-row${x.current ? ' st-row--cur' : ''}`} key={x.id}>
              <span className={`st-tile ${x.current ? 'st-tone-ok' : 'st-tone-neutral'}`}><Ic n={x.icon} /></span>
              <div className="st-rt">
                <div className="st-rt-line"><span className="st-rt-t">{x.name}</span>{x.current && <span className="st-chip st-chip--solid">This device</span>}</div>
                <div className="st-rt-d st-rt-meta">
                  <span>{x.place}</span><span aria-hidden="true">·</span>
                  {x.current && <span className="st-live" />}<span>{x.when}</span>
                </div>
              </div>
              {!x.current && (
                <button type="button" className="st-btn st-btn--ghost st-btn--sm" aria-label={`Log out ${x.name}`} onClick={() => openModal({ type: 'session', session: x })}>
                  <Ic n="logout" size={15} />Log out
                </button>
              )}
            </div>
          ))}
          <div className="st-panelfoot">
            <div className="st-rt-d">
              {others.length === 0 ? 'No other devices are signed in.' : `Signs out ${others.length} other ${others.length > 1 ? 'devices' : 'device'}. This device stays signed in.`}
            </div>
            <button type="button" className="st-btn st-btn--dangerline st-btn--sm" disabled={others.length === 0} onClick={() => openModal({ type: 'others' })}>Log out from other devices</button>
          </div>
        </section>
      </div>
    </>
  );
}
