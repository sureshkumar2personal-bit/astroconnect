import Icon from '@shared/components/Icon.jsx';
import Logo from '@shared/components/Logo.jsx';
import { mainNav, secondaryNav, navHref, workNav } from '@shared/data/mockHome.js';
import { PendingTag } from '@shared/components/ui.jsx';

// Desktop/tablet navigation: the five main tabs (AD-03) and the "More" pages.
// My Work shows its sub-pages while it is active.
export default function Sidebar({ theme, active = 'home', workView }) {
  const inert = (e) => e.preventDefault();
  return (
    <nav aria-label="Main" className="ac-sidebar">
      <Logo theme={theme} className="ac-sidebar__logo" />
      {mainNav.map((n) => (
        <div key={n.key} className="ac-navgroup">
          <a href={navHref[n.key] || '#'} onClick={navHref[n.key] ? undefined : inert} aria-current={n.key === active && !workView ? 'page' : undefined} className={`ac-navlink ${n.key === active ? 'is-active' : ''}`}>
            <Icon name={n.icon} size={24} stroke={n.key === active ? 1.9 : 1.8} />
            {n.label}
          </a>
          {n.key === 'work' && active === 'work' && (
            <div className="ac-subnav">
              {workNav.map((s) =>
                s.rule ? (
                  <div key={s.key} className="ac-subnav__rule" />
                ) : (
                  <a key={s.key} href={s.href || '#'} onClick={s.href ? undefined : inert} aria-current={s.key === workView ? 'page' : undefined} className={`ac-sublink ${s.key === workView ? 'is-active' : ''}`}>
                    {s.label}
                  </a>
                )
              )}
            </div>
          )}
        </div>
      ))}
      <div className="ac-sidebar__rule" />
      <span className="ac-sidebar__grp">More</span>
      {secondaryNav.map((n) => (
        <a key={n.key} href={n.href} aria-current={n.key === active ? 'page' : undefined} className={`ac-navlink ac-navlink--small ${n.key === active ? 'is-active' : ''}`}>
          <Icon name={n.icon} size={22} />
          {n.label}
        </a>
      ))}
      <span className="ac-sidebar__pend"><PendingTag id="AP-GL-02 placement" /></span>
    </nav>
  );
}
