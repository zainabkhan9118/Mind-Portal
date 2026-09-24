import type { AdminEnvironmentVisual, AdminEnvironmentSound } from "@/lib/api/types";

export interface SavedEnvironment {
    id: number;
    visual: AdminEnvironmentVisual;
    sounds: Array<{ sound: AdminEnvironmentSound; volume: number }>;
}
