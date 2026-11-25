// Prototype session (no real authentication yet). Opening the app in a new tab counts as logging in;
// a refresh in the same tab keeps the session. Logout ends it and opens the app again (= a new login).
// Availability is saved in the browser so Call / Chat choices survive refresh and logout.
const SESSION_KEY = 'ac-session';
const AVAIL_KEY = 'ac-availability';

const safe = (fn, fallback) => { try { return fn(); } catch { return fallback; } };

/** True on a fresh login (new tab / after Logout); false on a refresh of an active session.
 *  Worked out once when the app loads, so it is the same however often it is read. */
export const isFreshLogin = (() => {
  const active = safe(() => sessionStorage.getItem(SESSION_KEY) === '1', false);
  safe(() => sessionStorage.setItem(SESSION_KEY, '1'));
  return !active;
})();

export const loadAvailability = () => safe(() => JSON.parse(localStorage.getItem(AVAIL_KEY) || 'null'), null);
export const saveAvailability = (state) => safe(() => localStorage.setItem(AVAIL_KEY, JSON.stringify(state)));

/** End the session and reopen the app at Home, which starts a new login (Online). */
export function logout() {
  safe(() => sessionStorage.removeItem(SESSION_KEY));
  window.location.hash = '/';
  window.location.reload();
}
