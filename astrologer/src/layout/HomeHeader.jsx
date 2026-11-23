import Icon from '@/components/ui/Icon.jsx';
import Bell from '@/components/ui/Bell.jsx';
import Logo from '@/components/ui/Logo.jsx';
import ThemeToggle from '@/components/ui/ThemeToggle.jsx';
import ProfileMenu from '@/components/ui/ProfileMenu.jsx';
import AvailabilityControls from '@/components/home/AvailabilityControls.jsx';
import MoreMenu from './MoreMenu.jsx';

// Home sticky header, in this order: logo · Online/Offline · Instant Call · Instant Chat · DND
// (+ Planned Unavailability) · date · light/dark · notifications · profile menu (View Profile, Logout).
// Phones: row 1 logo + date + theme/bell/profile + "All sections"; row 2 the availability pills.
// Below it, Welcome & Profile (AD-02): avatar + greeting only.
export default function HomeHeader({ theme, onToggleTheme, name, initial, unread, dateLabel, availability, ui }) {
  return (
    <>
      <header className="ac-topbar">
        <Logo theme={theme} className="ac-topbar__logo" />
        <AvailabilityControls a={availability} ui={ui} />
        <div className="ac-topbar__meta">
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
            <h1 className="ac-h1">Good morning, {name}</h1>
            <p className="ac-header__sub">
              You're guiding lives and creating positive change. Keep going!
              <Icon name="spark" size={18} className="ac-icon ac-header__spark" />
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
