import apiClient from "./axiosInstance";
import type {
    PaginatedResponse,
    AnalyticsOverview,
    ContentDistribution,
    PlaysKPI,
    PlaysTimeseriesPoint,
    PlaysByType,
    PlaysByRegion,
    PlaysByContent,
    RankedContent,
    RankedCreator,
    RankedCategory,
    TrendingContent,
    AnalyticsParams,
    ExportTaskResponse,
    ContentType,
    GrowthGranularity,
    DateRangeParams,
    PaginationParams,
} from "./types";

/**
 * Statistics & Analytics API Service
 *
 * Overview, plays analytics, rankings, export.
 */
const analyticsApi = {
    // ── Overview ────────────────────────────────────────────────────────

    /** Total items per type, total plays, listeners, avg completion rate. */
    getOverview: async (params?: DateRangeParams): Promise<AnalyticsOverview> => {
        const response = await apiClient.get<AnalyticsOverview>(
            "admin/analytics/overview/",
            { params },
        );
        return response.data;
    },

    /** Per-type breakdown: total, published, draft, premium_count. */
    getDistributions: async (
        params?: DateRangeParams,
    ): Promise<ContentDistribution[]> => {
        const response = await apiClient.get<{ results: ContentDistribution[] }>(
            "admin/analytics/overview/distributions/",
            { params },
        );
        return response.data.results;
    },

    // ── Plays Analytics ─────────────────────────────────────────────────

    /** Play KPIs: total plays, unique listeners, avg per user, period comparison. */
    getPlaysKPI: async (params?: AnalyticsParams): Promise<PlaysKPI> => {
        const response = await apiClient.get<PlaysKPI>("admin/analytics/plays/", {
            params,
        });
        return response.data;
    },

    /** Plays timeseries for charting. */
    getPlaysTimeseries: async (
        granularity: GrowthGranularity = "daily",
        params?: AnalyticsParams,
    ): Promise<PlaysTimeseriesPoint[]> => {
        const response = await apiClient.get<{
            results: PlaysTimeseriesPoint[];
        }>("admin/analytics/plays/timeseries/", {
            params: { granularity, ...params },
        });
        return response.data.results;
    },

    /** Plays grouped by content type (bar chart). */
    getPlaysByType: async (params?: AnalyticsParams): Promise<PlaysByType[]> => {
        const response = await apiClient.get<{ results: PlaysByType[] }>(
            "admin/analytics/plays/by-type/",
            { params },
        );
        return response.data.results;
    },

    /** Plays grouped by region/country (map or table). */
    getPlaysByRegion: async (
        params?: AnalyticsParams,
    ): Promise<PlaysByRegion[]> => {
        const response = await apiClient.get<{ results: PlaysByRegion[] }>(
            "admin/analytics/plays/by-region/",
            { params },
        );
        return response.data.results;
    },

    /** Top played content — paginated table. */
    getPlaysByContent: async (
        params?: AnalyticsParams & PaginationParams,
    ): Promise<PaginatedResponse<PlaysByContent>> => {
        const response = await apiClient.get<PaginatedResponse<PlaysByContent>>(
            "admin/analytics/plays/by-content/",
            { params },
        );
        return response.data;
    },

    // ── Rankings ────────────────────────────────────────────────────────

    /** Top content sorted by play count. */
    getTopContent: async (params?: {
        content_type?: ContentType;
        limit?: number;
    }): Promise<RankedContent[]> => {
        const response = await apiClient.get<{ results: RankedContent[] }>(
            "admin/analytics/rankings/content/",
            { params },
        );
        return response.data.results;
    },

    /** Top creators by total plays / listeners. */
    getTopCreators: async (params?: {
        limit?: number;
    }): Promise<RankedCreator[]> => {
        const response = await apiClient.get<{ results: RankedCreator[] }>(
            "admin/analytics/rankings/creators/",
            { params },
        );
        return response.data.results;
    },

    /** Top categories by play count. */
    getTopCategories: async (params?: {
        limit?: number;
    }): Promise<RankedCategory[]> => {
        const response = await apiClient.get<{ results: RankedCategory[] }>(
            "admin/analytics/rankings/categories/",
            { params },
        );
        return response.data.results;
    },

    /** Trending content (last 7 days). */
    getTrending: async (): Promise<TrendingContent[]> => {
        const response = await apiClient.get<{ results: TrendingContent[] }>(
            "admin/analytics/rankings/trending/",
        );
        return response.data.results;
    },

    // ── Export ──────────────────────────────────────────────────────────

    /** Trigger async analytics CSV export. Returns { task_id }. */
    exportPlays: async (params?: AnalyticsParams): Promise<ExportTaskResponse> => {
        const response = await apiClient.post<ExportTaskResponse>(
            "admin/analytics/plays/export/",
            null,
            { params },
        );
        return response.data;
    },
};

export default analyticsApi;
