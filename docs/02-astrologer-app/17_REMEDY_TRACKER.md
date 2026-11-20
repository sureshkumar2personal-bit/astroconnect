# 17 — Remedy Tracker

| Field | Value |
|-------|-------|
| Application | Astrologer App |
| Status | Draft |
| Owned decisions | AD-163 |
| Review list | [`00_ASTROLOGER_APP_REVIEW_LIST.md`](00_ASTROLOGER_APP_REVIEW_LIST.md) |
| Shared context | [`CONTEXT.md`](../../CONTEXT.md) |

> **Frontend UI phase.** This specification describes product behaviour. It
> does not define APIs, data structures, or backend logic. Items marked
> `PENDING DISCUSSION` must not be implemented as if decided.

---

## 1. Purpose

Brings together the astrologer-side Remedy Tracker rules: remedies from Text
Question answers and Dispute Answers, and notes, remedies, recommendations,
and reports from Appointments, each linked to the User and the originating
record.

## 2. Scope / Out of scope

**In scope**
- Appointment-related records in the Remedy Tracker (AD-163).
- Relationship and navigation to the originating record.

**Out of scope** (owned elsewhere; ownership unchanged)
- Astrologer view of remedies and completion → AD-22 ([01](01_HOME_SCREEN.md)).
- Prescribing remedies while answering → AD-39 ([02](02_TEXT_BASED_QUESTIONS.md)).
- Adding post-consultation attachments → AD-102 ([05](05_APPOINTMENTS.md)).
- Remedy subscriptions, payments, or delivery workflows — none exist (AD-163).

## 3. Entry points

- Home Quick Action **Remedy Tracker** (AD-21 → [01](01_HOME_SCREEN.md)).
- Appointment History (AD-102 → [05](05_APPOINTMENTS.md)).
- Placement within the tabs: `PENDING DISCUSSION` (AP-GL-02).

## 4. Confirmed decisions

**Owned by this module** (verbatim from the decision register)

| ID | Decision |
|----|----------|
| AD-163 | **Remedy Tracker — appointment records:** notes, remedies, recommendations, and reports attached after an Appointment (immediately or later through Appointment History, AD-102) are also available in the Remedy Tracker. The relationship between each remedy/report, the relevant User, and the originating Appointment/Consultation is preserved, with correct navigation to the original record. No additional remedy subscription, payment, or delivery workflows are added. |

**Referenced decisions**

| ID | Topic | Owning file |
|----|-------|-------------|
| AD-21 | Remedy Tracker Quick Action | [01](01_HOME_SCREEN.md) |
| AD-22 | Astrologer view; only the User marks Completed | [01](01_HOME_SCREEN.md) |
| AD-39 | Prescribing remedies in answers and Dispute Answers | [02](02_TEXT_BASED_QUESTIONS.md) |
| AD-45 | Astrologer attachment rules | [02](02_TEXT_BASED_QUESTIONS.md) |
| AD-78 | Record navigation | [03](03_GLOBAL_NAVIGATION.md) |
| AD-102 | Post-consultation attachments | [05](05_APPOINTMENTS.md) |

## 5. User flows

### 5.1 Appointment record reaches the Remedy Tracker
1. After an Appointment, the astrologer attaches notes, remedies, recommendations, or reports — immediately or later from Appointment History (AD-102).
2. The record also appears in the Remedy Tracker, linked to the User and the originating Appointment (AD-163).

### 5.2 Open the original record
From a Remedy Tracker item, the astrologer opens the originating Appointment/Consultation (AD-163, AD-78).

### 5.3 Completion
Only the User can mark a remedy Completed; the astrologer sees the status and any uploaded attachment (AD-22 → [01](01_HOME_SCREEN.md)).

## 6. Screens and content

| Item | Content | Source |
|------|---------|--------|
| Remedy Tracker list | Remedies prescribed by this astrologer and their completion status | AD-22 |
| Appointment record | Notes/remedies/recommendations/reports; User; originating Appointment/Consultation; link to it | AD-163 |

Remedy fields beyond these are not defined (User App P-16-01).

## 7. Business rules and validations

| # | Rule | Source |
|---|------|--------|
| REM-01 | Appointment notes, remedies, recommendations, and reports are available in the Remedy Tracker. | AD-163 |
| REM-02 | Each item keeps its link to the User and the originating Appointment/Consultation. | AD-163 |
| REM-03 | Navigation from an item opens the original record. | AD-163, AD-78 |
| REM-04 | No remedy subscription, payment, or delivery workflow. | AD-163 |
| REM-05 | Only the User marks a remedy Completed. | AD-22 |

## 8. States and edge cases

| Case | Behaviour |
|------|-----------|
| Attachment added later from Appointment History | Appears in the Remedy Tracker (AD-102, AD-163) |
| Appointment completed without attachments | Allowed; completion/settlement unaffected (AD-102) |
| Remedy not yet completed by the User | Shown as not completed; astrologer cannot change it (AD-22) |

## 9. Notifications triggered

Pending attachment/action reminders → AD-102 ([05](05_APPOINTMENTS.md)).

## 10. Dependencies on other modules

- [01](01_HOME_SCREEN.md), [02](02_TEXT_BASED_QUESTIONS.md), [05](05_APPOINTMENTS.md).
- **User App:** X-08 (resolved; User App D-11, D-29); X-23 (appointment records and link to original consultation; User App P-16-01, P-16-05).
- **Platform Admin:** none confirmed.

## 11. PENDING DISCUSSION

Full wording in [`00_ASTROLOGER_APP_REVIEW_LIST.md` §4](00_ASTROLOGER_APP_REVIEW_LIST.md#4-open-questions-register).

**Owned by this module:** none.

**Related**

| ID | Topic | Status |
|----|-------|--------|
| AP-GL-02 | Placement of the Remedy Tracker within the tabs | Open — missing source information |

## 12. Acceptance criteria

- [ ] Appointment notes, remedies, recommendations, and reports appear in the Remedy Tracker linked to the User and the originating record, with working navigation to it (AD-163).
- [ ] No remedy subscription, payment, or delivery workflow exists (AD-163).

## 13. Change log

| Date | Change |
|------|--------|
| 2026-11-20 | Initial draft created from the Master Decision Document: AD-163. AD-22 and AD-39 ownership unchanged. |
