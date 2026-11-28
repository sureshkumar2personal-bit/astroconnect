import { useState } from 'react';
import Icon from '../../../components/icons.jsx';
import { ACTIONS, TRANSITIONS, changeStatus } from '../../../data/usersStore.js';
import { ADMIN_ROLE } from '../../../data/profileStore.js';
import StatusActionDialog from '../../Users/components/StatusActionDialog.jsx';
import { StatusBadge } from '../../Users/components/UserBits.jsx';
import { DataTable, Empty, Fields, Pill, Section, dt } from '../components/ui.jsx';
import { ConsentTable } from './ProfileTab.jsx';

const ACTION_ICONS = { suspend: 'userPause', block: 'userBlock', reactivate: 'userCheck', unblock: 'userCheck' };

// Tab 9 — Account (§12). Status actions follow the approved transitions and
// always need a reason; each creates an immutable audit entry (usersStore).
export default function AccountTab({ profile, session, refresh, notify, goToTab }) {
  const { user, account, preferences: pref } = profile;
  const [action, setAction] = useState(null);
  const actions = TRANSITIONS[user.status] ?? [];

  return (
    <div className="p-stack">
      <div className="p-grid-2">
        <Section id="a-info" title="Account Information">
          <Fields
            columns={2}
            items={[
              ['User ID', user.id],
              ['Account Type', user.accountType],
              ['Account Status', <StatusBadge key="s" status={user.status} />],
              ['Registration Date', dt(user.registeredAt)],
              ['Registration Method', account.registrationMethod],
              ['Last Login', dt(account.lastLoginAt)],
              ['Last Active', dt(user.lastActiveAt)],
              ['Account Created', dt(user.registeredAt)],
              ['Last Updated', dt(profile.statusAudit[0]?.at > account.updatedAt ? profile.statusAudit[0].at : account.updatedAt)],
            ]}
          />
        </Section>

        <Section id="a-status" title="Account Status" description="Suspended and blocked users cannot log in or use services. History, wallet and services are preserved.">
          <div className="p-status-card">
            <StatusBadge status={user.status} showRestriction />
            <div className="p-actions">
              {actions.map((key) => (
                <button
                  key={key}
                  type="button"
                  className={`u-btn${key === 'block' ? ' p-btn-danger' : ''}`}
                  onClick={() => setAction(key)}
                >
                  <Icon name={ACTION_ICONS[key]} size={16} />
                  {ACTIONS[key].label}
                </button>
              ))}
            </div>
          </div>
          <p className="p-small p-muted">
            Allowed changes: Active → Suspend or Block · Suspended → Reactivate or Block · Blocked → Unblock. A reason is
            required for every change.
          </p>
        </Section>
      </div>

      <Section id="a-history" title="Account Action History" description="Immutable record of account status changes by Admin users.">
        <DataTable
          caption="Account action history"
          rows={profile.statusAudit}
          empty={<Empty icon="document" title="No account actions recorded" />}
          columns={[
            { key: 'action', header: 'Action', primary: true, render: (h) => <span className="p-strong">{h.action}</span> },
            { key: 'prev', header: 'Previous Status', render: (h) => <Pill value={h.previousStatus} /> },
            { key: 'new', header: 'New Status', render: (h) => <Pill value={h.newStatus} /> },
            { key: 'reason', header: 'Reason', className: 'p-wrap', render: (h) => h.reason },
            { key: 'notes', header: 'Notes', className: 'p-wrap', render: (h) => h.notes || '—' },
            { key: 'by', header: 'Taken By', render: () => ADMIN_ROLE },
            { key: 'admin', header: 'Admin ID / Name', render: (h) => <span className="p-desc"><span>{h.adminName}</span><span className="p-small p-mono">{h.adminId}</span></span> },
            { key: 'at', header: 'Date / Time', render: (h) => dt(h.at) },
          ]}
        />
      </Section>

      <div className="p-grid-2">
        <Section
          id="a-delete"
          title="Account Deletion"
          description="Users delete their own account from the app; no Admin review is required. Legally or financially required records are kept and de-identified where possible."
        >
          <Fields columns={2} items={[['Deletion Status', 'No deletion request'], ['Requested On', '—']]} />
          <Empty icon="document" title="No deletion history" />
        </Section>

        <Section id="a-privacy" title="Privacy and Consent">
          <Fields
            columns={2}
            items={[
              ['Terms Consent', `Accepted ${dt(pref.termsAcceptedAt)}`],
              ['Privacy Policy Consent', `Accepted ${dt(pref.privacyAcceptedAt)}`],
              ['Marketing Consent', pref.marketingConsent ? 'Given' : 'Not given'],
              [
                'Internal Admin Notes',
                <button key="n" type="button" className="p-link" onClick={() => goToTab('profile')}>
                  {profile.notes.length} note{profile.notes.length === 1 ? '' : 's'} · view in Profile
                </button>,
              ],
            ]}
          />
          <h4 className="p-subhead">Consent History</h4>
          <ConsentTable rows={pref.consentHistory} />
        </Section>
      </div>

      {action && (
        <StatusActionDialog
          user={user}
          action={action}
          onCancel={() => setAction(null)}
          onConfirm={({ reason, notes }) => {
            const result = changeStatus({ user, action, reason, notes, admin: session });
            if (!result.ok) return result;
            setAction(null);
            refresh();
            notify('success', `Account ${ACTIONS[action].past} (${result.entry.previousStatus} → ${result.entry.newStatus}). Recorded in Account Action History.`);
            return result;
          }}
        />
      )}
    </div>
  );
}
