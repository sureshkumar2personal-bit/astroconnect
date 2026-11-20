# 13 — Analytics and Performance

| Field | Value |
|-------|-------|
| Application | Astrologer App |
| Status | Draft |
| Owned decisions | AD-145 – AD-147 |
| Review list | [`00_ASTROLOGER_APP_REVIEW_LIST.md`](00_ASTROLOGER_APP_REVIEW_LIST.md) |
| Shared context | [`CONTEXT.md`](../../CONTEXT.md) |

> **Frontend UI phase.** This specification describes product behaviour. It
> does not define APIs, data structures, or backend logic. Items marked
> `PENDING DISCUSSION` must not be implemented as if decided.

---

## 1. Purpose

Defines a simple Analytics and Performance dashboard: the metrics per area,
filters, comparisons, and the data-correctness rules that keep analytics
consistent with each module and with Wallet.

## 2. Scope / Out of scope

**In scope**
- Metrics for profile, Text Questions, Appointments, Instant Call and Chat, Live, Content.
- Growth and trend graphs; service-wise earnings overview.
- Filters, previous-period comparison, drill-down to service details.

**Out of scope**
- Detailed financial transactions → [08](08_WALLET_AND_EARNINGS.md).
- Home Peak Demand Hours and earnings comparisons → [01](01_HOME_SCREEN.md) (AD-15, AD-16).
- Monthly answer target and quota performance → [02](02_TEXT_BASED_QUESTIONS.md) (AD-52, AD-70, AD-73).

## 3. Entry points

- Placement within the tabs: `PENDING DISCUSSION` (AP-GL-02).

## 4. Confirmed decisions

**Owned by this module** (verbatim from the decision register)

| ID | Decision |
|----|----------|
| AD-145 | **Analytics metrics (kept simple):** Profile Performance — Profile Views, Followers Growth, Subscribers Growth. Text Questions — Received, Answered/Completed, Pending ("Answered" and "Completed" are one metric for the same completed question, AD-51, and are never counted twice). Appointments — Bookings, Completed, Cancelled, Missed. Instant Call and Chat — Requests, Accepted, Declined, Completed Sessions, Usage. Live — Live Sessions, Participants, Comments. Content — post-wise Views, Likes, Comments, Audience Type, Engagement. Growth and Trends — daily, weekly, and monthly graphs. Earnings Summary — service-wise earnings overview only; detailed financial transactions remain in Wallet. No unnecessary features are added. *(Amended 2026-11-20 (AP-13-01): supersedes "Received, Answered, Pending, Completed".)* |
| AD-146 | **Analytics display and filters:** an overall dashboard with KPI cards and graphs; Daily/Weekly/Monthly/Custom Date Range filters; clicking a service opens its details; Previous Period Comparison. |
| AD-147 | **Analytics data correctness:** analytics use the correct source data, do not conflate statuses, never count the same event twice, and keep calculations consistent with the relevant module and Wallet. |

**Referenced decisions**

| ID | Topic | Owning file |
|----|-------|-------------|
| AD-15 | Home earnings comparisons | [01](01_HOME_SCREEN.md) |
| AD-16 | Peak Demand Hours | [01](01_HOME_SCREEN.md) |
| AD-51 | Text Question status lifecycle | [02](02_TEXT_BASED_QUESTIONS.md) |
| AD-52 | Monthly minimum answer target | [02](02_TEXT_BASED_QUESTIONS.md) |
| AD-89 | Appointment statuses | [05](05_APPOINTMENTS.md) |
| AD-104 | Instant Call/Chat request states | [06](06_INSTANT_CALL_AND_CHAT.md) |
| AD-119 | Post-Live summary | [07](07_LIVE_SESSIONS.md) |
| AD-121 | Service-wise earnings | [08](08_WALLET_AND_EARNINGS.md) |
| AD-139 | General Posts engagement | [12](12_CONTENT_MANAGEMENT.md) |

## 5. User flows

1. The astrologer opens Analytics; the overall dashboard shows KPI cards and graphs (AD-146).
2. The astrologer selects Daily, Weekly, Monthly, or a Custom Date Range (AD-146).
3. Each KPI shows a Previous Period Comparison (AD-146).
4. Tapping a service opens its analytics details (AD-146).
5. For financial detail, the astrologer goes to Wallet (AD-145 → [08](08_WALLET_AND_EARNINGS.md)).

## 6. Screens and content

| Area | Metrics (AD-145) | Source data |
|------|------------------|-------------|
| Profile Performance | Profile Views; Followers Growth; Subscribers Growth | Profile, Audience ([04](04_PROFILE_AND_VERIFICATION.md), [11](11_AUDIENCE.md)) |
| Text Questions | Received; Answered/Completed (one metric); Pending | [02](02_TEXT_BASED_QUESTIONS.md) (AD-51) |
| Appointments | Bookings; Completed; Cancelled; Missed | [05](05_APPOINTMENTS.md) (AD-89) |
| Instant Call and Chat | Requests; Accepted; Declined; Completed Sessions; Usage | [06](06_INSTANT_CALL_AND_CHAT.md) (AD-104) |
| Live | Live Sessions; Participants; Comments | [07](07_LIVE_SESSIONS.md) (AD-119) |
| Content | Post-wise Views; Likes; Comments; Audience Type; Engagement | [12](12_CONTENT_MANAGEMENT.md) (AD-139) |
| Growth and Trends | Daily, weekly, and monthly graphs | All of the above |
| Earnings Summary | Service-wise earnings overview only | [08](08_WALLET_AND_EARNINGS.md) (AD-121) |

The calculation of "Usage" and "Engagement" is not defined in the Master
Decision Document and is not invented.

## 7. Business rules and validations

| # | Rule | Source |
|---|------|--------|
| ANL-01 | Analytics stays simple; no metrics beyond AD-145 are added. | AD-145 |
| ANL-02 | Earnings in Analytics are an overview only; transactions stay in Wallet. | AD-145 |
| ANL-03 | Filters: Daily, Weekly, Monthly, Custom Date Range; Previous Period Comparison on every view. | AD-146 |
| ANL-04 | Each metric comes from its owning module's data; statuses are never conflated. | AD-147 |
| ANL-05 | An event is counted once only. | AD-147 |
| ANL-06 | Analytics figures equal the owning module's and Wallet's figures for the same period. | AD-147 |
| ANL-07 | Calendar-day periods use IST (AD-71 → [02](02_TEXT_BASED_QUESTIONS.md)). | AD-71 |

## 8. States and edge cases

| Case | Behaviour |
|------|-----------|
| No data for the period | Zero values; empty-state wording not defined |
| A Text Question is answered | Counted once in Answered/Completed, never twice (AD-145, AD-147) |
| Custom range spanning months | Same rules; IST calendar days (AD-71) |

## 9. Notifications triggered

None.

## 10. Dependencies on other modules

- [01](01_HOME_SCREEN.md), [02](02_TEXT_BASED_QUESTIONS.md), [04](04_PROFILE_AND_VERIFICATION.md) – [08](08_WALLET_AND_EARNINGS.md), [11](11_AUDIENCE.md), [12](12_CONTENT_MANAGEMENT.md) — source data.
- **User App:** none.
- **Platform Admin:** none confirmed.

## 11. PENDING DISCUSSION

Full wording in [`00_ASTROLOGER_APP_REVIEW_LIST.md` §4](00_ASTROLOGER_APP_REVIEW_LIST.md#4-open-questions-register).

**Owned by this module:** none open.

**Resolved** (kept in the review list)

| ID | Topic | Status |
|----|-------|--------|
| AP-13-01 | Answered/Completed is one metric (AD-145 amended 2026-11-20) | Resolved |

**Related**

| ID | Topic | Status |
|----|-------|--------|
| AP-GL-02 | Placement of Analytics within the tabs | Open — missing source information |

## 12. Acceptance criteria

- [ ] The dashboard shows exactly the metric groups of AD-145, with KPI cards and graphs.
- [ ] Daily/Weekly/Monthly/Custom filters, previous-period comparison, and service drill-down work (AD-146).
- [ ] Every figure matches its owning module and Wallet; no event is counted twice; statuses are not conflated (AD-147).

## 13. Change log

| Date | Change |
|------|--------|
| 2026-11-20 | Initial draft created from the Master Decision Document: AD-145 – AD-147. AP-13-01 added. |
| 2026-11-20 | AD-145 re-quoted (amended — Received, Answered/Completed, Pending); AP-13-01 Resolved. |
