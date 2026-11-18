# 01 — Home Screen

| Field | Value |
|-------|-------|
| Application | Astrologer App |
| Status | Draft |
| Owned decisions | AD-01 – AD-09, AD-12 – AD-23 |
| Review list | [`00_ASTROLOGER_APP_REVIEW_LIST.md`](00_ASTROLOGER_APP_REVIEW_LIST.md) |
| Shared context | [`CONTEXT.md`](../../CONTEXT.md) |

> **Frontend UI phase.** This specification describes product behaviour for
> UI design and mock-data prototypes. It does not define APIs, data
> structures, or backend logic. Items marked **Pending Product Decision**
> must not be implemented as if decided.

---

## 1. Purpose

Defines the Astrologer App Home Screen: a Balanced Dashboard from which the
astrologer manages availability and sees earnings, demand, today's work,
recent activity, and four quick actions. It also defines the astrologer's
view of the Remedy Tracker and the Astrologer App bottom navigation.

## 2. Scope / Out of scope

**In scope**
- The seven Home sections, in the agreed order (AD-02).
- Bottom navigation (AD-03).
- Availability: Online/Offline, Instant Call and Instant Chat switches, DND, Planned Unavailability (AD-04 – AD-09, AD-12).
- Earnings widget (AD-14, AD-15).
- Peak Demand Hours widget (AD-16).
- Today's Work, Text Question counts, and Daily Answer Goal (AD-17 – AD-19).
- Recent Activity (AD-20).
- Exactly four Quick Actions (AD-21).
- Astrologer view of the Remedy Tracker (AD-22).

**Out of scope**
- Live, Earnings, and Profile modules — separate modules to be discussed later (AD-23).
- Availability Schedule and timings — Appointment Module (AD-13).
- Text-Based Questions rules, campaigns, and Campaign Management → [`02_TEXT_BASED_QUESTIONS.md`](02_TEXT_BASED_QUESTIONS.md) (AD-27).
- Appointment and consultation handling, including the effect of DND or Planned Unavailability on existing appointments and ongoing consultations (AP-01-01).
- Go Live destination — Live module (AD-23).
- Content Creation module — scope and destination **Pending Product Decision** (AP-01-11).
- User-side screens (User App).
- Backend, APIs, real-time updates, payments.

## 3. Entry points

- **Home** tab in the bottom navigation (AD-03).
- Whether Home is the default tab or screen when the astrologer launches the app: **Pending Product Decision** (AP-01-12).

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
| AD-07 | **DND:** all four services stop completely — Text-Based Questions, Appointments, Instant Call, and Instant Chat — including subscription-based requests. DND takes priority over the individual Instant Call and Instant Chat switches. |
| AD-08 | Turning DND **OFF** does not automatically make the astrologer Online. The astrologer must independently select Online or Offline. |
| AD-09 | **Planned Unavailability:** the astrologer can specify a future unavailable period (for example, 10 days). All services stop during the selected period. |
| AD-12 | New requests resume when DND is turned OFF or the unavailable period ends, subject to other rules. |
| AD-13 | Availability Schedule and timings belong to the **Appointment Module**, not to Home or Text-Based Questions. |
| AD-14 | **Today's Earnings** means earnings from services completed/answers delivered today, not money credited to the wallet today. Weekly and monthly earnings use the same completed-service basis. Commission and settlement timing are handled separately in Earnings/Wallet. |
| AD-15 | Earnings display: Today's Earnings shown prominently, with This Week and This Month. Comparisons: Today vs Yesterday, This Week vs Last Week, This Month vs Last Month. Positive growth shown in green; decreases shown honestly. No Pending Earnings or Pending Payout figures on Home. Mock figures are illustrative only. |
| AD-16 | **Peak Demand Hours:** counts incoming requests across Text Questions, Appointments, Instant Calls, and Instant Chats. The chart is divided into Morning, Afternoon, Evening, and Night. The highest-demand period is highlighted in gold, with a label such as "Peak Time: Evening". It remains a compact Home widget, not a large analytics dashboard. |
| AD-17 | **Today's Work** shows Appointments and Text-Based Questions. Instant Calls and Chats do not have a dedicated Today's Work area. Appointments show today's count, the next appointment (time and user name), and View All. |
| AD-18 | Today's Work shows Text-Based Question counts: **Received, Answered, Pending**. The exact time scope is pending (AP-01-02). |
| AD-19 | **Daily Answer Goal:** the astrologer selects 5, 10, or 15 questions per day and can change it later. It is motivational only and does not impose a cap. Progress is shown (for example, 3/5, 60%, "2 more answers to reach today's goal"). |
| AD-20 | **Recent Activity** shows the four latest activities and a View All action. Each item has a small icon, a short description, and a time. Examples: New Follower, New Question Received, Appointment Booked, Consultation Completed. |
| AD-21 | Exactly four **Quick Actions**: 1. Campaign Questions; 2. Go Live; 3. Content Creation; 4. Remedy Tracker. Vacation and Campaign Management are not added to Home Quick Actions. |
| AD-22 | **Remedy Tracker (astrologer view):** the astrologer sees only remedies prescribed by them and their completion status. Only the User can mark a remedy Completed. The User may upload a supporting photo/document. The astrologer can view uploaded attachments. The astrologer cannot manually mark a remedy completed. A prescribed remedy must also appear in the User Remedy Tracker. |
| AD-23 | **Live, Earnings, and Profile** are separate modules to be discussed later. |

**Referenced decisions** (owned by [`02_TEXT_BASED_QUESTIONS.md`](02_TEXT_BASED_QUESTIONS.md))

| ID | Topic |
|----|-------|
| AD-10 | No new slot purchases or question submissions during DND or Planned Unavailability |
| AD-11 | Slot expiry and the 30-day answer deadline do not pause during DND or Planned Unavailability |
| AD-27 | Campaign Management location and actions |
| AD-30 | 30-day answer deadline from submission |
| AD-39 | Remedy prescription while answering; appears in the User's Remedy Tracker |
| AD-46 | My Work main page and Text Questions tabs |

## 5. User flows

### 5.1 Set Online or Offline
1. The astrologer selects **Online** or **Offline** in the Availability section.
2. **Online:** services can be available, subject to the Instant Call and Instant Chat switches (AD-04).
3. **Offline:** Text-Based Questions and Appointments can still arrive; Instant Call and Instant Chat cannot arrive (AD-05).

### 5.2 Switch Instant Call or Instant Chat
1. The astrologer turns the **Instant Call** or **Instant Chat** switch ON or OFF (AD-06).
2. There are no switches for Text-Based Questions or Appointments (AD-06).
3. While DND is ON, DND takes priority over these switches (AD-07).

### 5.3 Turn DND ON or OFF
1. The astrologer turns **DND ON**: all four services stop completely, including subscription-based requests (AD-07).
   - Text-Based Questions: no new slot purchases or submissions (AD-10); slot expiry and the 30-day answer deadline do not pause (AD-11) → [02](02_TEXT_BASED_QUESTIONS.md).
   - Meaning of "subscription-based requests": **Pending Product Decision** (AP-01-05, X-14).
   - Existing appointments and ongoing consultations: **Pending Product Decision** (AP-01-01).
2. The astrologer turns **DND OFF**: this does not make the astrologer Online; the astrologer selects Online or Offline independently (AD-08). New requests resume, subject to other rules (AD-12).

### 5.4 Set Planned Unavailability
1. The astrologer specifies a future unavailable period, for example 10 days (AD-09).
2. During the period, all services stop (AD-09). Text-Based Questions follow AD-10 and AD-11 → [02](02_TEXT_BASED_QUESTIONS.md).
3. When the period ends, new requests resume, subject to other rules (AD-12).
4. Existing appointments and ongoing consultations: **Pending Product Decision** (AP-01-01).
5. Users holding purchased slots during the period: **Pending Product Decision** (X-12).
6. Whether the period can be edited or cancelled after it is set, and how Planned Unavailability interacts with DND: **Pending Product Decision** (AP-01-10).

Vacation is not a Home Quick Action (AD-21).

### 5.5 Set or change the Daily Answer Goal
1. The astrologer selects 5, 10, or 15 questions per day (AD-19).
2. The astrologer can change the goal later (AD-19).
3. Progress is shown; the goal does not cap work (AD-19).
4. Whether Dispute Answers count towards the goal: **Pending Product Decision** (AP-01-09).

### 5.6 Use a Quick Action (AD-21)
| Quick Action | Behaviour in this specification |
|--------------|---------------------------------|
| Campaign Questions | Gives access to the astrologer's campaign questions, which are handled in Text-Based Questions (→ [02](02_TEXT_BASED_QUESTIONS.md)). Destination screen: **Pending Product Decision** (AP-01-08). Whether the card shows a compact count or chart: **Pending Product Decision** (AP-01-06). |
| Go Live | Leads to the Live module (AD-23); out of scope. |
| Content Creation | Scope of the Quick Action and its module, and its destination screen: **Pending Product Decision** (AP-01-11). |
| Remedy Tracker | Opens the astrologer's Remedy Tracker (§5.7). |

### 5.7 View the Remedy Tracker
1. The astrologer opens Remedy Tracker from Quick Actions (AD-21).
2. The list shows only remedies prescribed by this astrologer, with their completion status (AD-22). Remedies are prescribed while answering (AD-39 → [02](02_TEXT_BASED_QUESTIONS.md)).
3. If the User uploaded a supporting photo or document, the astrologer can view it (AD-22).
4. The astrologer cannot mark a remedy Completed (AD-22).

### 5.8 Open notifications, Recent Activity "View All", or Appointments "View All"
Destinations: **Pending Product Decision** (AP-01-07).

## 6. Screens and content

### 6.1 Home Screen — sections in order (AD-02)

| # | Section | Content | Pending |
|---|---------|---------|---------|
| 1 | Welcome & Profile | Astrologer's name, profile photo, notification access | Notification destination (AP-01-07) |
| 2 | Availability | Online/Offline selector (AD-04, AD-05); Instant Call and Instant Chat switches (AD-06); DND control (AD-07, AD-08); Planned Unavailability (AD-09) | AP-01-01, AP-01-05, AP-01-10 |
| 3 | Today's Earnings | Today's Earnings (prominent); This Week; This Month; each with comparison to the previous period (AD-14, AD-15) | Gross vs net (AP-01-04); "today" boundary (AP-GL-01) |
| 4 | Peak Demand Hours | Compact bar chart: Morning, Afternoon, Evening, Night; peak in gold; "Peak Time" label (AD-16) | Time ranges and calculation period (AP-01-03) |
| 5 | Today's Work | Appointments: today's count, next appointment (time and user name), View All (AD-17). Text Questions: Received, Answered, Pending (AD-18). Daily Answer Goal and progress (AD-19). | Count time scope (AP-01-02); View All destination (AP-01-07); Dispute Answers in goal (AP-01-09) |
| 6 | Recent Activity | Four latest activities, each with small icon, short description, time; View All (AD-20) | View All destination (AP-01-07); "New Follower" depends on X-09 |
| 7 | Quick Actions | Exactly four: Campaign Questions, Go Live, Content Creation, Remedy Tracker (AD-21) | Campaign Questions count/chart (AP-01-06) and destination (AP-01-08); Content Creation scope and destination (AP-01-11) |

### 6.2 Bottom navigation (AD-03)

| Tab | Specification |
|-----|---------------|
| Home | This file |
| My Work | [`02_TEXT_BASED_QUESTIONS.md`](02_TEXT_BASED_QUESTIONS.md) (Text Questions part, AD-46); Appointments part out of scope |
| Live | Separate module (AD-23) |
| Earnings | Separate module (AD-23) |
| Profile | Separate module (AD-23) |

### 6.3 Remedy Tracker (astrologer view) (AD-22)

| Content | Rule |
|---------|------|
| Remedies prescribed by this astrologer only | AD-22 |
| Completion status per remedy; "Completed" shown only when the User has completed it | AD-22 |
| User-uploaded supporting photo/document, viewable by the astrologer | AD-22 |
| No action to mark a remedy completed | AD-22 |

Remedy fields beyond the above: **Pending Product Decision** (X-08).

### 6.4 Illustrative mock data (not product values)

Mock figures are illustrative only (AD-15).

| Widget | Illustrative example |
|--------|----------------------|
| Earnings | Today: ₹2,450 (+18%); This Week: ₹14,800 (+22%); This Month: ₹48,500 (+15%) |
| Daily Answer Goal | 3/5, 60%, "2 more answers to reach today's goal" (AD-19) |
| Peak Demand | "Peak Time: Evening" (AD-16) |

## 7. Business rules and validations

### 7.1 Availability matrix

| State | Text-Based Questions | Appointments | Instant Call | Instant Chat | Source |
|-------|----------------------|--------------|--------------|--------------|--------|
| Online | Can be available | Can be available | Per switch | Per switch | AD-04, AD-06 |
| Offline | Can still arrive | Can still arrive | Cannot arrive | Cannot arrive | AD-05 |
| DND ON | Stopped | Stopped | Stopped (overrides switch) | Stopped (overrides switch) | AD-07 |
| Planned Unavailability active | Stopped | Stopped | Stopped | Stopped | AD-09 |

- Text-Based Questions and Appointments have no individual switches (AD-06).
- For Text-Based Questions, "stopped" means no new slot purchases and no new submissions; slot expiry and the 30-day deadline do not pause (AD-10, AD-11 → [02](02_TEXT_BASED_QUESTIONS.md)).
- Appointment timings belong to the Appointment Module (AD-13).
- Turning DND OFF does not make the astrologer Online (AD-08).
- New requests resume when DND is turned OFF or the unavailable period ends, subject to other rules (AD-12).
- Editing or cancelling a Planned Unavailability period, and its interaction with DND: **Pending Product Decision** (AP-01-10).

### 7.2 Earnings (AD-14, AD-15)
- Basis: services completed / answers delivered in the period; not wallet credits.
- Periods: Today (prominent), This Week, This Month.
- Comparisons: Today vs Yesterday; This Week vs Last Week; This Month vs Last Month.
- Positive growth shown in green; decreases shown honestly.
- No Pending Earnings or Pending Payout figures.
- Commission and settlement timing are handled in Earnings/Wallet.
- Gross or net of commission, and effect of later refunds or complaints: **Pending Product Decision** (AP-01-04).

### 7.3 Peak Demand Hours (AD-16)
- Counts incoming requests across Text Questions, Appointments, Instant Calls, and Instant Chats.
- Four periods: Morning, Afternoon, Evening, Night.
- Highest-demand period highlighted in gold, with a "Peak Time" label.
- Compact widget only.
- Time ranges and calculation period: **Pending Product Decision** (AP-01-03).

### 7.4 Today's Work (AD-17 – AD-19)
- Shows Appointments and Text-Based Questions only; no Instant Call or Chat area.
- Text Question counts: Received, Answered, Pending — time scope **Pending Product Decision** (AP-01-02).
- Daily Answer Goal: 5, 10, or 15; changeable; motivational only; no cap.
- Whether Dispute Answers count towards the goal: **Pending Product Decision** (AP-01-09).

### 7.5 Recent Activity (AD-20)
- Four latest activities; View All.
- Each item: small icon, short description, time.

### 7.6 Quick Actions (AD-21)
- Exactly four, in this order: Campaign Questions, Go Live, Content Creation, Remedy Tracker.
- Vacation and Campaign Management are not Quick Actions. Campaign Management is in My Work (AD-27 → [02](02_TEXT_BASED_QUESTIONS.md)).
- Campaign Questions destination: **Pending Product Decision** (AP-01-08).
- Content Creation scope and destination: **Pending Product Decision** (AP-01-11).

### 7.7 Remedy Tracker (AD-22)
- Only remedies prescribed by this astrologer.
- Only the User can mark a remedy Completed; the astrologer cannot.
- The astrologer can view User-uploaded attachments.
- A prescribed remedy must also appear in the User Remedy Tracker (also AD-39 → [02](02_TEXT_BASED_QUESTIONS.md); User App D-11).

## 8. States and edge cases

| Case | Behaviour |
|------|-----------|
| Offline with Instant Call/Chat switches ON | Instant Call and Instant Chat cannot arrive (AD-05) |
| Online with Instant Call OFF | Instant Call not available; other services per AD-04 |
| DND ON while Online | All four services stop; DND overrides switches (AD-07) |
| DND turned OFF | Astrologer is not automatically Online; selects Online or Offline (AD-08) |
| Planned Unavailability period ends | New requests resume, subject to other rules (AD-12) |
| Astrologer wants to edit or cancel a Planned Unavailability period | **Pending Product Decision** (AP-01-10) |
| DND and Planned Unavailability both involved | Interaction **Pending Product Decision** (AP-01-10) |
| Astrologer submits a Dispute Answer | Effect on Daily Answer Goal progress **Pending Product Decision** (AP-01-09) |
| Astrologer launches the app | Default tab or screen **Pending Product Decision** (AP-01-12) |
| DND or Planned Unavailability with existing appointments or ongoing consultations | **Pending Product Decision** (AP-01-01) |
| DND or Planned Unavailability while users hold purchased slots | **Pending Product Decision** (X-12) |
| Earnings lower than previous period | Decrease shown honestly (AD-15) |
| Earnings higher than previous period | Growth shown in green (AD-15) |
| No appointments today | Today's count shows zero; next appointment absent (AD-17) |
| Daily goal reached or exceeded | Goal is motivational only; no cap (AD-19) |
| Remedy not completed by the User | "Completed" not shown (AD-22) |
| Remedy without an uploaded attachment | No attachment to view (AD-22) |

## 9. Notifications triggered

No notification events are confirmed for this module.

- Notification access is shown in Welcome & Profile (AD-02). Destination:
  **Pending Product Decision** (AP-01-07).
- User-side notification before campaign expiry is tracked under X-10.

## 10. Dependencies on other modules

| Dependency | Reference |
|------------|-----------|
| Text-Based Questions | AD-10, AD-11, AD-27, AD-30, AD-39, AD-46 → [02](02_TEXT_BASED_QUESTIONS.md) |
| Appointment Module | AD-13; AP-01-01 |
| Live, Earnings, Profile modules | AD-23 |
| Earnings/Wallet (commission, settlement) | AD-14 |
| User App — Remedy Tracker | X-08 (User App D-11, P-16-01, P-16-02) |
| User App — Follow vs Subscribe | X-09 (User App P-14-01) |
| User App — slot expiry during DND/Planned Unavailability | X-12 (User App D-06, D-07) |
| User App — subscription model | X-14 (User App P-14-01 – P-14-05, P-06-01) |
| Day counting and time zone | AP-GL-01; X-15 |

## 11. PENDING DISCUSSION

Full wording in [`00_ASTROLOGER_APP_REVIEW_LIST.md` §4](00_ASTROLOGER_APP_REVIEW_LIST.md#4-open-questions-register).

**Owned by this module**

| ID | Topic | Status |
|----|-------|--------|
| AP-01-01 | Existing appointments and ongoing consultations during DND or Planned Unavailability | Open |
| AP-01-02 | Time scope of Home Text Question counts | Open |
| AP-01-03 | Peak Demand time ranges and calculation period | Open |
| AP-01-04 | Earnings gross vs net; effect of refunds or complaints | Open |
| AP-01-05 | Meaning of "subscription-based requests" | Open |
| AP-01-06 | Campaign Questions Quick Action count or chart | Open |
| AP-01-07 | Destinations of notifications and View All actions | Open |
| AP-01-08 | Campaign Questions Quick Action destination screen | Open |
| AP-01-09 | Whether Dispute Answers count towards the Daily Answer Goal | Open |
| AP-01-10 | Editing or cancelling Planned Unavailability; interaction with DND | Open |
| AP-01-11 | Content Creation Quick Action and module scope and destination | Open |
| AP-01-12 | Default tab or screen at app launch | Open |

**Related (owned elsewhere)**

| ID | Topic | Status |
|----|-------|--------|
| AP-GL-01 | Day counting and time zone | Open |

**Cross-app conflicts referenced** (full detail in [`00_ASTROLOGER_APP_REVIEW_LIST.md` §5](00_ASTROLOGER_APP_REVIEW_LIST.md#5-cross-app-conflicts-register-x-01-to-x-15))

| ID | Topic | Status |
|----|-------|--------|
| X-08 | Remedy completion and upload by the User | Open |
| X-09 | "New Follower" depends on Follow vs Subscribe | Open |
| X-10 | User notification before campaign expiry | Open |
| X-12 | DND / Planned Unavailability vs purchased-slot expiry | Open |
| X-14 | "Subscription-based requests" vs User App subscription model | Open |
| X-15 | Shared day-counting rule | Open |

## 12. Acceptance criteria

Confirmed rules only.

- [ ] Home uses a Balanced Dashboard in which work, earnings, peak demand, and availability are all prominent (AD-01).
- [ ] Home shows the seven sections in the order of AD-02.
- [ ] Welcome & Profile shows the astrologer's name, profile photo, and notification access (AD-02).
- [ ] Bottom navigation has exactly five tabs: Home, My Work, Live, Earnings, Profile (AD-03).
- [ ] When Online, services can be available, subject to the Instant Call and Instant Chat switches (AD-04).
- [ ] When Offline, Text-Based Questions and Appointments can still arrive; Instant Call and Instant Chat cannot (AD-05).
- [ ] Only Instant Call and Instant Chat have individual ON/OFF switches (AD-06).
- [ ] When DND is ON, all four services stop, and DND overrides the Instant Call and Instant Chat switches (AD-07).
- [ ] Turning DND OFF does not make the astrologer Online (AD-08).
- [ ] The astrologer can set a future Planned Unavailability period, during which all services stop (AD-09).
- [ ] New requests resume when DND is turned OFF or the unavailable period ends, subject to other rules (AD-12).
- [ ] Home contains no Availability Schedule or timings controls (AD-13).
- [ ] Earnings are based on services completed / answers delivered, for Today, This Week, and This Month (AD-14).
- [ ] Earnings show the three comparisons, growth in green, decreases honestly, and no pending payout figures (AD-15).
- [ ] Peak Demand is a compact four-period chart with the peak highlighted in gold and a "Peak Time" label (AD-16).
- [ ] Today's Work shows Appointments (count, next appointment, View All) and Text-Based Questions only (AD-17).
- [ ] Today's Work shows Received, Answered, and Pending question counts (AD-18).
- [ ] The Daily Answer Goal can be set to 5, 10, or 15, changed later, shows progress, and imposes no cap (AD-19).
- [ ] Recent Activity shows the four latest items (icon, description, time) and View All (AD-20).
- [ ] Exactly four Quick Actions are shown: Campaign Questions, Go Live, Content Creation, Remedy Tracker; no Vacation or Campaign Management (AD-21).
- [ ] The Remedy Tracker shows only this astrologer's remedies, shows "Completed" only when the User has completed a remedy, lets the astrologer view User attachments, and has no manual completion action (AD-22).
- [ ] Live, Earnings, and Profile are not specified in this file (AD-23).

## 13. Change log

| Date | Change |
|------|--------|
| 2026-11-17 | Initial draft created from AD-01 – AD-09 and AD-12 – AD-23. |
| 2026-11-17 | Synchronized with review list: AP-01-08 – AP-01-12 added to §11 and referenced in §2, §3, §5, §6, §7, §8. No decision changed. |
