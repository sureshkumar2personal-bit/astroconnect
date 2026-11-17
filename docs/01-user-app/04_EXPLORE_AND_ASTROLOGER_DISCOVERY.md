# 04 — Explore and Astrologer Discovery

| Field | Value |
|-------|-------|
| Application | User App |
| Status | Draft |
| Owned decisions | None |
| Review list | [`00_USER_APP_REVIEW_LIST.md`](00_USER_APP_REVIEW_LIST.md) |
| Shared context | [`CONTEXT.md`](../../CONTEXT.md) |

---

## 1. Purpose

Defines how users find astrologers through the Explore tab.

## 2. Scope / Out of scope

**In scope**
- Searching, filtering, sorting, and ranking astrologers.

**Out of scope**
- The astrologer profile page → [05](05_ASTROLOGER_PROFILE.md).
- Discovering and purchasing services → Services tab ([01](01_NAVIGATION_AND_STRUCTURE.md)).
- Following and subscribing → [14](14_FOLLOWING_AND_SUBSCRIPTIONS.md).

## 3. Entry points

- **Explore** tab in the bottom navigation (D-01 → [01](01_NAVIGATION_AND_STRUCTURE.md)).
- Boundary between Explore and Services: `PENDING DISCUSSION` (P-01-08).

## 4. Confirmed decisions

This module owns no confirmed decisions.

**Referenced decisions**

| ID | Topic | Owning file |
|----|-------|-------------|
| D-01 | Bottom navigation tabs | [01](01_NAVIGATION_AND_STRUCTURE.md) |

## 5. User flows

`PENDING DISCUSSION`:
- Search (P-04-01), filter (P-04-02), sort (P-04-03).
- Opening an astrologer profile from results (P-01-13).

## 6. Screens and content

`PENDING DISCUSSION`:
- Search fields (P-04-01).
- Filters (P-04-02).
- Sort options (P-04-03).
- Information shown per astrologer in results, including availability
  (P-04-02, P-05-04).

## 7. Business rules and validations

No confirmed rules are owned by this module.

- Default ranking of results: `PENDING DISCUSSION` (P-04-04).

## 8. States and edge cases

`PENDING DISCUSSION` — no results, loading, and error states depend on
P-04-01 to P-04-04.

## 9. Notifications triggered

None confirmed.

## 10. Dependencies on other modules

- [01](01_NAVIGATION_AND_STRUCTURE.md) — tab definition and Explore/Services boundary.
- [05](05_ASTROLOGER_PROFILE.md) — destination when an astrologer is selected (P-01-13).

## 11. PENDING DISCUSSION

Full wording in [`00_USER_APP_REVIEW_LIST.md` §4](00_USER_APP_REVIEW_LIST.md#4-pending-discussion-register).

**Owned by this module**

| ID | Topic |
|----|-------|
| P-04-01 | Search fields |
| P-04-02 | Filters |
| P-04-03 | Sort options |
| P-04-04 | Default ranking |

**Related (owned elsewhere)**

| ID | Topic |
|----|-------|
| P-01-08 | Boundary between Explore and Services |
| P-01-13 | Screens that open an astrologer profile |
| P-05-04 | Availability display |

## 12. Acceptance criteria

- [ ] Astrologer discovery is reachable from the Explore tab (D-01 → [01](01_NAVIGATION_AND_STRUCTURE.md)).

No other confirmed criteria yet.

## 13. Change log

| Date | Change |
|------|--------|
| 2026-11-17 | Initial draft created. |
