import Toggle from '@shared/components/Toggle.jsx';

// One settings switch row (reference `row` + `sw`): text on the left, switch on the right.
// `small` uses the smaller text of the category/event lists; `label` is the switch's accessible name.
export default function PrefSwitch({ children, label, small, on, onToggle, disabled }) {
  return (
    <div className="row st-sw">
      <span className={`grow${small ? ' sm' : ''}`}>{children}</span>
      <Toggle on={on} label={label} onToggle={onToggle} disabled={disabled} />
    </div>
  );
}
