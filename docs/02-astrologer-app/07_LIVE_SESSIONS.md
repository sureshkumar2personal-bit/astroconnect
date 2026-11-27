# 07 — Live Sessions

| Field | Value |
|-------|-------|
| Application | Astrologer App |
| Status | Draft |
| Owned decisions | AD-112 – AD-119, AD-169 – AD-171 |
| Review list | [`00_ASTROLOGER_APP_REVIEW_LIST.md`](00_ASTROLOGER_APP_REVIEW_LIST.md) |
| Shared context | [`CONTEXT.md`](../../CONTEXT.md) |

> **Frontend UI phase.** This specification describes product behaviour. It
> does not define APIs, data structures, or backend logic. Items marked
> `PENDING DISCUSSION` must not be implemented as if decided.

---

## 1. Purpose

Defines Live Sessions: who can go live and how often, scheduling and
starting, audience selection, preview, comments and moderation, pause and
resume, notifications, interruption handling, and the post-Live summary.

## 2. Scope / Out of scope

**In scope**
- Eligibility and the one-per-calendar-month limit.
- Schedule Live and Start Now; Topic, Description, Thumbnail; audience.
- Preview/Test, comments, Mute/Remove, Pause/Resume.
- Live notifications and post-Live summary.

**Out of scope**
- Paid Live, Live payments, and Live earnings: not part of the current product (AD-113); a separate future requirement.
- Recording and replay: not available (AD-117).
- Live analytics → [13](13_ANALYTICS_AND_PERFORMANCE.md) (AD-145).
- User-side Live viewing → User App (X-22).

## 3. Entry points

- **Live** tab (AD-03 → [01](01_HOME_SCREEN.md)).
- Home Quick Action **Go Live** (AD-21 → [01](01_HOME_SCREEN.md)).
- Notifications category F (AD-148).

## 4. Confirmed decisions

**Owned by this module** (verbatim from the decision register)

| ID | Decision |
|----|----------|
| AD-112 | **Live eligibility and frequency:** every Verified Astrologer can start a Live Session without Admin approval. One Live Session is allowed per calendar month. If the astrologer cancels a scheduled Live, they may schedule another Live in the same month. |
| AD-113 | **Live is free:** Live is free for now; there is no current paid Live payment or earnings workflow. Paid Live is a separate future requirement; if it is introduced later, Live earnings are shown separately in Wallet. |
| AD-114 | **Scheduling and audience:** both **Schedule Live** and **Start Now** are available. Topic is required; Description and Thumbnail are optional. *(Amended 2026-11-27: Description was required.)* The astrologer chooses the audience: Public, Followers, Subscribers, or specific subscription tiers (for example Silver or Gold). Only the selected audience receives Live notifications. |
| AD-115 | **Preview and interaction:** a Preview/Test is available before starting. Comments are available only to the audience selected by the astrologer. The astrologer may answer questions/comments at their discretion and has no obligation to answer every comment. The astrologer may **Mute** or **Remove** users during a Live. |
| AD-116 | **Pause and resume:** the astrologer may Pause and Resume a Live. The Live must resume within **5 minutes**; otherwise it ends automatically. |
| AD-117 | **No recording:** there is no Live recording or replay for now. |
| AD-118 | **Live notifications:** the selected audience is notified when a Live is scheduled, with reminders **1 day**, **1 hour**, and **15 minutes** before, and a **Live Started** notification. Users are notified if a scheduled Live is cancelled or the astrologer does not show. On technical interruption, resuming is attempted; if the Live cannot continue, the interruption is recorded and users are notified. |
| AD-119 | **Post-Live summary:** shows Live duration, participant count, and comment count. No participant capacity limits or account-based participant tiers apply. |
| AD-169 | **Live History:** the Live section has a Live History tab listing every saved session (topic, date and time, audience, duration, participants, comments, and a Completed or Ended early status) with search by topic and a month filter. Selecting View details opens a right-side details panel with the session's date and time, duration, audience, status, total and unique participants, peak concurrent viewers, total comments, unique commenters ("Not available" where a value was not recorded), a View comments list, and the note that no replay is available. Completed and ended Lives are saved to Live History automatically. *(Added 2026-11-27 at the product owner's request; extends AD-119.)* |
| AD-170 | **Live Settings:** the Live section has a Live Settings tab where the astrologer sets, for future lives: who can watch by default (Public, Followers, Subscribers, specific subscription tiers), who can comment (Everyone, Followers, Subscribers, specific tiers, or Comments Off), comment priority (Chronological, Followers First, Subscribers First), and which comment tools are available during a live (Slow mode: one comment per viewer every 10 seconds; Pin comment; Mute commenter; Block commenter). Saved settings apply to the next live; the default audience prefills Create Live. *(Added 2026-11-27 at the product owner's request; extends AD-115.)* |
| AD-171 | **Create Live flow:** Create Live offers Schedule Live and Start Now, a preview before scheduling or going live (with Edit and Confirm), validation of Topic, date and time and tiers, and a disabled Paid Live row marked Not available yet (AD-113). Once the month's live is used or a live is scheduled, the form is disabled and shows when the next live is available. Cancelling a scheduled live frees the month again (AD-112). *(Added 2026-11-27 at the product owner's request.)* |

**Referenced decisions**

| ID | Topic | Owning file |
|----|-------|-------------|
| AD-03 | Live tab | [01](01_HOME_SCREEN.md) |
| AD-21 | Go Live Quick Action | [01](01_HOME_SCREEN.md) |
| AD-72 | Subscription tiers Silver, Gold, Platinum | [02](02_TEXT_BASED_QUESTIONS.md) |
| AD-85 | Verification statuses (Verified Astrologer) | [04](04_PROFILE_AND_VERIFICATION.md) |
| AD-145 | Live analytics: Live Sessions, Participants, Comments | [13](13_ANALYTICS_AND_PERFORMANCE.md) |
| AD-148 | Live notification events (category F) | [14](14_NOTIFICATIONS_AND_REMINDERS.md) |

## 5. User flows

### 5.1 Schedule a Live
1. The astrologer opens the Live tab or the Go Live Quick Action.
2. The app checks eligibility: Verified Astrologer (AD-112; verification steps AP-04-01) and no Live yet in the current calendar month (AD-112).
3. The astrologer chooses **Schedule Live** and enters Topic (required), Description (optional), and Thumbnail (optional) (AD-114).
4. The astrologer selects the audience: Public, Followers, Subscribers, or specific subscription tiers (AD-114).
5. The selected audience is notified that the Live is scheduled; reminders follow 1 day, 1 hour, and 15 minutes before (AD-118).

### 5.2 Start Now
1. The astrologer chooses **Start Now**, enters Topic and Description, and selects the audience (AD-114).
2. The astrologer may use Preview/Test before starting (AD-115).
3. The Live starts and the selected audience receives **Live Started** (AD-118).

### 5.3 During the Live
1. Only the selected audience can comment (AD-115).
2. The astrologer answers comments at their discretion (AD-115).
3. The astrologer may Mute or Remove a user (AD-115).
4. The astrologer may Pause; if the Live is not resumed within 5 minutes it ends automatically (AD-116).
5. On technical interruption, resuming is attempted; if the Live cannot continue, the interruption is recorded and users are notified (AD-118).

### 5.4 Cancel a scheduled Live
1. The astrologer cancels a scheduled Live.
2. Users in the selected audience are notified of the cancellation (AD-118).
3. The astrologer may schedule another Live in the same calendar month (AD-112).

### 5.5 After the Live
The post-Live summary shows duration, participant count, and comment count (AD-119). No recording or replay is available (AD-117).

## 6. Screens and content

| Screen | Content | Source |
|--------|---------|--------|
| Create Live | Schedule Live / Start Now; Topic*; Description (optional); Thumbnail (optional); Audience (Public, Followers, Subscribers, tiers) | AD-114 |
| Preview/Test | Pre-start check | AD-115 |
| Live screen | Comments (selected audience only); Mute; Remove; Pause/Resume; End | AD-115, AD-116 |
| Post-Live summary | Duration; participant count; comment count | AD-119 |
| Live History | Search; month filter; sessions list; details panel (AD-169) | AD-169 |
| Live Settings | Default audience; who can comment; comment priority; comment tools (AD-170) | AD-170 |

\* Required.

## 7. Business rules and validations

| # | Rule | Source |
|---|------|--------|
| LIV-01 | Every Verified Astrologer can start a Live without Admin approval. | AD-112 |
| LIV-02 | One Live per calendar month; a cancelled scheduled Live does not use up the month's Live. | AD-112 |
| LIV-03 | Live is free; no payment or earnings workflow. | AD-113 |
| LIV-04 | Topic is required; Description and Thumbnail are optional. *(Amended 2026-11-27: Description was required.)* | AD-114 |
| LIV-05 | Only the selected audience receives Live notifications and can comment. | AD-114, AD-115 |
| LIV-06 | The astrologer is not obliged to answer every comment. | AD-115 |
| LIV-07 | A paused Live must resume within 5 minutes or it ends automatically. | AD-116 |
| LIV-08 | No recording or replay. | AD-117 |
| LIV-09 | No participant capacity limits or account-based participant tiers. | AD-119 |

## 8. States and edge cases

| Case | Behaviour |
|------|-----------|
| Astrologer not verified | Cannot start a Live (AD-112); verification steps `PENDING DISCUSSION` (AP-04-01) |
| A Live already held this calendar month | Another Live cannot be started or scheduled in the same month (AD-112) |
| Scheduled Live cancelled | Audience notified; another Live may be scheduled in the same month (AD-112, AD-118) |
| Astrologer does not show for a scheduled Live | Users notified (AD-118) |
| Pause longer than 5 minutes | Live ends automatically (AD-116) |
| Technical interruption that cannot be resolved | Interruption recorded; users notified (AD-118) |
| User not in the selected audience | Receives no Live notifications and cannot comment (AD-114, AD-115) |

A formal Live status list is not defined in the Master Decision Document; the
flows above and the category F events (AD-148) are the only confirmed states.

## 9. Notifications triggered

| Notification | Recipients | Rule |
|--------------|------------|------|
| Live Scheduled | Selected audience | AD-118 |
| Reminders 1 day, 1 hour, 15 minutes before | Selected audience | AD-118 |
| Live Started | Selected audience | AD-118 |
| Live cancelled / astrologer did not show | Selected audience | AD-118 |
| Interruption | Users in the Live | AD-118 |
| Live Scheduled, Live Reminders, Live Started, Live Ended/Interrupted | Astrologer | AD-148 → [14](14_NOTIFICATIONS_AND_REMINDERS.md) |

## 10. Dependencies on other modules

- [01](01_HOME_SCREEN.md) — Live tab, Go Live (AD-03, AD-21).
- [04](04_PROFILE_AND_VERIFICATION.md) — Verified status (AD-85).
- [08](08_WALLET_AND_EARNINGS.md) — no Live earnings now; future paid Live shown separately in Wallet (AD-113).
- [11](11_AUDIENCE.md) — Followers and Subscribers.
- [13](13_ANALYTICS_AND_PERFORMANCE.md), [14](14_NOTIFICATIONS_AND_REMINDERS.md).
- **User App:** X-22 (Live viewing, notifications, and comments on the user side).
- **Platform Admin:** PA-04 (verification).

## 11. PENDING DISCUSSION

Full wording in [`00_ASTROLOGER_APP_REVIEW_LIST.md` §4](00_ASTROLOGER_APP_REVIEW_LIST.md#4-open-questions-register).

**Owned by this module:** none.

**Related**

| ID | Topic | Status |
|----|-------|--------|
| AP-04-01 | Verification steps and statuses (Verified Astrologer) | Open |

## 12. Acceptance criteria

- [ ] Verified Astrologers can go live without Admin approval; one Live per calendar month; a cancelled scheduled Live allows another in the same month (AD-112).
- [ ] No payment or earnings flow exists for Live (AD-113).
- [ ] Schedule Live and Start Now are available; Topic and Description are required; Thumbnail optional; audience selectable; only the selected audience is notified (AD-114).
- [ ] Preview/Test, audience-only comments, and Mute/Remove are available (AD-115).
- [ ] A paused Live ends automatically if not resumed within 5 minutes (AD-116).
- [ ] No recording or replay (AD-117).
- [ ] Scheduled, reminder, started, cancelled/no-show, and interruption notifications follow AD-118.
- [ ] The post-Live summary shows duration, participants, and comments, with no capacity limits (AD-119).

## 13. Change log

| Date | Change |
|------|--------|
| 2026-11-20 | Initial draft created from the Master Decision Document: AD-112 – AD-119. |
| 2026-11-27 | AD-114 amended (Description optional). AD-169 – AD-171 added: Live History, Live Settings, Create Live flow (product owner, Live Sessions reference design). |
