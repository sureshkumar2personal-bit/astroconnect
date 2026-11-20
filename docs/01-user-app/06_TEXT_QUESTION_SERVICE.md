# 06 — Text-based Question Service

| Field | Value |
|-------|-------|
| Application | User App |
| Status | Draft |
| Owned decisions | D-04 – D-08, D-17 – D-28 |
| Review list | [`00_USER_APP_REVIEW_LIST.md`](00_USER_APP_REVIEW_LIST.md) |
| Shared context | [`CONTEXT.md`](../../CONTEXT.md) |

---

## 1. Purpose

Defines the Text-based Question service: subscribing to an astrologer,
purchasing question slots from campaigns or Open Questions, asking a
question, receiving an answer, rating and reviewing it, raising a dispute,
and raising a Platform Complaint.

## 2. Scope / Out of scope

**In scope**
- Subscription prerequisite for asking a question.
- Campaigns and Open Questions as the source of question slots; General and Personal questions; pricing display.
- Question slots: purchase, use, hold, expiry, reminders.
- Asking a question and receiving an answer; question statuses shown to the user.
- Rating and review, disputes, and Platform Complaints.

**Out of scope**
- Subscription mechanics (price, duration, renewal) → [14](14_FOLLOWING_AND_SUBSCRIPTIONS.md).
- Payment methods and refunds in general → [10](10_WALLET_AND_PAYMENTS.md).
- Managing questions after purchase (lists) → [11](11_ACTIVITY_AND_SERVICE_HISTORY.md).
- Birth profile rules → [13](13_BIRTH_PROFILES_AND_KUNDLI.md).
- Remedy Tracker rules → [16](16_REMEDY_TRACKER.md).
- Astrologer-only operations: monthly quota, quota reduction, campaign allocation, commission, and settlement (Astrologer App). These are not shown in the User App (D-25).

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
| D-07 | A purchased question slot must be used by the **earlier of (1) 7 days from its purchase date and (2) the campaign expiry date**. An unused slot **expires automatically** at that point. **No refund** is given for an expired unused slot, even if expiry reminders were sent. *(Amended 2026-11-19.)* |
| D-08 | Text Questions have a **dispute** option. A dispute can be raised **within 7 days after receiving the astrologer's answer**; its purpose is to **request an additional answer**. |
| D-17 | Immediately after a Text Question answer is delivered, the user gives a **mandatory** rating (1–5 stars); a written review is **optional**. Rating and review do not block or prevent a dispute. A submitted review cannot be edited or deleted by the user; changes are requested through Platform Support. *(Amended 2026-11-20: rating mandatory — Astrologer AD-40, X-18; supersedes "Users can rate (1–5 stars) and review a Text Question answer immediately after it is delivered".)* |
| D-18 | The astrologer must answer a submitted Text Question within **30 days** (IST calendar days, D-28). If it is not answered within the deadline, the system automatically cancels the question and the user is refunded. |
| D-19 | **Disputes:** one dispute per question, raised within 7 days after the answer (D-08). The astrologer answers the dispute once, within **3 days**; if it is not answered within 3 days, the dispute moves to **Admin Review**. No further dispute can be raised after the dispute answer. |
| D-20 | **Campaigns and pricing (user view):** a campaign offers General only, Personal only, or both. General Questions are answered without the user's Horoscope/Birth Chart; Personal Questions are answered based on it. General and Personal have separate prices and optional, separate discounts (maximum 99%). The user sees the **original price, discount percentage, and final payable price**. A special or occasion-based campaign uses the same campaign workflow and always carries a clear **Special Campaign label/type**; the label is **mandatory**. Open Questions (asked without a campaign) also offer General and Personal. *(Amended 2026-11-20: Special Campaign label mandatory — Astrologer AD-26, X-25; supersedes "shown as a normal campaign with an optional special title/label, not as a separate workflow".)* |
| D-21 | **Campaign changes protect purchases:** cancellation, deletion, or slot reduction of a campaign by the astrologer does not cancel or invalidate already submitted paid questions; the astrologer must still answer them. When a campaign is **cancelled**, the user receives a **refund for purchased unused slots** (to the Wallet, D-32). When a campaign is **deleted**, no refund is issued merely because of the deletion, and a purchased, unused slot remains usable until its original deadline (D-07: the earlier of purchase + 7 days and the campaign's original expiry date); deletion neither expires it immediately nor extends or resets that deadline (whether the cancellation refund also applies to deletion is open — Astrologer AP-02-24). Slot reduction does not cancel purchased slots or submitted questions. If the astrologer extends a campaign, the extension also applies to unused purchased slots; reactivating a campaign does not restore already expired slots. *(Amended 2026-11-19. Amended 2026-11-20: refund of purchased unused slots on cancellation — Astrologer AD-31, X-16; supersedes "No refund is issued merely because a campaign was cancelled" and slot usability after cancellation.)* |
| D-22 | **User question:** question text has a maximum of **1,000** characters. General Questions allow no attachments. Personal Questions allow up to **2** attachments (Horoscope/Birth Chart files or images). |
| D-23 | **Answers:** the astrologer's answer is text (typed, or converted from voice), with a maximum of **1,500** characters, up to 3 attachments (JPEG, PDF, TXT), and links. Audio-only answers are not provided. An answer cannot be edited after it is delivered. |
| D-24 | Users **cannot manually cancel** a paid, submitted Text Question. |
| D-25 | **Text Question statuses shown to users:** New / Received (question submitted), Pending (the astrologer has opened the question), Completed (answer delivered). The astrologer-side "Settled" status and settlement details are internal and are not shown in the User App. |
| D-26 | **Expiry warning and reminders:** if a campaign is within 3 days of expiry, the user is warned before purchase. Expiry reminders are sent **3 days, 2 days, and 1 day** before expiry. Reminders do not change the expiry or refund rules. |
| D-27 | **Platform Complaint:** after a dispute answer, the user may raise a separate Platform Complaint within 7 days about an inappropriate or improper answer. The platform handles complaints separately from disputes. |
| D-28 | **IST calendar days:** slot expiry, answer deadlines, dispute windows, dispute answer deadlines, and reminder timing use IST calendar-day counting. |
| D-34 | **Question submission:** a **Preview** step is shown before final submission, following the same preview-before-final-submission principle as the astrologer answer workflow. After final submission, a question **cannot be edited**. General-to-Personal question conversion or upgrade is **not offered** in the User App. |
| D-35 | **Question attachments:** for Personal Questions (D-22), users may attach horoscope files in **PDF or JPEG** format — at most **2 files** per question and at most **10 MB** per file. Alternatively, users may use the birth details already saved in their User Profile. These rules are separate from astrologer answer attachment rules. |
| D-39 | **Astrologer Text-Based Questions service suspension (user view):** while an astrologer's Text-Based Questions service is suspended, users cannot buy new question slots from that astrologer or submit questions using newly purchased capacity. Previously purchased valid slots remain usable under the existing validity rules (D-07), and already submitted questions continue under their normal answer deadline and resolution rules (D-18, D-19). The astrologer's other services remain available unless independently unavailable; the astrologer account is not suspended. |

**Referenced decisions**

| ID | Topic | Owning file |
|----|-------|-------------|
| D-02 | Purpose of the Services tab | [01](01_NAVIGATION_AND_STRUCTURE.md) |
| D-03 | Purpose of the Activity tab | [01](01_NAVIGATION_AND_STRUCTURE.md) |
| D-11 | Remedies in the Remedy Tracker (including Dispute Answers) | [16](16_REMEDY_TRACKER.md) |
| D-15 | Critical notifications (includes question alerts) | [15](15_NOTIFICATIONS.md) |
| D-29 | Remedy completion by the user | [16](16_REMEDY_TRACKER.md) |
| D-30 | Astrologer DND / Planned Unavailability | [07](07_APPOINTMENT_SERVICE.md) |
| D-31 | Subscription benefit questions | [14](14_FOLLOWING_AND_SUBSCRIPTIONS.md) |
| D-32 | Refunds go to the Wallet | [10](10_WALLET_AND_PAYMENTS.md) |
| D-33 | Wallet or direct payment | [10](10_WALLET_AND_PAYMENTS.md) |
| D-37 | Consent for sharing birth data | [13](13_BIRTH_PROFILES_AND_KUNDLI.md) |
| D-38 | Astrologer DND: profile hidden | [05](05_ASTROLOGER_PROFILE.md) |

## 5. User flows

### 5.1 Subscribe, then purchase slots
1. The user subscribes to the astrologer (D-04). Subscription mechanics →
   [14](14_FOLLOWING_AND_SUBSCRIPTIONS.md).
2. The user chooses a campaign (a Special Campaign always carries a clear Special Campaign label/type) or Open Questions, and General or Personal (D-20).
3. The user sees the original price, discount percentage, and final payable price for the chosen type (D-20).
4. If the campaign is within 3 days of expiry, the user is warned before purchase (D-26).
5. The user purchases one or more question slots (D-05). Payment → [10](10_WALLET_AND_PAYMENTS.md).
   - Subscription benefit questions (Silver 1, Gold 3, Platinum 4) are separate from additional paid questions (D-31 → [14](14_FOLLOWING_AND_SUBSCRIPTIONS.md)).
   - Per-user purchase limit for a campaign: `PENDING DISCUSSION` (P-06-13).

### 5.2 Use or hold a slot
1. Immediately after purchase, the user may submit a question (D-06).
2. Alternatively, the user holds the slot for later (D-06). The expiry period continues while the slot is held (D-06, D-07).
3. The slot must be used by the earlier of 7 days from purchase and the campaign expiry date (D-07). Reminders are sent 3, 2, and 1 day before expiry (D-26).
4. If not used in time, it expires automatically and is not refunded, even if reminders were sent (D-07).

### 5.3 Ask a question and receive an answer
1. The user writes the question (maximum 1,000 characters) and submits it using a slot (D-22). Status: **New / Received** (D-25).
   - General Questions: no attachments. Personal Questions: up to 2 Horoscope/Birth Chart files or images (D-22).
   - Personal Questions: horoscope files in PDF or JPEG, at most 2 files of 10 MB each, or the birth details saved in the User Profile (D-35). Birth details and horoscope information are shared only with the user's consent (D-37).
   - A Preview step is shown before final submission (D-34).
   - Birth profile attached: `PENDING DISCUSSION` (P-06-07).
   - The user cannot cancel or edit the question after final submission (D-24, D-34).
2. When the astrologer opens the question, its status becomes **Pending** (D-25).
3. The astrologer answers within 30 days (D-18). The answer is text (maximum 1,500 characters), with up to 3 attachments (JPEG, PDF, TXT) and links; it cannot be edited after delivery (D-23). Status: **Completed** (D-25).
4. If the astrologer does not answer within 30 days, the question is automatically cancelled and the user is refunded (D-18).
5. If the astrologer prescribes or attaches a remedy, it also appears in the Remedy Tracker (D-11 → [16](16_REMEDY_TRACKER.md)).

### 5.4 Rate and review
Immediately after the answer is delivered, the user gives a mandatory rating (1–5 stars); a written review is optional; this does not block a dispute. A submitted review cannot be edited or deleted by the user; changes are requested through Platform Support (D-17).

### 5.5 Raise a dispute
1. Within 7 days after the answer, the user can raise one dispute to request an additional answer (D-08, D-19).
   - Information required from the user: `PENDING DISCUSSION` (P-06-16).
2. The astrologer answers once, within 3 days; otherwise the dispute moves to Admin Review (D-19).
3. A remedy in the dispute answer also appears in the Remedy Tracker (D-11).
4. No further dispute can be raised after the dispute answer (D-19).

### 5.6 Raise a Platform Complaint
After a dispute answer, the user may raise a separate Platform Complaint within 7 days about an inappropriate or improper answer (D-27).

### 5.7 Campaign changes after purchase
1. Campaign cancellation, deletion, or slot reduction does not cancel already submitted paid questions; the astrologer must still answer them (D-21).
2. **Cancellation:** the user receives a refund for purchased unused slots, to the Wallet (D-21, D-32).
3. **Deletion:** no refund is issued merely because of the deletion; a purchased unused slot stays usable until its original deadline — the earlier of purchase + 7 days and the campaign's original expiry date — and is not expired immediately, extended, or reset (D-21). Whether the cancellation refund also applies to deletion is open (Astrologer AP-02-24).
4. A campaign extension also extends unused purchased slots; reactivation does not restore expired slots (D-21).

### 5.8 Astrologer unavailable (DND / Planned Unavailability)
During the astrologer's DND / Planned Unavailability, the astrologer is unavailable for all services (D-30 → [07](07_APPOINTMENT_SERVICE.md)). The astrologer's profile is hidden and users cannot purchase or submit new questions, including Campaign, Open, and Subscription Questions; existing purchased slots keep their validity (D-38 → [05](05_ASTROLOGER_PROFILE.md)).

### 5.9 Astrologer Text-Based Questions service suspended
Users cannot buy new question slots from that astrologer. Previously purchased valid slots remain usable under D-07, and submitted questions continue under their normal deadline and resolution rules; other services of the astrologer remain available (D-39).

### 5.10 Payment
Users pay with their Wallet balance or by direct UPI/bank payment (D-33). Refunds go to the Wallet (D-32).

### 5.11 Correction requested by the astrologer
If a Personal Question is submitted using a General slot, the astrologer can Request Correction (AD-35 → Astrologer App [`02_TEXT_BASED_QUESTIONS.md`](../02-astrologer-app/02_TEXT_BASED_QUESTIONS.md); X-05).
1. The user can replace it with another General Question, without extra payment, using the same slot. No General-to-Personal upgrade or conversion is available (AD-35, D-34).
2. The original 30-day deadline continues and does not restart, regardless of the number of correction cycles (AD-35).
3. If the user does not respond before the original deadline, the question is automatically cancelled and refunded (AD-35); refunds go to the Wallet (D-32).

## 6. Screens and content

`PENDING DISCUSSION` — screen list and layout depend on P-01-07, P-06-13, and
P-11-01. Content confirmed for those screens:
- Price display per question type: original price, discount percentage, final payable price (D-20).
- Pre-purchase expiry warning when the campaign is within 3 days of expiry (D-26).
- Question field: maximum 1,000 characters; attachments only for Personal (up to 2) (D-22).
- Answer view: text up to 1,500 characters, up to 3 attachments, links (D-23).
- Statuses: New / Received, Pending, Completed (D-25).
- Rate and review; dispute; Platform Complaint actions (D-17, D-19, D-27).

## 7. Business rules and validations

| # | Rule | Source |
|---|------|--------|
| R-06-01 | A user cannot ask an astrologer a question unless the user has subscribed to that astrologer. | D-04 |
| R-06-02 | A user can purchase multiple question slots. | D-05 |
| R-06-03 | Question slots are purchased from an astrologer's **active** campaigns. | D-05 |
| R-06-04 | A slot can be used immediately after purchase; there is no waiting period. | D-06 |
| R-06-05 | A slot can be held for later use. | D-06 |
| R-06-06 | Holding a slot does not pause or extend its expiry period. | D-06 |
| R-06-07 | A slot must be used by the earlier of 7 days from its purchase date and the campaign expiry date. | D-07 |
| R-06-08 | An unused slot expires automatically at that point. | D-07 |
| R-06-09 | No refund is given for an expired unused slot, even if reminders were sent. | D-07 |
| R-06-10 | A Text Question has a dispute option. | D-08 |
| R-06-11 | A dispute must be raised within 7 days after the user receives the astrologer's answer (IST calendar days). | D-08, D-28 |
| R-06-12 | The purpose of a dispute is to request an additional answer. | D-08 |
| R-06-13 | A remedy prescribed or attached in an answer or dispute answer must also appear in the user's Remedy Tracker. | D-11 → [16](16_REMEDY_TRACKER.md) |
| R-06-14 | A rating (1–5) is mandatory immediately after the answer; a written review is optional; neither blocks a dispute; the user cannot edit or delete a submitted review. | D-17 |
| R-06-15 | The astrologer must answer within 30 days; otherwise the question is automatically cancelled and refunded. | D-18 |
| R-06-16 | One dispute per question; the astrologer answers it once within 3 days, otherwise it moves to Admin Review; no further dispute after the dispute answer. | D-19 |
| R-06-17 | Prices show original price, discount percentage, and final payable price; General and Personal have separate prices and optional discounts (maximum 99%). | D-20 |
| R-06-18 | A Special Campaign uses the same campaign workflow and always shows a clear Special Campaign label/type (mandatory). *(Rule text updated 2026-11-20 with the D-20 amendment.)* | D-20 |
| R-06-19 | Campaign cancellation, deletion, or slot reduction does not cancel submitted paid questions; cancellation refunds purchased unused slots; no refund merely because of deletion. *(Rule text updated 2026-11-20 with the D-21 amendment.)* | D-21 |
| R-06-20 | Extending a campaign extends unused purchased slots; reactivation does not restore expired slots. | D-21 |
| R-06-21 | Question text: maximum 1,000 characters. | D-22 |
| R-06-22 | General Questions allow no attachments; Personal Questions allow up to 2. | D-22 |
| R-06-23 | Answer text: maximum 1,500 characters; up to 3 attachments (JPEG, PDF, TXT) and links; no audio-only answers; no editing after delivery. | D-23 |
| R-06-24 | The user cannot manually cancel a paid, submitted question. | D-24 |
| R-06-25 | User-visible statuses: New / Received → Pending (astrologer opened) → Completed (answer delivered). Settlement status and details are not shown. | D-25 |
| R-06-26 | Pre-purchase warning within 3 days of campaign expiry; reminders 3, 2, and 1 day before expiry; reminders do not change expiry or refund rules. | D-26 |
| R-06-27 | A Platform Complaint can be raised within 7 days after the dispute answer and is handled separately from disputes. | D-27 |
| R-06-28 | Slot expiry, answer deadlines, dispute windows, dispute answer deadlines, and reminders use IST calendar days. | D-28 |
| R-06-29 | After a campaign is deleted, a purchased unused slot stays usable until its original deadline; the deadline is not shortened, extended, or reset. After cancellation, purchased unused slots are refunded. *(Rule text updated 2026-11-20 with the D-21 amendment.)* | D-21 |
| R-06-30 | A Preview step is shown before final submission; after final submission a question cannot be edited; no General-to-Personal conversion or upgrade is offered. | D-34 |
| R-06-31 | Personal Question attachments: PDF or JPEG horoscope files, at most 2 per question, at most 10 MB each; or use the birth details saved in the User Profile. | D-35 |
| R-06-32 | While an astrologer's Text-Based Questions service is suspended, no new slots can be bought; previously purchased valid slots stay usable; submitted questions continue normally. | D-39 |
| R-06-33 | During an astrologer's DND, no new questions can be purchased or submitted; existing slots keep their validity. | D-38 |
| R-06-34 | When the astrologer requests a correction, the user can only replace the question with another General Question using the same slot, without extra payment; no General-to-Personal upgrade or conversion is available, and the original deadline continues. | AD-35 (Astrologer App), D-34 |

**Pending rules**
- Whether a slot can be used only with the astrologer it was purchased from: `PENDING DISCUSSION` (P-06-15).
- One slot = one question: `PENDING DISCUSSION` (P-06-12).

## 8. States and edge cases

**Question slot states** (confirmed by D-06, D-07)

| State | Meaning |
|-------|---------|
| Purchased, unused (held) | Bought and not yet used; expiry period running |
| Used | A question has been submitted with the slot |
| Expired | Not used by the earlier of 7 days from purchase and campaign expiry; no refund |

**Question statuses shown to the user** (D-25): New / Received, Pending, Completed. Statuses for other services: `PENDING DISCUSSION` (P-11-03).

**Edge cases**

| Case | Behaviour |
|------|-----------|
| Slot reaches its expiry unused | Expires automatically; no refund, even after reminders (D-07) |
| Campaign within 3 days of expiry at purchase | Warning shown before purchase (D-26) |
| User tries to dispute more than 7 days after receiving the answer | Dispute not available (D-08, D-28) |
| Second dispute after the dispute answer | Not allowed (D-19) |
| Astrologer does not answer the dispute within 3 days | Dispute moves to Admin Review (D-19) |
| Astrologer does not answer within 30 days | Question automatically cancelled; user refunded (D-18) |
| User wants to cancel a submitted question | No manual cancel option (D-24) |
| Campaign cancelled, deleted, or reduced after purchase | Submitted paid questions still answered (D-21) |
| Campaign extended | Unused purchased slots extended (D-21) |
| Campaign reactivated | Expired slots not restored (D-21) |
| Campaign **cancelled** while the user holds an unused slot | Slot refunded to the Wallet (D-21, D-32) |
| Campaign **deleted** while the user holds an unused slot | Slot usable until its original deadline (D-21; Astrologer AP-02-24) |
| Question over 1,000 characters | Not allowed (D-22) |
| Attachment added to a General Question | Not allowed (D-22) |
| Third attachment on a Personal Question | Not allowed (D-22) |
| Subscription ends or is cancelled while slots are held | `PENDING DISCUSSION` (P-06-03) |
| Astrologer DND / Planned Unavailability while the user holds a slot | Profile hidden; no new submissions; the slot keeps its validity (D-38) |
| Astrologer's Text-Based Questions service suspended | No new slots can be bought; valid purchased slots stay usable (D-39) |
| Attachment not PDF/JPEG, larger than 10 MB, or a third file | Not allowed (D-35) |
| User tries to edit a submitted question | Not allowed; Preview is offered before submission (D-34) |
| Astrologer requests correction of a Personal Question sent with a General slot | User can replace it with another General Question, same slot, no extra payment; no upgrade to Personal; original deadline continues (AD-35, D-34) |
| Payment fails during slot purchase | `PENDING DISCUSSION` (→ [10](10_WALLET_AND_PAYMENTS.md)) |

## 9. Notifications triggered

| Notification | Category | Rule |
|--------------|----------|------|
| Question-related alerts | Critical (question) | D-15 → [15](15_NOTIFICATIONS.md) |
| Payment for slot purchase | Critical (payment/wallet) | D-15 → [15](15_NOTIFICATIONS.md) |
| Slot expiry reminders — 3, 2, and 1 day before expiry | Question | D-26 |

Full event list: `PENDING DISCUSSION` (P-15-03).

## 10. Dependencies on other modules

- [01](01_NAVIGATION_AND_STRUCTURE.md) — Services and Activity tabs.
- [05](05_ASTROLOGER_PROFILE.md) — campaigns display and profile actions.
- [07](07_APPOINTMENT_SERVICE.md) — astrologer DND / Planned Unavailability (D-30).
- [10](10_WALLET_AND_PAYMENTS.md) — slot payment and refunds.
- [11](11_ACTIVITY_AND_SERVICE_HISTORY.md) — managing questions, slots, disputes.
- [13](13_BIRTH_PROFILES_AND_KUNDLI.md) — birth profile attached to a question.
- [14](14_FOLLOWING_AND_SUBSCRIPTIONS.md) — subscription mechanics.
- [15](15_NOTIFICATIONS.md) — question and payment alerts, expiry reminders.
- [16](16_REMEDY_TRACKER.md) — remedies.
- [17](17_HELP_AND_SUPPORT.md) — relationship to support (P-17-04, P-17-05).
- Astrologer App — [`02_TEXT_BASED_QUESTIONS.md`](../02-astrologer-app/02_TEXT_BASED_QUESTIONS.md) (astrologer side of this service).

## 11. PENDING DISCUSSION

Full wording in [`00_USER_APP_REVIEW_LIST.md` §4](00_USER_APP_REVIEW_LIST.md#4-pending-discussion-register).
Retired: P-06-01 (→ D-31); P-06-02 (→ D-06, D-07); P-06-04 (→ D-21); P-06-05 (→ D-17); P-06-08 (→ D-18); P-06-09, P-06-10 (→ D-19); P-06-11 (→ D-23); P-06-17 (→ D-28).

**Owned by this module**

| ID | Topic |
|----|-------|
| P-06-03 | Held slots and questions when a subscription ends |
| P-06-06 | Question length, format, attachments — **Resolved** (D-22, D-35) |
| P-06-07 | Birth profile attached to a question |
| P-06-12 | One slot = one question |
| P-06-13 | Per-user purchase limit (campaign contents confirmed in D-20) |
| P-06-14 | Editing or cancelling a submitted question — **Resolved** (D-24, D-34) |
| P-06-15 | Slot usable only with the same astrologer |
| P-06-16 | Information required to raise a dispute |

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
- [ ] A user can submit a question immediately after purchasing a slot, or hold it; holding does not pause or extend expiry (D-06).
- [ ] An unused slot expires at the earlier of 7 days from purchase and campaign expiry, without refund (D-07).
- [ ] A dispute must be raised within 7 days after the answer and requests an additional answer (D-08).
- [ ] A rating (1–5) is required immediately after the answer, a written review is optional, neither blocks a dispute, and the user cannot edit or delete the review (D-17).
- [ ] Unanswered questions are automatically cancelled and refunded after 30 days (D-18).
- [ ] One dispute per question, answered within 3 days or moved to Admin Review (D-19).
- [ ] Prices show original price, discount percentage, and final payable price; Special Campaigns always show a clear Special Campaign label/type (D-20).
- [ ] Campaign cancellation, deletion, or reduction never cancels submitted paid questions; cancellation refunds purchased unused slots; after deletion they stay usable until their original deadline (D-21).
- [ ] Questions are limited to 1,000 characters; General has no attachments; Personal allows up to 2 (D-22).
- [ ] Answers show up to 1,500 characters, up to 3 attachments, and links, and cannot be edited after delivery (D-23).
- [ ] There is no manual cancel option for a submitted question (D-24).
- [ ] Statuses shown: New / Received, Pending, Completed; no settlement status or details (D-25).
- [ ] Warning before purchase within 3 days of campaign expiry; reminders at 3, 2, and 1 day (D-26).
- [ ] A Platform Complaint can be raised within 7 days after the dispute answer (D-27).
- [ ] Calendar-day rules use IST (D-28).
- [ ] A remedy in an answer or dispute answer appears in the Remedy Tracker (D-11).

- [ ] A Preview step is shown before final submission; submitted questions cannot be edited; no General-to-Personal conversion is offered (D-34).
- [ ] Personal Question attachments accept PDF or JPEG only, up to 2 files of 10 MB each, or saved birth details (D-35).
- [ ] During astrologer DND or a Text-Based Questions service suspension, no new slots can be bought; existing valid slots stay usable (D-38, D-39).
- [ ] On a correction request, the user can only replace the question with another General Question (same slot, no extra payment); no upgrade to Personal is offered; the original deadline continues (AD-35, D-34).

## 13. Change log

| Date | Change |
|------|--------|
| 2026-11-17 | Initial draft created from D-04 to D-08. |
| 2026-11-17 | Dispute-window wording aligned with approved interpretation; 7-day calculation linked to P-06-17. |
| 2026-11-19 | Aligned with Astrologer App decisions: D-07 amended; D-17 – D-28 added (reviews, 30-day deadline, disputes and Admin Review, pricing and special label, campaign changes, 1,000-character questions and attachments, 1,500-character answers, no manual cancel, statuses, reminders, Platform Complaint, IST). P-06-04, P-06-05, P-06-08 – P-06-11, P-06-17 retired. R-06-01 – R-06-13 preserved; R-06-14 – R-06-28 added. |
| 2026-11-19 | D-21 amended (unused slots after cancellation/deletion); D-31 referenced; P-06-01 retired; R-06-29 added. |
| 2026-11-19 | D-34, D-35, D-39 added; D-32, D-33, D-37, D-38 referenced. P-06-06 and P-06-14 Resolved. X-12 and AD-73 user-side alignment added (§5.8, §5.9). New §5.10; R-06-30 – R-06-33 added. |
| 2026-11-19 | X-05 resolved: §5.11 (correction requested by the astrologer, user side), R-06-34, an edge case, and an acceptance criterion added, referencing Astrologer AD-35 (amended: no General-to-Personal upgrade). |
| 2026-11-20 | Aligned with the Astrologer App (X-16, X-18, X-25): D-17, D-20, D-21 re-quoted (amended — mandatory rating; mandatory Special Campaign label; refund on campaign cancellation). §5.1, §5.4, §5.7, R-06-14, R-06-18, R-06-19, R-06-29, edge cases, and acceptance criteria updated. |
