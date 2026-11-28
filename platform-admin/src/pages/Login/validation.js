// Frontend-only validation for the demo Sign In / Sign Up forms. No password
// policy is decided yet, so passwords are only checked for being present
// (and, on Sign Up, for matching the confirmation).

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?\d{10,15}$/;

export function validateIdentifier(value) {
  const v = value.trim();
  if (!v) return 'Enter your email or phone number.';
  const phone = v.replace(/[\s()-]/g, '');
  if (!EMAIL_RE.test(v) && !PHONE_RE.test(phone)) {
    return 'Enter a valid email address or phone number.';
  }
  return '';
}

export function validatePassword(value) {
  return value ? '' : 'Enter your password.';
}

export function validateFullName(value) {
  return value.trim() ? '' : 'Enter your full name.';
}

export function validateEmail(value) {
  const v = value.trim();
  if (!v) return 'Enter your email address.';
  return EMAIL_RE.test(v) ? '' : 'Enter a valid email address.';
}

export function validateNewPassword(value) {
  return value ? '' : 'Create a password.';
}

export function validateConfirmPassword(value, password) {
  if (!value) return 'Confirm your password.';
  return value === password ? '' : 'Passwords do not match.';
}
