# 15 — Settings and Preferences

| Field | Value |
|-------|-------|
| Application | Astrologer App |
| Status | Draft |
| Owned decisions | AD-152 – AD-157 |
| Review list | [`00_ASTROLOGER_APP_REVIEW_LIST.md`](00_ASTROLOGER_APP_REVIEW_LIST.md) |
| Shared context | [`CONTEXT.md`](../../CONTEXT.md) |

> **Frontend UI phase.** This specification describes product behaviour. It
> does not define APIs, data structures, or backend logic. Items marked
> `PENDING DISCUSSION` must not be implemented as if decided.

---

## 1. Purpose

Defines the Settings area: Account Settings, Notification Preferences,
Language and Regional Settings, App Preferences, Privacy and Security, and
About and Account Actions.

## 2. Scope / Out of scope

**In scope**
- The six settings groups of AD-152 – AD-157.
- Deactivation and deletion requests routed to Platform Admin.

**Out of scope**
- Profile information → [04](04_PROFILE_AND_VERIFICATION.md).
- Notification categories and the preference rule → [14](14_NOTIFICATIONS_AND_REMINDERS.md) (AD-148, AD-150).
- Service availability (Online/Offline, DND) → [01](01_HOME_SCREEN.md).
- Payout accounts → [08](08_WALLET_AND_EARNINGS.md).

## 3. Entry points

- Placement within the tabs: `PENDING DISCUSSION` (AP-GL-02).

## 4. Confirmed decisions

**Owned by this module** (verbatim from the decision register)

| ID | Decision |
|----|----------|
| AD-152 | **Account Settings:** account details; registered mobile/email; Change Password; Login/Security Activity. |
| AD-153 | **Notification Preferences (Settings):** push notifications On/Off; Sound/Vibration; category-specific preferences; event-specific preferences; important security alerts mandatory (AD-150). |
| AD-154 | **Language and Regional Settings:** app language — English, Tamil, and other supported languages; date format; time zone, IST by default. |
| AD-155 | **App Preferences:** Light Mode; Dark Mode; camera permissions; microphone permissions; Photos/Files access. |
| AD-156 | **Privacy and Security:** Privacy Policy; Terms and Conditions; Data/Privacy Information; Active Login Sessions; Logout from other devices. |
| AD-157 | **About and Account Actions:** App Version; About AstroConnect; Logout; Request Account Deactivation; Request Account Deletion. Deactivation and deletion requests are routed to Platform Admin for approval; an account is never deactivated or deleted instantly without the approval workflow. |

**Referenced decisions**

| ID | Topic | Owning file |
|----|-------|-------------|
| AD-71 | IST calendar-day counting for business rules | [02](02_TEXT_BASED_QUESTIONS.md) |
| AD-148 | Account and Security notifications | [14](14_NOTIFICATIONS_AND_REMINDERS.md) |
| AD-150 | Preference rule; security alerts mandatory | [14](14_NOTIFICATIONS_AND_REMINDERS.md) |
| AD-151 | Availability vs notifications | [14](14_NOTIFICATIONS_AND_REMINDERS.md) |

## 5. User flows

### 5.1 Change password
Account Settings → Change Password (AD-152). A Password Changed notification follows (AD-148).

### 5.2 Review login activity and sessions
Account Settings → Login/Security Activity (AD-152); Privacy and Security → Active Login Sessions → Logout from other devices (AD-156).

### 5.3 Set notification preferences
Notification Preferences → push On/Off, Sound/Vibration, category and event switches; important security alerts stay On (AD-153, AD-150).

### 5.4 Change language, date format, or time zone
Language and Regional Settings (AD-154). The effect of changing the time zone on business-day rules: `PENDING DISCUSSION` (AP-15-01).

### 5.5 Request deactivation or deletion
1. About and Account Actions → Request Account Deactivation or Request Account Deletion (AD-157).
2. The request goes to Platform Admin for approval; the account is not deactivated or deleted instantly (AD-157).

## 6. Screens and content

| Group | Items | Source |
|-------|-------|--------|
| Account Settings | Account details; registered mobile/email; Change Password; Login/Security Activity | AD-152 |
| Notification Preferences | Push On/Off; Sound/Vibration; category-specific; event-specific; important security alerts mandatory | AD-153 |
| Language and Regional | App language (English, Tamil, other supported languages); date format; time zone (IST by default) | AD-154 |
| App Preferences | Light Mode; Dark Mode; camera; microphone; Photos/Files access | AD-155 |
| Privacy and Security | Privacy Policy; Terms and Conditions; Data/Privacy Information; Active Login Sessions; Logout from other devices | AD-156 |
| About and Account Actions | App Version; About AstroConnect; Logout; Request Account Deactivation; Request Account Deletion | AD-157 |

The list of "other supported languages" and the available date formats are
not defined and are not invented.

### 6.1 Prototype layout (frontend UI phase)

Settings is shown from the reference design "AstroConnect Settings", with the
six groups above as its sections. This describes presentation only; it adds no
business rule.

- **Desktop:** a vertical list of the six sections on the left; the selected
  section on the right. Each section has its own address, so it can be opened
  directly.
- **Phone:** a list of the six sections; opening one shows it with a back
  button to the list.
- **No descriptive subtitles** are shown under the Settings page or section
  headings (product owner's instruction, 2026-11-27).
- **Account Settings:** account identity with a link to My Profile ([04](04_PROFILE_AND_VERIFICATION.md)),
  Change Password, and Login/Security Activity. The password checks shown in
  the prototype (at least 8 characters, a number, a different new password,
  matching confirmation) are illustrative and are not a confirmed password policy.
- **Notification Preferences:** push, sound and vibration; the nine categories
  A–I (AD-148) with expandable events where the prototype lists them; important
  security alerts shown as mandatory (SET-01). The events listed are illustrative.
- **Language and Regional:** English and Tamil only; two date formats with a
  live preview; time zone shown as Asia/Kolkata (IST) with no way to change it,
  because the effect of a change is undecided (AP-15-01).
- **App Preferences:** Light and Dark appearance (the app's own theme) and
  the camera, microphone and Photos/Files permissions, each opening a details
  view. The app cannot change a device permission; the statuses shown are
  illustrative.
- **Privacy and Security:** the three documents (their text is provided by the
  Platform), active sessions with Log out per session and Log out from other
  devices, each after a confirmation (SET-05).
- **About and Account Actions:** app version, About AstroConnect, Logout, and the
  deactivation and deletion requests. Each request is confirmed, then shows a
  submitted screen with a reference number and the status "Pending admin review"
  (SET-04); deletion additionally requires acknowledging that it cannot be undone.
  Request statuses beyond "pending" are not defined (see §8).

## 7. Business rules and validations

| # | Rule | Source |
|---|------|--------|
| SET-01 | Important security alerts cannot be disabled. | AD-153, AD-150 |
| SET-02 | Notification settings never change service availability. | AD-151 |
| SET-03 | Time zone defaults to IST. | AD-154 |
| SET-04 | Deactivation and deletion are requests that require Platform Admin approval; never instant. | AD-157 |
| SET-05 | Logout from other devices ends the other active sessions listed. | AD-156 |

## 8. States and edge cases

| Case | Behaviour |
|------|-----------|
| Deactivation/deletion requested | Awaits Platform Admin approval (AD-157); request statuses not defined |
| Security alert switch | Shown as mandatory, cannot be turned off (AD-150) |
| Time zone changed from IST | `PENDING DISCUSSION` (AP-15-01); business rules use IST (AD-71) |
| Camera/microphone permission denied | Permission setting shown (AD-155); impact on calls/Live not defined |

## 9. Notifications triggered

Password Changed; Email/Mobile Changed; New Login; New Device Login;
Important Security Alerts (category H) → AD-148 ([14](14_NOTIFICATIONS_AND_REMINDERS.md)).

## 10. Dependencies on other modules

- [14](14_NOTIFICATIONS_AND_REMINDERS.md) — preference rule.
- [04](04_PROFILE_AND_VERIFICATION.md) — profile data (mobile/email shown in both).
- **User App:** none.
- **Platform Admin:** PA-08 (deactivation/deletion approval).

## 11. PENDING DISCUSSION

Full wording in [`00_ASTROLOGER_APP_REVIEW_LIST.md` §4](00_ASTROLOGER_APP_REVIEW_LIST.md#4-open-questions-register).

**Owned by this module**

| ID | Topic | Status |
|----|-------|--------|
| AP-15-01 | Effect of changing the time zone (IST default) | Open |

**Related**

| ID | Topic | Status |
|----|-------|--------|
| AP-GL-02 | Placement of Settings within the tabs | Open — missing source information |

## 12. Acceptance criteria

- [ ] Settings contains the six groups and items of AD-152 – AD-157.
- [ ] Important security alerts cannot be disabled (AD-153).
- [ ] IST is the default time zone (AD-154).
- [ ] Deactivation and deletion are sent to Platform Admin for approval and never applied instantly (AD-157).

## 13. Change log

| Date | Change |
|------|--------|
| 2026-11-20 | Initial draft created from the Master Decision Document: AD-152 – AD-157. AP-15-01 added. |
| 2026-11-27 | §6.1 added: Settings rebuilt from the "AstroConnect Settings" reference (vertical section navigation on desktop, list → detail on phones, no descriptive subtitles). No decision added or changed; AP-15-01 stays open. |
