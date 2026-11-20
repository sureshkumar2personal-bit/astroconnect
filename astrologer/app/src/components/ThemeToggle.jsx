import Icon from './Icon.jsx';

// Not part of the reference HTML; a minimal control added because the task
// requires a working Light/Dark toggle.
export default function ThemeToggle({ theme, onToggle }) {
  const next = theme === 'dark' ? 'light' : 'dark';
  return (
    <button type="button" className="ac-iconbtn ac-theme-toggle" onClick={onToggle} aria-label={`Switch to ${next} mode`} title={`Switch to ${next} mode`}>
      <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={22} />
    </button>
  );
}
