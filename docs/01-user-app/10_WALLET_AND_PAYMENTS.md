# 10 — Wallet and Payments

| Field | Value |
|-------|-------|
| Application | User App |
| Status | Draft |
| Owned decisions | D-32, D-33 |
| Review list | [`00_USER_APP_REVIEW_LIST.md`](00_USER_APP_REVIEW_LIST.md) |
| Shared context | [`CONTEXT.md`](../../CONTEXT.md) |

---

## 1. Purpose

Defines the User App wallet and how users pay for services and receive
refunds.

## 2. Scope / Out of scope

**In scope**
- Wallet balance, top-up, and transaction history.
- Payment for services.
- Refund destination and withdrawals.
- Invoices, receipts, and tax display.

**Out of scope**
- Service-specific refund eligibility → owning service file
  ([06](06_TEXT_QUESTION_SERVICE.md), [07](07_APPOINTMENT_SERVICE.md), [08](08_INSTANT_CALL.md), [09](09_INSTANT_CHAT.md), [14](14_FOLLOWING_AND_SUBSCRIPTIONS.md)).

## 3. Entry points

`PENDING DISCUSSION` (P-01-01).

## 4. Confirmed decisions

**Owned by this module** (verbatim from the decision register)

| ID | Decision |
|----|----------|
| D-32 | **Refunds and withdrawals:** all user refunds go to the user's in-app **Wallet**. Users may withdraw wallet funds to their bank account, but the wallet must keep a minimum balance of **₹500** after withdrawal: only the amount above ₹500 can be withdrawn, and a withdrawal that would leave less than ₹500 is not allowed. |
| D-33 | **Payment methods:** users can pay with their existing **Wallet** balance or by **direct payment** using UPI or bank/payment methods. Using the Wallet is not mandatory for every payment. |

**Referenced decisions**

| ID | Topic | Owning file |
|----|-------|-------------|
| D-05 | Purchasing question slots from campaigns | [06](06_TEXT_QUESTION_SERVICE.md) |
| D-07 | Question slot expiry (includes the no-refund rule for expired slots) | [06](06_TEXT_QUESTION_SERVICE.md) |
| D-15 | Critical notifications (includes payment/wallet alerts) | [15](15_NOTIFICATIONS.md) |
| D-18 | Refund when a Text Question is not answered within 30 days | [06](06_TEXT_QUESTION_SERVICE.md) |
| D-20 | Price display: original price, discount percentage, final payable price | [06](06_TEXT_QUESTION_SERVICE.md) |
| D-28 | IST calendar-day counting | [06](06_TEXT_QUESTION_SERVICE.md) |
| D-30 | Full refund for appointments cancelled by astrologer DND / Planned Unavailability | [07](07_APPOINTMENT_SERVICE.md) |

## 5. User flows

- Pay for a service with the Wallet balance or by direct UPI/bank payment (D-33).
- Receive a refund: all refunds go to the Wallet (D-32).
- Withdraw to a bank account: only the amount above a ₹500 minimum balance (D-32).

`PENDING DISCUSSION`:
- Top up the wallet (P-10-02, P-10-03).
- View transaction history (P-10-09).

## 6. Screens and content

`PENDING DISCUSSION` (P-10-01, P-10-07, P-10-08, P-10-09).

## 7. Business rules and validations

Owned rules: D-32 and D-33 (listed below).

Referenced rules that affect payments:
- Refund for an unanswered Text Question: D-18 → [06](06_TEXT_QUESTION_SERVICE.md).
- Full refund for appointments cancelled by astrologer DND / Planned Unavailability: D-30 → [07](07_APPOINTMENT_SERVICE.md).
- Price display (original price, discount percentage, final payable price): D-20 → [06](06_TEXT_QUESTION_SERVICE.md).
- Where refunds go: the user's Wallet (D-32).
- Withdrawals: allowed only for the amount above ₹500; a withdrawal that would leave less than ₹500 is not allowed (D-32).
- Payment: Wallet balance or direct UPI/bank payment; the Wallet is not mandatory (D-33).
- Question slot purchase: D-05 → [06](06_TEXT_QUESTION_SERVICE.md).
- No refund for expired unused question slots: D-07 → [06](06_TEXT_QUESTION_SERVICE.md).

## 8. States and edge cases

`PENDING DISCUSSION` — payment failure, insufficient balance, and pending
refunds depend on P-10-02, P-08-02, P-09-02.

| Case | Behaviour |
|------|-----------|
| Withdrawal would leave less than ₹500 | Not allowed (D-32) |
| Wallet balance is ₹500 or less | Nothing can be withdrawn (D-32) |
| Refund issued | Credited to the Wallet (D-32) |

## 9. Notifications triggered

| Notification | Category | Rule |
|--------------|----------|------|
| Payment and wallet alerts | Critical (payment/wallet) | D-15 → [15](15_NOTIFICATIONS.md) |

Exact events: `PENDING DISCUSSION` (P-15-03).

## 10. Dependencies on other modules

- [06](06_TEXT_QUESTION_SERVICE.md), [07](07_APPOINTMENT_SERVICE.md), [08](08_INSTANT_CALL.md), [09](09_INSTANT_CHAT.md), [14](14_FOLLOWING_AND_SUBSCRIPTIONS.md) — services that require payment.
- [11](11_ACTIVITY_AND_SERVICE_HISTORY.md) — relationship between transaction history and Activity (P-10-09).
- [15](15_NOTIFICATIONS.md) — payment/wallet alerts.

## 11. PENDING DISCUSSION

Full wording in [`00_USER_APP_REVIEW_LIST.md` §4](00_USER_APP_REVIEW_LIST.md#4-pending-discussion-register).

**Owned by this module**

| ID | Topic |
|----|-------|
| P-10-01 | Currency |
| P-10-02 | Top-up methods and gateway |
| P-10-03 | Top-up limits |
| P-10-04 | Paying without the wallet — **Resolved** (D-33) |
| P-10-05 | Refund destination — **Resolved** (D-32) |
| P-10-06 | Withdrawal — **Resolved** (D-32) |
| P-10-07 | Invoices and receipts |
| P-10-08 | Tax handling |
| P-10-09 | Wallet transaction history |

**Related (owned elsewhere)**

| ID | Topic |
|----|-------|
| P-01-01 | Wallet entry point |
| P-07-05 | Appointment refunds |
| P-08-02 | Minimum balance for Instant Call |
| P-08-04 | Instant Call refunds |
| P-09-02 | Minimum balance for Instant Chat |
| P-14-05 | Subscription cancellation and refund |

## 12. Acceptance criteria

- [ ] No refund is issued for an expired unused question slot (D-07 → [06](06_TEXT_QUESTION_SERVICE.md)).
- [ ] Payment and wallet alerts are handled as critical notifications under D-15 (→ [15](15_NOTIFICATIONS.md)).

- [ ] All refunds are credited to the Wallet; withdrawals leave at least ₹500 in the Wallet (D-32).
- [ ] Users can pay with the Wallet or by direct UPI/bank payment (D-33).

## 13. Change log

| Date | Change |
|------|--------|
| 2026-11-17 | Initial draft created. |
| 2026-11-19 | Referenced D-18, D-20, D-28, D-30 (refund cases and price display). |
| 2026-11-19 | D-32 (refunds to Wallet; withdrawal above ₹500) and D-33 (Wallet or direct payment) added. P-10-04, P-10-05, P-10-06 Resolved. |
