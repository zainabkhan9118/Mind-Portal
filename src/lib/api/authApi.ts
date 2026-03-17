import apiClient from "./axiosInstance";
import type {
    LoginRequest,
    LoginResponse,
    ForgotPasswordRequest,
    ResetPasswordRequest,
} from "./types";

/**
 * Authentication Service
 *
 * Endpoints:
 *   POST auth/login/
 *   POST auth/logout/
 *   POST auth/logout-all/
 *   POST auth/forgot-password/
 *   POST auth/reset-password/
 */
const authApi = {
    /**
     * Login with email & password.
     * Returns a Knox token + user profile.
     */
    login: async (data: LoginRequest): Promise<LoginResponse> => {
        const response = await apiClient.post<LoginResponse>("admin/auth/login/", data);

        // Persist the token for subsequent requests
        if (typeof window !== "undefined" && response.data.token) {
            localStorage.setItem("authToken", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
        }

        return response.data;
    },

    /**
     * Revokes the current token.
     */
    logout: async (): Promise<void> => {
        await apiClient.post("admin/auth/logout/");
        if (typeof window !== "undefined") {
            localStorage.removeItem("authToken");
            localStorage.removeItem("user");
        }
    },

    /**
     * Revokes all tokens for the current user.
     */
    logoutAll: async (): Promise<void> => {
        await apiClient.post("admin/auth/logout-all/");
        if (typeof window !== "undefined") {
            localStorage.removeItem("authToken");
            localStorage.removeItem("user");
        }
    },

    /**
     * Sends a password reset OTP to the given email.
     */
    forgotPassword: async (data: ForgotPasswordRequest): Promise<void> => {
        await apiClient.post("admin/auth/forgot-password/", data);
    },

    /**
     * Resets the password using the OTP.
     */
    resetPassword: async (data: ResetPasswordRequest): Promise<void> => {
        await apiClient.post("admin/auth/reset-password/", data);
    },
};

export default authApi;
