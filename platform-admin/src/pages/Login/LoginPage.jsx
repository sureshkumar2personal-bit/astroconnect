import { useId, useRef, useState } from 'react';
import BrandMark from '../../components/BrandMark.jsx';
import { signIn, signUp } from '../../auth/demoAuth.js';
import {
  validateConfirmPassword,
  validateEmail,
  validateFullName,
  validateIdentifier,
  validateNewPassword,
  validatePassword,
} from './validation.js';
import './LoginPage.css';

// Common Login Screen for all roles (docs/03-platform-admin/02-platform-login.md).
// Frontend demo only: accounts are kept in this browser by src/auth/demoAuth.js.
// No backend, API, OAuth, OTP or verification.

const ROLES = [
  { id: 'admin', label: 'Admin' },
  { id: 'user', label: 'User' },
  { id: 'astrologer', label: 'Astrologer' },
];

const MODES = [
  { id: 'signin', label: 'Sign In' },
  { id: 'signup', label: 'Sign Up' },
];

const FIELDS = {
  signin: {
    identifier: (v) => validateIdentifier(v.identifier),
    password: (v) => validatePassword(v.password),
  },
  signup: {
    fullName: (v) => validateFullName(v.fullName),
    email: (v) => validateEmail(v.email),
    newPassword: (v) => validateNewPassword(v.newPassword),
    confirmPassword: (v) => validateConfirmPassword(v.confirmPassword, v.newPassword),
  },
};

const EMPTY_VALUES = {
  identifier: '',
  password: '',
  fullName: '',
  email: '',
  newPassword: '',
  confirmPassword: '',
};

export default function LoginPage({ onAuthenticated }) {
  const [role, setRole] = useState('admin');
  const [mode, setMode] = useState('signin');
  const [values, setValues] = useState(EMPTY_VALUES);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState(null); // { tone: 'info' | 'success' | 'error', text }
  const [busy, setBusy] = useState(false);

  const tabRefs = useRef([]);
  const uid = useId();
  const formId = `${uid}-form`;
  const fieldId = (name) => `${uid}-${name}`;

  function resetForm() {
    setErrors({});
    setTouched({});
    setNotice(null);
    setShowPassword(false);
  }

  function selectRole(nextRole) {
    setRole(nextRole);
    resetForm();
  }

  function selectMode(nextMode) {
    if (nextMode === mode) return;
    setMode(nextMode);
    resetForm();
  }

  function onTabKeyDown(event, index) {
    const last = ROLES.length - 1;
    let next = null;
    if (event.key === 'ArrowRight') next = index === last ? 0 : index + 1;
    if (event.key === 'ArrowLeft') next = index === 0 ? last : index - 1;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = last;
    if (next === null) return;
    event.preventDefault();
    selectRole(ROLES[next].id);
    tabRefs.current[next]?.focus();
  }

  function onChange(name, value) {
    const nextValues = { ...values, [name]: value };
    setValues(nextValues);
    setNotice(null);
    const rules = FIELDS[mode];
    setErrors((e) => {
      const updated = { ...e };
      if (touched[name]) updated[name] = rules[name](nextValues);
      // Re-check the confirmation when the password it must match changes.
      if (name === 'newPassword' && touched.confirmPassword) {
        updated.confirmPassword = rules.confirmPassword(nextValues);
      }
      return updated;
    });
  }

  function onBlur(name) {
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors((e) => ({ ...e, [name]: FIELDS[mode][name](values) }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    if (busy) return;
    const rules = FIELDS[mode];
    const next = {};
    for (const name of Object.keys(rules)) next[name] = rules[name](values);
    setErrors(next);
    setTouched(Object.fromEntries(Object.keys(rules).map((n) => [n, true])));
    const firstInvalid = Object.keys(rules).find((n) => next[n]);
    if (firstInvalid) {
      document.getElementById(fieldId(firstInvalid))?.focus();
      setNotice(null);
      return;
    }

    setBusy(true);
    const result =
      mode === 'signup'
        ? await signUp({
            role,
            fullName: values.fullName,
            email: values.email,
            password: values.newPassword,
          })
        : await signIn({ role, identifier: values.identifier, password: values.password });
    setBusy(false);

    if (!result.ok) {
      setNotice({ tone: 'error', text: result.error });
      return;
    }
    onAuthenticated?.(result.session);
  }

  function onForgotPassword() {
    setNotice({ tone: 'info', text: 'Password reset is not available yet. Please contact AstroConnect support.' });
  }

  function onSocial(provider) {
    setNotice({
      tone: 'info',
      text: `${provider} sign-in is not available yet. Please sign in with your email or phone number.`,
    });
  }

  function renderField({ name, label, type = 'text', autoComplete, extra }) {
    const id = fieldId(name);
    const error = errors[name];
    const isPassword = type === 'password';
    const input = (
      <input
        id={id}
        name={name}
        type={isPassword && showPassword ? 'text' : type}
        autoComplete={autoComplete}
        className={`field__input${error ? ' has-error' : ''}`}
        value={values[name]}
        onChange={(e) => onChange(name, e.target.value)}
        onBlur={() => onBlur(name)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
      />
    );
    return (
      <div className="field" key={`${mode}-${name}`}>
        <div className="field__row">
          <label htmlFor={id} className="field__label">
            {label}
          </label>
          {extra}
        </div>
        {isPassword ? (
          <div className="field__password">
            {input}
            <button
              type="button"
              className="field__toggle"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
              onClick={() => setShowPassword((v) => !v)}
            >
              <EyeIcon off={showPassword} />
            </button>
          </div>
        ) : (
          input
        )}
        {error && (
          <p id={`${id}-error`} className="field__error">
            {error}
          </p>
        )}
      </div>
    );
  }

  const isSignUp = mode === 'signup';

  return (
    <main className="login">
      <section className="login__panel" aria-labelledby={`${uid}-title`}>
        <BrandMark />
        <h1 id={`${uid}-title`} className="login__title">
          {isSignUp ? 'Create your account' : 'Sign in'}
        </h1>

        <div className="role-tabs" role="tablist" aria-label="Choose your role">
          {ROLES.map((r, i) => {
            const selected = r.id === role;
            return (
              <button
                key={r.id}
                ref={(el) => (tabRefs.current[i] = el)}
                type="button"
                role="tab"
                id={`${uid}-tab-${r.id}`}
                aria-selected={selected}
                aria-controls={formId}
                tabIndex={selected ? 0 : -1}
                className={`role-tabs__tab${selected ? ' is-selected' : ''}`}
                onClick={() => selectRole(r.id)}
                onKeyDown={(e) => onTabKeyDown(e, i)}
              >
                {r.label}
              </button>
            );
          })}
        </div>

        <div className="mode-switch" role="group" aria-label="Sign in or sign up">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              className={`mode-switch__btn${mode === m.id ? ' is-selected' : ''}`}
              aria-pressed={mode === m.id}
              onClick={() => selectMode(m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>

        <form
          id={formId}
          role="tabpanel"
          aria-labelledby={`${uid}-tab-${role}`}
          className="login__form"
          noValidate
          onSubmit={onSubmit}
        >
          {isSignUp ? (
            <>
              {renderField({ name: 'fullName', label: 'Full Name', autoComplete: 'name' })}
              {renderField({
                name: 'email',
                label: 'Email Address',
                type: 'email',
                autoComplete: 'email',
              })}
              {renderField({
                name: 'newPassword',
                label: 'Create Password',
                type: 'password',
                autoComplete: 'new-password',
              })}
              {renderField({
                name: 'confirmPassword',
                label: 'Confirm Password',
                type: 'password',
                autoComplete: 'new-password',
              })}
            </>
          ) : (
            <>
              {renderField({
                name: 'identifier',
                label: 'Email or phone number',
                autoComplete: 'username',
              })}
              {renderField({
                name: 'password',
                label: 'Password',
                type: 'password',
                autoComplete: 'current-password',
                extra: (
                  <button type="button" className="link-button" onClick={onForgotPassword}>
                    Forgot password?
                  </button>
                ),
              })}
            </>
          )}

          <button type="submit" className="btn btn--primary" disabled={busy}>
            {isSignUp ? 'Create Account' : 'Continue'}
          </button>

          <p
            className={`login__notice${notice ? ` is-${notice.tone}` : ''}`}
            role={notice?.tone === 'error' ? 'alert' : 'status'}
            aria-live={notice?.tone === 'error' ? 'assertive' : 'polite'}
          >
            {notice ? notice.text : ''}
          </p>
        </form>

        <div className="divider" role="separator" aria-label="or">
          <span aria-hidden="true">OR</span>
        </div>

        <div className="social">
          <button type="button" className="btn btn--social" onClick={() => onSocial('Google')}>
            <GoogleIcon />
            Continue with Google
          </button>
          <button
            type="button"
            className="btn btn--social"
            onClick={() => onSocial('Social account')}
          >
            <SocialIcon />
            Continue with social account
          </button>
        </div>
      </section>

    </main>
  );
}

function EyeIcon({ off }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
      <path
        d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
      {off && (
        <path d="M4 4l16 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      )}
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <path
        fill="#4285F4"
        d="M22.5 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h5.9a5.05 5.05 0 0 1-2.19 3.31v2.75h3.54c2.07-1.91 3.25-4.72 3.25-8.09Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.65l-3.54-2.75c-.98.66-2.24 1.05-3.74 1.05-2.87 0-5.31-1.94-6.18-4.55H2.17v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.82 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.17a11 11 0 0 0 0 9.88l3.65-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A10.96 10.96 0 0 0 12 1 11 11 0 0 0 2.17 7.06L5.82 9.9C6.69 7.3 9.13 5.38 12 5.38Z"
      />
    </svg>
  );
}

function SocialIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <circle cx="6" cy="12" r="2.6" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="18" cy="6" r="2.6" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="18" cy="18" r="2.6" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8.3 10.8l7.4-3.6M8.3 13.2l7.4 3.6" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
