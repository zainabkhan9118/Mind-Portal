# MindPlayer Dashboard APIs — Round 3 Production Verification

**Environment:** https://d-api.mindplayer.com
**Verified:** 9 September 2026
**Application commit:** `4d5d980c00dcd24c14c219e2b61a9005622714df`
**Authentication:** Existing Knox bearer tokens
**Result:** Deployed and live verification passed

This document records the backend team's production verification of everything requested in `API_SPEC.md`. All values below came from disposable production records that were created and removed during testing — no tokens, emails, record IDs, signed storage parameters, or generated exports are retained here.

## Result summary

| Area | Live result |
|---|---|
| Authentication | Public schema 200; protected routes without a token 401 |
| State and Effect taxonomies | Paginated GET 200, POST 201, PUT 200, DELETE 204; 16 States and 9 Effects seeded |
| Content pathways | PATCH 200 on Minds, Music, Guided, Sounds, and Visuals |
| Home environments | POST 200; existing active set of one environment preserved using the new array-based request |
| Component event capture | Five events returned 201, including the new Visual route |
| Mind event capture | Two events returned 201 |
| Plays analytics | Goal/category/sub-category filters, Visuals, repeat, saved, timer, and Mind total verified |
| Mind analytics | All eight GET endpoints returned 200 with validated calculations |
| Mind export | POST 200; Celery task reached SUCCESS |
| Mind bookmark | Normal authenticated user received 200 and `is_saved: true` |

---

## Authentication enforcement

**Request**
```
GET /api/v1/admin/content/states/ HTTP/1.1
Host: d-api.mindplayer.com
Accept: application/json
```
**Live result:** `401 Unauthorized`

The same request with an authorized Knox administrator returned the standard pagination object and all 16 seeded States.

## State and Effect CRUD

**Requests**
```
GET    /api/v1/admin/content/states/?size=100
POST   /api/v1/admin/content/states/
PUT    /api/v1/admin/content/states/{id}/
DELETE /api/v1/admin/content/states/{id}/
Authorization: Bearer <knox-token>
```
The same sequence was executed for `admin/content/effects/`.

**Live responses**
```json
{
  "list_status": 200,
  "state_count": 16,
  "effect_count": 9,
  "create_status": 201,
  "rename_status": 200,
  "delete_status": 204
}
```

## Primary and secondary content pathways

**Request body**
```json
{
  "primary_goal": 101,
  "secondary_goals": [102],
  "primary_state": 2,
  "secondary_states": [9],
  "primary_effect": 1,
  "secondary_effects": [7]
}
```
Sent to the detail route for each of Minds, Music, Guided Sessions, Environment Sounds, and Environment Visuals.

**Live response fields — 200 OK**
```json
{
  "primary_goal": 101,
  "secondary_goals": [102],
  "primary_state": 2,
  "secondary_states": [9],
  "primary_effect": 1,
  "secondary_effects": [7]
}
```
The numeric IDs above are illustrative replacements for the deleted disposable record IDs. Equality between every request and response value was asserted during the live check.

## Multiple active home environments

**Request**
```
POST /api/v1/explore/home-screen-environments/active/
Authorization: Bearer <knox-token>
Content-Type: application/json

{ "environment_ids": [<existing-active-id>] }
```
**Live result — 200 OK.** The response was an array containing exactly the requested active ID. The single environment active before the check remained active afterward; no production selection was changed.

**Frontend note:** this confirms the endpoint accepts `environment_ids` as an array in one request and replaces the full active set with it — exactly as originally requested in `API_SPEC.md`, not just the single-id workaround discovered earlier. `HomeScreenEnvironments.tsx` has been updated back to sending one request with the full array instead of one request per id.

## Component plays analytics

Disposable events produced Music twice and Guided, Sound, and Visual once each. The new `goal` filter isolated those records.

**Request**
```
GET /api/v1/admin/analytics/plays/by-type/?goal=<goal-id>
Authorization: Bearer <knox-token>
```
**Live response — 200 OK**
```json
{
  "results": [
    { "content_type": "music", "plays": 2, "unique_listeners": 1 },
    { "content_type": "guided_session", "plays": 1, "unique_listeners": 1 },
    { "content_type": "env_sound", "plays": 1, "unique_listeners": 1 },
    { "content_type": "env_visual", "plays": 1, "unique_listeners": 1 }
  ]
}
```
Category and integer sub-category filtering were separately verified on Music. The legacy `content_type=mind_session` query input also remains compatible, while responses always use `guided_session`.

**Content performance response**
```json
{
  "content_type": "music",
  "plays": 2,
  "unique_listeners": 1,
  "repeat_rate": 100.0,
  "saved_count": 1,
  "timer_used_count": 1
}
```
The KPI response returned `total_minds_played: 2` for the disposable Goal.

## Mind analytics overview

**Request**
```
GET /api/v1/admin/analytics/minds/overview/?goal_id=<goal-id>
Authorization: Bearer <knox-token>
```
**Live response — 200 OK**
```json
{
  "total_minds": 1,
  "active_minds": 1,
  "overall_helpful_rate": 50.0,
  "avg_time_per_user": 300,
  "replays": 2.0,
  "top_pathway_goal": "<disposable-goal>",
  "top_pathway_state": "Anxious"
}
```
**Frontend note:** this response does not include the "vs prior period" comparison fields (`active_minds_change`, `overall_helpful_rate_prior`, `avg_time_per_user_prior`, `replays_prior`) that `MindsOverviewKPI` speculatively defined as optional. Those fields are optional in the type and the UI already handles their absence by simply omitting the comparison line — no code change required, but worth confirming with the backend team whether those comparisons are planned or should be dropped from the spec.

The same filtered data was validated through:
- `GET admin/analytics/minds/coverage/` — pathway count 1
- `GET admin/analytics/minds/helpful-rate-by-goal/` — helpful rate 50.0
- `GET admin/analytics/minds/top-state-pathways/` — top share 100.0
- `GET admin/analytics/minds/state-response-overview/` — Anxious and Scattered rows
- `GET admin/analytics/minds/{id}/` — two plays and 50.0 helpful rate
- `GET admin/analytics/minds/{id}/state-entry-points/` — two entry states with n=1 each

## Mind performance

**Live response row — 200 OK**
```json
{
  "components": ["env_sound", "env_visual", "guided_session", "music"],
  "helpful_rate": 50.0,
  "plays": 2,
  "unique_users": 1,
  "avg_time_per_user": 300,
  "avg_duration_per_play": 150,
  "repeat_rate": 100.0,
  "saved": 1,
  "timer_used": 100.0
}
```
Confirms `saved` is a count and `timer_used` is a percentage, matching `MindPerformanceRow`.

## Mobile event capture and bookmarking

The live check recorded five component events and two direct Mind events using a normal user's Knox token. Every create returned 201. The new Visual route was included:
```
POST /api/v1/explore/recently-played-environment-visual/
```
Mind bookmarking was also called as the normal user:
```
POST /api/v1/explore/mind/{id}/toggle_save/
```
```json
{ "saved_by": 1, "is_saved": true }
```

## Export

**Request**
```
POST /api/v1/admin/analytics/minds/export/?goal_id=<goal-id>
Authorization: Bearer <knox-token>
```
**Live result**
```json
{ "http_status": 200, "task_state": "SUCCESS" }
```
The generated CSV was removed after successful completion.

## Cleanup and service health

After verification, independent database queries found zero disposable users, audit logs, goals, taxonomies, categories, Minds, Music, Guided Sessions, Sounds, or Visuals. Daphne, Celery, Nginx, PostgreSQL, and Redis were active; the public schema returned 200; and no post-release traceback, service failure, HTTP 500, or kernel OOM event was detected.
