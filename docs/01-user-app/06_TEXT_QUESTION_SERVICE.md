# 06 — Text-based Question Service

| Field | Value |
|-------|-------|
| Application | User App |
| Status | Draft |
| Owned decisions | D-04, D-05, D-06, D-07, D-08 |
| Review list | [`00_USER_APP_REVIEW_LIST.md`](00_USER_APP_REVIEW_LIST.md) |
| Shared context | [`CONTEXT.md`](../../CONTEXT.md) |

---

## 1. Purpose

Defines the Text-based Question service: subscribing to an astrologer,
purchasing question slots from campaigns, asking a question, receiving an
answer, and raising a dispute.

## 2. Scope / Out of scope

**In scope**
- Subscription prerequisite for asking a question.
- Question slots: purchase, use, hold, expiry.
- Campaigns as the source of question slots.
- Asking a question and receiving an answer.
- Disputes.

**Out of scope**
- Subscription mechanics (price, duration, renewal) → [14](14_FOLLOWING_AND_SUBSCRIPTIONS.md).
- Payment methods and refunds in general → [10](10_WALLET_AND_PAYMENTS.md).
- Managing questions after purchase (lists, statuses) → [11](11_ACTIVITY_AND_SERVICE_HISTORY.md).
- Birth profile rules → [13](13_BIRTH_PROFILES_AND_KUNDLI.md).
- Remedy Tracker rules → [16](16_REMEDY_TRACKER.md).

## 3. Entry points

- Start and purchase: **Services** tab (D-02 → [01](01_NAVIGATION_AND_STRUCTURE.md)).
  Exact layout: `PENDING DISCUSSION` (P-01-07).
- From an astrologer profile: `PENDING DISCUSSION` (P-05-06).
- Manage purchased or used questions and slots: **Activity** tab
  (D-03 → [01](01_NAVIGATION_AND_STRUCTURE.md)). Where held slots appear:
  `PENDING DISCUSSION` (P-01-09).

## 4. Confirmed decisions

**Owned by this module** (verbatim from the decision register)

| ID | Decision |
|----|----------|
| D-04 | A user must **subscribe** to an astrologer before asking that astrologer a question. |
| D-05 | Users can purchase **multiple question slots** from an astrologer's **active campaigns**. |
| D-06 | A purchased slot can be **used immediately or held** for later. There is **no waiting period**: the user can submit a question immediately after purchase. **Holding a slot does not pause or extend** its expiry period. |
| D-07 | A purchased question slot must be used **within 7 days from its purchase date**. An unused slot **expires automatically after 7 days**. **No refund** is given for an expired unused slot. |
| D-08 | Text Questions have a **dispute** option. A dispute can be raised **within 7 days after receiving the astrologer's answer**; its purpose is to **request an additional answer**. |

**Referenced decisions**

| ID | Topic | Owning file |
|----|-------|-------------|
| D-02 | Purpose of the Services tab | [01](01_NAVIGATION_AND_STRUCTURE.md) |
| D-03 | Purpose of the Activity tab | [01](01_NAVIGATION_AND_STRUCTURE.md) |
| D-11 | Remedies in the Remedy Tracker | [16](16_REMEDY_TRACKER.md) |
| D-15 | Critical notifications (includes question alerts) | [15](15_NOTIFICATIONS.md) |

## 5. User flows

### 5.1 Subscribe, then purchase slots
1. The user subscribes to the astrologer (D-04). Subscription mechanics →
   [14](14_FOLLOWING_AND_SUBSCRIPTIONS.md).
2. The user purchases one or more question slots from the astrologer's
   active campaigns (D-05). Payment → [10](10_WALLET_AND_PAYMENTS.md).
   - How subscription and slot purchase relate: `PENDING DISCUSSION` (P-06-01).
   - What a campaign specifies and purchase limits: `PENDING DISCUSSION` (P-06-13).

### 5.2 Use or hold a slot
1. Immediately after purchase, the user may submit a question (D-06).
2. Alternatively, the user holds the slot for later (D-06). The 7-day
   expiry continues while the slot is held (D-06, D-07).
3. If the slot is not used within 7 days from its purchase date, it expires
   automatically and is not refunded (D-07).

### 5.3 Ask a question and receive an answer
1. The user writes and submits the question using a slot.
   - Question length, format, attachments: `PENDING DISCUSSION` (P-06-06).
   - Birth profile attached: `PENDING DISCUSSION` (P-06-07).
   - Edit or cancel after submitting: `PENDING DISCUSSION` (P-06-14).
2. The astrologer answers.
   - Answer deadline and non-answer handling: `PENDING DISCUSSION` (P-06-08).
   - Answer formats: `PENDING DISCUSSION` (P-06-11).
3. If the astrologer prescribes or attaches a remedy, it also appears in the
   Remedy Tracker (D-11 → [16](16_REMEDY_TRACKER.md)).

### 5.4 Raise a dispute
1. Within 7 days after receiving the answer, the user can raise a dispute
   to request an additional answer (D-08).
   - Information required from the user: `PENDING DISCUSSION` (P-06-16).
   - Disputes per question: `PENDING DISCUSSION` (P-06-09).
   - Who handles it and the deadline for the additional answer:
     `PENDING DISCUSSION` (P-06-10).

## 6. Screens and content

`PENDING DISCUSSION` — screen list and content depend on P-01-07, P-06-06,
P-06-11, P-06-13, and P-11-01.

## 7. Business rules and validations

| # | Rule | Source |
|---|------|--------|
| R-06-01 | A user cannot ask an astrologer a question unless the user has subscribed to that astrologer. | D-04 |
| R-06-02 | A user can purchase multiple question slots. | D-05 |
| R-06-03 | Question slots are purchased from an astrologer's **active** campaigns. | D-05 |
| R-06-04 | A slot can be used immediately after purchase; there is no waiting period. | D-06 |
| R-06-05 | A slot can be held for later use. | D-06 |
| R-06-06 | Holding a slot does not pause or extend its expiry period. | D-06 |
| R-06-07 | A slot must be used within 7 days from its purchase date. | D-07 |
| R-06-08 | An unused slot expires automatically after 7 days. | D-07 |
| R-06-09 | No refund is given for an expired unused slot. | D-07 |
| R-06-10 | A Text Question has a dispute option. | D-08 |
| R-06-11 | A dispute must be raised within 7 days after the user receives the astrologer's answer. Exact calculation of the 7-day period: `PENDING DISCUSSION` (P-06-17). | D-08 |
| R-06-12 | The purpose of a dispute is to request an additional answer. | D-08 |
| R-06-13 | A remedy prescribed or attached in an answer must also appear in the user's Remedy Tracker. | D-11 → [16](16_REMEDY_TRACKER.md) |

**Pending rules**
- How the 7-day periods are measured (time of day, time zone): `PENDING DISCUSSION` (P-06-17).
- Whether a slot can be used only with the astrologer it was purchased from: `PENDING DISCUSSION` (P-06-15).
- One slot = one question: `PENDING DISCUSSION` (P-06-12).
- Reviews for Text Questions: `PENDING DISCUSSION` (P-06-05).

## 8. States and edge cases

**Question slot states** (confirmed by D-06, D-07)

| State | Meaning |
|-------|---------|
| Purchased, unused (held) | Bought and not yet used; expiry period running |
| Used | A question has been submitted with the slot |
| Expired | Not used within 7 days from purchase; no refund |

Question and dispute statuses: `PENDING DISCUSSION` (P-11-03).

**Edge cases**

| Case | Behaviour |
|------|-----------|
| Slot reaches 7 days from purchase unused | Expires automatically; no refund (D-07) |
| User tries to dispute more than 7 days after receiving the answer | Dispute not available (D-08); exact calculation `PENDING DISCUSSION` (P-06-17) |
| Subscription ends or is cancelled while slots are held | `PENDING DISCUSSION` (P-06-03) |
| Campaign ends or changes after purchase | `PENDING DISCUSSION` (P-06-04) |
| Astrologer does not answer | `PENDING DISCUSSION` (P-06-08) |
| Payment fails during slot purchase | `PENDING DISCUSSION` (→ [10](10_WALLET_AND_PAYMENTS.md)) |

## 9. Notifications triggered

| Notification | Category | Rule |
|--------------|----------|------|
| Question-related alerts | Critical (question) | D-15 → [15](15_NOTIFICATIONS.md) |
| Payment for slot purchase | Critical (payment/wallet) | D-15 → [15](15_NOTIFICATIONS.md) |

Exact events (e.g. answer received, dispute updates, any reminder before
slot expiry): `PENDING DISCUSSION` (P-15-03).

## 10. Dependencies on other modules

- [01](01_NAVIGATION_AND_STRUCTURE.md) — Services and Activity tabs.
- [05](05_ASTROLOGER_PROFILE.md) — campaigns display and profile actions.
- [10](10_WALLET_AND_PAYMENTS.md) — slot payment.
- [11](11_ACTIVITY_AND_SERVICE_HISTORY.md) — managing questions, slots, disputes.
- [13](13_BIRTH_PROFILES_AND_KUNDLI.md) — birth profile attached to a question.
- [14](14_FOLLOWING_AND_SUBSCRIPTIONS.md) — subscription mechanics.
- [15](15_NOTIFICATIONS.md) — question and payment alerts.
- [16](16_REMEDY_TRACKER.md) — remedies.

## 11. PENDING DISCUSSION

Full wording in [`00_USER_APP_REVIEW_LIST.md` §4](00_USER_APP_REVIEW_LIST.md#4-pending-discussion-register).
Retired: P-06-02 (resolved into D-06, D-07).

**Owned by this module**

| ID | Topic |
|----|-------|
| P-06-01 | Subscription vs slot purchase |
| P-06-03 | Held slots and questions when a subscription ends |
| P-06-04 | Purchased slots when a campaign ends or changes |
| P-06-05 | Reviews for Text Questions |
| P-06-06 | Question length, format, attachments |
| P-06-07 | Birth profile attached to a question |
| P-06-08 | Answer deadline and non-answer handling |
| P-06-09 | Disputes per question |
| P-06-10 | Dispute handling and additional-answer deadline |
| P-06-11 | Answer formats |
| P-06-12 | One slot = one question |
| P-06-13 | Campaign definition |
| P-06-14 | Editing or cancelling a submitted question |
| P-06-15 | Slot usable only with the same astrologer |
| P-06-16 | Information required to raise a dispute |
| P-06-17 | How 7-day periods are measured |

**Related (owned elsewhere)**

| ID | Topic |
|----|-------|
| P-01-07 | Services tab layout |
| P-01-09 | Where held slots appear |
| P-05-06 | Actions on the astrologer profile |
| P-11-03 | Statuses per service |
| P-14-02 | Nature of a subscription |
| P-15-03 | Exact critical notification events |

## 12. Acceptance criteria

- [ ] A user who has not subscribed to an astrologer cannot ask that astrologer a question (D-04).
- [ ] A user can purchase multiple question slots from an astrologer's active campaigns (D-05).
- [ ] A user can submit a question immediately after purchasing a slot (D-06).
- [ ] A user can hold a purchased slot for later (D-06).
- [ ] Holding a slot does not pause or extend its expiry (D-06).
- [ ] An unused slot expires automatically 7 days from its purchase date (D-07).
- [ ] No refund is given for an expired unused slot (D-07).
- [ ] A dispute must be raised within 7 days after the answer is received (D-08); the exact 7-day calculation follows the answer to P-06-17.
- [ ] A dispute requests an additional answer (D-08).
- [ ] A remedy prescribed or attached in an answer appears in the Remedy Tracker (D-11).

## 13. Change log

| Date | Change |
|------|--------|
| 2026-11-17 | Initial draft created from D-04 to D-08. |
| 2026-11-17 | Dispute-window wording aligned with approved interpretation; 7-day calculation linked to P-06-17. |
