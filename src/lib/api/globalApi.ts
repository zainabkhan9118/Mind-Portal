import apiClient from "./axiosInstance";
import type {
    AdminProfile,
    HealthStatus,
    TaskResult,
    ExportTaskResponse,
} from "./types";

/**
 * Cross-Cutting / Global API
 *
 * Endpoints:
 *   GET  me/                        — current admin profile + permissions
 *   GET  health/                    — system health (db, redis, celery)
 *   GET  tasks/{task_id}/           — async task status (for CSV exports)
 *   GET  tasks/{task_id}/download/  — download completed export file
 */
const globalApi = {
    /** Returns the logged-in admin's profile (name, email, role, permissions). */
    getMe: async (): Promise<AdminProfile> => {
        const response = await apiClient.get<AdminProfile>("admin/me/");
        return response.data;
    },

    /** Partially update the logged-in admin's profile. */
    updateMe: async (data: { first_name?: string; last_name?: string }): Promise<AdminProfile> => {
        const response = await apiClient.patch<AdminProfile>("admin/me/", data);
        return response.data;
    },

    /** Returns system health: database, redis, celery status. */
    getHealth: async (): Promise<HealthStatus> => {
        const response = await apiClient.get<HealthStatus>("admin/health/");
        return response.data;
    },

    // ── Async Task Polling (for CSV exports) ────────────────────────────
    /** Check the status of an async export task. */
    getTaskStatus: async (taskId: string): Promise<TaskResult> => {
        const response = await apiClient.get<TaskResult>(`admin/tasks/${taskId}/`);
        return response.data;
    },

    /** Get download URL for a completed export. */
    getTaskDownloadUrl: (taskId: string): string =>
        `${apiClient.defaults.baseURL}/admin/tasks/${taskId}/download/`,

    /**
     * Poll an async export task until it completes or fails.
     * Returns the final TaskResult.
     */
    pollTask: async (
        taskId: string,
        intervalMs = 2500,
        maxAttempts = 60,
    ): Promise<TaskResult> => {
        let attempts = 0;
        return new Promise((resolve, reject) => {
            const poll = async () => {
                try {
                    attempts++;
                    const result = await globalApi.getTaskStatus(taskId);

                    if (result.status === "SUCCESS" || result.status === "FAILURE") {
                        resolve(result);
                        return;
                    }

                    if (attempts >= maxAttempts) {
                        reject(new Error("Export task polling timed out."));
                        return;
                    }

                    setTimeout(poll, intervalMs);
                } catch (error) {
                    reject(error);
                }
            };
            poll();
        });
    },

    /**
     * Trigger an export, poll for completion, then initiate browser download.
     * Accepts a function that triggers the export (returns { task_id }).
     */
    exportAndDownload: async (
        triggerExport: () => Promise<ExportTaskResponse>,
    ): Promise<void> => {
        const { task_id } = await triggerExport();
        const result = await globalApi.pollTask(task_id);

        if (result.status === "FAILURE") {
            throw new Error("Export failed. Please try again.");
        }

        // Initiate browser download
        if (typeof window !== "undefined") {
            const downloadUrl = globalApi.getTaskDownloadUrl(task_id);
            window.open(downloadUrl, "_blank");
        }
    },
};

export default globalApi;
