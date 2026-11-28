# 06 — Payments & Finance

| Field | Value |
|-------|-------|
| Application | Platform Admin |
| Version | 0.1 (Draft) |
| Last Updated | 2026-11-25 |
| Status | Draft — awaiting product-owner review; not committed |
| Review list | [`15-platform-review-list.md`](15-platform-review-list.md) |

---

## 1. Purpose and scope

Payments & Finance is a separate main Platform Admin module containing:
- Wallet Overview
- Service Revenue
- Platform Commission
- Astrologer Earnings
- User Wallet Deposits
- Payment Transactions
- Refunds (Refund Management)
- Settlements
- Payouts
- Commission Settings
- Financial Reports
- User Settlement and Astrologer Settlement, shown separately

All financial records link to the relevant **Service ID** and **Transaction ID**.

## 2. Commission rules

| Item | Rule | Source |
|------|------|--------|
| Instant Call | **2%** | Astrologer `AD-124` |
| Instant Chat | **2%** | Astrologer `AD-124` |
| Appointment | **3%** (astrologer net 97%) | Astrologer `AD-124` |
| Wallet Top-up | **0%** | Platform requirement |
| Text Questions | **Not finalized** — `PP-09` (Astrologer `AP-08-02`) | — |
| Subscriptions and any other service | **Not finalized** — `PP-09` | — |
| Live Sessions | Free now; no earnings (Astrologer `AD-113`) | — |

- Commission applies to paid service activities according to the approved
  commission configuration; different services may have different rates.
- Commission is calculated on the amount the User actually paid, after any
  offer discount; the Astrologer bears the discount (Astrologer `AD-127`).
- No universal rate (such as 10%) is applied.
- **Super Admin** controls commission settings.
- Old transactions keep their historical commission calculation; a change
  applies to future eligible transactions from its approved effective date.

## 3. Astrologer earnings, settlement, and withdrawal

Approved Astrologer rules (Astrologer `AD-120` – `AD-126`):
- Wallet overview: Available, Pending, and Held Balance; Total Earnings; Total
  Withdrawn; Recent Transactions. Pending Balance definition — `PP-11`.
- Held Balance includes only earnings for services not yet completed; a
  complaint or review does not automatically move earnings to Held.
- **Settlement release: twice weekly, Tuesday and Friday**, after the
  service's eligibility period:
  - Text Questions: 7 days (`AD-43`)
  - Appointments: 3 days after completion
  - Instant Call / Instant Chat: **not finalized** — `PP-10`
- **Withdrawal:** minimum **₹500**; any time, within the Available Balance;
  payout methods **Bank Account and UPI**; account verification and Platform
  verification before payout; processing target **within 3 working days**;
  statuses **Pending, Processing, Paid, Failed**; a failed payout returns
  the amount to the Available Balance; duplicate requests / payments
  prevented.
- Service completion, settlement release, and withdrawal status are distinct.
- Monthly PDF Earnings Statement.

## 4. User wallet and payments

- Users pay with their Wallet balance or by direct UPI / bank payment; the
  Wallet is not mandatory (User `D-33`).
- All User refunds go to the Wallet. Users may withdraw to a bank account
  only the amount above a **₹500** retained balance (User `D-32`). This is a
  User Wallet rule, distinct from the Astrologer minimum withdrawal of ₹500.
- Wallet statuses: Success · Pending · Failed · Reversed · Refunded. Only
  confirmed, completed transactions change the balance.
- Wallet adjustments only through Super Admin–approved Wallet Adjustment
  Requests ([User Management §5.4](04-people-management/user-management.md)).

## 5. Refunds

- Refund processing happens in Refund Management; after processing, the
  refund appears automatically in the User's Wallet Transactions.
- Platform requirement: **refund approval is Super Admin-only.**
- Approved applications already define automatic, rule-based refunds (for
  example: unanswered Text Question after 30 days — `AD-30` / `D-18`;
  campaign cancellation — `AD-31` / `D-21`; appointment date closure,
  astrologer cancellation or no-show — `AD-94`, `AD-98` / `D-41`). Whether
  Super Admin approval applies to these automatic refunds is open — **PC-12**.
- Refund approval and partial refunds arising from disputes / complaints are
  pending — `PP-03` (ruling C5).

## 6. Approvals

Super Admin alone approves Wallet Adjustments, Wallet Transfers, Payouts, and
Settlements. Assistants can never approve them
([Assistant Management §5](04-people-management/assistant-management.md)).

## 7. Settlement separation

User Settlement and Astrologer Settlement are shown separately. The exact
content of "User Settlement" is not defined — `PP-12`.

## 8. Financial reports

Financial reports by service, period, astrologer, commission, refunds,
settlements, and payouts are part of this module; their exact layout is not
defined. PDF / Excel export.

## 9. Pending Discussion – Not Finalized

| ID | Item |
|----|------|
| PP-03 | Dispute / complaint refund approval and partial refunds |
| PP-09 | Commission rate for Text Questions, Subscriptions, and other services |
| PP-10 | Settlement eligibility period for Instant Call / Instant Chat |
| PP-11 | Pending Balance definition |
| PP-12 | Meaning of "User Settlement" |
| PC-12 | Super Admin refund approval vs automatic rule-based refunds |

No other financial formula, payout schedule, or rate is invented.

## 10. Change History

| Version | Date | Change |
|---------|------|--------|
| 0.1 | 2026-11-25 | Initial draft. Approved commission, settlement, and withdrawal rules recorded (ruling C2); Wallet top-up 0%; unfinalized rates pending. |
