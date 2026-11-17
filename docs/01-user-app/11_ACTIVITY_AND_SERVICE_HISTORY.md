# 11 — Activity and Service History

| Field | Value |
|-------|-------|
| Application | User App |
| Status | Draft |
| Owned decisions | None (tab purpose D-03 is owned by 01) |
| Review list | [`00_USER_APP_REVIEW_LIST.md`](00_USER_APP_REVIEW_LIST.md) |
| Shared context | [`CONTEXT.md`](../../CONTEXT.md) |

---

## 1. Purpose

Defines the Activity tab, where users manage services they have already
purchased or used (D-03 → [01](01_NAVIGATION_AND_STRUCTURE.md)).

## 2. Scope / Out of scope

**In scope**
- Lists and history of purchased or used services.
- Access to follow-up actions on those services (disputes, reviews).

**Out of scope**
- Discovering, starting, or purchasing new services → Services tab (D-02 → [01](01_NAVIGATION_AND_STRUCTURE.md)).
- Rules of each service → [06](06_TEXT_QUESTION_SERVICE.md), [07](07_APPOINTMENT_SERVICE.md), [08](08_INSTANT_CALL.md), [09](09_INSTANT_CHAT.md).

## 3. Entry points

- **Activity** tab in the bottom navigation (D-01, D-03 → [01](01_NAVIGATION_AND_STRUCTURE.md)).

## 4. Confirmed decisions

This module owns no confirmed decisions.

**Referenced decisions**

| ID | Topic | Owning file |
|----|-------|-------------|
| D-01 | Bottom navigation tabs | [01](01_NAVIGATION_AND_STRUCTURE.md) |
| D-03 | Purpose of the Activity tab | [01](01_NAVIGATION_AND_STRUCTURE.md) |
| D-06 | Using or holding a question slot | [06](06_TEXT_QUESTION_SERVICE.md) |
| D-07 | Question slot expiry | [06](06_TEXT_QUESTION_SERVICE.md) |
| D-08 | Text Question dispute | [06](06_TEXT_QUESTION_SERVICE.md) |
| D-09 | Services without a dispute option | [07](07_APPOINTMENT_SERVICE.md), [08](08_INSTANT_CALL.md), [09](09_INSTANT_CHAT.md) |
| D-10 | Reviews after consultations | [07](07_APPOINTMENT_SERVICE.md), [08](08_INSTANT_CALL.md), [09](09_INSTANT_CHAT.md) |

## 5. User flows

`PENDING DISCUSSION`:
- Browsing purchased or used services (P-11-01, P-11-02).
- Reaching a dispute (D-08) or review (D-10) from Activity (P-11-05).
- Whether held question slots appear here (P-01-09).

## 6. Screens and content

`PENDING DISCUSSION`:
- Tabs or categories (P-11-01).
- Filters (P-11-02).
- Statuses per service type (P-11-03).

## 7. Business rules and validations

No confirmed rules are owned by this module. Activity must reflect the
rules of each service:
- Question slot states and expiry: D-06, D-07 → [06](06_TEXT_QUESTION_SERVICE.md).
- Dispute availability for Text Questions: D-08 → [06](06_TEXT_QUESTION_SERVICE.md).
- No dispute for Appointment, Instant Call, Instant Chat: D-09 → [07](07_APPOINTMENT_SERVICE.md), [08](08_INSTANT_CALL.md), [09](09_INSTANT_CHAT.md).
- Reviews after consultation: D-10 → [07](07_APPOINTMENT_SERVICE.md), [08](08_INSTANT_CALL.md), [09](09_INSTANT_CHAT.md).

History retention: `PENDING DISCUSSION` (P-11-04).

## 8. States and edge cases

`PENDING DISCUSSION` — empty Activity, loading, and error states depend on
P-11-01. Status values: P-11-03.

## 9. Notifications triggered

None owned. Notifications come from the service modules (→ [15](15_NOTIFICATIONS.md)).

## 10. Dependencies on other modules

- [01](01_NAVIGATION_AND_STRUCTURE.md) — tab purpose.
- [06](06_TEXT_QUESTION_SERVICE.md), [07](07_APPOINTMENT_SERVICE.md), [08](08_INSTANT_CALL.md), [09](09_INSTANT_CHAT.md) — services shown.
- [10](10_WALLET_AND_PAYMENTS.md) — relationship with wallet transaction history (P-10-09).

## 11. PENDING DISCUSSION

Full wording in [`00_USER_APP_REVIEW_LIST.md` §4](00_USER_APP_REVIEW_LIST.md#4-pending-discussion-register).

**Owned by this module**

| ID | Topic |
|----|-------|
| P-11-01 | Tabs or categories |
| P-11-02 | Filters |
| P-11-03 | Statuses per service type |
| P-11-04 | History retention |
| P-11-05 | Reaching disputes and reviews |

**Related (owned elsewhere)**

| ID | Topic |
|----|-------|
| P-01-09 | Where held slots appear |
| P-09-05 | Chat history retention |
| P-10-09 | Wallet transaction history |

## 12. Acceptance criteria

- [ ] Services already purchased or used are managed from the Activity tab (D-03 → [01](01_NAVIGATION_AND_STRUCTURE.md)).
- [ ] No dispute option is shown for Appointment, Instant Call, or Instant Chat items (D-09).

## 13. Change log

| Date | Change |
|------|--------|
| 2026-11-17 | Initial draft created. |
