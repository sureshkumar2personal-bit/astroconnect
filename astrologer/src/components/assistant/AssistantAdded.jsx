import Icon from '@/components/ui/Icon.jsx';
import { navigate } from '@/lib/router.js';
import { roleLabel, useAssistants } from '@/hooks/useAssistants.js';

/** "Invitation sent successfully" confirmation. */
export default function AssistantAdded({ id }) {
  const { assistants } = useAssistants();
  const a = assistants.find((x) => x.id === id);
  if (!a) return <div className="as"><div className="as-empty"><b>Assistant not found</b><button type="button" className="btn btn-o" onClick={() => navigate('/assistants')}>Go to My Assistants</button></div></div>;
  return (
    <div className="as">
      <section className="as-card as-done">
        <span className="as-done__ic"><Icon name="check" size={28} stroke={2.4} /></span>
        <h2 className="as-h1">Invitation sent successfully</h2>
        <p className="as-muted">We emailed an invitation link to {a.email}. They now appear in My Assistants as Pending.</p>
        <dl className="as-facts">
          <div><dt>Assistant name</dt><dd>{a.name}</dd></div><div><dt>Email address</dt><dd>{a.email}</dd></div>
          <div><dt>Assistant ID</dt><dd>{a.id}</dd></div><div><dt>Role</dt><dd>{roleLabel(a.role)}</dd></div>
          <div><dt>Status</dt><dd>Pending</dd></div><div><dt>Invitation validity</dt><dd>7 days · expires {a.expires}</dd></div>
        </dl>
        <div className="as-next"><b>What happens next</b>
          <ol><li>The assistant verifies their email address from the invitation link.</li><li>They set up a password and accept the invitation.</li><li>The account turns Active. If not accepted in 7 days it becomes Expired and you can resend it.</li></ol></div>
        <div className="as-done__btns"><button type="button" className="btn as-btn" onClick={() => navigate('/assistants')}>Go to My Assistants</button><button type="button" className="btn btn-o" onClick={() => navigate(`/assistants/${a.id}`)}>View Assistant Details</button></div>
      </section>
    </div>
  );
}
