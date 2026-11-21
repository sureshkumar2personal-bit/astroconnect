# 12 — Content Management

| Field | Value |
|-------|-------|
| Application | Astrologer App |
| Status | Draft |
| Owned decisions | AD-138 – AD-144 |
| Review list | [`00_ASTROLOGER_APP_REVIEW_LIST.md`](00_ASTROLOGER_APP_REVIEW_LIST.md) |
| Shared context | [`CONTEXT.md`](../../CONTEXT.md) |

> **Frontend UI phase.** This specification describes product behaviour. It
> does not define APIs, data structures, or backend logic. Items marked
> `PENDING DISCUSSION` must not be implemented as if decided.

---

## 1. Purpose

Defines the dedicated Content Management module: General Posts and
Subscriber Benefit Content, the 12-Rasi prediction template, the special
astrology templates, custom content, the split-screen editor with live
preview, scheduling, and delivery history.

## 2. Scope / Out of scope

**In scope**
- General Posts (Text, Image).
- Subscriber Benefit Content (Daily, Weekly, Monthly, Special Predictions).
- Templates: 12-Rasi prediction template; ten special astrology templates; custom content.
- Editor, live preview, Publish Now, Schedule, Save Draft, Edit, Delete.
- Delivery history and engagement.

**Out of scope**
- Video posts (not supported, AD-139).
- A separate Perks & Benefits content module (not created, AD-138).
- Subscription benefit questions → AD-72 ([02](02_TEXT_BASED_QUESTIONS.md)).
- Subscription price, duration, renewal, cancellation/refund → on hold (X-14).
- Content analytics → [13](13_ANALYTICS_AND_PERFORMANCE.md).

## 3. Entry points

- Home Quick Action **Benefits & Content** (AD-21 → [01](01_HOME_SCREEN.md)) opens this module (AD-138).
- Placement within the tabs: `PENDING DISCUSSION` (AP-GL-02).
- Content post rows → Content Details/Edit page (AD-78 → [03](03_GLOBAL_NAVIGATION.md)).
- Category E notifications (AD-148).

## 4. Confirmed decisions

**Owned by this module** (verbatim from the decision register)

| ID | Decision |
|----|----------|
| AD-138 | **Content Management module:** Content Management is a dedicated module that manages both **General Posts** and **Subscriber Benefit Content**. Content creation, scheduling, and delivery belong only to this module; no separate Perks & Benefits module duplicates them (benefit eligibility/rules may be documented separately). The Home Quick Action "Benefits & Content" (AD-21) opens this module. |
| AD-139 | **General Posts:** formats are Text Posts and Image Posts; there are no Video Posts. Audience: Public, Followers, Subscribers, or individual subscription tiers (for example Silver and Gold). Features: Publish Now, Schedule, Save Draft, Edit, Delete; Published and Scheduled status; engagement/performance history. Users can Like and Comment. |
| AD-140 | **Subscriber Benefit Content:** manages Daily, Weekly, Monthly, and Special Predictions in Text and Image formats. Each subscription tier may have separate content (for example, Silver and Gold content can differ). Daily and Weekly recurring schedules are supported. Delivery history shows Delivered, Missed, and Pending where applicable; missed scheduled content is recorded as **Missed**. Users with expired subscriptions cannot access subscriber-only content. |
| AD-141 | **Prediction template (12 Rasis):** Daily, Weekly, and Monthly predictions use one default template containing all 12 zodiac signs (Rasis): the 12 Rasis in the left column and a prediction input field for each Rasi in the right column. The template provides the 12 signs automatically; the astrologer only fills the prediction fields. New content is created for the relevant date, week, or month. Content format is Text + Image. |
| AD-142 | **Special astrology templates:** ten optional prebuilt templates: Guru Peyarchi, Sani Peyarchi, Rahu Peyarchi, Ketu Peyarchi, Sevvai Peyarchi, Surya Peyarchi, Sukra Peyarchi, Budha Peyarchi, Surya Grahanam, Chandra Grahanam. Annual or recurring use is not forced. All astrologers can access and use all available templates. For every template the astrologer selects the audience: Public, Followers, Subscribers, or specific tiers. |
| AD-143 | **Custom content:** the astrologer can create original content without a template. The custom editor includes Custom Title, Text/Description, Image Upload, Audience Selection, Publish Now, Schedule, and Save Draft. |
| AD-144 | **Editor and preview:** before submission a split-screen layout is used — left: full content editor, content fields, formatting, template fields, image upload, audience selection, scheduling controls; right: live User App preview that updates immediately as the astrologer edits. Preview works before Publish Now, Schedule, and Save Draft. On mobile, Editor/Preview tabs are used when split-screen is not practical. |

**Referenced decisions**

| ID | Topic | Owning file |
|----|-------|-------------|
| AD-21 | "Benefits & Content" Quick Action | [01](01_HOME_SCREEN.md) |
| AD-72 | Subscription tiers Silver, Gold, Platinum | [02](02_TEXT_BASED_QUESTIONS.md) |
| AD-78 | Content post → Content Details/Edit page | [03](03_GLOBAL_NAVIGATION.md) |
| AD-145 | Content analytics | [13](13_ANALYTICS_AND_PERFORMANCE.md) |
| AD-148 | Content notification events (category E) | [14](14_NOTIFICATIONS_AND_REMINDERS.md) |

## 5. User flows

### 5.1 Create a General Post
1. The astrologer opens Content Management → General Posts.
2. The astrologer writes a Text Post or an Image Post (AD-139).
3. The astrologer selects the audience: Public, Followers, Subscribers, or individual tiers (AD-139).
4. The split-screen editor shows a live User App preview (AD-144).
5. The astrologer chooses Publish Now, Schedule, or Save Draft (AD-139); preview is available before each (AD-144).
6. Published and Scheduled posts can be edited or deleted (AD-139).

### 5.2 Create a Daily, Weekly, or Monthly Prediction
1. The astrologer opens Subscriber Benefit Content and chooses Daily, Weekly, or Monthly Prediction (AD-140).
2. The 12-Rasi template opens with all 12 Rasis in the left column (AD-141).
3. The astrologer fills one prediction field per Rasi; images may be added (Text + Image) (AD-141).
4. The astrologer selects the subscription tier(s); each tier may have different content (AD-140).
5. The astrologer publishes, schedules (including Daily/Weekly recurring schedules), or saves a draft (AD-140, AD-143).
6. New content is created for the relevant date, week, or month (AD-141).

### 5.3 Use a special astrology template
1. The astrologer selects one of the ten templates (AD-142).
2. The astrologer fills the template fields and selects the audience (AD-142).
3. The astrologer previews and publishes, schedules, or saves a draft (AD-144).
Use is optional; no template is forced annually or on a recurring basis (AD-142).

### 5.4 Create custom content
The astrologer creates original content without a template, with Custom
Title, Text/Description, Image Upload, Audience Selection, Publish Now,
Schedule, and Save Draft (AD-143).

### 5.5 Check delivery
Delivery history shows each scheduled item as Delivered, Missed, or Pending
where applicable; missed scheduled content is recorded as Missed (AD-140).

## 6. Screens and content

### 6.1 Editor and preview (AD-144)

| Left (editor) | Right (preview) |
|---------------|-----------------|
| Full content editor; content fields; formatting; template fields; image upload; audience selection; scheduling controls | Live User App preview, updated immediately while editing |

On mobile, Editor and Preview are tabs when split-screen is not practical.

### 6.2 12-Rasi prediction template (AD-141)

| Left column (fixed) | Right column (astrologer input) |
|---------------------|---------------------------------|
| 12 Rasis, provided automatically | One prediction field per Rasi |

The names of the 12 Rasis are supplied by the template (AD-141).

### 6.3 Special astrology templates (AD-142)
1. Guru Peyarchi · 2. Sani Peyarchi · 3. Rahu Peyarchi · 4. Ketu Peyarchi ·
5. Sevvai Peyarchi · 6. Surya Peyarchi · 7. Sukra Peyarchi · 8. Budha Peyarchi ·
9. Surya Grahanam · 10. Chandra Grahanam.

The fields inside each special template are not defined in the Master
Decision Document and are not invented.

### 6.4 Lists
- General Posts: Published, Scheduled, Drafts; engagement/performance history (AD-139).
- Subscriber Benefit Content: by type and tier; delivery history (AD-140).

## 7. Business rules and validations

| # | Rule | Source |
|---|------|--------|
| CNT-01 | Content creation, scheduling, and delivery exist only in this module. | AD-138 |
| CNT-02 | General Posts are Text or Image; Video is not allowed. | AD-139 |
| CNT-03 | Audience options: Public, Followers, Subscribers, individual tiers. | AD-139, AD-142, AD-143 |
| CNT-04 | Users can Like and Comment on General Posts. | AD-139 |
| CNT-05 | Each tier may have separate Subscriber Benefit Content. | AD-140 |
| CNT-06 | Daily and Weekly recurring schedules are supported. | AD-140 |
| CNT-07 | Missed scheduled content is recorded as Missed. | AD-140 |
| CNT-08 | Users with expired subscriptions cannot access subscriber-only content. | AD-140 |
| CNT-09 | Daily/Weekly/Monthly predictions use the 12-Rasi template; the astrologer only fills prediction fields. | AD-141 |
| CNT-10 | Special templates are optional, available to all astrologers, and never forced. | AD-142 |
| CNT-11 | Preview works before Publish Now, Schedule, and Save Draft and updates immediately. | AD-144 |

Image formats and sizes for content are not defined in the Master Decision
Document and are not invented.

## 8. States and edge cases

| Item | Statuses (source) |
|------|-------------------|
| General Post | Draft (Save Draft), Scheduled, Published (AD-139) |
| Benefit content delivery | Delivered, Missed, Pending where applicable (AD-140) |

| Case | Behaviour |
|------|-----------|
| Scheduled content not delivered at its time | Recorded as Missed (AD-140); category E notification (AD-148) |
| Subscriber's subscription expires | Subscriber-only content no longer accessible (AD-140) |
| Content for a single tier | Only that tier's subscribers receive it (AD-140) |
| Video selected | Not supported (AD-139) |
| Mobile screen | Editor/Preview tabs (AD-144) |

## 9. Notifications triggered

Category E (Post Published; Scheduled Post Reminder; Content Delivery
Success/Missed; New Likes/Comments; Subscriber Content Updates) → AD-148
([14](14_NOTIFICATIONS_AND_REMINDERS.md)).

## 10. Dependencies on other modules

- [01](01_HOME_SCREEN.md) — Benefits & Content Quick Action (AD-21).
- [02](02_TEXT_BASED_QUESTIONS.md) — tiers (AD-72).
- [11](11_AUDIENCE.md) — Followers and Subscribers.
- [13](13_ANALYTICS_AND_PERFORMANCE.md) — post-wise metrics.
- **User App:** X-22 (posts, Like/Comment, subscriber-only access on the user side); X-14 (subscription terms on hold).
- **Platform Admin:** none confirmed.

## 11. PENDING DISCUSSION

Full wording in [`00_ASTROLOGER_APP_REVIEW_LIST.md` §4](00_ASTROLOGER_APP_REVIEW_LIST.md#4-open-questions-register).

**Owned by this module:** none.

**Related**

| ID | Topic | Status |
|----|-------|--------|
| AP-GL-02 | Placement of Content Management within the tabs | Open — missing source information |

## 12. Acceptance criteria

- [ ] Content Management is one dedicated module for General Posts and Subscriber Benefit Content, opened by the "Benefits & Content" Quick Action (AD-138).
- [ ] General Posts support Text and Image only, the four audience options, Publish Now/Schedule/Save Draft/Edit/Delete, Published/Scheduled status, engagement history, and user Like/Comment (AD-139).
- [ ] Benefit content supports Daily/Weekly/Monthly/Special Predictions per tier, recurring Daily/Weekly schedules, and Delivered/Missed/Pending history; expired subscribers have no access (AD-140).
- [ ] The 12-Rasi template provides the 12 signs automatically with one input per sign (AD-141).
- [ ] All ten special templates are available to every astrologer, optional, with audience selection (AD-142).
- [ ] Custom content has all fields of AD-143.
- [ ] Split-screen editor with immediate live preview before every action; Editor/Preview tabs on mobile (AD-144).

## 13. Change log

| Date | Change |
|------|--------|
| 2026-11-20 | Initial draft created from the Master Decision Document and ruling C6: AD-138 – AD-144. |
