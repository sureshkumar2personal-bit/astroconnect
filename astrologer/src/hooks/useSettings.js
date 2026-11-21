import { createStore, useStore } from '@/lib/store.js';
import { settingsSeed } from '@/data/mockSettings.js';

// Settings state (spec 15_SETTINGS_AND_PREFERENCES.md, AD-152 – AD-157). Prototype only:
// nothing is saved to a server, no device permission is requested, nobody is logged out.
// The theme is not stored here — it is the app's real theme (ctx.theme / ctx.onToggleTheme).

export const settingsStore = createStore(settingsSeed);

const flip = (group, key) => settingsStore.patch((s) => ({ [group]: { ...s[group], [key]: !s[group][key] } }));

/** Validate the Change Password form; returns an error message or ''. */
export function validatePassword({ current, next, confirm }) {
  if (!current || !next) return 'Fill in all fields.';
  if (next !== confirm) return 'New passwords don\'t match.';
  return '';
}

export const settingsActions = {
  /** push / sound / vib (AD-153). Never changes service availability (SET-02). */
  toggle: (key) => settingsStore.patch((s) => ({ [key]: !s[key] })),
  toggleCategory: (k) => flip('cats', k),
  toggleEvent: (k) => flip('ev', k),
  togglePermission: (k) => flip('perm', k),
  setValue: (key, value) => settingsStore.patch({ [key]: value }),
  /** SET-05: ends the other active sessions listed. */
  logoutOthers: () => settingsStore.patch((s) => ({ sessions: s.sessions.filter((x) => x.current) })),
  /** SET-04: a request to Platform Admin — the account is never deactivated/deleted instantly. */
  sendRequest: (kind) => settingsStore.patch({ request: kind }),
};

export default function useSettings() {
  return useStore(settingsStore);
}
