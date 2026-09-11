import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";

/**
 * Dashboard API Axios Instance
 *
 * Base URL: https://d-api.mindplayer.com/api/v1/
 * Auth: Knox Bearer token — Authorization: Bearer <token>
 * API Specs: Swagger docs at https://d-api.mindplayer.com/docs/
 */

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://d-api.mindplayer.com";

const DASHBOARD_BASE = `${API_BASE_URL}/api/v1/`;

const apiClient: AxiosInstance = axios.create({
    baseURL: DASHBOARD_BASE,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    timeout: 30000,
    // Axios's default array serialization uses bracket notation (`content_type[]=music`),
    // which this Django/DRF backend does not recognize as a query param at all — it expects
    // the plain repeated-key form (`content_type=music&content_type=env_sound`). `indexes: null`
    // is axios's option for that exact format. Without this, every array-valued GET param
    // (content_type, goal_ids, etc.) is silently ignored by the backend.
    paramsSerializer: { indexes: null },
});

// ── Request Interceptor ────────────────────────────────────────────────
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token =
            typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        // Let the browser set Content-Type automatically for FormData
        // (it needs to include the multipart boundary)
        if (config.data instanceof FormData) {
            delete config.headers["Content-Type"];
        }
        return config;
    },
    (error) => Promise.reject(error),
);

// ── Response Interceptor ───────────────────────────────────────────────
apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            if (
                typeof window !== "undefined" &&
                !window.location.pathname.includes("/signin")
            ) {
                localStorage.removeItem("authToken");
                localStorage.removeItem("user");
                window.location.href = "/signin";
            }
        }
        return Promise.reject(error);
    },
);

export default apiClient;
export { API_BASE_URL, DASHBOARD_BASE };
