import Icon from './Icon.jsx';
import { mainNav } from '../data/mockHome.js';

// Mobile navigation: exactly five tabs (AD-03).
export default function BottomNav({ active = 'home' }) {
  return (
    <nav aria-label="Main" className="ac-bottomnav">
      {mainNav.map((n) => (
        <a key={n.key} href="#" onClick={(e) => e.preventDefault()} aria-current={n.key === active ? 'page' : undefined} className={`ac-bottomnav__item ${n.key === active ? 'is-active' : ''}`}>
          <Icon name={n.icon} size={24} />
          {n.label}
        </a>
      ))}
    </nav>
  );
}
