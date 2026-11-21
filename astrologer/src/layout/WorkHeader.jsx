import Bell from '@/components/ui/Bell.jsx';
import Logo from '@/components/ui/Logo.jsx';
import ThemeToggle from '@/components/ui/ThemeToggle.jsx';
import MoreMenu from './MoreMenu.jsx';

function statusOf(a) {
  if (a.dnd) return { label: 'Do Not Disturb', kind: 'dnd' };
  if (a.mode === 'online') return { label: 'Online', kind: 'on' };
  return { label: 'Offline', kind: 'off' };
}

// My Work header. Desktop/tablet: breadcrumb, title, theme, status, bell, account.
// Mobile: the same brand row as Home (plus the All sections menu), then a back button and the screen title.
// Section pages outside My Work pass their own `crumb` (or none).
export default function WorkHeader({ mobile, title, subtitle, crumb = 'My Work', onBack, theme, onToggleTheme, unread, availability, profile }) {
  if (mobile) {
    return (
      <header className="mtop">
        <div className="ac-header__brand">
          <Logo theme={theme} className="ac-header__logo" />
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <Bell unread={unread} />
          <MoreMenu />
        </div>
        <div className="row">
          {onBack && <button type="button" className="back" onClick={onBack} aria-label="Back">‹</button>}
          <h1>{title}</h1>
        </div>
      </header>
    );
  }
  const s = statusOf(availability);
  return (
    <header className="top">
      <div className="grow">
        {crumb && <div className="muted">{crumb} › {title}</div>}
        <h1>{title}</h1>
        {subtitle && <p className="muted">{subtitle}</p>}
      </div>
      <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      <span className="status"><span className={`dot dot-${s.kind}`} />{s.label}</span>
      <Bell unread={unread} />
      <div className="me">
        <span className="av av-me" aria-hidden="true">{profile.initial}</span>
        <div><b>{profile.name}</b><div className="muted sm">{profile.role}</div></div>
      </div>
    </header>
  );
}
