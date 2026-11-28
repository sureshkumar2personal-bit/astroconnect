# 05.4 — Instant Chat Management

| Field | Value |
|-------|-------|
| Application | Platform Admin |
| Version | 0.1 (Draft) |
| Last Updated | 2026-11-25 |
| Status | Draft — awaiting product-owner review; not committed |
| Review list | [`../15-platform-review-list.md`](../15-platform-review-list.md) |

---

## 1. Purpose

Admin view and monitoring of Instant Chat sessions, following the approved
application rules (rulings C1, C6; Astrologer `06_INSTANT_CALL_AND_CHAT.md`,
User `09_INSTANT_CHAT.md`).

## 2. Approved rules (by reference)

- Request, acceptance, lock, prepaid packages, extension, early termination,
  and technical failure follow the same approved rules as Instant Call
  ([Instant Call Management §2](instant-call-management.md)): Astrologer
  `AD-103` – `AD-110`; User `D-44` – `D-46`. **No per-minute billing.**
- Chat messages are saved across reconnection (`AD-109`).
- **24-hour rule:** full chat messages are accessible to the User and the
  Astrologer for 24 hours only; afterwards they are inaccessible to both;
  booking, date/time, astrologer, and payment records remain (Astrologer
  `AD-111`; User `D-47`).
- Commission 2% (`AD-124`).

## 3. Statuses

Same approved session states as Instant Call: Pending (request) · Busy ·
Declined · Expired · Cancelled · Active · Completed, plus technical
disconnection / reconnection. Prompt statuses mapping — **PC-13**.

## 4. Chat list

- Chat Session ID
- User
- Astrologer
- Requested / Started / Ended Date / Time
- Chat duration
- Package (duration and price) and extensions
- User Charged Amount
- Payment Status
- Chat Status
- View Details

## 5. Active chats (real-time monitoring)

User ID / Astrologer ID · Start time · Duration · Connection status ·
Technical / payment issues.

## 6. Chat details

Chat Session ID · User / Astrologer · Chat start / end time · Total duration ·
Package purchased and extensions · User Charged Amount · Wallet Transaction
ID · Payment / refund details · Technical issue / termination reason ·
Related complaint.

## 7. Privacy

- Admin must not routinely read chat messages.
- Admin transcript retention and access — including any authorized access
  for a Dispute / Complaint and the logging of who viewed which session and
  when — are **Pending Discussion** (`PP-04`; ruling C6). No staff access is
  granted automatically.
- Admin must never impersonate the User or the Astrologer or send messages on
  their behalf.

## 8. Admin actions

- View details, profiles, connection issues, payment / wallet, related complaint.
- Technical Support actions.
- Terminate an active chat only for permitted Emergency / Technical Support
  reasons, with permission and a mandatory reason; refund effect `PP-13`.

## 9. Reports

Total Chats · Active Chats · Completed Chats · Expired / Declined / Cancelled
· Average chat duration · Total User charges · Astrologer-wise chat count ·
Technical failure rate. PDF / Excel export.

## 10. Pending Discussion – Not Finalized

| ID | Item |
|----|------|
| PP-04 | Admin chat-transcript retention and access |
| PP-10 | Settlement eligibility period for Instant Chat |
| PP-13 | Refund effect of Admin termination; permanent reconnection failure |
| PC-13 | Mapping of prompt statuses to approved session states |

## 11. Change History

| Version | Date | Change |
|---------|------|--------|
| 0.1 | 2026-11-25 | Initial draft. Per-minute billing removed (ruling C1); transcript access pending (ruling C6). |
