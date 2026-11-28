import { useEffect, useId, useRef, useState } from 'react';
import Icon from '../components/icons.jsx';

function initials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

// Admin profile button with a small account menu. Sign Out is the only
// action: profile and settings screens are not defined yet.
export default function AccountMenu({ session, onSignOut }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const firstItemRef = useRef(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return undefined;
    firstItemRef.current?.focus();
    function onPointer(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }
    function onKey(event) {
      if (event.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="account" ref={rootRef}>
      <button
        ref={buttonRef}
        type="button"
        className="account__button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="avatar" aria-hidden="true">
          {initials(session.fullName) || 'A'}
        </span>
        <span className="account__text">
          <span className="account__name">{session.fullName}</span>
          <span className="account__role">Admin</span>
        </span>
        <Icon name="chevronDown" size={16} className="account__chevron" />
      </button>

      {open && (
        <div id={menuId} className="account__menu" role="menu" aria-label="Account">
          <div className="account__info" role="none">
            <span className="account__info-name">{session.fullName}</span>
            <span className="account__info-email">{session.email}</span>
          </div>
          <button
            ref={firstItemRef}
            type="button"
            role="menuitem"
            className="account__item"
            onClick={onSignOut}
          >
            <Icon name="signOut" size={18} />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
