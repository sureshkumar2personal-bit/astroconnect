import Icon from '@/components/ui/Icon.jsx';

// Exactly four Quick Actions and their destinations (AD-21), shown beside the greeting:
// icon tile · title · one-line description · arrow.
export default function QuickActionsCard({ actions }) {
  return (
    <nav id="h-qa" className="ac-qa" aria-label="Quick Actions">
      {actions.map((q) => (
        <a key={q.label} href={q.href} className="ac-qa__tile" aria-label={q.sub ? `${q.label}: ${q.sub}` : q.label}>
          <span className="ac-qa__ic" aria-hidden="true"><Icon name={q.icon} size={20} stroke={1.8} /></span>
          <span className="ac-qa__txt">
            {/* Phones show the short label (Campaign, Go Live, Content, Remedy) so it never wraps. */}
            <b><span className="ac-qa__long">{q.label}</span><span className="ac-qa__short">{q.short || q.label}</span></b>
            {q.sub && <span>{q.sub}</span>}
          </span>
          <Icon name="chevronRight" size={18} className="ac-qa__go" />
        </a>
      ))}
    </nav>
  );
}
