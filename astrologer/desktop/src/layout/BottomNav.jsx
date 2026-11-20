import Icon from '@shared/components/Icon.jsx';
import { mainNav, navHref } from '@shared/data/mockHome.js';

// Mobile navigation: exactly five tabs (AD-03). Home and My Work navigate.
export default function BottomNav({ active = 'home' }) {
  return (
    <nav aria-label="Main" className="ac-bottomnav">
      {mainNav.map((n) => (
        <a key={n.key} href={navHref[n.key] || '#'} onClick={navHref[n.key] ? undefined : (e) => e.preventDefault()} aria-current={n.key === active ? 'page' : undefined} className={`ac-bottomnav__item ${n.key === active ? 'is-active' : ''}`}>
          <Icon name={n.icon} size={24} />
          {n.label}
        </a>
      ))}
    </nav>
  );
}
