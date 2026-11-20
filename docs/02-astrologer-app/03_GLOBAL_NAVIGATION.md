# 03 — Global Navigation

| Field | Value |
|-------|-------|
| Application | Astrologer App |
| Status | Draft |
| Owned decisions | AD-75 – AD-78 |
| Review list | [`00_ASTROLOGER_APP_REVIEW_LIST.md`](00_ASTROLOGER_APP_REVIEW_LIST.md) |
| Shared context | [`CONTEXT.md`](../../CONTEXT.md) |

> **Frontend UI phase.** This specification describes product behaviour. It
> does not define APIs, data structures, or backend logic. Items marked
> `PENDING DISCUSSION` must not be implemented as if decided.

---

## 1. Purpose

Defines the navigation rules that apply to the whole Astrologer App: the
primary tabs, the main work page, notification access, record-level
navigation, deep links, and Back behaviour.

## 2. Scope / Out of scope

**In scope**
- Primary tab structure and the default screen (referenced from Home).
- My Work as the main work-management page.
- Notification bell availability.
- Navigation from every card, button, list row, history record, and action to the correct record.
- Back navigation and preserved list context (filters, search, sorting, selected tabs).

**Out of scope**
- Contents of each tab and page → the owning module files (`01` – `17`).
- Notification categories and centre features → [14](14_NOTIFICATIONS_AND_REMINDERS.md).
- Placement of Audience, Ratings & Reviews, Analytics, Content Management, Settings, Help & Support, and Remedy Tracker within the tabs → `PENDING DISCUSSION` (AP-GL-02).

## 3. Entry points

- App launch opens Home (AD-63 → [01](01_HOME_SCREEN.md)).
- The five primary tabs are always the top-level entry points (AD-03 → [01](01_HOME_SCREEN.md)).
- Notification bell (AD-66 → [01](01_HOME_SCREEN.md); AD-75).
- Deep links to individual records (AD-76).

## 4. Confirmed decisions

**Owned by this module** (verbatim from the decision register)

| ID | Decision |
|----|----------|
| AD-75 | **My Work and notification access:** My Work is the main work-management page. The notification bell must be available. (Five primary tabs: AD-03; app opens on Home: AD-63.) |
| AD-76 | **Record navigation:** every card, button, list row, history record, and action must open its corresponding detail page or record, using the correct record ID and deep link. No dead-end, broken, generic, or incorrect-record navigation is allowed. This applies throughout the entire app. |
| AD-77 | **Back navigation:** Back returns to the exact previous page and preserves the applicable filters, search, sorting, and selected tabs. |
| AD-78 | **Required record targets:** Text Question dispute → that exact question's Dispute Details; Appointment history row → that Appointment's Details; Call/Chat history row → that Consultation's Details; Wallet transaction → that Transaction's Details; Audience user → that exact User Profile; Review → that Review's Details; Content post → that post's Content Details/Edit page. |

**Referenced decisions**

| ID | Topic | Owning file |
|----|-------|-------------|
| AD-03 | Five primary tabs: Home, My Work, Live, Earnings, Profile | [01](01_HOME_SCREEN.md) |
| AD-14 | "Earnings/Wallet section" (Gross Revenue, Commission, Net Earnings; refunds in Wallet) | [01](01_HOME_SCREEN.md) |
| AD-20 | Recent Activity and the dedicated Recent Activity tab | [01](01_HOME_SCREEN.md) |
| AD-23 | Live, Earnings, and Profile are separate modules | [01](01_HOME_SCREEN.md) |
| AD-46 | My Work main page and Text Questions tabs | [02](02_TEXT_BASED_QUESTIONS.md) |
| AD-63 | App opens to the Home Dashboard | [01](01_HOME_SCREEN.md) |
| AD-66 | Notification bell opens Notifications | [01](01_HOME_SCREEN.md) |
| AD-149 | Notifications navigate to the exact related detail page | [14](14_NOTIFICATIONS_AND_REMINDERS.md) |

## 5. User flows

### 5.1 Open the app
1. The app opens on Home (AD-63).
2. The five primary tabs are shown (AD-03).

### 5.2 Open a record from a list
1. The astrologer taps a card, list row, history record, button, or action.
2. The app opens the corresponding detail page or record, identified by its record ID (AD-76), using the targets in §7.2 (AD-78).
3. If the record is opened from a deep link (for example from a notification, AD-149), the same detail page opens for the same record ID (AD-76).

### 5.3 Return with Back
1. The astrologer presses Back on a detail page.
2. The app returns to the exact previous page (AD-77).
3. The previous page restores the filters, search text, sorting, and selected tab that were applied before the record was opened (AD-77).

### 5.4 Open My Work
My Work is the main work-management page (AD-75). Its contents — Total Work, Text Questions, Appointments, and the Text Questions lifecycle tabs — are defined by AD-46 → [02](02_TEXT_BASED_QUESTIONS.md); Appointments → [05](05_APPOINTMENTS.md).

## 6. Screens and content

### 6.1 Primary tabs (AD-03)

| Tab | Main content | Owning file |
|-----|--------------|-------------|
| Home | Home Dashboard | [01](01_HOME_SCREEN.md) |
| My Work | Main work-management page (AD-75): Text Questions, Appointments | [02](02_TEXT_BASED_QUESTIONS.md), [05](05_APPOINTMENTS.md) |
| Live | Live Sessions | [07](07_LIVE_SESSIONS.md) |
| Earnings | Earnings/Wallet section (AD-14 wording) | [08](08_WALLET_AND_EARNINGS.md) |
| Profile | Profile and Verification | [04](04_PROFILE_AND_VERIFICATION.md) |

Placement of the remaining modules (Audience, Ratings & Reviews, Analytics,
Content Management, Settings, Help & Support, Remedy Tracker) within these
tabs is missing source information: `PENDING DISCUSSION` (AP-GL-02). Home Quick
Actions provide confirmed shortcuts to some of them (AD-21 → [01](01_HOME_SCREEN.md)).

### 6.2 Notification bell
Available as required by AD-75; it opens the Activity & Notification Centre (AD-66 → [01](01_HOME_SCREEN.md); centre → [14](14_NOTIFICATIONS_AND_REMINDERS.md)).

## 7. Business rules and validations

### 7.1 General rules
| # | Rule | Source |
|---|------|--------|
| NAV-01 | Every card, button, list row, history record, and action opens its corresponding detail page or record. | AD-76 |
| NAV-02 | Navigation always uses the correct record ID; a generic list page or a different record must never open instead. | AD-76 |
| NAV-03 | Deep links open the same detail page as in-app navigation for the same record ID. | AD-76 |
| NAV-04 | No dead-end page: every detail page offers Back to the exact previous page. | AD-76, AD-77 |
| NAV-05 | Back restores the previous page's filters, search, sorting, and selected tab. | AD-77 |
| NAV-06 | The rules apply to every module of the app. | AD-76 |

### 7.2 Required record targets (AD-78)

| Source | Target | Target owner |
|--------|--------|--------------|
| Text Question dispute | That exact question's Dispute Details | [02](02_TEXT_BASED_QUESTIONS.md) |
| Appointment history row | That Appointment's Details | [05](05_APPOINTMENTS.md) |
| Call/Chat history row | That Consultation's Details | [06](06_INSTANT_CALL_AND_CHAT.md) |
| Wallet transaction | That Transaction's Details | [08](08_WALLET_AND_EARNINGS.md) |
| Audience user | That exact User Profile | [11](11_AUDIENCE.md) |
| Review | That Review's Details | [10](10_RATINGS_AND_REVIEWS.md) |
| Content post | That post's Content Details/Edit page | [12](12_CONTENT_MANAGEMENT.md) |
| Notification | Exact related detail page (AD-149) | [14](14_NOTIFICATIONS_AND_REMINDERS.md) |
| Remedy/report | Original Appointment/Consultation (AD-163) | [17](17_REMEDY_TRACKER.md) |

## 8. States and edge cases

| Case | Behaviour |
|------|-----------|
| Record opened from a filtered or searched list | Back restores the same filter, search, sort, and tab (AD-77) |
| Record opened from a notification | Exact related detail page opens (AD-149); Back returns to the Notification Centre with its filters (AD-77) |
| Record opened from a deep link outside the app | Same record's detail page (AD-76) |
| Text Question dispute tapped in any list | That question's Dispute Details, never a generic dispute list (AD-78) |
| Chat history after 24 hours | Consultation Details still open; messages are not available (AD-111 → [06](06_INSTANT_CALL_AND_CHAT.md)) |
| Profile hidden during DND | Navigation inside the Astrologer App is unaffected; visibility rules → AD-74 ([01](01_HOME_SCREEN.md)) |

## 9. Notifications triggered

None. Notification navigation is defined in AD-149 → [14](14_NOTIFICATIONS_AND_REMINDERS.md).

## 10. Dependencies on other modules

- [01](01_HOME_SCREEN.md) — tabs (AD-03), default screen (AD-63), notification bell (AD-66), Quick Actions (AD-21).
- [02](02_TEXT_BASED_QUESTIONS.md) — My Work and Dispute Details (AD-46).
- [04](04_PROFILE_AND_VERIFICATION.md) – [17](17_REMEDY_TRACKER.md) — record targets (§7.2).
- User App: none.
- Platform Admin: none.

## 11. PENDING DISCUSSION

Full wording in [`00_ASTROLOGER_APP_REVIEW_LIST.md` §4](00_ASTROLOGER_APP_REVIEW_LIST.md#4-open-questions-register).

**Owned by this module:** none.

**Related**

| ID | Topic | Status |
|----|-------|--------|
| AP-GL-02 | Placement of Audience, Reviews, Analytics, Content, Settings, Help, Remedy Tracker within the five tabs; exact Wallet placement | Open — missing source information |

## 12. Acceptance criteria

- [ ] My Work is the main work-management page and the notification bell is available (AD-75).
- [ ] Every card, button, list row, history record, and action opens its own detail page or record by record ID; no dead-end, broken, generic, or wrong-record navigation (AD-76).
- [ ] Deep links open the correct record (AD-76).
- [ ] Back returns to the exact previous page with filters, search, sorting, and selected tab preserved (AD-77).
- [ ] Each source in §7.2 opens its required target (AD-78).

## 13. Change log

| Date | Change |
|------|--------|
| 2026-11-20 | Initial draft created from the Master Decision Document: AD-75 – AD-78. AP-GL-02 referenced. |
