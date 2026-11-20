# 06 — Instant Call and Instant Chat

| Field | Value |
|-------|-------|
| Application | Astrologer App |
| Status | Draft |
| Owned decisions | AD-103 – AD-111 |
| Review list | [`00_ASTROLOGER_APP_REVIEW_LIST.md`](00_ASTROLOGER_APP_REVIEW_LIST.md) |
| Shared context | [`CONTEXT.md`](../../CONTEXT.md) |

> **Frontend UI phase.** This specification describes product behaviour. It
> does not define APIs, data structures, or backend logic. Items marked
> `PENDING DISCUSSION` must not be implemented as if decided.

---

## 1. Purpose

Defines Instant Call and Instant Chat from the astrologer's side: how
requests arrive, the 30-second acceptance window, the single active
consultation lock, prepaid packages, session duration and extension, early
termination, technical failure, and Call and Chat history.

## 2. Scope / Out of scope

**In scope**
- Request lifecycle and the single active consultation lock.
- Prepaid packages configured by the astrologer.
- Sessions: extension, early end, timer, reconnection.
- Early-termination complaints (astrologer view).
- Call History and Chat History (24-hour message rule).

**Out of scope**
- Online/Offline and the individual Call/Chat switches → [01](01_HOME_SCREEN.md) (AD-04 – AD-06, AD-164).
- DND → [01](01_HOME_SCREEN.md) (AD-07, AD-74).
- Commission (2%) and settlement → [08](08_WALLET_AND_EARNINGS.md) (AD-124, AD-126).
- Ratings after sessions → [10](10_RATINGS_AND_REVIEWS.md) (AD-129).
- There is no Instant Call/Chat dispute section (AD-162 → [16](16_HELP_AND_SUPPORT.md)).

## 3. Entry points

- Home → Availability: Instant Call and Instant Chat switches (AD-06 → [01](01_HOME_SCREEN.md)).
- Incoming request popup (AD-104).
- Profile → Service Information → Instant Call / Instant Chat (AD-84 → [04](04_PROFILE_AND_VERIFICATION.md)) for package settings.
- Call/Chat history rows → Consultation Details (AD-78 → [03](03_GLOBAL_NAVIGATION.md)).
- Notifications category D (AD-148).

## 4. Confirmed decisions

**Owned by this module** (verbatim from the decision register)

| ID | Decision |
|----|----------|
| AD-103 | **User selection:** the User sees two separate choices, Instant Call and Instant Chat. When the User selects one service, the astrologers currently available for that specific service are shown. The User selects an astrologer and sends a request. The User is never automatically routed to another astrologer. |
| AD-104 | **Request lifecycle:** the astrologer receives a request popup only if the corresponding service is enabled — a Call request only when Call is active, a Chat request only when Chat is active. The astrologer must accept within **30 seconds**; otherwise the request **expires**. A rejected request becomes **Declined**. The User is then offered **Try Again** and **Try Some Other Astrologer**. The same rejected astrologer must not automatically receive the same request again. The User may cancel a request before the astrologer accepts. |
| AD-105 | **Single active consultation lock:** Call and Chat may both be Online at the same time, but only **one pending request or active consultation** is allowed across both services, using **one atomic availability lock**. The first request obtains the lock; a simultaneous second request receives **Busy**/rejection. Once a request is accepted, the other service remains unavailable until the session ends. A rejected, expired, or cancelled request releases the lock and restores availability. |
| AD-106 | **Prepaid packages:** Instant Call and Instant Chat use **prepaid packages**, not postpaid per-minute billing. The astrologer configures package durations and prices; the minimum package duration is **5 minutes**. The User sees the packages on the astrologer's profile and pays the entire package amount before the session starts. (Example: ₹75 for 5 minutes — illustrative only.) |
| AD-107 | **Session duration and extension:** there is **no refund for early termination** by either the User or the astrologer. The purchased package duration is the paid time, but neither party is required to remain for the entire duration; either party may end the session early. The extension option appears **1 minute before** package expiry; the User pays for the next package to extend. If payment succeeds before expiry, the same session continues; if payment is not completed before expiry, the session ends automatically. The billing timer stops when the session ends. |
| AD-108 | **Early termination complaint:** if an astrologer deliberately ends a session early without answering the User's question, the User may submit a Platform complaint/review identifying the astrologer and the incident. The Platform investigates. If astrologer fault is confirmed, a warning notification is issued, and repeated incidents are monitored for possible further action. No automatic refund is issued. |
| AD-109 | **Technical failure:** for a Call, automatic reconnection is attempted for **5 minutes**, and the remaining paid time is preserved during reconnection. Chat messages are saved and available after reconnection. The session ends automatically when the package time expires. |
| AD-110 | **Call History:** shows Consultation ID; astrologer details; date/time; actual duration; package and amount; payment details; recommended attachments, if any. |
| AD-111 | **Chat History (24-hour rule):** full chat messages remain accessible to both the User and the astrologer for **24 hours only**. During those 24 hours the astrologer can save/download the chat as text. After 24 hours the messages become inaccessible to both parties. Booking details, consultation date/time, astrologer details, and payment records remain visible in history. The same 24-hour rule applies in the User App and the Astrologer App. |

**Referenced decisions**

| ID | Topic | Owning file |
|----|-------|-------------|
| AD-04 | Online | [01](01_HOME_SCREEN.md) |
| AD-05 | Offline: Instant Call and Chat cannot arrive | [01](01_HOME_SCREEN.md) |
| AD-06 | Individual ON/OFF switches for Instant Call and Instant Chat | [01](01_HOME_SCREEN.md) |
| AD-07 | DND takes priority over the switches | [01](01_HOME_SCREEN.md) |
| AD-17 | No Today's Work area for Instant Calls and Chats | [01](01_HOME_SCREEN.md) |
| AD-74 | DND cannot be activated during an ongoing Call or Chat | [01](01_HOME_SCREEN.md) |
| AD-78 | Call/Chat history → Consultation Details | [03](03_GLOBAL_NAVIGATION.md) |
| AD-124 | Commission: Instant Call 2%, Instant Chat 2% | [08](08_WALLET_AND_EARNINGS.md) |
| AD-126 | Settlement release (Call/Chat eligibility period missing, AP-08-03) | [08](08_WALLET_AND_EARNINGS.md) |
| AD-129 | Mandatory rating after a session | [10](10_RATINGS_AND_REVIEWS.md) |
| AD-151 | Availability vs notification preferences | [14](14_NOTIFICATIONS_AND_REMINDERS.md) |
| AD-164 | Offline vs DND | [01](01_HOME_SCREEN.md) |

## 5. User flows

### 5.1 Receive a request
1. The astrologer has Instant Call and/or Instant Chat switched ON (AD-06) and is not in DND (AD-07).
2. A User who chose that service selects the astrologer and sends a request; the User is never routed automatically to another astrologer (AD-103).
3. The request obtains the single availability lock (AD-105). A request for the other service arriving at the same time receives **Busy** (AD-105).
4. The astrologer sees a popup only for an enabled service (AD-104).
5. The astrologer accepts within 30 seconds → the session starts; or rejects → **Declined**; or does not respond → **Expired** (AD-104).
6. The User may cancel before acceptance (AD-104).
7. On Declined, Expired, or Cancelled, the lock is released and availability is restored (AD-105). After Declined, the User sees Try Again and Try Some Other Astrologer; the same request is not sent again automatically to the same astrologer (AD-104).

### 5.2 Run a session
1. The User has already paid the full prepaid package (AD-106).
2. While the session runs, the other service stays unavailable (AD-105).
3. 1 minute before the package ends, the User sees the extension option (AD-107).
4. If the User pays for the next package before expiry, the same session continues; otherwise it ends automatically at expiry (AD-107).
5. Either party may end the session early; there is no refund for early termination (AD-107).
6. The billing timer stops when the session ends; the lock is released (AD-105, AD-107).
7. The User gives a mandatory rating (AD-129 → [10](10_RATINGS_AND_REVIEWS.md)).

### 5.3 Technical failure
1. Call: automatic reconnection for 5 minutes; remaining paid time is preserved (AD-109).
2. Chat: messages are saved and available after reconnection (AD-109).
3. The session ends automatically when the package time expires (AD-109).
4. Refund or remaining-balance handling when reconnection permanently fails: `PENDING DISCUSSION` (AP-06-01).

### 5.4 Configure packages
1. The astrologer opens the Instant Call or Instant Chat package settings.
2. The astrologer configures package durations and prices; the minimum duration is 5 minutes (AD-106).
3. Packages are shown to Users on the astrologer's profile (AD-106).

### 5.5 Early-termination complaint (astrologer view)
If a User complains that the astrologer deliberately ended early without
answering, the Platform investigates; if fault is confirmed, the astrologer
receives a warning notification and repeated incidents are monitored. No
automatic refund is issued (AD-108).

## 6. Screens and content

### 6.1 Request popup (AD-104)
- Shown only for the enabled service.
- Accept / Reject with a 30-second limit.

### 6.2 Package settings (AD-106)
- Separate package lists for Instant Call and Instant Chat.
- Each package: duration (minimum 5 minutes) and price. Example ₹75 for 5 minutes is illustrative only.

### 6.3 Call History (AD-110)
Consultation ID; astrologer details; date/time; actual duration; package and
amount; payment details; recommended attachments, if any. Each row opens that
Consultation's Details (AD-78).

### 6.4 Chat History (AD-111)
- First 24 hours: full messages visible; **Save/Download as text** available to the astrologer.
- After 24 hours: messages hidden for both parties; booking details, consultation date/time, astrologer details, and payment records remain.

## 7. Business rules and validations

| # | Rule | Source |
|---|------|--------|
| ICC-01 | The User chooses Instant Call or Instant Chat and an available astrologer; no automatic routing to another astrologer. | AD-103 |
| ICC-02 | Requests appear only for an enabled service. | AD-104 |
| ICC-03 | Acceptance window 30 seconds; no response → Expired; rejection → Declined. | AD-104 |
| ICC-04 | A Declined request is never re-sent automatically to the same astrologer. | AD-104 |
| ICC-05 | The User may cancel before acceptance. | AD-104 |
| ICC-06 | One atomic lock across Call and Chat: at most one pending request or active consultation; a simultaneous second request gets Busy. | AD-105 |
| ICC-07 | Declined, Expired, or Cancelled releases the lock and restores availability; an accepted request keeps the other service unavailable until the session ends. | AD-105 |
| ICC-08 | Prepaid packages only; minimum 5 minutes; full package paid before start. | AD-106 |
| ICC-09 | No refund for early termination by either party. | AD-107 |
| ICC-10 | Extension offered 1 minute before expiry; paid extension continues the same session; unpaid → automatic end. | AD-107 |
| ICC-11 | The billing timer stops when the session ends. | AD-107 |
| ICC-12 | Early-termination complaints are investigated by the Platform; warnings on confirmed fault; no automatic refund. | AD-108 |
| ICC-13 | Call reconnection 5 minutes with remaining time preserved; chat messages saved across reconnection. | AD-109 |
| ICC-14 | Chat messages are accessible to both parties for 24 hours only; the astrologer may save/download as text in that window. | AD-111 |
| ICC-15 | Commission 2% for each service, calculated as defined in [08](08_WALLET_AND_EARNINGS.md) / [09](09_OFFERS_AND_EARNINGS_CALCULATIONS.md). Illustrative: ₹75 package → commission ₹1.50, net ₹73.50. | AD-124, AD-127 |
| ICC-16 | Offline: no Call/Chat requests arrive (AD-05). DND: no requests; DND cannot be activated during an active session (AD-74). | AD-05, AD-74 |
| ICC-17 | Notification preferences never change availability. | AD-151 |

## 8. States and edge cases

### 8.1 Request states (AD-104, AD-105)

| From | Event | To | Lock |
|------|-------|----|------|
| — | User sends request; lock obtained | Pending (request) | Held |
| — | Lock already held | Busy (rejected) | Unchanged |
| Pending | Astrologer accepts within 30 s | Session active | Held |
| Pending | Astrologer rejects | Declined | Released |
| Pending | 30 s pass without acceptance | Expired | Released |
| Pending | User cancels | Cancelled | Released |
| Session active | Either party ends / package expires without extension | Completed | Released |

### 8.2 Edge cases

| Case | Behaviour |
|------|-----------|
| Call and Chat requests arrive simultaneously | First gets the lock; second gets Busy (AD-105) |
| Astrologer tries to activate DND during a session | Not allowed until the session ends (AD-74) |
| User leaves early | Session ends; no refund (AD-107) |
| Extension payment completes after expiry | Session already ended automatically (AD-107) |
| Call drops | 5-minute reconnection; remaining time preserved (AD-109) |
| Reconnection fails permanently | `PENDING DISCUSSION` (AP-06-01) |
| Chat opened after 24 hours | Messages unavailable; records remain (AD-111) |
| Notifications turned off | Availability unchanged (AD-151) |

## 9. Notifications triggered

Category D events (New Call/Chat Request; Accepted; Declined; Expired;
Consultation Started/Completed; Package Expiry/Extension Reminder; Technical
Disconnection/Reconnection) → AD-148 ([14](14_NOTIFICATIONS_AND_REMINDERS.md)).
Warning notification on confirmed early-termination fault (AD-108).

## 10. Dependencies on other modules

- [01](01_HOME_SCREEN.md) — switches, Online/Offline, DND (AD-04 – AD-07, AD-74, AD-164).
- [03](03_GLOBAL_NAVIGATION.md) — Consultation Details navigation.
- [04](04_PROFILE_AND_VERIFICATION.md) — Service Information shortcuts.
- [08](08_WALLET_AND_EARNINGS.md), [09](09_OFFERS_AND_EARNINGS_CALCULATIONS.md) — commission and earnings.
- [10](10_RATINGS_AND_REVIEWS.md) — mandatory rating.
- [14](14_NOTIFICATIONS_AND_REMINDERS.md) — notifications.
- **User App:** X-20 (P-08-01 – P-08-04, P-08-07, P-08-08, P-09-01 – P-09-03, P-09-05, P-09-07, P-09-08); X-24 (packages on profile). Voice/video for Instant Call (User App P-08-05) is not covered by the Master Decision Document.
- **Platform Admin:** PA-02 (early-termination complaints).

## 11. PENDING DISCUSSION

Full wording in [`00_ASTROLOGER_APP_REVIEW_LIST.md` §4](00_ASTROLOGER_APP_REVIEW_LIST.md#4-open-questions-register).

**Owned by this module**

| ID | Topic | Status |
|----|-------|--------|
| AP-06-01 | Handling when reconnection permanently fails | Open |

**Related**

| ID | Topic | Status |
|----|-------|--------|
| AP-08-03 | Settlement eligibility period for Instant Call and Instant Chat | Open — missing source information |

## 12. Acceptance criteria

- [ ] Users choose Call or Chat separately and are never auto-routed (AD-103).
- [ ] Requests appear only for enabled services; 30-second acceptance; Declined and Expired states; Try Again / Try Some Other Astrologer; no automatic re-send to the same astrologer; User cancel before acceptance (AD-104).
- [ ] Only one pending request or active consultation across both services; simultaneous second request gets Busy; lock released on Declined/Expired/Cancelled (AD-105).
- [ ] Prepaid packages, minimum 5 minutes, paid in full before start (AD-106).
- [ ] No refund for early termination; extension 1 minute before expiry; automatic end if unpaid; timer stops at session end (AD-107).
- [ ] Early-termination complaints follow AD-108 with no automatic refund.
- [ ] Call reconnection for 5 minutes preserves time; chat messages survive reconnection (AD-109).
- [ ] Call History shows all fields of AD-110.
- [ ] Chat messages are available to both parties for 24 hours only, with text download for the astrologer; records remain afterwards (AD-111).

## 13. Change log

| Date | Change |
|------|--------|
| 2026-11-20 | Initial draft created from the Master Decision Document: AD-103 – AD-111. AP-06-01 added. |
