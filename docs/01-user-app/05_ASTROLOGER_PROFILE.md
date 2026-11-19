# 05 — Astrologer Profile

| Field | Value |
|-------|-------|
| Application | User App |
| Status | Draft |
| Owned decisions | D-38 |
| Review list | [`00_USER_APP_REVIEW_LIST.md`](00_USER_APP_REVIEW_LIST.md) |
| Shared context | [`CONTEXT.md`](../../CONTEXT.md) |

---

## 1. Purpose

Defines the astrologer profile page as seen by a user.

## 2. Scope / Out of scope

**In scope**
- Information shown about an astrologer.
- Display of the astrologer's active campaigns.
- Display of reviews and availability.
- Actions available from the profile.

**Out of scope**
- Rules for subscribing and following → [14](14_FOLLOWING_AND_SUBSCRIPTIONS.md).
- Rules for question slots and campaigns → [06](06_TEXT_QUESTION_SERVICE.md).
- Rules for submitting reviews → [07](07_APPOINTMENT_SERVICE.md), [08](08_INSTANT_CALL.md), [09](09_INSTANT_CHAT.md).

## 3. Entry points

`PENDING DISCUSSION` (P-01-13).

## 4. Confirmed decisions

**Owned by this module** (verbatim from the decision register)

| ID | Decision |
|----|----------|
| D-38 | **Astrologer DND / Planned Unavailability (user view):** while an astrologer's DND is active, the astrologer's profile is **hidden** — users cannot discover or view it, cannot purchase or submit new Text-Based Questions (including Campaign Questions, Open Questions, and Subscription Questions), cannot book Appointments, and cannot start Instant Calls or Instant Chats. Existing purchased question slots keep their established validity and expiry rules (D-07). |

**Referenced decisions**

| ID | Topic | Owning file |
|----|-------|-------------|
| D-04 | Subscription prerequisite for Text Questions | [06](06_TEXT_QUESTION_SERVICE.md) |
| D-05 | Purchasing question slots from campaigns | [06](06_TEXT_QUESTION_SERVICE.md) |
| D-10 | Reviews after consultations | [07](07_APPOINTMENT_SERVICE.md), [08](08_INSTANT_CALL.md), [09](09_INSTANT_CHAT.md) |
| D-17 | Text Question rating and review | [06](06_TEXT_QUESTION_SERVICE.md) |
| D-20 | Campaigns and pricing shown to users (including optional special label) | [06](06_TEXT_QUESTION_SERVICE.md) |
| D-36 | Follow and Subscribe | [14](14_FOLLOWING_AND_SUBSCRIPTIONS.md) |
| D-39 | Text-Based Questions service suspension (user view) | [06](06_TEXT_QUESTION_SERVICE.md) |

## 5. User flows

`PENDING DISCUSSION` — the actions offered on the profile (P-05-06).

Where a flow begins on this page, its rules come from the owning file:
- Subscribing before asking a question: D-04 → [06](06_TEXT_QUESTION_SERVICE.md); subscription mechanics → [14](14_FOLLOWING_AND_SUBSCRIPTIONS.md).
- Purchasing question slots from active campaigns: D-05 → [06](06_TEXT_QUESTION_SERVICE.md).

## 6. Screens and content

`PENDING DISCUSSION`:
- Profile fields (P-05-01).
- Display of active campaigns (P-05-02). Confirmed campaign content: General/Personal options, original price, discount percentage, final payable price, optional special title/label (D-20 → [06](06_TEXT_QUESTION_SERVICE.md)); per-user purchase limit (P-06-13).
- Display and sorting of reviews (P-05-03).
- Availability display (P-05-04).
- Share or report options (P-05-05).
- Available actions (P-05-06).

## 7. Business rules and validations

Owned rule: D-38 (listed below). Referenced rules: D-04, D-05
(→ [06](06_TEXT_QUESTION_SERVICE.md)), D-10 (→ 07, 08, 09).

- While an astrologer's DND / Planned Unavailability is active, the profile is hidden: it cannot be discovered or viewed, and no Text-Based Question (including Campaign, Open, and Subscription Questions), Appointment, Instant Call, or Instant Chat can be purchased, submitted, booked, or started. Existing purchased slots keep their validity (D-38).
- Follow is free and never subscribes; Subscribe is paid and automatically follows (D-36 → [14](14_FOLLOWING_AND_SUBSCRIPTIONS.md)).
- While an astrologer's Text-Based Questions service is suspended, new question slots cannot be bought from the profile; other services remain available (D-39 → [06](06_TEXT_QUESTION_SERVICE.md)).

## 8. States and edge cases

`PENDING DISCUSSION` — e.g. astrologer with no active campaigns, no
reviews, or unavailable (P-05-02, P-05-03, P-05-04).

## 9. Notifications triggered

None confirmed.

## 10. Dependencies on other modules

- [04](04_EXPLORE_AND_ASTROLOGER_DISCOVERY.md) — discovery.
- [06](06_TEXT_QUESTION_SERVICE.md) — campaigns, slots, questions.
- [07](07_APPOINTMENT_SERVICE.md), [08](08_INSTANT_CALL.md), [09](09_INSTANT_CHAT.md) — services and reviews.
- [14](14_FOLLOWING_AND_SUBSCRIPTIONS.md) — follow/subscribe.

## 11. PENDING DISCUSSION

Full wording in [`00_USER_APP_REVIEW_LIST.md` §4](00_USER_APP_REVIEW_LIST.md#4-pending-discussion-register).

**Owned by this module**

| ID | Topic |
|----|-------|
| P-05-01 | Profile fields |
| P-05-02 | Display of active campaigns |
| P-05-03 | Display and sorting of reviews |
| P-05-04 | Availability display |
| P-05-05 | Share or report a profile |
| P-05-06 | Actions available on the profile |

**Related (owned elsewhere)**

| ID | Topic |
|----|-------|
| P-01-13 | Screens that open an astrologer profile |
| P-06-13 | Campaign definition |
| P-07-10 | Review content |
| P-14-01 | Follow vs Subscribe — **Resolved** (D-36) |

## 12. Acceptance criteria

Referenced rules are
verified in their owning files.

- [ ] During DND / Planned Unavailability the astrologer profile is hidden and nothing can be purchased, submitted, booked, or started (D-38).

## 13. Change log

| Date | Change |
|------|--------|
| 2026-11-17 | Initial draft created. |
| 2026-11-19 | Referenced D-17 (Text Question reviews) and D-20 (campaign content and pricing display). |
| 2026-11-19 | D-38 added (profile hidden during DND); D-36 and D-39 referenced; P-14-01 marked Resolved. |
