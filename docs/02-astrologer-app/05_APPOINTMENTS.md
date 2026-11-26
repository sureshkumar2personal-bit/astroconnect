# 05 — Appointments

| Field | Value |
|-------|-------|
| Application | Astrologer App |
| Status | Draft |
| Owned decisions | AD-88 – AD-102 |
| Review list | [`00_ASTROLOGER_APP_REVIEW_LIST.md`](00_ASTROLOGER_APP_REVIEW_LIST.md) |
| Shared context | [`CONTEXT.md`](../../CONTEXT.md) |

> **Frontend UI phase.** This specification describes product behaviour. It
> does not define APIs, data structures, or backend logic. Items marked
> `PENDING DISCUSSION` must not be implemented as if decided.

---

## 1. Purpose

Defines the Appointment service from the astrologer's side: voice-only
booked consultations, statuses, durations and pricing, the availability
calendar, date closure, the booking lock, joining and reconnection,
cancellation and no-show handling, reminders, Appointment Details, and
post-consultation attachments.

## 2. Scope / Out of scope

**In scope**
- Appointment type, booking confirmation, statuses.
- Durations (15/30 minutes) and prices.
- Calendar (Daily/Weekly/Monthly), recurring weekly availability, overrides, buffers, breaks, closed dates.
- Date closure with confirmed appointments.
- Booking lock and double-booking prevention.
- Joining, grace period, reconnection, technical failure.
- Astrologer and User cancellation, reschedule, no-show.
- Reminders to both parties.
- Appointment Details, private preparation notes, post-consultation attachments.

**Out of scope**
- Commission rate (3%) and settlement eligibility (3 days) → [08](08_WALLET_AND_EARNINGS.md) (AD-124, AD-126).
- DND / Planned Unavailability → [01](01_HOME_SCREEN.md) (AD-07, AD-09, AD-74, AD-164).
- Ratings and reviews after appointments → [10](10_RATINGS_AND_REVIEWS.md) (AD-129).
- Remedy Tracker records → [17](17_REMEDY_TRACKER.md) (AD-163).
- Notification Centre → [14](14_NOTIFICATIONS_AND_REMINDERS.md).
- There is no Appointment dispute section (AD-162 → [16](16_HELP_AND_SUPPORT.md)).

## 3. Entry points

- **My Work** → Appointments (AD-46 → [02](02_TEXT_BASED_QUESTIONS.md); AD-75 → [03](03_GLOBAL_NAVIGATION.md)).
- Home → Today's Work → Appointments preview → View All (AD-17 → [01](01_HOME_SCREEN.md)).
- Profile → Service Information → Appointments (AD-84 → [04](04_PROFILE_AND_VERIFICATION.md)).
- Notifications (category C, AD-148) and Appointment History rows (AD-78 → [03](03_GLOBAL_NAVIGATION.md)).

## 4. Confirmed decisions

**Owned by this module** (verbatim from the decision register)

| ID | Decision |
|----|----------|
| AD-88 | **Appointment type and booking:** Appointments are **voice-only** consultations; there are no video appointments. The User chooses an astrologer, views available slots and prices, books, and pays. Successful payment **immediately confirms** the appointment; there is no astrologer approval or Pending stage after successful payment. |
| AD-89 | **Appointment statuses:** **Confirmed**; **Under Review** (when the astrologer opens the booking details / reviews the purpose); **Completed** (when the call ends); **Cancelled**; **Missed / No-show**. Payment settlement status is kept separate from appointment status. |
| AD-90 | **Duration and pricing:** appointment durations are **15 minutes** or **30 minutes**. The astrologer sets a separate price for each duration. One selected duration applies consistently across the selected schedule period. Price changes apply only to future bookings; existing confirmed bookings keep their original booked price. |
| AD-91 | **Astrologer-cancelled appointments:** the astrologer receives **no earnings** for an appointment cancelled by the astrologer. |
| AD-92 | **Calendar and recurring availability:** calendar views are Daily, Weekly, and Monthly. Recurring weekly availability applies automatically within a **rolling 90-day booking horizon**. Weekly overrides and single-date overrides do not modify the recurring schedule. Controls are simple click/edit controls. |
| AD-93 | **Buffers, breaks, and closed dates:** buffer options are **5 or 10 minutes**, inserted automatically after appointments. Multiple breaks may be added or removed. A slot is not displayed if the full appointment duration cannot finish before the next break. The astrologer can block or close a date. |
| AD-94 | **Date closure with confirmed appointments:** date closure is a separate appointment workflow, distinct from DND (AD-09). If the astrologer manually closes a date that already has confirmed appointments, each affected User is offered **rescheduling or a full refund to the User Wallet**. The astrologer cannot independently reschedule the User's booking. The User may reschedule once. If the astrologer cannot inform Users in advance, all affected appointments that day are **automatically cancelled** and the Users are refunded. |
| AD-95 | **Booking lock and double booking:** during payment the selected slot is locked for **10 minutes**. If payment succeeds within 10 minutes, the appointment is confirmed. If payment fails or the lock expires, the slot is released. Booking validation is atomic, so the same slot can never be booked twice by simultaneous bookings. |
| AD-96 | **Joining the appointment call:** the User and the astrologer may join **5 minutes before** the scheduled time. A **5-minute grace period** applies after the scheduled time. If a participant still has not joined, the relevant no-show handling applies (AD-98, AD-99). |
| AD-97 | **Appointment technical disconnection:** on technical disconnection, automatic reconnection is attempted for **5 minutes**, and the remaining appointment time is preserved. If the appointment cannot continue because of technical failure, the Platform reviews it and the User receives a reschedule option. Neither participant is automatically blamed without evidence. |
| AD-98 | **Astrologer cancellation and astrologer no-show:** if the astrologer cancels, the User chooses a reschedule or a full User Wallet refund. The User may reschedule once. The astrologer cannot reschedule on the User's behalf. If the astrologer is a no-show, the User receives a full Wallet refund. Repeated astrologer no-shows are recorded as incidents and warnings are issued; the repeated-incident warning threshold is configurable, not a fixed number. |
| AD-99 | **User cancellation and User no-show:** the User cancellation policy is **12 hours before the appointment**. Late cancellation follows the late-cancellation percentage deduction policy of the User App. A User no-show follows the same late-cancellation policy. The percentage is not invented or changed here (its value is tracked in AP-05-01). |
| AD-100 | **Appointment reminders:** notifications are sent to **both parties** immediately after booking confirmation; 3 days before; 2 days before; 1 day before; on the appointment day 1 hour before; on the appointment day 15 minutes before; and immediately after a cancellation or rescheduling. Only one reminder is sent for each specified interval. |
| AD-101 | **Appointment Details:** shows Appointment ID; User name and User ID; booking date/time; duration; voice-only type; payment amount and payment status; consultation purpose; uploaded horoscope; saved horoscope selection; birth details only where User consent permits sharing; the User's private notes, if shared. The astrologer may create **private preparation notes** visible only to the astrologer. |
| AD-102 | **Post-consultation attachments:** the astrologer may attach notes, remedies, recommendations, or reports immediately after the call or later through Appointment History. A pending attachment/action has a visible indicator, and reminders are sent until the required attachment/action is completed. Attachments are saved in Appointment History and the Remedy Tracker. Appointment completion and settlement do not depend on attachment submission. Attachments follow the finalized astrologer answer attachment rules (AD-45); User question limits do not apply. |

**Referenced decisions**

| ID | Topic | Owning file |
|----|-------|-------------|
| AD-05 | Appointments can still arrive when Offline | [01](01_HOME_SCREEN.md) |
| AD-09 | Planned Unavailability; confirmed appointments remain valid | [01](01_HOME_SCREEN.md) |
| AD-13 | Availability Schedule belongs to the Appointment Module | [01](01_HOME_SCREEN.md) |
| AD-16 | Peak Demand uses Appointment booking data | [01](01_HOME_SCREEN.md) |
| AD-17 | Today's Work Appointments preview | [01](01_HOME_SCREEN.md) |
| AD-45 | Astrologer answer attachment rules (used for appointment attachments) | [02](02_TEXT_BASED_QUESTIONS.md) |
| AD-46 | My Work main page includes Appointments | [02](02_TEXT_BASED_QUESTIONS.md) |
| AD-74 | DND: no new bookings; profile invisible | [01](01_HOME_SCREEN.md) |
| AD-78 | Appointment list/history row → Appointment Details, expanded in place on the Appointments page | [03](03_GLOBAL_NAVIGATION.md) |
| AD-124 | Appointment commission 3% | [08](08_WALLET_AND_EARNINGS.md) |
| AD-126 | Appointment settlement eligibility 3 days after completion | [08](08_WALLET_AND_EARNINGS.md) |
| AD-129 | Mandatory rating after an Appointment | [10](10_RATINGS_AND_REVIEWS.md) |
| AD-163 | Appointment records in the Remedy Tracker | [17](17_REMEDY_TRACKER.md) |
| AD-164 | Offline vs DND | [01](01_HOME_SCREEN.md) |

## 5. User flows

### 5.1 Set up availability
1. The astrologer opens the calendar (Daily, Weekly, or Monthly view) (AD-92).
2. The astrologer sets recurring weekly availability; it applies automatically across a rolling 90-day booking horizon (AD-92).
3. The astrologer selects the appointment duration (15 or 30 minutes) for the schedule period; one duration applies consistently across that period (AD-90).
4. The astrologer sets a separate price for each duration (AD-90).
5. The astrologer chooses a buffer of 5 or 10 minutes, inserted automatically after each appointment (AD-93).
6. The astrologer adds or removes breaks; slots that cannot finish before the next break are not shown (AD-93).
7. The astrologer can add weekly overrides or single-date overrides; they do not change the recurring schedule (AD-92).

### 5.2 A User books (astrologer view)
1. The User selects an available slot and pays; the slot is locked for 10 minutes during payment (AD-95).
2. Payment succeeds within 10 minutes → the appointment is **Confirmed** immediately; the astrologer does not approve it (AD-88, AD-89).
3. Payment fails or the lock expires → the slot is released (AD-95).
4. Both parties receive the booking-confirmation notification (AD-100).

### 5.3 Prepare for the appointment
1. The astrologer opens the booking; the status becomes **Under Review** (AD-89).
2. Appointment Details show the fields of AD-101, including birth details only where the User's consent permits (AD-101; User App D-37).
3. The astrologer may write private preparation notes, visible only to the astrologer (AD-101).

### 5.4 Conduct the appointment
1. Both parties may join from 5 minutes before the scheduled time (AD-96).
2. A 5-minute grace period applies after the scheduled time (AD-96).
3. If a participant has not joined by the end of the grace period, no-show handling applies (§5.7).
4. On technical disconnection, automatic reconnection is attempted for 5 minutes and the remaining time is preserved (AD-97).
5. If the appointment cannot continue because of technical failure, the Platform reviews it and the User receives a reschedule option; neither participant is blamed automatically (AD-97).
6. When the call ends, the status becomes **Completed** (AD-89).

### 5.5 After the appointment
1. The astrologer may attach notes, remedies, recommendations, or reports immediately or later from Appointment History (AD-102).
2. While an attachment/action is pending, a visible indicator is shown and reminders are sent until it is completed (AD-102).
3. Attachments are saved in Appointment History and the Remedy Tracker (AD-102, AD-163).
4. Completion and settlement do not wait for attachments (AD-102).
5. The User gives a mandatory rating (AD-129 → [10](10_RATINGS_AND_REVIEWS.md)).

### 5.6 Close a date
1. The astrologer blocks or closes a date (AD-93).
2. If the date has no confirmed appointments, no booking is affected.
3. If the date has confirmed appointments (AD-94):
   - each affected User is offered a reschedule or a full refund to the User Wallet;
   - the astrologer cannot reschedule the User's booking;
   - the User may reschedule once;
   - if the astrologer cannot inform Users in advance, all affected appointments that day are cancelled automatically and the Users are refunded.
4. Date closure is separate from DND; activating DND does not cancel confirmed appointments (AD-09 → [01](01_HOME_SCREEN.md)).

### 5.7 Cancellation and no-show
| Situation | Handling | Source |
|-----------|----------|--------|
| Astrologer cancels | User chooses reschedule or full User Wallet refund; User may reschedule once; astrologer cannot reschedule for the User; astrologer earns nothing | AD-98, AD-91 |
| Astrologer no-show | Full User Wallet refund; incident recorded; warnings for repeated incidents (configurable threshold) | AD-98 |
| User cancels | 12-hour User cancellation policy; late cancellation follows the User App late-cancellation percentage deduction | AD-99 |
| User no-show | Same late-cancellation policy as User cancellation | AD-99 |
| Technical failure | Platform review; User gets a reschedule option | AD-97 |

The late-cancellation percentage and its calculation are missing source
information: `PENDING DISCUSSION` (AP-05-01).

## 6. Screens and content

### 6.1 Calendar
- Views: Daily, Weekly, Monthly (AD-92).
- Simple click/edit controls for recurring availability, overrides, breaks, and closed dates (AD-92, AD-93).
- Only slots that fit fully before the next break are offered (AD-93).

### 6.2 Appointment settings
- Duration: 15 or 30 minutes for the selected schedule period (AD-90).
- Price for 15 minutes and price for 30 minutes (AD-90).
- Buffer: 5 or 10 minutes (AD-93).

### 6.3 Appointment list and history
- Reached from My Work (AD-46) and Home (AD-17).
- Each row expands in place to show that Appointment's Details, with an expand/collapse arrow; selecting it again collapses it, and one row is open at a time (AD-78). Expanding a row counts as opening the details (AD-89).
- Pending attachment/action indicator on the row (AD-102).
- Filters and search persist on Back (AD-77 → [03](03_GLOBAL_NAVIGATION.md)).

### 6.4 Appointment Details (AD-101)

| Field | Notes |
|-------|-------|
| Appointment ID | |
| User name and User ID | |
| Booking date/time | |
| Duration | 15 or 30 minutes |
| Type | Voice-only |
| Payment amount and payment status | Payment/settlement status is separate from appointment status (AD-89) |
| Consultation purpose | |
| Uploaded horoscope | |
| Saved horoscope selection | |
| Birth details | Only where the User's consent permits (User App D-37) |
| User's private notes | Only if shared by the User |
| Private preparation notes | Written by the astrologer; visible only to the astrologer |
| Post-consultation attachments | Notes, remedies, recommendations, reports (AD-102) |

## 7. Business rules and validations

| # | Rule | Source |
|---|------|--------|
| APT-01 | Appointments are voice-only; video is not offered. | AD-88 |
| APT-02 | Successful payment confirms the appointment immediately; there is no astrologer approval or Pending stage. | AD-88 |
| APT-03 | Appointment status and payment settlement status are separate. | AD-89 |
| APT-04 | Durations are 15 or 30 minutes; one duration applies across the selected schedule period; each duration has its own price. | AD-90 |
| APT-05 | Price changes affect only future bookings; confirmed bookings keep their booked price. | AD-90 |
| APT-06 | No earnings for astrologer-cancelled appointments. | AD-91 |
| APT-07 | Recurring weekly availability is applied automatically within a rolling 90-day horizon; overrides never modify the recurring schedule. | AD-92 |
| APT-08 | A 5- or 10-minute buffer is inserted automatically after each appointment. | AD-93 |
| APT-09 | A slot is not displayed if the full duration cannot finish before the next break. | AD-93 |
| APT-10 | Closing a date with confirmed appointments offers each User a reschedule or full Wallet refund; without advance notice, the day's affected appointments are cancelled and refunded automatically. | AD-94 |
| APT-11 | The astrologer can never reschedule a User's booking; the User may reschedule once. | AD-94, AD-98 |
| APT-12 | A slot is locked for 10 minutes during payment and released on failure or expiry. | AD-95 |
| APT-13 | Booking validation is atomic; a slot can never be double-booked. | AD-95 |
| APT-14 | Joining opens 5 minutes before the scheduled time; grace period 5 minutes after. | AD-96 |
| APT-15 | Reconnection is attempted for 5 minutes and remaining time is preserved. | AD-97 |
| APT-16 | Technical failure → Platform review and a User reschedule option; no automatic blame. | AD-97 |
| APT-17 | Astrologer no-show → full User Wallet refund; repeated incidents recorded and warned against a configurable threshold. | AD-98 |
| APT-18 | User cancellation policy is 12 hours before the appointment; late cancellation and User no-show follow the User App percentage deduction (value: AP-05-01). | AD-99 |
| APT-19 | Reminders to both parties at the intervals of AD-100; only one reminder per interval. | AD-100 |
| APT-20 | Birth details are shown only where the User's consent permits. | AD-101 |
| APT-21 | Private preparation notes are visible only to the astrologer. | AD-101 |
| APT-22 | Post-consultation attachments follow the astrologer answer attachment rules (AD-45 → [02](02_TEXT_BASED_QUESTIONS.md)); User question limits do not apply. | AD-102, AD-45 |
| APT-23 | Completion and settlement never depend on attachment submission. | AD-102 |
| APT-24 | New bookings are not possible while DND is active; confirmed appointments remain valid. | AD-74, AD-09 |
| APT-25 | Appointments can still be booked while the astrologer is Offline. | AD-05, AD-164 |

## 8. States and edge cases

### 8.1 Appointment status transitions (AD-89)

| From | Event | To |
|------|-------|----|
| — | Payment succeeds within the 10-minute lock | Confirmed |
| Confirmed | Astrologer opens booking details / reviews the purpose | Under Review |
| Confirmed / Under Review | Call ends | Completed |
| Confirmed / Under Review | Cancellation by astrologer or User, or automatic cancellation on date closure without advance notice | Cancelled |
| Confirmed / Under Review | Participant has not joined by the end of the 5-minute grace period | Missed / No-show |

Status after a User reschedules, and after a technical failure under Platform
review, is not specified beyond AD-89 and AD-97; no extra status is invented.

### 8.2 Edge cases

| Case | Behaviour |
|------|-----------|
| Two Users try to book the same slot at the same time | Atomic validation; only one booking succeeds (AD-95) |
| Payment not completed within 10 minutes | Slot released (AD-95) |
| Price changed after a booking | Existing booking keeps its price (AD-90) |
| Slot would overrun the next break | Slot not displayed (AD-93) |
| DND activated with confirmed appointments ahead | Appointments remain valid; DND blocks only new services (AD-07, AD-09) |
| Date closed with confirmed appointments | Reschedule or full Wallet refund per User; automatic cancellation and refund if Users cannot be informed in advance (AD-94) |
| User already rescheduled once | No further reschedule (AD-94, AD-98) |
| Disconnection during the call | 5-minute reconnection; remaining time preserved (AD-97) |
| Attachment not yet added | Indicator and reminders; completion/settlement unaffected (AD-102) |
| Astrologer repeatedly no-shows | Incidents recorded; warnings at the configurable threshold (AD-98; PA-06) |
| Late-cancellation percentage | `PENDING DISCUSSION` (AP-05-01) |

## 9. Notifications triggered

| Notification | Recipients | Rule |
|--------------|------------|------|
| Booking confirmed | Both parties, immediately | AD-100 |
| Reminder 3 days, 2 days, 1 day before | Both parties | AD-100 |
| Reminder 1 hour and 15 minutes before (appointment day) | Both parties | AD-100 |
| Cancelled or rescheduled | Both parties, immediately | AD-100 |
| Pending attachment/action reminder | Astrologer, until completed | AD-102 |
| Category C events (New Booking, Confirmed, Upcoming Reminder, Cancelled/Rescheduled, Completed, Missed) | Astrologer | AD-148 → [14](14_NOTIFICATIONS_AND_REMINDERS.md) |

Only one reminder is sent per interval (AD-100); duplicates are avoided (AD-149).

## 10. Dependencies on other modules

- [01](01_HOME_SCREEN.md) — Offline/DND (AD-05, AD-09, AD-74, AD-164), Today's Work (AD-17), Peak Demand (AD-16).
- [02](02_TEXT_BASED_QUESTIONS.md) — My Work (AD-46); attachment rules (AD-45).
- [03](03_GLOBAL_NAVIGATION.md) — record navigation (AD-76 – AD-78).
- [08](08_WALLET_AND_EARNINGS.md) — 3% commission, 3-day eligibility, settlement (AD-124, AD-126).
- [10](10_RATINGS_AND_REVIEWS.md) — mandatory rating (AD-129).
- [14](14_NOTIFICATIONS_AND_REMINDERS.md) — notification categories.
- [17](17_REMEDY_TRACKER.md) — remedies and reports (AD-163).
- **User App:** X-17 (DND and date closure; D-30), X-19 (appointment rules; P-07-01 – P-07-07, P-07-09, P-11-03), X-23 (Remedy Tracker link); User App D-32 (refunds to Wallet), D-37 (consent).
- **Platform Admin:** PA-06 (technical-failure review; no-show incidents and threshold).

## 11. PENDING DISCUSSION

Full wording in [`00_ASTROLOGER_APP_REVIEW_LIST.md` §4](00_ASTROLOGER_APP_REVIEW_LIST.md#4-open-questions-register).

**Owned by this module**

| ID | Topic | Status |
|----|-------|--------|
| AP-05-01 | User late-cancellation percentage and calculation | Open — missing source information |

**Related**

| ID | Topic | Status |
|----|-------|--------|
| AP-01-14 | DND blocks new services; confirmed appointments remain valid (AD-07) | Resolved |
| AP-01-15 | Planned Unavailability limits | Open |

## 12. Acceptance criteria

- [ ] Appointments are voice-only and confirmed immediately on successful payment, with no astrologer approval (AD-88).
- [ ] Statuses are Confirmed, Under Review, Completed, Cancelled, Missed / No-show; payment settlement status is separate (AD-89).
- [ ] 15- and 30-minute durations have separate prices; price changes affect only future bookings (AD-90).
- [ ] Astrologer-cancelled appointments generate no earnings (AD-91).
- [ ] Daily/Weekly/Monthly calendar; recurring weekly availability within a rolling 90-day horizon; overrides do not change the recurring schedule (AD-92).
- [ ] 5- or 10-minute buffers are inserted automatically; slots that cannot finish before a break are hidden; dates can be closed (AD-93).
- [ ] Closing a date with confirmed appointments offers each User reschedule or full Wallet refund, and cancels/refunds automatically when Users cannot be informed in advance (AD-94).
- [ ] The slot is locked for 10 minutes during payment and can never be double-booked (AD-95).
- [ ] Join from 5 minutes before; 5-minute grace period; then no-show handling (AD-96).
- [ ] 5-minute reconnection preserves remaining time; technical failure leads to Platform review and a User reschedule option (AD-97).
- [ ] Astrologer cancellation and no-show follow AD-98; the astrologer cannot reschedule for the User; the User reschedules at most once.
- [ ] User cancellation and no-show follow AD-99 (percentage per AP-05-01 once supplied).
- [ ] Both parties receive each reminder of AD-100 exactly once.
- [ ] Appointment Details show all fields of AD-101; birth details only with consent; private notes visible only to the astrologer.
- [ ] Post-consultation attachments follow AD-102 and AD-45, with an indicator and reminders, and never block completion or settlement.

## 13. Change log

| Date | Change |
|------|--------|
| 2026-11-20 | Initial draft created from the Master Decision Document and ruling C2: AD-88 – AD-102. AP-05-01 added. |
| 2026-11-20 | AP-01-14 Resolved (AD-07 amended); User App aligned (X-17, X-19: User App D-30, D-40 – D-43). |
