import apiClient from "./axiosInstance";
import type {
    PaginatedResponse,
    ContentListParams,
    MusicListParams,
    GuidedSessionListParams,
    EnvSoundListParams,
    EnvVisualListParams,
    AdminMusic,
    AdminMindSession,
    AdminEnvironmentSound,
    AdminEnvironmentVisual,
    AnyContentItem,
    ContentTypeEndpoint,
    ContentType,
    ContentStatusChangeRequest,
    BulkActionRequest,
    AdminCategory,
    SoundLayer,
    SessionStep,
    ReorderStepsRequest,
} from "./types";

/**
 * Content Management API Service
 *
 * CRUD for Music, Guided Sessions, Env Sounds, Env Visuals.
 * Sub-resources: sound layers, session steps.
 * Cross-type: unified list, status change, duplicate, bulk actions.
 * Categories management.
 */

// Type-specific endpoint map
const CONTENT_ENDPOINTS: Record<ContentTypeEndpoint, string> = {
    music: "admin/content/music/",
    "guided-sessions": "admin/content/guided-sessions/",
    "env-sounds": "admin/content/env-sounds/",
    "env-visuals": "admin/content/env-visuals/",
};

const contentApi = {
    // ── Unified / Cross-Type ────────────────────────────────────────────

    /** Get all content across types (unified list). */
    getAll: async (
        params?: ContentListParams,
    ): Promise<PaginatedResponse<AnyContentItem>> => {
        const response = await apiClient.get<PaginatedResponse<AnyContentItem>>(
            "admin/content/",
            { params },
        );
        return response.data;
    },

    /** Change content status (published / draft / archived / review). */
    changeStatus: async (
        type: ContentType,
        id: number,
        data: ContentStatusChangeRequest,
    ): Promise<void> => {
        const typeSlug = type === "guided_session" ? "guided-sessions"
            : type === "env_sound" ? "env-sounds"
            : type === "env_visual" ? "env-visuals"
            : type;
        await apiClient.patch(`admin/content/${typeSlug}/${id}/status/`, data);
    },

    /** Duplicate content – creates a draft copy, returns the new item. */
    duplicate: async (
        type: ContentType,
        id: number,
    ): Promise<AnyContentItem> => {
        const typeSlug = type === "guided_session" ? "guided-sessions"
            : type === "env_sound" ? "env-sounds"
            : type === "env_visual" ? "env-visuals"
            : type;
        const response = await apiClient.post<AnyContentItem>(
            `admin/content/${typeSlug}/${id}/duplicate/`,
        );
        return response.data;
    },

    /** Bulk action on multiple content items. */
    bulkAction: async (data: BulkActionRequest): Promise<void> => {
        await apiClient.post("admin/content/bulk-action/", data);
    },

    // ── Music ───────────────────────────────────────────────────────────

    music: {
        list: async (
            params?: MusicListParams,
        ): Promise<PaginatedResponse<AdminMusic>> => {
            const response = await apiClient.get<PaginatedResponse<AdminMusic>>(
                CONTENT_ENDPOINTS.music,
                { params },
            );
            return response.data;
        },

        get: async (id: number): Promise<AdminMusic> => {
            const response = await apiClient.get<AdminMusic>(
                `admin/content/music/${id}/`,
            );
            return response.data;
        },

        create: async (data: Partial<AdminMusic>): Promise<AdminMusic> => {
            const response = await apiClient.post<AdminMusic>(
                CONTENT_ENDPOINTS.music,
                data,
            );
            return response.data;
        },

        update: async (
            id: number,
            data: Partial<AdminMusic>,
        ): Promise<AdminMusic> => {
            const response = await apiClient.patch<AdminMusic>(
                `admin/content/music/${id}/`,
                data,
            );
            return response.data;
        },

        delete: async (id: number): Promise<void> => {
            await apiClient.delete(`admin/content/music/${id}/`);
        },
    },

    // ── Guided Sessions ─────────────────────────────────────────────────

    guidedSessions: {
        list: async (
            params?: GuidedSessionListParams,
        ): Promise<PaginatedResponse<AdminMindSession>> => {
            const response = await apiClient.get<PaginatedResponse<AdminMindSession>>(
                CONTENT_ENDPOINTS["guided-sessions"],
                { params },
            );
            return response.data;
        },

        get: async (id: number): Promise<AdminMindSession> => {
            const response = await apiClient.get<AdminMindSession>(
                `admin/content/guided-sessions/${id}/`,
            );
            return response.data;
        },

        create: async (
            data: Partial<AdminMindSession>,
        ): Promise<AdminMindSession> => {
            const response = await apiClient.post<AdminMindSession>(
                CONTENT_ENDPOINTS["guided-sessions"],
                data,
            );
            return response.data;
        },

        update: async (
            id: number,
            data: Partial<AdminMindSession>,
        ): Promise<AdminMindSession> => {
            const response = await apiClient.patch<AdminMindSession>(
                `admin/content/guided-sessions/${id}/`,
                data,
            );
            return response.data;
        },

        delete: async (id: number): Promise<void> => {
            await apiClient.delete(`admin/content/guided-sessions/${id}/`);
        },

        // Steps sub-resource
        getSteps: async (sessionId: number): Promise<SessionStep[]> => {
            const response = await apiClient.get<SessionStep[]>(
                `admin/content/guided-sessions/${sessionId}/steps/`,
            );
            return response.data;
        },

        createStep: async (
            sessionId: number,
            data: Partial<SessionStep>,
        ): Promise<SessionStep> => {
            const response = await apiClient.post<SessionStep>(
                `admin/content/guided-sessions/${sessionId}/steps/`,
                data,
            );
            return response.data;
        },

        updateStep: async (
            sessionId: number,
            stepId: number,
            data: Partial<SessionStep>,
        ): Promise<SessionStep> => {
            const response = await apiClient.put<SessionStep>(
                `admin/content/guided-sessions/${sessionId}/steps/${stepId}/`,
                data,
            );
            return response.data;
        },

        deleteStep: async (sessionId: number, stepId: number): Promise<void> => {
            await apiClient.delete(
                `admin/content/guided-sessions/${sessionId}/steps/${stepId}/`,
            );
        },

        reorderSteps: async (
            sessionId: number,
            data: ReorderStepsRequest,
        ): Promise<void> => {
            await apiClient.patch(
                `admin/content/guided-sessions/${sessionId}/steps/reorder/`,
                data,
            );
        },
    },

    // ── Environment Sounds ──────────────────────────────────────────────

    envSounds: {
        list: async (
            params?: EnvSoundListParams,
        ): Promise<PaginatedResponse<AdminEnvironmentSound>> => {
            const response = await apiClient.get<PaginatedResponse<AdminEnvironmentSound>>(
                CONTENT_ENDPOINTS["env-sounds"],
                { params },
            );
            return response.data;
        },

        get: async (id: number): Promise<AdminEnvironmentSound> => {
            const response = await apiClient.get<AdminEnvironmentSound>(
                `admin/content/env-sounds/${id}/`,
            );
            return response.data;
        },

        create: async (
            data: Partial<AdminEnvironmentSound>,
        ): Promise<AdminEnvironmentSound> => {
            const response = await apiClient.post<AdminEnvironmentSound>(
                CONTENT_ENDPOINTS["env-sounds"],
                data,
            );
            return response.data;
        },

        update: async (
            id: number,
            data: Partial<AdminEnvironmentSound>,
        ): Promise<AdminEnvironmentSound> => {
            const response = await apiClient.patch<AdminEnvironmentSound>(
                `admin/content/env-sounds/${id}/`,
                data,
            );
            return response.data;
        },

        delete: async (id: number): Promise<void> => {
            await apiClient.delete(`admin/content/env-sounds/${id}/`);
        },

        // Layers sub-resource
        getLayers: async (soundId: number): Promise<SoundLayer[]> => {
            const response = await apiClient.get<SoundLayer[]>(
                `admin/content/env-sounds/${soundId}/layers/`,
            );
            return response.data;
        },

        createLayer: async (
            soundId: number,
            data: Partial<SoundLayer>,
        ): Promise<SoundLayer> => {
            const response = await apiClient.post<SoundLayer>(
                `admin/content/env-sounds/${soundId}/layers/`,
                data,
            );
            return response.data;
        },

        deleteLayer: async (soundId: number, layerId: number): Promise<void> => {
            await apiClient.delete(
                `admin/content/env-sounds/${soundId}/layers/${layerId}/`,
            );
        },
    },

    // ── Environment Visuals ─────────────────────────────────────────────

    envVisuals: {
        list: async (
            params?: EnvVisualListParams,
        ): Promise<PaginatedResponse<AdminEnvironmentVisual>> => {
            const response = await apiClient.get<PaginatedResponse<AdminEnvironmentVisual>>(
                CONTENT_ENDPOINTS["env-visuals"],
                { params },
            );
            return response.data;
        },

        get: async (id: number): Promise<AdminEnvironmentVisual> => {
            const response = await apiClient.get<AdminEnvironmentVisual>(
                `admin/content/env-visuals/${id}/`,
            );
            return response.data;
        },

        create: async (
            data: Partial<AdminEnvironmentVisual>,
        ): Promise<AdminEnvironmentVisual> => {
            const response = await apiClient.post<AdminEnvironmentVisual>(
                CONTENT_ENDPOINTS["env-visuals"],
                data,
            );
            return response.data;
        },

        update: async (
            id: number,
            data: Partial<AdminEnvironmentVisual>,
        ): Promise<AdminEnvironmentVisual> => {
            const response = await apiClient.patch<AdminEnvironmentVisual>(
                `admin/content/env-visuals/${id}/`,
                data,
            );
            return response.data;
        },

        delete: async (id: number): Promise<void> => {
            await apiClient.delete(`admin/content/env-visuals/${id}/`);
        },
    },

    // ── Categories ──────────────────────────────────────────────────────

    categories: {
        list: async (params?: ContentListParams): Promise<PaginatedResponse<AdminCategory>> => {
            const response = await apiClient.get<PaginatedResponse<AdminCategory>>(
                "admin/content/categories/",
                { params },
            );
            return response.data;
        },

        get: async (id: number): Promise<AdminCategory> => {
            const response = await apiClient.get<AdminCategory>(
                `admin/content/categories/${id}/`,
            );
            return response.data;
        },

        create: async (data: { name: string; language?: string }): Promise<AdminCategory> => {
            const response = await apiClient.post<AdminCategory>(
                "admin/content/categories/",
                data,
            );
            return response.data;
        },

        update: async (
            id: number,
            data: { name: string; language?: string },
        ): Promise<AdminCategory> => {
            const response = await apiClient.put<AdminCategory>(
                `admin/content/categories/${id}/`,
                data,
            );
            return response.data;
        },

        delete: async (id: number): Promise<void> => {
            await apiClient.delete(`admin/content/categories/${id}/`);
        },
    },
};

export default contentApi;
