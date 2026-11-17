# 01 — Navigation and Structure

| Field | Value |
|-------|-------|
| Application | User App |
| Status | Draft |
| Review list | [`00_USER_APP_REVIEW_LIST.md`](00_USER_APP_REVIEW_LIST.md) |
| Shared context | [`CONTEXT.md`](../../CONTEXT.md) |

---

## 1. Purpose

Defines the top-level navigation of the User App: the bottom navigation
tabs, what each tab is for, and where each User App module is reached from.

## 2. Scope

**In scope**
- The five bottom-navigation tabs.
- The distinction between **Services** and **Activity**.
- The placement of each module within the navigation.

**Out of scope**
- The content and behaviour of each module (see the module's own file).
- Visual design, icons, and styling (see P-01-12).

## 3. Entry points

The bottom navigation is visible at the top level of the User App.
Whether it is available before login: `PENDING DISCUSSION` (P-01-10).

## 4. Confirmed decisions

| ID | Decision |
|----|----------|
| D-01 | The User App bottom navigation is finalized as five tabs: **Home, Explore, Services, Activity, Profile**. |
| D-02 | **Services** is used to discover, start, and purchase **new** services. |
| D-03 | **Activity** is used to manage services **already purchased or used**. |

## 5. Bottom navigation tabs

| # | Tab | Purpose | Detailed specification |
|---|-----|---------|------------------------|
| 1 | **Home** | Contents: `PENDING DISCUSSION` (P-03-01) | [`03_HOME.md`](03_HOME.md) |
| 2 | **Explore** | Astrologer discovery. Exact scope: `PENDING DISCUSSION` (P-01-08) | [`04_EXPLORE_AND_ASTROLOGER_DISCOVERY.md`](04_EXPLORE_AND_ASTROLOGER_DISCOVERY.md) |
| 3 | **Services** | Discover, start, and purchase **new** services (D-02) | This file, §6 |
| 4 | **Activity** | Manage services **already purchased or used** (D-03) | [`11_ACTIVITY_AND_SERVICE_HISTORY.md`](11_ACTIVITY_AND_SERVICE_HISTORY.md) |
| 5 | **Profile** | Contents: `PENDING DISCUSSION` (P-12-04) | [`12_USER_PROFILE_AND_SETTINGS.md`](12_USER_PROFILE_AND_SETTINGS.md) |

- Default tab on launch/login: `PENDING DISCUSSION` (P-01-11).
- Tab icons, labels, and badges/counters: `PENDING DISCUSSION` (P-01-12).

## 6. Services vs Activity

These two tabs divide the user's journey into **before** and **after**
purchase or use.

| | **Services** | **Activity** |
|---|---|---|
| Purpose | Discover, start, and purchase **new** services | Manage services **already purchased or used** |
| Confirmed by | D-02 | D-03 |
| Typical question it answers | "What can I get, and how do I start?" | "What have I bought or used, and what is its status?" |

### Services covered by the User App

The User App documentation covers these services:

| Service | Specification |
|---------|---------------|
| Text-based Question | [`06_TEXT_QUESTION_SERVICE.md`](06_TEXT_QUESTION_SERVICE.md) |
| Appointment | [`07_APPOINTMENT_SERVICE.md`](07_APPOINTMENT_SERVICE.md) |
| Instant Call | [`08_INSTANT_CALL.md`](08_INSTANT_CALL.md) |
| Instant Chat | [`09_INSTANT_CHAT.md`](09_INSTANT_CHAT.md) |

- Exactly which services are listed under the Services tab, and their
  layout: `PENDING DISCUSSION` (P-01-07).
- Boundary between Explore (astrologer discovery) and Services (service
  discovery): `PENDING DISCUSSION` (P-01-08).
- Whether purchased-but-unused (held) question slots appear in Activity,
  Services, or both: `PENDING DISCUSSION` (P-01-09).

## 7. Module placement map

Where each User App module is reached from.

| No. | Module | Reached from | Status |
|-----|--------|--------------|--------|
| 02 | Authentication and onboarding | `PENDING DISCUSSION` — relationship to the main navigation depends on guest access | P-01-10, P-02-02 |
| 03 | Home | **Home** tab | Confirmed (D-01) |
| 04 | Explore and astrologer discovery | **Explore** tab | Confirmed (D-01) |
| 05 | Astrologer profile | `PENDING DISCUSSION` | P-01-13 |
| 06 | Text-based Question service | Start/purchase: **Services** (D-02). Manage: **Activity** (D-03) | Confirmed at tab level; details P-01-07, P-01-09 |
| 07 | Appointment service | Start/purchase: **Services** (D-02). Manage: **Activity** (D-03) | Confirmed at tab level; details P-01-07 |
| 08 | Instant Call | Start: **Services** (D-02). Manage/history: **Activity** (D-03) | Confirmed at tab level; details P-01-07 |
| 09 | Instant Chat | Start: **Services** (D-02). Manage/history: **Activity** (D-03) | Confirmed at tab level; details P-01-07 |
| 10 | Wallet and payments | `PENDING DISCUSSION` | P-01-01 |
| 11 | Activity and service history | **Activity** tab | Confirmed (D-01, D-03) |
| 12 | User profile and settings | **Profile** tab | Confirmed (D-01) |
| 13 | Birth profiles and Kundli | `PENDING DISCUSSION` | P-01-06 |
| 14 | Following and subscriptions | `PENDING DISCUSSION` | P-01-02 |
| 15 | Notifications | `PENDING DISCUSSION` | P-01-04 |
| 16 | Remedy tracker | `PENDING DISCUSSION` | P-01-03 |
| 17 | Help and support | `PENDING DISCUSSION` | P-01-05 |

## 8. Navigation rules

Only rules confirmed by D-01 to D-03 apply:

1. The bottom navigation contains exactly five tabs: Home, Explore, Services,
   Activity, Profile.
2. Starting or purchasing a **new** service begins from **Services**.
3. Managing a service that is **already purchased or used** happens in
   **Activity**.

All other navigation behaviour (back behaviour, deep links, guest access,
default tab, badges): `PENDING DISCUSSION`.

## 9. States and edge cases

`PENDING DISCUSSION` — depends on P-01-10 (logged-out navigation) and
P-01-11 (default tab).

## 10. Notifications triggered

None. Navigation does not trigger notifications. Whether tabs show
notification badges: `PENDING DISCUSSION` (P-01-12).

## 11. Dependencies

- Every module file (02–17) relies on the tab definitions in this file.
- `11_ACTIVITY_AND_SERVICE_HISTORY.md` relies on D-03.
- Service files 06–09 rely on D-02 and D-03.

## 12. PENDING DISCUSSION

Tracked in [`00_USER_APP_REVIEW_LIST.md` §4](00_USER_APP_REVIEW_LIST.md#01--navigation-and-structure).

| ID | Question |
|----|----------|
| P-01-01 | Where is the Wallet accessed from? |
| P-01-02 | Where are Following and Subscriptions accessed from? |
| P-01-03 | Where is the Remedy Tracker accessed from? |
| P-01-04 | Where are Notifications accessed from? |
| P-01-05 | Where is Help and Support accessed from? |
| P-01-06 | Where are Birth Profiles and Kundli accessed from? |
| P-01-07 | Exactly which services are listed under Services, and their layout. |
| P-01-08 | Boundary between Explore and Services. |
| P-01-09 | Where purchased-but-unused (held) question slots appear. |
| P-01-10 | Navigation available to a user who is not logged in. |
| P-01-11 | Default tab after login and app launch. |
| P-01-12 | Tab icons, labels, and badges/counters. |
| P-01-13 | From which screens is an Astrologer Profile opened? |

## 13. Acceptance criteria (confirmed rules only)

- [ ] The bottom navigation shows exactly five tabs: Home, Explore, Services, Activity, Profile (D-01).
- [ ] New services can be discovered, started, and purchased from the Services tab (D-02).
- [ ] Services already purchased or used are managed from the Activity tab (D-03).

## 14. Change log

| Date | Change |
|------|--------|
| 2026-11-17 | Initial draft created from confirmed decisions D-01 to D-03. |
| 2026-11-17 | Eight "planned" file labels replaced with links to the existing module files. No content change. |
