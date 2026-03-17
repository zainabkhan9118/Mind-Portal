/* ═══════════════════════════════════════════════════════════════════════════
 * Dashboard API – Shared Types
 * Matches the backend Swagger schema at /docs/
 * ═══════════════════════════════════════════════════════════════════════════ */

// ── Pagination ──────────────────────────────────────────────────────────
export interface PaginatedResponse<T> {
    count: number;
    pages_count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

export interface PaginationParams {
    page?: number;
    size?: number;
}

// ── Date Filtering ──────────────────────────────────────────────────────
export interface DateRangeParams {
    start_date?: string; // YYYY-MM-DD
    end_date?: string;   // YYYY-MM-DD
}

// ── Ordering ────────────────────────────────────────────────────────────
export interface OrderingParams {
    ordering?: string; // field_name or -field_name
}

// ── Search ──────────────────────────────────────────────────────────────
export interface SearchParams {
    search?: string;
}

// ── Error Shapes ────────────────────────────────────────────────────────
export interface ApiErrorDetail {
    detail: string;
}

export interface ApiValidationError {
    [field: string]: string[];
}

// ═══════════════════════════════════════════════════════════════════════════
// 1. AUTHENTICATION
// ═══════════════════════════════════════════════════════════════════════════

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: AdminProfile;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    email: string;
    otp: string;
    new_password: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. ADMIN PROFILE & HEALTH
// ═══════════════════════════════════════════════════════════════════════════

export interface AdminProfile {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    permissions: string[];
}

export interface HealthStatus {
    database: string;
    redis: string;
    celery: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. USERS
// ═══════════════════════════════════════════════════════════════════════════

export interface UserDashboard {
    total_users: number;
    active_users: number;
    new_today: number;
    new_this_week: number;
    new_this_month: number;
    churn_rate: number;
}

export interface GrowthPoint {
    period: string;
    count: number;
}

export type GrowthGranularity = "daily" | "weekly" | "monthly";

export interface EngagementMetrics {
    dau: number;
    wau: number;
    mau: number;
}

export interface DemographicItem {
    label: string;
    count: number;
}

export interface UserDemographics {
    genders: DemographicItem[];
    countries: DemographicItem[];
    age_groups: DemographicItem[];
}

export interface SubscriptionDistribution {
    plan: string;
    count: number;
}

export type UserStatus = "active" | "suspended" | "banned";

export interface ApiUser {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    avatar?: string;
    status: UserStatus;
    is_premium: boolean;
    subscription?: {
        plan: string;
        expires_at: string;
    };
    created_at: string;
    updated_at: string;
}

export interface UserDetail extends ApiUser {
    phone?: string;
    country?: string;
    date_of_birth?: string;
    gender?: string;
    last_login?: string;
}

export interface UserActivity {
    id: number;
    action: string;
    timestamp: string;
    details?: string;
}

export interface UserSession {
    id: number;
    ip_address: string;
    user_agent: string;
    last_active: string;
    created_at: string;
}

export interface UserStatusChangeRequest {
    status: UserStatus;
}

export interface UserNotifyRequest {
    title: string;
    body: string;
}

export interface UserListParams extends PaginationParams, SearchParams, OrderingParams {
    status?: UserStatus;
    is_premium?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. CONTENT
// ═══════════════════════════════════════════════════════════════════════════

export type ContentType = "music" | "guided_session" | "env_sound" | "env_visual";
export type ContentTypeEndpoint = "music" | "guided-sessions" | "env-sounds" | "env-visuals";
export type ContentStatus = "published" | "draft" | "archived";

export interface ContentListParams extends PaginationParams, SearchParams, OrderingParams {
    type?: ContentType;
    status?: ContentStatus;
    is_premium?: boolean;
    category?: string;
}

export interface ContentItemBase {
    id: number;
    title: string;
    description?: string;
    status: ContentStatus;
    is_premium: boolean;
    category?: string;
    tags?: string[];
    created_at: string;
    updated_at: string;
}

export interface MusicContent extends ContentItemBase {
    type: "music";
    artist?: string;
    audio_url?: string;
    cover_image_url?: string;
    duration?: string;
}

export interface GuidedSessionContent extends ContentItemBase {
    type: "guided_session";
    voice?: string;
    duration?: string;
    goal?: string;
}

export interface EnvSoundContent extends ContentItemBase {
    type: "env_sound";
    frequency?: string;
    icon_url?: string;
    goal?: string;
}

export interface EnvVisualContent extends ContentItemBase {
    type: "env_visual";
    author?: string;
    media_url?: string;
    icon_url?: string;
    goal?: string;
}

export type AnyContentItem =
    | MusicContent
    | GuidedSessionContent
    | EnvSoundContent
    | EnvVisualContent;

// Sub-resources
export interface SoundLayer {
    id: number;
    name: string;
    audio_url?: string;
    volume?: number;
}

export interface SessionStep {
    id: number;
    title: string;
    description?: string;
    duration?: string;
    audio_url?: string;
    order: number;
}

export interface ReorderStepsRequest {
    order: number[];
}

// Cross-type operations
export interface ContentStatusChangeRequest {
    status: ContentStatus;
}

export interface BulkActionRequest {
    action: "publish" | "archive" | "delete";
    items: { type: ContentType; id: number }[];
}

// Categories
export interface ContentCategory {
    id: number;
    name: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// 5. ANALYTICS
// ═══════════════════════════════════════════════════════════════════════════

export interface AnalyticsOverview {
    total_items: Record<string, number>;
    total_plays: number;
    total_listeners: number;
    avg_completion_rate: number;
}

export interface ContentDistribution {
    type: string;
    total: number;
    published: number;
    draft: number;
    premium_count: number;
}

export interface PlaysKPI {
    total_plays: number;
    unique_listeners: number;
    avg_plays_per_user: number;
    period_comparison: Record<string, number>;
}

export interface PlaysTimeseriesPoint {
    period: string;
    plays: number;
    listeners: number;
}

export interface PlaysByType {
    type: string;
    plays: number;
    listeners: number;
}

export interface PlaysByRegion {
    country: string;
    plays: number;
    listeners: number;
}

export interface PlaysByContent {
    content_id: number;
    title: string;
    type: string;
    plays: number;
    unique_listeners: number;
}

export interface RankedContent {
    content_id: number;
    title: string;
    type: string;
    plays: number;
    unique_listeners: number;
}

export interface RankedCreator {
    creator_id: number;
    name: string;
    total_plays: number;
    total_listeners: number;
    content_count: number;
}

export interface RankedCategory {
    category: string;
    plays: number;
    content_count: number;
}

export interface TrendingContent {
    content_id: number;
    title: string;
    type: string;
    plays: number;
    velocity: number;
}

export interface AnalyticsParams extends DateRangeParams {
    content_type?: ContentType;
    granularity?: GrowthGranularity;
}

// ═══════════════════════════════════════════════════════════════════════════
// 6. MONETIZATION
// ═══════════════════════════════════════════════════════════════════════════

export interface MonetizationDashboard {
    total_revenue: number;
    mrr: number;
    arr: number;
    arpu: number;
    active_subscribers: number;
    churn_rate: number;
    churned_count: number;
    period_comparison: Record<string, number>;
}

export interface RevenueTimeseriesPoint {
    period: string;
    total: number;
    free: number;
    basic: number;
    premium: number;
    enterprise: number;
}

export interface RevenueByPlan {
    plan_name: string;
    tier: string;
    revenue: number;
    transaction_count: number;
}

export interface RevenueByRegion {
    country: string;
    revenue: number;
    transaction_count: number;
}

export type SubscriptionStatus = "active" | "cancelled" | "expired";

export interface Subscription {
    id: number;
    user: {
        id: number;
        email: string;
        name: string;
    };
    plan: {
        id: number;
        name: string;
        tier: string;
    };
    status: SubscriptionStatus;
    started_at: string;
    expires_at: string;
}

export interface SubscriptionPlan {
    id: number;
    name: string;
    tier: string;
    price: number;
    billing_period: string;
    is_active: boolean;
    subscriber_count?: number;
    features?: string[];
}

export interface Transaction {
    id: number;
    user: {
        id: number;
        email: string;
        name: string;
    };
    amount: number;
    currency: string;
    status: string;
    payment_method?: string;
    created_at: string;
}

export interface Payout {
    id: number;
    amount: number;
    currency: string;
    status: string;
    recipient?: string;
    created_at: string;
}

export interface SubscriptionListParams extends PaginationParams, SearchParams {
    status?: SubscriptionStatus;
    plan?: string;
}

export interface TransactionListParams extends PaginationParams, SearchParams, DateRangeParams {
    status?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// 7. COMMUNITY
// ═══════════════════════════════════════════════════════════════════════════

export interface CommunityDashboard {
    total_members: number;
    active_members: number;
    total_posts: number;
    total_comments: number;
    engagement_rate: number;
    total_groups: number;
    open_reports: number;
}

export interface CommunityGrowthPoint {
    period: string;
    count: number;
}

export interface CommunityEngagementPoint {
    period: string;
    posts: number;
    comments: number;
}

export interface CommunityMember {
    id: number;
    user: {
        id: number;
        email: string;
        name: string;
        avatar?: string;
    };
    role: string;
    status: string;
    joined_at: string;
}

export interface CommunityPost {
    id: number;
    author: {
        id: number;
        name: string;
        avatar?: string;
    };
    title: string;
    content: string;
    status: string;
    is_pinned: boolean;
    likes_count: number;
    comments_count: number;
    created_at: string;
}

export type ReportStatus = "open" | "resolved" | "dismissed";
export type ResolutionAction = "warn" | "hide_content" | "suspend_user";

export interface CommunityReport {
    id: number;
    reporter: {
        id: number;
        name: string;
    };
    reported_user?: {
        id: number;
        name: string;
    };
    reported_content?: {
        id: number;
        title: string;
        type: string;
    };
    reason: string;
    status: ReportStatus;
    resolution_action?: ResolutionAction;
    resolution_note?: string;
    created_at: string;
    resolved_at?: string;
}

export interface CommunityGroup {
    id: number;
    name: string;
    description?: string;
    members_count: number;
    is_hidden: boolean;
    created_at: string;
}

export interface MemberActionRequest {
    action: "change_role" | "suspend" | "activate";
    role?: string;
}

export interface PostActionRequest {
    action: "hide" | "unhide" | "pin" | "unpin";
}

export interface ResolveReportRequest {
    action: "resolve";
    resolution_action: ResolutionAction;
    resolution_note: string;
}

export interface DismissReportRequest {
    action: "dismiss";
    resolution_note: string;
}

export interface MemberListParams extends PaginationParams, SearchParams {
    role?: string;
    status?: string;
}

export interface PostListParams extends PaginationParams, SearchParams {
    status?: string;
}

export interface ReportListParams extends PaginationParams {
    status?: ReportStatus;
}

// ═══════════════════════════════════════════════════════════════════════════
// 8. SETTINGS
// ═══════════════════════════════════════════════════════════════════════════

export type SettingsCategory = "general" | "appearance" | "media" | "notifications";

export type SettingsKeyValue = Record<string, unknown>;

export interface StorageUsage {
    music: { count: number; total_size_bytes: number };
    guided_sessions: { count: number; total_size_bytes: number };
    env_sounds: { count: number; total_size_bytes: number };
    env_visuals: { count: number; total_size_bytes: number };
}

export interface NotificationTemplate {
    id: number;
    name: string;
    channel: string;
    subject: string;
    body_template: string;
    variables: string[];
}

export interface CreateNotificationTemplateRequest {
    name: string;
    channel: string;
    subject: string;
    body_template: string;
    variables: string[];
}

export interface TestTemplateRequest {
    template_id: number;
    recipient: string;
}

export interface AdminAccount {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    is_active: boolean;
    group_id?: number;
    group_name?: string;
}

export interface CreateAdminRequest {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    group_id: number;
}

export interface UpdateAdminRequest {
    first_name?: string;
    last_name?: string;
    is_active?: boolean;
    group_id?: number;
}

export interface Role {
    id: number;
    name: string;
    permissions: number[];
    members_count: number;
}

export interface CreateRoleRequest {
    name: string;
    permissions: number[];
}

export interface AuditLogEntry {
    id: number;
    admin: {
        id: number;
        name: string;
        email: string;
    };
    action: string;
    details?: string;
    ip_address?: string;
    timestamp: string;
}

export interface AuditLogParams extends PaginationParams, DateRangeParams {
    action?: string;
    admin?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// 9. ASYNC TASKS (CSV Exports)
// ═══════════════════════════════════════════════════════════════════════════

export type TaskStatus = "PENDING" | "STARTED" | "SUCCESS" | "FAILURE";

export interface TaskResult {
    status: TaskStatus;
    result: unknown;
}

export interface ExportTaskResponse {
    task_id: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// 10. PERMISSIONS (RBAC)
// ═══════════════════════════════════════════════════════════════════════════

export enum DashboardPermission {
    USERS_READ = "dashboard.users_read",
    USERS_MANAGE = "dashboard.users_manage",
    CONTENT_READ = "dashboard.content_read",
    CONTENT_MANAGE = "dashboard.content_manage",
    ANALYTICS_READ = "dashboard.analytics_read",
    ANALYTICS_EXPORT = "dashboard.analytics_export",
    MONETIZATION_READ = "dashboard.monetization_read",
    MONETIZATION_MANAGE = "dashboard.monetization_manage",
    COMMUNITY_READ = "dashboard.community_read",
    COMMUNITY_MODERATE = "dashboard.community_moderate",
    SETTINGS_READ = "dashboard.settings_read",
    SETTINGS_WRITE = "dashboard.settings_write",
    SETTINGS_ADMIN = "dashboard.settings_admin",
}
