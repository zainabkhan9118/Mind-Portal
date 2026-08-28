import apiClient from "./axiosInstance";
import type {
    PaginatedResponse,
    DateRangeParams,
    UserDashboard,
    GrowthPoint,
    GrowthGranularity,
    EngagementMetrics,
    UserDemographics,
    SubscriptionDistribution,
    ApiUser,
    UserDetail,
    UserActivity,
    UserSession,
    UserStatusChangeRequest,
    UserNotifyRequest,
    UserListParams,
    UserSearchResult,
    ExportTaskResponse,
} from "./types";

/**
 * Users API Service
 *
 * Dashboard KPIs, user table CRUD, status management, notifications, export.
 */
const usersApi = {
    // ── Dashboard / KPIs ────────────────────────────────────────────────
    /** KPI cards: total users, active, new today/week/month, churn rate */
    getDashboard: async (params?: DateRangeParams): Promise<UserDashboard> => {
        const response = await apiClient.get<UserDashboard>("admin/users/dashboard/", {
            params,
        });
        return response.data;
    },

    /** User growth line chart data. */
    getGrowth: async (
        granularity: GrowthGranularity = "daily",
        params?: DateRangeParams,
    ): Promise<GrowthPoint[]> => {
        const response = await apiClient.get<GrowthPoint[] | { results: GrowthPoint[] }>(
            "admin/users/dashboard/growth/",
            { params: { granularity, ...params } },
        );
        const data = response.data;
        return Array.isArray(data) ? data : (data.results ?? []);
    },

    /** DAU / WAU / MAU engagement metrics. */
    getEngagement: async (params?: DateRangeParams): Promise<EngagementMetrics> => {
        const response = await apiClient.get<EngagementMetrics>(
            "admin/users/dashboard/engagement/",
            { params },
        );
        return response.data;
    },

    /** Gender, country, age group demographic distributions. */
    getDemographics: async (params?: DateRangeParams): Promise<UserDemographics> => {
        const response = await apiClient.get<UserDemographics>(
            "admin/users/dashboard/demographics/",
            { params },
        );
        return response.data;
    },

    /** Subscription distribution by plan tier. */
    getSubscriptions: async (
        params?: DateRangeParams,
    ): Promise<SubscriptionDistribution[]> => {
        const response = await apiClient.get<{ results: SubscriptionDistribution[] }>(
            "admin/users/dashboard/subscriptions/",
            { params },
        );
        return response.data.results;
    },

    // ── User Table ──────────────────────────────────────────────────────
    /** Paginated user list with search, filters, ordering. */
    getUsers: async (
        params?: UserListParams,
    ): Promise<PaginatedResponse<ApiUser>> => {
        const response = await apiClient.get<PaginatedResponse<ApiUser>>("admin/users/", {
            params,
        });
        return response.data;
    },

    /** Full user profile with subscription info. */
    getUserById: async (id: number): Promise<UserDetail> => {
        const response = await apiClient.get<UserDetail>(`admin/users/${id}/`);
        return response.data;
    },

    /** Change user status (active / suspended / banned). */
    changeUserStatus: async (
        id: number,
        data: UserStatusChangeRequest,
    ): Promise<void> => {
        await apiClient.patch(`admin/users/${id}/status/`, data);
    },

    /** Partial update a user — profile fields, role flags, or avatar (pass FormData for file upload). */
    updateUser: async (
        id: number,
        data: FormData | Partial<{
            first_name: string;
            last_name: string;
            email: string;
            phone: string;
            is_premium: boolean;
            is_mind_expert: boolean;
            mind_expert_pending: boolean;
        }>,
    ): Promise<ApiUser> => {
        const response = await apiClient.patch<ApiUser>(`admin/users/${id}/`, data);
        return response.data;
    },

    /** Set a new password for any user (admin override — no old password required). */
    setPassword: async (id: number, password: string): Promise<void> => {
        await apiClient.post(`admin/users/${id}/set-password/`, { password });
    },

    /** Lightweight user search for the Restricted access picker. */
    searchUsers: async (q: string, size = 20): Promise<{ count: number; results: UserSearchResult[] }> => {
        const response = await apiClient.get<{ count: number; results: UserSearchResult[] }>(
            "admin/users/search/",
            { params: { q, size } },
        );
        return response.data;
    },

    /** Soft-delete a user. */
    deleteUser: async (id: number): Promise<void> => {
        await apiClient.delete(`admin/users/${id}/`);
    },

    /** Restore a soft-deleted user. */
    restoreUser: async (id: number): Promise<void> => {
        await apiClient.post(`admin/users/${id}/restore/`);
    },

    /** Send a push/email notification to a specific user. */
    notifyUser: async (id: number, data: UserNotifyRequest): Promise<void> => {
        await apiClient.post(`admin/users/${id}/notify/`, data);
    },

    /** Paginated audit trail for a user. */
    getUserActivity: async (
        id: number,
        params?: { page?: number; size?: number },
    ): Promise<PaginatedResponse<UserActivity>> => {
        const response = await apiClient.get<PaginatedResponse<UserActivity>>(
            `admin/users/${id}/activity/`,
            { params },
        );
        return response.data;
    },

    /** Active login sessions for a user. */
    getUserSessions: async (id: number): Promise<UserSession[]> => {
        const response = await apiClient.get<UserSession[]>(
            `admin/users/${id}/sessions/`,
        );
        return response.data;
    },

    /** Trigger async CSV export. Returns { task_id }. */
    exportUsers: async (): Promise<ExportTaskResponse> => {
        const response = await apiClient.post<ExportTaskResponse>("admin/users/export/");
        return response.data;
    },

    /** Promote a user to Mind Expert role. */
    switchToMindExpert: async (id: number): Promise<void> => {
        await apiClient.patch(`admin/users/${id}/`, { is_mind_expert: true });
    },

    /** List users who have submitted a Mind Expert application (pending_mind_expert=true). */
    getMindExpertApplications: async (): Promise<{ count: number; results: ApiUser[] }> => {
        const response = await apiClient.get<{ count: number; results: ApiUser[] }>(
            "admin/users/",
            { params: { mind_expert_pending: true, size: 50 } },
        );
        return response.data;
    },

    /** Approve a Mind Expert application. */
    approveMindExpert: async (id: number): Promise<void> => {
        await apiClient.patch(`admin/users/${id}/`, { is_mind_expert: true, mind_expert_pending: false });
    },

    /** Reject a Mind Expert application. */
    rejectMindExpert: async (id: number): Promise<void> => {
        await apiClient.patch(`admin/users/${id}/`, { mind_expert_pending: false });
    },
};

export default usersApi;
