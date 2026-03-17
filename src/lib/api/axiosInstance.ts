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
});

// ── Request Interceptor ────────────────────────────────────────────────
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token =
            typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
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
