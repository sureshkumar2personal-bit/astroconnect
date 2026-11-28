# 10 — Ratings & Reviews (Review Management)

| Field | Value |
|-------|-------|
| Application | Platform Admin |
| Version | 0.1 (Draft) |
| Last Updated | 2026-11-25 |
| Status | Draft — awaiting product-owner review; not committed |
| Review list | [`15-platform-review-list.md`](15-platform-review-list.md) |

---

## 1. Purpose

Standalone Review Management module. The Astrologer Profile → Ratings &
Reviews tab is view-only; full actions are here.

## 2. Review list and details

User · Service · Rating · Review Date · Review Text · Status · Reply history.

Overview: Total · Published · Pending Publication · Hidden · Replied · Not
Replied · Average Rating · Rating Distribution.

## 3. Approved rules (by reference)

- After a Text Question, Appointment, Instant Call, or Instant Chat, a 1–5
  star rating is mandatory; written feedback is optional; the User cannot
  edit or delete a submitted review but may request changes through Platform
  Support (Astrologer `AD-129`; User `D-10`, `D-17`). Enforcement mechanism
  open (Astrologer `AP-10-01`).
- The Astrologer may optionally reply, publish positive / selected reviews,
  hide reviews, and edit / delete their own reply. No mandatory reply; no
  penalty for not replying; one current reply per review (`AD-130`).
- Statuses: Pending Publication · Published · Hidden · Replied / Not Replied (`AD-131`).
- The public overall rating uses Published reviews only (`AD-132`).
- Hidden reviews are not shown in the User App and remain visible to Admin.

## 4. Admin actions

Platform requirement: Admin may **flag, review, and hide** inappropriate reviews.

The approved Astrologer App decision `AD-133` additionally lists Platform
Admin permissions: view all reviews and replies; publish or hide reviews;
remove reviews for policy violations; hide or remove replies; flag and
investigate; monitor negative review patterns; notify the Astrologer with a
reason when Admin hides / removes a review or reply. These approved
permissions are preserved here.

PDF / Excel export.

## 5. Change History

| Version | Date | Change |
|---------|------|--------|
| 0.1 | 2026-11-25 | Initial draft; approved review rules referenced (AD-129 – AD-133). |
