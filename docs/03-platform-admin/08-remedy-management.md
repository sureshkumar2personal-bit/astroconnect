# 08 — Remedy / Atonement Management

| Field | Value |
|-------|-------|
| Application | Platform Admin |
| Version | 0.1 (Draft) |
| Last Updated | 2026-11-25 |
| Status | Draft — awaiting product-owner review; not committed |
| Review list | [`15-platform-review-list.md`](15-platform-review-list.md) |

---

## 1. Purpose

Approved Platform Admin requirements for Remedies (Atonement) (ruling C7).
The User App and Astrologer App documents still need alignment — `PX-01`;
those files are not changed here.

## 2. Remedy list and record

Remedy List columns / record fields:
- Remedy ID (unique)
- User / Astrologer
- Related Service ID
- Suggested Date
- Start Date
- Duration
- Due Date
- Instructions
- Steps
- Daily Progress
- Completion Proof
- Reminder History
- Edit / Cancel History
- Status
- Full Timeline

Overview counts: Total · Suggested · In Progress · Completed · Overdue · Cancelled.

## 3. Statuses

**Suggested · In Progress · Overdue · Completed · Cancelled.**

"Hidden" is a **visibility state**, not a Remedy status (§7).

## 4. Duration rules

- Duration begins **only when the User clicks Start Remedy**.
- The Start Date is **Day 1**.
- A Suggested (not started) Remedy does not run its duration; its status
  stays Suggested.
- A missed day does **not** reset the duration and does not cancel the Remedy.
- If the due date passes without completion, the status becomes **Overdue**.

## 5. Daily progress and proof

Daily progress values: **Completed for Today · Not Done · Unable to Do (with
reason) · Missed Update.**
- Every daily update records Date / Time.
- The daily progress update is **mandatory** (where required); **completion
  proof is optional**.
- Proof: photo or document; the User may upload daily or all together on the
  final day.

## 6. Astrologer edit / cancel

Before the User starts:
- The Astrologer may **Edit** — the User is notified and the old version is preserved.
- The Astrologer may **Cancel** — a reason and notification are required;
  progress and evidence are preserved; a new Remedy gets a new ID if needed.

After the User starts:
- The Astrologer **cannot edit or cancel**.
- Duration, Due Date, Instructions, and Steps are immutable.

## 7. Admin moderation

- Admin is **view-only**; Admin cannot edit or delete a Remedy.
- Admin may **flag / report**, **review**, and **hide** an inappropriate
  Remedy from the User App after review.
- A hidden Remedy remains visible to Admin.
- Each moderation action logs: Reason · Admin · Date / Time.

## 8. Reminder history

System automation sends reminders. History shows: Reminder Type · Date / Time
· Related Day · Sent / Delivered / Failed · Failure Reason.

## 9. Multiple remedies

Multiple Remedies from one Service are allowed. Each has its own ID,
duration, progress, proof, status, and history.

## 10. Relation to approved application rules

Compatible approved rules: a remedy prescribed in any service also appears in
the User's Remedy Tracker (User `D-11`); only the User marks a remedy
Completed and may upload a supporting photo/document (User `D-29`,
Astrologer `AD-22`); appointment notes / remedies / reports link back to the
originating appointment (Astrologer `AD-102`, `AD-163`; User `D-51`).

The Platform rules above also answer questions still open in the User App
(reminders `P-16-03`; astrologer edit / removal `P-16-06`) — alignment
`PX-01`.

## 11. Change History

| Version | Date | Change |
|---------|------|--------|
| 0.1 | 2026-11-25 | Initial draft. Remedy rules recorded as approved Platform Admin requirements (ruling C7); app alignment PX-01. |
