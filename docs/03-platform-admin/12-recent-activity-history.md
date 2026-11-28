# 12 — Recent Activity / History Management

| Field | Value |
|-------|-------|
| Application | Platform Admin |
| Version | 0.1 (Draft) |
| Last Updated | 2026-11-25 |
| Status | Draft — awaiting product-owner review; not committed |
| Review list | [`15-platform-review-list.md`](15-platform-review-list.md) |

---

## 1. Purpose

Separate Platform Admin sidebar module with the full activity history. The
Dashboard shows only the last 5–10 activities ([Dashboard §8](03-dashboard.md)).

## 2. Activity categories

- User activities
- Astrologer activities
- Assistant activities
- Service activities
- Payment activities
- Wallet activities
- Settlement activities
- Refund activities
- Dispute / Complaint activities
- Admin actions

## 3. Fields

- Activity ID
- Activity Type
- Actor
- Related User / Astrologer / Assistant ID
- Related Service / Transaction ID
- Date / Time
- Description
- Previous / New values (where applicable)

## 4. Features

- Month selection
- Category filter
- Search (Activity ID, User ID, Astrologer ID)
- Full details
- **PDF / Excel export**

## 5. Rules

- Assistant actions appear in the correct Activity History: Admin Assistant →
  Admin Activity History; Astrologer Assistant → the Astrologer's Activity
  History and Platform Admin Activity History
  ([Assistant Management §6](04-people-management/assistant-management.md)).
- Important account, payment, service, and dispute audit history is never deleted.
- Technical logs may have separate retention rules; exact periods are not
  finalized — `PP-14`.

## 6. Change History

| Version | Date | Change |
|---------|------|--------|
| 0.1 | 2026-11-25 | Initial draft from owner-finalized requirements. |
