# 13 — Birth Profiles and Kundli

| Field | Value |
|-------|-------|
| Application | User App |
| Status | Draft |
| Owned decisions | D-12, D-13, D-14 |
| Review list | [`00_USER_APP_REVIEW_LIST.md`](00_USER_APP_REVIEW_LIST.md) |
| Shared context | [`CONTEXT.md`](../../CONTEXT.md) |

---

## 1. Purpose

Defines how users save birth profiles, how the Kundli is generated and kept
up to date, and how users upload birth-chart files.

## 2. Scope / Out of scope

**In scope**
- Creating, viewing, editing, and deleting birth profiles.
- Generated Kundli.
- Uploaded birth-chart files.

**Out of scope**
- The user's own account profile → [12](12_USER_PROFILE_AND_SETTINGS.md).
- Which birth profile is attached to a Text Question → [06](06_TEXT_QUESTION_SERVICE.md) (P-06-07).

## 3. Entry points

- `PENDING DISCUSSION` (P-01-06).
- During onboarding: `PENDING DISCUSSION` (P-02-03).

## 4. Confirmed decisions

**Owned by this module** (verbatim from the decision register)

| ID | Decision |
|----|----------|
| D-12 | Users can initially save **unlimited birth profiles**. Future free/paid limits are **not finalized** (see P-13-07). |
| D-13 | Users can upload birth-chart files/images in **JPG, PNG, or PDF** format. |
| D-14 | If **DOB, birth time, or birth place** is changed, the generated **Kundli updates automatically**. Uploaded JPG/PNG/PDF files **remain unchanged**. |

## 5. User flows

### 5.1 Add a birth profile
1. The user adds a birth profile. There is no limit on the number of birth
   profiles at this stage (D-12).
2. Fields: `PENDING DISCUSSION` (P-13-01).
3. A Kundli is generated from the birth details. Generation method:
   `PENDING DISCUSSION` (P-13-02).

### 5.2 Upload a birth chart
1. The user uploads a birth-chart file or image in JPG, PNG, or PDF format (D-13).
2. Size and number limits: `PENDING DISCUSSION` (P-13-03).
3. Editing or replacing an uploaded file: `PENDING DISCUSSION` (P-13-08).

### 5.3 Change birth details
1. The user changes the DOB, birth time, or birth place.
2. The generated Kundli updates automatically (D-14).
3. Uploaded JPG/PNG/PDF files remain unchanged (D-14).
   - Warning to the user about uploads that may no longer match:
     `PENDING DISCUSSION` (P-13-06).
   - Effect on past consultations: `PENDING DISCUSSION` (P-13-05).

### 5.4 Delete a birth profile
`PENDING DISCUSSION` (P-13-04).

## 6. Screens and content

`PENDING DISCUSSION` (P-13-01, P-13-02, P-01-06).

## 7. Business rules and validations

| # | Rule | Source |
|---|------|--------|
| R-13-01 | Users can initially save an unlimited number of birth profiles. | D-12 |
| R-13-02 | Future free/paid limits on birth profiles are not finalized. | D-12, P-13-07 |
| R-13-03 | Birth-chart uploads are accepted in JPG, PNG, or PDF format. | D-13 |
| R-13-04 | Changing the DOB, birth time, or birth place automatically updates the generated Kundli. | D-14 |
| R-13-05 | Uploaded JPG/PNG/PDF files are not changed when birth details change. | D-14 |

## 8. States and edge cases

| Case | Behaviour |
|------|-----------|
| DOB, birth time, or birth place edited | Kundli updates automatically; uploads unchanged (D-14) |
| File in a format other than JPG, PNG, or PDF | Supported formats are JPG, PNG, PDF (D-13); error handling `PENDING DISCUSSION` (P-13-03) |
| File too large | `PENDING DISCUSSION` (P-13-03) |
| Deleting a profile used in a past consultation | `PENDING DISCUSSION` (P-13-04) |
| Past consultations after birth details change | `PENDING DISCUSSION` (P-13-05) |

## 9. Notifications triggered

None confirmed.

## 10. Dependencies on other modules

- [02](02_AUTHENTICATION_AND_ONBOARDING.md) — onboarding (P-02-03).
- [06](06_TEXT_QUESTION_SERVICE.md) — birth profile attached to questions (P-06-07).
- [07](07_APPOINTMENT_SERVICE.md), [08](08_INSTANT_CALL.md), [09](09_INSTANT_CHAT.md) — birth profile shared in other services (P-13-09).

## 11. PENDING DISCUSSION

Full wording in [`00_USER_APP_REVIEW_LIST.md` §4](00_USER_APP_REVIEW_LIST.md#4-pending-discussion-register).

**Owned by this module**

| ID | Topic |
|----|-------|
| P-13-01 | Birth profile fields |
| P-13-02 | Kundli generation (chart style, language) |
| P-13-03 | Upload size and number limits |
| P-13-04 | Deleting a profile used in a past consultation |
| P-13-05 | Past consultations after details change |
| P-13-06 | Warning about uploads that may not match |
| P-13-07 | Future free/paid limits |
| P-13-08 | Editing or replacing uploads |
| P-13-09 | Birth profile shared in Appointment, Instant Call, Instant Chat |

**Related (owned elsewhere)**

| ID | Topic |
|----|-------|
| P-01-06 | Entry point |
| P-02-03 | Birth profile during onboarding |
| P-06-07 | Birth profile attached to a question |
| P-GL-03 | Privacy, consent and data retention |

## 12. Acceptance criteria

- [ ] A user can save more birth profiles without hitting a limit (D-12).
- [ ] A user can upload a birth chart in JPG, PNG, or PDF format (D-13).
- [ ] Changing the DOB, birth time, or birth place automatically updates the generated Kundli (D-14).
- [ ] Uploaded JPG/PNG/PDF files are unchanged after birth details are edited (D-14).

## 13. Change log

| Date | Change |
|------|--------|
| 2026-11-17 | Initial draft created from D-12 to D-14. |
