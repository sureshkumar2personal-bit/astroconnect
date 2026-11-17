# 15 — Notifications

| Field | Value |
|-------|-------|
| Application | User App |
| Status | Draft |
| Owned decisions | D-15, D-16 |
| Review list | [`00_USER_APP_REVIEW_LIST.md`](00_USER_APP_REVIEW_LIST.md) |
| Shared context | [`CONTEXT.md`](../../CONTEXT.md) |

---

## 1. Purpose

Defines User App notifications: critical and non-critical notifications,
delivery channels, and what the user can control.

## 2. Scope / Out of scope

**In scope**
- Critical notification categories and the always-ON rule.
- Delivery channels.
- Non-critical notifications and user preferences.

**Out of scope**
- The events each module produces are listed in that module's §9; this
  file owns the notification rules.
- Settings screen layout → [12](12_USER_PROFILE_AND_SETTINGS.md).

## 3. Entry points

- Where notifications are viewed: `PENDING DISCUSSION` (P-01-04, P-15-07).

## 4. Confirmed decisions

**Owned by this module** (verbatim from the decision register)

| ID | Decision |
|----|----------|
| D-15 | **Critical notifications are always ON** and cannot be disabled. These include **appointment, question, payment/wallet, subscription, security, and account** alerts. |
| D-16 | Confirmed notification channels: **push** and **in-app**. **Email, WhatsApp, and SMS are not confirmed** (see P-15-01). |

## 5. User flows

- Receiving a notification: `PENDING DISCUSSION` (P-15-03, P-15-07).
- Changing notification preferences: only non-critical notifications can be
  changed (D-15). List of non-critical notifications: `PENDING DISCUSSION`
  (P-15-02).

## 6. Screens and content

`PENDING DISCUSSION` (P-01-04, P-15-07).

## 7. Business rules and validations

| # | Rule | Source |
|---|------|--------|
| R-15-01 | Critical notifications are always ON. | D-15 |
| R-15-02 | The user cannot disable critical notifications through the app's notification settings. The user can still disable push permission in the phone's settings; the resulting behaviour is `PENDING DISCUSSION` (P-15-06). | D-15 |
| R-15-03 | Critical categories include: appointment, question, payment/wallet, subscription, security, and account alerts. | D-15 |
| R-15-04 | Confirmed delivery channels are push and in-app. | D-16 |
| R-15-05 | Email, WhatsApp, and SMS are not confirmed notification channels. Whether they will be supported: `PENDING DISCUSSION` (P-15-01). | D-16 |
| R-15-06 | The always-ON rule must not be assumed to apply to any unconfirmed channel. | D-16, P-15-06 |

**Critical categories and related modules**

The module column is a cross-reference only. It does not create or confirm
any notification category beyond those listed in D-15.

| Category (D-15) | Related module(s) |
|-----------------|-------------------|
| Appointment | [07](07_APPOINTMENT_SERVICE.md) |
| Question | [06](06_TEXT_QUESTION_SERVICE.md) |
| Payment/wallet | [10](10_WALLET_AND_PAYMENTS.md) |
| Subscription | [14](14_FOLLOWING_AND_SUBSCRIPTIONS.md) |
| Security | [02](02_AUTHENTICATION_AND_ONBOARDING.md), [12](12_USER_PROFILE_AND_SETTINGS.md) |
| Account | [02](02_AUTHENTICATION_AND_ONBOARDING.md), [12](12_USER_PROFILE_AND_SETTINGS.md) |

Notifications from Instant Call, Instant Chat, and Remedy Tracker are not
named in D-15; their category is `PENDING DISCUSSION` (P-15-08).

**Pending rules**
- Exact events per critical category (P-15-03).
- How always-ON applies to push and in-app, including device-level push
  permission (P-15-06).
- Quiet hours (P-15-04).
- Marketing opt-in (P-15-05).

## 8. States and edge cases

| Case | Behaviour |
|------|-----------|
| User tries to disable a critical notification in the app's notification settings | Not allowed (D-15) |
| User disables push permission in the phone's settings | The user can do this; resulting behaviour `PENDING DISCUSSION` (P-15-06) |

## 9. Notifications triggered

This module defines the rules; events are listed in each module's §9.

## 10. Dependencies on other modules

- [02](02_AUTHENTICATION_AND_ONBOARDING.md), [06](06_TEXT_QUESTION_SERVICE.md), [07](07_APPOINTMENT_SERVICE.md), [08](08_INSTANT_CALL.md), [09](09_INSTANT_CHAT.md), [10](10_WALLET_AND_PAYMENTS.md), [12](12_USER_PROFILE_AND_SETTINGS.md), [14](14_FOLLOWING_AND_SUBSCRIPTIONS.md), [16](16_REMEDY_TRACKER.md) — notification sources.
- [12](12_USER_PROFILE_AND_SETTINGS.md) — preferences screen.

## 11. PENDING DISCUSSION

Full wording in [`00_USER_APP_REVIEW_LIST.md` §4](00_USER_APP_REVIEW_LIST.md#4-pending-discussion-register).

**Owned by this module**

| ID | Topic |
|----|-------|
| P-15-01 | Email, WhatsApp, SMS support |
| P-15-02 | Non-critical notifications |
| P-15-03 | Exact events per critical category |
| P-15-04 | Quiet hours |
| P-15-05 | Marketing opt-in |
| P-15-06 | Always-ON across push and in-app; device-level permission |
| P-15-07 | In-app notification list and retention |
| P-15-08 | Category of Instant Call, Instant Chat, Remedy Tracker notifications |

**Related (owned elsewhere)**

| ID | Topic |
|----|-------|
| P-01-04 | Entry point |
| P-01-12 | Tab badges |
| P-07-07 | Appointment reminder timing |

## 12. Acceptance criteria

- [ ] Critical notifications (appointment, question, payment/wallet, subscription, security, account) cannot be disabled through the app's notification settings (D-15). Behaviour when push permission is disabled in phone settings follows the answer to P-15-06.
- [ ] Notifications are delivered through push and in-app channels (D-16).
- [ ] No notification requirement relies on email, WhatsApp, or SMS while they remain unconfirmed (D-16, P-15-01).

## 13. Change log

| Date | Change |
|------|--------|
| 2026-11-17 | Initial draft created from D-15, D-16. |
| 2026-11-17 | Aligned with approved interpretations: app-settings vs phone push permission (P-15-06), unconfirmed channels (P-15-01), category–module table marked as cross-reference only. |
