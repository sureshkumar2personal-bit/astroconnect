import { useMemo, useState } from 'react';
import {
  ADMIN_DEPARTMENTS,
  allowedActions,
  canEditPermissions,
  grantableModules,
  presetPermissions,
  savePermissions,
} from '../../../data/assistantsStore.js';
import { ADMIN_ACTIONS, ASTRO_ACTIONS } from '../../../data/mock/assistantsMock.js';
import { Section, dt } from '../../UserProfile/components/ui.jsx';

// Tab 2 — Permissions. Preset roles (Assistant / Editor) or custom
// permissions, limited to the type's documented authority; changes apply
// immediately and are logged in Activity. Astrologer Assistants are managed
// by their astrologer, so they are view-only here.
export default function PermissionsTab({ assistant: a, session, refresh, notify }) {
  const editable = canEditPermissions(a);
  const actions = a.type === 'Astrologer Assistant' ? ASTRO_ACTIONS : ADMIN_ACTIONS;
  const [departments, setDepartments] = useState(a.departments);
  const [draft, setDraft] = useState(a.permissions);
  const [role, setRole] = useState(a.role);
  const [mode, setMode] = useState(a.mode);
  const [error, setError] = useState('');
  const modules = useMemo(() => grantableModules(a.type, departments), [a.type, departments]);
  const dirty = JSON.stringify({ departments, draft, role }) !== JSON.stringify({ departments: a.departments, draft: a.permissions, role: a.role });

  function toggle(m, act) {
    setDraft((p) => {
      const cur = p[m] ?? [];
      const next = cur.includes(act) ? cur.filter((x) => x !== act) : [...cur, act];
      return { ...p, [m]: next };
    });
    setMode('Custom');
  }
  function applyPreset(r) {
    setRole(r);
    setDraft(presetPermissions(a.type, r, departments));
    setMode(`${r} preset`);
  }
  function save() {
    const result = savePermissions(a.id, { departments, permissions: draft, role, mode }, session);
    if (!result.ok) return setError(result.error);
    setError('');
    refresh();
    notify('success', `Permissions updated and effective immediately (${result.changes} module change${result.changes === 1 ? '' : 's'}). Recorded in Activity.`);
  }
  const history = a.events.filter((e) => e.module !== 'Account' && /Permission|Role|Department/.test(e.action)).reverse();

  return (
    <div className="p-stack">
      <Section
        id="spm-effective"
        title="Effective Permissions"
        description={
          editable
            ? 'Choose a preset or adjust individual permissions. Only actions allowed for this assistant type can be granted; financial approvals, transfers and withdrawals are never available.'
            : a.type === 'Astrologer Assistant'
              ? `Set by ${a.astrologer.name}. Only the assigning astrologer can change these permissions. My Assistants and Settings cannot be delegated; wallet access is view only.`
              : 'This account is removed; permissions are kept as read-only history.'
        }
        actions={
          editable ? (
            <div className="p-actions">
              <button type="button" className="u-btn" onClick={() => applyPreset('Assistant')}>Apply Assistant preset</button>
              <button type="button" className="u-btn" onClick={() => applyPreset('Editor')}>Apply Editor preset</button>
            </div>
          ) : null
        }
      >
        <p className="p-small">
          Role <strong>{role}</strong> · Permission set <strong>{mode}</strong>
        </p>
        {a.type === 'Admin Assistant' && (
          <fieldset className="as-depts" disabled={!editable}>
            <legend className="u-label">Department access</legend>
            {Object.keys(ADMIN_DEPARTMENTS).map((dname) => (
              <label key={dname} className="p-radio">
                <input
                  type="checkbox"
                  checked={departments.includes(dname)}
                  onChange={(e) => {
                    const next = e.target.checked ? [...departments, dname] : departments.filter((x) => x !== dname);
                    setDepartments(next);
                    if (!e.target.checked) setDraft((p) => Object.fromEntries(Object.entries(p).filter(([m]) => !ADMIN_DEPARTMENTS[dname].includes(m))));
                    setMode('Custom');
                  }}
                />
                {dname}
              </label>
            ))}
          </fieldset>
        )}
        <div className="p-table-wrap">
          <table className="p-table sp-matrix">
            <caption className="visually-hidden">Permissions by module</caption>
            <thead>
              <tr>
                <th scope="col">Module</th>
                {actions.map((x) => (
                  <th key={x} scope="col" className="is-center">{x}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {modules.map((m) => {
                const allowed = allowedActions(a.type, m);
                return (
                  <tr key={m}>
                    <th scope="row" className="sp-module">{m}</th>
                    {actions.map((x) => {
                      const ok = allowed.includes(x);
                      const on = (draft[m] ?? []).includes(x);
                      return (
                        <td key={x} className="is-center">
                          {ok ? (
                            <input type="checkbox" aria-label={`${x} — ${m}`} checked={on} disabled={!editable} onChange={() => toggle(m, x)} />
                          ) : (
                            <span className="sp-na" title="Not available for this assistant type">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {editable && (
          <div className="sp-save">
            {error && <p className="u-field__error" role="alert">{error}</p>}
            <button type="button" className="u-btn u-btn--ghost" disabled={!dirty} onClick={() => { setDepartments(a.departments); setDraft(a.permissions); setRole(a.role); setMode(a.mode); setError(''); }}>
              Discard changes
            </button>
            <button type="button" className="u-btn u-btn--primary" disabled={!dirty} onClick={save}>
              Save permissions
            </button>
          </div>
        )}
      </Section>
      <Section id="spm-history" title="Permission History">
        {history.length ? (
          <ul className="p-list sp-history">
            {history.map((e) => (
              <li key={e.id}>
                <strong>{e.action}</strong> · {e.module}: {e.description} <span className="p-small">— {e.by.name} ({e.by.role}) · {dt(e.at)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-muted">No permission changes since the invitation ({a.mode}).</p>
        )}
      </Section>
    </div>
  );
}
