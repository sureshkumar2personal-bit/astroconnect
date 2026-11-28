# 05.2 — Appointment Management

| Field | Value |
|-------|-------|
| Application | Platform Admin |
| Version | 0.1 (Draft) |
| Last Updated | 2026-11-25 |
| Status | Draft — awaiting product-owner review; not committed |
| Review list | [`../15-platform-review-list.md`](../15-platform-review-list.md) |

---

## 1. Purpose

Admin view and management of Appointments, following the approved
application rules (ruling C4; Astrologer `05_APPOINTMENTS.md`, User
`07_APPOINTMENT_SERVICE.md`).

## 2. Approved appointment rules (summary, by reference)

- Voice-only; payment confirms immediately; no astrologer approval
  (Astrologer `AD-88`; User `D-40`).
- 15- or 30-minute durations with separate prices; rolling 90-day horizon
  (`AD-90`, `AD-92`; `D-40`).
- 10-minute slot lock during payment; atomic booking validation; no double
  booking; slot released if payment fails or the lock expires (`AD-95`).
- **Only the User may reschedule, once.** The Astrologer cannot reschedule the
  User's booking (`AD-94`, `AD-98`; `D-41`). **No Admin rescheduling.**
- Date closure by the Astrologer: each affected User chooses reschedule or a
  full Wallet refund; automatic cancellation and refund if Users cannot be
  informed in advance (`AD-94`).
- User cancellation policy 12 hours before; late cancellation / User no-show
  percentage not yet recorded (Astrologer `AP-05-01`); Astrologer
  cancellation or no-show → full Wallet refund (`AD-98`, `AD-99`; `D-41`).
- Joining 5 minutes before, 5-minute grace, 5-minute reconnection
  (`AD-96`, `AD-97`; `D-42`).
- Reminders to both parties (`AD-100`; `D-43`).
- Confirmed appointments remain valid during DND (`AD-07`, `AD-09`; `D-30`).

## 3. Statuses (approved — Astrologer `AD-89`)

**Confirmed · Under Review · Completed · Cancelled · Missed / No-show.**
Payment / settlement status is separate from appointment status.

The prompt's status list (Booked / Confirmed, Upcoming, In Progress,
Rescheduled, Refunded) is not used as statuses; "Upcoming" and "Today" are
filters, and reschedules and refunds are shown as history (ruling C4).

## 4. Appointment list

- Appointment ID
- User
- Astrologer
- Booking Date
- Appointment Date
- Duration
- User Paid Amount
- Payment Status
- Appointment Status
- View Details

Views: **Table** and **Calendar**.

Filters: Appointment Status · Payment Status · Astrologer · Appointment Date
range · Booking Date range · Today / Upcoming / Past · Cancelled /
Rescheduled · Appointment ID / User ID / Astrologer ID.

## 5. Appointment details

Appointment ID · User / Astrologer · Booking Date / Time · Appointment Date /
Time slot · Duration · Type: voice-only · User Paid Amount · Payment
Transaction ID / Status · Appointment Status · Reschedule history (old slot /
new slot, reason, requested by, Date / Time) · Cancellation reason ·
Cancelled by · Refund eligibility / amount / status / transaction ID ·
Notification history (booking, reschedule, cancellation, reminders) ·
Related complaint.

## 6. Slots

- Admin may **view** Available / Booked / Blocked slots and slot history.
- **No Admin slot blocking** (ruling C4). Blocking or closing dates is done
  by the Astrologer (`AD-93`, `AD-94`).

## 7. Admin actions

- View details, profiles, payment / wallet, refund, related complaint.
- Cancel with permission and mandatory reason — refund handling `PP-13`.
- No-show tracking: User / Astrologer no-shows and attendance history are
  preserved; an Admin attendance correction requires a reason and audit;
  its effect on refunds and earnings is `PP-13`.
- **No Admin reschedule and no Admin slot blocking** (ruling C4).

## 8. Reports

Total · Booked Today · Upcoming · Completed · Cancelled · Rescheduled ·
No-show · Astrologer-wise · Cancellation rate · Completion rate. PDF / Excel export.

## 9. Audit

As [Service Overview §5](service-overview.md).

## 10. Pending Discussion – Not Finalized

| ID | Item |
|----|------|
| PP-13 | Effect of Admin cancellation and attendance correction on refunds / earnings |
| — | Late-cancellation percentage (Astrologer `AP-05-01`, missing source) |

## 11. Change History

| Version | Date | Change |
|---------|------|--------|
| 0.1 | 2026-11-25 | Initial draft. Approved statuses and rescheduling rules used; Admin rescheduling and slot blocking removed (ruling C4). |
