import BrandMark from '../components/BrandMark.jsx';
import Icon from '../components/icons.jsx';
import AccountMenu from './AccountMenu.jsx';

export default function Header({ title, group, session, onSignOut, onOpenNav, navOpen, navId }) {
  return (
    <header className="topbar">
      <button
        type="button"
        className="icon-btn topbar__menu"
        aria-label="Open navigation"
        aria-expanded={navOpen}
        aria-controls={navId}
        onClick={onOpenNav}
      >
        <Icon name="menu" />
      </button>
      <div className="topbar__brand">
        <BrandMark />
      </div>
      <div className="topbar__title">
        {group && <span className="topbar__crumb">{group}</span>}
        <span className="topbar__page">{title}</span>
      </div>
      <AccountMenu session={session} onSignOut={onSignOut} />
    </header>
  );
}
