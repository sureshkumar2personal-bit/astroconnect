import { useState } from 'react';
import Icon from '@/components/ui/Icon.jsx';
import { greetingFor } from '@/lib/format.js';
import Bell from '@/components/ui/Bell.jsx';
import ThemeToggle from '@/components/ui/ThemeToggle.jsx';
import ProfileMenu from '@/components/ui/ProfileMenu.jsx';
import AvailabilityControls from '@/components/home/AvailabilityControls.jsx';
import QuickActionsCard from '@/components/home/QuickActionsCard.jsx';
import MoreMenu from './MoreMenu.jsx';

// Home sticky header, in this order: AstroConnect brand · Online/Offline · Instant Call · Instant Chat · DND
// (+ Planned Unavailability) · today's earnings · date · light/dark · notifications · profile menu (View Profile, Logout).
// Phones: row 1 brand + today's earnings + theme/bell/profile + "All sections" (date under the brand); last row the availability rail.
// Below it, Welcome & Profile (AD-02): avatar + greeting, with the four Quick Actions (AD-21) beside it.
// AstroConnect brand mark (reference header): gold star emblem, name and role.
const Brand = () => (
  <a className="ac-brand" href="#/" aria-label="AstroConnect home">
    <svg className="ac-brand__emblem" width="36" height="36" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <circle cx="24" cy="24" r="21" stroke="currentColor" strokeWidth="2" />
      <circle cx="24" cy="24" r="14" stroke="currentColor" strokeWidth="1.6" strokeDasharray="2 3" />
      <path d="M24 10l3 11 11 3-11 3-3 11-3-11-11-3 11-3z" fill="currentColor" />
    </svg>
    <span className="ac-brand__txt">
      <span className="ac-brand__name">AstroConnect</span>
      <span className="ac-brand__tag">Astrologer</span>
    </span>
  </a>
);

// Today's earnings chip (illustrative data, same as the Earnings card); links to Earnings.
function EarningsChip({ today }) {
  const up = today.change >= 0;
  return (
    <a className="ac-earnchip" href="#/earnings"
      aria-label={`Today's earnings ${today.amount}, ${up ? 'up' : 'down'} ${Math.abs(today.change)}% vs ${today.versus}`}>
      <span className="ac-earnchip__txt">
        <span className="ac-earnchip__label">Today’s earnings</span>
        <span className="ac-earnchip__row">
          <span className="ac-earnchip__amt">{today.amount}</span>
          <span className={`ac-earnchip__delta${up ? '' : ' is-down'}`}>{up ? '▲' : '▼'} {Math.abs(today.change)}%</span>
        </span>
      </span>
      <svg className="ac-earnchip__spark" width="68" height="26" viewBox="0 0 68 26" aria-hidden="true">
        <path className="ac-earnchip__area" d="M2 24 L8.4 22.8 L14.8 20.1 L21.2 18.8 L27.6 15.6 L34 15.1 L40.4 12.9 L46.8 9.2 L53.2 7.8 L59.6 4.4 L66 2 L66 26 L2 26 Z" />
        <path className="ac-earnchip__line" d="M2 24 L8.4 22.8 L14.8 20.1 L21.2 18.8 L27.6 15.6 L34 15.1 L40.4 12.9 L46.8 9.2 L53.2 7.8 L59.6 4.4 L66 2" />
        <circle className="ac-earnchip__dot" cx="66" cy="2" r="2.4" />
      </svg>
    </a>
  );
}

export default function HomeHeader({ theme, onToggleTheme, name, initial, unread, dateLabel, availability, ui, earnToday, actions }) {
  // Chosen once when the app opens (the prototype has no login yet), so it does not change mid-session.
  const [greeting] = useState(() => greetingFor());
  return (
    <>
      <header className="ac-topbar">
        <Brand />
        <AvailabilityControls a={availability} ui={ui} />
        <div className="ac-topbar__meta">
          {earnToday && <EarningsChip today={earnToday} />}
          <div className="ac-datechip ac-topbar__date"><Icon name="calendar" size={18} className="ac-icon" />{dateLabel}</div>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <Bell unread={unread} />
          {/* View Profile → Profile page. Logout: prototype, same behaviour as Settings → Logout (AD-157). */}
          <ProfileMenu initial={initial} onLogout={() => ui.toast('Logout (prototype)')} />
          <MoreMenu />
        </div>
      </header>

      <div className="ac-header">
        <div className="ac-header__welcome">
          <div className="ac-avatar-ring" aria-hidden="true"><div className="ac-avatar">{initial}</div></div>
          <div className="ac-header__text">
            <h1 className="ac-h1">{greeting}, {name}</h1>
            <p className="ac-header__sub">
              You're guiding lives and creating positive change. Keep going!
              <Icon name="spark" size={18} className="ac-icon ac-header__spark" />
            </p>
          </div>
        </div>
        {actions && <QuickActionsCard actions={actions} />}
      </div>
    </>
  );
}
