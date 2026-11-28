import { useEffect, useState } from 'react';
import BrandMark from '../components/BrandMark.jsx';
import Icon from '../components/icons.jsx';
import { NAV, findRoute } from '../router/navigation.js';
import { href } from '../router/useHashRoute.js';

// Sidebar with collapsible module groups. The group that contains the current
// page opens automatically; the others keep whatever the admin chose.
export default function Sidebar({ path: currentPath, id, isDrawer, isOpen, onClose }) {
  const route = findRoute(currentPath);
  const activeGroup = route?.groupId ?? null;
  // Detail pages (e.g. a user profile) highlight their parent entry.
  const path = route?.navPath ?? currentPath;
  const [openGroups, setOpenGroups] = useState(() => new Set(activeGroup ? [activeGroup] : []));

  useEffect(() => {
    if (!activeGroup) return;
    setOpenGroups((prev) => (prev.has(activeGroup) ? prev : new Set(prev).add(activeGroup)));
  }, [activeGroup]);

  function toggle(groupId) {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) next.delete(groupId);
      else next.add(groupId);
      return next;
    });
  }

  return (
    <aside
      id={id}
      className={`sidebar${isOpen ? ' is-open' : ''}`}
      aria-label="Platform Admin"
      {...(isDrawer ? { role: 'dialog', 'aria-modal': isOpen } : {})}
      inert={isDrawer && !isOpen ? true : undefined}
    >
      <div className="sidebar__top">
        <a className="sidebar__brand" href={href('/dashboard')}>
          <BrandMark />
        </a>
        <span className="sidebar__role">Platform Admin</span>
        {isDrawer && (
          <button
            type="button"
            className="icon-btn sidebar__close"
            aria-label="Close navigation"
            onClick={onClose}
          >
            <Icon name="close" />
          </button>
        )}
      </div>

      <nav className="sidebar__nav" aria-label="Modules">
        <ul className="nav">
          {NAV.map((item) =>
            item.children ? (
              <li key={item.id} className="nav__group">
                <button
                  type="button"
                  className={`nav__item nav__toggle${activeGroup === item.id ? ' has-active' : ''}`}
                  aria-expanded={openGroups.has(item.id)}
                  aria-controls={`nav-${item.id}`}
                  onClick={() => toggle(item.id)}
                >
                  <Icon name={item.icon} />
                  <span className="nav__label">{item.label}</span>
                  <Icon name="chevronDown" size={16} className="nav__chevron" />
                </button>
                <ul id={`nav-${item.id}`} className="nav__children" hidden={!openGroups.has(item.id)}>
                  {item.children.map((child) => (
                    <li key={child.path}>
                      <a
                        className={`nav__child${path === child.path ? ' is-active' : ''}`}
                        href={href(child.path)}
                        aria-current={path === child.path ? 'page' : undefined}
                      >
                        {child.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ) : (
              <li key={item.id}>
                <a
                  className={`nav__item${path === item.path ? ' is-active' : ''}`}
                  href={href(item.path)}
                  aria-current={path === item.path ? 'page' : undefined}
                >
                  <Icon name={item.icon} />
                  <span className="nav__label">{item.label}</span>
                </a>
              </li>
            )
          )}
        </ul>
      </nav>

      <p className="sidebar__foot">AstroConnect Platform Admin</p>
    </aside>
  );
}
