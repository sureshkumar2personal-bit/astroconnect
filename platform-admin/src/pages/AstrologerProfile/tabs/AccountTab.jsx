import { useState } from 'react';
import Icon from '../../../components/icons.jsx';
import { ACTIONS, TRANSITIONS } from '../../../data/usersStore.js';
import { ADMIN_ROLE, changeAstrologerStatus } from '../../../data/astrologerStatus.js';
import StatusActionDialog from '../../Users/components/StatusActionDialog.jsx';
import { StatusBadge } from '../../Users/components/UserBits.jsx';
import { DataTable, Empty, Fields, Pill, Section, dt } from '../../UserProfile/components/ui.jsx';

const ICONS = { suspend: 'userPause', block: 'userBlock', reactivate: 'userCheck', unblock: 'userCheck' };

// Tab 13 — Account (§16). Approved transitions only; every change needs a
// reason and confirmation and is recorded with Admin ID and time.
// Deactivation / deletion requests need an approval screen that is not yet
// defined (PP-18), so none is offered here.
export default function AccountTab({ profile, session, refresh, notify, goToTab }) {
  const a = profile.astrologer;
  const [action, setAction] = useState(null);
  const actions = TRANSITIONS[a.status] ?? [];
  return (
    <div className="p-stack">
      <div className="p-grid-2">
        <Section id="aac-info" title="Registration and Login">
          <Fields
            columns={2}
            items={[
              ['Astrologer ID', a.id],
              ['Account Type', 'Astrologer'],
              ['Account Status', <StatusBadge key="s" status={a.status} />],
              ['Registration Date', dt(a.joinedAt)],
              ['Registration Method', a.registrationMethod],
              ['Last Login', dt(a.lastLoginAt)],
              ['Last Active', dt(a.lastActiveAt)],
            ]}
          />
        </Section>
        <Section id="aac-status" title="Account Status" description="Suspended and blocked astrologers cannot log in or provide services. Services, wallet, earnings, settlements and disputes are preserved.">
          <div className="p-status-card">
            <StatusBadge status={a.status} showRestriction />
            <div className="p-actions">
              {actions.map((key) => (
                <button key={key} type="button" className={`u-btn${key === 'block' ? ' p-btn-danger' : ''}`} onClick={() => setAction(key)}>
                  <Icon name={ICONS[key]} size={16} />
                  {ACTIONS[key].label}
                </button>
              ))}
            </div>
          </div>
          <p className="p-small p-muted">Allowed changes: Active → Suspend or Block · Suspended → Reactivate or Block · Blocked → Unblock. A reason is required for every change.</p>
        </Section>
      </div>

      <Section id="aac-history" title="Account Action History" description="Immutable record of status changes by Admin users.">
        <DataTable
          caption="Account action history"
          rows={profile.audit}
          empty={<Empty icon="document" title="No account actions recorded" />}
          columns={[
            { key: 'action', header: 'Action', primary: true, render: (h) => <span className="p-strong">{h.action}</span> },
            { key: 'prev', header: 'Previous Status', render: (h) => <Pill value={h.previousStatus} /> },
            { key: 'new', header: 'New Status', render: (h) => <Pill value={h.newStatus} /> },
            { key: 'reason', header: 'Reason', className: 'p-wrap', render: (h) => h.reason },
            { key: 'notes', header: 'Notes', className: 'p-wrap', render: (h) => h.notes || '—' },
            { key: 'by', header: 'Taken By', render: () => ADMIN_ROLE },
            { key: 'admin', header: 'Admin ID / Name', render: (h) => <span className="p-desc"><span>{h.adminName}</span><span className="p-small">{h.adminId}</span></span> },
            { key: 'at', header: 'Date / Time', render: (h) => dt(h.at) },
          ]}
        />
      </Section>

      <div className="p-grid-2">
        <Section id="aac-privacy" title="Privacy, Consent and Notes">
          <Fields
            columns={2}
            items={[
              ['Terms Consent', `Accepted ${dt(a.joinedAt)}`],
              ['Privacy Policy Consent', `Accepted ${dt(a.joinedAt)}`],
              ['Marketing Consent', a.marketingConsent ? 'Given' : 'Not given'],
              [
                'Internal Admin Notes',
                <button key="n" type="button" className="p-link" onClick={() => goToTab('profile')}>
                  {profile.notes.length} note{profile.notes.length === 1 ? '' : 's'} · view in Profile
                </button>,
              ],
            ]}
          />
        </Section>
        <Section id="aac-delete" title="Deactivation and Deletion Requests" description="Astrologers request deactivation or deletion from the app; requests are reviewed by Platform Admin. Required records are preserved.">
          <Fields columns={2} items={[['Request Status', 'No deactivation or deletion request'], ['Requested On', '—']]} />
          <Empty icon="document" title="No request history" />
        </Section>
      </div>

      {action && (
        <StatusActionDialog
          user={a}
          action={action}
          subject="astrologer"
          onCancel={() => setAction(null)}
          onConfirm={({ reason, notes }) => {
            const result = changeAstrologerStatus({ user: a, action, reason, notes, admin: session });
            if (!result.ok) return result;
            setAction(null);
            refresh();
            notify('success', `Account ${ACTIONS[action].past} (${result.entry.previousStatus} → ${result.entry.newStatus}). Recorded in Account Action History and Activity.`);
            return result;
          }}
        />
      )}
    </div>
  );
}
