# 16 — Help and Support

| Field | Value |
|-------|-------|
| Application | Astrologer App |
| Status | Draft |
| Owned decisions | AD-158 – AD-162 |
| Review list | [`00_ASTROLOGER_APP_REVIEW_LIST.md`](00_ASTROLOGER_APP_REVIEW_LIST.md) |
| Shared context | [`CONTEXT.md`](../../CONTEXT.md) |

> **Frontend UI phase.** This specification describes product behaviour. It
> does not define APIs, data structures, or backend logic. Items marked
> `PENDING DISCUSSION` must not be implemented as if decided.

---

## 1. Purpose

Defines Help & Support, the dedicated support centre for issues raised by
the astrologer: categories, support tickets, user-blocking requests, and the
separation between astrologer support and User-raised disputes.

## 2. Scope / Out of scope

**In scope**
- Support categories and tickets.
- Requests to block a User.
- Dispute separation rules.

**Out of scope**
- Text Question Disputes (answered in the Text Questions workflow) → AD-41 ([02](02_TEXT_BASED_QUESTIONS.md)).
- Reviews and feedback for Appointments, Instant Call, Instant Chat → [10](10_RATINGS_AND_REVIEWS.md).
- A general "Disputes & Complaints" module for User-raised disputes — not created (AD-158).

## 3. Entry points

- Placement within the tabs: `PENDING DISCUSSION` (AP-GL-02).
- Category I notifications (AD-148).

## 4. Confirmed decisions

**Owned by this module** (verbatim from the decision register)

| ID | Decision |
|----|----------|
| AD-158 | **Help & Support scope:** Help & Support is the dedicated support centre for issues raised by the astrologer. There is no general Astrologer "Disputes & Complaints" module for User-raised disputes. |
| AD-159 | **Support categories:** Account/Profile/KYC; Text Questions; Text Question Disputes/Clarifications; Campaigns/Quota; Appointments; Instant Call/Chat; Wallet/Earnings/Commission/Settlement/Withdrawal; Subscription/Offers; Ratings & Reviews; Audience/Customers; Live Sessions; Content/Posts; Remedies/Reports; Rewards/Notifications; App/Technical; Other/General Support. Other/General Support is always available. |
| AD-160 | **Support ticket:** a ticket has Category/Subcategory; Issue Description; Related ID; Screenshots/Documents; Ticket ID; Ticket Status; Platform Replies; Ticket History; and a Reopen option where allowed. Ticket statuses as listed in the Master Decision Document (described there as suggested): Open, Under Review, Awaiting Astrologer Response, Resolved, Closed. |
| AD-161 | **User blocking:** if an astrologer wants a User blocked, the request goes to Platform Admin for review. The astrologer cannot block a User unilaterally. |
| AD-162 | **Dispute separation:** Text Question disputes are answered by the astrologer within the Text Questions workflow (AD-41). For Appointments, Instant Call, and Instant Chat, User feedback is handled through Ratings & Reviews; there is no separate User-dispute section for these services. Platform Admin handles User-raised disputes. Astrologer-raised platform issues use Help & Support. |

**Referenced decisions**

| ID | Topic | Owning file |
|----|-------|-------------|
| AD-41 | Text Question Dispute and Admin Review | [02](02_TEXT_BASED_QUESTIONS.md) |
| AD-42 | Platform Complaint (Text Questions) | [02](02_TEXT_BASED_QUESTIONS.md) |
| AD-108 | Early-termination complaints | [06](06_INSTANT_CALL_AND_CHAT.md) |
| AD-129 | User review change requests through Platform Support | [10](10_RATINGS_AND_REVIEWS.md) |
| AD-148 | Platform and Support notifications | [14](14_NOTIFICATIONS_AND_REMINDERS.md) |

## 5. User flows

### 5.1 Raise a ticket
1. The astrologer opens Help & Support and selects a category and subcategory (AD-159, AD-160).
2. The astrologer enters the issue description, a related ID (for example a Question, Appointment, Consultation, or Transaction ID), and optional screenshots/documents (AD-160).
3. A Ticket ID is created and the ticket shows its Ticket Status (AD-160; status list confirmation: AP-16-01).
4. Platform replies appear in the ticket history; the astrologer is notified (AD-148).
5. The astrologer may reopen a ticket where allowed (AD-160; conditions AP-16-02).

### 5.2 Request a User block
The astrologer raises a request; Platform Admin reviews it. The astrologer cannot block unilaterally (AD-161).

### 5.3 Which channel to use (AD-162)

| Situation | Channel |
|-----------|---------|
| User raises a Text Question Dispute | Astrologer answers inside Text Questions (AD-41) |
| User feedback on Appointment, Instant Call, Instant Chat | Ratings & Reviews ([10](10_RATINGS_AND_REVIEWS.md)) |
| User-raised disputes generally | Handled by Platform Admin |
| Astrologer-raised platform issue | Help & Support ticket |

## 6. Screens and content

### 6.1 Support categories (AD-159)
Account/Profile/KYC · Text Questions · Text Question Disputes/Clarifications ·
Campaigns/Quota · Appointments · Instant Call/Chat ·
Wallet/Earnings/Commission/Settlement/Withdrawal · Subscription/Offers ·
Ratings & Reviews · Audience/Customers · Live Sessions · Content/Posts ·
Remedies/Reports · Rewards/Notifications · App/Technical · Other/General Support.

Subcategories are not defined in the Master Decision Document and are not invented.

### 6.2 Ticket (AD-160)
Category/Subcategory; Issue Description; Related ID; Screenshots/Documents;
Ticket ID; Ticket Status; Platform Replies; Ticket History; Reopen (where
allowed).

## 7. Business rules and validations

| # | Rule | Source |
|---|------|--------|
| SUP-01 | Help & Support handles astrologer-raised issues only. | AD-158 |
| SUP-02 | Other/General Support is always available. | AD-159 |
| SUP-03 | Blocking a User requires Platform Admin review. | AD-161 |
| SUP-04 | No User-dispute section exists for Appointments, Instant Call, or Instant Chat. | AD-162 |
| SUP-05 | Text Question disputes are answered in Text Questions, not in Help & Support. | AD-162, AD-41 |

## 8. States and edge cases

Ticket statuses (AD-160; listed as "suggested" in the source, confirmation
AP-16-01): Open, Under Review, Awaiting Astrologer Response, Resolved,
Closed. Transitions between them are not defined; reopen conditions: AP-16-02.

| Case | Behaviour |
|------|-----------|
| No matching category | Other/General Support (AD-159) |
| Ticket resolved | Ticket Resolved/Closed notification (AD-148) |

## 9. Notifications triggered

Category I (Admin Announcements; Support Ticket Updates; Platform Replies;
Ticket Resolved/Closed; Policy/App Updates) → AD-148 ([14](14_NOTIFICATIONS_AND_REMINDERS.md)).

## 10. Dependencies on other modules

- [02](02_TEXT_BASED_QUESTIONS.md) — disputes; [10](10_RATINGS_AND_REVIEWS.md) — reviews; [11](11_AUDIENCE.md) — blocked-user context.
- **User App:** User-side support is in User App `17_HELP_AND_SUPPORT.md`; no shared rule changed.
- **Platform Admin:** PA-01 (disputes), PA-02 (complaints), PA-09 (blocking), PA-10 (tickets and announcements).

## 11. PENDING DISCUSSION

Full wording in [`00_ASTROLOGER_APP_REVIEW_LIST.md` §4](00_ASTROLOGER_APP_REVIEW_LIST.md#4-open-questions-register).

**Owned by this module**

| ID | Topic | Status |
|----|-------|--------|
| AP-16-01 | Confirm the "suggested" ticket statuses as final | Open |
| AP-16-02 | Reopen conditions | Open |

## 12. Acceptance criteria

- [ ] Help & Support is the astrologer's support centre; no general User-dispute module exists (AD-158).
- [ ] All 16 categories are available, including Other/General Support (AD-159).
- [ ] Tickets have all fields of AD-160 with platform replies and history.
- [ ] User-blocking requests go to Platform Admin (AD-161).
- [ ] Dispute separation follows AD-162.

## 13. Change log

| Date | Change |
|------|--------|
| 2026-11-20 | Initial draft created from the Master Decision Document: AD-158 – AD-162. AP-16-01, AP-16-02 added. |
