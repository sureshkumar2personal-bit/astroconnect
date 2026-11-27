# 19 — Service Management

| Field | Value |
|-------|-------|
| Application | Astrologer App |
| Status | Draft |
| Owned decisions | AD-172 |
| Review list | [`00_ASTROLOGER_APP_REVIEW_LIST.md`](00_ASTROLOGER_APP_REVIEW_LIST.md) |
| Shared context | [`CONTEXT.md`](../../CONTEXT.md) |

> **Frontend UI phase.** This specification describes product behaviour. It
> does not define APIs, data structures, or backend logic. Items marked
> `PENDING DISCUSSION` must not be implemented as if decided.

---

## 1. Purpose

Defines the Service Management page: the services the astrologer offers and the settings they can change for each, with Instant Call, Instant Chat, Appointments, Text-Based Questions and Live Sessions.

## 2. Entry points

- Sidebar **More** list and the phone **All sections** menu. Placement within the main tabs is still open (AP-GL-02 → [00](00_ASTROLOGER_APP_REVIEW_LIST.md)).

## 3. Confirmed decisions

**Owned by this module** (verbatim from the decision register in [`00`](00_ASTROLOGER_APP_REVIEW_LIST.md))

| ID | Decision |
|----|----------|
| AD-172 | **Service Management:** the Astrologer App has a Service Management page, reached from the sidebar "More" list and the phone "All sections" menu, with one page per service. Text-Based Questions: the astrologer turns platform categories on or off, adds, renames, turns off and deletes their own categories (names must be unique), sets one General and one Personal price per category that is on (prices above ₹0), and adds their own guidelines shown after the platform guidelines; character limits (1,000 for users, 1,500 for answers) and the shared monthly quota (1,000 questions, resetting on the 1st at 12:00 AM IST) are platform rules; purchased slots and campaigns stay in Campaign Management. Appointments: 15- and 30-minute lengths (at least one) with a price each, weekdays, time ranges per day (no overlaps, at least 15 minutes), a 90-day rolling window shown 7 days at a time, fixed reminders and the booking policies of 05_APPOINTMENTS.md. Instant Call and Instant Chat: a per-minute rate above ₹0 (the 5-minute minimum prepaid duration, 30-second accept time and a waiting list of 3 are platform rules). Live Sessions: read-only rules with links to Create Live, Live History and Live Settings. Turning a service on or off stays on the Home Dashboard. In the prototype, Save keeps the changes on the page only and does not change the live settings of any other section. *(Added 2026-11-27 at the product owner's request.)* |

## 4. PENDING DISCUSSION

| ID | Question | Status |
|----|----------|--------|
| AP-19-01 | Where service settings are stored and which setting wins when this page and an existing section differ | Open |

## 5. Change log

| Date | Change |
|------|--------|
| 2026-11-27 | Initial draft from the product-owner request and the reference design. |
