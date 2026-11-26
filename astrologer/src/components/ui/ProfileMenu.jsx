import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Icon from './Icon.jsx';
import RowChevron from './RowChevron.jsx';

// Header profile button (avatar initial). Opens a small menu centred under it:
// View Profile → Profile page, Logout → onLogout. Closes on outside click, Esc, or a choice.
// Keyboard: Enter/Space/↓ opens and focuses the first item; ↑/↓ move; Tab/Esc close.
export default function ProfileMenu({ initial, onLogout }) {
  const [open, setOpen] = useState(false);
  const [shift, setShift] = useState(0);
  const wrap = useRef(null);
  const menu = useRef(null);
  const btn = useRef(null);

  const close = (focusButton) => { setOpen(false); if (focusButton) btn.current?.focus(); };
  const items = () => [...(menu.current?.querySelectorAll('[role=menuitem]') || [])];

  // Centred under the button, but kept 8px inside the viewport.
  useLayoutEffect(() => {
    if (!open) { setShift(0); return; }
    const r = menu.current.getBoundingClientRect();
    const vw = document.documentElement.clientWidth;
    setShift(r.right > vw - 8 ? vw - 8 - r.right : r.left < 8 ? 8 - r.left : 0);
    items()[0]?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => { if (!wrap.current.contains(e.target)) close(false); };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);

  const onMenuKey = (e) => {
    const list = items(); const i = list.indexOf(document.activeElement);
    if (e.key === 'Escape') { e.preventDefault(); close(true); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); list[(i + 1) % list.length].focus(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); list[(i - 1 + list.length) % list.length].focus(); }
    else if (e.key === 'Home') { e.preventDefault(); list[0].focus(); }
    else if (e.key === 'End') { e.preventDefault(); list[list.length - 1].focus(); }
    else if (e.key === 'Tab') close(false);
  };
  const choose = (fn) => () => { close(true); fn(); };

  return (
    <div className="ac-profile" ref={wrap}>
      <button type="button" ref={btn} className="ac-profile__btn" aria-label="Profile menu" title="Profile"
        aria-haspopup="menu" aria-expanded={open} aria-controls="ac-profile-menu"
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => { if (e.key === 'ArrowDown' && !open) { e.preventDefault(); setOpen(true); } }}>
        <span className="ac-profile__avatar" aria-hidden="true">{initial}</span>
        <RowChevron open={open} className="ac-profile__chev" />
      </button>
      {open && (
        <div id="ac-profile-menu" ref={menu} role="menu" aria-label="Profile" className="ac-profile__menu"
          style={{ '--shift': `${shift}px` }} onKeyDown={onMenuKey}>
          <button type="button" role="menuitem" className="ac-profile__item" onClick={choose(() => { window.location.hash = '/profile'; })}>
            <Icon name="user" size={18} />View Profile
          </button>
          <button type="button" role="menuitem" className="ac-profile__item" onClick={choose(onLogout)}>
            <Icon name="logout" size={18} />Logout
          </button>
        </div>
      )}
    </div>
  );
}
