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

User App and Astrologer App documentation are in progress. Platform Admin
documentation has not started.

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
| 18 | [`18_PENDING_DECISIONS_REPORT.md`](docs/01-user-app/18_PENDING_DECISIONS_REPORT.md) | Pending decisions report — consolidated report covering all 131 pending questions in 27 decision groups (reference, not a module specification) |

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
| **Text Question** | A service in which the user asks an astrologer a written question and receives an answer. | D-04 – D-08 → 06 |
| **Appointment** | A User App consultation service. Definition: `PENDING DISCUSSION` (P-07-09). | D-09, D-10 → 07 |
| **Instant Call** | A User App consultation service. Definition: `PENDING DISCUSSION` (P-08-07). | D-09, D-10 → 08 |
| **Instant Chat** | A User App consultation service. Definition: `PENDING DISCUSSION` (P-09-07). | D-09, D-10 → 09 |
| **Subscribe / Subscription** | A user's subscription to an astrologer. Nature (free/paid, duration, renewal): `PENDING DISCUSSION` (P-14-02 – P-14-05). | D-04 → 06; details → 14 |
| **Follow** | Whether "Follow" is a separate action from "Subscribe": `PENDING DISCUSSION` (P-14-01). | → 14 |
| **Campaign** | An astrologer's active offering from which users purchase question slots. Definition: `PENDING DISCUSSION` (P-06-13; owning file [`06_TEXT_QUESTION_SERVICE.md`](docs/01-user-app/06_TEXT_QUESTION_SERVICE.md)). | D-05 → 06 |
| **Question slot** | A purchased entitlement used to ask an astrologer a Text Question. | D-05, D-06, D-07 → 06 |
| **Dispute** | A Text Question request for an additional answer from the astrologer. | D-08 → 06; D-09 → 07, 08, 09 |
| **Review** | Feedback a user submits after a consultation. For Text Questions: `PENDING DISCUSSION` (P-06-05). | D-10 → 07, 08, 09 |
| **Remedy** | A remedy prescribed or attached by an astrologer in a service. | D-11 → 16 |
| **Remedy Tracker** | The User App area where the user's remedies appear. | D-11 → 16 |
| **Birth profile** | A saved set of birth details. Fields: `PENDING DISCUSSION` (P-13-01). | D-12 → 13 |
| **Kundli** | A birth chart generated from a birth profile's birth details. | D-14 → 13 |
| **Uploaded birth chart** | A birth-chart file uploaded by the user. | D-13, D-14 → 13 |
| **Wallet** | The User App wallet used for payments. Details: `PENDING DISCUSSION` (P-10-01 – P-10-08). | → 10 |
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
| D-10 | Reviews after consultations | 07, 08, 09 |
| D-11 | Remedies in the Remedy Tracker | 16 |
| D-12 | Number of birth profiles | 13 |
| D-13 | Birth-chart upload formats | 13 |
| D-14 | Kundli update when birth details change | 13 |
| D-15 | Critical notifications | 15 |
| D-16 | Notification channels | 15 |

## 6. Pending global questions

Cross-cutting questions (languages, platforms, privacy, accessibility, offline
behaviour) are tracked as `P-GL-xx` in
[`00_USER_APP_REVIEW_LIST.md` §4](docs/01-user-app/00_USER_APP_REVIEW_LIST.md#4-pending-discussion-register).

## 7. Documentation map — Astrologer App

**Documentation status: Draft.** Status values, confirmed decisions, open
questions, and cross-app conflicts are tracked in
[`docs/02-astrologer-app/00_ASTROLOGER_APP_REVIEW_LIST.md`](docs/02-astrologer-app/00_ASTROLOGER_APP_REVIEW_LIST.md).

| No. | File | Topic |
|-----|------|-------|
| 00 | [`00_ASTROLOGER_APP_REVIEW_LIST.md`](docs/02-astrologer-app/00_ASTROLOGER_APP_REVIEW_LIST.md) | Review list: decision register (AD-xx), open questions (AP-xx-yy), cross-app conflicts with the User App (X-xx), rejected proposals, review log |
| 01 | [`01_HOME_SCREEN.md`](docs/02-astrologer-app/01_HOME_SCREEN.md) | Home Screen specification |
| 02 | [`02_TEXT_BASED_QUESTIONS.md`](docs/02-astrologer-app/02_TEXT_BASED_QUESTIONS.md) | Text-Based Questions specification |

**Current progress**
- Home Screen specification: drafted.
- Text-Based Questions specification: drafted.
- Both specifications passed documentation validation.
- Both are **awaiting Product Owner approval**; neither is approved or
  implementation-ready.
- Astrologer App UI implementation: **not started**.

Open questions and cross-app conflicts (including X-12) remain open and are
tracked only in the Astrologer App review list. They do not change any User
App decision.
