# 08 — Instant Call

| Field | Value |
|-------|-------|
| Application | User App |
| Status | Draft |
| Owned decisions | D-09, D-10 (shared with 07, 09), D-44 – D-46 (shared with 09) |
| Review list | [`00_USER_APP_REVIEW_LIST.md`](00_USER_APP_REVIEW_LIST.md) |
| Shared context | [`CONTEXT.md`](../../CONTEXT.md) |

---

## 1. Purpose

Defines the Instant Call consultation service: a call started immediately with an
available astrologer, without prior booking, paid as a prepaid package (D-44, D-45).

## 2. Scope / Out of scope

**In scope**
- Starting, conducting, and ending an Instant Call.
- Reviews after the call.
- Remedy hand-off to the Remedy Tracker.

**Out of scope**
- Wallet top-up and refunds in general → [10](10_WALLET_AND_PAYMENTS.md).
- Call history → [11](11_ACTIVITY_AND_SERVICE_HISTORY.md).

## 3. Entry points

- Start: **Services** tab (D-02 → [01](01_NAVIGATION_AND_STRUCTURE.md)). Layout: `PENDING DISCUSSION` (P-01-07).
- From an astrologer profile: `PENDING DISCUSSION` (P-05-06).
- History: **Activity** tab (D-03 → [01](01_NAVIGATION_AND_STRUCTURE.md)).

## 4. Confirmed decisions

**Owned by this module** (shared with [07](07_APPOINTMENT_SERVICE.md) and [09](09_INSTANT_CHAT.md); verbatim from the decision register)

| ID | Decision |
|----|----------|
| D-09 | Appointments, Instant Calls, and Instant Chats **do not** have a dispute option. |
| D-10 | **Reviews after consultations:** after an Appointment, Instant Call, or Instant Chat consultation, the user gives a **mandatory** 1–5 star rating; written feedback is **optional**. A submitted review cannot be edited or deleted by the user; changes are requested through Platform Support. *(Amended 2026-11-20: rating mandatory, written feedback optional, no user edit/delete — Astrologer AD-129, X-18; supersedes "Users can submit a review after an Appointment, Instant Call, or Instant Chat consultation". Enforcement mechanism not confirmed — Astrologer AP-10-01.)* |
| D-44 | **Instant Call and Instant Chat requests:** Instant Call and Instant Chat are separate choices for a consultation started immediately, without prior booking. After choosing one, the user sees the astrologers currently available for that service, selects one, and sends a request; the user is never routed automatically to another astrologer. The astrologer must accept within **30 seconds**; otherwise the request **expires**. A rejected request is **Declined**, and the user is offered **Try Again** or **Try Some Other Astrologer**; the same request is not re-sent automatically to the same astrologer. The user may cancel a request before it is accepted. A request sent while the astrologer already has a pending request or active consultation receives a **Busy** response. |
| D-45 | **Prepaid packages and sessions:** Instant Call and Instant Chat use **prepaid packages**, not per-minute billing. Packages (minimum **5 minutes**) are shown on the astrologer's profile, and the user pays the whole package before the session starts. Either party may end the session early; there is **no refund for early termination**. The extension option appears **1 minute before** the package ends; paying for the next package before expiry continues the same session, otherwise the session ends automatically. If an astrologer deliberately ends a session early without answering, the user may submit a Platform complaint/review; the Platform investigates; no automatic refund is issued. |
| D-46 | **Instant Call and Chat technical failure:** for an Instant Call, automatic reconnection is attempted for **5 minutes** and the remaining paid time is preserved. Instant Chat messages are saved and available after reconnection. The session ends automatically when the package time expires. Handling when reconnection permanently fails is not confirmed (Astrologer AP-06-01). |

**Referenced decisions**

| ID | Topic | Owning file |
|----|-------|-------------|
| D-02 | Purpose of the Services tab | [01](01_NAVIGATION_AND_STRUCTURE.md) |
| D-03 | Purpose of the Activity tab | [01](01_NAVIGATION_AND_STRUCTURE.md) |
| D-11 | Remedies in the Remedy Tracker | [16](16_REMEDY_TRACKER.md) |
| D-15 | Critical notifications | [15](15_NOTIFICATIONS.md) |
| D-33 | Payment with Wallet or direct UPI/bank | [10](10_WALLET_AND_PAYMENTS.md) |
| D-38 | Astrologer DND: profile hidden; no Instant Call | [05](05_ASTROLOGER_PROFILE.md) |
| D-48 | Packages shown on the astrologer profile | [05](05_ASTROLOGER_PROFILE.md) |

## 5. User flows

1. Start a call: the user chooses Instant Call, sees the astrologers currently available for it, selects one, and sends a request; the user is never routed to another astrologer automatically (D-44). Packages are shown on the astrologer's profile (D-48); the whole package is paid before the call starts (D-45), with the Wallet or by direct payment (D-33). Voice or video: `PENDING DISCUSSION` (P-08-05). Subscription requirement: `PENDING DISCUSSION` (P-08-06). Birth profile shared: `PENDING DISCUSSION` (P-13-09).
2. Astrologer does not accept within 30 seconds: the request expires; if declined, the user can Try Again or Try Some Other Astrologer; the user may cancel before acceptance (D-44).
   - During the call, the extension option appears 1 minute before the package ends; either party may end early, with no refund (D-45). On disconnection, reconnection is attempted for 5 minutes with the remaining time preserved (D-46).
3. During the call, if the astrologer prescribes or attaches a remedy, it
   also appears in the Remedy Tracker (D-11 → [16](16_REMEDY_TRACKER.md)).
4. After the consultation, the user gives a mandatory 1–5 star rating; written feedback is optional (D-10). Time limit and enforcement: `PENDING DISCUSSION` (P-07-10).

## 6. Screens and content

Request screen with 30-second wait, Declined options (Try Again, Try Some Other Astrologer), packages, and extension prompt (D-44, D-45). Voice/video and review content: `PENDING DISCUSSION` (P-08-05, P-07-10).

## 7. Business rules and validations

| # | Rule | Source |
|---|------|--------|
| R-08-01 | An Instant Call has no dispute option. | D-09 |
| R-08-02 | After the Instant Call consultation, a 1–5 star rating is mandatory; written feedback is optional; the user cannot edit or delete a submitted review. | D-10 |
| R-08-03 | A remedy prescribed or attached during an Instant Call must also appear in the user's Remedy Tracker. | D-11 → [16](16_REMEDY_TRACKER.md) |
| R-08-04 | Requests go only to the astrologer the user selected; no automatic routing; 30-second expiry; a declined request is not re-sent automatically. | D-44 |
| R-08-05 | Prepaid packages, minimum 5 minutes, paid in full before the call. | D-45 |
| R-08-06 | No refund for early termination; extension by paying for the next package before expiry. | D-45 |
| R-08-07 | 5-minute reconnection with remaining paid time preserved. | D-46 |

**Pending rules:** handling when reconnection permanently fails (P-08-03, P-08-04), voice or video (P-08-05), subscription requirement (P-08-06).

- During an astrologer's DND, the profile is hidden and an Instant Call cannot be started (D-38 → [05](05_ASTROLOGER_PROFILE.md)).

## 8. States and edge cases

| Case | Behaviour |
|------|-----------|
| User wants to dispute a call | No dispute option (D-09) |
| Call completed | Review can be submitted (D-10) |
| Package not paid | The call does not start (D-45) |
| Astrologer does not accept within 30 seconds | Request expires (D-44) |
| Astrologer declines | Try Again or Try Some Other Astrologer (D-44) |
| Astrologer engaged in another request or consultation | Busy response (D-44) |
| User or astrologer ends early | Session ends; no refund (D-45) |
| Extension not paid before the package ends | Call ends automatically (D-45) |
| Call drops | 5-minute reconnection; remaining time preserved (D-46) |
| Reconnection fails permanently | `PENDING DISCUSSION` (P-08-03, P-08-04) |

Call statuses: `PENDING DISCUSSION` (P-11-03).

## 9. Notifications triggered

| Notification | Category | Rule |
|--------------|----------|------|
| Instant Call notifications | `PENDING DISCUSSION` (P-15-08) | → [15](15_NOTIFICATIONS.md) |
| Payment/wallet alerts | Critical (payment/wallet) | D-15 → [15](15_NOTIFICATIONS.md) |

## 10. Dependencies on other modules

- [01](01_NAVIGATION_AND_STRUCTURE.md), [05](05_ASTROLOGER_PROFILE.md), [10](10_WALLET_AND_PAYMENTS.md), [11](11_ACTIVITY_AND_SERVICE_HISTORY.md), [13](13_BIRTH_PROFILES_AND_KUNDLI.md), [14](14_FOLLOWING_AND_SUBSCRIPTIONS.md), [15](15_NOTIFICATIONS.md), [16](16_REMEDY_TRACKER.md).

## 11. PENDING DISCUSSION

Full wording in [`00_USER_APP_REVIEW_LIST.md` §4](00_USER_APP_REVIEW_LIST.md#4-pending-discussion-register).

**Owned by this module**

| ID | Topic |
|----|-------|
| P-08-01 | Pricing model — **Resolved** (D-45) |
| P-08-02 | Minimum wallet balance — **Resolved** (D-45) |
| P-08-03 | Dropped calls and billing (confirmed parts in D-46) |
| P-08-04 | Refunds when a call fails (confirmed parts in D-45, D-46) |
| P-08-05 | Voice or video |
| P-08-06 | Subscription requirement |
| P-08-07 | Definition of an Instant Call — **Resolved** (D-44) |
| P-08-08 | Astrologer does not accept or respond — **Resolved** (D-44) |

**Related (owned elsewhere)**

| ID | Topic |
|----|-------|
| P-01-07 | Services tab layout |
| P-05-06 | Actions on the astrologer profile |
| P-07-10 | Review content and rules |
| P-11-03 | Statuses per service |
| P-13-09 | Birth profile shared in services |
| P-15-08 | Category of Instant Call notifications |

## 12. Acceptance criteria

- [ ] No dispute option is offered for an Instant Call (D-09).
- [ ] After an Instant Call consultation, the user must give a 1–5 rating; written feedback optional (D-10).
- [ ] The user chooses Instant Call separately, sees only available astrologers, and is never auto-routed; 30-second expiry; Declined with Try Again / Try Some Other Astrologer; cancel before acceptance; Busy when the astrologer is engaged (D-44).
- [ ] Prepaid packages (minimum 5 minutes) are paid in full before the session; no refund for early termination; extension offered 1 minute before expiry (D-45).
- [ ] Reconnection and session end follow D-46.
- [ ] A remedy prescribed or attached during an Instant Call appears in the Remedy Tracker (D-11).

## 13. Change log

| Date | Change |
|------|--------|
| 2026-11-17 | Initial draft created from D-09, D-10. |
| 2026-11-19 | Referenced D-38 (no Instant Call during astrologer DND). |
| 2026-11-20 | Aligned with the Astrologer App (X-18, X-20): D-10 re-quoted (amended — mandatory rating); D-44 – D-46 added; R-08-04 – R-08-07 added; P-08-items resolved or partially answered per the review list; D-33, D-48 referenced. |
