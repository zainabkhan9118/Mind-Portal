"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { globalApi } from "@/lib/api";
import type { AdminProfile, DashboardPermission } from "@/lib/api";

interface PermissionsContextType {
    profile: AdminProfile | null;
    permissions: string[];
    loading: boolean;
    error: string | null;
    hasPermission: (permission: DashboardPermission | string) => boolean;
    hasAnyPermission: (permissions: (DashboardPermission | string)[]) => boolean;
    hasAllPermissions: (permissions: (DashboardPermission | string)[]) => boolean;
    refetch: () => Promise<void>;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

export const PermissionsProvider = ({ children }: { children: ReactNode }) => {
    const [profile, setProfile] = useState<AdminProfile | null>(null);
    const [permissions, setPermissions] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProfile = useCallback(async () => {
        // Only fetch if we have a token
        const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
        if (!token) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const data = await globalApi.getMe();
            setProfile(data);
            setPermissions(data.permissions || []);
        } catch (err) {
            console.error("Failed to fetch admin profile:", err);
            setError("Failed to load permissions");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const hasPermission = useCallback(
        (permission: DashboardPermission | string) => permissions.includes(permission),
        [permissions],
    );

    const hasAnyPermission = useCallback(
        (perms: (DashboardPermission | string)[]) => perms.some((p) => permissions.includes(p)),
        [permissions],
    );

    const hasAllPermissions = useCallback(
        (perms: (DashboardPermission | string)[]) => perms.every((p) => permissions.includes(p)),
        [permissions],
    );

    return (
        <PermissionsContext.Provider
            value={{
                profile,
                permissions,
                loading,
                error,
                hasPermission,
                hasAnyPermission,
                hasAllPermissions,
                refetch: fetchProfile,
            }}
        >
            {children}
        </PermissionsContext.Provider>
    );
};

export const usePermissions = (): PermissionsContextType => {
    const context = useContext(PermissionsContext);
    if (context === undefined) {
        throw new Error("usePermissions must be used within a PermissionsProvider");
    }
    return context;
};
