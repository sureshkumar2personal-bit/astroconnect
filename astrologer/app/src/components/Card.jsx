import Icon from './Icon.jsx';

// Shared card shell: surface + header (icon, serif title, optional extras).
export default function Card({ id, icon, iconStroke, title, children, extra, className = '', info = false, headClass = '' }) {
  return (
    <section aria-labelledby={id} className={`ac-card ${className}`}>
      <div className={`ac-card__head ${headClass}`}>
        <Icon name={icon} size={28} stroke={iconStroke} className="ac-icon ac-card__icon" />
        <h2 id={id} className="ac-card__title">{title}</h2>
        {extra}
        {info && <Icon name="info" size={22} label="Info" className="ac-info" />}
      </div>
      {children}
    </section>
  );
}
