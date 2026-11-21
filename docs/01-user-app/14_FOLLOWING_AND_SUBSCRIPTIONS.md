# 14 — Following and Subscriptions

| Field | Value |
|-------|-------|
| Application | User App |
| Status | Draft |
| Owned decisions | D-31, D-36, D-50 (the subscription prerequisite D-04 is owned by 06) |
| Review list | [`00_USER_APP_REVIEW_LIST.md`](00_USER_APP_REVIEW_LIST.md) |
| Shared context | [`CONTEXT.md`](../../CONTEXT.md) |

---

## 1. Purpose

Defines how users follow and subscribe to astrologers, and how they manage
those relationships.

## 2. Scope / Out of scope

**In scope**
- Follow and Subscribe actions.
- Subscription terms: price, duration, renewal, cancellation.
- The user's list of followed and subscribed astrologers.
- Live Sessions and posts from followed and subscribed astrologers (user view, D-50).

**Out of scope**
- Why a subscription is needed to ask a question → D-04 → [06](06_TEXT_QUESTION_SERVICE.md).
- Question slots and campaigns → [06](06_TEXT_QUESTION_SERVICE.md).
- Payment processing → [10](10_WALLET_AND_PAYMENTS.md).

## 3. Entry points

- List of followed and subscribed astrologers: `PENDING DISCUSSION` (P-01-02).
- Follow/Subscribe action on an astrologer profile: `PENDING DISCUSSION` (P-05-06).

## 4. Confirmed decisions

**Owned by this module** (verbatim from the decision register)

| ID | Decision |
|----|----------|
| D-31 | **Subscription benefit questions:** a Silver subscription includes **1** benefit question, Gold includes **3**, and Platinum includes **4**. Benefit questions are shown separately from additional normal paid questions purchased by subscribers. Subscription benefit questions follow the existing **7-day purchased-slot validity** rule (D-07). *(Amended 2026-11-19.)* |
| D-36 | **Follow and Subscribe:** Follow is **free**, and following an astrologer never subscribes automatically. Subscribe is **paid**, and a successful subscription automatically follows that astrologer. Auto-renewal is optional and is **not enabled by default**. Subscription price, duration/term options, detailed renewal rules, and cancellation/refund rules are on hold (P-14-02 – P-14-05). |
| D-50 | **Live Sessions and posts (user view):** Live Sessions are free; only the audience selected by the astrologer (Public, Followers, Subscribers, or specific subscription tiers) receives Live notifications and can comment; there is no recording or replay. Users can Like and Comment on astrologers' General Posts. Subscriber-only content is available only to users with an active subscription of the selected tier; users with an expired subscription cannot access it. |

**Referenced decisions**

| ID | Topic | Owning file |
|----|-------|-------------|
| D-04 | Subscription prerequisite for Text Questions | [06](06_TEXT_QUESTION_SERVICE.md) |
| D-15 | Critical notifications (includes subscription alerts) | [15](15_NOTIFICATIONS.md) |

## 5. User flows

`PENDING DISCUSSION`:
- Follow an astrologer — free; following never subscribes (D-36).
- Subscribe to an astrologer — paid; a successful subscription automatically follows the astrologer (D-36). Price and duration: **on hold** (P-14-02, P-14-03).
- Renew — auto-renewal is optional and not enabled by default (D-36); detailed rules **on hold** (P-14-04).
- Cancel — **on hold** (P-14-05).

A subscription is required before the user can ask that astrologer a
question (D-04 → [06](06_TEXT_QUESTION_SERVICE.md)).

**Live Sessions and posts (D-50):** users in the audience selected by the astrologer receive Live notifications and can comment; Live is free and not recorded. Users can Like and Comment on General Posts. Subscriber-only content is available only with an active subscription of the selected tier. Where users see Live Sessions and posts in the app: `PENDING DISCUSSION` (P-14-07).

## 6. Screens and content

`PENDING DISCUSSION` (P-01-02); subscription price and duration **on hold** (P-14-02, P-14-03).

## 7. Business rules and validations

Confirmed rules owned by this module: R-14-01, R-14-02 (D-31), listed below.

**Pending rules**
- Nature, price and duration of a subscription (P-14-02, P-14-03).
- Renewal and auto-renewal (P-14-04).
- Cancellation and refund (P-14-05).
- Whether a subscription is required for Appointment, Instant Call, Instant
  Chat (P-07-08, P-08-06, P-09-06).
- Subscription benefit questions follow the 7-day purchased-slot validity rule (D-31, D-07).

| # | Rule | Source |
|---|------|--------|
| R-14-01 | A Silver subscription includes 1 benefit question, Gold 3, and Platinum 4. | D-31 |
| R-14-02 | Benefit questions are shown separately from additional normal paid questions purchased by subscribers. | D-31 |
| R-14-03 | Follow is free and never subscribes automatically. | D-36 |
| R-14-04 | Subscribe is paid; a successful subscription automatically follows the astrologer. | D-36 |
| R-14-05 | Auto-renewal is optional and not enabled by default. | D-36 |
| R-14-06 | Subscription benefit questions follow the 7-day purchased-slot validity rule. | D-31 |
| R-14-07 | Only the audience selected by the astrologer receives Live notifications and can comment; no Live recording or replay. | D-50 |
| R-14-08 | Users with an expired subscription cannot access subscriber-only content. | D-50 |

## 8. States and edge cases

| Case | Behaviour |
|------|-----------|
| Subscription ends or is cancelled while question slots are held | `PENDING DISCUSSION` (P-06-03) |
| Subscription expires | Subscriber-only content no longer accessible (D-50); other effects `PENDING DISCUSSION` (P-14-02, P-14-04) |

## 9. Notifications triggered

| Notification | Category | Rule |
|--------------|----------|------|
| Subscription alerts | Critical (subscription) | D-15 → [15](15_NOTIFICATIONS.md) |

Exact events: `PENDING DISCUSSION` (P-15-03).

## 10. Dependencies on other modules

- [05](05_ASTROLOGER_PROFILE.md) — Follow/Subscribe actions (P-05-06).
- [06](06_TEXT_QUESTION_SERVICE.md) — subscription prerequisite (D-04).
- [10](10_WALLET_AND_PAYMENTS.md) — payment, if subscriptions are paid (P-14-02).
- [15](15_NOTIFICATIONS.md) — subscription alerts.

## 11. PENDING DISCUSSION

Full wording in [`00_USER_APP_REVIEW_LIST.md` §4](00_USER_APP_REVIEW_LIST.md#4-pending-discussion-register).

**Owned by this module**

| ID | Topic |
|----|-------|
| P-14-01 | Follow vs Subscribe — **Resolved** (D-36) |
| P-14-02 | Free, paid, or time-limited — **On hold** (X-14) |
| P-14-03 | Price and duration — **On hold** (X-14) |
| P-14-04 | Renewal and auto-renewal — **On hold** (X-14) |
| P-14-05 | Cancellation and refund — **On hold** (X-14) |
| P-14-06 | Validity of subscription benefit questions — **Resolved** (D-31) |
| P-14-07 | Where users see Live Sessions and posts |

**Related (owned elsewhere)**

| ID | Topic |
|----|-------|
| P-01-02 | Entry point |
| P-05-06 | Actions on the astrologer profile |
| P-06-03 | Held slots when a subscription ends |
| P-07-08 | Subscription for appointments |
| P-08-06 | Subscription for Instant Call |
| P-09-06 | Subscription for Instant Chat |

## 12. Acceptance criteria

- [ ] Subscription alerts are handled as critical notifications under D-15 (→ [15](15_NOTIFICATIONS.md)).
- [ ] Silver, Gold, and Platinum subscriptions include 1, 3, and 4 benefit questions, shown separately from additional paid questions (D-31).

No other confirmed criteria owned by this module yet. The subscription
prerequisite is verified in [06](06_TEXT_QUESTION_SERVICE.md).

- [ ] Follow is free and never subscribes; Subscribe is paid and automatically follows; auto-renewal is off by default (D-36).
- [ ] Subscription benefit questions follow the 7-day purchased-slot validity rule (D-31).
- [ ] Live notifications and comments are limited to the selected audience; users can Like and Comment on posts; expired subscribers cannot access subscriber-only content (D-50).

## 13. Change log

| Date | Change |
|------|--------|
| 2026-11-17 | Initial draft created. |
| 2026-11-19 | Noted the subscription benefit questions dependency (P-06-01; Astrologer App AD-65, X-14). No decision changed. |
| 2026-11-19 | D-31 added (benefit questions per subscription tier). P-06-01 retired; P-14-06 added. R-14-01, R-14-02 added. |
| 2026-11-19 | D-31 amended (7-day validity); D-36 added (Follow free; Subscribe paid and auto-follows; auto-renewal optional, off by default). P-14-01, P-14-06 Resolved; P-14-02 – P-14-05 on hold. |
| 2026-11-20 | Aligned with the Astrologer App (X-22): D-50 added (Live Sessions and posts, user view); R-14-07, R-14-08 added; P-14-07 added. |
