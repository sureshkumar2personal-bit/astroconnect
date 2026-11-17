# 09 — Instant Chat

| Field | Value |
|-------|-------|
| Application | User App |
| Status | Draft |
| Owned decisions | D-09, D-10 (shared with 07, 08) |
| Review list | [`00_USER_APP_REVIEW_LIST.md`](00_USER_APP_REVIEW_LIST.md) |
| Shared context | [`CONTEXT.md`](../../CONTEXT.md) |

---

## 1. Purpose

Defines the Instant Chat consultation service. The definition of an
Instant Chat is `PENDING DISCUSSION` (P-09-07).

## 2. Scope / Out of scope

**In scope**
- Starting, conducting, and ending an Instant Chat.
- Reviews after the chat.
- Remedy hand-off to the Remedy Tracker.

**Out of scope**
- Wallet top-up and refunds in general → [10](10_WALLET_AND_PAYMENTS.md).
- Chat history in Activity → [11](11_ACTIVITY_AND_SERVICE_HISTORY.md).

## 3. Entry points

- Start: **Services** tab (D-02 → [01](01_NAVIGATION_AND_STRUCTURE.md)). Layout: `PENDING DISCUSSION` (P-01-07).
- From an astrologer profile: `PENDING DISCUSSION` (P-05-06).
- History: **Activity** tab (D-03 → [01](01_NAVIGATION_AND_STRUCTURE.md)).

## 4. Confirmed decisions

**Owned by this module** (shared with [07](07_APPOINTMENT_SERVICE.md) and [08](08_INSTANT_CALL.md); verbatim from the decision register)

| ID | Decision |
|----|----------|
| D-09 | Appointments, Instant Calls, and Instant Chats **do not** have a dispute option. |
| D-10 | Users can **submit a review after** an Appointment, Instant Call, or Instant Chat consultation. |

**Referenced decisions**

| ID | Topic | Owning file |
|----|-------|-------------|
| D-02 | Purpose of the Services tab | [01](01_NAVIGATION_AND_STRUCTURE.md) |
| D-03 | Purpose of the Activity tab | [01](01_NAVIGATION_AND_STRUCTURE.md) |
| D-11 | Remedies in the Remedy Tracker | [16](16_REMEDY_TRACKER.md) |
| D-15 | Critical notifications | [15](15_NOTIFICATIONS.md) |

## 5. User flows

1. Start a chat: `PENDING DISCUSSION` (P-09-01, P-09-02, P-09-06, P-13-09).
2. Astrologer does not accept or respond: `PENDING DISCUSSION` (P-09-08).
3. During the chat, if the astrologer prescribes or attaches a remedy, it
   also appears in the Remedy Tracker (D-11 → [16](16_REMEDY_TRACKER.md)).
4. After the consultation, the user can submit a review (D-10). Review
   content: `PENDING DISCUSSION` (P-07-10).

## 6. Screens and content

`PENDING DISCUSSION` (P-09-01, P-09-03, P-09-04, P-07-10).

## 7. Business rules and validations

| # | Rule | Source |
|---|------|--------|
| R-09-01 | An Instant Chat has no dispute option. | D-09 |
| R-09-02 | The user can submit a review after the Instant Chat consultation. | D-10 |
| R-09-03 | A remedy prescribed or attached during an Instant Chat must also appear in the user's Remedy Tracker. | D-11 → [16](16_REMEDY_TRACKER.md) |

**Pending rules:** pricing (P-09-01), minimum balance (P-09-02), session
limits (P-09-03), attachments (P-09-04), history retention (P-09-05),
subscription requirement (P-09-06).

## 8. States and edge cases

| Case | Behaviour |
|------|-----------|
| User wants to dispute a chat | No dispute option (D-09) |
| Chat completed | Review can be submitted (D-10) |
| Insufficient balance | `PENDING DISCUSSION` (P-09-02) |
| Astrologer does not accept or respond | `PENDING DISCUSSION` (P-09-08) |
| Session time limit reached | `PENDING DISCUSSION` (P-09-03) |

Chat statuses: `PENDING DISCUSSION` (P-11-03).

## 9. Notifications triggered

| Notification | Category | Rule |
|--------------|----------|------|
| Instant Chat notifications | `PENDING DISCUSSION` (P-15-08) | → [15](15_NOTIFICATIONS.md) |
| Payment/wallet alerts | Critical (payment/wallet) | D-15 → [15](15_NOTIFICATIONS.md) |

## 10. Dependencies on other modules

- [01](01_NAVIGATION_AND_STRUCTURE.md), [05](05_ASTROLOGER_PROFILE.md), [10](10_WALLET_AND_PAYMENTS.md), [11](11_ACTIVITY_AND_SERVICE_HISTORY.md), [13](13_BIRTH_PROFILES_AND_KUNDLI.md), [14](14_FOLLOWING_AND_SUBSCRIPTIONS.md), [15](15_NOTIFICATIONS.md), [16](16_REMEDY_TRACKER.md).

## 11. PENDING DISCUSSION

Full wording in [`00_USER_APP_REVIEW_LIST.md` §4](00_USER_APP_REVIEW_LIST.md#4-pending-discussion-register).

**Owned by this module**

| ID | Topic |
|----|-------|
| P-09-01 | Pricing model |
| P-09-02 | Minimum wallet balance |
| P-09-03 | Session time limits |
| P-09-04 | Attachments in chat |
| P-09-05 | Chat history retention |
| P-09-06 | Subscription requirement |
| P-09-07 | Definition of an Instant Chat |
| P-09-08 | Astrologer does not accept or respond |

**Related (owned elsewhere)**

| ID | Topic |
|----|-------|
| P-01-07 | Services tab layout |
| P-05-06 | Actions on the astrologer profile |
| P-07-10 | Review content and rules |
| P-11-03 | Statuses per service |
| P-13-09 | Birth profile shared in services |
| P-15-08 | Category of Instant Chat notifications |

## 12. Acceptance criteria

- [ ] No dispute option is offered for an Instant Chat (D-09).
- [ ] After an Instant Chat consultation, the user can submit a review (D-10).
- [ ] A remedy prescribed or attached during an Instant Chat appears in the Remedy Tracker (D-11).

## 13. Change log

| Date | Change |
|------|--------|
| 2026-11-17 | Initial draft created from D-09, D-10. |
