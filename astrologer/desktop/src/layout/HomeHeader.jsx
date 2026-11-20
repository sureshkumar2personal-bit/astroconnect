import Icon from '@shared/components/Icon.jsx';
import Bell from '@shared/components/Bell.jsx';
import Logo from '@shared/components/Logo.jsx';
import ThemeToggle from '@shared/components/ThemeToggle.jsx';

// Welcome & Profile (AD-02): name, profile photo, notification access.
// Desktop: avatar + greeting + date/bell/account. Mobile: brand row + bell, then avatar + greeting.
export default function HomeHeader({ theme, onToggleTheme, name, initial, unread, dateLabel }) {
  return (
    <header className="ac-header">
      <div className="ac-header__brand">
        <Logo theme={theme} className="ac-header__logo" />
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        <Bell unread={unread} />
      </div>

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

      <div className="ac-header__actions">
        <div className="ac-datechip"><Icon name="calendar" size={20} className="ac-icon" />{dateLabel}</div>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        <Bell unread={unread} />
        <button type="button" aria-label="Account menu" className="ac-account">
          <span className="ac-account__avatar">{initial}</span>
          <Icon name="chevronDown" size={20} stroke={2} />
        </button>
      </div>
    </header>
  );
}
