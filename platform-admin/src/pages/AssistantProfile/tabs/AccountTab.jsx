import { useState } from 'react';
import Icon from '../../../components/icons.jsx';
import { ACCOUNT_ACTIONS, applyAccountAction, availableActions } from '../../../data/assistantsStore.js';
import { ACTION_ICONS, AssistantActionDialog, AssistantStatus } from '../../Assistants/components/AssistantBits.jsx';
import { DataTable, Empty, Fields, Section, dt } from '../../UserProfile/components/ui.jsx';

// Tab 6 — Account. Invitation and account status, history, and the approved
// actions (Admin Assistants only). No permanent delete; removed records stay.
export default function AccountTab({ assistant: a, session, refresh, notify }) {
  const [action, setAction] = useState(null);
  const actions = availableActions(a);
  const invitation = a.acceptedAt ? 'Accepted' : a.status === 'Expired' ? 'Expired' : a.status === 'Pending' ? 'Pending' : '—';
  const history = a.events.filter((e) => e.module === 'Account').reverse();
  return (
    <div className="p-stack">
      <div className="p-grid-2">
        <Section id="sac-info" title="Invitation and Account">
          <Fields
            columns={2}
            items={[
              ['Invitation Status', invitation],
              ['Account Status', <AssistantStatus key="s" status={a.status} />],
              ['Invitation Date', dt(a.invitedAt)],
              ['Invitation Valid Until', a.acceptedAt ? '—' : dt(a.expiresAt)],
              ['Accepted Date', dt(a.acceptedAt)],
              ['Last Active', dt(a.lastActiveAt)],
              ['Invitations Resent', a.resendCount ?? 0],
              ['Email', a.email],
            ]}
          />
          {a.status === 'Removed' && <p className="p-restricted">Removed accounts are kept as read-only history. This email can never be used for another assistant account.</p>}
        </Section>
        <Section
          id="sac-actions"
          title="Account Actions"
          description={a.type === 'Astrologer Assistant' ? `Managed by ${a.astrologer.name} in the Astrologer App.` : 'A reason is required for every action. Invitations are valid for 7 days.'}
        >
          {actions.length ? (
            <div className="p-actions">
              {actions.map((key) => (
                <button key={key} type="button" className={`u-btn${ACCOUNT_ACTIONS[key].danger ? ' p-btn-danger' : ''}`} onClick={() => setAction(key)}>
                  <Icon name={ACTION_ICONS[key]} size={16} />
                  {ACCOUNT_ACTIONS[key].label}
                </button>
              ))}
            </div>
          ) : (
            <p className="p-muted">{a.status === 'Removed' ? 'No actions are available for a removed account.' : 'No actions are available from Platform Admin for this assistant.'}</p>
          )}
        </Section>
      </div>
      <Section id="sac-history" title="Account History">
        <DataTable
          caption="Account history"
          rows={history}
          empty={<Empty icon="document" title="No account history" />}
          columns={[
            { key: 'at', header: 'Date / Time', primary: true, render: (e) => dt(e.at) },
            { key: 'action', header: 'Action', render: (e) => <span className="p-strong">{e.action}</span> },
            { key: 'desc', header: 'Description', className: 'p-wrap', render: (e) => e.description },
            { key: 'by', header: 'By', render: (e) => <span className="p-desc"><span>{e.by.name}</span><span className="p-small">{e.by.role} · {e.by.id}</span></span> },
          ]}
        />
      </Section>
      {action && (
        <AssistantActionDialog
          assistant={a}
          action={action}
          onCancel={() => setAction(null)}
          onConfirm={(reason) => {
            const result = applyAccountAction(a.id, action, reason, session);
            if (!result.ok) return result;
            setAction(null);
            refresh();
            notify('success', `${ACCOUNT_ACTIONS[action].label} completed. Status: ${result.assistant.status}. Recorded in Activity.`);
            return result;
          }}
        />
      )}
    </div>
  );
}
