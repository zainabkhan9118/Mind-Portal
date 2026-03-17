"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, ReactNode } from "react";

/**
 * Wraps any route that requires authentication.
 * If the user is not authenticated, they are redirected to /signin.
 * Shows a loading spinner while checking auth state.
 */
export default function ProtectedRoute({ children }: { children: ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Wait until auth has finished loading before deciding
        if (!isLoading && !isAuthenticated) {
            // Save the intended destination so we can redirect back after login
            if (typeof window !== "undefined") {
                sessionStorage.setItem("redirectAfterLogin", pathname);
            }
            router.replace("/signin");
        }
    }, [isAuthenticated, isLoading, router, pathname]);

    // Still loading — show a full-screen spinner
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
                    <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
                        Verifying session…
                    </p>
                </div>
            </div>
        );
    }

    // Not authenticated — render nothing while redirect happens
    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
}
