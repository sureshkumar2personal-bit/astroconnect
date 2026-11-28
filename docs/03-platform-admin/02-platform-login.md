# 02 — Platform Login

| Field | Value |
|-------|-------|
| Application | Platform Admin (common login for all roles) |
| Version | 0.1 (Draft) |
| Last Updated | 2026-11-25 |
| Status | Draft — awaiting product-owner review; not committed |
| Review list | [`15-platform-review-list.md`](15-platform-review-list.md) |

---

## 1. Purpose

Defines the common login page shared by Users, Astrologers, and Admins, and
the role-based navigation after login.

## 2. Common Login page

One common Login page containing:
- **Role selection:** User · Astrologer · Admin.
- **Email / Phone Number.**
- **Password.**
- **Forgot Password.**
- **Login / Continue.**

## 3. Social login

- Google login UI.
- Social-media login UI for demo purposes.
- No additional providers are defined; none may be invented (`PP-24`).
- No real OAuth implementation in the current documentation/demo phase.

## 4. Role-based navigation

| Selected role | Opens |
|---------------|-------|
| User | User App |
| Astrologer | Astrologer App |
| Admin | Platform Admin |

Admin Assistants use the Platform Admin Dashboard (assigned sections only);
Astrologer Assistants use their assigned Astrologer's dashboard (allowed
sections only) — [Assistant Management](04-people-management/assistant-management.md).
Assistants log in only after their approved Email ID is verified; Assistant
Forgot Password uses Email OTP.

## 5. Current demo scope

- Frontend demo.
- Mock data.
- No real backend authentication, API, or database in this documentation phase.

## 6. Astrologer registration

- Astrologer registration does **not** require Platform Admin approval.
- This is separate from verification statuses shown in the Astrologer App
  (Astrologer `AD-85`; KYC steps open as Astrologer `AP-04-01`) and from the
  approval of selected important profile changes (Astrologer `AD-87`).
- Detailed registration and document requirements: **Pending Discussion – Not
  Finalized** (`PP-07`).

## 7. Validations and restrictions

- Suspended or Blocked accounts cannot log in ([Platform Rules §7](01-platform-rules.md)).
- Password and OTP are never visible to Admin.
- No authentication requirement beyond this page is approved.

## 8. Cross-app dependencies

- User App authentication and onboarding (`docs/01-user-app/02_AUTHENTICATION_AND_ONBOARDING.md`)
  has open questions; the common login page must be aligned there — `PX-03`.
- The Astrologer App documentation has no login specification — `PX-03`.

## 9. Pending Discussion – Not Finalized

| ID | Item |
|----|------|
| PP-07 | Astrologer registration and document requirements (final registration stage) |
| PP-24 | Social login providers beyond the Google UI and a generic social-media UI; real OAuth |

## 10. Acceptance criteria

- [ ] One login page with role selection (User, Astrologer, Admin), Email/Phone, Password, Forgot Password, Login/Continue.
- [ ] Google and social-media login UI shown for demo only.
- [ ] User → User App; Astrologer → Astrologer App; Admin → Platform Admin.
- [ ] Astrologer registration does not wait for Platform Admin approval.

## 11. Change History

| Version | Date | Change |
|---------|------|--------|
| 0.1 | 2026-11-25 | Initial draft from owner-finalized login requirements. |
