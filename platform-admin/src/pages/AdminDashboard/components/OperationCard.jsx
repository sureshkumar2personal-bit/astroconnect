import Icon from '../../../components/icons.jsx';
import { EmptyNote, ModuleLink } from './Common.jsx';

// Section C — one Today's Operations block: count, optional note, a short
// preview of records and one or more links to the owning module.
export default function OperationCard({
  icon,
  title,
  count,
  countLabel,
  note,
  items = [],
  previewLimit = 3,
  renderItem,
  emptyText,
  links,
  children,
}) {
  const preview = items.slice(0, previewLimit);
  const more = items.length - preview.length;
  return (
    <section className="op" aria-label={title}>
      <header className="op__head">
        <span className="op__icon">
          <Icon name={icon} size={18} />
        </span>
        <h3 className="op__title">{title}</h3>
      </header>
      <div className="op__count">
        <span className="op__number">{count}</span>
        <span className="op__count-label">{countLabel}</span>
      </div>
      {note && <div className="op__note">{note}</div>}
      {children}
      {renderItem &&
        (preview.length ? (
          <ul className="op__list">
            {preview.map((item) => (
              <li key={item.id}>{renderItem(item)}</li>
            ))}
            {more > 0 && <li className="op__more">+{more} more</li>}
          </ul>
        ) : (
          <EmptyNote>{emptyText}</EmptyNote>
        ))}
      <footer className="op__links">
        {links.map((l) => (
          <ModuleLink key={l.path} path={l.path}>
            {l.label}
          </ModuleLink>
        ))}
      </footer>
    </section>
  );
}
