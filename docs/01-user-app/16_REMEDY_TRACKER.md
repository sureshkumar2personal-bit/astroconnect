# 16 — Remedy Tracker

| Field | Value |
|-------|-------|
| Application | User App |
| Status | Draft |
| Owned decisions | D-11, D-29 |
| Review list | [`00_USER_APP_REVIEW_LIST.md`](00_USER_APP_REVIEW_LIST.md) |
| Shared context | [`CONTEXT.md`](../../CONTEXT.md) |

---

## 1. Purpose

Defines the Remedy Tracker, where the user sees remedies prescribed or
attached by astrologers.

## 2. Scope / Out of scope

**In scope**
- Collecting remedies from all services into the Remedy Tracker.
- Viewing and interacting with remedies.

**Out of scope**
- How remedies are written or attached inside each service
  ([06](06_TEXT_QUESTION_SERVICE.md), [07](07_APPOINTMENT_SERVICE.md), [08](08_INSTANT_CALL.md), [09](09_INSTANT_CHAT.md)).

## 3. Entry points

`PENDING DISCUSSION` (P-01-03).

## 4. Confirmed decisions

**Owned by this module** (verbatim from the decision register)

| ID | Decision |
|----|----------|
| D-11 | If an astrologer prescribes or attaches a **remedy in any service** — including a Text Question answer and a Dispute Answer — it must also appear in the user's **Remedy Tracker**. *(Amended 2026-11-19.)* |
| D-29 | **Remedy completion:** only the user can mark a remedy Completed. The user may upload a supporting photo or document, which the prescribing astrologer can view. |

## 5. User flows

1. An astrologer prescribes or attaches a remedy in any service
   (Text Question, Appointment, Instant Call, Instant Chat).
2. The remedy also appears in the user's Remedy Tracker (D-11).
3. Only the user can mark the remedy Completed, and may upload a supporting photo or document, which the prescribing astrologer can view (D-29).
4. Remedy reminders: `PENDING DISCUSSION` (P-16-03).

## 6. Screens and content

`PENDING DISCUSSION`:
- Remedy fields (P-16-01).
- Link to the original consultation (P-16-05).
- User-added remedies (P-16-04).

## 7. Business rules and validations

| # | Rule | Source |
|---|------|--------|
| R-16-01 | Every remedy prescribed or attached by an astrologer in any service must appear in the user's Remedy Tracker. | D-11 |
| R-16-02 | This applies to every service, currently: Text Question ([06](06_TEXT_QUESTION_SERVICE.md)), Appointment ([07](07_APPOINTMENT_SERVICE.md)), Instant Call ([08](08_INSTANT_CALL.md)), Instant Chat ([09](09_INSTANT_CHAT.md)). | D-11 |
| R-16-03 | Remedies from Dispute Answers also appear in the Remedy Tracker. | D-11 |
| R-16-04 | Only the user can mark a remedy Completed; the user may upload a supporting photo or document, visible to the prescribing astrologer. | D-29 |

**Pending rules:** reminders (P-16-03),
user-added remedies (P-16-04), astrologer edits or removal (P-16-06).

## 8. States and edge cases

| Case | Behaviour |
|------|-----------|
| No remedies yet | `PENDING DISCUSSION` (empty-state content depends on P-16-01) |
| Astrologer edits or removes a remedy | `PENDING DISCUSSION` (P-16-06) |

## 9. Notifications triggered

| Notification | Category | Rule |
|--------------|----------|------|
| Remedy notifications (e.g. new remedy, reminders) | `PENDING DISCUSSION` (P-15-08, P-16-03) | → [15](15_NOTIFICATIONS.md) |

## 10. Dependencies on other modules

- [06](06_TEXT_QUESTION_SERVICE.md), [07](07_APPOINTMENT_SERVICE.md), [08](08_INSTANT_CALL.md), [09](09_INSTANT_CHAT.md) — remedy sources.
- [15](15_NOTIFICATIONS.md) — remedy notifications.

## 11. PENDING DISCUSSION

Full wording in [`00_USER_APP_REVIEW_LIST.md` §4](00_USER_APP_REVIEW_LIST.md#4-pending-discussion-register).

**Owned by this module**

| ID | Topic |
|----|-------|
| P-16-01 | Remedy fields |
| P-16-03 | Reminders |
| P-16-04 | User-added remedies |
| P-16-05 | Link to original consultation |
| P-16-06 | Astrologer edits or removal |

**Related (owned elsewhere)**

| ID | Topic |
|----|-------|
| P-01-03 | Entry point |
| P-15-08 | Category of Remedy Tracker notifications |

## 12. Acceptance criteria

- [ ] A remedy prescribed or attached in a Text Question appears in the Remedy Tracker (D-11).
- [ ] A remedy prescribed or attached in an Appointment appears in the Remedy Tracker (D-11).
- [ ] A remedy prescribed or attached in an Instant Call appears in the Remedy Tracker (D-11).
- [ ] A remedy prescribed or attached in an Instant Chat appears in the Remedy Tracker (D-11).
- [ ] A remedy prescribed in a Text Question Dispute Answer appears in the Remedy Tracker (D-11).
- [ ] Only the user can mark a remedy Completed and may upload a supporting photo or document (D-29).

## 13. Change log

| Date | Change |
|------|--------|
| 2026-11-17 | Initial draft created from D-11. |
| 2026-11-19 | D-11 amended (Dispute Answers included); D-29 added (user-only completion with optional upload). P-16-02 retired. R-16-03, R-16-04 added. |
