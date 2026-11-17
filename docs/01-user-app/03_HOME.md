# 03 — Home

| Field | Value |
|-------|-------|
| Application | User App |
| Status | Draft |
| Owned decisions | None |
| Review list | [`00_USER_APP_REVIEW_LIST.md`](00_USER_APP_REVIEW_LIST.md) |
| Shared context | [`CONTEXT.md`](../../CONTEXT.md) |

---

## 1. Purpose

Defines the Home tab of the User App.

## 2. Scope / Out of scope

**In scope**
- Content and sections shown on the Home tab.

**Out of scope**
- Astrologer search and discovery → [04](04_EXPLORE_AND_ASTROLOGER_DISCOVERY.md).
- Starting or purchasing services → Services tab ([01](01_NAVIGATION_AND_STRUCTURE.md)).
- Managing purchased or used services → [11](11_ACTIVITY_AND_SERVICE_HISTORY.md).

## 3. Entry points

- **Home** tab in the bottom navigation (D-01 → [01](01_NAVIGATION_AND_STRUCTURE.md)).
- Whether Home is the default tab: `PENDING DISCUSSION` (P-01-11).

## 4. Confirmed decisions

This module owns no confirmed decisions.

**Referenced decisions**

| ID | Topic | Owning file |
|----|-------|-------------|
| D-01 | Bottom navigation tabs | [01](01_NAVIGATION_AND_STRUCTURE.md) |

## 5. User flows

`PENDING DISCUSSION` (P-03-01).

## 6. Screens and content

`PENDING DISCUSSION`:
- Sections and content (P-03-01).
- Personalisation (P-03-02).
- Promotions or banners (P-03-03).

## 7. Business rules and validations

No confirmed rules are owned by this module.

## 8. States and edge cases

`PENDING DISCUSSION` — depends on P-03-01 (e.g. what Home shows for a new
user with no history).

## 9. Notifications triggered

None confirmed.

## 10. Dependencies on other modules

- [01](01_NAVIGATION_AND_STRUCTURE.md) — tab definition.
- Other dependencies depend on Home content (P-03-01).

## 11. PENDING DISCUSSION

Full wording in [`00_USER_APP_REVIEW_LIST.md` §4](00_USER_APP_REVIEW_LIST.md#4-pending-discussion-register).

**Owned by this module**

| ID | Topic |
|----|-------|
| P-03-01 | Home sections and content |
| P-03-02 | Personalisation |
| P-03-03 | Promotions or banners |

**Related (owned elsewhere)**

| ID | Topic |
|----|-------|
| P-01-11 | Default tab after login and launch |

## 12. Acceptance criteria

- [ ] Home is reachable from the Home tab (D-01 → [01](01_NAVIGATION_AND_STRUCTURE.md)).

No other confirmed criteria yet.

## 13. Change log

| Date | Change |
|------|--------|
| 2026-11-17 | Initial draft created. |
