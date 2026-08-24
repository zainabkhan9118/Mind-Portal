import apiClient from "./axiosInstance";
import type {
    PaginatedResponse,
    DateRangeParams,
    GrowthGranularity,
    CommunityDashboard,
    CommunityGrowthPoint,
    CommunityEngagementPoint,
    CommunityMember,
    CommunityPost,
    CommunityReport,
    CommunityGroup,
    CommunityGroupSession,
    MemberActionRequest,
    PostActionRequest,
    ResolveReportRequest,
    DismissReportRequest,
    MemberListParams,
    PostListParams,
    ReportListParams,
    PaginationParams,
} from "./types";

/**
 * Community API Service
 *
 * Dashboard KPIs, members, posts, reports, groups.
 */
const communityApi = {
    // ── Dashboard ───────────────────────────────────────────────────────

    /** KPIs: total/active members, posts, comments, engagement rate, groups, open reports. */
    getDashboard: async (
        params?: DateRangeParams,
    ): Promise<CommunityDashboard> => {
        const response = await apiClient.get<CommunityDashboard>(
            "admin/community/dashboard/",
            { params },
        );
        return response.data;
    },

    /** Member growth line chart data. */
    getGrowth: async (
        granularity: GrowthGranularity = "daily",
        params?: DateRangeParams,
    ): Promise<CommunityGrowthPoint[]> => {
        const response = await apiClient.get<{
            results: CommunityGrowthPoint[];
        }>("admin/community/dashboard/growth/", {
            params: { granularity, ...params },
        });
        return response.data.results;
    },

    /** Posts + comments engagement bar chart data. */
    getEngagement: async (
        granularity: GrowthGranularity = "daily",
        params?: DateRangeParams,
    ): Promise<CommunityEngagementPoint[]> => {
        const response = await apiClient.get<{
            results: CommunityEngagementPoint[];
        }>("admin/community/dashboard/engagement/", {
            params: { granularity, ...params },
        });
        return response.data.results;
    },

    // ── Members ─────────────────────────────────────────────────────────

    /** Paginated members table. */
    getMembers: async (
        params?: MemberListParams,
    ): Promise<PaginatedResponse<CommunityMember>> => {
        const response = await apiClient.get<PaginatedResponse<CommunityMember>>(
            "admin/community/members/",
            { params },
        );
        return response.data;
    },

    /** Get member detail. */
    getMember: async (id: number): Promise<CommunityMember> => {
        const response = await apiClient.get<CommunityMember>(
            `admin/community/members/${id}/`,
        );
        return response.data;
    },

    /** Change member role or status. */
    updateMember: async (
        id: number,
        data: MemberActionRequest,
    ): Promise<CommunityMember> => {
        const response = await apiClient.patch<CommunityMember>(
            `admin/community/members/${id}/`,
            data,
        );
        return response.data;
    },

    // ── Posts ────────────────────────────────────────────────────────────

    /** Paginated posts table. */
    getPosts: async (
        params?: PostListParams,
    ): Promise<PaginatedResponse<CommunityPost>> => {
        const response = await apiClient.get<PaginatedResponse<CommunityPost>>(
            "admin/community/posts/",
            { params },
        );
        return response.data;
    },

    /** Post detail. */
    getPost: async (id: number): Promise<CommunityPost> => {
        const response = await apiClient.get<CommunityPost>(
            `admin/community/posts/${id}/`,
        );
        return response.data;
    },

    /** Change post status (hide/unhide, pin/unpin). */
    updatePost: async (
        id: number,
        data: PostActionRequest,
    ): Promise<CommunityPost> => {
        const response = await apiClient.patch<CommunityPost>(
            `admin/community/posts/${id}/`,
            data,
        );
        return response.data;
    },

    /** Soft-delete a post. */
    deletePost: async (id: number): Promise<void> => {
        await apiClient.delete(`admin/community/posts/${id}/`);
    },

    // ── Reports ─────────────────────────────────────────────────────────

    /** Paginated reports table. */
    getReports: async (
        params?: ReportListParams,
    ): Promise<PaginatedResponse<CommunityReport>> => {
        const response = await apiClient.get<PaginatedResponse<CommunityReport>>(
            "admin/community/reports/",
            { params },
        );
        return response.data;
    },

    /** Report detail. */
    getReport: async (id: number): Promise<CommunityReport> => {
        const response = await apiClient.get<CommunityReport>(
            `admin/community/reports/${id}/`,
        );
        return response.data;
    },

    /** Resolve a report with action + note. */
    resolveReport: async (
        id: number,
        data: ResolveReportRequest,
    ): Promise<CommunityReport> => {
        const response = await apiClient.patch<CommunityReport>(
            `admin/community/reports/${id}/`,
            data,
        );
        return response.data;
    },

    /** Dismiss a report with note. */
    dismissReport: async (
        id: number,
        data: DismissReportRequest,
    ): Promise<CommunityReport> => {
        const response = await apiClient.patch<CommunityReport>(
            `admin/community/reports/${id}/`,
            data,
        );
        return response.data;
    },

    // ── Groups ──────────────────────────────────────────────────────────

    /** Paginated groups table. */
    getGroups: async (
        params?: PaginationParams,
    ): Promise<PaginatedResponse<CommunityGroup>> => {
        const response = await apiClient.get<PaginatedResponse<CommunityGroup>>(
            "admin/community/groups/",
            { params },
        );
        return response.data;
    },

    /** Group detail. */
    getGroup: async (id: number): Promise<CommunityGroup> => {
        const response = await apiClient.get<CommunityGroup>(
            `admin/community/groups/${id}/`,
        );
        return response.data;
    },

    /** Create a group. */
    createGroup: async (
        data: Partial<CommunityGroup>,
    ): Promise<CommunityGroup> => {
        const response = await apiClient.post<CommunityGroup>(
            "admin/community/groups/",
            data,
        );
        return response.data;
    },

    /** Update a group. */
    updateGroup: async (
        id: number,
        data: Partial<CommunityGroup>,
    ): Promise<CommunityGroup> => {
        const response = await apiClient.patch<CommunityGroup>(
            `admin/community/groups/${id}/`,
            data,
        );
        return response.data;
    },

    /** Archive a group (sets is_hidden=true, no hard delete). */
    archiveGroup: async (id: number): Promise<void> => {
        await apiClient.delete(`admin/community/groups/${id}/`);
    },

    // ── Group Sessions ──────────────────────────────────────────────────

    /** Paginated group sessions, sortable by participants. */
    getSessions: async (
        params?: PaginationParams & { ordering?: string },
    ): Promise<PaginatedResponse<CommunityGroupSession>> => {
        const response = await apiClient.get<PaginatedResponse<CommunityGroupSession>>(
            "admin/community/sessions/",
            { params },
        );
        return response.data;
    },
};

export default communityApi;
