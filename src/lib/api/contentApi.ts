import apiClient from "./axiosInstance";
import type {
    PaginatedResponse,
    ContentListParams,
    ContentItemBase,
    MusicContent,
    GuidedSessionContent,
    EnvSoundContent,
    EnvVisualContent,
    AnyContentItem,
    ContentTypeEndpoint,
    ContentType,
    ContentStatusChangeRequest,
    BulkActionRequest,
    ContentCategory,
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

    /** Change content status (published / draft / archived). */
    changeStatus: async (
        type: ContentType,
        id: number,
        data: ContentStatusChangeRequest,
    ): Promise<void> => {
        // The API uses different type slugs: music, mind_session, env_sound, env_visual
        const typeSlug = type === "guided_session" ? "mind_session" : type;
        await apiClient.post(`admin/content/${typeSlug}/${id}/status/`, data);
    },

    /** Duplicate content – creates a draft copy, returns the new item. */
    duplicate: async (
        type: ContentType,
        id: number,
    ): Promise<AnyContentItem> => {
        const typeSlug = type === "guided_session" ? "mind_session" : type;
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
            params?: ContentListParams,
        ): Promise<PaginatedResponse<MusicContent>> => {
            const response = await apiClient.get<PaginatedResponse<MusicContent>>(
                CONTENT_ENDPOINTS.music,
                { params },
            );
            return response.data;
        },

        get: async (id: number): Promise<MusicContent> => {
            const response = await apiClient.get<MusicContent>(
                `admin/content/music/${id}/`,
            );
            return response.data;
        },

        create: async (data: Partial<MusicContent>): Promise<MusicContent> => {
            const response = await apiClient.post<MusicContent>(
                CONTENT_ENDPOINTS.music,
                data,
            );
            return response.data;
        },

        update: async (
            id: number,
            data: Partial<MusicContent>,
        ): Promise<MusicContent> => {
            const response = await apiClient.patch<MusicContent>(
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
            params?: ContentListParams,
        ): Promise<PaginatedResponse<GuidedSessionContent>> => {
            const response = await apiClient.get<
                PaginatedResponse<GuidedSessionContent>
            >(CONTENT_ENDPOINTS["guided-sessions"], { params });
            return response.data;
        },

        get: async (id: number): Promise<GuidedSessionContent> => {
            const response = await apiClient.get<GuidedSessionContent>(
                `admin/content/guided-sessions/${id}/`,
            );
            return response.data;
        },

        create: async (
            data: Partial<GuidedSessionContent>,
        ): Promise<GuidedSessionContent> => {
            const response = await apiClient.post<GuidedSessionContent>(
                CONTENT_ENDPOINTS["guided-sessions"],
                data,
            );
            return response.data;
        },

        update: async (
            id: number,
            data: Partial<GuidedSessionContent>,
        ): Promise<GuidedSessionContent> => {
            const response = await apiClient.patch<GuidedSessionContent>(
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
            await apiClient.post(
                `admin/content/guided-sessions/${sessionId}/steps/reorder/`,
                data,
            );
        },
    },

    // ── Environment Sounds ──────────────────────────────────────────────

    envSounds: {
        list: async (
            params?: ContentListParams,
        ): Promise<PaginatedResponse<EnvSoundContent>> => {
            const response = await apiClient.get<
                PaginatedResponse<EnvSoundContent>
            >(CONTENT_ENDPOINTS["env-sounds"], { params });
            return response.data;
        },

        get: async (id: number): Promise<EnvSoundContent> => {
            const response = await apiClient.get<EnvSoundContent>(
                `admin/content/env-sounds/${id}/`,
            );
            return response.data;
        },

        create: async (
            data: Partial<EnvSoundContent>,
        ): Promise<EnvSoundContent> => {
            const response = await apiClient.post<EnvSoundContent>(
                CONTENT_ENDPOINTS["env-sounds"],
                data,
            );
            return response.data;
        },

        update: async (
            id: number,
            data: Partial<EnvSoundContent>,
        ): Promise<EnvSoundContent> => {
            const response = await apiClient.patch<EnvSoundContent>(
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
            params?: ContentListParams,
        ): Promise<PaginatedResponse<EnvVisualContent>> => {
            const response = await apiClient.get<
                PaginatedResponse<EnvVisualContent>
            >(CONTENT_ENDPOINTS["env-visuals"], { params });
            return response.data;
        },

        get: async (id: number): Promise<EnvVisualContent> => {
            const response = await apiClient.get<EnvVisualContent>(
                `admin/content/env-visuals/${id}/`,
            );
            return response.data;
        },

        create: async (
            data: Partial<EnvVisualContent>,
        ): Promise<EnvVisualContent> => {
            const response = await apiClient.post<EnvVisualContent>(
                CONTENT_ENDPOINTS["env-visuals"],
                data,
            );
            return response.data;
        },

        update: async (
            id: number,
            data: Partial<EnvVisualContent>,
        ): Promise<EnvVisualContent> => {
            const response = await apiClient.patch<EnvVisualContent>(
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
        list: async (): Promise<ContentCategory[]> => {
            const response = await apiClient.get<ContentCategory[]>(
                "admin/content/categories/",
            );
            return response.data;
        },

        create: async (data: { name: string }): Promise<ContentCategory> => {
            const response = await apiClient.post<ContentCategory>(
                "admin/content/categories/",
                data,
            );
            return response.data;
        },

        update: async (
            id: number,
            data: { name: string },
        ): Promise<ContentCategory> => {
            const response = await apiClient.put<ContentCategory>(
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
