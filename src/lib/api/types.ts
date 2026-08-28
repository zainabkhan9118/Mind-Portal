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
    password: string;
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
    avatar?: string;
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
    premium_users: number;
    new_today: number;
    new_week: number;
    new_month: number;
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

export type UserStatus = "active" | "inactive" | "suspended" | "banned";

export interface ApiUser {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    avatar?: string;
    status: UserStatus;
    is_premium: boolean;
    is_mind_expert?: boolean;
    mind_expert_pending?: boolean;
    credential_files?: string[];
    subscription?: {
        plan: string;
        expires_at: string;
    };
    date_joined?: string;
    created_at?: string;
    updated_at?: string;
}

export interface UserSearchResult {
    id: number;
    display_name: string;
    email: string;
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
    message: string;
}

export interface UserListParams extends PaginationParams, SearchParams, OrderingParams {
    status?: UserStatus;
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. CONTENT
// ═══════════════════════════════════════════════════════════════════════════

export type ContentType = "music" | "mind_session" | "env_sound" | "env_visual" | "minds";
export type ContentTypeEndpoint = "music" | "guided-sessions" | "env-sounds" | "env-visuals";
export type ContentStatus = "published" | "draft" | "archived" | "review";

export interface ContentListParams extends PaginationParams, OrderingParams {
    q?: string;
    search?: string;
    status?: ContentStatus;
    is_premium?: boolean;
    category?: number;
    type?: ContentType;
    goal_ids?: string;
    tags?: string;
    created_after?: string;
    created_before?: string;
}

export interface MusicListParams extends ContentListParams {
    artist?: string;
    genre?: string;
    album?: number;
    created_by?: number;
}

export interface GuidedSessionListParams extends ContentListParams {
    instructor?: string;
    difficulty?: string;
    session_type?: string;
    created_by?: number;
}

export interface EnvSoundListParams extends ContentListParams {
    sound_type?: string;
    is_loopable?: boolean;
    is_mixable?: boolean;
}

export interface EnvVisualListParams extends ContentListParams {
    visual_type?: string;
    mood?: string;
}

// Categories
export interface AdminCategory {
    id: number;
    name: string;
    language?: string | null;
    item_count: number;
}

// Keep ContentCategory as alias for backward compat
export type ContentCategory = AdminCategory;

// Sub-categories
export interface SubCategory {
    id: number;
    name: string;
    category: number | null;
    category_name: string | null;
    item_count: number;
}

export interface SubCategoryListParams {
    type: ContentType;
    category?: number;
    size?: number;
}

// Sub-resources
export interface SoundLayer {
    id: number;
    environment_sound: number;
    file_url: string;
    volume?: string;
    label: string;
    sort_order?: number;
    created_at: string;
    updated_at: string;
}

export interface SessionStep {
    id: number;
    session: number;
    step_order: number;
    title: string;
    duration_seconds: number;
    audio_url?: string;
    text_content?: string;
    created_at: string;
    updated_at: string;
}

export interface AdminMusic {
    id: number;
    name: string;
    description: string;
    artist: string;
    image: string;
    audio_clip: string;
    duration: number;
    music_category?: number[];
    sub_category?: string | null;
    album?: number | null;
    goals: number[];
    status?: ContentStatus;
    tags?: string[];
    is_premium?: boolean;
    sort_order?: number;
    file_size_bytes?: number | null;
    mime_type?: string;
    published_at?: string | null;
    deleted_at: string | null;
    genre?: string;
    bpm?: number | null;
    musical_key?: string;
    composer?: string;
    license_type?: string;
    license_expires?: string | null;
    like_count: number;
    play_count: number;
    music_category_names: string;
    is_mind_player_original?: boolean;
    state?: string | null;
    effect?: string | null;
    visibility?: ContentVisibility;
    allowed_users?: AllowedUser[];
    allowed_user_ids?: number[];
    icon?: number | null;
    icon_name?: string | null;
    icon_url?: string | null;
    created_by: number;
    created_at: string;
    updated_at: string;
}

export interface AdminMindSession {
    id: number;
    name: string;
    description: string;
    artist: string;
    image: string;
    audio_clip: string;
    duration: number;
    mind_session_category?: number[];
    mind_session_type?: string | null;
    goals: number[];
    status?: ContentStatus;
    tags?: string[];
    is_premium?: boolean;
    sort_order?: number;
    file_size_bytes?: number | null;
    mime_type?: string;
    published_at?: string | null;
    deleted_at: string | null;
    instructor_name?: string;
    instructor_avatar?: string;
    difficulty?: string;
    background_audio?: number | null;
    completion_rate?: string | null;
    recommended_time?: string;
    like_count: number;
    play_count: number;
    category_names: string;
    steps: SessionStep[];
    is_mind_player_original?: boolean;
    state?: string | null;
    effect?: string | null;
    sub_category?: string | null;
    visibility?: ContentVisibility;
    allowed_users?: AllowedUser[];
    allowed_user_ids?: number[];
    icon?: number | null;
    icon_name?: string | null;
    icon_url?: string | null;
    created_by: number;
    created_at: string;
    updated_at: string;
}

export interface AdminEnvironmentSound {
    id: number;
    name: string;
    description?: string | null;
    audio_clip: string;
    image: string;
    frequency?: string | null;
    environment_sound_type?: string | null;
    category?: number[];
    goals: number[];
    status?: ContentStatus;
    tags?: string[];
    is_premium?: boolean;
    sort_order?: number;
    file_size_bytes?: number | null;
    mime_type?: string;
    published_at?: string | null;
    deleted_at: string | null;
    is_loopable?: boolean;
    fade_in_ms?: number | null;
    fade_out_ms?: number | null;
    is_mixable?: boolean;
    default_volume?: string;
    like_count: number;
    play_count: number;
    category_names: string;
    layers: SoundLayer[];
    state?: string | null;
    effect?: string | null;
    sub_category?: string | null;
    visibility?: ContentVisibility;
    allowed_users?: AllowedUser[];
    allowed_user_ids?: number[];
    icon?: number | null;
    icon_name?: string | null;
    icon_url?: string | null;
    created_at: string;
    updated_at: string;
}

export interface AdminEnvironmentVisual {
    id: number;
    name: string;
    description?: string | null;
    visual_file: string;
    image: string;
    environment_visual_type?: string | null;
    category?: number[];
    goals: number[];
    status?: ContentStatus;
    tags?: string[];
    is_premium?: boolean;
    sort_order?: number;
    file_size_bytes?: number | null;
    mime_type?: string;
    published_at?: string | null;
    deleted_at: string | null;
    resolution?: string;
    aspect_ratio?: string;
    color_palette?: unknown;
    mood?: string;
    loop_duration_ms?: number | null;
    like_count: number;
    category_names: string;
    state?: string | null;
    effect?: string | null;
    sub_category?: string | null;
    visibility?: ContentVisibility;
    allowed_users?: AllowedUser[];
    allowed_user_ids?: number[];
    icon?: number | null;
    icon_name?: string | null;
    icon_url?: string | null;
    created_at: string;
    updated_at: string;
}

export interface AdminMind {
    id: number;
    name: string;
    description?: string | null;
    author?: string | null;
    goals: number[];
    state?: string | null;
    effect?: string | null;
    status?: ContentStatus;
    tags?: string[];
    is_premium?: boolean;
    visibility?: ContentVisibility;
    allowed_users?: AllowedUser[];
    allowed_user_ids?: number[];
    icon?: number | null;
    icon_url?: string | null;
    icon_name?: string | null;
    published_at?: string | null;
    created_at: string;
    updated_at: string;
}

export type ContentVisibility = "all" | "free" | "premium" | "mind_expert" | "b2b" | "restricted";

export interface AllowedUser {
    id: number;
    display_name: string;
    email: string;
}

export interface ContentApprovalRequest {
    status: ContentStatus;
    visibility?: ContentVisibility;
    is_premium?: boolean;
    allowed_user_ids?: number[];
    published_at?: string | null;
}

export type AnyContentItem = AdminMusic | AdminMindSession | AdminEnvironmentSound | AdminEnvironmentVisual | AdminMind;

// Cross-type operations
export interface ReorderStepsRequest {
    order: number[];
}

export interface ContentStatusChangeRequest {
    status: ContentStatus;
}

export interface BulkActionRequest {
    action: "publish" | "archive" | "delete";
    items: { type: ContentType; id: number }[];
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
    total_plays_change?: number;         // % vs previous period
    total_minds_created?: number;        // total content items created
    total_minds_created_change?: number; // % vs previous period
    avg_time_per_user?: number;          // seconds
    avg_time_per_user_change?: number;   // % vs previous period
    avg_duration_per_play?: number;      // seconds
    avg_duration_per_play_change?: number; // % vs previous period
}

export interface PlaysTimeseriesPoint {
    period: string;
    plays: number;
    listeners: number;
}

export interface PlaysByType {
    content_type: string;
    plays: number;
    unique_listeners: number;
}

export interface PlaysByRegion {
    country: string;
    plays: number;
    listeners: number;
    unique_listeners?: number;
}

export interface PlaysByContent {
    content_id: number;
    content_name: string;
    content_type: string;
    plays: number;
    unique_listeners: number;
    retention?: number;              // % (0–100)
    avg_time_per_user?: number;      // seconds — total time consumed ÷ unique users
    avg_duration_per_play?: number;  // seconds — total play time ÷ total plays
    growth_rate?: number;            // % change vs previous period (positive or negative)
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
    search?: string;
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
export type SubscriptionTier = "free" | "basic" | "premium" | "enterprise";
export type TransactionStatus = "pending" | "completed" | "failed" | "refunded";

export interface Subscription {
    id: number;
    user: number;
    user_email: string;
    user_name: string;
    stripe_subscription_id: string;
    plan_name: string;
    plan: number | null;
    plan_tier: string;
    status: string;
    current_period_start: string;
    current_period_end: string;
    cancel_at_period_end: boolean;
    cancelled_at: string | null;
    expires_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface SubscriptionPlan {
    id: number;
    name: string;
    tier: SubscriptionTier;
    price_monthly: string;
    price_yearly: string | null;
    trial_days: number;
    features: unknown;
    max_downloads: number;
    is_active: boolean;
    stripe_price_id: string;
    subscriber_count: number;
    created_at: string;
    updated_at: string;
}

export interface Transaction {
    id: number;
    user: number;
    user_email: string;
    subscription: number | null;
    amount: string;
    currency: string;
    status: TransactionStatus;
    payment_provider: string;
    provider_txn_id: string;
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
    status?: string;
    plan?: number;
    tier?: SubscriptionTier;
    user?: number;
    created_after?: string;
    created_before?: string;
}

export interface TransactionListParams extends PaginationParams, SearchParams, DateRangeParams {
    status?: TransactionStatus;
    subscription?: number;
    user?: number;
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
    // KPI cards
    active_groups?: number;
    active_groups_change?: number;
    group_sessions?: number;
    avg_participants?: number;
    chat_messages?: number;
    chat_messages_change?: number;
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
    user: number;
    user_name: string;
    user_email: string;
    group: number | null;
    group_name: string | null;
    group_session: number | null;
    title: string;
    content: string;
    images: string[];
    status: string;
    deleted_at: string | null;
    like_count: number;
    comment_count: number;
    created_at: string;
    updated_at: string;
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

export interface CommunityGroupSession {
    id: number;
    title: string;
    host_name?: string;
    group_name?: string;
    participants_count: number;
    max_participants?: number;
    status?: 'scheduled' | 'live' | 'completed' | 'cancelled' | string;
    scheduled_at?: string;
    started_at?: string;
    ended_at?: string;
    duration?: number;
    created_at: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// 8. SETTINGS
// ═══════════════════════════════════════════════════════════════════════════

export type SettingsCategory = "general" | "appearance" | "media" | "notifications" | "app-versions";

export interface AppVersions {
    mobile_app: string;
    vr_app: string;
    api: string;
}

export interface CacheClearResponse {
    cleared: boolean;
    message: string;
}

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
    event_type: string;
    subject: string;
    body_template: string;
    variables: string[];
}

export interface TestTemplateRequest {
    template_id: number;
    recipient: string;
}

export type NotificationGroup = 'all' | 'free' | 'premium' | 'mind_expert' | 'b2b';
export type NotificationTimezoneMode = 'user' | 'utc';

export interface SendNotificationRequest {
    title: string;
    body: string;
    target_group: NotificationGroup;
}

export interface SendNotificationResponse {
    created: number;
    target_group: string;
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
    group_id?: number;
    event_type?: string;
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
    admin: number;
    admin_email: string;
    action: string;
    resource_type?: string;
    resource_id?: string;
    changes?: unknown;
    ip_address?: string;
    created_at: string;
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
