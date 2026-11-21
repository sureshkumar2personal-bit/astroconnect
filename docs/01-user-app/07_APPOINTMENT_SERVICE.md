# 07 — Appointment Service

| Field | Value |
|-------|-------|
| Application | User App |
| Status | Draft |
| Owned decisions | D-09, D-10 (shared with 08, 09), D-30, D-40 – D-43 |
| Review list | [`00_USER_APP_REVIEW_LIST.md`](00_USER_APP_REVIEW_LIST.md) |
| Shared context | [`CONTEXT.md`](../../CONTEXT.md) |

---

## 1. Purpose

Defines the Appointment consultation service: a voice-only consultation
booked in advance for a specific date and time (D-40).

## 2. Scope / Out of scope

**In scope**
- Booking, attending, and completing an appointment.
- Cancellation, rescheduling, no-shows, and date closure by the astrologer.
- Reminders.
- Reviews after an appointment.
- Remedy hand-off to the Remedy Tracker.

**Out of scope**
- Payment and refunds in general → [10](10_WALLET_AND_PAYMENTS.md).
- Managing booked or completed appointments → [11](11_ACTIVITY_AND_SERVICE_HISTORY.md).
- Review display → [05](05_ASTROLOGER_PROFILE.md).
- The astrologer's calendar, buffers, breaks, and earnings → Astrologer App [`05_APPOINTMENTS.md`](../02-astrologer-app/05_APPOINTMENTS.md).

## 3. Entry points

- Start and purchase: **Services** tab (D-02 → [01](01_NAVIGATION_AND_STRUCTURE.md)). Layout: `PENDING DISCUSSION` (P-01-07).
- From an astrologer profile: `PENDING DISCUSSION` (P-05-06).
- Manage: **Activity** tab (D-03 → [01](01_NAVIGATION_AND_STRUCTURE.md)).

## 4. Confirmed decisions

**Owned by this module** (shared with [08](08_INSTANT_CALL.md) and [09](09_INSTANT_CHAT.md); verbatim from the decision register)

| ID | Decision |
|----|----------|
| D-09 | Appointments, Instant Calls, and Instant Chats **do not** have a dispute option. |
| D-10 | **Reviews after consultations:** after an Appointment, Instant Call, or Instant Chat consultation, the user gives a **mandatory** 1–5 star rating; written feedback is **optional**. A submitted review cannot be edited or deleted by the user; changes are requested through Platform Support. *(Amended 2026-11-20: rating mandatory, written feedback optional, no user edit/delete — Astrologer AD-129, X-18; supersedes "Users can submit a review after an Appointment, Instant Call, or Instant Chat consultation". Enforcement mechanism not confirmed — Astrologer AP-10-01.)* |
| D-30 | **Astrologer DND / Planned Unavailability:** during this period no new service with the astrologer can be purchased, booked, submitted, or started, and the astrologer's profile is hidden (D-38). **Existing confirmed appointments remain valid.** If the astrologer closes a date that already has confirmed appointments, D-41 applies. *(Amended 2026-11-20: confirmed appointments remain valid — Astrologer AD-07, AD-09, X-17; supersedes "Already-booked appointments falling within the period are cancelled and the user receives a full refund; new appointment bookings are blocked for the unavailable dates".)* |
| D-40 | **Appointment definition and booking:** an Appointment is a **voice-only** consultation booked in advance for a specific date and time; there are no video appointments. The user chooses an astrologer, views available slots and prices, books, and pays. Successful payment **immediately confirms** the appointment, without astrologer approval. Durations are **15 or 30 minutes**, each with its own price. Slots can be booked within a **rolling 90-day** booking horizon. Price changes apply only to future bookings; a confirmed booking keeps its booked price. During payment the selected slot is held for **10 minutes**; if payment fails or the hold expires, the slot is released. The same slot can never be booked twice. |
| D-41 | **Appointment cancellation, rescheduling, and no-shows:** the user cancellation policy is **12 hours before the appointment**; late cancellation follows the late-cancellation percentage deduction, whose value is not yet recorded (Astrologer AP-05-01); a user no-show follows the same policy. If the astrologer cancels, the user chooses a reschedule or a **full refund to the Wallet**. If the astrologer closes a date that has the user's confirmed appointment, the user is offered a reschedule or a full Wallet refund; if the user cannot be informed in advance, the appointment is cancelled automatically and refunded. The astrologer cannot reschedule the user's booking; the user may reschedule **once**. If the astrologer does not show, the user receives a full Wallet refund. |
| D-42 | **Joining an appointment and technical problems:** the user and the astrologer may join **5 minutes before** the scheduled time; a **5-minute grace period** applies after it, after which no-show handling applies (D-41). On technical disconnection, automatic reconnection is attempted for **5 minutes** and the remaining appointment time is preserved. If the appointment cannot continue because of technical failure, the Platform reviews it and the user receives a reschedule option; neither participant is blamed automatically. |
| D-43 | **Appointment reminders:** the user receives a notification immediately after booking confirmation; 3 days, 2 days, and 1 day before; on the appointment day 1 hour and 15 minutes before; and immediately after a cancellation or rescheduling. Only one reminder is sent for each interval. |

**Referenced decisions**

| ID | Topic | Owning file |
|----|-------|-------------|
| D-02 | Purpose of the Services tab | [01](01_NAVIGATION_AND_STRUCTURE.md) |
| D-03 | Purpose of the Activity tab | [01](01_NAVIGATION_AND_STRUCTURE.md) |
| D-11 | Remedies in the Remedy Tracker | [16](16_REMEDY_TRACKER.md) |
| D-15 | Critical notifications (includes appointment alerts) | [15](15_NOTIFICATIONS.md) |
| D-28 | IST calendar-day counting | [06](06_TEXT_QUESTION_SERVICE.md) |
| D-32 | Refunds go to the Wallet | [10](10_WALLET_AND_PAYMENTS.md) |
| D-33 | Payment with Wallet or direct UPI/bank | [10](10_WALLET_AND_PAYMENTS.md) |
| D-37 | Consent for sharing birth data | [13](13_BIRTH_PROFILES_AND_KUNDLI.md) |
| D-38 | Astrologer DND: profile hidden; no bookings | [05](05_ASTROLOGER_PROFILE.md) |
| D-51 | Remedy Tracker links to the originating appointment | [16](16_REMEDY_TRACKER.md) |

## 5. User flows

### 5.1 Book an appointment
1. The user chooses an astrologer and views available slots and prices for 15-minute and 30-minute appointments, within a rolling 90-day horizon (D-40).
2. The user selects a slot; it is held for 10 minutes while the user pays (D-40), with the Wallet or by direct payment (D-33 → [10](10_WALLET_AND_PAYMENTS.md)).
3. Successful payment confirms the appointment immediately; the astrologer does not approve it (D-40).
4. Payment failure or an expired hold releases the slot (D-40).
5. Subscription requirement: `PENDING DISCUSSION` (P-07-08). Birth profile shared: `PENDING DISCUSSION` (P-13-09); birth details are shared only with consent (D-37).

### 5.2 Attend the appointment
1. The user can join from 5 minutes before the scheduled time; a 5-minute grace period applies after it (D-42).
2. The consultation is voice-only (D-40).
3. If the connection drops, reconnection is attempted for 5 minutes and the remaining time is preserved (D-42).
4. If the appointment cannot continue because of technical failure, the Platform reviews it and the user is offered a reschedule (D-42).
5. If the astrologer prescribes or attaches a remedy, it also appears in the Remedy Tracker (D-11 → [16](16_REMEDY_TRACKER.md)); post-appointment notes, remedies, recommendations, and reports link back to the appointment (D-51).

### 5.3 After the appointment
The user gives a mandatory 1–5 star rating; written feedback is optional (D-10). Time limit and enforcement: `PENDING DISCUSSION` (P-07-10).

### 5.4 Cancel or reschedule
| Situation | What the user gets | Source |
|-----------|--------------------|--------|
| User cancels | 12-hour cancellation policy; late cancellation follows the late-cancellation percentage deduction (value: `PENDING DISCUSSION`, P-07-04 / Astrologer AP-05-01) | D-41 |
| Astrologer cancels | Choice of reschedule or full Wallet refund | D-41 |
| Astrologer closes the date | Choice of reschedule or full Wallet refund; automatic cancellation and refund if the user cannot be informed in advance | D-41 |
| Astrologer does not show | Full Wallet refund | D-41 |
| User does not show | Same late-cancellation policy as a user cancellation | D-41 |
| Rescheduling | The user may reschedule once; the astrologer cannot reschedule for the user | D-41 |

### 5.5 Astrologer DND / Planned Unavailability
New appointments cannot be booked while the astrologer's DND is active, and the profile is hidden (D-30, D-38). The user's existing confirmed appointments remain valid (D-30).

## 6. Screens and content

- Slot selection: available slots, 15/30-minute durations and their prices (D-40).
- Payment with a 10-minute slot hold (D-40).
- Appointment details, history, and statuses: statuses shown to the user `PENDING DISCUSSION` (P-11-03).
- Other layout details: `PENDING DISCUSSION` (P-01-07, P-05-06).

## 7. Business rules and validations

| # | Rule | Source |
|---|------|--------|
| R-07-01 | An appointment has no dispute option. | D-09 |
| R-07-02 | After the appointment, a 1–5 star rating is mandatory; written feedback is optional; the user cannot edit or delete a submitted review. | D-10 |
| R-07-03 | A remedy prescribed or attached during an appointment must also appear in the user's Remedy Tracker. | D-11 → [16](16_REMEDY_TRACKER.md) |
| R-07-04 | An existing confirmed appointment remains valid when the astrologer activates DND / Planned Unavailability; new bookings are not possible during DND. *(Rule text updated 2026-11-20 with the D-30 amendment.)* | D-30 |
| R-07-05 | Appointments are voice-only; 15 or 30 minutes; bookable within a rolling 90-day horizon. | D-40 |
| R-07-06 | Successful payment confirms the appointment immediately. | D-40 |
| R-07-07 | The slot is held for 10 minutes during payment; a slot can never be double-booked. | D-40 |
| R-07-08 | A confirmed booking keeps its booked price. | D-40 |
| R-07-09 | 12-hour user cancellation policy; late cancellation and user no-shows follow the late-cancellation percentage (value pending, P-07-04). | D-41 |
| R-07-10 | Astrologer cancellation, date closure, or astrologer no-show gives the user a full Wallet refund (or a reschedule, where offered). | D-41 |
| R-07-11 | The user may reschedule once; the astrologer cannot reschedule for the user. | D-41 |
| R-07-12 | Joining opens 5 minutes before; 5-minute grace period; 5-minute reconnection preserving remaining time. | D-42 |
| R-07-13 | Reminders are sent at each interval of D-43, once each. | D-43 |

## 8. States and edge cases

| Case | Behaviour |
|------|-----------|
| User wants to dispute an appointment | No dispute option (D-09) |
| Consultation completed | Mandatory rating; optional written feedback (D-10) |
| Payment not completed within 10 minutes | Slot released (D-40) |
| Two users select the same slot | Only one booking succeeds (D-40) |
| Astrologer activates DND after the booking | Appointment remains valid (D-30) |
| Astrologer closes the date | Reschedule or full Wallet refund; automatic cancellation and refund if the user cannot be informed in advance (D-41) |
| User has already rescheduled once | No further reschedule (D-41) |
| Connection drops | 5-minute reconnection; remaining time preserved (D-42) |
| Technical failure ends the appointment | Platform review; reschedule option (D-42) |
| Late cancellation or user no-show | Late-cancellation percentage `PENDING DISCUSSION` (P-07-04, P-07-05, P-07-06) |
| Payment fails | Slot released (D-40); other payment-failure handling → [10](10_WALLET_AND_PAYMENTS.md) |

Appointment statuses shown to the user: `PENDING DISCUSSION` (P-11-03).

## 9. Notifications triggered

| Notification | Category | Rule |
|--------------|----------|------|
| Booking confirmed; reminders 3, 2, 1 day before; 1 hour and 15 minutes before on the day; cancellation or rescheduling | Critical (appointment) | D-43; category D-15 → [15](15_NOTIFICATIONS.md) |
| Payment alerts | Critical (payment/wallet) | D-15 → [15](15_NOTIFICATIONS.md) |

Exact critical events in general: `PENDING DISCUSSION` (P-15-03).

## 10. Dependencies on other modules

- [01](01_NAVIGATION_AND_STRUCTURE.md), [05](05_ASTROLOGER_PROFILE.md), [10](10_WALLET_AND_PAYMENTS.md), [11](11_ACTIVITY_AND_SERVICE_HISTORY.md), [13](13_BIRTH_PROFILES_AND_KUNDLI.md), [14](14_FOLLOWING_AND_SUBSCRIPTIONS.md), [15](15_NOTIFICATIONS.md), [16](16_REMEDY_TRACKER.md).
- Astrologer App: [`05_APPOINTMENTS.md`](../02-astrologer-app/05_APPOINTMENTS.md) (AD-88 – AD-102); cross-app items X-17, X-19 in the [Astrologer review list](../02-astrologer-app/00_ASTROLOGER_APP_REVIEW_LIST.md).

## 11. PENDING DISCUSSION

Full wording in [`00_USER_APP_REVIEW_LIST.md` §4](00_USER_APP_REVIEW_LIST.md#4-pending-discussion-register).

**Owned by this module**

| ID | Topic |
|----|-------|
| P-07-01 | Advance booking window — **Resolved** (D-40) |
| P-07-02 | Durations — **Resolved** (D-40) |
| P-07-03 | Consultation mode — **Resolved** (D-40) |
| P-07-04 | Rescheduling and cancellation (confirmed parts in D-41; late-cancellation percentage open) |
| P-07-05 | Refunds (confirmed parts in D-41; late-cancellation percentage open) |
| P-07-06 | No-shows (confirmed parts in D-41; late-cancellation percentage open) |
| P-07-07 | Reminder timing — **Resolved** (D-43) |
| P-07-08 | Subscription requirement |
| P-07-09 | Definition of an Appointment — **Resolved** (D-40) |
| P-07-10 | Review content and rules (applies to 07, 08, 09; confirmed parts in D-10; time limit open) |

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
- [ ] After an appointment, the user must give a 1–5 rating; written feedback is optional; the review cannot be edited or deleted by the user (D-10).
- [ ] A remedy prescribed or attached during an appointment appears in the Remedy Tracker (D-11).
- [ ] Confirmed appointments remain valid when the astrologer activates DND; no new booking is possible during DND (D-30).
- [ ] Voice-only, 15/30-minute appointments are bookable within 90 days and confirmed immediately on payment; the slot is held for 10 minutes and cannot be double-booked; the booked price is kept (D-40).
- [ ] Cancellation, date closure, rescheduling (once), and no-show handling follow D-41.
- [ ] Joining, grace period, and reconnection follow D-42.
- [ ] Every reminder of D-43 is received exactly once.

## 13. Change log

| Date | Change |
|------|--------|
| 2026-11-17 | Initial draft created from D-09, D-10. |
| 2026-11-19 | D-30 added (astrologer DND / Planned Unavailability: booked appointments cancelled with full refund; dates blocked). D-28 referenced. R-07-04 added. |
| 2026-11-19 | Referenced D-32 (refunds to Wallet) and D-38 (no bookings during astrologer DND). |
| 2026-11-20 | Aligned with the Astrologer App (X-17, X-18, X-19): D-10 and D-30 re-quoted (amended); D-40 – D-43 added; R-07-02 and R-07-04 updated; R-07-05 – R-07-13 added; P-07-01 – P-07-03, P-07-07, P-07-09 Resolved; P-07-04 – P-07-06, P-07-10 partially answered. D-33, D-37, D-51 referenced. |
