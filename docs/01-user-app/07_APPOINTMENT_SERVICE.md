# 07 — Appointment Service

| Field | Value |
|-------|-------|
| Application | User App |
| Status | Draft |
| Owned decisions | D-09, D-10 (shared with 08, 09), D-30 |
| Review list | [`00_USER_APP_REVIEW_LIST.md`](00_USER_APP_REVIEW_LIST.md) |
| Shared context | [`CONTEXT.md`](../../CONTEXT.md) |

---

## 1. Purpose

Defines the Appointment consultation service. The definition of an
Appointment is `PENDING DISCUSSION` (P-07-09).

## 2. Scope / Out of scope

**In scope**
- Booking, attending, and completing an appointment.
- Reviews after an appointment.
- Remedy hand-off to the Remedy Tracker.

**Out of scope**
- Payment and refunds in general → [10](10_WALLET_AND_PAYMENTS.md).
- Managing booked or completed appointments → [11](11_ACTIVITY_AND_SERVICE_HISTORY.md).
- Review display → [05](05_ASTROLOGER_PROFILE.md).

## 3. Entry points

- Start and purchase: **Services** tab (D-02 → [01](01_NAVIGATION_AND_STRUCTURE.md)). Layout: `PENDING DISCUSSION` (P-01-07).
- From an astrologer profile: `PENDING DISCUSSION` (P-05-06).
- Manage: **Activity** tab (D-03 → [01](01_NAVIGATION_AND_STRUCTURE.md)).

## 4. Confirmed decisions

**Owned by this module** (shared with [08](08_INSTANT_CALL.md) and [09](09_INSTANT_CHAT.md); verbatim from the decision register)

| ID | Decision |
|----|----------|
| D-09 | Appointments, Instant Calls, and Instant Chats **do not** have a dispute option. |
| D-10 | Users can **submit a review after** an Appointment, Instant Call, or Instant Chat consultation. |
| D-30 | **Astrologer DND / Planned Unavailability:** during this period the astrologer is unavailable for all services. Already-booked appointments falling within the period are cancelled and the user receives a **full refund**; new appointment bookings are blocked for the unavailable dates. |

**Referenced decisions**

| ID | Topic | Owning file |
|----|-------|-------------|
| D-02 | Purpose of the Services tab | [01](01_NAVIGATION_AND_STRUCTURE.md) |
| D-03 | Purpose of the Activity tab | [01](01_NAVIGATION_AND_STRUCTURE.md) |
| D-11 | Remedies in the Remedy Tracker | [16](16_REMEDY_TRACKER.md) |
| D-15 | Critical notifications (includes appointment alerts) | [15](15_NOTIFICATIONS.md) |
| D-28 | IST calendar-day counting | [06](06_TEXT_QUESTION_SERVICE.md) |

## 5. User flows

1. Book an appointment: `PENDING DISCUSSION` (P-07-01, P-07-02, P-07-03, P-07-08, P-13-09).
2. Pay: → [10](10_WALLET_AND_PAYMENTS.md).
3. Attend the consultation: `PENDING DISCUSSION` (P-07-03).
4. If the astrologer prescribes or attaches a remedy, it also appears in the
   Remedy Tracker (D-11 → [16](16_REMEDY_TRACKER.md)).
5. After the consultation, the user can submit a review (D-10). Review
   content: `PENDING DISCUSSION` (P-07-10).
6. Reschedule or cancel: `PENDING DISCUSSION` (P-07-04, P-07-05).
7. If the astrologer sets DND / Planned Unavailability covering a booked appointment, the appointment is cancelled, the user receives a full refund, and new bookings are blocked for those dates (D-30).

## 6. Screens and content

`PENDING DISCUSSION` (P-07-01 to P-07-04, P-07-10).

## 7. Business rules and validations

| # | Rule | Source |
|---|------|--------|
| R-07-01 | An appointment has no dispute option. | D-09 |
| R-07-02 | The user can submit a review after the appointment consultation. | D-10 |
| R-07-03 | A remedy prescribed or attached during an appointment must also appear in the user's Remedy Tracker. | D-11 → [16](16_REMEDY_TRACKER.md) |
| R-07-04 | An appointment falling within the astrologer's DND / Planned Unavailability is cancelled with a full refund to the user, and those dates are blocked for new bookings. | D-30 |

**Pending rules:** booking window (P-07-01), durations (P-07-02),
rescheduling and cancellation (P-07-04), refunds (P-07-05), no-shows
(P-07-06), subscription requirement (P-07-08).

## 8. States and edge cases

| Case | Behaviour |
|------|-----------|
| User wants to dispute an appointment | No dispute option (D-09) |
| Consultation completed | Review can be submitted (D-10) |
| Rescheduling or cancellation | `PENDING DISCUSSION` (P-07-04) |
| User or astrologer no-show | `PENDING DISCUSSION` (P-07-06) |
| Refund | Full refund when cancelled because of the astrologer's DND / Planned Unavailability (D-30); other cases `PENDING DISCUSSION` (P-07-05) |
| Booked appointment falls within the astrologer's DND / Planned Unavailability | Cancelled; full refund; dates blocked for new bookings (D-30) |
| Payment fails | `PENDING DISCUSSION` (→ [10](10_WALLET_AND_PAYMENTS.md)) |

Appointment statuses: `PENDING DISCUSSION` (P-11-03).

## 9. Notifications triggered

| Notification | Category | Rule |
|--------------|----------|------|
| Appointment alerts | Critical (appointment) | D-15 → [15](15_NOTIFICATIONS.md) |
| Payment alerts | Critical (payment/wallet) | D-15 → [15](15_NOTIFICATIONS.md) |

Reminder timing: `PENDING DISCUSSION` (P-07-07). Exact events:
`PENDING DISCUSSION` (P-15-03).

## 10. Dependencies on other modules

- [01](01_NAVIGATION_AND_STRUCTURE.md), [05](05_ASTROLOGER_PROFILE.md), [10](10_WALLET_AND_PAYMENTS.md), [11](11_ACTIVITY_AND_SERVICE_HISTORY.md), [13](13_BIRTH_PROFILES_AND_KUNDLI.md), [14](14_FOLLOWING_AND_SUBSCRIPTIONS.md), [15](15_NOTIFICATIONS.md), [16](16_REMEDY_TRACKER.md).

## 11. PENDING DISCUSSION

Full wording in [`00_USER_APP_REVIEW_LIST.md` §4](00_USER_APP_REVIEW_LIST.md#4-pending-discussion-register).

**Owned by this module**

| ID | Topic |
|----|-------|
| P-07-01 | Advance booking window |
| P-07-02 | Durations |
| P-07-03 | Consultation mode |
| P-07-04 | Rescheduling and cancellation |
| P-07-05 | Refunds (DND / Planned Unavailability cancellations confirmed in D-30) |
| P-07-06 | No-shows |
| P-07-07 | Reminder timing |
| P-07-08 | Subscription requirement |
| P-07-09 | Definition of an Appointment |
| P-07-10 | Review content and rules (applies to 07, 08, 09) |

**Related (owned elsewhere)**

| ID | Topic |
|----|-------|
| P-01-07 | Services tab layout |
| P-05-06 | Actions on the astrologer profile |
| P-11-03 | Statuses per service |
| P-13-09 | Birth profile shared in services |
| P-15-03 | Exact critical notification events |

## 12. Acceptance criteria

- [ ] No dispute option is offered for an appointment (D-09).
- [ ] After an appointment consultation, the user can submit a review (D-10).
- [ ] A remedy prescribed or attached during an appointment appears in the Remedy Tracker (D-11).

## 13. Change log

| Date | Change |
|------|--------|
| 2026-11-17 | Initial draft created from D-09, D-10. |
| 2026-11-19 | D-30 added (astrologer DND / Planned Unavailability: booked appointments cancelled with full refund; dates blocked). D-28 referenced. R-07-04 added. |
