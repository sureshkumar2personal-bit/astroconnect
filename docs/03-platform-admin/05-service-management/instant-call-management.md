# 05.3 — Instant Call Management

| Field | Value |
|-------|-------|
| Application | Platform Admin |
| Version | 0.1 (Draft) |
| Last Updated | 2026-11-25 |
| Status | Draft — awaiting product-owner review; not committed |
| Review list | [`../15-platform-review-list.md`](../15-platform-review-list.md) |

---

## 1. Purpose

Admin view and monitoring of Instant Call sessions, following the approved
application rules (ruling C1; Astrologer `06_INSTANT_CALL_AND_CHAT.md`,
User `08_INSTANT_CALL.md`).

## 2. Approved rules (by reference)

- The User chooses Instant Call, selects an available Astrologer, and sends a
  request; never auto-routed (Astrologer `AD-103`; User `D-44`).
- 30-second acceptance; Declined / Expired; Try Again / Try Some Other
  Astrologer; User may cancel before acceptance (`AD-104`).
- One atomic lock: one pending request or active consultation across Call and
  Chat; simultaneous second request gets Busy (`AD-105`).
- **Prepaid packages**, minimum 5 minutes, paid in full before the session;
  **no per-minute billing** (`AD-106`; `D-45`).
- No refund for early termination; extension offered 1 minute before
  expiry; unpaid → automatic end (`AD-107`).
- Early-termination complaints investigated by the Platform; warning on
  confirmed fault; no automatic refund (`AD-108`).
- Technical failure: 5-minute reconnection preserving remaining time; handling
  when reconnection permanently fails is open (Astrologer `AP-06-01`)
  (`AD-109`).
- Commission 2% (`AD-124`).

## 3. Statuses

Approved session states (Astrologer `AD-104`, `AD-105`): **Pending (request)
· Busy · Declined · Expired · Cancelled · Active · Completed**, plus technical
disconnection / reconnection (`AD-109`).

The prompt's statuses Connecting, Missed, Rejected, Failed, Disconnected are
not adopted as separate statuses; their mapping to the approved states is
open — **PC-13**.

## 4. Call list

- Call Session ID
- User
- Astrologer
- Requested Time
- Connected Time
- Duration
- Package (duration and price) and extensions
- User Charged Amount
- Payment Status
- Call Status
- View Details

Filters: Call Status · Astrologer · Date Range · Active / Completed /
Cancelled · Payment Status · Call Session ID / User ID / Astrologer ID.

## 5. Active calls (real-time monitoring)

User ID / Astrologer ID · Call start time · Duration · Connection status ·
Technical / payment issues.

## 6. Call details

Call Session ID · User / Astrologer · Requested / Connected / Ended
timestamps · Total duration · Package purchased and extensions · User Charged
Amount · Wallet Transaction ID · Payment / refund · Termination reason ·
Technical issues · Related complaint.

## 7. Admin actions

- View details, profiles, connection issues, payment / wallet, related complaint.
- Technical Support actions.
- Terminate an active call only for permitted Emergency / Technical Support
  reasons, with permission and a mandatory reason; the refund effect is `PP-13`.
- **Admin must not routinely listen to call audio.** Call recording is not
  default; if introduced, both parties must receive clear prior notice and
  give consent.

## 8. Reports

Total Calls · Active Calls · Completed Calls · Expired / Declined / Cancelled
· Average call duration · Total User charges · Astrologer-wise call count ·
Technical failure rate. PDF / Excel export.

## 9. Pending Discussion – Not Finalized

| ID | Item |
|----|------|
| PP-13 | Refund effect of Admin termination; handling when reconnection permanently fails (Astrologer `AP-06-01`) |
| PP-10 | Settlement eligibility period for Instant Call |
| PC-13 | Mapping of prompt statuses to approved session states |

## 10. Change History

| Version | Date | Change |
|---------|------|--------|
| 0.1 | 2026-11-25 | Initial draft. Per-minute billing removed; prepaid packages used (ruling C1). Approved session states used (PC-13). |
