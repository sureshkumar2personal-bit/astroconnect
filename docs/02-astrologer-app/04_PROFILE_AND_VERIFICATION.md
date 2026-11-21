# 04 — Profile and Verification

| Field | Value |
|-------|-------|
| Application | Astrologer App |
| Status | Draft |
| Owned decisions | AD-79 – AD-87 |
| Review list | [`00_ASTROLOGER_APP_REVIEW_LIST.md`](00_ASTROLOGER_APP_REVIEW_LIST.md) |
| Shared context | [`CONTEXT.md`](../../CONTEXT.md) |

> **Frontend UI phase.** This specification describes product behaviour. It
> does not define APIs, data structures, or backend logic. Items marked
> `PENDING DISCUSSION` must not be implemented as if decided.

---

## 1. Purpose

Defines the astrologer's profile: its sections and fields, profile media,
service shortcuts, verification status, preview, completion indicator, and
the edit-and-approval rule.

## 2. Scope / Out of scope

**In scope**
- Personal Information, Professional Information, Astrology Expertise, Profile Media, Service Information, Verification, Profile Preview, Profile Completion.
- Editing each section separately and the Platform Admin approval rule.

**Out of scope**
- Service pricing and availability → their modules: Text Questions [02](02_TEXT_BASED_QUESTIONS.md); Appointments [05](05_APPOINTMENTS.md); Instant Call and Chat packages [06](06_INSTANT_CALL_AND_CHAT.md) (AD-84).
- Account, security, language, and app settings → [15](15_SETTINGS_AND_PREFERENCES.md).
- Payout account (Bank/UPI) verification → [08](08_WALLET_AND_EARNINGS.md) (AD-125).
- Registration and login flows: not covered by the Master Decision Document; no rules are invented.
- Profile visibility during DND → AD-74 ([01](01_HOME_SCREEN.md)).

## 3. Entry points

- **Profile** tab (AD-03 → [01](01_HOME_SCREEN.md)).
- Welcome & Profile card on Home (AD-02 → [01](01_HOME_SCREEN.md)).

## 4. Confirmed decisions

**Owned by this module** (verbatim from the decision register)

| ID | Decision |
|----|----------|
| AD-79 | **Profile structure:** the profile is divided into separate sections rather than one giant Edit Profile screen: Personal Information, Professional Information, Astrology Expertise, Profile Media, Service Information, Verification, Profile Preview, and Profile Completion. Each information section is edited separately. |
| AD-80 | **Personal Information fields:** Full Name, Profile Photo, Date of Birth, Gender, Mobile, Email, City/State/Country, About Me/Bio. |
| AD-81 | **Professional Information fields:** Astrologer ID, Years of Experience, Education, Certifications, Professional Introduction, Languages. |
| AD-82 | **Astrology Expertise fields:** astrology types (for example Vedic, KP, Numerology, Vastu); specializations (for example marriage, career, finance, family, health); expertise areas; consultation languages. |
| AD-83 | **Profile Media:** Profile Photo; optional Introduction Video; Certificates/Qualification Documents; Supporting Documents. |
| AD-84 | **Service Information:** the profile provides shortcuts to Text Questions, Appointments, Instant Call, and Instant Chat. Pricing and availability are managed in their respective modules, not in the profile. |
| AD-85 | **Verification:** the profile shows KYC status, identity verification status, and certificate verification status, and offers a re-upload documents option. Unconfirmed KYC steps or approval statuses must not be invented. |
| AD-86 | **Profile Preview and Completion:** Profile Preview shows how the profile appears in the User App. A profile completion indicator is provided. |
| AD-87 | **Edit and approval:** selected important profile changes require Platform Admin approval. Until approval, the previously verified details remain visible in the User App. |

**Referenced decisions**

| ID | Topic | Owning file |
|----|-------|-------------|
| AD-02 | Welcome & Profile card on Home | [01](01_HOME_SCREEN.md) |
| AD-03 | Profile tab | [01](01_HOME_SCREEN.md) |
| AD-74 | Profile invisible to all users during DND | [01](01_HOME_SCREEN.md) |
| AD-106 | Instant Call/Chat packages shown on the profile (User App) | [06](06_INSTANT_CALL_AND_CHAT.md) |
| AD-112 | Verified Astrologers can start Live Sessions | [07](07_LIVE_SESSIONS.md) |
| AD-148 | Account and Security notifications (KYC, Profile Updated) | [14](14_NOTIFICATIONS_AND_REMINDERS.md) |

## 5. User flows

### 5.1 View the profile
1. The astrologer opens the Profile tab.
2. The profile is shown as separate sections (AD-79): Personal Information, Professional Information, Astrology Expertise, Profile Media, Service Information, Verification, Profile Preview, and the Profile Completion indicator.

### 5.2 Edit a section
1. The astrologer opens one section and edits only that section's fields (AD-79).
2. The astrologer saves the section.
3. If the change is a selected important change, it is sent for Platform Admin approval (AD-87). Which changes are "selected important changes": `PENDING DISCUSSION` (AP-04-02).
4. Until approval, the User App keeps showing the previously verified details (AD-87).
5. Other changes: whether they apply immediately is not stated beyond AD-87 and depends on AP-04-02.

### 5.3 Check verification and re-upload documents
1. The astrologer opens Verification.
2. KYC status, identity verification status, and certificate verification status are shown (AD-85).
3. The astrologer can re-upload documents (AD-85).
4. KYC steps and status values: `PENDING DISCUSSION` (AP-04-01).

### 5.4 Preview the profile
The astrologer opens Profile Preview and sees the profile as it appears in the User App (AD-86).

### 5.5 Go to a service
From Service Information the astrologer opens Text Questions, Appointments, Instant Call, or Instant Chat (AD-84), where pricing and availability are managed.

## 6. Screens and content

| Section | Fields / content | Source |
|---------|------------------|--------|
| Personal Information | Full Name; Profile Photo; Date of Birth; Gender; Mobile; Email; City/State/Country; About Me/Bio | AD-80 |
| Professional Information | Astrologer ID; Years of Experience; Education; Certifications; Professional Introduction; Languages | AD-81 |
| Astrology Expertise | Astrology types (e.g. Vedic, KP, Numerology, Vastu); specializations (e.g. marriage, career, finance, family, health); expertise areas; consultation languages | AD-82 |
| Profile Media | Profile Photo; optional Introduction Video; Certificates/Qualification Documents; Supporting Documents | AD-83 |
| Service Information | Shortcuts: Text Questions, Appointments, Instant Call, Instant Chat | AD-84 |
| Verification | KYC status; identity verification status; certificate verification status; re-upload documents | AD-85 |
| Profile Preview | Profile as it appears in the User App | AD-86 |
| Profile Completion | Completion indicator | AD-86 |

The examples in AD-82 are illustrative of the kinds of values; the full value
lists are not defined in the Master Decision Document.

## 7. Business rules and validations

| # | Rule | Source |
|---|------|--------|
| PRF-01 | The profile is never one single Edit Profile screen; each section is edited separately. | AD-79 |
| PRF-02 | Pricing and availability are not edited in the profile; Service Information only links to the service modules. | AD-84 |
| PRF-03 | Selected important changes require Platform Admin approval; until approval, previously verified details stay visible in the User App. | AD-87 |
| PRF-04 | KYC steps and approval statuses are not invented; only the three verification statuses and the re-upload option are shown. | AD-85 |
| PRF-05 | Introduction Video is optional. | AD-83 |
| PRF-06 | Profile Preview reflects the User App view, including that pending changes are not yet visible there. | AD-86, AD-87 |
| PRF-07 | During DND the profile is invisible to all users (AD-74 → [01](01_HOME_SCREEN.md)). | AD-74 |

Required fields, field lengths, and file formats/sizes for profile media are
not defined in the Master Decision Document and are not invented.

## 8. States and edge cases

| Case | Behaviour |
|------|-----------|
| Important change awaiting approval | User App shows the previously verified details (AD-87) |
| Verification status values | `PENDING DISCUSSION` (AP-04-01) |
| Document rejected / needs re-upload | Re-upload option available (AD-85); rejection notification under KYC Submitted/Approved/Rejected (AD-148) |
| Astrologer not yet verified | Live Sessions require Verified status (AD-112 → [07](07_LIVE_SESSIONS.md)); verification steps `PENDING DISCUSSION` (AP-04-01) |
| DND active | Profile invisible to all users (AD-74) |

## 9. Notifications triggered

| Notification | Category | Rule |
|--------------|----------|------|
| Profile Updated | H. Account and Security | AD-148 → [14](14_NOTIFICATIONS_AND_REMINDERS.md) |
| KYC Submitted/Approved/Rejected | H. Account and Security | AD-148 → [14](14_NOTIFICATIONS_AND_REMINDERS.md) |

## 10. Dependencies on other modules

- [01](01_HOME_SCREEN.md) — Profile tab, Welcome & Profile card, DND visibility (AD-02, AD-03, AD-74).
- [02](02_TEXT_BASED_QUESTIONS.md), [05](05_APPOINTMENTS.md), [06](06_INSTANT_CALL_AND_CHAT.md) — service settings reached from Service Information (AD-84).
- [07](07_LIVE_SESSIONS.md) — Verified status for Live (AD-112).
- [14](14_NOTIFICATIONS_AND_REMINDERS.md) — account and KYC notifications.
- **User App:** X-24 (astrologer profile fields, preview, and pending-approval display; User App P-05-01, P-05-06, D-38).
- **Platform Admin:** PA-04 (verification and profile-change approval).

## 11. PENDING DISCUSSION

Full wording in [`00_ASTROLOGER_APP_REVIEW_LIST.md` §4](00_ASTROLOGER_APP_REVIEW_LIST.md#4-open-questions-register).

**Owned by this module**

| ID | Topic | Status |
|----|-------|--------|
| AP-04-01 | KYC/verification steps and status values | Open |
| AP-04-02 | Which profile changes require Platform Admin approval | Open |

## 12. Acceptance criteria

- [ ] The profile is divided into the separate sections of AD-79, each edited separately.
- [ ] Personal, Professional, Expertise, and Media sections contain exactly the fields of AD-80 – AD-83; Introduction Video is optional.
- [ ] Service Information links to Text Questions, Appointments, Instant Call, and Instant Chat; no pricing or availability is edited in the profile (AD-84).
- [ ] Verification shows KYC, identity, and certificate verification statuses and a re-upload option (AD-85).
- [ ] Profile Preview shows the User App view and a completion indicator is shown (AD-86).
- [ ] Selected important changes wait for Platform Admin approval while the previously verified details remain visible in the User App (AD-87).

## 13. Change log

| Date | Change |
|------|--------|
| 2026-11-20 | Initial draft created from the Master Decision Document: AD-79 – AD-87. AP-04-01, AP-04-02 added. |
