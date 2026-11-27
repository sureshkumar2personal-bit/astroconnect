import { usedThisMonth } from '@/hooks/useLive.js';
import { nextMonthStart, thisMonthName } from './liveFormat.js';

const TABS = [['', 'Create Live'], ['history', 'Live History'], ['settings', 'Live Settings']];

/** Live Sessions header block (reference): verification, availability, the monthly limit banner and the tabs. */
export default function LiveHeader({ s, tab }) {
  const used = usedThisMonth(s) || !!s.scheduled;
  return (
    <div className="lv-head">
      <div className="lv-status">
        {s.verified
          ? <span className="lv-verified"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M8 12.5l2.6 2.6L16 9.5" /></svg>Verified</span>
          : <span className="lv-verified lv-verified--pending">Verification pending</span>}
        <span className="lv-avail"><span className={`lv-dot${used ? ' is-off' : ''}`} aria-hidden="true" />{used ? `Next live from ${nextMonthStart()}` : 'Live available this month'}</span>
      </div>
      <p className={`lv-vline${s.verified ? '' : ' is-warn'}`}>
        {s.verified ? 'Verified – Can go live without Admin approval.' : 'Not yet verified – each live needs Admin approval before it starts.'}
      </p>
      <div className="lv-limit" role="note">
        <svg className="lv-limit__ic" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M4 10h16M9 3v4M15 3v4" /></svg>
        <div className="lv-limit__txt"><b>Monthly Live Limit</b><b>1 Live per calendar month</b><span>You can schedule or start one live session each calendar month.</span></div>
        <span className={`lv-pill${used ? ' is-used' : ''}`}>{used ? `Used for ${thisMonthName()}` : `Available · 0 of 1 used in ${thisMonthName()}`}</span>
      </div>
      <nav className="lv-tabs" aria-label="Live Sessions">
        {TABS.map(([k, label]) => (
          <a key={label} href={`#/live${k ? `/${k}` : ''}`} className={`lv-tab${tab === k ? ' on' : ''}`} aria-current={tab === k ? 'page' : undefined}>{label}</a>
        ))}
      </nav>
    </div>
  );
}
