import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import Icon from '../../../components/icons.jsx';
import { href } from '../../../router/useHashRoute.js';
import { userProfilePath } from '../../../router/navigation.js';
import { ACTIONS, TRANSITIONS } from '../../../data/usersStore.js';

const ACTION_ICONS = {
  suspend: 'userPause',
  block: 'userBlock',
  reactivate: 'userCheck',
  unblock: 'userCheck',
};

// Row actions: View Profile plus only the status actions valid for the
// user's current status. The menu is positioned "fixed" so a scrolling
// table never clips it.
export default function ActionsMenu({ user, onAction, profileHref, actionList }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState(null);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const menuId = useId();
  // `actionList` ([{ key, label, icon, danger }]) lets other screens supply
  // their own documented actions; otherwise the Users transitions apply.
  const actions = actionList ?? (TRANSITIONS[user.status] ?? []).map((key) => ({ key, label: ACTIONS[key].label, icon: ACTION_ICONS[key], danger: key === 'block' }));

  useLayoutEffect(() => {
    if (!open) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const menuH = menuRef.current?.offsetHeight ?? 160;
    const below = rect.bottom + 6 + menuH < window.innerHeight;
    setPos({
      top: below ? rect.bottom + 6 : rect.top - 6 - menuH,
      right: Math.max(8, window.innerWidth - rect.right),
    });
  }, [open]);

  // Move focus into the menu once it has been positioned.
  useEffect(() => {
    if (open && pos) menuRef.current?.querySelector('[role=menuitem]')?.focus({ preventScroll: true });
  }, [open, pos]);

  useEffect(() => {
    if (!open) return undefined;
    const close = () => setOpen(false);
    function onScroll(e) {
      if (!menuRef.current?.contains(e.target)) close();
    }
    function onPointer(e) {
      if (!menuRef.current?.contains(e.target) && !buttonRef.current?.contains(e.target)) close();
    }
    function onKey(e) {
      if (e.key === 'Escape') {
        close();
        buttonRef.current?.focus();
      }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const items = [...menuRef.current.querySelectorAll('[role=menuitem]')];
        const i = items.indexOf(document.activeElement);
        const next = e.key === 'ArrowDown' ? (i + 1) % items.length : (i - 1 + items.length) % items.length;
        items[next]?.focus();
      }
      if (e.key === 'Tab') close();
    }
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    // Attach scroll/resize closing one frame later so scroll events caused by
    // opening (focus, layout) do not close the menu immediately.
    const frame = requestAnimationFrame(() => {
      window.addEventListener('scroll', onScroll, true);
      window.addEventListener('resize', close);
    });
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', close);
    };
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="u-more"
        aria-label={`Actions for ${user.name}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((v) => !v)}
      >
        <Icon name="more" size={18} />
      </button>
      {open && (
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-label={`Actions for ${user.name}`}
          className="u-menu"
          style={pos ? { top: pos.top, right: pos.right } : { visibility: 'hidden' }}
        >
          <a role="menuitem" className="u-menu__item" href={profileHref ?? href(userProfilePath(user.id))}>
            <Icon name="eye" size={17} />
            View Profile
          </a>
          {actions.length > 0 && <div className="u-menu__sep" role="separator" />}
          {actions.map(({ key, label, icon, danger }) => (
            <button
              key={key}
              type="button"
              role="menuitem"
              className={`u-menu__item${danger ? ' is-danger' : ''}`}
              onClick={() => {
                setOpen(false);
                onAction(user, key);
              }}
            >
              <Icon name={icon} size={17} />
              {label}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
