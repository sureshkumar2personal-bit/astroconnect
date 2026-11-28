import { href } from '../../../router/useHashRoute.js';
import { astrologerProfilePath } from '../../../router/navigation.js';
import { Avatar } from '../../Users/components/UserBits.jsx';
import { AssistantStatus, RoleTag, TypeTag } from '../../Assistants/components/AssistantBits.jsx';
import { Fields, Section, dt } from '../../UserProfile/components/ui.jsx';

// Tab 1 — Profile. Profile photo is optional (initials otherwise).
export default function ProfileTab({ assistant: a }) {
  const lastLogin = [...a.events].reverse().find((e) => e.action === 'Signed in')?.at;
  return (
    <div className="p-stack">
      <Section id="sp-profile" title="Personal Details">
        <Fields
          items={[
            ['Profile Photo', <Avatar key="p" user={a} size={32} />],
            ['Name', a.name],
            ['Assistant ID', a.id],
            ['Email', <span className="p-break" key="e">{a.email}</span>],
            ['Mobile Number', a.mobile],
            ['Email Verification', a.acceptedAt ? 'Verified' : 'Not verified'],
          ]}
        />
      </Section>
      <Section id="sp-account" title="Assistant Details">
        <Fields
          items={[
            ['Role', <RoleTag key="r" role={a.role} />],
            ['Assistant Type', <TypeTag key="t" type={a.type} />],
            a.type === 'Astrologer Assistant'
              ? ['Assigned Astrologer', <a key="a" className="u-name" href={href(astrologerProfilePath(a.astrologer.id))}>{a.astrologer.name} ({a.astrologer.id})</a>]
              : ['Departments', a.departments.join(', ')],
            ['Created / Invitation Date', dt(a.invitedAt)],
            ['Invited By', `${a.invitedBy.name} (${a.invitedBy.role})`],
            ['Account Status', <AssistantStatus key="s" status={a.status} />],
            ['Last Login', dt(lastLogin)],
            ['Last Active', dt(a.lastActiveAt)],
          ]}
        />
        <p className="p-small p-muted">
          {a.type === 'Astrologer Assistant'
            ? `Works only for ${a.astrologer.name}, inside that astrologer’s dashboard. Managed by the astrologer.`
            : 'Works inside the Platform Admin Dashboard, limited to the assigned departments. Managed by Super Admin.'}
        </p>
      </Section>
    </div>
  );
}
