# 17 — Remedy Tracker

| Field | Value |
|-------|-------|
| Application | Astrologer App |
| Status | Draft |
| Owned decisions | AD-163, AD-174 – AD-178 |
| Review list | [`00_ASTROLOGER_APP_REVIEW_LIST.md`](00_ASTROLOGER_APP_REVIEW_LIST.md) |
| Shared context | [`CONTEXT.md`](../../CONTEXT.md) |

> **Frontend UI phase.** This specification describes product behaviour. It
> does not define APIs, data structures, or backend logic. Items marked
> `PENDING DISCUSSION` must not be implemented as if decided.

---

## 1. Purpose

Brings together the astrologer-side Remedy Tracker: remedies from Text
Question answers and Dispute Answers, and notes, remedies, recommendations,
and reports from Appointments (each linked to the User and the originating
record), plus the astrologer's Saved Methods, the remedies assigned to Users,
their progress, follow-ups and history.

## 2. Scope / Out of scope

**In scope**
- Appointment-related records in the Remedy Tracker (AD-163).
- Relationship and navigation to the originating record.
- The five tabs, Saved Methods, assignments, Needs Attention and History (AD-174 – AD-178).

**Out of scope** (owned elsewhere; ownership unchanged)
- Astrologer view of remedies and completion → AD-22 ([01](01_HOME_SCREEN.md)).
- Prescribing remedies while answering → AD-39 ([02](02_TEXT_BASED_QUESTIONS.md)).
- Adding post-consultation attachments → AD-102 ([05](05_APPOINTMENTS.md)).
- Remedy subscriptions, payments, or delivery workflows — none exist (AD-163); assigning a remedy involves no payment.
- How the User sees an assignment and sends daily updates → User App (AP-17-01).

## 3. Entry points

- Home Quick Action **Remedy Tracker** (AD-21 → [01](01_HOME_SCREEN.md)).
- Appointment History (AD-102 → [05](05_APPOINTMENTS.md)).
- Placement within the tabs: `PENDING DISCUSSION` (AP-GL-02).

## 4. Confirmed decisions

**Owned by this module** (verbatim from the decision register)

| ID | Decision |
|----|----------|
| AD-163 | **Remedy Tracker — appointment records:** notes, remedies, recommendations, and reports sent after the call ends (AD-102) are also available in the Remedy Tracker. The relationship between each remedy/report, the relevant User, and the originating Appointment/Consultation is preserved, with correct navigation to the original record. No additional remedy subscription, payment, or delivery workflows are added. |
| AD-174 | **Remedy Tracker structure:** the Remedy Tracker has five screens — Overview, Saved Methods, Assignments, Needs Attention and History. Saved Methods and History are tabs in the same row as the four summary cards (Overview and the other screens have no separate top tab bar); Assignments and Needs Attention open from the Active assignments and Need attention cards. The Overview shows four summary cards (Active assignments, Need attention, Completed in November, Overall completion rate), the astrologer's remedies with how many assignments are Started, Ongoing, Skipped and Completed (search by remedy or User; filter by service, status and assignment date; sort), and Remedy Performance (completion rate by remedy, most used remedies). *(Added 2026-11-27 at the product owner's request; extends AD-163. Amended 2026-11-28 at the product owner's request; superseded wording: "has five tabs" with a top tab bar, and "Remedies from Text Question answers and Dispute Answers (AD-39) and appointment attachments (AD-102, AD-163) stay listed on the Overview as read-only records" — the Overview no longer shows them, see AP-17-02.)* |
| AD-175 | **Saved Methods:** the astrologer works from two lists. Platform Templates are provided by Platform Admin and are read-only; the astrologer can preview one and use it, which creates the astrologer's own editable copy. My Saved Methods are the astrologer's own. A method has a name (required), a category (Homam, Pooja, Parihara or Mantra), a recommended duration of 1–60 days (required), a short and a detailed description, an optional image chosen from the astrologer's device, required materials (name, optional quantity), ordered step-by-step instructions and optional notes. A method is saved as Active or as a Draft; it can be edited, duplicated, archived (it can no longer be assigned and can be restored from History) or deleted, and deletion is allowed only for a method that has never been assigned. Only Active methods can be assigned. Edits apply to future assignments only. *(Added 2026-11-27 at the product owner's request.)* |
| AD-176 | **Assigning and managing remedies:** the astrologer assigns an Active Saved Method to a User, with a service reference (Text Questions, Appointments, Instant Chat or Instant Call), an assignment date, a start date that is not before the assignment date, a duration of 1–60 days (the method's by default), customised instructions and an optional note shown to the User. Each assignment has its own ID and keeps a snapshot of the method; a User may have several assignments of the same method. From an assignment the astrologer can edit the duration (not below the number of days that already have a User status, at most 60), the instructions and the note; mark or remove a follow-up; Assign Again; Stop Remedy (once it has started, with a required reason) or Cancel Assignment (before it starts, with a required reason); and keep private notes that only the astrologer sees. Assignments are never deleted. *(Added 2026-11-27 at the product owner's request.)* |
| AD-177 | **Daily progress and completion are reported by the User:** the User reports each day as Completed or Skipped in the User App; no astrologer approval is needed. A day without an update stays "Pending / No Update" and is never turned into Skipped automatically. The User submits final completion once, on the final day, with optional photos and an optional note; the assignment then shows Completed, or Completed with Skipped Days, and moves to History. An assignment past its end date stays active until the User submits it and is never auto-completed. The astrologer has no action that sets a day's status or the completion (AD-22). *(Added 2026-11-27 at the product owner's request.)* |
| AD-178 | **Needs Attention and History:** Needs Attention lists active assignments with consecutive days without an update (the astrologer chooses 2, 3 or 4 days; default 2), an overdue end date (right after, or 1 or 2 days after the end date, without final completion), pending days, skipped days, a recent stop, or a follow-up flag, and can be filtered by reason and service. History keeps completed, stopped and cancelled assignments with their daily progress, photos and activity, and lists archived methods, which can be restored; nothing is deleted. *(Added 2026-11-27 at the product owner's request.)* |

**Referenced decisions**

| ID | Topic | Owning file |
|----|-------|-------------|
| AD-21 | Remedy Tracker Quick Action | [01](01_HOME_SCREEN.md) |
| AD-22 | Astrologer view; only the User marks Completed | [01](01_HOME_SCREEN.md) |
| AD-39 | Prescribing remedies in answers and Dispute Answers | [02](02_TEXT_BASED_QUESTIONS.md) |
| AD-45 | Astrologer attachment rules | [02](02_TEXT_BASED_QUESTIONS.md) |
| AD-78 | Record navigation | [03](03_GLOBAL_NAVIGATION.md) |
| AD-102 | Post-consultation attachments | [05](05_APPOINTMENTS.md) |

## 5. User flows

### 5.1 Appointment record reaches the Remedy Tracker
1. After End Call, the astrologer sends the consultation attachment and, where required, the remedy details; the appointment is then Completed (AD-102).
2. The record also appears in the Remedy Tracker, linked to the User and the originating Appointment (AD-163).

### 5.2 Open the original record
From a Remedy Tracker item, the astrologer opens the originating Appointment/Consultation (AD-163, AD-78).

### 5.3 Completion
Only the User can mark a remedy Completed; the astrologer sees the status and any uploaded attachment (AD-22 → [01](01_HOME_SCREEN.md)).

### 5.4 Build a method
Saved Methods → Platform Templates → Preview / Use Template, or Create New Method; fill Basic Details, optional image, materials, steps and notes, check the live preview, then Save Method or Save as Draft (AD-175).

### 5.5 Assign a remedy
Assign Remedy (Overview, Assignments, or a method): select a User, a service reference and an Active method; review the start date, duration, instructions and note; Assign Remedy. The new assignment opens with its own ID (AD-176).

### 5.6 Follow an assignment
Assignment details show the daily timeline reported by the User, overall progress, final completion with any photos, the assigned instructions, private notes and activity (AD-176, AD-177). Needs Attention lists assignments that may need a follow-up; History keeps closed ones (AD-178).

## 6. Screens and content

| Item | Content | Source |
|------|---------|--------|
| Remedy Tracker list | Remedies prescribed by this astrologer and their completion status | AD-22 |
| Appointment record | Notes/remedies/recommendations/reports; User; originating Appointment/Consultation; link to it | AD-163 |
| Overview | Summary cards; remedy list with counts and filters; Remedy Performance. The read-only list of remedies from consultations is not shown (AP-17-02) | AD-174 |
| Saved Methods | Platform Templates (read-only); My Saved Methods; method form with live preview | AD-175 |
| Assignments / remedy / assignment details | All assignments; one remedy's assignments; timeline, progress, final completion, instructions, private notes, activity | AD-176, AD-177 |
| Needs Attention / History | Attention reasons with rules; closed assignments; archived methods | AD-178 |

Remedy fields for records from consultations beyond those listed are not defined (User App P-16-01).
The page header shows the title only, with the Assign Remedy and Create New Method actions;
no descriptive subtitle is shown under it (product owner's instruction, 2026-11-27).
The Users, assignments, Platform Templates and photos shown are illustrative sample data (AP-17-01).

## 7. Business rules and validations

| # | Rule | Source |
|---|------|--------|
| REM-01 | Appointment notes, remedies, recommendations, and reports are available in the Remedy Tracker. | AD-163 |
| REM-02 | Each item keeps its link to the User and the originating Appointment/Consultation. | AD-163 |
| REM-03 | Navigation from an item opens the original record. | AD-163, AD-78 |
| REM-04 | No remedy subscription, payment, or delivery workflow. | AD-163 |
| REM-05 | Only the User marks a remedy Completed. | AD-22 |
| REM-06 | Only an Active method can be assigned; a method that has ever been assigned is archived, not deleted. | AD-175 |
| REM-07 | Method name and a duration of 1–60 days are required; an assignment's duration is 1–60 days and its start date is not before its assignment date. | AD-175, AD-176 |
| REM-08 | An assignment keeps a snapshot of its method; later method edits do not change it. | AD-175, AD-176 |
| REM-09 | Stop Remedy (after it starts) and Cancel Assignment (before it starts) need a reason; assignments are never deleted. | AD-176 |
| REM-10 | Days without a User update stay Pending / No Update; they are never auto-skipped, and an overdue assignment is never auto-completed. | AD-177 |
| REM-11 | The duration cannot be reduced below the number of days that already have a User status. | AD-176 |

## 8. States and edge cases

| Case | Behaviour |
|------|-----------|
| Attachment added later from Appointment History | Appears in the Remedy Tracker (AD-102, AD-163) |
| Appointment completed without attachments | Allowed; completion/settlement unaffected (AD-102) |
| Remedy not yet completed by the User | Shown as not completed; astrologer cannot change it (AD-22) |
| Method with assignments | Cannot be deleted; can be archived (AD-175) |
| Assignment past its end date | Stays active and shows Overdue until the User submits final completion (AD-177) |
| Final completion without photos | Allowed; shown as "No Photos Submitted" (AD-177) |
| Same User, same method again | Creates a separate assignment with its own ID; a warning is shown (AD-176) |

## 9. Notifications triggered

No pending-attachment reminders are sent (AD-102, amended 2026-11-27).

## 10. Dependencies on other modules

- [01](01_HOME_SCREEN.md), [02](02_TEXT_BASED_QUESTIONS.md), [05](05_APPOINTMENTS.md).
- **User App:** X-08 (resolved; User App D-11, D-29); X-23 (appointment records and link to original consultation; User App P-16-01, P-16-05); daily updates, final completion and photos for assignments (AD-177, AP-17-01).
- **Platform Admin:** Platform Templates are provided by Platform Admin (AD-175); no Platform Admin decision confirmed (AP-17-01).

## 11. PENDING DISCUSSION

Full wording in [`00_ASTROLOGER_APP_REVIEW_LIST.md` §4](00_ASTROLOGER_APP_REVIEW_LIST.md#4-open-questions-register).

**Owned by this module**

| ID | Topic | Status |
|----|-------|--------|
| AP-17-01 | Ownership of Platform Templates and the User App flow for assignments | Open |
| AP-17-02 | Remedies from consultations are no longer shown in the Remedy Tracker; effect on AD-163 | Open |

**Related**

| ID | Topic | Status |
|----|-------|--------|
| AP-GL-02 | Placement of the Remedy Tracker within the tabs | Open — missing source information |

## 12. Acceptance criteria

- [ ] Appointment notes, remedies, recommendations, and reports appear in the Remedy Tracker linked to the User and the originating record, with working navigation to it (AD-163) — **on hold: the list is not shown on the Overview (AP-17-02)**.
- [ ] No remedy subscription, payment, or delivery workflow exists (AD-163).
- [ ] The Remedy Tracker has the five tabs; the summary cards and counts match the assignments shown (AD-174).
- [ ] Saved Methods follow AD-175, including draft, archive and delete-only-if-never-assigned.
- [ ] Assignments follow AD-176; Stop and Cancel require a reason and nothing is deleted.
- [ ] Daily statuses and completion are never set by the astrologer; missing updates stay Pending (AD-177).
- [ ] Needs Attention and History follow AD-178.

## 13. Change log

| Date | Change |
|------|--------|
| 2026-11-20 | Initial draft created from the Master Decision Document: AD-163. AD-22 and AD-39 ownership unchanged. |
| 2026-11-28 | The read-only "Remedies from consultations" panel was removed from the Overview at the product owner's request; AD-174 amended; AP-17-02 added (AD-163 effect). |
| 2026-11-28 | AD-174 amended: Saved Methods and History are tabs beside the four summary cards; the separate top tab bar is removed; Assignments and Needs Attention open from the summary cards. Descriptive subtitles removed from the Assign Remedy, Saved Methods, History and method form screens. Method form and assignment detail layouts regrouped. No rule changed. |
| 2026-11-27 | Remedy Tracker rebuilt from the Remedy Tracker reference: AD-174 – AD-178 added (five tabs, Saved Methods, assignments, User-reported progress, Needs Attention and History); §5.4 – §5.6, §6, §7 (REM-06 – REM-11), §8, §10 and §12 extended; AP-17-01 added. AD-163, AD-22 and AD-39 unchanged. |
| 2026-11-27 | AD-163 and §5.1 reworded for the amended AD-102: records are sent after End Call, no longer "immediately or later". AD-22 and AD-39 unchanged. |
