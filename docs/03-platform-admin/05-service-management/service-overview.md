# 05.0 — Service Management: Overview and Common Rules

| Field | Value |
|-------|-------|
| Application | Platform Admin |
| Version | 0.1 (Draft) |
| Last Updated | 2026-11-25 |
| Status | Draft — awaiting product-owner review; not committed |
| Review list | [`../15-platform-review-list.md`](../15-platform-review-list.md) |

---

## 1. Purpose

Service Management contains:
1. Service Overview (this file)
2. [Text-Based Question Management](text-based-question-management.md)
3. [Appointment Management](appointment-management.md)
4. [Instant Call Management](instant-call-management.md)
5. [Instant Chat Management](instant-chat-management.md)

Each service has its own management page.

## 2. Service Overview

Per service (Text Questions, Appointments, Instant Calls, Instant Chats):
**Total · Pending · In Progress · Completed · Cancelled.** These are summary
groupings; each service's own approved statuses are listed in its file, and
the mapping of approved statuses to these groupings is part of `PP-22`.

Combined summary:
- New Services Today
- Completed Services Today
- Pending Services
- Overdue Services
- Cancellation Requests Today
- Technical Issues
- Astrologer-wise Service Summary

"New Services Today", "Completed Services Today", and "Cancellation Requests
Today" use the [Dashboard](../03-dashboard.md) definitions.

## 3. Common service list

- Service ID
- User Name / ID
- Astrologer Name / ID
- Created Date / Time
- Service Date / Time (where applicable)
- User Paid Amount
- Payment Status
- Service Status
- View Details

Common filters: Service Status · Payment Status · Astrologer · Date Range ·
Service ID · User ID · Astrologer ID · Today / Upcoming / Completed / Overdue.

**PDF / Excel export** of the filtered list.

## 4. Common Admin actions

- View Details
- View User / Astrologer Profile
- View Payment / Wallet Transaction
- View Refund Details
- View Related Dispute / Complaint
- Cancel — with permission and mandatory reason, where the service's own
  file allows it
- Technical Support actions

Actions that conflict with approved application rules are **not** included:
- No assignment or reassignment of Text Questions — the User buys slots from
  the selected Astrologer's campaign (ruling C3; User `D-05`).
- No Admin rescheduling and no Admin slot blocking for Appointments — only
  the User may reschedule, once (ruling C4; User `D-41`, Astrologer `AD-94`,
  `AD-98`).

## 5. Common audit

Every action records: Action Taken By · Admin ID / Name · Action · Related
Service ID · Previous Status · New Status · Reason · Date / Time.

## 6. Finance separation

- Service screens show **User Paid Amount** and **Payment Status** only.
- Platform Commission and Astrologer Earnings are **not** shown in the User
  service view; they belong to [Payments & Finance](../06-payments-finance.md).
- Refund approval / processing belongs to Refund Management (Payments & Finance).
- Dispute investigation belongs to
  [Dispute & Complaint Management](../07-dispute-complaint-management.md).

## 7. Pending Discussion – Not Finalized

| ID | Item |
|----|------|
| PP-13 | Refund and status effects when Admin cancels a service or terminates a session |
| PP-22 | Mapping of each service's approved statuses to the overview groupings (Pending, In Progress, Completed, Cancelled, Overdue) |

## 8. Change History

| Version | Date | Change |
|---------|------|--------|
| 0.1 | 2026-11-25 | Initial draft. Assignment / reassignment and Admin reschedule / slot blocking removed per rulings C3, C4. |
