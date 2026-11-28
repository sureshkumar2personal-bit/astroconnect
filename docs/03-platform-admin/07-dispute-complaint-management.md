# 07 — Dispute & Complaint Management

| Field | Value |
|-------|-------|
| Application | Platform Admin |
| Version | 0.1 (Draft) |
| Last Updated | 2026-11-25 |
| Status | Draft — awaiting product-owner review; not committed |
| Review list | [`15-platform-review-list.md`](15-platform-review-list.md) |

---

## 1. Purpose and classification

Two separate sections (ruling C5):

1. **Service Disputes** — only Text-Based Question answer disputes; **one
   Dispute per Text Question**.
2. **Technical Complaints** — other service / platform issues: Appointment,
   Call, Chat, Subscription, Payment, Wallet, Login, technical problems.

For Appointments, Instant Call, and Instant Chat there is no user-dispute
section; user feedback on those services is handled through Ratings &
Reviews (Astrologer `AD-162`). Technical problems with them are Technical
Complaints.

The User Profile shows only that User's own records; this module shows all
records. **Both views use the same underlying record** — no duplicates.

## 2. Approved Service Dispute flow (by reference)

- The User may raise a Dispute within **7 days after the answer** (IST
  calendar days); one per question (Astrologer `AD-41`; User `D-19`).
- The Astrologer answers the Dispute **once, within 3 days**; if not, the
  Dispute is escalated to **Admin Review** (`AD-41`).
- No further Dispute after the Dispute Answer (`AD-41`).
- The Dispute Answer: max 1,500 characters, text only (`AD-44`).
- Separately, the User may raise a **Platform Complaint** within 7 days after
  the Dispute Answer about an inappropriate or improper answer (`AD-42`;
  User `D-27`). Its place in this module is `PP-23`.
- Settlement after a dispute follows `AD-43`.

## 3. Record contents

- Complaint form: text description; evidence (Photo / PDF / Screenshot)
- Category
- Related Service ID (Text Question ID if applicable)
- User / Astrologer details
- Assignment and Priority
- Response requests
- Internal Notes (Admin / authorized Support only)
- Public Replies (visible to the User / relevant party)
- Evidence review
- Investigation
- Resolution
- Refund details
- Deadline
- Full timeline

What the User must provide when raising a dispute is still open in the User
App (`P-06-16`) — `PX-05`.

## 4. Record statuses

Open · Under Investigation · Waiting for User Response · Waiting for
Astrologer Response · Resolved · Rejected · Closed · Withdrawn by User.

How these record statuses map to the approved Service Dispute flow and the
Text Question statuses (Disputed, Dispute Answered — Astrologer `AD-51`) is
open — **PC-11**.

## 5. Admin actions

- Assign
- Change Priority
- Request More Information
- Add Internal Notes
- Public Reply
- Contact Parties
- Review Evidence
- Escalate to Super Admin
- Resolve / Reject / Close

Every action is recorded in Admin Activity History.

## 6. Resolution and refunds

- Resolution outcomes, including any refund (full or partial), are **pending**
  — `PP-03` (ruling C5). Refund approval rules not already approved are not
  applied.
- Refunds, when approved, are processed through Refund Management
  ([Payments & Finance §5](06-payments-finance.md)).

## 7. Withdrawal

The User may withdraw a Dispute / Complaint before it is Resolved / Rejected.
Full history is preserved.

## 8. Evidence access

Only permitted Admin / Support staff may view relevant evidence. Each access
logs: who viewed · which evidence · Date / Time. Access to chat transcripts is
not granted by this module — `PP-04`.

## 9. Reports

Total · Resolved / Rejected / Withdrawn · Refund counts · Average resolution
time · Astrologer-wise disputes · Pending / Overdue. PDF / Excel export.

## 10. Pending Discussion – Not Finalized

| ID | Item |
|----|------|
| PP-02 | Exact Admin response / resolution deadlines (beyond the Astrologer's approved 3-day dispute answer) |
| PP-03 | Refund approval, full / partial refund resolutions |
| PP-04 | Chat-transcript access for investigations |
| PP-23 | Where the Platform Complaint (`AD-42`, `D-27`) sits in this module |
| PC-11 | Mapping of record statuses to the approved dispute flow and Text Question statuses |

## 11. Change History

| Version | Date | Change |
|---------|------|--------|
| 0.1 | 2026-11-25 | Initial draft. Classification and approved 3-day / Admin Review flow preserved; refund rules pending (ruling C5). |
