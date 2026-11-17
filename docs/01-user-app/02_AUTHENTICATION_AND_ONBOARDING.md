# 02 — Authentication and Onboarding

| Field | Value |
|-------|-------|
| Application | User App |
| Status | Draft |
| Owned decisions | None |
| Review list | [`00_USER_APP_REVIEW_LIST.md`](00_USER_APP_REVIEW_LIST.md) |
| Shared context | [`CONTEXT.md`](../../CONTEXT.md) |

---

## 1. Purpose

Defines how a user creates an account, logs in, and is onboarded into the
User App, and how an account is deleted.

## 2. Scope / Out of scope

**In scope**
- Sign-up and login.
- Onboarding steps shown to a new user.
- Account deletion flow.

**Out of scope**
- User profile fields and settings → [12](12_USER_PROFILE_AND_SETTINGS.md).
- Birth profiles and Kundli → [13](13_BIRTH_PROFILES_AND_KUNDLI.md).
- Notification rules → [15](15_NOTIFICATIONS.md).

## 3. Entry points

- App launch for a user who is not logged in.
- Relationship to the main navigation and guest access:
  `PENDING DISCUSSION` (P-01-10, P-02-02).

## 4. Confirmed decisions

This module owns no confirmed decisions.

**Referenced decisions**

| ID | Topic | Owning file |
|----|-------|-------------|
| D-12 | Number of birth profiles | [13](13_BIRTH_PROFILES_AND_KUNDLI.md) |
| D-15 | Critical notifications (includes security and account alerts) | [15](15_NOTIFICATIONS.md) |

## 5. User flows

`PENDING DISCUSSION` — depends on:
- Login method(s) (P-02-01).
- Guest browsing (P-02-02).
- Whether a birth profile is created during onboarding (P-02-03).
- Language selection during onboarding (P-02-05).
- Introductory/welcome screens (P-02-07).
- Account deletion (P-02-06).

## 6. Screens and content

`PENDING DISCUSSION` (P-02-01, P-02-03, P-02-05, P-02-07).

## 7. Business rules and validations

No confirmed rules are owned by this module.

- If a birth profile is created during onboarding (P-02-03), the birth
  profile rules in D-12 → [13](13_BIRTH_PROFILES_AND_KUNDLI.md) apply.
- Minimum age and its validation: `PENDING DISCUSSION` (P-02-04).

## 8. States and edge cases

`PENDING DISCUSSION` — login failure, verification failure, and interrupted
onboarding behaviour depend on P-02-01 and P-02-03.

## 9. Notifications triggered

| Notification | Category | Rule |
|--------------|----------|------|
| Security alerts | Critical | D-15 → [15](15_NOTIFICATIONS.md) |
| Account alerts | Critical | D-15 → [15](15_NOTIFICATIONS.md) |

Exact events: `PENDING DISCUSSION` (P-15-03).

## 10. Dependencies on other modules

- [01](01_NAVIGATION_AND_STRUCTURE.md) — navigation after login (P-01-10, P-01-11).
- [12](12_USER_PROFILE_AND_SETTINGS.md) — profile fields collected at sign-up (P-12-01).
- [13](13_BIRTH_PROFILES_AND_KUNDLI.md) — birth profile creation (P-02-03).
- [15](15_NOTIFICATIONS.md) — security and account alerts.

## 11. PENDING DISCUSSION

Full wording in [`00_USER_APP_REVIEW_LIST.md` §4](00_USER_APP_REVIEW_LIST.md#4-pending-discussion-register).

**Owned by this module**

| ID | Topic |
|----|-------|
| P-02-01 | Login method(s) |
| P-02-02 | Guest browsing |
| P-02-03 | Birth profile during onboarding |
| P-02-04 | Minimum age |
| P-02-05 | Language selection during onboarding |
| P-02-06 | Account deletion flow |
| P-02-07 | Introductory/welcome screens |

**Related (owned elsewhere)**

| ID | Topic |
|----|-------|
| P-01-10 | Navigation for users who are not logged in |
| P-01-11 | Default tab after login |
| P-12-01 | User profile fields |
| P-GL-01 | Supported languages |
| P-GL-03 | Privacy, consent and data retention |

## 12. Acceptance criteria

- [ ] Security and account alerts produced by this module are handled as critical notifications under D-15 (→ [15](15_NOTIFICATIONS.md)).

No other confirmed criteria yet.

## 13. Change log

| Date | Change |
|------|--------|
| 2026-11-17 | Initial draft created. |
