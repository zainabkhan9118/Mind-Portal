import apiClient from "./axiosInstance";
import type {
    PaginatedResponse,
    DateRangeParams,
    GrowthGranularity,
    MonetizationDashboard,
    RevenueTimeseriesPoint,
    RevenueByPlan,
    RevenueByRegion,
    Subscription,
    SubscriptionPlan,
    Transaction,
    Payout,
    SubscriptionListParams,
    TransactionListParams,
    PaginationParams,
} from "./types";

/**
 * Monetization API Service
 *
 * Revenue dashboard, subscriptions, plans, transactions, payouts.
 */
const monetizationApi = {
    // ── Revenue Dashboard ───────────────────────────────────────────────

    /** KPIs: total revenue, MRR, ARR, ARPU, active subscribers, churn. */
    getDashboard: async (
        params?: DateRangeParams,
    ): Promise<MonetizationDashboard> => {
        const response = await apiClient.get<MonetizationDashboard>(
            "admin/monetization/dashboard/",
            { params },
        );
        return response.data;
    },

    /** Revenue timeseries — stacked bar chart by plan tier. */
    getRevenueTimeseries: async (
        granularity: GrowthGranularity = "monthly",
        params?: DateRangeParams,
    ): Promise<RevenueTimeseriesPoint[]> => {
        const response = await apiClient.get<{
            results: RevenueTimeseriesPoint[];
        }>("admin/monetization/revenue/timeseries/", {
            params: { granularity, ...params },
        });
        return response.data.results;
    },

    /** Revenue by plan (pie/donut chart). */
    getRevenueByPlan: async (
        params?: DateRangeParams,
    ): Promise<RevenueByPlan[]> => {
        const response = await apiClient.get<{ results: RevenueByPlan[] }>(
            "admin/monetization/revenue/by-plan/",
            { params },
        );
        return response.data.results;
    },

    /** Revenue by region. */
    getRevenueByRegion: async (
        params?: DateRangeParams,
    ): Promise<RevenueByRegion[]> => {
        const response = await apiClient.get<{ results: RevenueByRegion[] }>(
            "admin/monetization/revenue/by-region/",
            { params },
        );
        return response.data.results;
    },

    // ── Subscriptions ───────────────────────────────────────────────────

    /** Paginated subscriptions table. */
    getSubscriptions: async (
        params?: SubscriptionListParams,
    ): Promise<PaginatedResponse<Subscription>> => {
        const response = await apiClient.get<PaginatedResponse<Subscription>>(
            "admin/monetization/subscriptions/",
            { params },
        );
        return response.data;
    },

    /** Subscription detail. */
    getSubscription: async (id: number): Promise<Subscription> => {
        const response = await apiClient.get<Subscription>(
            `admin/monetization/subscriptions/${id}/`,
        );
        return response.data;
    },

    /** Extend a subscription. */
    extendSubscription: async (
        id: number,
        expires_at: string,
    ): Promise<Subscription> => {
        const response = await apiClient.patch<Subscription>(
            `admin/monetization/subscriptions/${id}/`,
            { action: "extend", expires_at },
        );
        return response.data;
    },

    /** Cancel a subscription. */
    cancelSubscription: async (id: number): Promise<Subscription> => {
        const response = await apiClient.patch<Subscription>(
            `admin/monetization/subscriptions/${id}/`,
            { action: "cancel" },
        );
        return response.data;
    },

    // ── Plans ───────────────────────────────────────────────────────────

    /** List all plans. */
    getPlans: async (): Promise<SubscriptionPlan[]> => {
        const response = await apiClient.get<SubscriptionPlan[]>(
            "admin/monetization/plans/",
        );
        return response.data;
    },

    /** Create a new plan. */
    createPlan: async (
        data: Partial<SubscriptionPlan>,
    ): Promise<SubscriptionPlan> => {
        const response = await apiClient.post<SubscriptionPlan>(
            "admin/monetization/plans/",
            data,
        );
        return response.data;
    },

    /** Update an existing plan. */
    updatePlan: async (
        id: number,
        data: Partial<SubscriptionPlan>,
    ): Promise<SubscriptionPlan> => {
        const response = await apiClient.patch<SubscriptionPlan>(
            `admin/monetization/plans/${id}/`,
            data,
        );
        return response.data;
    },

    /** Deactivate plan (soft-delete: sets is_active=false). */
    deactivatePlan: async (id: number): Promise<void> => {
        await apiClient.delete(`admin/monetization/plans/${id}/`);
    },

    // ── Transactions ────────────────────────────────────────────────────

    /** Paginated transactions table (read-only). */
    getTransactions: async (
        params?: TransactionListParams,
    ): Promise<PaginatedResponse<Transaction>> => {
        const response = await apiClient.get<PaginatedResponse<Transaction>>(
            "admin/monetization/transactions/",
            { params },
        );
        return response.data;
    },

    /** Transaction detail. */
    getTransaction: async (id: number): Promise<Transaction> => {
        const response = await apiClient.get<Transaction>(
            `admin/monetization/transactions/${id}/`,
        );
        return response.data;
    },

    // ── Payouts ─────────────────────────────────────────────────────────

    /** Paginated payouts table. */
    getPayouts: async (
        params?: PaginationParams & DateRangeParams,
    ): Promise<PaginatedResponse<Payout>> => {
        const response = await apiClient.get<PaginatedResponse<Payout>>(
            "admin/monetization/payouts/",
            { params },
        );
        return response.data;
    },
};

export default monetizationApi;
