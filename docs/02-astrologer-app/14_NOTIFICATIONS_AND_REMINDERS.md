# 14 — Notifications and Reminders

| Field | Value |
|-------|-------|
| Application | Astrologer App |
| Status | Draft |
| Owned decisions | AD-148 – AD-151 |
| Review list | [`00_ASTROLOGER_APP_REVIEW_LIST.md`](00_ASTROLOGER_APP_REVIEW_LIST.md) |
| Shared context | [`CONTEXT.md`](../../CONTEXT.md) |

> **Frontend UI phase.** This specification describes product behaviour. It
> does not define APIs, data structures, or backend logic. Items marked
> `PENDING DISCUSSION` must not be implemented as if decided.

---

## 1. Purpose

Defines the Activity & Notification Centre: notification categories and
events, centre features, notification preferences, and the separation
between service availability and notification preferences.

## 2. Scope / Out of scope

**In scope**
- Categories A–I and their events.
- Read/Unread, filters, history, unread count, deep links, push, security alerts.
- Preference rule and mandatory security alerts.
- Availability vs notifications.

**Out of scope**
- Timing of service-specific reminders → owning modules: Text Question disputes AD-68 ([01](01_HOME_SCREEN.md)); Appointments AD-100 ([05](05_APPOINTMENTS.md)); Live AD-118 ([07](07_LIVE_SESSIONS.md)); appointment attachment reminders AD-102 ([05](05_APPOINTMENTS.md)).
- The Settings screen for preferences → [15](15_SETTINGS_AND_PREFERENCES.md) (AD-153).
- Recent Activity on Home → AD-20 ([01](01_HOME_SCREEN.md)).

## 3. Entry points

- Notification bell (AD-66 → [01](01_HOME_SCREEN.md); AD-75 → [03](03_GLOBAL_NAVIGATION.md)).
- Push notifications for important alerts (AD-149).

## 4. Confirmed decisions

**Owned by this module** (verbatim from the decision register)

| ID | Decision |
|----|----------|
| AD-148 | **Activity & Notification Centre categories:** a complete Activity & Notification Centre (not just a reminder page) with these categories and events — **A. New Activity and Customer Updates:** New Follower; New Subscriber; New Subscription/Renewal; Subscription Expired/Cancelled; New user interaction. **B. Text Questions:** New Question Received; Question Accepted/Opened; Answer Pending Reminder; Answer Submitted/Completed; New Dispute/Clarification Request; Dispute Response Required. **C. Appointments:** New Booking; Confirmed; Upcoming Reminder; Cancelled/Rescheduled; Completed; Missed. **D. Instant Call and Chat:** New Call/Chat Request; Accepted; Declined; Expired; Consultation Started/Completed; Package Expiry/Extension Reminder; Technical Disconnection/Reconnection. **E. Content:** Post Published; Scheduled Post Reminder; Content Delivery Success/Missed; New Likes/Comments; Subscriber Content Updates. **F. Live:** Live Scheduled; Live Reminders; Live Started; Live Ended/Interrupted. **G. Wallet and Earnings:** New Earnings; Commission/Offer Discount Details; Settlement Released; Withdrawal Requested; Withdrawal Processing; Withdrawal Paid; Withdrawal Failed; Monthly Statement Available. **H. Account and Security:** New Login; New Device Login; Password Changed; Email/Mobile Changed; Profile Updated; KYC Submitted/Approved/Rejected; Bank Account/UPI Added/Changed; Important Security Alerts. **I. Platform and Support:** Admin Announcements; Support Ticket Updates; Platform Replies; Ticket Resolved/Closed; Policy/App Updates. |
| AD-149 | **Notification Centre features:** Read/Unread; date and time; category filters; notification history; unread count; navigation to the exact related detail page; push notifications for important alerts; security alerts clearly identified. Duplicate notifications for the same event are avoided. |
| AD-150 | **Notification preferences rule:** Settings provides category-wise and event-specific On/Off preferences. Important security alerts are mandatory and cannot be disabled. |
| AD-151 | **Availability vs notifications:** Service Availability determines whether the astrologer accepts new work; Notification Preferences determine whether the astrologer receives optional notifications. Turning off notifications never changes service availability, and turning a service Offline never automatically changes notification preferences. |

**Referenced decisions**

| ID | Topic | Owning file |
|----|-------|-------------|
| AD-06 | Instant Call/Chat switches (availability) | [01](01_HOME_SCREEN.md) |
| AD-20 | Recent Activity | [01](01_HOME_SCREEN.md) |
| AD-66 | Notification bell and notification types | [01](01_HOME_SCREEN.md) |
| AD-68 | Dispute notification and reminder | [01](01_HOME_SCREEN.md) |
| AD-76 | Record navigation and deep links | [03](03_GLOBAL_NAVIGATION.md) |
| AD-100 | Appointment reminders | [05](05_APPOINTMENTS.md) |
| AD-118 | Live notifications | [07](07_LIVE_SESSIONS.md) |
| AD-133 | Notification on Admin review/reply action | [10](10_RATINGS_AND_REVIEWS.md) |
| AD-153 | Notification Preferences screen in Settings | [15](15_SETTINGS_AND_PREFERENCES.md) |

## 5. User flows

### 5.1 Read a notification
1. The astrologer opens the Notification Centre from the bell.
2. Unread notifications are marked; the unread count is shown (AD-149).
3. The astrologer filters by category (AD-149).
4. Tapping a notification opens the exact related detail page (AD-149, AD-76) and marks it Read.
5. Back returns to the centre with the same filter (AD-77 → [03](03_GLOBAL_NAVIGATION.md)).

### 5.2 Change preferences
1. The astrologer opens Settings → Notification Preferences (AD-153).
2. The astrologer turns categories or individual events On or Off (AD-150).
3. Important security alerts cannot be turned off (AD-150).
4. Service availability is not changed (AD-151).

## 6. Screens and content

### 6.1 Categories and events (AD-148)

| Category | Events | Detail owner |
|----------|--------|--------------|
| A. New Activity and Customer Updates | New Follower; New Subscriber; New Subscription/Renewal; Subscription Expired/Cancelled; New user interaction | [11](11_AUDIENCE.md) |
| B. Text Questions | New Question Received; Question Accepted/Opened; Answer Pending Reminder; Answer Submitted/Completed; New Dispute/Clarification Request; Dispute Response Required | [02](02_TEXT_BASED_QUESTIONS.md) |
| C. Appointments | New Booking; Confirmed; Upcoming Reminder; Cancelled/Rescheduled; Completed; Missed | [05](05_APPOINTMENTS.md) |
| D. Instant Call and Chat | New Call/Chat Request; Accepted; Declined; Expired; Consultation Started/Completed; Package Expiry/Extension Reminder; Technical Disconnection/Reconnection | [06](06_INSTANT_CALL_AND_CHAT.md) |
| E. Content | Post Published; Scheduled Post Reminder; Content Delivery Success/Missed; New Likes/Comments; Subscriber Content Updates | [12](12_CONTENT_MANAGEMENT.md) |
| F. Live | Live Scheduled; Live Reminders; Live Started; Live Ended/Interrupted | [07](07_LIVE_SESSIONS.md) |
| G. Wallet and Earnings | New Earnings; Commission/Offer Discount Details; Settlement Released; Withdrawal Requested; Withdrawal Processing; Withdrawal Paid; Withdrawal Failed; Monthly Statement Available | [08](08_WALLET_AND_EARNINGS.md) |
| H. Account and Security | New Login; New Device Login; Password Changed; Email/Mobile Changed; Profile Updated; KYC Submitted/Approved/Rejected; Bank Account/UPI Added/Changed; Important Security Alerts | [04](04_PROFILE_AND_VERIFICATION.md), [15](15_SETTINGS_AND_PREFERENCES.md) |
| I. Platform and Support | Admin Announcements; Support Ticket Updates; Platform Replies; Ticket Resolved/Closed; Policy/App Updates | [16](16_HELP_AND_SUPPORT.md) |

### 6.2 Notification Centre (AD-149)
Each item: category, title, date and time, Read/Unread. Controls: category
filters, history, unread count. Security alerts are visibly identified.

## 7. Business rules and validations

| # | Rule | Source |
|---|------|--------|
| NOT-01 | The centre covers categories A–I; it is not only a reminder page. | AD-148 |
| NOT-02 | Each notification opens the exact related detail page. | AD-149 |
| NOT-03 | Important alerts are also delivered as push notifications. | AD-149 |
| NOT-04 | The same event never produces duplicate notifications. | AD-149 |
| NOT-05 | Preferences exist per category and per event; important security alerts are mandatory. | AD-150 |
| NOT-06 | Turning notifications off never changes availability; going Offline never changes notification preferences. | AD-151 |

Which events count as "important alerts" for push, beyond Important Security
Alerts, is not listed in the Master Decision Document and is not invented.

## 8. States and edge cases

| Case | Behaviour |
|------|-----------|
| Notification opened | Becomes Read; unread count decreases (AD-149) |
| Same event triggered twice | One notification only (AD-149) |
| Category turned off | No optional notifications of that category; security alerts still delivered (AD-150) |
| Service switched Offline | Preferences unchanged (AD-151) |
| Notifications turned off | Instant Call/Chat switches unchanged (AD-151) |
| Linked record no longer has content (e.g. chat after 24 hours) | Detail page opens with the records that remain (AD-111 → [06](06_INSTANT_CALL_AND_CHAT.md)) |

## 9. Notifications triggered

This module delivers the notifications of AD-148; the triggering rules are in the owning modules (§6.1).

## 10. Dependencies on other modules

- All modules `01` – `17` (events; detail pages).
- [15](15_SETTINGS_AND_PREFERENCES.md) — preference screen.
- **User App:** User-side notifications for Appointments and Live are recorded in X-19 and X-22.
- **Platform Admin:** PA-10 (announcements, ticket replies).

## 11. PENDING DISCUSSION

Full wording in [`00_ASTROLOGER_APP_REVIEW_LIST.md` §4](00_ASTROLOGER_APP_REVIEW_LIST.md#4-open-questions-register).

**Owned by this module:** none.

## 12. Acceptance criteria

- [ ] All events of categories A–I are delivered in the Activity & Notification Centre (AD-148).
- [ ] Read/Unread, date/time, category filters, history, unread count, exact deep links, push for important alerts, identified security alerts; no duplicates (AD-149).
- [ ] Category and event preferences work; important security alerts cannot be disabled (AD-150).
- [ ] Availability and notification preferences never change each other (AD-151).

## 13. Change log

| Date | Change |
|------|--------|
| 2026-11-20 | Initial draft created from the Master Decision Document: AD-148 – AD-151. |
