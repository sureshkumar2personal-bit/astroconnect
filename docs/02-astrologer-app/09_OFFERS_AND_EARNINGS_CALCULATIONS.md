# 09 — Offers and Earnings Calculations

| Field | Value |
|-------|-------|
| Application | Astrologer App |
| Status | Draft |
| Owned decisions | AD-127, AD-128 |
| Review list | [`00_ASTROLOGER_APP_REVIEW_LIST.md`](00_ASTROLOGER_APP_REVIEW_LIST.md) |
| Shared context | [`CONTEXT.md`](../../CONTEXT.md) |

> **Frontend UI phase.** This specification describes product behaviour. It
> does not define APIs, data structures, or backend logic. Items marked
> `PENDING DISCUSSION` must not be implemented as if decided.

---

## 1. Purpose

Defines how offer discounts affect commission and astrologer earnings, and
what offer performance is tracked. Campaign creation, campaign types, slot
allocation, and discount settings remain in [02](02_TEXT_BASED_QUESTIONS.md).

## 2. Scope / Out of scope

**In scope**
- Who bears the discount; the base on which commission is calculated.
- Offer performance metrics and their consistency with Wallet & Earnings.

**Out of scope** (owned elsewhere; referenced, not restated)
- Campaign types, editor, and labels → AD-26 ([02](02_TEXT_BASED_QUESTIONS.md)); Special Campaign label/type mandatory (AP-02-25, resolved).
- Campaign cancellation and refunds → AD-31 ([02](02_TEXT_BASED_QUESTIONS.md)).
- Separate General/Personal pricing and discounts (maximum 99%) → AD-55, AD-56 ([02](02_TEXT_BASED_QUESTIONS.md)).
- Slot allocation → AD-57 ([02](02_TEXT_BASED_QUESTIONS.md)).
- Commission rates → AD-124 ([08](08_WALLET_AND_EARNINGS.md)).

## 3. Entry points

- My Work → Text Questions → Campaign Management (AD-27 → [02](02_TEXT_BASED_QUESTIONS.md)) for offers.
- Offer performance view: placement not defined beyond Campaign Management (AP-GL-02 covers module placement in general).

## 4. Confirmed decisions

**Owned by this module** (verbatim from the decision register)

| ID | Decision |
|----|----------|
| AD-127 | **Offer discount and commission calculation:** the **astrologer bears the discount**. Commission is calculated on the amount the User actually pays after the discount, using the actual commission rate finalized for that service. Illustrative example (rate illustrative only): original price ₹100, discount ₹20, User pays ₹80; with a 10% rate, commission is ₹8 (on ₹80, not ₹100) and astrologer net earnings are ₹72. |
| AD-128 | **Offer performance:** tracks original price/revenue, discount amount, actual amount collected, commission, net astrologer earnings, number of purchased questions/slots/bookings, offer usage, and month-wise offer performance. Offer financial data must be consistent with Wallet & Earnings; revenue and discounts are never double-counted. |

**Referenced decisions**

| ID | Topic | Owning file |
|----|-------|-------------|
| AD-26 | Campaigns on any theme; Special Campaign uses the same editor | [02](02_TEXT_BASED_QUESTIONS.md) |
| AD-27 | Campaign Management location | [02](02_TEXT_BASED_QUESTIONS.md) |
| AD-31 | Campaign cancellation and refunds | [02](02_TEXT_BASED_QUESTIONS.md) |
| AD-55 | Separate General/Personal pricing | [02](02_TEXT_BASED_QUESTIONS.md) |
| AD-56 | Optional astrologer-controlled discounts, maximum 99% | [02](02_TEXT_BASED_QUESTIONS.md) |
| AD-57 | Campaign slot allocation | [02](02_TEXT_BASED_QUESTIONS.md) |
| AD-121 | Service-wise earnings | [08](08_WALLET_AND_EARNINGS.md) |
| AD-124 | Commission rates per service | [08](08_WALLET_AND_EARNINGS.md) |

## 5. User flows

### 5.1 An offer is used
1. The astrologer has set a discount for a campaign or Open Questions (AD-56 → [02](02_TEXT_BASED_QUESTIONS.md)).
2. The User pays the discounted amount.
3. The astrologer bears the discount (AD-127).
4. Commission = service commission rate × amount the User actually paid (AD-127, AD-124).
5. Astrologer net earnings = amount paid − commission (AD-127).

### 5.2 Review offer performance
The astrologer views offer performance, including month-wise figures (AD-128).

## 6. Screens and content

### 6.1 Calculation example (illustrative only — AD-127)

| Item | Value |
|------|-------|
| Original price | ₹100 |
| Discount (borne by the astrologer) | ₹20 |
| Amount paid by the User | ₹80 |
| Commission at an illustrative 10% | ₹8 (on ₹80, not ₹100) |
| Astrologer net earnings | ₹72 |

The 10% rate is illustrative only. The actual rate is the finalized rate for
the service (AD-124); the Text Questions rate is missing source information
(AP-08-02).

### 6.2 Offer performance (AD-128)
Original price/revenue; discount amount; actual amount collected;
commission; net astrologer earnings; number of purchased
questions/slots/bookings; offer usage; month-wise offer performance.

## 7. Business rules and validations

| # | Rule | Source |
|---|------|--------|
| OFR-01 | The astrologer bears the discount. | AD-127 |
| OFR-02 | Commission is calculated on the amount actually paid by the User, never on the original price. | AD-127 |
| OFR-03 | The commission rate is the finalized rate for that service; no example rate is applied as a default. | AD-127, AD-124 |
| OFR-04 | Offer figures equal the corresponding Wallet & Earnings figures for the same transactions and period. | AD-128 |
| OFR-05 | Revenue and discounts are never double-counted between offer performance and Wallet & Earnings. | AD-128 |

## 8. States and edge cases

| Case | Behaviour |
|------|-----------|
| No offer set | Full price paid; commission on the full price (AD-127); "No Offer" shown (AD-26) |
| Text Question offer | Commission rate missing: `PENDING DISCUSSION` (AP-08-02) |
| Campaign cancelled with unused purchased slots | Refunds per AD-31; offer figures stay consistent with Wallet & Earnings without double counting (AD-128) |

## 9. Notifications triggered

Commission/Offer Discount Details (category G) → AD-148 ([14](14_NOTIFICATIONS_AND_REMINDERS.md)).

## 10. Dependencies on other modules

- [02](02_TEXT_BASED_QUESTIONS.md) — campaigns, pricing, discounts.
- [08](08_WALLET_AND_EARNINGS.md) — commission rates, earnings, transactions.
- [13](13_ANALYTICS_AND_PERFORMANCE.md) — data correctness (AD-147).
- **User App:** User sees original price, discount percentage, and final payable price (User App D-20).
- **Platform Admin:** PA-11 (commission rates).

## 11. PENDING DISCUSSION

Full wording in [`00_ASTROLOGER_APP_REVIEW_LIST.md` §4](00_ASTROLOGER_APP_REVIEW_LIST.md#4-open-questions-register).

**Owned by this module:** none.

**Related**

| ID | Topic | Status |
|----|-------|--------|
| AP-02-25 | Special Campaign label/type — mandatory (AD-26) | Resolved |
| AP-08-02 | Text Questions commission rate | Open — missing source information |

## 12. Acceptance criteria

- [ ] The discount is borne by the astrologer (AD-127).
- [ ] Commission is computed on the amount paid using the service's finalized rate; the ₹100/₹20/₹80/₹8/₹72 example reproduces with a 10% test rate (AD-127).
- [ ] Offer performance shows all metrics of AD-128, month-wise, and matches Wallet & Earnings without double counting.

## 13. Change log

| Date | Change |
|------|--------|
| 2026-11-20 | Initial draft created from the Master Decision Document: AD-127, AD-128. |
| 2026-11-20 | AP-02-25 marked Resolved (AD-26 amended). |
