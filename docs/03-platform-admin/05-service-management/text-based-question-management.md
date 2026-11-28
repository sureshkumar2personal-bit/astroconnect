# 05.1 — Text-Based Question Management

| Field | Value |
|-------|-------|
| Application | Platform Admin |
| Version | 0.1 (Draft) |
| Last Updated | 2026-11-25 |
| Status | Draft — awaiting product-owner review; not committed |
| Review list | [`../15-platform-review-list.md`](../15-platform-review-list.md) |

---

## 1. Purpose

Admin view and management of Text-Based Questions. The workflow and statuses
are the approved application rules (ruling C3); Platform Admin does not
change them.

## 2. Approved workflow (source: Astrologer `02_TEXT_BASED_QUESTIONS.md`, User `06_TEXT_QUESTION_SERVICE.md`)

1. The User subscribes to the Astrologer before asking (User `D-04`).
2. The User buys question slots from the **selected Astrologer's** active
   campaigns or Open Questions (User `D-05`; Astrologer `AD-24` – `AD-27`,
   `AD-54`). There is **no automatic assignment and no Admin reassignment.**
3. Submission deadline: the earlier of 7 days from slot purchase and the
   campaign expiry (Astrologer `AD-28`; User `D-07`).
4. The Astrologer answers within **30 days** of submission; otherwise the
   question is automatically cancelled and refunded (Astrologer `AD-30`,
   User `D-18`).
5. Dispute: within 7 days after the answer; one per question; the Astrologer
   answers once within 3 days, otherwise Admin Review (Astrologer `AD-41`,
   User `D-19`).
6. Settlement: after the 7-day dispute window (or the dispute answer)
   (Astrologer `AD-43`).

## 3. Statuses (approved)

| Status | Meaning (Astrologer `AD-51`) |
|--------|------------------------------|
| New / Received | Question purchased / submitted |
| Pending | The Astrologer has opened the question |
| Completed | The Astrologer submitted the answer |
| Settled | Dispute window ended without dispute; eligible for settlement |
| Correction Requested | Correction requested by the Astrologer (`AD-35`) |
| Disputed | User raised a Dispute |
| Dispute Answered | Astrologer answered the Dispute |
| Expired | 30-day answer deadline passed; auto-cancelled and refunded (`AD-47`) |

The User sees New / Received, Pending, Completed (User `D-25`). Priority 1 /
Priority 2 are urgency views, not statuses (Astrologer `AD-32`, `AD-33`).

The status list in the original Platform prompt (Submitted, Assigned, In
Progress, Answered, Overdue, Cancelled, Refunded) is **not used** (ruling C3).

## 4. Question list

- Question ID
- User
- Astrologer
- Submitted Date / Time
- Deadline (30-day answer deadline)
- User Paid Amount
- Payment Status
- Question Status
- View Details
- Category — Pending Discussion (`PP-05`)

Filters: Question Status · Payment Status · Astrologer · Date Range · Due
Today · Question ID / User ID / Astrologer ID. ("Overdue" and Category
filters depend on `PP-21` and `PP-05`.)

## 5. Deadlines and alerts

- Answer deadline and due-today views; Astrologer reminders; Admin alerts
  ([Dashboard](../03-dashboard.md) §6.1).
- Because unanswered questions are automatically cancelled and refunded at
  30 days, the meaning of "Overdue" for Text Questions is `PP-21`.

## 6. Question details

- Question Text (max 1,000 characters — `AD-69`)
- Attachments: General — none; Personal — up to 2 PDF/JPEG files of 10 MB
  each, or saved birth details (User `D-22`, `D-35`)
- Birth Details Used (shared only with consent — `D-37`)
- Astrologer Answer (max 1,500 characters; up to 3 attachments) and Answer
  Date / Time (`AD-36`, `AD-45`)
- Deadline
- Payment Details
- Cancellation / Refund
- Related Dispute
- Follow-up / Revision — Pending Discussion (`PP-06`); not assumed to be a
  correction request

## 7. Admin actions

- View
- View Payment / Refund
- View Related Dispute
- View User / Astrologer Profile
- Cancel with Reason (with permission) — resulting status and refund
  handling are `PP-13`
- **Admin must not edit the Astrologer's original answer** (answers cannot be
  edited after submission — `AD-37`).

No Assign / Reassign action exists (ruling C3).

## 8. Dispute

- Text Question Service Dispute only; one per Text Question.
- Investigation happens in
  [Dispute & Complaint Management](../07-dispute-complaint-management.md);
  both views link the same record.

## 9. Reports

Total Questions · New Today · Answered Today · Pending · Due Today · Expired ·
Astrologer-wise answer performance · Average answer time. ("Overdue" — `PP-21`;
category-wise count — `PP-05`.) PDF / Excel export.

## 10. Audit

As [Service Overview §5](service-overview.md).

## 11. Pending Discussion – Not Finalized

| ID | Item |
|----|------|
| PP-05 | Question "Category" |
| PP-06 | Question "Follow-up / Revision" |
| PP-13 | Effect of Admin cancellation (status, refund) |
| PP-21 | "Due today" / "Overdue" for Text Questions |

## 12. Change History

| Version | Date | Change |
|---------|------|--------|
| 0.1 | 2026-11-25 | Initial draft. Approved workflow and statuses used; auto-assignment, reassignment, and prompt status list removed (ruling C3); Category and Follow-up pending (ruling C9). |
