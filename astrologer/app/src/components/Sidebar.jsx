import Icon from './Icon.jsx';
import Logo from './Logo.jsx';
import { mainNav, secondaryNav } from '../data/mockHome.js';

// Desktop/tablet navigation. Destinations other than Home are separate modules (AD-23).
export default function Sidebar({ theme, active = 'home' }) {
  return (
    <nav aria-label="Main" className="ac-sidebar">
      <Logo theme={theme} className="ac-sidebar__logo" />
      {mainNav.map((n) => (
        <a key={n.key} href="#" onClick={(e) => e.preventDefault()} aria-current={n.key === active ? 'page' : undefined} className={`ac-navlink ${n.key === active ? 'is-active' : ''}`}>
          <Icon name={n.icon} size={24} stroke={n.key === active ? 1.9 : 1.8} />
          {n.label}
        </a>
      ))}
      <div className="ac-sidebar__rule" />
      {secondaryNav.map((n) => (
        <a key={n.key} href="#" onClick={(e) => e.preventDefault()} className="ac-navlink ac-navlink--small">
          <Icon name={n.icon} size={22} />
          {n.label}
        </a>
      ))}
    </nav>
  );
}
