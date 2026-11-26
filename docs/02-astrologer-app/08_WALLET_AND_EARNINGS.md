# 08 — Wallet and Earnings

| Field | Value |
|-------|-------|
| Application | Astrologer App |
| Status | Draft |
| Owned decisions | AD-120 – AD-126 |
| Review list | [`00_ASTROLOGER_APP_REVIEW_LIST.md`](00_ASTROLOGER_APP_REVIEW_LIST.md) |
| Shared context | [`CONTEXT.md`](../../CONTEXT.md) |

> **Frontend UI phase.** This specification describes product behaviour. It
> does not define APIs, data structures, or backend logic. Items marked
> `PENDING DISCUSSION` must not be implemented as if decided.

---

## 1. Purpose

Defines the astrologer's Wallet and Earnings: balances, transactions,
service-wise earnings, month-wise history and statements, commission rates,
withdrawals, and settlement release.

## 2. Scope / Out of scope

**In scope**
- Wallet overview: Available, Pending, and Held Balance; Total Earnings; Total Withdrawn; Recent Transactions.
- Service-wise earnings, transaction history, month-wise history, PDF statement.
- Commission rates per service.
- Withdrawal and payout statuses.
- Settlement release (Tuesday/Friday).

**Out of scope**
- Home Earnings (expected net for today's work) → [01](01_HOME_SCREEN.md) (AD-14, AD-15).
- Text Question settlement rule → [02](02_TEXT_BASED_QUESTIONS.md) (AD-43).
- Discount and commission calculation, offer performance → [09](09_OFFERS_AND_EARNINGS_CALCULATIONS.md) (AD-127, AD-128).
- User Wallet (top-up, ₹500 retained balance) → User App `10_WALLET_AND_PAYMENTS.md` (D-32, D-33); not an Astrologer rule (X-21).

## 3. Entry points

- **Earnings** tab — the "Earnings/Wallet section" (AD-03, AD-14 → [01](01_HOME_SCREEN.md)). Exact placement of the Wallet screens within the tab: AP-GL-02.
- Notifications category G (AD-148).
- Transaction rows → Transaction Details (AD-78 → [03](03_GLOBAL_NAVIGATION.md)).

## 4. Confirmed decisions

**Owned by this module** (verbatim from the decision register)

| ID | Decision |
|----|----------|
| AD-120 | **Wallet overview:** one screen shows Available Balance, Pending Balance, Held Balance, Total Earnings, Total Withdrawn, and Recent Transactions. Each recent transaction shows Transaction ID, service/type, date/time, amount, and status. |
| AD-121 | **Service-wise earnings:** earnings are shown separately for Text Questions, Appointments, Instant Call, and Instant Chat. For each service, the applicable Gross Revenue, Commission, Net Earnings, and Pending/Available amount are shown. |
| AD-122 | **Transaction history:** a unified transaction history shows Transaction ID; service/type; related User/Appointment/Consultation ID; date/time; gross amount; commission; net amount; status; with relevant filters. |
| AD-123 | **Month-wise history:** a month/year selector shows that month's summary and full transaction history. A monthly **PDF Earnings Statement** can be downloaded. |
| AD-124 | **Commission rates:** Instant Call **2%**; Instant Chat **2%**; Appointment **3%** (astrologer net 97%). Other services follow their separately finalized commission rules. No single rate (such as 10%) is applied universally. Wallet top-up rules for Users are not part of Astrologer service earnings. |
| AD-125 | **Withdrawal:** minimum astrologer withdrawal is **₹500**. Withdrawal requests may be made at any time, subject to the Available Balance. Payout methods: Bank Account and UPI. Account verification is required, and Platform verification is completed before payout processing. Payout processing target: within **3 working days**. Withdrawal statuses: **Pending**, **Processing**, **Paid**, **Failed**. A failed payout returns the amount to the Available Balance. Duplicate withdrawal requests/payments are prevented. The User App's ₹500 minimum retained balance (User App D-32) is not an Astrologer Wallet rule. |
| AD-126 | **Settlement release:** eligible earnings are released **twice weekly, on Tuesday and Friday**. Withdrawal request frequency and settlement release frequency are separate. Held Balance includes only earnings for services not yet completed. After service completion and the applicable eligibility period, eligible earnings are released in the next Tuesday/Friday settlement run. Eligibility periods: Text Questions **7 days** (AD-43); Appointments **3 days** after completion; Instant Call and Instant Chat — not confirmed (AP-08-03). A complaint or review does not automatically move earnings to Held Balance. Service completion, settlement release, and withdrawal status are distinct and must not be confused. |

**Referenced decisions**

| ID | Topic | Owning file |
|----|-------|-------------|
| AD-14 | Home Earnings; Gross/Commission/Net in Earnings/Wallet; refund accounting only in Wallet | [01](01_HOME_SCREEN.md) |
| AD-15 | Earnings comparisons on Home | [01](01_HOME_SCREEN.md) |
| AD-43 | Text Question settlement (7 days after answer; Settled) | [02](02_TEXT_BASED_QUESTIONS.md) |
| AD-91 | No earnings for astrologer-cancelled appointments | [05](05_APPOINTMENTS.md) |
| AD-113 | Live is free; future Live earnings shown separately | [07](07_LIVE_SESSIONS.md) |
| AD-127 | Commission on the amount the User pays; astrologer bears discount | [09](09_OFFERS_AND_EARNINGS_CALCULATIONS.md) |
| AD-128 | Offer performance consistent with Wallet | [09](09_OFFERS_AND_EARNINGS_CALCULATIONS.md) |
| AD-145 | Analytics shows only a service-wise earnings overview | [13](13_ANALYTICS_AND_PERFORMANCE.md) |

## 5. User flows

### 5.1 View the Wallet
The astrologer opens the Wallet overview (AD-120) and sees all balances and
recent transactions on one screen. Each transaction opens its Transaction
Details (AD-78).

### 5.2 View earnings by service
The astrologer opens service-wise earnings and sees, for Text Questions,
Appointments, Instant Call, and Instant Chat, the applicable Gross Revenue,
Commission, Net Earnings, and Pending/Available amount (AD-121).

### 5.3 View a month and download a statement
1. The astrologer selects a month and year (AD-123).
2. The month's summary and full transaction history are shown (AD-123).
3. The astrologer downloads the monthly PDF Earnings Statement (AD-123).

### 5.4 Request a withdrawal
1. The astrologer requests a withdrawal at any time (AD-125).
2. Validation: amount at least ₹500 and not more than the Available Balance; payout account (Bank Account or UPI) verified; no duplicate request in progress (AD-125).
3. Status **Pending** → **Processing** after Platform verification → **Paid**; or **Failed**, in which case the amount returns to the Available Balance (AD-125).
4. Target: payout processed within 3 working days (AD-125).

### 5.5 Settlement release
1. A service is completed; its earnings are no longer Held (AD-126).
2. After the service's eligibility period — Text Questions 7 days (AD-43), Appointments 3 days after completion, Instant Call/Chat not confirmed (AP-08-03) — the earnings become eligible (AD-126).
3. Eligible earnings are released in the next Tuesday or Friday settlement run (AD-126).

## 6. Screens and content

### 6.1 Wallet overview (AD-120)
| Item | Meaning |
|------|---------|
| Available Balance | Released earnings that can be withdrawn (AD-125, AD-126) |
| Pending Balance | Definition missing: `PENDING DISCUSSION` (AP-08-01) |
| Held Balance | Earnings for services not yet completed (AD-126) |
| Total Earnings | |
| Total Withdrawn | |
| Recent Transactions | Transaction ID, service/type, date/time, amount, status |

### 6.2 Service-wise earnings (AD-121)
Text Questions, Appointments, Instant Call, Instant Chat — each with Gross
Revenue, Commission, Net Earnings, Pending/Available amount. Live has no
earnings now (AD-113).

### 6.3 Transaction history (AD-122)
Transaction ID; service/type; related User/Appointment/Consultation ID;
date/time; gross amount; commission; net amount; status; relevant filters.
Filters persist on Back (AD-77).

### 6.4 Month-wise history (AD-123)
Month/year selector; month summary; full month transaction history; monthly
PDF Earnings Statement download.

### 6.5 Withdrawal (AD-125)
Amount; payout method (Bank Account or UPI); status (Pending, Processing,
Paid, Failed).

## 7. Business rules and validations

### 7.1 Commission rates (AD-124)

| Service | Commission | Astrologer net |
|---------|-----------|----------------|
| Instant Call | 2% | 98% |
| Instant Chat | 2% | 98% |
| Appointment | 3% | 97% |
| Text Questions | Missing source information (AP-08-02) | — |
| Live | No earnings now (AD-113) | — |

Commission is calculated on the amount the User actually pays (AD-127 →
[09](09_OFFERS_AND_EARNINGS_CALCULATIONS.md)). No universal rate is applied.

### 7.2 Settlement eligibility (AD-126)

| Service | Eligibility period | Release |
|---------|--------------------|---------|
| Text Questions | 7 days (AD-43) | Next Tuesday/Friday run |
| Appointments | 3 days after completion | Next Tuesday/Friday run |
| Instant Call / Instant Chat | `PENDING DISCUSSION` (AP-08-03) | Next Tuesday/Friday run |

### 7.3 Rules

| # | Rule | Source |
|---|------|--------|
| WAL-01 | All balances and recent transactions are shown on one overview screen. | AD-120 |
| WAL-02 | Earnings are shown separately per service. | AD-121 |
| WAL-03 | Every transaction lists gross, commission, and net, and links to its related User/Appointment/Consultation ID. | AD-122 |
| WAL-04 | A monthly PDF Earnings Statement is downloadable for any selected month. | AD-123 |
| WAL-05 | Minimum withdrawal ₹500; any time; within the Available Balance. | AD-125 |
| WAL-06 | Payout only to a verified Bank Account or UPI, after Platform verification. | AD-125 |
| WAL-07 | Failed payouts return the amount to the Available Balance. | AD-125 |
| WAL-08 | Duplicate withdrawal requests/payments are prevented. | AD-125 |
| WAL-09 | Settlement runs on Tuesday and Friday; withdrawal timing is independent of settlement timing. | AD-126 |
| WAL-10 | Held Balance contains only earnings for services not yet completed; complaints or reviews do not move earnings to Held. | AD-126 |
| WAL-11 | Service completion, settlement release, and withdrawal status are separate concepts and separate statuses. | AD-126 |
| WAL-12 | Refund details and refund-related accounting appear only in the Wallet, never on Home. | AD-14 |
| WAL-13 | The User App ₹500 retained-balance rule does not apply to the Astrologer Wallet. | AD-125 |

## 8. States and edge cases

### 8.1 Withdrawal status transitions (AD-125)

| From | Event | To |
|------|-------|----|
| — | Request submitted | Pending |
| Pending | Platform verification completed; payout started | Processing |
| Processing | Payout succeeds | Paid |
| Processing | Payout fails | Failed (amount returned to Available Balance) |

### 8.2 Edge cases

| Case | Behaviour |
|------|-----------|
| Withdrawal below ₹500 | Not allowed (AD-125) |
| Withdrawal above Available Balance | Not allowed (AD-125) |
| Second withdrawal while one is in progress / duplicate tap | Duplicate prevented (AD-125) |
| Payout account not verified | Withdrawal cannot be processed (AD-125) |
| Complaint or review received | Earnings not moved to Held automatically (AD-126) |
| Astrologer-cancelled appointment | No earnings (AD-91) |
| Offer discount applied | Commission on the paid amount (AD-127) |

## 9. Notifications triggered

Category G (New Earnings; Commission/Offer Discount Details; Settlement
Released; Withdrawal Requested; Withdrawal Processing; Withdrawal Paid;
Withdrawal Failed; Monthly Statement Available) and Bank Account/UPI
Added/Changed (category H) → AD-148 ([14](14_NOTIFICATIONS_AND_REMINDERS.md)).

## 10. Dependencies on other modules

- [01](01_HOME_SCREEN.md) — Home Earnings (AD-14, AD-15).
- [02](02_TEXT_BASED_QUESTIONS.md) — Text Question settlement (AD-43).
- [05](05_APPOINTMENTS.md), [06](06_INSTANT_CALL_AND_CHAT.md) — service earnings.
- [09](09_OFFERS_AND_EARNINGS_CALCULATIONS.md) — calculation rules.
- [13](13_ANALYTICS_AND_PERFORMANCE.md) — earnings overview only.
- **User App:** X-21 (₹500 rules are distinct); User refunds go to the User Wallet (User App D-32).
- **Platform Admin:** PA-05 (payout verification, processing, settlement runs), PA-11 (commission rates).

## 11. PENDING DISCUSSION

Full wording in [`00_ASTROLOGER_APP_REVIEW_LIST.md` §4](00_ASTROLOGER_APP_REVIEW_LIST.md#4-open-questions-register).

**Owned by this module**

| ID | Topic | Status |
|----|-------|--------|
| AP-08-01 | Definition of Pending Balance | Open — missing source information |
| AP-08-02 | Text Questions commission rate | Open — missing source information |
| AP-08-03 | Instant Call / Chat settlement eligibility period | Open — missing source information |
| AP-08-04 | Services shown (Subscriptions?) and placeholder commission / settlement values in the reference | Open |
| AP-08-05 | Reference omits Held Balance, Total Withdrawn and the withdrawals list (AD-120, AD-125) | Open |
| AP-08-06 | Payout details verification states and edit flow | Open |
| AP-08-07 | PDF statement for any filter combination vs monthly statement (AD-123) | Open |
| AP-08-08 | Multiple saved bank accounts and up to three UPI IDs, one selected per list | Open |

**Related**

| ID | Topic | Status |
|----|-------|--------|
| AP-GL-02 | Placement of Wallet within the Earnings tab | Open — missing source information |

## 12. Acceptance criteria

- [ ] The overview shows Available, Pending, and Held Balance, Total Earnings, Total Withdrawn, and Recent Transactions with ID, type, date/time, amount, status (AD-120).
- [ ] Service-wise earnings show gross, commission, net, and pending/available for each of the four services (AD-121).
- [ ] Unified transaction history shows all fields of AD-122 with filters.
- [ ] Month/year selection shows the month summary and history, and the PDF statement downloads (AD-123).
- [ ] Commission is 2% for Instant Call and Chat and 3% for Appointments; no universal rate is applied (AD-124).
- [ ] Withdrawals follow AD-125: ₹500 minimum, any time, Bank/UPI, verification, 3-working-day target, four statuses, failed amount returned, no duplicates.
- [ ] Settlement runs Tuesday and Friday after the service's eligibility period; Held contains only uncompleted services; complaints/reviews do not hold earnings (AD-126).

## 13. Change log

| Date | Change |
|------|--------|
| 2026-11-20 | Initial draft created from the Master Decision Document: AD-120 – AD-126. AP-08-01 – AP-08-03 added. |
| 2026-11-26 | AP-08-04 – AP-08-07 added (Earnings & Wallet reference design). No rule decided; see the review list. |
| 2026-11-26 | AP-08-08 added (multiple saved payout accounts in the Withdraw popup). No rule decided; see the review list. |
| 2026-11-26 | AP-08-09 added, then retired the same day (the full bank details forms were restored). See the review list. |
| 2026-11-26 | AP-08-09 added (bank accounts saved by bank name only). No rule decided; see the review list. |
