export default function Toggle({ on, label, onToggle }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={onToggle} className={`ac-switch ${on ? 'is-on' : ''}`}>
      <span className="ac-switch__knob" />
    </button>
  );
}
