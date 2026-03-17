# Dashboard Frontend Integration Guide

> **Base URL**: `/api/v1/dashboard/`
> **Auth**: Knox Bearer token — `Authorization: Bearer <token>`
> **API Specs**: Refer to Swagger docs at `/docs/` for request/response schemas
> **Pagination**: Pass `?size=N` for paginated endpoints. Response: `{ count, pages_count, next, previous, results }`

---

## Table of Contents

1. [Authentication Flow](#1-authentication-flow)
2. [Global Layout & Navigation](#2-global-layout--navigation)
3. [Users Page](#3-users-page)
4. [Content Management Page](#4-content-management-page)
5. [Statistics & Analytics Page](#5-statistics--analytics-page)
6. [Monetization Page](#6-monetization-page)
7. [Community Page](#7-community-page)
8. [Settings Page](#8-settings-page)
9. [Shared Patterns](#9-shared-patterns)
10. [Permission Model](#10-permission-model)

---

## 1. Authentication Flow

All dashboard pages require authentication. Unauthenticated requests return `401`.

| Action | Method | Endpoint | Notes |
|--------|--------|----------|-------|
| Login | POST | `auth/login/` | Send `{ email, password }`. Returns `{ token, user }`. Store the token for all subsequent requests. |
| Logout | POST | `auth/logout/` | Revokes the current token. |
| Logout all sessions | POST | `auth/logout-all/` | Revokes all tokens for the user. |
| Forgot password | POST | `auth/forgot-password/` | Send `{ email }`. Triggers an OTP email. |
| Reset password | POST | `auth/reset-password/` | Send `{ email, otp, new_password }`. |

**Frontend flow:**
1. Show login form. On submit, call `auth/login/`.
2. Store `token` in a secure HTTP-only cookie or in-memory state.
3. On 401 responses, redirect to login.
4. Provide "Forgot Password" link that navigates to a two-step form: email entry, then OTP + new password.

---

## 2. Global Layout & Navigation

The sidebar/header should include the current admin's info and a health indicator.

| Action | Method | Endpoint | Notes |
|--------|--------|----------|-------|
| Current admin profile | GET | `me/` | Returns the logged-in admin's profile (name, email, role, permissions). Use this to hydrate the sidebar user info and to check permissions for conditional UI rendering. |
| System health | GET | `health/` | Returns `{ database, redis, celery }` status. Can power a status indicator in the header. |

**Conditional rendering:** Use the permissions array from `me/` to show/hide sidebar menu items and action buttons. See [Permission Model](#10-permission-model).

---

## 3. Users Page

The Users page has a **dashboard section** (KPI cards, charts, demographics) and a **user table** with detail/action capabilities.

### 3.1 Dashboard Section (KPI Cards + Charts)

| UI Element | Endpoint | Key Response Fields |
|------------|----------|-------------------|
| KPI cards (Total Users, Active Users, New Today/Week/Month, Churn Rate) | GET `users/dashboard/` | `total_users`, `active_users`, `new_today`, `new_this_week`, `new_this_month`, `churn_rate` |
| User growth line chart | GET `users/dashboard/growth/?granularity=daily` | `results[]` — array of `{ period, count }` points. Pass `?granularity=daily|weekly|monthly` to match the chart's time selector. |
| Engagement metrics (DAU/WAU/MAU) | GET `users/dashboard/engagement/` | `dau`, `wau`, `mau` |
| Demographics pie charts | GET `users/dashboard/demographics/` | `genders[]`, `countries[]`, `age_groups[]` — each is `{ label, count }` for pie/donut charts. |
| Subscription distribution | GET `users/dashboard/subscriptions/` | `results[]` — `{ plan, count }` per tier. |

**Date filtering:** All dashboard endpoints accept `?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD` to scope metrics to a date range. Wire the date picker to these query params.

### 3.2 User Table

| UI Element | Endpoint | Notes |
|------------|----------|-------|
| User list table | GET `users/` | Paginated. Supports `?search=`, `?status=`, `?is_premium=`, `?ordering=`. |
| User detail (side panel / detail page) | GET `users/{id}/` | Full user profile with subscription info. |
| Change user status | POST `users/{id}/status/` | Send `{ status: "active" | "suspended" | "banned" }`. |
| Delete user (soft) | DELETE `users/{id}/` | Soft-deletes. The confirmation modal should call this. |
| Restore user | POST `users/{id}/restore/` | Reverses soft-delete. |
| Send notification to user | POST `users/{id}/notify/` | Send `{ title, body }`. |
| User activity timeline | GET `users/{id}/activity/` | Paginated audit trail for the detail view. |
| User sessions | GET `users/{id}/sessions/` | Active login sessions. |
| Export users CSV | POST `users/export/` | Returns `{ task_id }`. Poll for completion (see [Async Exports](#93-async-exports-csv)). |

---

## 4. Content Management Page

Content is split into four type-specific tabs (Music, Guided Sessions, Environment Sounds, Environment Visuals) plus cross-type operations.

### 4.1 Content Type Tabs

Each tab uses a dedicated ViewSet. The table columns, filters, and detail fields differ per type.

| Tab | List Endpoint | Detail Endpoint | Create | Update | Delete |
|-----|--------------|-----------------|--------|--------|--------|
| Music | GET `content/music/` | GET `content/music/{id}/` | POST `content/music/` | PUT/PATCH `content/music/{id}/` | DELETE `content/music/{id}/` |
| Guided Sessions | GET `content/guided-sessions/` | GET `content/guided-sessions/{id}/` | POST `content/guided-sessions/` | PUT/PATCH `content/guided-sessions/{id}/` | DELETE `content/guided-sessions/{id}/` |
| Environment Sounds | GET `content/env-sounds/` | GET `content/env-sounds/{id}/` | POST `content/env-sounds/` | PUT/PATCH `content/env-sounds/{id}/` | DELETE `content/env-sounds/{id}/` |
| Environment Visuals | GET `content/env-visuals/` | GET `content/env-visuals/{id}/` | POST `content/env-visuals/` | PUT/PATCH `content/env-visuals/{id}/` | DELETE `content/env-visuals/{id}/` |

**Filtering:** All list endpoints support `?search=`, `?status=`, `?is_premium=`, `?ordering=`, `?category=`.

### 4.2 Sub-resources

| UI Element | Endpoint | Notes |
|------------|----------|-------|
| Sound layers (for Environment Sounds) | GET/POST `content/env-sounds/{id}/layers/` | List and add layers. |
| Delete a sound layer | DELETE `content/env-sounds/{id}/layers/{layer_id}/` | |
| Session steps (for Guided Sessions) | GET/POST `content/guided-sessions/{id}/steps/` | List and add steps. |
| Reorder session steps | POST `content/guided-sessions/{id}/steps/reorder/` | Send `{ order: [step_id, step_id, ...] }`. |
| Update/delete a session step | PUT/DELETE `content/guided-sessions/{id}/steps/{step_id}/` | |

### 4.3 Cross-Type Operations

| UI Element | Endpoint | Notes |
|------------|----------|-------|
| Unified content list (all types) | GET `content/` | Returns items across all types. Supports `?type=music|guided_session|env_sound|env_visual`, `?search=`, `?status=`, `?ordering=`. Paginated. |
| Change content status | POST `content/{type}/{id}/status/` | Send `{ status: "published" | "draft" | "archived" }`. `type` is one of: `music`, `mind_session`, `env_sound`, `env_visual`. |
| Duplicate content | POST `content/{type}/{id}/duplicate/` | Creates a draft copy. Returns the new item. |
| Bulk actions | POST `content/bulk-action/` | Send `{ action: "publish" | "archive" | "delete", items: [{ type, id }, ...] }`. For multi-select table operations. |

### 4.4 Categories

| UI Element | Endpoint | Notes |
|------------|----------|-------|
| Category list | GET `content/categories/` | Used for category filter dropdowns and the category management section. |
| Create category | POST `content/categories/` | Send `{ name }`. |
| Update / delete category | PUT/DELETE `content/categories/{id}/` | |

### 4.5 Content Creation Form

The "Add New Content" form should:
1. Let the user select a content type (renders type-specific fields).
2. POST to the corresponding type endpoint (`content/music/`, `content/guided-sessions/`, etc.).
3. For file uploads, use pre-signed S3 URLs from the core upload endpoint (not part of dashboard — see main app docs).
4. After creation, navigate to the detail view or back to the list.

---

## 5. Statistics & Analytics Page

The analytics page shows content performance data with charts, tables, and export capabilities.

### 5.1 Overview Section

| UI Element | Endpoint | Key Response Fields |
|------------|----------|-------------------|
| Total items per content type (pie/donut chart) | GET `analytics/overview/` | `total_items` object with counts per type. Also returns `total_plays`, `total_listeners`, `avg_completion_rate`. |
| Content type distribution charts | GET `analytics/overview/distributions/` | `results[]` — per-type breakdown with `{ type, total, published, draft, premium_count }`. |

### 5.2 Plays Analytics

| UI Element | Endpoint | Notes |
|------------|----------|-------|
| Play KPIs (total plays, unique listeners, avg per user) | GET `analytics/plays/` | Accepts `?start_date`, `?end_date`, `?content_type`. Returns `total_plays`, `unique_listeners`, `avg_plays_per_user`, `period_comparison`. |
| Plays timeseries chart | GET `analytics/plays/timeseries/` | Pass `?granularity=daily|weekly|monthly`. Returns `results[]` with `{ period, plays, listeners }`. |
| Plays by content type (bar chart) | GET `analytics/plays/by-type/` | Returns `results[]` with `{ type, plays, listeners }`. |
| Plays by region (map or table) | GET `analytics/plays/by-region/` | Returns `results[]` with `{ country, plays, listeners }`. |
| Top played content table | GET `analytics/plays/by-content/` | Paginated. Returns `results[]` with `{ content_id, title, type, plays, unique_listeners }`. |

### 5.3 Rankings

| UI Element | Endpoint | Notes |
|------------|----------|-------|
| Top content table | GET `analytics/rankings/content/` | Pass `?content_type=` and `?limit=`. Returns `results[]` sorted by play count. |
| Top creators table | GET `analytics/rankings/creators/` | Returns `results[]` with `{ creator_id, name, total_plays, total_listeners, content_count }`. |
| Top categories | GET `analytics/rankings/categories/` | Returns `results[]` with `{ category, plays, content_count }`. |
| Trending content | GET `analytics/rankings/trending/` | Last-7-day trending. Returns `results[]` with play velocity. |

### 5.4 Export

| UI Element | Endpoint | Notes |
|------------|----------|-------|
| Export analytics CSV | POST `analytics/plays/export/` | Accepts `?content_type`, `?start_date`, `?end_date`. Returns `{ task_id }`. See [Async Exports](#93-async-exports-csv). |

**Date filtering:** All analytics endpoints accept `?start_date` and `?end_date`. Wire the date range picker at the top of the analytics page to these params.

**Content type filter:** Most endpoints accept `?content_type=music|guided_session|env_sound` to filter by type. Use this for the content type selector dropdown.

---

## 6. Monetization Page

The monetization page shows revenue KPIs, charts, and management tables for subscriptions, plans, transactions, and payouts.

### 6.1 Revenue Dashboard

| UI Element | Endpoint | Key Response Fields |
|------------|----------|-------------------|
| KPI cards (Total Revenue, MRR, ARR, ARPU, Active Subscribers, Churn Rate) | GET `monetization/dashboard/` | `total_revenue`, `mrr`, `arr`, `arpu`, `active_subscribers`, `churn_rate`, `churned_count`, `period_comparison` |
| Revenue timeseries stacked bar chart (by plan tier) | GET `monetization/revenue/timeseries/` | Pass `?granularity=daily|weekly|monthly`. Returns `results[]` with `{ period, total, free, basic, premium, enterprise }`. |
| Revenue by plan (pie/donut chart) | GET `monetization/revenue/by-plan/` | Returns `results[]` with `{ plan_name, tier, revenue, transaction_count }`. |
| Revenue by region | GET `monetization/revenue/by-region/` | Returns `results[]` with `{ country, revenue, transaction_count }`. |

### 6.2 Management Tables

| UI Element | Endpoint | Notes |
|------------|----------|-------|
| Subscriptions table | GET `monetization/subscriptions/` | Paginated. Filter: `?status=`, `?plan=`, `?search=`. |
| Subscription detail | GET `monetization/subscriptions/{id}/` | Shows full subscription info with user and plan details. |
| Extend subscription | PATCH `monetization/subscriptions/{id}/` | Send `{ action: "extend", expires_at: "YYYY-MM-DDTHH:MM:SSZ" }`. |
| Cancel subscription | PATCH `monetization/subscriptions/{id}/` | Send `{ action: "cancel" }`. |
| Subscription plans table | GET `monetization/plans/` | List all plans with subscriber counts. |
| Create plan | POST `monetization/plans/` | |
| Update plan | PUT/PATCH `monetization/plans/{id}/` | |
| Deactivate plan | DELETE `monetization/plans/{id}/` | Soft-deactivates (sets `is_active=false`), does not hard-delete. |
| Transactions table | GET `monetization/transactions/` | Read-only, paginated. Filter: `?status=`, `?search=`, `?start_date`, `?end_date`. |
| Transaction detail | GET `monetization/transactions/{id}/` | |
| Payouts table | GET `monetization/payouts/` | Paginated. Filter: `?start_date`, `?end_date`. |

---

## 7. Community Page

The community page shows engagement KPIs, growth charts, and management tables for members, posts, reports, and groups.

### 7.1 Dashboard Section

| UI Element | Endpoint | Key Response Fields |
|------------|----------|-------------------|
| KPI cards (Total Members, Active Members, Posts, Comments, Engagement Rate, Groups, Open Reports) | GET `community/dashboard/` | `total_members`, `active_members`, `total_posts`, `total_comments`, `engagement_rate`, `total_groups`, `open_reports` |
| Member growth line chart | GET `community/dashboard/growth/` | Pass `?granularity=daily|weekly|monthly`. Returns `results[]` with `{ period, count }`. |
| Engagement bar chart (posts + comments per period) | GET `community/dashboard/engagement/` | Pass `?granularity`. Returns `results[]` with `{ period, posts, comments }`. |

### 7.2 Management Tables

| UI Element | Endpoint | Notes |
|------------|----------|-------|
| Members table | GET `community/members/` | Paginated. Filter: `?search=`, `?role=`, `?status=`. |
| Change member role/status | PATCH `community/members/{id}/` | Send `{ action: "change_role", role: "..." }` or `{ action: "suspend" | "activate" }`. |
| Posts table | GET `community/posts/` | Paginated. Filter: `?search=`, `?status=`. |
| Post detail | GET `community/posts/{id}/` | |
| Change post status | PATCH `community/posts/{id}/` | Send `{ action: "hide" | "unhide" | "pin" | "unpin" }`. |
| Delete post | DELETE `community/posts/{id}/` | Soft-delete. |
| Reports table | GET `community/reports/` | Paginated. Filter: `?status=open|resolved|dismissed`. |
| Resolve report | PATCH `community/reports/{id}/` | Send `{ action: "resolve", resolution_action: "warn" | "hide_content" | "suspend_user", resolution_note: "..." }`. |
| Dismiss report | PATCH `community/reports/{id}/` | Send `{ action: "dismiss", resolution_note: "..." }`. |
| Groups table | GET `community/groups/` | Paginated. |
| Group detail | GET `community/groups/{id}/` | |
| Create group | POST `community/groups/` | |
| Update group | PUT/PATCH `community/groups/{id}/` | |
| Archive group | DELETE `community/groups/{id}/` | Hides the group (sets `is_hidden=true`), does not hard-delete. |

---

## 8. Settings Page

Settings is organized into sub-sections: General, Appearance, Media, Notifications, Admin Accounts, Roles, and Audit Log.

### 8.1 Platform Settings (Key-Value)

Each settings category uses the same GET/PUT pattern. The backend stores settings as key-value pairs.

| Settings Tab | GET | PUT | Notes |
|-------------|-----|-----|-------|
| General | `settings/general/` | `settings/general/` | PUT sends `{ key1: value1, key2: value2, ... }`. |
| Appearance | `settings/appearance/` | `settings/appearance/` | Same pattern. |
| Media | `settings/media/` | `settings/media/` | Same pattern. |
| Notifications | `settings/notifications/` | `settings/notifications/` | Same pattern. |

**Frontend approach:** On page load, GET the current values and populate form fields. On save, PUT the changed key-value pairs.

### 8.2 Storage Usage

| UI Element | Endpoint | Notes |
|------------|----------|-------|
| Storage usage stats (shown under Media settings) | GET `settings/media/usage/` | Returns `{ music: { count, total_size_bytes }, guided_sessions: {...}, env_sounds: {...}, env_visuals: {...} }`. Display as progress bars or a summary table. |

### 8.3 Notification Templates

| UI Element | Endpoint | Notes |
|------------|----------|-------|
| Template list | GET `settings/notifications/templates/` | Paginated. |
| Create template | POST `settings/notifications/templates/` | Send `{ name, channel, subject, body_template, variables }`. |
| Update template | PUT `settings/notifications/templates/{id}/` | |
| Test template | POST `settings/notifications/test/` | Send `{ template_id, recipient }`. Returns rendered preview. |

### 8.4 Admin Account Management

| UI Element | Endpoint | Notes |
|------------|----------|-------|
| Admin accounts list | GET `settings/admins/` | Paginated list of staff users. |
| Create admin account | POST `settings/admins/` | Send `{ email, password, first_name, last_name, group_id }`. |
| Update admin | PUT `settings/admins/{id}/` | Send `{ first_name, last_name, is_active, group_id }` (partial). |
| Deactivate admin | DELETE `settings/admins/{id}/` | Cannot deactivate yourself. |

### 8.5 Role Management

| UI Element | Endpoint | Notes |
|------------|----------|-------|
| Roles list | GET `settings/roles/` | Returns `{ results: [...] }` with each role's permissions and `members_count`. |
| Create role | POST `settings/roles/` | Send `{ name, permissions: [permission_id, ...] }`. |
| Update role | PUT `settings/roles/{id}/` | |

### 8.6 Audit Log

| UI Element | Endpoint | Notes |
|------------|----------|-------|
| Audit log table | GET `settings/audit-log/` | Paginated. Filter: `?action=`, `?admin=`, `?start_date`, `?end_date`. Shows admin actions across the system. |

---

## 9. Shared Patterns

### 9.1 Date Range Filtering

Most dashboard/analytics endpoints accept:
```
?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
```
Build a reusable date range picker component and pass these as query params to all relevant API calls.

### 9.2 Pagination

Paginated endpoints use `?size=N&page=M`. Response shape:
```json
{
  "count": 150,
  "pages_count": 8,
  "next": "http://.../endpoint/?page=2&size=20",
  "previous": null,
  "results": [...]
}
```
Build a reusable pagination component. Default page size is set server-side; override with `?size=`.

### 9.3 Async Exports (CSV)

Export endpoints return a Celery task ID. Use a polling flow:

1. **Trigger export:** POST to the export endpoint. Response: `{ "task_id": "abc-123" }`.
2. **Poll status:** GET `tasks/{task_id}/` every 2-3 seconds. Response: `{ "status": "PENDING" | "STARTED" | "SUCCESS" | "FAILURE", "result": ... }`.
3. **Download:** Once status is `SUCCESS`, call GET `tasks/{task_id}/download/` to get the file URL, then trigger browser download.

Show a loading/progress indicator while polling. Handle `FAILURE` status with an error message.

### 9.4 Search & Filtering

Most list endpoints support `?search=` for full-text search and type-specific filters. Build a reusable filter bar component that serializes filter state to query params.

### 9.5 Ordering

List endpoints support `?ordering=field_name` (ascending) or `?ordering=-field_name` (descending). Wire table column headers to toggle ordering.

### 9.6 Error Handling

All dashboard endpoints return errors in this format:
```json
{
  "detail": "Error message here."
}
```
Or for validation errors:
```json
{
  "field_name": ["Error message."]
}
```
Display field-level errors inline on forms and general errors as toast notifications.

---

## 10. Permission Model

The dashboard uses RBAC with 17 custom permissions organized by module:

| Module | Read Permission | Write/Manage Permission |
|--------|----------------|------------------------|
| Users | `dashboard.users_read` | `dashboard.users_manage` |
| Content | `dashboard.content_read` | `dashboard.content_manage` |
| Analytics | `dashboard.analytics_read` | `dashboard.analytics_export` |
| Monetization | `dashboard.monetization_read` | `dashboard.monetization_manage` |
| Community | `dashboard.community_read` | `dashboard.community_moderate` |
| Settings | `dashboard.settings_read` | `dashboard.settings_write`, `dashboard.settings_admin` |

**Frontend implementation:**
1. After login, call `me/` to get the current admin's permissions.
2. Store permissions in app state (e.g., React context, Pinia store).
3. Conditionally render sidebar items, action buttons, and entire pages based on permissions.
4. If a user navigates to a page they don't have access to, show a "403 — Access Denied" page.
5. The backend enforces permissions independently — frontend checks are for UX only.

---

## Quick Reference: All Endpoints

| Module | Endpoint | Methods |
|--------|----------|---------|
| **Auth** | `auth/login/` | POST |
| | `auth/logout/` | POST |
| | `auth/logout-all/` | POST |
| | `auth/forgot-password/` | POST |
| | `auth/reset-password/` | POST |
| **Cross-cutting** | `me/` | GET |
| | `health/` | GET |
| | `tasks/{task_id}/` | GET |
| | `tasks/{task_id}/download/` | GET |
| **Users** | `users/dashboard/` | GET |
| | `users/dashboard/growth/` | GET |
| | `users/dashboard/engagement/` | GET |
| | `users/dashboard/demographics/` | GET |
| | `users/dashboard/subscriptions/` | GET |
| | `users/` | GET |
| | `users/{id}/` | GET, PUT, PATCH, DELETE |
| | `users/{id}/status/` | POST |
| | `users/{id}/restore/` | POST |
| | `users/{id}/notify/` | POST |
| | `users/{id}/activity/` | GET |
| | `users/{id}/sessions/` | GET |
| | `users/export/` | POST |
| **Content** | `content/` | GET |
| | `content/{type}/{id}/status/` | POST |
| | `content/{type}/{id}/duplicate/` | POST |
| | `content/bulk-action/` | POST |
| | `content/music/` | GET, POST |
| | `content/music/{id}/` | GET, PUT, PATCH, DELETE |
| | `content/guided-sessions/` | GET, POST |
| | `content/guided-sessions/{id}/` | GET, PUT, PATCH, DELETE |
| | `content/guided-sessions/{id}/steps/` | GET, POST |
| | `content/guided-sessions/{id}/steps/reorder/` | POST |
| | `content/guided-sessions/{id}/steps/{step_id}/` | PUT, DELETE |
| | `content/env-sounds/` | GET, POST |
| | `content/env-sounds/{id}/` | GET, PUT, PATCH, DELETE |
| | `content/env-sounds/{id}/layers/` | GET, POST |
| | `content/env-sounds/{id}/layers/{layer_id}/` | DELETE |
| | `content/env-visuals/` | GET, POST |
| | `content/env-visuals/{id}/` | GET, PUT, PATCH, DELETE |
| | `content/categories/` | GET, POST |
| | `content/categories/{id}/` | GET, PUT, PATCH, DELETE |
| **Analytics** | `analytics/overview/` | GET |
| | `analytics/overview/distributions/` | GET |
| | `analytics/plays/` | GET |
| | `analytics/plays/timeseries/` | GET |
| | `analytics/plays/by-content/` | GET |
| | `analytics/plays/by-type/` | GET |
| | `analytics/plays/by-region/` | GET |
| | `analytics/plays/export/` | POST |
| | `analytics/rankings/content/` | GET |
| | `analytics/rankings/creators/` | GET |
| | `analytics/rankings/categories/` | GET |
| | `analytics/rankings/trending/` | GET |
| **Monetization** | `monetization/dashboard/` | GET |
| | `monetization/revenue/timeseries/` | GET |
| | `monetization/revenue/by-plan/` | GET |
| | `monetization/revenue/by-region/` | GET |
| | `monetization/payouts/` | GET |
| | `monetization/subscriptions/` | GET |
| | `monetization/subscriptions/{id}/` | GET, PATCH |
| | `monetization/plans/` | GET, POST |
| | `monetization/plans/{id}/` | GET, PUT, PATCH, DELETE |
| | `monetization/transactions/` | GET |
| | `monetization/transactions/{id}/` | GET |
| **Community** | `community/dashboard/` | GET |
| | `community/dashboard/growth/` | GET |
| | `community/dashboard/engagement/` | GET |
| | `community/members/` | GET |
| | `community/members/{id}/` | GET, PATCH |
| | `community/posts/` | GET |
| | `community/posts/{id}/` | GET, PATCH, DELETE |
| | `community/reports/` | GET |
| | `community/reports/{id}/` | GET, PATCH |
| | `community/groups/` | GET, POST |
| | `community/groups/{id}/` | GET, PUT, PATCH, DELETE |
| **Settings** | `settings/general/` | GET, PUT |
| | `settings/appearance/` | GET, PUT |
| | `settings/media/` | GET, PUT |
| | `settings/media/usage/` | GET |
| | `settings/notifications/` | GET, PUT |
| | `settings/notifications/templates/` | GET, POST |
| | `settings/notifications/templates/{id}/` | PUT |
| | `settings/notifications/test/` | POST |
| | `settings/admins/` | GET, POST |
| | `settings/admins/{id}/` | PUT, DELETE |
| | `settings/roles/` | GET, POST |
| | `settings/roles/{id}/` | PUT |
| | `settings/audit-log/` | GET |
