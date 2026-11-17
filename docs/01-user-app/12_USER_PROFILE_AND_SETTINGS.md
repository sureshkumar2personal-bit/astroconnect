# 12 — User Profile and Settings

| Field | Value |
|-------|-------|
| Application | User App |
| Status | Draft |
| Owned decisions | None |
| Review list | [`00_USER_APP_REVIEW_LIST.md`](00_USER_APP_REVIEW_LIST.md) |
| Shared context | [`CONTEXT.md`](../../CONTEXT.md) |

---

## 1. Purpose

Defines the Profile tab: the user's own profile information and app
settings.

## 2. Scope / Out of scope

**In scope**
- User profile fields.
- App settings. Which settings exist (e.g. theme, language, privacy,
  notification preferences): `PENDING DISCUSSION` (P-12-02, P-12-03, P-12-04).

**Out of scope**
- Birth profiles and Kundli → [13](13_BIRTH_PROFILES_AND_KUNDLI.md).
- Notification rules → [15](15_NOTIFICATIONS.md).
- Account deletion flow → [02](02_AUTHENTICATION_AND_ONBOARDING.md).

## 3. Entry points

- **Profile** tab in the bottom navigation (D-01 → [01](01_NAVIGATION_AND_STRUCTURE.md)).
- Which other modules are reached from Profile: `PENDING DISCUSSION`
  (P-01-01 to P-01-06).

## 4. Confirmed decisions

This module owns no confirmed decisions.

**Referenced decisions**

| ID | Topic | Owning file |
|----|-------|-------------|
| D-01 | Bottom navigation tabs | [01](01_NAVIGATION_AND_STRUCTURE.md) |
| D-15 | Critical notifications | [15](15_NOTIFICATIONS.md) |
| D-16 | Notification channels | [15](15_NOTIFICATIONS.md) |

## 5. User flows

`PENDING DISCUSSION` (P-12-01, P-12-04).

## 6. Screens and content

`PENDING DISCUSSION`:
- Profile fields (P-12-01).
- Theme and language settings (P-12-02).
- Privacy settings (P-12-03).
- Full settings list (P-12-04).

## 7. Business rules and validations

No confirmed rules are owned by this module.

- Any notification settings screen must follow D-15 and D-16
  (→ [15](15_NOTIFICATIONS.md)): critical notifications cannot be
  switched off there. The user can still disable push permission in the
  phone's settings; the resulting behaviour is `PENDING DISCUSSION`
  (P-15-06). Which non-critical notifications can be switched off:
  `PENDING DISCUSSION` (P-15-02).

## 8. States and edge cases

`PENDING DISCUSSION` (P-12-01, P-12-04).

## 9. Notifications triggered

| Notification | Category | Rule |
|--------------|----------|------|
| Account and security alerts | Critical (account/security) | D-15 → [15](15_NOTIFICATIONS.md) |

Exact events: `PENDING DISCUSSION` (P-15-03).

## 10. Dependencies on other modules

- [02](02_AUTHENTICATION_AND_ONBOARDING.md) — account deletion, sign-up data.
- [13](13_BIRTH_PROFILES_AND_KUNDLI.md) — birth profiles (entry point P-01-06).
- [15](15_NOTIFICATIONS.md) — notification preferences.

## 11. PENDING DISCUSSION

Full wording in [`00_USER_APP_REVIEW_LIST.md` §4](00_USER_APP_REVIEW_LIST.md#4-pending-discussion-register).

**Owned by this module**

| ID | Topic |
|----|-------|
| P-12-01 | User profile fields |
| P-12-02 | Theme and language settings |
| P-12-03 | Privacy settings |
| P-12-04 | Full settings list |

**Related (owned elsewhere)**

| ID | Topic |
|----|-------|
| P-01-01 – P-01-06 | Placement of Wallet, Following/Subscriptions, Remedy Tracker, Notifications, Help, Birth Profiles |
| P-02-06 | Account deletion |
| P-15-02 | Non-critical notifications |
| P-15-06 | Always-ON and phone-level push permission |
| P-GL-01 | Supported languages |

## 12. Acceptance criteria

- [ ] The Profile tab opens this module (D-01 → [01](01_NAVIGATION_AND_STRUCTURE.md)).
- [ ] Critical notifications cannot be disabled through the app's notification settings (D-15 → [15](15_NOTIFICATIONS.md)).

## 13. Change log

| Date | Change |
|------|--------|
| 2026-11-17 | Initial draft created. |
| 2026-11-17 | Critical-notification wording aligned with approved interpretation (app settings vs phone push permission, P-15-06). |
