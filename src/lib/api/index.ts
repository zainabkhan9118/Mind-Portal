/**
 * Dashboard API — Barrel Export
 *
 * Import everything from this single entry point:
 *   import { authApi, usersApi, contentApi, ... } from "@/lib/api";
 *   import type { ApiUser, PaginatedResponse, ... } from "@/lib/api";
 */

export { default as apiClient } from "./axiosInstance";
export { default as authApi } from "./authApi";
export { default as globalApi } from "./globalApi";
export { default as usersApi } from "./usersApi";
export { default as contentApi } from "./contentApi";
export { default as analyticsApi } from "./analyticsApi";
export { default as monetizationApi } from "./monetizationApi";
export { default as communityApi } from "./communityApi";
export { default as settingsApi } from "./settingsApi";

// Re-export all types
export * from "./types";
