import apiClient from "./axiosInstance";
import type {
    PaginatedResponse,
    AccessLevel,
    AccessLevelInput,
    AccessLevelMember,
    AccessLevelMembersUpdateResponse,
    AILimitsSettings,
    UserAccessLevelRef,
} from "./types";

/**
 * Access Levels API
 *
 * Custom access levels for client-specific content (e.g. a sports team):
 * CRUD, membership, plus the platform limits (Free Mind limit, AI Mind Coach limits).
 */
const accessLevelsApi = {
    list: async (params?: { search?: string; page?: number; size?: number; ordering?: string }): Promise<PaginatedResponse<AccessLevel>> => {
        const response = await apiClient.get<PaginatedResponse<AccessLevel>>("admin/access-levels/", { params });
        return response.data;
    },

    /** Every level (for pickers). */
    listAll: async (): Promise<AccessLevel[]> => {
        const response = await apiClient.get<PaginatedResponse<AccessLevel>>("admin/access-levels/", { params: { size: 200, ordering: "name" } });
        return response.data.results ?? [];
    },

    create: async (data: AccessLevelInput): Promise<AccessLevel> => {
        const response = await apiClient.post<AccessLevel>("admin/access-levels/", data);
        return response.data;
    },

    update: async (id: number, data: AccessLevelInput): Promise<AccessLevel> => {
        const response = await apiClient.patch<AccessLevel>(`admin/access-levels/${id}/`, data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await apiClient.delete(`admin/access-levels/${id}/`);
    },

    // ── Members ─────────────────────────────────────────────────────────

    listMembers: async (id: number, params?: { search?: string; page?: number; size?: number }): Promise<PaginatedResponse<AccessLevelMember>> => {
        const response = await apiClient.get<PaginatedResponse<AccessLevelMember>>(`admin/access-levels/${id}/members/`, { params });
        return response.data;
    },

    /** Add members by user id and/or email. Unknown emails come back in `not_found`. */
    addMembers: async (id: number, data: { user_ids?: number[]; emails?: string[] }): Promise<AccessLevelMembersUpdateResponse> => {
        const response = await apiClient.post<AccessLevelMembersUpdateResponse>(`admin/access-levels/${id}/members/`, data);
        return response.data;
    },

    removeMember: async (id: number, userId: number): Promise<void> => {
        await apiClient.delete(`admin/access-levels/${id}/members/${userId}/`);
    },

    // ── Limits ──────────────────────────────────────────────────────────

    getAiLimits: async (): Promise<AILimitsSettings> => {
        const response = await apiClient.get<AILimitsSettings>("admin/settings/ai-limits/");
        return response.data;
    },

    updateAiLimits: async (data: Partial<AILimitsSettings>): Promise<AILimitsSettings> => {
        const response = await apiClient.patch<AILimitsSettings>("admin/settings/ai-limits/", data);
        return response.data;
    },

    /** General settings hold `free_mind_limit` next to feature flags; PUT the whole object so flags aren't lost. */
    getGeneralSettings: async (): Promise<Record<string, unknown>> => {
        const response = await apiClient.get<Record<string, unknown>>("admin/settings/general/");
        return response.data;
    },

    updateGeneralSettings: async (data: Record<string, unknown>): Promise<Record<string, unknown>> => {
        const response = await apiClient.put<Record<string, unknown>>("admin/settings/general/", data);
        return response.data;
    },
};

/** Users return levels as ids or as {id, name}; normalise to ids. */
export const accessLevelIds = (refs?: UserAccessLevelRef[] | null): number[] =>
    (refs ?? []).map(r => (typeof r === "number" ? r : r.id));

export default accessLevelsApi;
