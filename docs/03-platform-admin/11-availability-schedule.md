# 11 — Availability & Schedule

| Field | Value |
|-------|-------|
| Application | Platform Admin |
| Version | 0.1 (Draft) |
| Last Updated | 2026-11-25 |
| Status | Draft — awaiting product-owner review; not committed |
| Review list | [`15-platform-review-list.md`](15-platform-review-list.md) |

---

## 1. Purpose

Admin view of Astrologer availability and schedules. **Admin view-only.**

## 2. Availability states

**Available · Busy · Offline · DND.**

Relation to approved Astrologer App rules:
- Online / Offline and the individual Instant Call and Instant Chat switches
  (Astrologer `AD-04` – `AD-06`, `AD-164`).
- Busy: the astrologer has a pending request or active consultation (single
  atomic lock — `AD-105`).
- DND / Planned Unavailability blocks all new services and hides the profile;
  existing confirmed appointments remain valid (`AD-07`, `AD-09`, `AD-74`,
  `AD-165`).
- **DND cannot be activated during an active Call / Chat** (`AD-74`).

## 3. Schedule information shown

- Weekly schedule
- Daily availability
- Appointment slots — Available / Booked / Blocked
- Manual date-closure history
- DND / Busy history
- Schedule change history

Schedule rules are the approved Astrologer App rules (calendar, 90-day
horizon, overrides, buffers, breaks, date closure — `AD-92` – `AD-94`). No
other scheduling rule is added.

PDF / Excel export.

## 4. Change History

| Version | Date | Change |
|---------|------|--------|
| 0.1 | 2026-11-25 | Initial draft from owner-finalized requirements; approved availability rules referenced. |
