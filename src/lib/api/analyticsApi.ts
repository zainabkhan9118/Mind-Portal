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

/** Safely unwrap API responses that may be a plain array or a { results: [] } envelope. */
function unwrapArray<T>(data: T[] | { results: T[] } | null | undefined): T[] {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    return (data as { results: T[] }).results ?? [];
}

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
        const response = await apiClient.get<
            ContentDistribution[] | { results: ContentDistribution[] }
        >("admin/analytics/overview/distributions/", { params });
        return unwrapArray(response.data);
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
        const response = await apiClient.get<
            PlaysTimeseriesPoint[] | { results: PlaysTimeseriesPoint[] }
        >("admin/analytics/plays/timeseries/", {
            params: { granularity, ...params },
        });
        return unwrapArray(response.data);
    },

    /** Plays grouped by content type (bar chart). */
    getPlaysByType: async (params?: AnalyticsParams): Promise<PlaysByType[]> => {
        const response = await apiClient.get<
            PlaysByType[] | { results: PlaysByType[] }
        >("admin/analytics/plays/by-type/", { params });
        return unwrapArray(response.data);
    },

    /** Plays grouped by region/country (map or table). */
    getPlaysByRegion: async (
        params?: AnalyticsParams,
    ): Promise<PlaysByRegion[]> => {
        const response = await apiClient.get<
            PlaysByRegion[] | { results: PlaysByRegion[] }
        >("admin/analytics/plays/by-region/", { params });
        return unwrapArray(response.data);
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
        const response = await apiClient.get<
            RankedContent[] | { results: RankedContent[] }
        >("admin/analytics/rankings/content/", { params });
        return unwrapArray(response.data);
    },

    /** Top creators by total plays / listeners. */
    getTopCreators: async (params?: {
        limit?: number;
    }): Promise<RankedCreator[]> => {
        const response = await apiClient.get<
            RankedCreator[] | { results: RankedCreator[] }
        >("admin/analytics/rankings/creators/", { params });
        return unwrapArray(response.data);
    },

    /** Top categories by play count. */
    getTopCategories: async (params?: {
        limit?: number;
    }): Promise<RankedCategory[]> => {
        const response = await apiClient.get<
            RankedCategory[] | { results: RankedCategory[] }
        >("admin/analytics/rankings/categories/", { params });
        return unwrapArray(response.data);
    },

    /** Trending content (last 7 days). */
    getTrending: async (): Promise<TrendingContent[]> => {
        const response = await apiClient.get<
            TrendingContent[] | { results: TrendingContent[] }
        >("admin/analytics/rankings/trending/");
        return unwrapArray(response.data);
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
