# 01 — Home Screen

| Field | Value |
|-------|-------|
| Application | Astrologer App |
| Status | Draft |
| Owned decisions | AD-01 – AD-09, AD-12 – AD-23, AD-63 – AD-68, AD-164 |
| Review list | [`00_ASTROLOGER_APP_REVIEW_LIST.md`](00_ASTROLOGER_APP_REVIEW_LIST.md) |
| Shared context | [`CONTEXT.md`](../../CONTEXT.md) |

> **Frontend UI phase.** This specification describes product behaviour for
> UI design and mock-data prototypes. It does not define APIs, data
> structures, or backend logic. Items marked **Pending Product Decision**
> must not be implemented as if decided.

---

## 1. Purpose

Defines the Astrologer App Home Screen: a Balanced Dashboard from which the
astrologer manages availability (including DND / Planned Unavailability) and
sees today's expected net earnings, peak demand, today's work (with normal
Text-Based Questions and Subscription Questions shown separately), disputes,
recent activity, and four quick actions. It also defines the astrologer's
view of the Remedy Tracker, the Notifications entry point, and the
Astrologer App bottom navigation.

## 2. Scope / Out of scope

**In scope**
- Default landing screen (AD-63).
- The seven Home sections, in the agreed order (AD-02).
- Bottom navigation (AD-03).
- Availability: Online/Offline, Instant Call and Instant Chat switches, DND / Planned Unavailability (AD-04 – AD-09, AD-12; activation and visibility AD-74).
- Earnings widget — today's expected net earnings (AD-14, AD-15).
- Peak Demand Hours widget (AD-16).
- Today's Work, daily counts, Daily Answer Goal, Text-Based Questions and Subscription Questions as separate categories (AD-17 – AD-19, AD-64, AD-65, AD-72).
- Campaign Questions Home visual (AD-67) and Disputes display (AD-68).
- Recent Activity and Appointments previews (AD-17, AD-20).
- Exactly four Quick Actions and their destinations (AD-21).
- Notifications entry point and notification types (AD-02, AD-66).
- Astrologer view of the Remedy Tracker (AD-22).

**Out of scope**
- Live, Earnings, and Profile modules — separate modules (AD-23), now specified in [07](07_LIVE_SESSIONS.md), [08](08_WALLET_AND_EARNINGS.md), and [04](04_PROFILE_AND_VERIFICATION.md).
- Wallet details, including refunds and refund accounting (Wallet section; AD-14).
- Availability Schedule and timings — Appointment Module (AD-13).
- Text-Based Questions rules, campaigns, Campaign Management, and the Text-Based Questions service suspension → [`02_TEXT_BASED_QUESTIONS.md`](02_TEXT_BASED_QUESTIONS.md) (AD-27, AD-73).
- Go Live destination — Live Sessions ([07](07_LIVE_SESSIONS.md)).
- Content of the "Benefits & Content" section opened by Content Creation (AD-21) — the Content Management module ([12](12_CONTENT_MANAGEMENT.md), AD-138).
- User-side screens (User App).
- Backend, APIs, real-time updates, payments, refund processing.

## 3. Entry points

- The app opens to the **Home Dashboard** by default (AD-63).
- **Home** tab in the bottom navigation (AD-03).

## 4. Confirmed decisions

**Owned by this module** (verbatim from the decision register)

| ID | Decision |
|----|----------|
| AD-01 | Home Screen design direction is a **Balanced Dashboard**. Work, earnings, peak demand, and availability must all be prominent. |
| AD-02 | Home Screen sections: 1. Welcome & Profile; 2. Availability; 3. Today's Earnings, with weekly/monthly summaries; 4. Peak Demand Hours chart; 5. Today's Work; 6. Recent Activity; 7. Exactly four Quick Actions. Welcome & Profile shows the astrologer's name, profile photo, and notification access. |
| AD-03 | Bottom navigation has exactly five tabs: **Home, My Work, Live, Earnings, Profile**. |
| AD-04 | **Online:** services can be available, subject to the individual Instant Call and Instant Chat switches. |
| AD-05 | **Offline:** Text-Based Questions and Appointments can still arrive. Instant Call and Instant Chat cannot arrive. |
| AD-06 | Only **Instant Call** and **Instant Chat** have individual ON/OFF switches. Text-Based Questions and Appointments have no individual availability switches. |
| AD-07 | **DND / Planned Unavailability:** DND and Planned Unavailability are the **same feature**. While it is active, the astrologer is unavailable for **all new** services: no new Text-Based Questions, Appointments, Instant Calls, Instant Chats, online/offline consultations, or other services — including subscription-based requests — can be purchased, booked, submitted, or started. **Existing confirmed appointments remain valid** obligations (AD-09). DND takes priority over the individual Instant Call and Instant Chat switches. *(Amended 2026-11-19. Amended 2026-11-20 (AP-01-14): new-service availability separated from existing confirmed appointments; supersedes "unavailable for **all** services — Text-Based Questions, Appointments, …".)* |
| AD-08 | Turning DND **OFF** does not automatically make the astrologer Online. The astrologer must independently select Online or Offline. |
| AD-09 | **Planned Unavailability:** the astrologer can specify a future unavailable period (for example, 10 days), and can **edit or cancel** it. During the selected period no new services can be purchased, booked, submitted, or started (AD-07, AD-74). **Existing confirmed appointments remain valid** when DND / Planned Unavailability is activated. Closing a date that contains confirmed appointments is a separate appointment workflow (date closure, AD-94). *(Amended 2026-11-19. Amended 2026-11-20: confirmed appointments remain valid; supersedes the earlier rule that booked appointments in the period are cancelled with a full refund and the date blocked.)* |
| AD-12 | New requests resume when DND is turned OFF or the unavailable period ends, subject to other rules. |
| AD-13 | Availability Schedule and timings belong to the **Appointment Module**, not to Home or Text-Based Questions. |
| AD-14 | **Today's Earnings** on Home shows today's **expected Net Earnings after platform commission** — the amount the astrologer can earn by completing today's booked/assigned work — to motivate the astrologer. Home Earnings is kept simple: **no refund deductions, refund adjustments, refund status, or refund calculations** are shown on Home; refund details and refund-related accounting are shown separately in the **Wallet** section only. This Week and This Month keep the completed-service basis. The Earnings/Wallet section can separately display **Gross Revenue, Commission, and Net Earnings**. Settlement timing is handled separately in Earnings/Wallet. *(Amended 2026-11-19.)* |
| AD-15 | Earnings display: Today's Earnings shown prominently, with This Week and This Month. Comparisons: Today vs Yesterday, This Week vs Last Week, This Month vs Last Month. Positive growth shown in green; decreases shown honestly. No Pending Earnings or Pending Payout figures on Home. Mock figures are illustrative only. |
| AD-16 | **Peak Demand Hours:** calculated from the **last 7 days** of incoming Text-Based Question and Appointment booking data, identifying the peak-demand hours; no unspecified or unlimited historical period is used. The chart is divided into four IST time ranges: **Morning 5:00 AM–11:00 AM**, **Afternoon 11:00 AM–4:00 PM**, **Evening 4:00 PM–8:00 PM**, and **Night 8:00 PM–5:00 AM**. The highest-demand period is highlighted in gold, with a label such as "Peak Time: Evening". It remains a compact Home widget, not a large analytics dashboard. *(Amended 2026-11-19.)* |
| AD-17 | **Today's Work** shows Appointments and Text-Based Questions. Instant Calls and Chats do not have a dedicated Today's Work area. The Appointments preview shows today's count and the **next 3 upcoming appointments**; its View All action opens the Appointments section. *(Amended 2026-11-19.)* |
| AD-18 | Today's Work shows Text-Based Question counts: **Received, Answered, Pending**. Home shows **daily** counts only (AD-64). *(Amended 2026-11-19.)* |
| AD-19 | **Daily Answer Goal:** the default goal is **10**; the astrologer can select 5, 10, or 15 questions per day and can change it later. It is motivational only and does not impose a cap. Progress is shown (for example, 3/5, 60%, "2 more answers to reach today's goal"). The currently selected goal is shown consistently wherever it is displayed. **Dispute Answers do not count** toward the Daily Answer Goal. *(Amended 2026-11-19.)* |
| AD-20 | **Recent Activity** shows the four latest activities and a View All action, which opens the **dedicated Recent Activity tab**. Each item has a small icon, a short description, and a time. Examples: New Follower, New Question Received, Appointment Booked, Consultation Completed. *(Amended 2026-11-19.)* |
| AD-21 | Exactly four **Quick Actions**: 1. Campaign Questions; 2. Go Live; 3. Content Creation; 4. Remedy Tracker. Vacation and Campaign Management are not added to Home Quick Actions. **Campaign Questions** opens the received Campaign Questions screen. **Content Creation** opens the "Benefits & Content" section, where content creation facilities are available. *(Amended 2026-11-19.)* |
| AD-22 | **Remedy Tracker (astrologer view):** the astrologer sees only remedies prescribed by them and their completion status. Only the User can mark a remedy Completed. The User may upload a supporting photo/document. The astrologer can view uploaded attachments. The astrologer cannot manually mark a remedy completed. A prescribed remedy must also appear in the User Remedy Tracker. |
| AD-23 | **Live, Earnings, and Profile** are separate modules to be discussed later. |
| AD-63 | The app opens to the **Home Dashboard** by default. |
| AD-64 | Home displays **daily counts only**. Weekly and monthly counts are not added to Home for now. |
| AD-65 | **Subscription benefit questions** are shown separately from additional normal paid questions asked by subscribers. |
| AD-66 | **Notifications:** the notification bell opens the Notifications section. Notifications include bookings, Instant Call, Instant Chat, new subscribers, payments, login activity, password changes, and other relevant account/service notifications. |
| AD-67 | **Campaign Questions Home visual:** a compact chart/progress visual showing today's received question count (green indicator), the astrologer's **currently selected** Daily Answer Goal (yellow indicator; default 10, AD-19 — not a fixed 10), and critical questions (red indicator). *(Amended 2026-11-19.)* |
| AD-68 | **Disputes on Home** are shown separately. An **immediate notification** is sent when a dispute is raised, and a **reminder** is sent before the 3-day Dispute Answer deadline expires. No generic repeated "within 3 days" warning is shown for every open dispute. If the astrologer does not respond within 3 days, the dispute is escalated to Admin Review (AD-41). *(Amended 2026-11-19.)* |
| AD-164 | **Offline vs DND:** Offline means the astrologer is not accepting that instant service; DND means the astrologer is unavailable for new services across the platform. Appointments may still arrive when the astrologer is Offline (AD-05), but not while DND is active (AD-74). |

**Referenced decisions** (owned by [`02_TEXT_BASED_QUESTIONS.md`](02_TEXT_BASED_QUESTIONS.md))

| ID | Topic |
|----|-------|
| AD-10 | No new slot purchases or question submissions during DND or Planned Unavailability |
| AD-11 | Slot expiry and the 30-day answer deadline continue during DND; DND days count toward the deadline |
| AD-27 | Campaign Management location and actions |
| AD-30 | 30-day answer deadline; automatic cancellation and refund |
| AD-39 | Remedy prescription in answers and Dispute Answers; appears in the User's Remedy Tracker |
| AD-41 | Dispute window and 3-day Dispute Answer deadline; Admin Review |
| AD-46 | My Work main page and Text Questions tabs |
| AD-71 | IST calendar-day counting |
| AD-72 | Text-Based Questions and Subscription Questions as separate categories; benefit questions per tier |
| AD-73 | Text-Based Questions service suspension |
| AD-74 | DND activation restriction and profile invisibility |

## 5. User flows

### 5.1 Launch the app
1. The app opens to the Home Dashboard (AD-63).

### 5.2 Set Online or Offline
1. The astrologer selects **Online** or **Offline** in the Availability section.
2. **Online:** services can be available, subject to the Instant Call and Instant Chat switches (AD-04).
3. **Offline:** Text-Based Questions and Appointments can still arrive; Instant Call and Instant Chat cannot arrive (AD-05).

### 5.3 Switch Instant Call or Instant Chat
1. The astrologer turns the **Instant Call** or **Instant Chat** switch ON or OFF (AD-06).
2. There are no switches for Text-Based Questions or Appointments (AD-06).
3. While DND / Planned Unavailability is active, it takes priority over these switches (AD-07).

### 5.4 Turn DND / Planned Unavailability ON, edit, or cancel it
DND and Planned Unavailability are the same feature (AD-07).
1. The astrologer can activate DND only when not engaged in active work; it **cannot be activated during an ongoing Instant Call or Instant Chat**, which must be finished first (AD-74).
2. The astrologer turns DND on now, or specifies a future unavailable period (for example, 10 days) (AD-07, AD-09).
3. While DND is active, the astrologer's **entire profile is invisible to all users** for the selected period. No user can view the profile or book any service — Text-Based Questions, Campaign Questions, Open Questions, Subscription Questions, Appointments, Instant Call, Instant Chat, and all other bookable services (AD-07, AD-74).
   - New Text-Based Question purchases and submissions are blocked (AD-10, AD-74).
   - Already submitted Text-Based Questions keep their normal 30-day answer deadline; DND days count toward it, and it is not paused or extended (AD-11). A missed deadline leads to the normal automatic cancellation and refund (AD-30).
   - Existing confirmed appointments **remain valid** (AD-09). Closing a date that has confirmed appointments is a separate appointment workflow (AD-94 → [05](05_APPOINTMENTS.md)). DND blocks all new services; previously confirmed appointments remain obligations (AD-07, AD-09).
   - Planned Unavailability limits (maximum duration, notice period): `PENDING DISCUSSION` (AP-01-15).
4. The astrologer can **edit or cancel** a planned unavailability period (AD-09).
5. When DND is turned OFF or the period ends, the astrologer is not automatically Online; the astrologer selects Online or Offline independently (AD-08). New requests resume, subject to other rules (AD-12).

Vacation is not a Home Quick Action (AD-21).

### 5.5 Set or change the Daily Answer Goal
1. The default goal is 10 per day; the astrologer can select 5, 10, or 15 and change it later (AD-19).
2. Progress is shown; the goal does not cap work (AD-19).
3. Dispute Answers do not count toward the goal (AD-19).
4. The Campaign Questions visual and every other display show the astrologer's currently selected goal (AD-19, AD-67).

### 5.6 Use a Quick Action (AD-21)
| Quick Action | Opens |
|--------------|-------|
| Campaign Questions | The Received Campaign Questions screen (Text-Based Questions → [02](02_TEXT_BASED_QUESTIONS.md)) |
| Go Live | Live Sessions ([07](07_LIVE_SESSIONS.md)) |
| Content Creation | The "Benefits & Content" section — the Content Management module ([12](12_CONTENT_MANAGEMENT.md), AD-138) |
| Remedy Tracker | The astrologer's Remedy Tracker (§5.8) |

### 5.7 Open Notifications, Recent Activity, Appointments
1. The notification bell opens the **Notifications** section (AD-66).
2. Recent Activity "View All" opens the dedicated **Recent Activity** tab (AD-20; §7.6).
3. Appointments "View All" opens the **Appointments** tab (AD-17).

### 5.8 View the Remedy Tracker
1. The astrologer opens Remedy Tracker from Quick Actions (AD-21).
2. The list shows only remedies prescribed by this astrologer, with their completion status (AD-22). Remedies are prescribed in answers and Dispute Answers (AD-39 → [02](02_TEXT_BASED_QUESTIONS.md)).
3. If the User uploaded a supporting photo or document, the astrologer can view it (AD-22).
4. The astrologer cannot mark a remedy Completed (AD-22).

## 6. Screens and content

### 6.1 Home Screen — sections in order (AD-02)

| # | Section | Content |
|---|---------|---------|
| 1 | Welcome & Profile | Astrologer's name, profile photo, notification bell → Notifications (AD-02, AD-66) |
| 2 | Availability | Online/Offline selector (AD-04, AD-05); Instant Call and Instant Chat switches (AD-06); DND / Planned Unavailability with edit and cancel, unavailable during an active Call/Chat (AD-07 – AD-09, AD-74) |
| 3 | Today's Earnings | Today's **expected Net Earnings** after commission from today's booked/assigned work (prominent); This Week and This Month on the completed-service basis; comparisons with previous periods (AD-14, AD-15). No refund figures and no pending payout figures. |
| 4 | Peak Demand Hours | Compact bar chart from the last 7 days of incoming Text-Based Questions and Appointment bookings: Morning, Afternoon, Evening, Night (IST ranges in §7.3); peak in gold; "Peak Time" label (AD-16) |
| 5 | Today's Work | Appointments: today's count and the next 3 upcoming appointments, View All → Appointments tab (AD-17). Questions, as two separate categories (AD-65, AD-72): **Text-Based Questions** and **Subscription Questions**, each with its own daily counts (AD-18, AD-64). Daily Answer Goal and progress (AD-19). Campaign Questions visual (AD-67). Disputes, shown separately and prominently (AD-68). |
| 6 | Recent Activity | Four latest activities, each with small icon, short description, time; View All → Recent Activity tab (AD-20) |
| 7 | Quick Actions | Exactly four: Campaign Questions, Go Live, Content Creation, Remedy Tracker (AD-21) |

All Home service counts are **daily** counts only, using IST calendar days (AD-64, AD-71). No weekly or monthly service counts appear on Home.

### 6.2 Campaign Questions visual (AD-67)

| Element | Indicator |
|---------|-----------|
| Today's received question count | Green |
| Daily answer goal — the astrologer's currently selected goal (default 10/day) | Yellow |
| Critical questions | Red |

Shown as a compact chart or progress visual (AD-19, AD-67).

### 6.3 Text-Based Questions and Subscription Questions (AD-65, AD-72)

| Category | Meaning |
|----------|---------|
| Text-Based Questions | The normal Text-Based Question service |
| Subscription Questions | Questions offered to subscribers as a subscription benefit/offer — Silver 1, Gold 3, Platinum 4 |

The two categories are always shown separately. They are never merged, one
never replaces the other, and their counts are never combined (AD-72).

### 6.4 Disputes display (AD-68)
- Disputes are shown separately and prominently, apart from normal questions.
- They do not count toward the Daily Answer Goal (AD-19).
- An immediate notification is sent when a dispute is raised, and a reminder before the 3-day Dispute Answer deadline expires; no generic repeated "within 3 days" warning is shown (AD-68).
- If the astrologer does not respond within 3 days, the dispute is escalated to Admin Review (AD-41 → [02](02_TEXT_BASED_QUESTIONS.md)).

### 6.5 Notifications (AD-66)
Service updates, bookings, appointments, Instant Call and Instant Chat,
new subscribers, payments / amount received, login activity, password
changes, and important security/account notifications.

### 6.6 Bottom navigation (AD-03)

| Tab | Specification |
|-----|---------------|
| Home | This file (default on launch, AD-63) |
| My Work | [`02_TEXT_BASED_QUESTIONS.md`](02_TEXT_BASED_QUESTIONS.md) (Text Questions part, AD-46); Appointments part out of scope |
| Live | Live Sessions — [07](07_LIVE_SESSIONS.md) (AD-23) |
| Earnings | Wallet and Earnings — [08](08_WALLET_AND_EARNINGS.md) (AD-23) |
| Profile | Profile and Verification — [04](04_PROFILE_AND_VERIFICATION.md) (AD-23) |

### 6.7 Remedy Tracker (astrologer view) (AD-22)

| Content | Rule |
|---------|------|
| Remedies prescribed by this astrologer only | AD-22 |
| Completion status per remedy; "Completed" shown only when the User has completed it | AD-22 |
| User-uploaded supporting photo/document, viewable by the astrologer | AD-22 |
| No action to mark a remedy completed | AD-22 |

Remedy fields beyond the above: User App P-16-01 (X-08).

### 6.8 Illustrative mock data (not product values)

Mock figures are illustrative only (AD-15).

| Widget | Illustrative example |
|--------|----------------------|
| Earnings (expected net, today) | Today: ₹2,450 (+18%); This Week: ₹14,800 (+22%); This Month: ₹48,500 (+15%) |
| Daily Answer Goal | 3/10, 30%, "7 more answers to reach today's goal" (AD-19) |
| Peak Demand | "Peak Time: Evening" (AD-16) |

## 7. Business rules and validations

### 7.1 Availability matrix

| State | Text-Based Questions | Appointments | Instant Call | Instant Chat | Source |
|-------|----------------------|--------------|--------------|--------------|--------|
| Online | Can be available | Can be available | Per switch | Per switch | AD-04, AD-06 |
| Offline | Can still arrive | Can still arrive | Cannot arrive | Cannot arrive | AD-05 |
| DND / Planned Unavailability active | Profile hidden; nothing can be booked or submitted | Profile hidden; no new bookings; existing confirmed appointments remain valid | Profile hidden; unavailable | Profile hidden; unavailable | AD-07, AD-09, AD-74 |

- DND and Planned Unavailability are the same feature; it covers all services, including Campaign Questions, Open Questions, Subscription Questions, online/offline consultations, and all other bookable services (AD-07, AD-74).
- DND cannot be activated during an ongoing Instant Call or Instant Chat (AD-74).
- While DND is active, the entire astrologer profile is invisible to all users for the selected period (AD-74).
- Already submitted Text-Based Questions keep their 30-day deadline; DND days count toward it; it is not paused or extended (AD-11). Missed deadlines follow the normal automatic cancellation and refund (AD-30).
- Text-Based Questions and Appointments have no individual switches (AD-06).
- Planned Unavailability can be edited or cancelled (AD-09).
- Offline means the astrologer is not accepting that instant service; DND means unavailable for new services across the platform. Appointments may still arrive while Offline, but not during DND (AD-164).
- Only one pending request or active consultation is allowed across Instant Call and Instant Chat (single atomic lock, AD-105 → [06](06_INSTANT_CALL_AND_CHAT.md)).
- Appointment timings belong to the Appointment Module (AD-13).
- Turning DND OFF does not make the astrologer Online (AD-08).
- New requests resume when DND is turned OFF or the unavailable period ends, subject to other rules (AD-12).

### 7.2 Earnings (AD-14, AD-15)
- **Today:** expected Net Earnings after platform commission from today's booked/assigned work — what the astrologer can earn by completing today's work, shown to motivate the astrologer.
- **This Week / This Month:** completed-service basis.
- Comparisons: Today vs Yesterday; This Week vs Last Week; This Month vs Last Month. Growth in green; decreases shown honestly.
- **Not shown on Home:** refunds, refund deductions, refund adjustments, refund statuses, Pending Earnings, or Pending Payout figures. Today's expected earnings is not a pending payout figure; settlement and payout timing belong to Earnings/Wallet.
- Refunds and detailed refund accounting appear in the **Wallet** section only.
- Gross Revenue, Commission, and Net Earnings can be shown separately in Earnings/Wallet.

### 7.3 Peak Demand Hours (AD-16)
- Data window: the **last 7 days** of incoming Text-Based Questions and Appointment booking activity.
- Time ranges (IST):

| Period | Range |
|--------|-------|
| Morning | 5:00 AM – 11:00 AM |
| Afternoon | 11:00 AM – 4:00 PM |
| Evening | 4:00 PM – 8:00 PM |
| Night | 8:00 PM – 5:00 AM |

- Highest-demand period highlighted in gold, with a "Peak Time" label.
- Compact widget only.

### 7.4 Today's Work and counts (AD-17 – AD-19, AD-64, AD-65, AD-72)
- Shows Appointments and Text-Based Questions only; no Instant Call or Chat area.
- Appointments: today's count and the next 3 upcoming appointments.
- Question counts: Received, Answered, Pending — daily only, IST calendar day (AD-64, AD-71).
- **Text-Based Questions** and **Subscription Questions** are two separate categories with separate counts; never merged or combined (AD-65, AD-72).
- Daily Answer Goal: default 10/day; selectable 5, 10, or 15; motivational only; no cap; Dispute Answers do not count; the selected goal is shown consistently (AD-19, AD-67).

### 7.5 Disputes (AD-68)
- Shown separately and prominently.
- Excluded from the Daily Answer Goal (AD-19).
- Immediate notification when a dispute is raised; reminder before the 3-day Dispute Answer deadline expires; no generic repeated "within 3 days" warning.

### 7.6 Recent Activity (AD-20)
- Four latest activities on Home; each with small icon, short description, time.
- View All opens the **dedicated Recent Activity tab** — a screen of its own, not one of the five bottom-navigation tabs (AD-03).

### 7.7 Quick Actions (AD-21)
- Exactly four, in this order: Campaign Questions, Go Live, Content Creation, Remedy Tracker.
- Campaign Questions opens the Received Campaign Questions screen; Content Creation opens the "Benefits & Content" section.
- Vacation and Campaign Management are not Quick Actions. Campaign Management is in My Work (AD-27 → [02](02_TEXT_BASED_QUESTIONS.md)).

### 7.8 Remedy Tracker (AD-22)
- Only remedies prescribed by this astrologer.
- Only the User can mark a remedy Completed; the astrologer cannot.
- The astrologer can view User-uploaded attachments.
- A prescribed remedy must also appear in the User Remedy Tracker (also AD-39 → [02](02_TEXT_BASED_QUESTIONS.md); User App D-11).

### 7.9 Text-Based Questions service suspension (AD-73)
- If the Text-Based Questions service is suspended (AD-73 → [02](02_TEXT_BASED_QUESTIONS.md)), only that service is affected; Home availability controls for other services continue under their normal rules.

## 8. States and edge cases

| Case | Behaviour |
|------|-----------|
| App launched | Home Dashboard shown (AD-63) |
| Offline with Instant Call/Chat switches ON | Instant Call and Instant Chat cannot arrive (AD-05) |
| Online with Instant Call OFF | Instant Call not available; other services per AD-04 |
| Astrologer tries to activate DND during an Instant Call or Instant Chat | Not allowed; finish the Call/Chat first (AD-74) |
| DND active | Entire profile invisible to all users; no service can be booked; overrides switches (AD-07, AD-74) |
| DND turned OFF | Astrologer is not automatically Online; selects Online or Offline (AD-08) |
| Planned Unavailability edited or cancelled | Allowed (AD-09) |
| Confirmed appointment falls within DND / Planned Unavailability | Appointment remains valid (AD-07, AD-09) |
| Astrologer closes a date with confirmed appointments | Date-closure workflow: reschedule or full User Wallet refund (AD-94 → [05](05_APPOINTMENTS.md)) |
| Submitted questions pending when DND starts | 30-day deadline continues; DND days count; missed deadline → automatic cancellation and refund (AD-11, AD-30) |
| Unavailable period ends | New requests resume, subject to other rules (AD-12) |
| Earnings lower than previous period | Decrease shown honestly (AD-15) |
| Earnings higher than previous period | Growth shown in green (AD-15) |
| Refund issued today | Not shown on Home; shown in Wallet (AD-14) |
| No appointments today | Today's count shows zero (AD-17) |
| Fewer than 3 upcoming appointments | Preview shows those that exist (AD-17) |
| Subscription Questions received today | Counted and shown separately from Text-Based Questions (AD-65, AD-72) |
| Daily goal reached or exceeded | Goal is motivational only; no cap (AD-19) |
| No goal selected yet | Default Daily Answer Goal of 10 (AD-19) |
| Dispute Answer submitted | Does not count toward the Daily Answer Goal (AD-19) |
| Dispute raised | Immediate notification (AD-68) |
| Dispute Answer deadline approaching | Reminder before the 3-day deadline expires (AD-68) |
| Astrologer does not respond to a dispute within 3 days | Escalated to Admin Review (AD-41) |
| Remedy not completed by the User | "Completed" not shown (AD-22) |
| Remedy without an uploaded attachment | No attachment to view (AD-22) |

## 9. Notifications triggered

| Notification | Rule |
|--------------|------|
| Service updates, bookings, appointments, Instant Call, Instant Chat, new subscribers, payments / amount received, login activity, password changes, important security/account notifications | AD-66 |
| Dispute raised (immediate) | AD-68 |
| Reminder before the 3-day Dispute Answer deadline expires | AD-68 |

The notification bell opens the Notifications section (AD-66).

## 10. Dependencies on other modules

| Dependency | Reference |
|------------|-----------|
| Text-Based Questions | AD-10, AD-11, AD-27, AD-30, AD-39, AD-41, AD-46, AD-71, AD-72, AD-73, AD-74 → [02](02_TEXT_BASED_QUESTIONS.md) |
| Appointment Module | AD-09, AD-13 → [05](05_APPOINTMENTS.md) (AD-94 date closure) |
| Live, Earnings, Profile modules | AD-23 → [07](07_LIVE_SESSIONS.md), [08](08_WALLET_AND_EARNINGS.md), [04](04_PROFILE_AND_VERIFICATION.md) |
| Instant Call and Instant Chat | AD-105 single active consultation lock → [06](06_INSTANT_CALL_AND_CHAT.md) |
| Content Management | AD-138 → [12](12_CONTENT_MANAGEMENT.md) |
| Remedy Tracker (appointment records) | AD-163 → [17](17_REMEDY_TRACKER.md) |
| Notifications | AD-148 – AD-151 → [14](14_NOTIFICATIONS_AND_REMINDERS.md) |
| Global navigation | AD-75 – AD-78 → [03](03_GLOBAL_NAVIGATION.md) |
| Earnings/Wallet (gross, commission, net, refunds, settlement) | AD-14 |
| User App — DND and confirmed appointments | X-17 (resolved; User App D-30 amended, D-41) |
| User App — Remedy Tracker | X-08 (User App D-11, D-29) |
| User App — Follow vs Subscribe | X-09 (resolved; User App D-36) |
| User App — DND and purchased-slot validity | X-12 (resolved; User App D-38) |
| User App — subscription model | X-14 (User App D-31; P-14-01 – P-14-06) |

## 11. PENDING DISCUSSION

Full wording in [`00_ASTROLOGER_APP_REVIEW_LIST.md` §4](00_ASTROLOGER_APP_REVIEW_LIST.md#4-open-questions-register).
Retired: AP-01-01, AP-01-02, AP-01-04, AP-01-06 – AP-01-13, AP-GL-01 (resolved; see review list §9).

**Owned by this module**

| ID | Topic | Status |
|----|-------|--------|
| AP-01-15 | Planned Unavailability limits | Open |

**Resolved** (kept in the Review List with status Resolved):

| ID | Resolution |
|----|------------|
| AP-01-03 | Peak Demand uses the last 7 days and the IST ranges Morning 5:00 AM – 11:00 AM, Afternoon 11:00 AM – 4:00 PM, Evening 4:00 PM – 8:00 PM, Night 8:00 PM – 5:00 AM (§7.3) |
| AP-01-05 | During DND the entire profile is hidden, so every service — including Subscription Questions — is unavailable (AD-07, AD-74) |
| AP-01-14 | DND blocks all new services; existing confirmed appointments remain valid (AD-07 amended 2026-11-20, AD-09) |

**Cross-app conflicts referenced** (full detail in [`00_ASTROLOGER_APP_REVIEW_LIST.md` §5](00_ASTROLOGER_APP_REVIEW_LIST.md#5-cross-app-conflicts-register-x-01-to-x-24))

| ID | Topic | Status |
|----|-------|--------|
| X-08 | Remedy completion and upload by the User | Resolved |
| X-09 | "New Follower" depends on Follow vs Subscribe | Resolved |
| X-12 | DND / Planned Unavailability vs purchased-slot validity | Resolved |
| X-14 | Remaining subscription-model details (benefit questions aligned) | Open |
| X-17 | DND and confirmed appointments; date closure (User App D-30, D-41) | Resolved |

## 12. Acceptance criteria

Confirmed rules only.

- [ ] Home uses a Balanced Dashboard in which work, earnings, peak demand, and availability are all prominent (AD-01).
- [ ] Home shows the seven sections in the order of AD-02, with name, photo, and notification access in Welcome & Profile.
- [ ] Bottom navigation has exactly five tabs: Home, My Work, Live, Earnings, Profile (AD-03).
- [ ] When Online, services can be available, subject to the Instant Call and Instant Chat switches (AD-04).
- [ ] When Offline, Text-Based Questions and Appointments can still arrive; Instant Call and Instant Chat cannot (AD-05).
- [ ] Only Instant Call and Instant Chat have individual ON/OFF switches (AD-06).
- [ ] DND and Planned Unavailability are one feature; while active, all services stop and it overrides the Instant Call and Instant Chat switches (AD-07).
- [ ] DND cannot be activated during an ongoing Instant Call or Instant Chat; while active, the whole profile is hidden from all users and no service can be booked (AD-74).
- [ ] Turning DND OFF does not make the astrologer Online (AD-08).
- [ ] Planned Unavailability can be set, edited, and cancelled; existing confirmed appointments remain valid (AD-09).
- [ ] Offline and DND are distinct: Appointments can arrive while Offline but not during DND (AD-164).
- [ ] New requests resume when DND is turned OFF or the unavailable period ends, subject to other rules (AD-12).
- [ ] Home contains no Availability Schedule or timings controls (AD-13).
- [ ] Today's Earnings shows expected Net Earnings after commission from today's booked/assigned work, with no refund figures; refunds appear in Wallet only (AD-14).
- [ ] Earnings show the three comparisons, growth in green, decreases honestly, and no Pending Earnings or Pending Payout figures (AD-15).
- [ ] Peak Demand uses the last 7 days of Text-Based Question and Appointment booking activity, the four IST ranges in §7.3, a gold peak, and a "Peak Time" label (AD-16).
- [ ] Today's Work shows today's appointment count and the next 3 upcoming appointments with View All → Appointments tab, plus Text-Based Questions (AD-17).
- [ ] Today's Work shows Received, Answered, and Pending question counts, daily only (AD-18, AD-64).
- [ ] The Daily Answer Goal defaults to 10, can be set to 5, 10, or 15, shows progress, imposes no cap, excludes Dispute Answers, and is shown consistently (AD-19).
- [ ] Recent Activity shows the four latest items and View All → dedicated Recent Activity tab (AD-20).
- [ ] Exactly four Quick Actions are shown; Campaign Questions opens the Received Campaign Questions screen; Content Creation opens "Benefits & Content" (AD-21).
- [ ] The Remedy Tracker shows only this astrologer's remedies, shows "Completed" only when the User has completed a remedy, lets the astrologer view User attachments, and has no manual completion action (AD-22).
- [ ] Live, Earnings, and Profile are not specified in this file; they are specified in 07, 08, and 04 (AD-23).
- [ ] The app opens to the Home Dashboard (AD-63).
- [ ] Home shows daily service counts only (AD-64).
- [ ] Text-Based Questions and Subscription Questions are shown as two separate categories with separate counts (AD-65, AD-72).
- [ ] The notification bell opens Notifications, covering the types listed in AD-66.
- [ ] The Campaign Questions visual shows received count (green), the currently selected daily goal (yellow), and critical questions (red) (AD-67).
- [ ] Disputes are shown separately and prominently, with an immediate notification when raised and a reminder before the 3-day deadline expires (AD-68).

## 13. Change log

| Date | Change |
|------|--------|
| 2026-11-17 | Initial draft created from AD-01 – AD-09 and AD-12 – AD-23. |
| 2026-11-17 | Synchronized with review list: AP-01-08 – AP-01-12 added to §11 and referenced. No decision changed. |
| 2026-11-19 | Product-owner Home decisions applied: AD-07, AD-09, AD-14, AD-16 – AD-21 amended; AD-63 – AD-68 added. AP-01-02, AP-01-06 – AP-01-12, AP-GL-01 resolved; AP-01-13 added. |
| 2026-11-19 | Fourth pass: AD-19 (default goal 10), AD-21, AD-67, AD-68 amended; AD-72 referenced. AP-01-13 retired. |
| 2026-11-19 | Final Home sync with the Review List: owned decisions re-quoted (AD-14 expected net earnings, no refunds on Home; AD-16 last 7 days); AD-72, AD-73, AD-74 referenced; DND activation restriction and profile invisibility; two question categories; Peak Demand IST ranges; dedicated Recent Activity tab; Received Campaign Questions destination. Invalid active-consultation DND item removed. AP-01-01, AP-01-04 shown as retired; AP-01-03, AP-01-05 shown as resolved pending a Review List update. |
| 2026-11-19 | Re-quoted AD-16 and AD-20 from the Review List; removed outdated notes stating that AP-01-03 / AP-01-05 were still Open and that AD-16 / AD-20 awaited Review List updates. |
| 2026-11-19 | Cross-app statuses synchronized with the review list: X-09 Resolved (User App D-36); X-12 User App alignment completed (User App D-38). X-14 stays Open. No decision changed. |
| 2026-11-20 | Master Decision Document applied: AD-09 re-quoted (amended — confirmed appointments remain valid; ruling C2); AD-164 added (Offline vs DND). AD-17, AD-21, AD-74 unchanged (rulings C3, C5, C6). Links to new modules 03 – 17; AP-01-14, AP-01-15, X-17 added. |
| 2026-11-20 | AD-07 re-quoted (amended — DND blocks all new services; confirmed appointments remain valid); AP-01-14 Resolved; X-17 Resolved (User App aligned). |
