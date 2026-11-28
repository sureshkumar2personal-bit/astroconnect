// Demo authentication — FRONTEND ONLY.
//
// Accounts and the signed-in session live in this browser's localStorage.
// There is no backend, API, database, OTP, OAuth or verification. Passwords
// are never stored in plain text: each account keeps a random salt and a
// SHA-256 hash. This is still NOT secure authentication; it only supports the
// demo. Replace this whole module with real backend authentication later —
// the rest of the app only uses signUp, signIn, getSession and signOut.

const ACCOUNTS_KEY = 'astroconnect.demo.accounts';
const SESSION_KEY = 'astroconnect.demo.session';

export const ROLE_LABELS = {
  admin: 'Admin',
  user: 'User',
  astrologer: 'Astrologer',
};

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

function randomHex(bytes) {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, '0')).join('');
}

async function hashPassword(password, salt) {
  const data = new TextEncoder().encode(`${salt}:${password}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
}

function normaliseEmail(email) {
  return email.trim().toLowerCase();
}

function toSession(account) {
  return {
    accountId: account.id,
    role: account.role,
    fullName: account.fullName,
    email: account.email,
    signedInAt: new Date().toISOString(),
  };
}

/** Create a demo account for a role and sign it in. */
export async function signUp({ role, fullName, email, password }) {
  const accounts = read(ACCOUNTS_KEY, []);
  const normalised = normaliseEmail(email);
  if (accounts.some((a) => a.role === role && a.email === normalised)) {
    return {
      ok: false,
      error: `An ${ROLE_LABELS[role]} account with this email already exists. Sign in instead.`,
    };
  }
  const salt = randomHex(16);
  const account = {
    id: `${role}-${randomHex(6)}`,
    role,
    fullName: fullName.trim(),
    email: normalised,
    salt,
    passwordHash: await hashPassword(password, salt),
    createdAt: new Date().toISOString(),
  };
  if (!write(ACCOUNTS_KEY, [...accounts, account])) {
    return { ok: false, error: 'This browser blocked storage, so the demo account could not be saved.' };
  }
  const session = toSession(account);
  write(SESSION_KEY, session);
  return { ok: true, session };
}

/** Check credentials against the demo accounts of the selected role. */
export async function signIn({ role, identifier, password }) {
  const accounts = read(ACCOUNTS_KEY, []);
  const normalised = normaliseEmail(identifier);
  const account = accounts.find((a) => a.role === role && a.email === normalised);
  const hash = account ? await hashPassword(password, account.salt) : null;
  if (!account || hash !== account.passwordHash) {
    return { ok: false, error: `Incorrect email or password for the ${ROLE_LABELS[role]} role.` };
  }
  const session = toSession(account);
  write(SESSION_KEY, session);
  return { ok: true, session };
}

export function getSession() {
  return read(SESSION_KEY, null);
}

export function signOut() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    /* storage unavailable — nothing to clear */
  }
}
