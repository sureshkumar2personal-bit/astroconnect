// Settings switch (reference `.switch`): `labelledBy` is the id of the text that names it.
export default function PrefSwitch({ on, onToggle, labelledBy, small, disabled }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-labelledby={labelledBy}
      data-on={on}
      disabled={disabled}
      className={`st-switch${small ? ' st-switch--sm' : ''}`}
      onClick={onToggle}
    />
  );
}
