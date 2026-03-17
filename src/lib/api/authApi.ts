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
 *   POST auth/users/password-reset-otp/
 *   POST auth/users/reset-password/
 */
const authApi = {
    /**
     * Login with email & password.
     * Returns a Knox token + user profile.
     */
    login: async (data: LoginRequest): Promise<LoginResponse> => {
        const tokenResponse = await apiClient.post<{ token: string }>("auth/login/", data);
        const token = tokenResponse.data.token;

        // Persist the token so the subsequent getMe call is authenticated
        if (typeof window !== "undefined") {
            localStorage.setItem("authToken", token);
        }

        // Fetch the full admin profile
        const profileResponse = await apiClient.get<LoginResponse["user"]>("admin/me/");

        if (typeof window !== "undefined") {
            localStorage.setItem("user", JSON.stringify(profileResponse.data));
        }

        return { token, user: profileResponse.data };
    },

    /**
     * Revokes the current token.
     */
    logout: async (): Promise<void> => {
        await apiClient.post("auth/logout/");
        if (typeof window !== "undefined") {
            localStorage.removeItem("authToken");
            localStorage.removeItem("user");
        }
    },

    /**
     * Revokes all tokens for the current user.
     */
    logoutAll: async (): Promise<void> => {
        await apiClient.post("auth/logout-all/");
        if (typeof window !== "undefined") {
            localStorage.removeItem("authToken");
            localStorage.removeItem("user");
        }
    },

    /**
     * Sends a password reset OTP to the given email.
     */
    forgotPassword: async (data: ForgotPasswordRequest): Promise<void> => {
        await apiClient.post("auth/users/password-reset-otp/", data);
    },

    /**
     * Resets the password using the verified OTP.
     */
    resetPassword: async (data: ResetPasswordRequest): Promise<void> => {
        await apiClient.post("auth/users/reset-password/", data);
    },
};

export default authApi;
