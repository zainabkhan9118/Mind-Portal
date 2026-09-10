# MindPlayer Dashboard — Missing API Endpoints

> **✅ Verified in production — 9 September 2026.** The backend team confirmed every endpoint in this document is now live and working as specced (commit `4d5d980c00dcd24c14c219e2b61a9005622714df`). Full verification evidence — request/response pairs, status codes, seed data counts — is in [`API_VERIFICATION.md`](./API_VERIFICATION.md). Two things surfaced during verification worth a second look:
> - **Home Screen Environments** now confirmed to accept `environment_ids` as an array in one request (not just the single-id workaround) — the frontend has been updated to match.
> - **Minds overview** (`admin/analytics/minds/overview/`) does not return the "vs prior period" comparison fields (`active_minds_change`, `overall_helpful_rate_prior`, `avg_time_per_user_prior`, `replays_prior`) that were speculatively specced as optional — the UI already handles their absence gracefully, but confirm with backend whether those are planned.
>
> This doc is kept as a historical record of what was requested and why — it is no longer describing missing endpoints.

Backend developer: these are the endpoints the dashboard frontend is calling that do not exist yet or need changes.
All endpoints sit under the base URL `https://d-api.mindplayer.com/api/v1/`.

**Authentication** — every request must include:
```
Authorization: Bearer <knox-token>
```

**Pagination shape** (all list endpoints):
```json
{
  "count": 42,
  "pages_count": 5,
  "next": "...",
  "previous": null,
  "results": [...]
}
```

---

## Home Screen Environments ✅ Verified

The Settings dashboard lets an admin compose "Home Screen Environments" (a 360° visual + a mix of ambient sounds) and choose which ones are shown on the app's home screen. The dashboard now needs to activate **more than one** environment at once — see the open question under `POST explore/home-screen-environments/active/` below.

### `HomeScreenEnvironment` object

| Field | Type | Notes |
|---|---|---|
| `id` | integer | Read-only |
| `env_visuals` | array | List of visual objects: `{ id, name, visual_file, image }` |
| `env_sounds` | array | List of sound objects: `{ id, name, audio_clip, image }` |
| `is_active` | boolean | Whether this environment is currently shown on the app home screen |
| `created_at` | datetime | Read-only |

---

### POST `explore/home-screen-environments/active/` — ✅ confirmed working with multiple ids

**Request (JSON):**
```json
{ "environment_ids": [3, 5] }
```

**Response 200:** Activates every id in the list and deactivates any environment not listed (full replace of the active set); confirmed live 9 Sept 2026 — see `API_VERIFICATION.md`.

---

## Content Management — Primary/Secondary Goal, State, Effect ✅ Verified

The Content Management Add/Edit popups (Music, Sounds, Guided, Visuals, Minds — all five tabs) now let an admin pick a **primary** (single) and **secondary** (multiple) value for Goal, State, and Effect. States and Effects also need to become admin-manageable lists — today they're just free-text values (`state`, `effect`) with no backing table, and admins need to be able to create new ones.

### New: States and Effects endpoints (shared across all content types)

Two new taxonomies, structured exactly like the existing `admin/content/categories/` endpoint, but **not** scoped by `type` — one shared list of States and one shared list of Effects, reusable across Music, Sounds, Guided, Visuals, and Minds.

**`State` / `Effect` object:**
| Field | Type | Notes |
|---|---|---|
| `id` | integer | Read-only |
| `name` | string | |
| `item_count` | integer | Read-only. Number of content items currently referencing this value. |

**Endpoints (identical shape for both `states` and `effects`):**
- `GET admin/content/states/` — paginated list (standard pagination shape above)
- `POST admin/content/states/` — create. Request: `{ "name": "Anxious" }`. Response 201: created object.
- `PUT admin/content/states/{id}/` — rename. Request: `{ "name": "..." }`.
- `DELETE admin/content/states/{id}/` — delete. Response 204.
- Same four for `admin/content/effects/`.

**Seed data:** the dashboard previously used a hardcoded, non-editable dropdown for State and Effect. Please pre-populate the new tables with these existing values so admins don't start from an empty list (grouping shown here is just for reference — the new `State`/`Effect` object above is a flat `{id, name}`, no group field):

*States:*
| Group | Values |
|---|---|
| Downregulation | Overload, Anxious, Tense, Overthinking |
| Activation | Low Energy, Unmotivated, Sluggish |
| Focus | Distracted, Scattered, Lack Clarity |
| Emotional | Frustrated, Reactive, Overwhelmed |
| Creative | Blocked, Rigid, Uninspired |

*Effects:*
| Group | Values |
|---|---|
| Calm / Regulation | Calm, Downregulate, Ground, Regulate |
| Activation | Activate, Energize |
| Focus | Focus, Narrow |
| Expansion | Open |

### Changed fields on all 5 content endpoints

Applies to `admin/content/music/`, `admin/content/guided-sessions/`, `admin/content/env-sounds/`, `admin/content/env-visuals/`, `admin/content/minds/` — both create (`POST`, multipart/form-data) and update (`PATCH`/`PUT`).

**Deprecate** the existing `goals` (array), `state` (free string), and `effect` (free string) fields. **Replace** with:

| Field | Type | Required | Notes |
|---|---|---|---|
| `primary_goal` | integer | Yes | FK to `Goal` (existing `explore/goals/` list). Single value. |
| `secondary_goals` | integer[] | No | FK to `Goal`, multiple. Should not include the `primary_goal` id. |
| `primary_state` | integer | No | FK to the new `State` entity above. Single value. |
| `secondary_states` | integer[] | No | FK to `State`, multiple. |
| `primary_effect` | integer | No | FK to the new `Effect` entity above. Single value. |
| `secondary_effects` | integer[] | No | FK to `Effect`, multiple. |

Since creates/updates are sent as `multipart/form-data`, array fields are sent as repeated keys, e.g.:
```
primary_goal=4
secondary_goals=7
secondary_goals=9
primary_state=2
secondary_states=5
primary_effect=1
```

**Response objects** should return the same fields (resolved, not just ids is fine either way — the dashboard only needs the ids back to pre-fill the edit form) plus keep read compatibility if convenient, but `primary_goal`/`secondary_goals`/`primary_state`/`secondary_states`/`primary_effect`/`secondary_effects` are the fields the dashboard now reads and writes.

---

## Statistics & Analytics — Overview tab ✅ Verified

The Overview tab's "Key Metrics Overview" cards and "Most Played Content" chart now share one filter bar (Analysis + Time) pinned to the top of the page, instead of the filter living only inside "Most Played Content". The Time filter and a single Content-type selection already work end-to-end today (`admin/analytics/plays/kpi/`, `admin/analytics/plays/by-type/`, and `admin/analytics/plays/timeseries/` all already accept `start_date`/`end_date`/`content_type`). Two things still need backend work:

### New KPI field: `total_minds_played`

The "Avg Mind Time per User" card was replaced with "Total Minds Played". Please add to `GET admin/analytics/plays/kpi/`:

| Field | Type | Notes |
|---|---|---|
| `total_minds_played` | integer | Count of plays where content type is "Minds", within the requested date range. |
| `total_minds_played_change` | number | % vs previous period, same convention as `total_minds_created_change`. |

### Missing filter params: Category / Sub Category / Goals

The Analysis dropdown offers `Content-type + Goals`, `Category + Goals`, `Sub Category + Goals` on every Statistics tab, plus `Minds + Goals` on the Overview tab specifically. Each option chains into a final Goals picker. Today `admin/analytics/plays/kpi/`, `admin/analytics/plays/by-type/`, and `admin/analytics/plays/timeseries/` only accept `content_type`, `start_date`, `end_date`. Please add optional params to all three:

| Param | Type | Notes |
|---|---|---|
| `category` | integer | Filter to a single category id. |
| `sub_category` | integer | Filter to a single sub-category id. |
| `goal` | integer | Filter to a single goal id. |

✅ Confirmed live 9 Sept 2026 (`goal`, category, and integer sub-category filters all verified on `plays/by-type/`) — see `API_VERIFICATION.md`.

### Custom Range time filter

The Time dropdown's "Custom Range" option now shows real Start/End date pickers and sends them as `start_date`/`end_date` — no backend change needed, since those params already exist on all the endpoints above.

### `admin/analytics/plays/by-type/` is missing the "Visuals" (`env_visual`) entry — ✅ Fixed

The Content Plays tab's "Component Plays" chart (Breakdown by content type) renders whatever `GET admin/analytics/plays/by-type/` returns — it already shows Music, Guided, and Sound bars/cards correctly, but no "Visuals" one appears. A real response we captured:
```json
{
  "results": [
    { "content_type": "music", "plays": 77, "unique_listeners": 4 },
    { "content_type": "guided_session", "plays": 43, "unique_listeners": 3 },
    { "content_type": "env_sound", "plays": 6, "unique_listeners": 1 }
  ]
}
```
Since the frontend just maps over the response array (no hardcoded type list), this confirms the response is missing an `env_visual` entry for the requested date range. Please make sure `env_visual` plays are included in this endpoint's response alongside `music`, `guided_session`, and `env_sound`, the same way they already are (or should be) for the "Most Played Content" pie chart on the Overview tab, which reads from the same endpoint.

✅ Confirmed fixed 9 Sept 2026 — the live response now includes an `env_visual` row alongside the other three types.

### Naming heads-up: Analytics uses `guided_session`, not `mind_session`

The response above also confirms the Analytics endpoints (`admin/analytics/plays/kpi/`, `by-type/`, `by-content/`, `timeseries/`, `trending/`) identify Guided Sessions as `"guided_session"` — a different slug than Content Management's `"mind_session"` (used by `admin/content/guided-sessions/`, categories, etc.). The dashboard now sends/reads `guided_session` specifically for these Analytics calls (including the `content_type` query param when filtering by Guided in the Analysis dropdown) and keeps `mind_session` for Content Management calls. Please confirm the Analytics endpoints' `content_type` query param also expects `guided_session` (not `mind_session`) when filtering — if it's actually the other way around, or accepts both, let us know so we send the right value.

### New fields needed on `admin/analytics/plays/by-content/` (Content Performance table)

The "Content Performance" table (Content Plays tab, and the standalone Top Rankings tab — both render `TopRankingsTable`) dropped its "Rank" column and added four new columns. `Unique Users` already works — it reads the existing `unique_listeners` field. The other three need new fields on `GET admin/analytics/plays/by-content/`:

| Column | Field | Type | Notes |
|---|---|---|---|
| Unique Users | `unique_listeners` | integer | Already exists — no change needed. |
| Repeat Rate | `repeat_rate` | number | % (0–100) of unique listeners who played this content more than once in the requested date range. |
| Saved | `saved_count` | integer | Number of users who saved/bookmarked this content. |
| Timer Used | `timer_used_count` | integer | Number of users who had the sleep/session timer active while playing this content. |

✅ Confirmed live 9 Sept 2026 — `repeat_rate`, `saved_count`, and `timer_used_count` are all present on the production response.

### VR vs Mobile Usage card is fully mocked

`VrVsMobileChart` (the donut chart next to "Most Played Content") is 100% hardcoded on the frontend today — every percentage (Mobile/VR split, iOS/Android/Meta Quest/Other VR breakdown, avg session times) is a static placeholder, not backed by any API call. It is therefore **not** affected by the new top-of-page filter. If you want this card to show real, filterable data, we'll need a new endpoint (e.g. `admin/analytics/plays/by-platform/`) returning platform/device play-share and average session duration for a given date range + content type — let us know and we'll spec the exact shape.

### Average Listening & Experience Time card is also fully mocked

Same situation on the Content Plays tab: `AvgListeningTimeChart` (the "Average Listening & Experience Time" section — 4 per-type duration cards + a 7-day trend line for Sound/Music/Guided/Visuals) is 100% hardcoded placeholder data today, with no API call behind it at all. It's therefore **not** affected by the Analysis/Time filter either, for the same reason the VR vs Mobile card isn't — there's no real data to filter yet. If you want this wired up for real, we'd need an endpoint returning average listening duration per content type (e.g. `admin/analytics/plays/avg-duration-by-type/`), plus a daily time-series of that same metric per type for the trend line, both accepting a date range and optional content-type filter — let us know and we'll spec the exact shape.

---

## Statistics & Analytics — new "Mind Coverage" tab ✅ Verified

New tab on the Statistics & Analytics page. It shows, for every distinct `(primary_goal, primary_state)` pathway across all Minds content, how many Minds currently have that exact pathway — i.e. it's an aggregation over the `primary_goal` and `primary_state` fields on `admin/content/minds/` (see the "Content Management — Primary/Secondary Goal, State, Effect" section above).

### New: `GET admin/analytics/minds/coverage/`

**Query params:**
| Param | Type | Notes |
|---|---|---|
| `goal_ids` | integer[] | Optional. When provided, only include Minds whose `primary_goal` is one of these ids (OR'd together — a multi-select). Omit to include all goals. Sent as repeated query params, e.g. `?goal_ids=3&goal_ids=7`. |

**Response 200:**
```json
{
  "results": [
    { "primary_goal": "Focus", "primary_state": "distracted", "count": 6 },
    { "primary_goal": "Focus", "primary_state": "scattered", "count": 4 },
    { "primary_goal": "Focus", "primary_state": "lack_clarity", "count": 3 },
    { "primary_goal": "Focus", "primary_state": "overthinking", "count": 5 },
    { "primary_goal": "Productivity", "primary_state": "unmotivated", "count": 4 },
    { "primary_goal": "Productivity", "primary_state": "low_energy", "count": 6 }
  ]
}
```
- `primary_goal` — the Goal's display name (from `explore/goals/`).
- `primary_state` — the State's display name (from the new `admin/content/states/` entity).
- `count` — number of Minds with that exact `(primary_goal, primary_state)` pair, honoring `goal_ids` when given.

Rows with `count: 0` can be omitted — the dashboard only renders rows that exist in the response.

### Frontend status

✅ `MindCoverageTab.tsx` calls `GET admin/analytics/minds/coverage/` and this is confirmed live in production (9 Sept 2026, pathway count verified) — see `API_VERIFICATION.md`.

---

## Statistics & Analytics — new "Minds" tab ✅ Verified

A full analytics dashboard for Minds content: 6 KPI cards, three analysis panels, a "selected Mind" detail view, and a performance table. **✅ All 8 endpoints below are confirmed live in production (9 Sept 2026)** — see `API_VERIFICATION.md` for the verified request/response for each. One gap found during verification: `admin/analytics/minds/overview/` doesn't return the "vs prior period" fields (`active_minds_change`, `overall_helpful_rate_prior`, `avg_time_per_user_prior`, `replays_prior`); they're optional in the frontend types and the UI already omits the comparison line when absent, but confirm with backend whether those are planned.

### Shared filter params

Every endpoint in this section accepts the same optional query params:

| Param | Type | Notes |
|---|---|---|
| `start_date` / `end_date` | date (`YYYY-MM-DD`) | Date range from the "Date Range" picker. |
| `goal_id` | integer | Single Goal id, from the "Goal" dropdown (`explore/goals/`). |
| `state_id` | integer | Single State id, from the "State" dropdown (`admin/content/states/`). |
| `effect_id` | integer | Single Effect id, from the "Effect" dropdown (`admin/content/effects/`). |
| `components` | string[] | Optional, repeated params (e.g. `?components=music&components=env_sound`). Values are the Analytics content-type slugs: `music`, `env_sound`, `env_visual`, `guided_session` (see the `guided_session` naming note earlier in this doc). |

### New: `GET admin/analytics/minds/overview/` — the 6 KPI cards

**Response 200:**
```json
{
  "total_minds": 210,
  "active_minds": 48,
  "active_minds_change": 12,
  "overall_helpful_rate": 62,
  "overall_helpful_rate_prior": 53,
  "avg_time_per_user": 1104,
  "avg_time_per_user_prior": 941,
  "replays": 1.8,
  "replays_prior": 1.6,
  "top_pathway_goal": "Focus",
  "top_pathway_state": "overthinking"
}
```
- `active_minds_change` — % change; the card reads "↑ 12% Apr 1 – Apr 30" (the comparison period label itself is not sent — the frontend currently hardcodes "Apr 1 – Apr 30"; tell us if that label should come from the API instead, e.g. as a `prior_period_label` string).
- `avg_time_per_user` / `avg_time_per_user_prior` — seconds (e.g. `1104` → "18m 24s").
- `overall_helpful_rate` / `overall_helpful_rate_prior` — % (0–100).
- `replays` / `replays_prior` — average replays per user, e.g. `1.8` → "1.8x".
- `top_pathway_goal` + `top_pathway_state` — the single most common (Primary Goal, Primary State) pathway, rendered as "Focus → overthinking".

### New: `GET admin/analytics/minds/helpful-rate-by-goal/` — "Helpful Rate by Goal" bars

**Response 200:**
```json
{
  "results": [
    { "goal": "Relax & Unwind", "helpful_rate": 68 },
    { "goal": "Sleep & Dreams", "helpful_rate": 72 },
    { "goal": "Focus", "helpful_rate": 64 },
    { "goal": "Productivity", "helpful_rate": 61 },
    { "goal": "Motivation", "helpful_rate": 59 },
    { "goal": "Emotional Balance", "helpful_rate": 58 },
    { "goal": "Creativity & Inspiration", "helpful_rate": 55 }
  ]
}
```
One row per Goal that has at least one Mind with it as `primary_goal`, `helpful_rate` as % (0–100).

### New: `GET admin/analytics/minds/top-state-pathways/` — "Top State Pathways" list

**Additional query param:** `limit` (integer, default the frontend sends `7`) — top N pathways by share.

**Response 200:**
```json
{
  "results": [
    { "primary_goal": "Focus", "primary_state": "overthinking", "share": 18 },
    { "primary_goal": "Relax & Unwind", "primary_state": "anxious", "share": 15 },
    { "primary_goal": "Productivity", "primary_state": "unmotivated", "share": 13 },
    { "primary_goal": "Sleep & Dreams", "primary_state": "overthinking", "share": 11 },
    { "primary_goal": "Emotional Balance", "primary_state": "overwhelmed", "share": 9 },
    { "primary_goal": "Motivation", "primary_state": "low_energy", "share": 7 },
    { "primary_goal": "Creativity & Inspiration", "primary_state": "blocked", "share": 6 }
  ]
}
```
`share` — % (0–100) of total plays represented by this exact pathway. This is a "top N" summary; the card's "See All" link takes the admin to the full **Mind Coverage** tab (`admin/analytics/minds/coverage/`, documented above) for the complete, unranked breakdown — no separate endpoint needed for "See All" itself.

### New: `GET admin/analytics/minds/state-response-overview/` — the State heatmap

**Response 200:**
```json
{
  "results": [
    { "state": "overload", "helpful_rate": 73 },
    { "state": "anxious", "helpful_rate": 67 },
    { "state": "tense", "helpful_rate": 63 },
    { "state": "overthinking", "helpful_rate": 60 },
    { "state": "low_energy", "helpful_rate": 57 },
    { "state": "unmotivated", "helpful_rate": 53 },
    { "state": "sluggish", "helpful_rate": 50 },
    { "state": "distracted", "helpful_rate": 47 },
    { "state": "scattered", "helpful_rate": 44 },
    { "state": "lack_clarity", "helpful_rate": 41 },
    { "state": "frustrated", "helpful_rate": 38 },
    { "state": "reactive", "helpful_rate": 35 },
    { "state": "overwhelmed", "helpful_rate": 32 },
    { "state": "blocked", "helpful_rate": 29 },
    { "state": "rigid", "helpful_rate": 26 },
    { "state": "uninspired", "helpful_rate": 23 }
  ]
}
```
One row per State (across all Minds where that State is the primary or secondary state — please confirm which), `helpful_rate` as %. The frontend sorts descending and color-grades from purple (highest) to teal (lowest) itself — order in the response doesn't matter.

### New: `GET admin/analytics/minds/{id}/` — selected Mind detail card

Path param `{id}` is the Mind's content id. Accepts the shared filter params too (so "Total Plays"/"Helpful" reflect the active date range).

**Response 200:**
```json
{
  "id": 42,
  "name": "Quiet Focus",
  "image": "https://.../quiet-focus.jpg",
  "primary_goal": "Focus",
  "secondary_goals": ["Productivity"],
  "primary_state": "overthinking",
  "secondary_states": ["overload", "scattered"],
  "primary_effect": "downregulate",
  "secondary_effects": ["focus"],
  "total_plays": 653,
  "helpful_rate": 64
}
```
`image` may be `null` — the frontend shows a gradient placeholder in that case.

### New: `GET admin/analytics/minds/{id}/state-entry-points/` — "Helpful by State Entry Point"

For the selected Mind: how helpful it is broken down by which State the listener entered with.

**Response 200:**
```json
{
  "results": [
    { "state": "overthinking", "helpful_rate": 71, "n": 342 },
    { "state": "overload", "helpful_rate": 59, "n": 214 },
    { "state": "scattered", "helpful_rate": 44, "n": 97 }
  ]
}
```
`n` — sample size (number of plays/sessions entering with that state) shown as "n=342".

### New: `GET admin/analytics/minds/performance/` — "Mind Performance" table

Paginated list, one row per Mind. Also accepts `search` (matches Mind name) and standard pagination params (`page`, `size`).

**Response 200:**
```json
{
  "count": 210,
  "pages_count": 3,
  "next": "...",
  "previous": null,
  "results": [
    {
      "id": 42,
      "name": "Quiet Focus",
      "primary_goal": "Focus",
      "primary_state": "overthinking",
      "components": ["music", "env_sound"],
      "helpful_rate": 64,
      "best_state": "overthinking",
      "best_state_rate": 71,
      "weakest_state": "scattered",
      "weakest_state_rate": 44,
      "plays": 653,
      "unique_users": 412,
      "avg_time_per_user": 4704,
      "avg_duration_per_play": 1330,
      "repeat_rate": 46,
      "saved": 248,
      "timer_used": 72,
      "growth": 12.4
    }
  ]
}
```
- `components` — which content types make up this Mind (e.g. `["music", "env_sound"]` → shown as "music-sound"). Use the Analytics slugs (`music`, `env_sound`, `env_visual`, `guided_session`).
- `best_state` / `best_state_rate`, `weakest_state` / `weakest_state_rate` — the entry states with the highest/lowest helpful rate for this Mind.
- `avg_time_per_user` / `avg_duration_per_play` — seconds.
- `repeat_rate` — % (0–100).
- `saved` — **count** of users who saved this Mind (not a %).
- `timer_used` — **%** (0–100) of users who used the sleep/session timer (not a count) — note this differs in kind from `saved`, and also differs from the similarly-named `timer_used_count` (a count) on the Content Performance table (`admin/analytics/plays/by-content/`, documented earlier) — that's a different table for different content, please don't conflate the two.
- `growth` — % change, signed (e.g. `12.4` → "↑ +12.4%", `-1.3` → "↓ -1.3%").

### New: `POST admin/analytics/minds/export/` — Export button

Mirrors the existing `POST admin/analytics/plays/export/` pattern: accepts the shared filter params as query params, returns `{ "task_id": "..." }` for an async CSV export job.

---

## Error Format

All 4xx errors:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed.",
    "details": [
      { "field": "email", "message": "A user with this email already exists." }
    ]
  }
}
```

| Status | Meaning |
|---|---|
| 200 | Success — updated object returned |
| 201 | Created |
| 204 | Deleted — no body |
| 400 | Validation error — body contains `error.details` |
| 401 | Missing or invalid Bearer token |
| 403 | Authenticated but not admin |
| 404 | Resource not found |
| 500 | Server error |
