# CONTEXT.md — AstroConnect Shared Project Context

This file gives every contributor (human or Claude agent) the shared context
for AstroConnect. It contains only **confirmed** information. Anything not yet
decided is marked **`PENDING DISCUSSION`** and tracked in the relevant review
list.

This file holds **short definitions and topic titles only**. Confirmed
decisions are recorded verbatim in the decision register of each
application's review list; detailed rules live in the owning specification
file. Refer to the decision ID and owning file for the full rule.

Working rules for Claude agents are in [`CLAUDE.md`](CLAUDE.md).

---

## 1. Project overview

AstroConnect is a platform that connects **users** seeking astrology guidance
with **astrologers** who provide consultations and services.

This is a **fresh project**, built from scratch. Nothing is reused from the
old `astro-textbased` or `astro-platform-admin` projects.

## 2. Applications

| # | Application    | Audience                          | Code folder       | Documentation          |
|---|----------------|-----------------------------------|-------------------|------------------------|
| 1 | User App       | People seeking astrology services | `user/`           | `docs/01-user-app/`    |
| 2 | Astrologer App | Astrologers providing services    | `astrologer/`     | [`docs/02-astrologer-app/`](docs/02-astrologer-app/00_ASTROLOGER_APP_REVIEW_LIST.md) — **Draft** (see §7) |
| 3 | Platform Admin | Platform operators                | `platform-admin/` | Not started            |

User App and Astrologer App documentation are in progress (Draft). Platform
Admin documentation has not started; Astrologer App dependencies on it are
recorded as `PA-xx` items (§10).

## 3. Documentation map — User App

Status values are tracked in
[`docs/01-user-app/00_USER_APP_REVIEW_LIST.md`](docs/01-user-app/00_USER_APP_REVIEW_LIST.md).

| No. | File | Topic |
|-----|------|-------|
| 00 | [`00_USER_APP_REVIEW_LIST.md`](docs/01-user-app/00_USER_APP_REVIEW_LIST.md) | Review checklist, decisions, pending items |
| 01 | [`01_NAVIGATION_AND_STRUCTURE.md`](docs/01-user-app/01_NAVIGATION_AND_STRUCTURE.md) | Bottom navigation, Services vs Activity |
| 02 | [`02_AUTHENTICATION_AND_ONBOARDING.md`](docs/01-user-app/02_AUTHENTICATION_AND_ONBOARDING.md) | Authentication and onboarding |
| 03 | [`03_HOME.md`](docs/01-user-app/03_HOME.md) | Home |
| 04 | [`04_EXPLORE_AND_ASTROLOGER_DISCOVERY.md`](docs/01-user-app/04_EXPLORE_AND_ASTROLOGER_DISCOVERY.md) | Explore and astrologer discovery |
| 05 | [`05_ASTROLOGER_PROFILE.md`](docs/01-user-app/05_ASTROLOGER_PROFILE.md) | Astrologer profile |
| 06 | [`06_TEXT_QUESTION_SERVICE.md`](docs/01-user-app/06_TEXT_QUESTION_SERVICE.md) | Text-based Question service |
| 07 | [`07_APPOINTMENT_SERVICE.md`](docs/01-user-app/07_APPOINTMENT_SERVICE.md) | Appointment service |
| 08 | [`08_INSTANT_CALL.md`](docs/01-user-app/08_INSTANT_CALL.md) | Instant Call |
| 09 | [`09_INSTANT_CHAT.md`](docs/01-user-app/09_INSTANT_CHAT.md) | Instant Chat |
| 10 | [`10_WALLET_AND_PAYMENTS.md`](docs/01-user-app/10_WALLET_AND_PAYMENTS.md) | Wallet and payments |
| 11 | [`11_ACTIVITY_AND_SERVICE_HISTORY.md`](docs/01-user-app/11_ACTIVITY_AND_SERVICE_HISTORY.md) | Activity and service history |
| 12 | [`12_USER_PROFILE_AND_SETTINGS.md`](docs/01-user-app/12_USER_PROFILE_AND_SETTINGS.md) | User profile and settings |
| 13 | [`13_BIRTH_PROFILES_AND_KUNDLI.md`](docs/01-user-app/13_BIRTH_PROFILES_AND_KUNDLI.md) | Birth profiles and Kundli |
| 14 | [`14_FOLLOWING_AND_SUBSCRIPTIONS.md`](docs/01-user-app/14_FOLLOWING_AND_SUBSCRIPTIONS.md) | Following and subscriptions |
| 15 | [`15_NOTIFICATIONS.md`](docs/01-user-app/15_NOTIFICATIONS.md) | Notifications |
| 16 | [`16_REMEDY_TRACKER.md`](docs/01-user-app/16_REMEDY_TRACKER.md) | Remedy tracker |
| 17 | [`17_HELP_AND_SUPPORT.md`](docs/01-user-app/17_HELP_AND_SUPPORT.md) | Help and support |
| 18 | [`18_PENDING_DECISIONS_REPORT.md`](docs/01-user-app/18_PENDING_DECISIONS_REPORT.md) | Pending decisions report — consolidated report covering the 131 pending questions as of 2026-11-17, in 27 decision groups (snapshot reference, not a module specification) |

All module files are currently in **Draft** status.

## 4. Glossary

Short definitions only. For the rules, see the listed decision IDs in the
[decision register](docs/01-user-app/00_USER_APP_REVIEW_LIST.md#3-confirmed-decisions-register)
and the owning file. Open items are listed in the
[PENDING DISCUSSION register](docs/01-user-app/00_USER_APP_REVIEW_LIST.md#4-pending-discussion-register).

| Term | Definition | Rules (decision → owning file) |
|------|------------|--------------------------------|
| **Home** | One of the five User App bottom-navigation tabs. Contents: `PENDING DISCUSSION` (P-03-01). | D-01 → 01 |
| **Explore** | Bottom-navigation tab for astrologer discovery. Exact scope: `PENDING DISCUSSION` (P-01-08). | D-01 → 01; details → 04 |
| **Services** (tab) | Bottom-navigation tab for new services. | D-02 → 01 |
| **Activity** (tab) | Bottom-navigation tab for services already purchased or used. | D-03 → 01; details → 11 |
| **Profile** (tab) | One of the five bottom-navigation tabs. Contents: `PENDING DISCUSSION` (P-12-04). | D-01 → 01; details → 12 |
| **Text Question** | A service in which the user asks an astrologer a written question and receives an answer. | D-04 – D-08, D-17 – D-28 → 06 |
| **Appointment** | A voice-only consultation booked in advance for a specific date and time. | D-09, D-10, D-30, D-40 – D-43 → 07 |
| **Instant Call** | A call started immediately with an available astrologer, without prior booking, paid as a prepaid package. | D-09, D-10, D-44 – D-46 → 08 |
| **Instant Chat** | A chat started immediately with an available astrologer, without prior booking, paid as a prepaid package; messages visible for 24 hours. | D-09, D-10, D-44 – D-47 → 09 |
| **Subscribe / Subscription** | A paid subscription to an astrologer; subscribing automatically follows. Benefit questions: Silver 1, Gold 3, Platinum 4 (D-31). Price, duration, renewal, and cancellation: on hold (P-14-02 – P-14-05). | D-04 → 06; D-31, D-36 → 14 |
| **Follow** | Free action to follow an astrologer; never subscribes automatically. | D-36 → 14 |
| **Campaign** | An astrologer's active offering from which users purchase question slots. User-facing content: D-20; per-user purchase limit: `PENDING DISCUSSION` (P-06-13; owning file [`06_TEXT_QUESTION_SERVICE.md`](docs/01-user-app/06_TEXT_QUESTION_SERVICE.md)). | D-05 → 06 |
| **Question slot** | A purchased entitlement used to ask an astrologer a Text Question. | D-05, D-06, D-07 → 06 |
| **Dispute** | A Text Question request for an additional answer from the astrologer. | D-08, D-19 → 06; D-09 → 07, 08, 09 |
| **Review** | Feedback after a consultation or a Text Question answer: mandatory 1–5 rating, optional written feedback. | D-10 → 07, 08, 09; D-17 → 06; D-49 → 05 |
| **Remedy** | A remedy prescribed or attached by an astrologer in a service. | D-11, D-29 → 16 |
| **Remedy Tracker** | The User App area where the user's remedies appear. | D-11 → 16 |
| **Birth profile** | A saved set of birth details. Fields: `PENDING DISCUSSION` (P-13-01). | D-12 → 13 |
| **Kundli** | A birth chart generated from a birth profile's birth details. | D-14 → 13 |
| **Uploaded birth chart** | A birth-chart file uploaded by the user. | D-13, D-14 → 13 |
| **Wallet** | The User App wallet. All refunds go to the Wallet; withdrawals keep a ₹500 minimum balance. Other details: `PENDING DISCUSSION`. | D-32, D-33 → 10 |
| **Critical notification** | A notification in a category designated as critical. | D-15 → 15 |
| **Notification channel** | A delivery route for notifications. | D-16 → 15 |

## 5. Confirmed decisions index

Topic titles only. The verbatim decision is in the
[decision register](docs/01-user-app/00_USER_APP_REVIEW_LIST.md#3-confirmed-decisions-register);
detailed rules are in the owning file.

| ID | Topic | Owning file |
|----|-------|-------------|
| D-01 | Bottom navigation tabs | 01 |
| D-02 | Purpose of the Services tab | 01 |
| D-03 | Purpose of the Activity tab | 01 |
| D-04 | Subscription prerequisite for Text Questions | 06 |
| D-05 | Purchasing question slots from campaigns | 06 |
| D-06 | Using or holding a question slot | 06 |
| D-07 | Question slot expiry | 06 |
| D-08 | Text Question dispute | 06 |
| D-09 | Services without a dispute option | 07, 08, 09 |
| D-10 | Mandatory rating after consultations | 07, 08, 09 |
| D-11 | Remedies in the Remedy Tracker | 16 |
| D-12 | Number of birth profiles | 13 |
| D-13 | Birth-chart upload formats | 13 |
| D-14 | Kundli update when birth details change | 13 |
| D-15 | Critical notifications | 15 |
| D-16 | Notification channels | 15 |
| D-17 | Text Question mandatory rating and review | 06 |
| D-18 | Text Question 30-day answer deadline | 06 |
| D-19 | Dispute limits, 3-day dispute answer, Admin Review | 06 |
| D-20 | Campaigns and pricing shown to users; mandatory Special Campaign label | 06 |
| D-21 | Campaign changes protect purchases; refund on cancellation | 06 |
| D-22 | User question length and attachments | 06 |
| D-23 | Answer format and length | 06 |
| D-24 | No manual cancellation of a submitted question | 06 |
| D-25 | Text Question statuses shown to users | 06 |
| D-26 | Expiry warning and reminders | 06 |
| D-27 | Platform Complaint | 06 |
| D-28 | IST calendar-day counting | 06 |
| D-29 | Remedy completion by the user | 16 |
| D-30 | Astrologer DND: confirmed appointments remain valid | 07 |
| D-31 | Subscription benefit questions | 14 |
| D-32 | Refunds to Wallet; withdrawals | 10 |
| D-33 | Payment methods | 10 |
| D-34 | Question Preview; no editing after submission | 06 |
| D-35 | Question attachments | 06 |
| D-36 | Follow and Subscribe | 14 |
| D-37 | Consent for sharing birth data | 13 |
| D-38 | Astrologer DND (user view) | 05 |
| D-39 | Text-Based Questions service suspension (user view) | 06 |
| D-40 | Appointment definition and booking | 07 |
| D-41 | Appointment cancellation, rescheduling, no-shows, date closure | 07 |
| D-42 | Joining an appointment; technical problems | 07 |
| D-43 | Appointment reminders | 07 |
| D-44 | Instant Call and Chat requests | 08, 09 |
| D-45 | Prepaid packages and sessions | 08, 09 |
| D-46 | Instant Call and Chat technical failure | 08, 09 |
| D-47 | Chat history (24-hour rule) | 09 |
| D-48 | Astrologer profile content (user view) | 05 |
| D-49 | Review visibility | 05 |
| D-50 | Live Sessions and posts (user view) | 14 |
| D-51 | Remedy Tracker links to the originating appointment | 16 |

## 6. Pending global questions

Cross-cutting questions (languages, platforms, privacy, accessibility, offline
behaviour) are tracked as `P-GL-xx` in
[`00_USER_APP_REVIEW_LIST.md` §4](docs/01-user-app/00_USER_APP_REVIEW_LIST.md#4-pending-discussion-register).

## 7. Documentation map — Astrologer App

**Documentation status: Draft.** Status values, confirmed decisions
(AD-01 – AD-164), open questions, cross-app conflicts, and Platform Admin
dependencies are tracked in
[`docs/02-astrologer-app/00_ASTROLOGER_APP_REVIEW_LIST.md`](docs/02-astrologer-app/00_ASTROLOGER_APP_REVIEW_LIST.md).

| No. | File | Topic | Owned decisions |
|-----|------|-------|-----------------|
| 00 | [`00_ASTROLOGER_APP_REVIEW_LIST.md`](docs/02-astrologer-app/00_ASTROLOGER_APP_REVIEW_LIST.md) | Review list: decision register (AD-xx), open questions (AP-xx-yy), cross-app conflicts (X-xx), Platform Admin dependencies (PA-xx), rejected proposals, review log | — |
| 01 | [`01_HOME_SCREEN.md`](docs/02-astrologer-app/01_HOME_SCREEN.md) | Home Screen, availability, DND / Planned Unavailability | AD-01 – AD-09, AD-12 – AD-23, AD-63 – AD-68, AD-164 |
| 02 | [`02_TEXT_BASED_QUESTIONS.md`](docs/02-astrologer-app/02_TEXT_BASED_QUESTIONS.md) | Text-Based Questions, campaigns, quota, disputes, settlement | AD-10, AD-11, AD-24 – AD-62, AD-69 – AD-74 |
| 03 | [`03_GLOBAL_NAVIGATION.md`](docs/02-astrologer-app/03_GLOBAL_NAVIGATION.md) | Global navigation, record navigation, Back behaviour | AD-75 – AD-78 |
| 04 | [`04_PROFILE_AND_VERIFICATION.md`](docs/02-astrologer-app/04_PROFILE_AND_VERIFICATION.md) | Profile sections, verification, preview, approval | AD-79 – AD-87 |
| 05 | [`05_APPOINTMENTS.md`](docs/02-astrologer-app/05_APPOINTMENTS.md) | Appointments | AD-88 – AD-102 |
| 06 | [`06_INSTANT_CALL_AND_CHAT.md`](docs/02-astrologer-app/06_INSTANT_CALL_AND_CHAT.md) | Instant Call and Instant Chat | AD-103 – AD-111 |
| 07 | [`07_LIVE_SESSIONS.md`](docs/02-astrologer-app/07_LIVE_SESSIONS.md) | Live Sessions | AD-112 – AD-119 |
| 08 | [`08_WALLET_AND_EARNINGS.md`](docs/02-astrologer-app/08_WALLET_AND_EARNINGS.md) | Wallet, earnings, commission, withdrawal, settlement | AD-120 – AD-126 |
| 09 | [`09_OFFERS_AND_EARNINGS_CALCULATIONS.md`](docs/02-astrologer-app/09_OFFERS_AND_EARNINGS_CALCULATIONS.md) | Offer discounts, commission base, offer performance | AD-127, AD-128 |
| 10 | [`10_RATINGS_AND_REVIEWS.md`](docs/02-astrologer-app/10_RATINGS_AND_REVIEWS.md) | Ratings and reviews | AD-129 – AD-134 |
| 11 | [`11_AUDIENCE.md`](docs/02-astrologer-app/11_AUDIENCE.md) | Audience (All Users, Followers, Subscribers) | AD-135 – AD-137 |
| 12 | [`12_CONTENT_MANAGEMENT.md`](docs/02-astrologer-app/12_CONTENT_MANAGEMENT.md) | Content Management (posts, subscriber benefit content, templates) | AD-138 – AD-144 |
| 13 | [`13_ANALYTICS_AND_PERFORMANCE.md`](docs/02-astrologer-app/13_ANALYTICS_AND_PERFORMANCE.md) | Analytics and performance | AD-145 – AD-147 |
| 14 | [`14_NOTIFICATIONS_AND_REMINDERS.md`](docs/02-astrologer-app/14_NOTIFICATIONS_AND_REMINDERS.md) | Activity & Notification Centre | AD-148 – AD-151 |
| 15 | [`15_SETTINGS_AND_PREFERENCES.md`](docs/02-astrologer-app/15_SETTINGS_AND_PREFERENCES.md) | Settings and preferences | AD-152 – AD-157 |
| 16 | [`16_HELP_AND_SUPPORT.md`](docs/02-astrologer-app/16_HELP_AND_SUPPORT.md) | Help and support, tickets, dispute separation | AD-158 – AD-162 |
| 17 | [`17_REMEDY_TRACKER.md`](docs/02-astrologer-app/17_REMEDY_TRACKER.md) | Remedy Tracker (appointment records) | AD-163 |
| 18 | [`18_PENDING_DECISIONS_REPORT.md`](docs/02-astrologer-app/18_PENDING_DECISIONS_REPORT.md) | Pending decisions report (snapshot 2026-11-20; not a module specification) | — |

**Current progress**
- Files `01` – `17`: drafted and validated; awaiting Product Owner approval;
  none is approved or implementation-ready.
- Astrologer App UI implementation: **not started**.

## 8. Astrologer App glossary

Short definitions only; rules are in the listed decisions and owning files.

| Term | Definition | Rules (decision → owning file) |
|------|------------|--------------------------------|
| **My Work** | The astrologer's main work-management page. | AD-46 → 02; AD-75 → 03 |
| **DND / Planned Unavailability** | One feature: the astrologer is unavailable for new services and the profile is invisible to all users; confirmed appointments remain valid. | AD-07, AD-09, AD-74, AD-164 → 01 |
| **Offline** | Not accepting Instant Call/Chat; Text Questions and Appointments can still arrive. | AD-05, AD-164 → 01 |
| **Availability lock** | One atomic lock allowing one pending request or active consultation across Instant Call and Instant Chat. | AD-105 → 06 |
| **Date closure** | Closing an appointment date; affected Users choose reschedule or full Wallet refund. | AD-94 → 05 |
| **Prepaid package** | Fixed-duration, fully prepaid Instant Call/Chat session (minimum 5 minutes). | AD-106 → 06 |
| **Live Session** | Free live broadcast, one per calendar month, for a selected audience. | AD-112 – AD-119 → 07 |
| **Held / Pending / Available Balance** | Wallet balances; Held = services not yet completed; Pending: definition missing (AP-08-01). | AD-120, AD-126 → 08 |
| **Settlement run** | Twice-weekly (Tuesday, Friday) release of eligible earnings. | AD-126 → 08 |
| **Audience** | One list of All Users, Followers, and Subscribers. | AD-135 → 11 |
| **Content Management** | Dedicated module for General Posts and Subscriber Benefit Content, opened by "Benefits & Content". | AD-138 → 12 |
| **12-Rasi template** | Default prediction template with the 12 zodiac signs and one input per sign. | AD-141 → 12 |
| **Activity & Notification Centre** | Notification centre with categories A – I. | AD-148 → 14 |

## 9. Astrologer App pending decisions

14 open questions (5 missing source information, 9 unresolved); the 3
recorded contradictions (AP-01-14, AP-02-25, AP-13-01) were resolved on
2026-11-20 — see
[`18_PENDING_DECISIONS_REPORT.md`](docs/02-astrologer-app/18_PENDING_DECISIONS_REPORT.md)
and the review list §4.

## 10. Cross-app dependencies

- **User App:** X-01 – X-25 in the Astrologer review list §5. Only X-14
  (subscription terms) is open, on hold. X-16 – X-20 and X-22 – X-25 were
  aligned on 2026-11-20: User App D-10, D-17, D-20, D-21, D-30 amended;
  D-40 – D-51 added (User App review list §7).
- **Platform Admin:** PA-01 – PA-11 in the Astrologer review list §5.2.

## 11. Change log

| Date | Change |
|------|--------|
| 2026-11-20 | Astrologer App documentation completed from the Master Decision Document: files 03 – 18 added; AD-75 – AD-164; AD-09, AD-31, AD-40 amended (rulings C1, C2, C4); X-16 – X-24 and PA-01 – PA-11 recorded; §7 – §11 updated. |
| 2026-11-20 | Contradiction rulings: AD-07, AD-26, AD-145 amended; AP-01-14, AP-02-25, AP-13-01 resolved. User App alignment (X-16 – X-25): D-10, D-17, D-20, D-21, D-30 amended; D-40 – D-51 added; §4, §5, §9, §10 updated. |
