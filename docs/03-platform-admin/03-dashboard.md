# 03 — Dashboard

| Field | Value |
|-------|-------|
| Application | Platform Admin |
| Version | 0.1 (Draft) |
| Last Updated | 2026-11-25 |
| Status | Draft — awaiting product-owner review; not committed |
| Review list | [`15-platform-review-list.md`](15-platform-review-list.md) |

---

## 1. Purpose

The Platform Admin home screen: overall counts, today's KPIs, today's
operations, action-required alerts, three charts, and a short recent-activity
preview.

Admin Assistants see only the Dashboard sections of their assigned departments
([Assistant Management](04-people-management/assistant-management.md)).

## 2. Header — overall counts

Show:
- **Total Users**
- **Total Astrologers**
- **Total Assistants**

Each shows the current **online** count beside its total, for example:
- 12,450 Users / 39 Online
- 328 Astrologers / 59 Online
- 42 Assistants / 4 Online

(Figures are illustrative only.)

Rules:
- **Online** means currently active — not merely logged in and idle.
- Online counts are **unique accounts** currently online and update automatically.
- No separate login count is shown.

## 3. KPI cards

| Card | Meaning |
|------|---------|
| New Users Today | Users registered today |
| New Astrologers Today | Astrologers **newly registered** today (not verified accounts) |
| Today's Services | Two figures: **New Services Today** and **Completed Services Today** (§4) |
| Active Consultations | Consultations in progress now |
| Today's Revenue | **Platform Revenue** for today; the detailed breakdown is in [Payments & Finance](06-payments-finance.md) |

Desktop layout:
- Row 1: four KPI cards (New Users Today, New Astrologers Today, Today's Services, Active Consultations).
- Row 2: one **Today's Revenue** card.

Total Users and Total Astrologers are not repeated in the KPI cards (they are
in the header).

## 4. Today's Services — definitions

**New Services Today**
- Services newly submitted, booked, or created today.
- An Appointment booked today counts even if its appointment date is in the future.

**Completed Services Today**
- Services actually completed today, even if created or booked earlier.

A service created and completed today counts in both, because they are
different events. **Cancelled and Failed** services never count as New or
Completed.

## 5. Today's Operations

| Item | Definition |
|------|-----------|
| Appointments Today | Confirmed appointments **scheduled to take place today**. Future appointments merely booked today are not counted. |
| Questions Pending | Only questions **due or targeted to be answered today** — not every unanswered question. How "due today" maps to the approved 30-day answer deadline (Astrologer `AD-30`, User `D-18`) is `PP-21`. |
| Instant Calls & Chats | Currently active calls and chats; shows the **available Astrologer count** and the **current active sessions**. |
| Today's Cancellations | Only **new** cancellation requests received today. Older unresolved cancellation requests remain in [Appointment Management](05-service-management/appointment-management.md). |

## 6. Action Required alerts

Two separate cards.

### 6.1 Astrologer Tasks & Deadline Alert
Focus: Astrologer service deadlines.

Shows: **Due Today**, **Overdue**, and per service: **Text Questions**,
**Appointments**, **Instant Calls**, **Instant Chats**.

Clicking opens a task list **grouped by Astrologer and Service**, showing:
- Task ID
- Service
- Deadline
- Status

Notifications:
- Astrologers receive reminders **before the deadline, at the deadline, and when overdue**.
- Admin receives **overdue alerts** and monitors / follows up.

Note: for Text Questions, an unanswered question is automatically cancelled
and refunded at its 30-day deadline (`AD-30`); the meaning of "Overdue" for
Text Questions is `PP-21`.

### 6.2 Platform Tasks & Urgent Alerts
Operational issues such as:
- Settlements / Payouts
- Refunds
- Wallet issues
- Disputes / Complaints
- Appointment / Service issues
- Suspicious transactions
- Technical problems

Shows: **Due Today**, **Overdue**, **Urgent / Emergency**.

**Emergency alerts are highlighted immediately**, even when not due today.

## 7. Charts — exactly three

1. **Service Overview** — Text Questions, Appointments, Instant Calls, Instant Chats.
2. **Today's Revenue** — today's revenue only.
3. **User & Astrologer Growth** — registration growth.

No other Dashboard charts are added.

## 8. Recent Activity (preview)

- Shows the last **5–10** activities.
- There is **no** "View All" link on the Dashboard; full history is the
  separate sidebar module [Recent Activity / History](12-recent-activity-history.md).

## 9. Excluded from the Dashboard

- Quick Actions
- People Summary
- Document Management (separate module: [13](13-document-management.md))
- Live Sessions (separate future module — `PP-01`)

## 10. Data rules

- Counts use the source module's data; the same event is never counted twice.
- Figures are consistent with [Service Management](05-service-management/service-overview.md)
  and [Payments & Finance](06-payments-finance.md).

## 11. Pending Discussion – Not Finalized

| ID | Item |
|----|------|
| PP-01 | Live Sessions module (future; excluded from Dashboard) |
| PP-21 | "Due today" and "Overdue" for Text Questions given the approved 30-day automatic cancellation and refund |

## 12. Acceptance criteria

- [ ] Header shows Users, Astrologers, Assistants with unique, auto-updating online counts; no login count.
- [ ] KPI cards exactly as §3 in a 4 + 1 desktop layout; totals not repeated.
- [ ] New/Completed Services Today follow §4; cancelled and failed services excluded.
- [ ] Today's Operations follow §5.
- [ ] Two separate alert cards (§6); emergency alerts highlighted immediately.
- [ ] Exactly three charts.
- [ ] Recent Activity preview of 5–10 items with no View All link.
- [ ] Excluded sections are absent.

## 13. Change History

| Version | Date | Change |
|---------|------|--------|
| 0.1 | 2026-11-25 | Initial draft from owner-finalized Dashboard requirements. PP-21 recorded for Text Question deadlines. |
