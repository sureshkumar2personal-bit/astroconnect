# 10 — Ratings and Reviews

| Field | Value |
|-------|-------|
| Application | Astrologer App |
| Status | Draft |
| Owned decisions | AD-129 – AD-134 |
| Review list | [`00_ASTROLOGER_APP_REVIEW_LIST.md`](00_ASTROLOGER_APP_REVIEW_LIST.md) |
| Shared context | [`CONTEXT.md`](../../CONTEXT.md) |

> **Frontend UI phase.** This specification describes product behaviour. It
> does not define APIs, data structures, or backend logic. Items marked
> `PENDING DISCUSSION` must not be implemented as if decided.

---

## 1. Purpose

Defines how ratings and reviews are received, managed, published, hidden,
and replied to by the astrologer, how the public rating is calculated, and
what Platform Admin can do.

## 2. Scope / Out of scope

**In scope**
- Mandatory rating for all four services; optional written feedback.
- Astrologer review management: view, publish, hide, reply.
- Review statuses and the public rating.
- Platform Admin moderation (as a dependency).
- Service-wise ratings.

**Out of scope**
- Text Question rating timing and the Dispute relationship → AD-40 ([02](02_TEXT_BASED_QUESTIONS.md)).
- User-raised disputes → Text Questions only (AD-41); other services use reviews (AD-162 → [16](16_HELP_AND_SUPPORT.md)).
- Early-termination complaints → [06](06_INSTANT_CALL_AND_CHAT.md) (AD-108).

## 3. Entry points

- Placement within the tabs: `PENDING DISCUSSION` (AP-GL-02).
- Review rows → Review Details (AD-78 → [03](03_GLOBAL_NAVIGATION.md)).
- Notifications (Admin hide/remove with reason, AD-133).

## 4. Confirmed decisions

**Owned by this module** (verbatim from the decision register)

| ID | Decision |
|----|----------|
| AD-129 | **Mandatory rating:** after completion of a Text Question, Appointment, Instant Call, or Instant Chat, a **1–5 star rating is mandatory**; written feedback is optional. The User cannot directly edit or delete a submitted review but may request changes through Platform Support. The enforcement mechanism is not confirmed (AP-10-01). |
| AD-130 | **Astrologer review management:** the astrologer can view all incoming reviews. Replying is optional, with no penalty for not replying. The astrologer may publish positive/selected reviews and may hide reviews. Hidden reviews are not shown in the User App and remain fully visible to Platform Admin. The astrologer may edit or delete their own reply. Only one current reply exists per review. |
| AD-131 | **Review statuses:** **Pending Publication**, **Published**, **Hidden**; and **Replied / Not Replied**, as applicable. |
| AD-132 | **Rating calculation:** the public overall rating uses **Published** reviews only. Platform internal monitoring may consider all reviews, including Hidden reviews. |
| AD-133 | **Platform Admin review permissions:** Platform Admin can view all reviews and replies; publish or hide reviews; remove reviews for policy violations; hide or remove replies; flag and investigate reviews; and monitor negative review patterns. When Admin hides/removes a review or reply, the astrologer is notified with the reason. |
| AD-134 | **Service-wise ratings:** ratings and reviews are shown service-wise for Text Questions, Appointments, Instant Call, and Instant Chat. |

**Referenced decisions**

| ID | Topic | Owning file |
|----|-------|-------------|
| AD-40 | Text Question rating (mandatory) and Dispute | [02](02_TEXT_BASED_QUESTIONS.md) |
| AD-78 | Review → Review Details | [03](03_GLOBAL_NAVIGATION.md) |
| AD-126 | Reviews do not move earnings to Held | [08](08_WALLET_AND_EARNINGS.md) |
| AD-162 | Feedback for Appointments, Calls, and Chats via Ratings & Reviews | [16](16_HELP_AND_SUPPORT.md) |

## 5. User flows

### 5.1 A review arrives
1. A User completes a Text Question, Appointment, Instant Call, or Instant Chat and gives a mandatory 1–5 star rating; written feedback is optional (AD-129).
2. The review appears in the astrologer's review list as **Pending Publication** (AD-131).

### 5.2 Manage a review
1. The astrologer opens the review (Review Details, AD-78).
2. The astrologer may **Publish** it or **Hide** it (AD-130).
3. The astrologer may reply (optional; no penalty for not replying); only one current reply exists, which the astrologer may edit or delete (AD-130).

### 5.3 Admin moderation (astrologer view)
If Platform Admin hides or removes a review or reply, the astrologer is
notified with the reason (AD-133).

### 5.4 User change request
The User cannot edit or delete a submitted review; changes are requested
through Platform Support (AD-129).

## 6. Screens and content

| Screen | Content | Source |
|--------|---------|--------|
| Reviews list | All incoming reviews; status (Pending Publication / Published / Hidden); Replied / Not Replied; filter by service | AD-130, AD-131, AD-134 |
| Review Details | Rating; written feedback (if any); service; Publish / Hide; reply (add, edit, delete) | AD-129, AD-130 |
| Service-wise ratings | Text Questions; Appointments; Instant Call; Instant Chat | AD-134 |
| Overall public rating | Calculated from Published reviews only | AD-132 |

## 7. Business rules and validations

| # | Rule | Source |
|---|------|--------|
| REV-01 | A 1–5 star rating is mandatory after each of the four services; written feedback is optional. | AD-129 |
| REV-02 | Users cannot edit or delete their reviews; changes only via Platform Support. | AD-129 |
| REV-03 | Replying is optional with no penalty; one current reply per review; the astrologer may edit or delete it. | AD-130 |
| REV-04 | Hidden reviews are not shown in the User App but remain fully visible to Platform Admin. | AD-130 |
| REV-05 | The public overall rating uses Published reviews only. | AD-132 |
| REV-06 | Internal monitoring may use all reviews, including Hidden. | AD-132 |
| REV-07 | Admin hide/remove actions notify the astrologer with a reason. | AD-133 |
| REV-08 | A review or complaint does not move earnings to Held. | AD-126 |

## 8. States and edge cases

### 8.1 Review status transitions (AD-131)

| From | Event | To |
|------|-------|----|
| — | User submits rating/review | Pending Publication |
| Pending Publication / Hidden | Astrologer or Admin publishes | Published |
| Pending Publication / Published | Astrologer or Admin hides | Hidden |
| Any | Admin removes for policy violation | Removed from view (Admin action, AD-133) |

Reply status: Not Replied → Replied (reply added) → Not Replied (reply deleted by the astrologer or removed by Admin).

### 8.2 Edge cases

| Case | Behaviour |
|------|-----------|
| User skips the rating | Rating is mandatory; enforcement `PENDING DISCUSSION` (AP-10-01) |
| Negative review | Astrologer may hide it; it still counts for internal monitoring and stays visible to Admin (AD-130, AD-132) |
| Astrologer edits a reply | Replaces the single current reply (AD-130) |
| Admin removes a reply | Astrologer notified with reason (AD-133) |
| No Published reviews | Public overall rating based on Published only (AD-132); empty-state wording not defined |

## 9. Notifications triggered

Admin hide/remove of a review or reply, with reason (AD-133). Review
notification events are not listed among categories A–I of AD-148 beyond this.

## 10. Dependencies on other modules

- [02](02_TEXT_BASED_QUESTIONS.md) — AD-40.
- [05](05_APPOINTMENTS.md), [06](06_INSTANT_CALL_AND_CHAT.md) — services that require a rating.
- [04](04_PROFILE_AND_VERIFICATION.md) — Profile Preview shows the public view.
- [16](16_HELP_AND_SUPPORT.md) — Ratings & Reviews support category; dispute separation.
- **User App:** X-18 (mandatory rating; review visibility; User App D-10, D-17, P-05-03, P-07-10).
- **Platform Admin:** PA-03 (review moderation).

## 11. PENDING DISCUSSION

Full wording in [`00_ASTROLOGER_APP_REVIEW_LIST.md` §4](00_ASTROLOGER_APP_REVIEW_LIST.md#4-open-questions-register).

**Owned by this module**

| ID | Topic | Status |
|----|-------|--------|
| AP-10-01 | Mandatory rating enforcement mechanism | Open |

**Related**

| ID | Topic | Status |
|----|-------|--------|
| AP-GL-02 | Placement of Ratings & Reviews within the tabs | Open — missing source information |

## 12. Acceptance criteria

- [ ] A rating is required after every Text Question, Appointment, Instant Call, and Instant Chat; written feedback optional; Users cannot edit/delete reviews (AD-129).
- [ ] The astrologer can view all reviews, publish or hide them, and add/edit/delete one optional reply (AD-130).
- [ ] Hidden reviews never appear in the User App and stay visible to Admin (AD-130).
- [ ] Statuses Pending Publication, Published, Hidden, and Replied/Not Replied are shown (AD-131).
- [ ] The public rating uses Published reviews only (AD-132).
- [ ] Admin hide/remove actions notify the astrologer with a reason (AD-133).
- [ ] Ratings are shown per service (AD-134).

## 13. Change log

| Date | Change |
|------|--------|
| 2026-11-20 | Initial draft created from the Master Decision Document and ruling C4: AD-129 – AD-134. AP-10-01 added. |
