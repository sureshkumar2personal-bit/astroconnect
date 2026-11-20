# 11 — Audience

| Field | Value |
|-------|-------|
| Application | Astrologer App |
| Status | Draft |
| Owned decisions | AD-135 – AD-137 |
| Review list | [`00_ASTROLOGER_APP_REVIEW_LIST.md`](00_ASTROLOGER_APP_REVIEW_LIST.md) |
| Shared context | [`CONTEXT.md`](../../CONTEXT.md) |

> **Frontend UI phase.** This specification describes product behaviour. It
> does not define APIs, data structures, or backend logic. Items marked
> `PENDING DISCUSSION` must not be implemented as if decided.

---

## 1. Purpose

Defines the single Audience page: one customer list of the astrologer's
users, filtered by All Users, Followers, and Subscribers.

## 2. Scope / Out of scope

**In scope**
- One Audience page, one list, three filters.
- Customer cards, search, sort, date filters, customer details, interactions, subscription status, blocked-user context.

**Out of scope**
- Follow and Subscribe rules → User App D-36 (X-09).
- Subscription price, duration, renewal, cancellation, refund → on hold (X-14; User App P-14-02 – P-14-05).
- Blocking a User → request to Platform Admin (AD-161 → [16](16_HELP_AND_SUPPORT.md)).

## 3. Entry points

- Placement within the tabs: `PENDING DISCUSSION` (AP-GL-02).
- Category A notifications (New Follower, New Subscriber, …) (AD-148).
- Recent Activity "New Follower" items (AD-20 → [01](01_HOME_SCREEN.md)).

## 4. Confirmed decisions

**Owned by this module** (verbatim from the decision register)

| ID | Decision |
|----|----------|
| AD-135 | **One Audience page:** Audience is one page with one customer list, filtered by **All Users**, **Followers**, and **Subscribers**. There are no duplicate separate pages or lists for Followers and Subscribers. |
| AD-136 | **Customer card:** each customer card may show User Name, User ID, Follow status, Subscription status, relevant dates, and a View Profile action. |
| AD-137 | **Audience features:** search; sort; date filters where relevant; customer details; interactions; subscription status; blocked-user context; correct User Profile navigation; previous filters/search preserved when returning. Illustrative counts are never presented as real data. |

**Referenced decisions**

| ID | Topic | Owning file |
|----|-------|-------------|
| AD-20 | Recent Activity (New Follower) | [01](01_HOME_SCREEN.md) |
| AD-65 | Subscription benefit questions shown separately | [01](01_HOME_SCREEN.md) |
| AD-72 | Subscription tiers and benefit questions | [02](02_TEXT_BASED_QUESTIONS.md) |
| AD-77 | Back preserves filters and search | [03](03_GLOBAL_NAVIGATION.md) |
| AD-78 | Audience user → exact User Profile | [03](03_GLOBAL_NAVIGATION.md) |
| AD-161 | User-blocking requests go to Platform Admin | [16](16_HELP_AND_SUPPORT.md) |

## 5. User flows

### 5.1 Browse the audience
1. The astrologer opens Audience (AD-135).
2. The astrologer selects All Users, Followers, or Subscribers (AD-135).
3. The astrologer searches, sorts, and applies date filters where relevant (AD-137).

### 5.2 Open a customer
1. The astrologer taps View Profile on a customer card (AD-136).
2. The exact User Profile opens (AD-78), showing customer details, interactions, subscription status, and blocked-user context (AD-137). Birth details follow the User's consent (User App D-37).
3. Back returns to the list with the same filter, search, and sort (AD-77).

### 5.3 Request blocking
The astrologer asks for a User to be blocked through Help & Support; Platform Admin reviews the request (AD-161).

## 6. Screens and content

### 6.1 Audience list (AD-135, AD-137)
Filters: All Users · Followers · Subscribers. Search; sort; date filters where relevant.

### 6.2 Customer card (AD-136)
User Name; User ID; Follow status; Subscription status; relevant dates; View Profile.

### 6.3 User Profile (AD-137)
Customer details; interactions; subscription status; blocked-user context.
The exact fields are not defined beyond these items.

Counts shown in mock-ups are illustrative and must never be presented as real data (AD-137).

## 7. Business rules and validations

| # | Rule | Source |
|---|------|--------|
| AUD-01 | One Audience page and one list; no separate Followers or Subscribers pages. | AD-135 |
| AUD-02 | Filters are All Users, Followers, Subscribers. | AD-135 |
| AUD-03 | View Profile opens the exact User Profile. | AD-136, AD-78 |
| AUD-04 | Returning preserves filters and search. | AD-137, AD-77 |
| AUD-05 | Illustrative counts are never shown as real data. | AD-137 |
| AUD-06 | Follow is free and never subscribes; Subscribe is paid and auto-follows (User App D-36). | X-09 |
| AUD-07 | The astrologer cannot block a User directly. | AD-161 |

## 8. States and edge cases

| Case | Behaviour |
|------|-----------|
| No followers or subscribers | Empty list for the filter; wording not defined |
| User is both Follower and Subscriber | One card showing both statuses (AD-135, AD-136) |
| Subscription expired or cancelled | Subscription status shown; category A notification (AD-148) |
| Blocked User | Blocked-user context shown (AD-137); blocking decided by Platform Admin (AD-161) |

## 9. Notifications triggered

Category A (New Follower; New Subscriber; New Subscription/Renewal;
Subscription Expired/Cancelled; New user interaction) → AD-148 ([14](14_NOTIFICATIONS_AND_REMINDERS.md)).

## 10. Dependencies on other modules

- [01](01_HOME_SCREEN.md), [02](02_TEXT_BASED_QUESTIONS.md) — Recent Activity; tiers.
- [03](03_GLOBAL_NAVIGATION.md) — navigation rules.
- [07](07_LIVE_SESSIONS.md), [12](12_CONTENT_MANAGEMENT.md) — audience selection uses Followers, Subscribers, tiers.
- [16](16_HELP_AND_SUPPORT.md) — blocking requests.
- **User App:** X-09 (Follow vs Subscribe, resolved); X-14 (subscription terms on hold); X-22.
- **Platform Admin:** PA-09 (blocking requests).

## 11. PENDING DISCUSSION

Full wording in [`00_ASTROLOGER_APP_REVIEW_LIST.md` §4](00_ASTROLOGER_APP_REVIEW_LIST.md#4-open-questions-register).

**Owned by this module:** none.

**Related**

| ID | Topic | Status |
|----|-------|--------|
| AP-GL-02 | Placement of Audience within the tabs | Open — missing source information |

## 12. Acceptance criteria

- [ ] There is exactly one Audience page with All Users / Followers / Subscribers filters (AD-135).
- [ ] Cards show the fields of AD-136 and View Profile opens the exact User Profile.
- [ ] Search, sort, date filters, customer details, interactions, subscription status, and blocked-user context are available; filters persist on return; no illustrative counts as real data (AD-137).

## 13. Change log

| Date | Change |
|------|--------|
| 2026-11-20 | Initial draft created from the Master Decision Document: AD-135 – AD-137. |
