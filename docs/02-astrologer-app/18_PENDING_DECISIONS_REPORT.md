# 18 — Astrologer App Pending Decisions Report

| Field | Value |
|-------|-------|
| Application | Astrologer App |
| Status | Draft / Reference (snapshot) |
| Snapshot date | 2026-11-20 |
| Review list | [`00_ASTROLOGER_APP_REVIEW_LIST.md`](00_ASTROLOGER_APP_REVIEW_LIST.md) |
| Shared context | [`CONTEXT.md`](../../CONTEXT.md) |

This is a **snapshot report**, not a module specification. The review list
is the source of truth for every ID and status; if they differ, the review
list wins. Nothing in this report is a decision.

---

## 1. Summary

| Group | Count | IDs |
|-------|-------|-----|
| A. Missing source information (reported as finalized; not in any repository source) | 5 | AP-GL-02, AP-05-01, AP-08-01, AP-08-02, AP-08-03 |
| B. Genuinely unresolved questions | 9 | AP-01-15, AP-02-24, AP-04-01, AP-04-02, AP-06-01, AP-10-01, AP-15-01, AP-16-01, AP-16-02 |
| C. Contradictions — resolved 2026-11-20 | 3 | AP-01-14, AP-02-25, AP-13-01 (Resolved) |
| D. Cross-app items open (User App) | 1 | X-14 (on hold) |
| E. Platform Admin dependencies | 11 | PA-01 – PA-11 |

Open AP questions in total: **14** (A + B). Resolved AP questions kept:
AP-01-03, AP-01-05, AP-01-14, AP-02-25, AP-13-01.

## 2. A — Missing source information

The product owner reports these as finalized, but the exact value or text is
not present in the repository. They stay Open until the text is supplied.

| ID | Item | Module |
|----|------|--------|
| AP-GL-02 | Placement of Audience, Ratings & Reviews, Analytics, Content Management, Settings, Help & Support, Remedy Tracker within the five tabs; exact Wallet placement inside Earnings (M5) | [03](03_GLOBAL_NAVIGATION.md) |
| AP-05-01 | User late-cancellation percentage and calculation; also used for User no-shows (M1). The 12-hour policy itself is recorded in AD-99. | [05](05_APPOINTMENTS.md) |
| AP-08-01 | Definition of Pending Balance (M4) | [08](08_WALLET_AND_EARNINGS.md) |
| AP-08-02 | Text Questions commission rate (M2) | [08](08_WALLET_AND_EARNINGS.md) |
| AP-08-03 | Instant Call / Instant Chat settlement eligibility period (M3); Text Questions 7 days and Appointments 3 days are recorded in AD-126 | [08](08_WALLET_AND_EARNINGS.md) |

## 3. B — Genuinely unresolved

| ID | Question | Module |
|----|----------|--------|
| AP-01-15 | Planned Unavailability limits (maximum duration, notice period) | [01](01_HOME_SCREEN.md) |
| AP-02-24 | Does the cancellation refund (ruling C1) also apply to campaign deletion? | [02](02_TEXT_BASED_QUESTIONS.md) |
| AP-04-01 | KYC/verification steps and status values | [04](04_PROFILE_AND_VERIFICATION.md) |
| AP-04-02 | Which profile changes require Platform Admin approval | [04](04_PROFILE_AND_VERIFICATION.md) |
| AP-06-01 | Handling when Call/Chat reconnection permanently fails (M6) | [06](06_INSTANT_CALL_AND_CHAT.md) |
| AP-10-01 | Mandatory rating enforcement mechanism (M7) | [10](10_RATINGS_AND_REVIEWS.md) |
| AP-15-01 | Effect of changing the time zone (IST default) | [15](15_SETTINGS_AND_PREFERENCES.md) |
| AP-16-01 | Confirm the "suggested" support ticket statuses | [16](16_HELP_AND_SUPPORT.md) |
| AP-16-02 | Ticket reopen conditions | [16](16_HELP_AND_SUPPORT.md) |

## 4. C — Contradictions resolved on 2026-11-20

| ID | Resolution | Amended decision |
|----|------------|------------------|
| AP-01-14 | DND blocks all new services; existing confirmed appointments remain valid | AD-07 |
| AP-02-25 | A Special Campaign must carry a clear, mandatory Special Campaign label/type | AD-26 (User App D-20) |
| AP-13-01 | Text Question analytics: Received, Answered/Completed, Pending; no double counting | AD-145 |

## 5. D — Cross-app items

X-16 – X-20 and X-22 – X-25 were aligned with the User App on 2026-11-20
(User App D-10, D-17, D-20, D-21, D-30 amended; D-40 – D-51 added). Only
X-14 (subscription price, duration, renewal, cancellation/refund) remains
open, on hold. User App items still open and related to the Astrologer App
include P-07-04 – P-07-06 (late-cancellation percentage, AP-05-01),
P-07-10 (rating time limit; enforcement AP-10-01), P-08-03, P-08-04
(AP-06-01), P-14-07 (where users see Live and posts), data retention
(P-GL-03), and currency (P-10-01).

## 6. E — Platform Admin dependencies

PA-01 – PA-11 are listed in [`00_ASTROLOGER_APP_REVIEW_LIST.md` §5.2](00_ASTROLOGER_APP_REVIEW_LIST.md#52-platform-admin-dependencies).
They become Platform Admin requirements when its documentation starts.

## 7. Change log

| Date | Change |
|------|--------|
| 2026-11-20 | Snapshot created after the Master Decision Document was applied. |
| 2026-11-20 | Updated after the contradiction rulings (AP-01-14, AP-02-25, AP-13-01 resolved) and the User App alignment (X-16 – X-25). |
