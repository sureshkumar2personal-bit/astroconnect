import { createStore, useStore } from '@/lib/store.js';
import { settingsSeed, TODAY, MONTHS_SHORT } from '@/data/mockSettings.js';

// Settings state (spec 15_SETTINGS_AND_PREFERENCES.md, AD-152 – AD-157). Prototype only:
// nothing is saved to a server, no device permission is requested, nobody is really logged out.
// The theme is not stored here — it is the app's real theme (ctx.theme / ctx.onToggleTheme).

export const settingsStore = createStore(settingsSeed);

const pad = (n) => String(n).padStart(2, '0');
/** Date as [y, m, d] formatted per the chosen date format (AD-154). */
export const fmtDate = (d, f) => (f === 'dmy' ? `${pad(d[2])}/${pad(d[1])}/${d[0]}` : `${pad(d[2])} ${MONTHS_SHORT[d[1] - 1]} ${d[0]}`);

/** Change Password validation; returns { field, message } or null. */
export function validatePassword({ cur, nw, cf }) {
  if (!cur) return { field: 'cur', message: 'Enter your current password.' };
  if (nw.length < 8 || !/\d/.test(nw)) return { field: 'nw', message: 'Your new password needs at least 8 characters and a number.' };
  if (nw === cur) return { field: 'nw', message: "Choose a new password that's different from your current one." };
  if (cf !== nw) return { field: 'cf', message: "The new passwords don't match." };
  return null;
}

const flip = (group, key) => settingsStore.patch((s) => ({ [group]: { ...s[group], [key]: !s[group][key] } }));

export const settingsActions = {
  /** push / sound / vib (AD-153). Never changes service availability (SET-02). */
  toggle: (key) => settingsStore.patch((s) => ({ [key]: !s[key] })),
  toggleCategory: (id) => flip('cats', id),
  toggleEvent: (id) => flip('events', id),
  setValue: (key, value) => settingsStore.patch({ [key]: value }),
  /** Change Password succeeded (AD-152); a Password Changed notification follows (AD-148). */
  passwordChanged: () => settingsStore.patch((s) => ({
    pwChanged: TODAY,
    activity: [{ kind: 'password', detail: 'Changed from account settings', date: TODAY, time: 'Just now' }, ...s.activity],
  })),
  /** Ends one listed session (SET-05). */
  logoutSession: (id) => settingsStore.patch((s) => ({ sessions: s.sessions.filter((x) => x.id !== id) })),
  /** SET-05: ends the other active sessions listed. */
  logoutOthers: () => settingsStore.patch((s) => ({ sessions: s.sessions.filter((x) => x.current) })),
  /** SET-04: a request to Platform Admin — the account is never deactivated/deleted instantly. */
  sendRequest: (kind) => settingsStore.patch({ [kind === 'delete' ? 'delReq' : 'deactReq']: true }),
};

export default function useSettings() {
  return useStore(settingsStore);
}
