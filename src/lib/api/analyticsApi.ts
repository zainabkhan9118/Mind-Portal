import apiClient from "./axiosInstance";
import type {
    PaginatedResponse,
    AnalyticsOverview,
    ContentDistribution,
    PlaysKPI,
    PlaysTimeseriesPoint,
    PlaysByType,
    PlaysByPlatform,
    AvgDurationByType,
    AvgDurationTimeseriesPoint,
    PlaysByRegion,
    PlaysByContent,
    RankedContent,
    RankedCreator,
    RankedCategory,
    TrendingContent,
    AnalyticsParams,
    MindCoverageRow,
    MindCoverageParams,
    MindsAnalyticsParams,
    MindsOverviewKPI,
    MindsHelpfulRateByGoal,
    MindsTopStatePathway,
    MindsStateResponseRow,
    MindDetail,
    MindStateEntryPoint,
    MindPerformanceRow,
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
        const response = await apiClient.get<PlaysKPI>("admin/analytics/plays/kpi/", {
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

    /** Platform (mobile/VR) share, device breakdown, and avg session duration per platform. */
    getPlaysByPlatform: async (params?: AnalyticsParams): Promise<PlaysByPlatform> => {
        const response = await apiClient.get<PlaysByPlatform>(
            "admin/analytics/plays/by-platform/",
            { params },
        );
        return response.data;
    },

    /** Avg listening/experience duration per content type (stat cards). */
    getAvgDurationByType: async (params?: AnalyticsParams): Promise<AvgDurationByType[]> => {
        const response = await apiClient.get<
            AvgDurationByType[] | { results: AvgDurationByType[] }
        >("admin/analytics/plays/avg-duration-by-type/", { params });
        return unwrapArray(response.data);
    },

    /** Daily avg duration trend per content type (line chart). */
    getAvgDurationTimeseries: async (params?: AnalyticsParams): Promise<AvgDurationTimeseriesPoint[]> => {
        const response = await apiClient.get<
            AvgDurationTimeseriesPoint[] | { results: AvgDurationTimeseriesPoint[] }
        >("admin/analytics/plays/avg-duration-timeseries/", { params });
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

    // ── Mind Coverage ───────────────────────────────────────────────────

    /** Coverage of Minds across (Primary Goal, Primary State) pathways. Not live yet — see API_SPEC.md. */
    getMindCoverage: async (
        params?: MindCoverageParams,
    ): Promise<MindCoverageRow[]> => {
        const response = await apiClient.get<
            MindCoverageRow[] | { results: MindCoverageRow[] }
        >("admin/analytics/minds/coverage/", { params });
        return unwrapArray(response.data);
    },

    // ── Minds Analytics tab ─────────────────────────────────────────────
    // None of these exist on the backend yet — see API_SPEC.md "Minds Analytics tab".

    /** The 6 top KPI cards: Total Minds, Active Minds, Overall Helpful Rate, Avg Time per User, Replays, Top Pathway. */
    getMindsOverview: async (params?: MindsAnalyticsParams): Promise<MindsOverviewKPI> => {
        const response = await apiClient.get<MindsOverviewKPI>(
            "admin/analytics/minds/overview/",
            { params },
        );
        return response.data;
    },

    /** "Helpful Rate by Goal" horizontal bar list. */
    getMindsHelpfulRateByGoal: async (
        params?: MindsAnalyticsParams,
    ): Promise<MindsHelpfulRateByGoal[]> => {
        const response = await apiClient.get<
            MindsHelpfulRateByGoal[] | { results: MindsHelpfulRateByGoal[] }
        >("admin/analytics/minds/helpful-rate-by-goal/", { params });
        return unwrapArray(response.data);
    },

    /** "Top State Pathways" — top (primary_goal, primary_state) pairs by share of plays. */
    getMindsTopStatePathways: async (
        params?: MindsAnalyticsParams & { limit?: number },
    ): Promise<MindsTopStatePathway[]> => {
        const response = await apiClient.get<
            MindsTopStatePathway[] | { results: MindsTopStatePathway[] }
        >("admin/analytics/minds/top-state-pathways/", { params });
        return unwrapArray(response.data);
    },

    /** "State Response Overview" heatmap — helpful rate per individual State, all states. */
    getMindsStateResponseOverview: async (
        params?: MindsAnalyticsParams,
    ): Promise<MindsStateResponseRow[]> => {
        const response = await apiClient.get<
            MindsStateResponseRow[] | { results: MindsStateResponseRow[] }
        >("admin/analytics/minds/state-response-overview/", { params });
        return unwrapArray(response.data);
    },

    /** Metadata + totals for one Mind, shown in the "selected mind" detail card. */
    getMindDetail: async (mindId: number, params?: MindsAnalyticsParams): Promise<MindDetail> => {
        const response = await apiClient.get<MindDetail>(
            `admin/analytics/minds/${mindId}/`,
            { params },
        );
        return response.data;
    },

    /** "Helpful by State Entry Point" — helpful rate + sample size per entry state, for one Mind. */
    getMindStateEntryPoints: async (
        mindId: number,
        params?: MindsAnalyticsParams,
    ): Promise<MindStateEntryPoint[]> => {
        const response = await apiClient.get<
            MindStateEntryPoint[] | { results: MindStateEntryPoint[] }
        >(`admin/analytics/minds/${mindId}/state-entry-points/`, { params });
        return unwrapArray(response.data);
    },

    /** "Mind Performance" table — one row per Mind. */
    getMindsPerformance: async (
        params?: MindsAnalyticsParams & PaginationParams & { search?: string },
    ): Promise<PaginatedResponse<MindPerformanceRow>> => {
        const response = await apiClient.get<PaginatedResponse<MindPerformanceRow>>(
            "admin/analytics/minds/performance/",
            { params },
        );
        return response.data;
    },

    /** Trigger async Minds analytics CSV export. Returns { task_id }. */
    exportMinds: async (params?: MindsAnalyticsParams): Promise<ExportTaskResponse> => {
        const response = await apiClient.post<ExportTaskResponse>(
            "admin/analytics/minds/export/",
            null,
            { params },
        );
        return response.data;
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
