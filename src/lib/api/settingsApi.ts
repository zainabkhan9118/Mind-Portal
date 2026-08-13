import apiClient from "./axiosInstance";
import type {
    PaginatedResponse,
    PaginationParams,
    SettingsCategory,
    SettingsKeyValue,
    StorageUsage,
    NotificationTemplate,
    CreateNotificationTemplateRequest,
    TestTemplateRequest,
    SendNotificationRequest,
    SendNotificationResponse,
    AdminAccount,
    CreateAdminRequest,
    UpdateAdminRequest,
    Role,
    CreateRoleRequest,
    AuditLogEntry,
    AuditLogParams,
    AppVersions,
} from "./types";

/**
 * Settings API Service
 *
 * Platform settings (general, appearance, media, notifications),
 * storage usage, notification templates, admin accounts, roles, audit log.
 */
const settingsApi = {
    // ── Platform Settings (Key-Value) ───────────────────────────────────

    /** Get settings for a category. */
    getSettings: async (category: SettingsCategory): Promise<SettingsKeyValue> => {
        const response = await apiClient.get<SettingsKeyValue>(
            `admin/settings/${category}/`,
        );
        return response.data;
    },

    /** Update settings for a category. */
    updateSettings: async (
        category: SettingsCategory,
        data: SettingsKeyValue,
    ): Promise<SettingsKeyValue> => {
        const response = await apiClient.put<SettingsKeyValue>(
            `admin/settings/${category}/`,
            data,
        );
        return response.data;
    },

    /** Get current app version strings (mobile, VR, API). */
    getAppVersions: async (): Promise<AppVersions> => {
        const response = await apiClient.get<AppVersions>("admin/settings/app-versions/");
        return response.data;
    },

    // ── Storage Usage ───────────────────────────────────────────────────

    /** Storage usage per content type. */
    getStorageUsage: async (): Promise<StorageUsage> => {
        const response = await apiClient.get<StorageUsage>(
            "admin/settings/media/usage/",
        );
        return response.data;
    },

    // ── Notification Templates ──────────────────────────────────────────

    /** Paginated notification template list. */
    getTemplates: async (
        params?: PaginationParams,
    ): Promise<PaginatedResponse<NotificationTemplate>> => {
        const response = await apiClient.get<
            PaginatedResponse<NotificationTemplate>
        >("admin/settings/notifications/templates/", { params });
        return response.data;
    },

    /** Create a notification template. */
    createTemplate: async (
        data: CreateNotificationTemplateRequest,
    ): Promise<NotificationTemplate> => {
        const response = await apiClient.post<NotificationTemplate>(
            "admin/settings/notifications/templates/",
            data,
        );
        return response.data;
    },

    /** Update a notification template. */
    updateTemplate: async (
        id: number,
        data: Partial<NotificationTemplate>,
    ): Promise<NotificationTemplate> => {
        const response = await apiClient.put<NotificationTemplate>(
            `admin/settings/notifications/templates/${id}/`,
            data,
        );
        return response.data;
    },

    /** Send a test notification from a template. */
    testTemplate: async (data: TestTemplateRequest): Promise<unknown> => {
        const response = await apiClient.post("admin/settings/notifications/test/", data);
        return response.data;
    },

    /** Send a push notification to a target group. */
    sendNotification: async (data: SendNotificationRequest): Promise<SendNotificationResponse> => {
        const response = await apiClient.post<SendNotificationResponse>("admin/settings/notifications/send/", data);
        return response.data;
    },

    // ── Admin Account Management ────────────────────────────────────────

    /** Paginated list of admin/staff users. */
    getAdmins: async (
        params?: PaginationParams,
    ): Promise<PaginatedResponse<AdminAccount>> => {
        const response = await apiClient.get<PaginatedResponse<AdminAccount>>(
            "admin/settings/admins/",
            { params },
        );
        return response.data;
    },

    /** Create a new admin account. */
    createAdmin: async (data: CreateAdminRequest): Promise<AdminAccount> => {
        const response = await apiClient.post<AdminAccount>(
            "admin/settings/admins/",
            data,
        );
        return response.data;
    },

    /** Update an admin account. */
    updateAdmin: async (
        id: number,
        data: UpdateAdminRequest,
    ): Promise<AdminAccount> => {
        const response = await apiClient.put<AdminAccount>(
            `admin/settings/admins/${id}/`,
            data,
        );
        return response.data;
    },

    /** Deactivate an admin (cannot deactivate yourself). */
    deactivateAdmin: async (id: number): Promise<void> => {
        await apiClient.delete(`admin/settings/admins/${id}/`);
    },

    // ── Role Management ─────────────────────────────────────────────────

    /** List all roles with permissions and member counts. */
    getRoles: async (): Promise<Role[]> => {
        const response = await apiClient.get<unknown>(
            "admin/settings/roles/",
        );
        const data = response.data;
        if (Array.isArray(data)) return data as Role[];
        const paginated = data as { results?: Role[] };
        return paginated?.results ?? [];
    },

    /** Create a new role. */
    createRole: async (data: CreateRoleRequest): Promise<Role> => {
        const response = await apiClient.post<Role>("admin/settings/roles/", data);
        return response.data;
    },

    /** Update a role. */
    updateRole: async (id: number, data: CreateRoleRequest): Promise<Role> => {
        const response = await apiClient.put<Role>(
            `admin/settings/roles/${id}/`,
            data,
        );
        return response.data;
    },

    // ── Audit Log ───────────────────────────────────────────────────────

    /** Paginated audit log table. */
    getAuditLog: async (
        params?: AuditLogParams,
    ): Promise<PaginatedResponse<AuditLogEntry>> => {
        const response = await apiClient.get<PaginatedResponse<AuditLogEntry>>(
            "admin/settings/audit-log/",
            { params },
        );
        return response.data;
    },
};

export default settingsApi;
