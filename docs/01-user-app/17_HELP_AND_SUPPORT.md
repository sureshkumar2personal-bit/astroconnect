# 17 — Help and Support

| Field | Value |
|-------|-------|
| Application | User App |
| Status | Draft |
| Owned decisions | None |
| Review list | [`00_USER_APP_REVIEW_LIST.md`](00_USER_APP_REVIEW_LIST.md) |
| Shared context | [`CONTEXT.md`](../../CONTEXT.md) |

---

## 1. Purpose

Defines how users get help and contact support.

## 2. Scope / Out of scope

**In scope**
- Support channels and ticket categories.
- Response times.
- Reporting problems, including reporting an astrologer.

**Out of scope**
- Text Question disputes → D-08 → [06](06_TEXT_QUESTION_SERVICE.md).

## 3. Entry points

`PENDING DISCUSSION` (P-01-05).

## 4. Confirmed decisions

This module owns no confirmed decisions.

**Referenced decisions**

| ID | Topic | Owning file |
|----|-------|-------------|
| D-08 | Text Question dispute | [06](06_TEXT_QUESTION_SERVICE.md) |
| D-09 | Services without a dispute option | [07](07_APPOINTMENT_SERVICE.md), [08](08_INSTANT_CALL.md), [09](09_INSTANT_CHAT.md) |
| D-19 | One dispute; 3-day dispute answer; Admin Review | [06](06_TEXT_QUESTION_SERVICE.md) |
| D-27 | Platform Complaint after a dispute answer | [06](06_TEXT_QUESTION_SERVICE.md) |

## 5. User flows

`PENDING DISCUSSION` (P-17-01, P-17-02, P-17-05).

## 6. Screens and content

`PENDING DISCUSSION` (P-17-01, P-17-02).

## 7. Business rules and validations

No confirmed rules are owned by this module.

- Disputes exist only for Text Questions (D-08 → [06](06_TEXT_QUESTION_SERVICE.md));
  Appointment, Instant Call, and Instant Chat have no dispute option
  (D-09 → [07](07_APPOINTMENT_SERVICE.md), [08](08_INSTANT_CALL.md), [09](09_INSTANT_CHAT.md)).
- Unanswered disputes move to Admin Review after 3 days (D-19 → [06](06_TEXT_QUESTION_SERVICE.md)).
- A Platform Complaint about an inappropriate or improper Text Question answer can be raised within 7 days after the dispute answer and is handled separately from disputes (D-27 → [06](06_TEXT_QUESTION_SERVICE.md)).
- How support relates to Text Question disputes and Platform Complaints: `PENDING DISCUSSION` (P-17-04).

## 8. States and edge cases

`PENDING DISCUSSION` (P-17-01, P-17-03).

## 9. Notifications triggered

None confirmed.

## 10. Dependencies on other modules

- [06](06_TEXT_QUESTION_SERVICE.md) — disputes (P-17-04).
- [05](05_ASTROLOGER_PROFILE.md) — reporting an astrologer (P-05-05, P-17-05).

## 11. PENDING DISCUSSION

Full wording in [`00_USER_APP_REVIEW_LIST.md` §4](00_USER_APP_REVIEW_LIST.md#4-pending-discussion-register).

**Owned by this module**

| ID | Topic |
|----|-------|
| P-17-01 | Support channels |
| P-17-02 | Ticket categories |
| P-17-03 | Response times |
| P-17-04 | Relationship to Text Question disputes |
| P-17-05 | Reporting an astrologer |

**Related (owned elsewhere)**

| ID | Topic |
|----|-------|
| P-01-05 | Entry point |
| P-05-05 | Share or report a profile |

## 12. Acceptance criteria

No confirmed criteria owned by this module yet.

## 13. Change log

| Date | Change |
|------|--------|
| 2026-11-17 | Initial draft created. |
| 2026-11-19 | Referenced D-19 (Admin Review) and D-27 (Platform Complaint). |
