"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authApi } from "@/lib/api";
import type { AdminProfile } from "@/lib/api";

// ── Types ────────────────────────────────────────────────────────────────
interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  first_name?: string;
  last_name?: string;
  permissions?: string[];
}

interface AuthContextType {
  user: User | null;
  signin: (email: string, password: string) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  signout: () => Promise<void>;
  updateProfile: (data: { first_name?: string; last_name?: string }) => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  getRedirectPath: () => string;
}

interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
}

// ── Dashboard paths per role ─────────────────────────────────────────────
const ROLE_DASHBOARD_PATHS: Record<string, string> = {
  admin: "/dashboard/admin",
  default: "/dashboard",
};



// ── Helper: convert AdminProfile/login response to User ──────────────────
function profileToUser(profile: AdminProfile): User {
  return {
    id: profile.id,
    email: profile.email,
    name: `${profile.first_name} ${profile.last_name}`.trim() || profile.email,
    role: profile.role?.toLowerCase() ?? "admin",
    first_name: profile.first_name,
    last_name: profile.last_name,
    permissions: profile.permissions,
  };
}

// ── Context ──────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Hydrate and verify from API on mount
  useEffect(() => {
    async function restoreSession() {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        // Import dynamic to avoid circular dependencies if any
        const { globalApi } = await import("@/lib/api");
        const profile = await globalApi.getMe();
        const userObj = profileToUser(profile);
        setUser(userObj);
        localStorage.setItem("user", JSON.stringify(userObj));
      } catch (err) {
        console.warn("Session verification failed:", err);
        // If it's a 401/403, we should clear local storage
        // axios interceptor might handle the redirect, but we clear state here
        localStorage.removeItem("user");
        localStorage.removeItem("authToken");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, []);

  // Role-based redirect path
  const getRedirectPath = () => {
    if (!user) return "/signin";
    const normalizedRole = user.role.toLowerCase();
    return ROLE_DASHBOARD_PATHS[normalizedRole] || ROLE_DASHBOARD_PATHS.default;
  };

  // ── Sign In ────────────────────────────────────────────────────────
  const signin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      // Try the login
      const { user: apiUser } = await authApi.login({ email, password });

      // authApi.login already stores the token/user in localStorage via axiosInstance interceptor/authApi logic
      const userObj = profileToUser(apiUser);
      setUser(userObj);
      localStorage.setItem("user", JSON.stringify(userObj));
      console.log("Signed in via API:", userObj);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
      console.error("Signin error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Sign Up (kept for backward compatibility) ──────────────────────
  // ── Sign Up ────────────────────────────────────────────────────────
  const signup = async (userData: SignupData) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
          name: `${userData.firstName} ${userData.lastName}`,
          role: userData.role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Automatically sign in the user if the API returns enough info
      // Or just signal success. Here we'll treat it as a success and the form can redirect.
      console.log("Signup success:", data);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
      throw err; // Re-throw so the form can handle it
    } finally {
      setIsLoading(false);
    }
  };

  // ── Update Profile ─────────────────────────────────────────────────
  const updateProfile = async (data: { first_name?: string; last_name?: string }) => {
    const { globalApi } = await import("@/lib/api");
    const profile = await globalApi.updateMe(data);
    const updated = profileToUser(profile);
    setUser(updated);
    localStorage.setItem("user", JSON.stringify(updated));
  };

  // ── Sign Out ───────────────────────────────────────────────────────
  const signout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Even if the API call fails, clear local state
    }
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        signin,
        signup,
        signout,
        updateProfile,
        isAuthenticated,
        isLoading,
        error,
        getRedirectPath,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};