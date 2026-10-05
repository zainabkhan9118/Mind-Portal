import { useEffect, useState } from "react";
import { contentApi, apiClient } from "@/lib/api";
import type { AdminEnvironmentVisual, AdminEnvironmentSound } from "@/lib/api/types";
import type { SavedEnvironment } from "./types";
import { DEFAULT_VOLUME } from "./constants";
import { HOME_SCREEN_ONLY_TAG } from "@/lib/contentTags";

type RawApiEnvironment = {
    id: number;
    env_visuals: { id: number; name: string; visual_file: string; image: string }[];
    env_sounds: { id: number; name: string; audio_clip: string; image: string }[];
    is_active: boolean;
    created_at: string;
};

/** Loads the visual/sound libraries, the goals needed for uploads, and any
 * previously-saved Home Screen environments. */
export function useHomeScreenEnvironmentsData() {
    const [envVisuals, setEnvVisuals] = useState<AdminEnvironmentVisual[]>([]);
    const [envSounds, setEnvSounds] = useState<AdminEnvironmentSound[]>([]);
    const [loadingVisuals, setLoadingVisuals] = useState(true);
    const [loadingSounds, setLoadingSounds] = useState(true);
    const [goalIds, setGoalIds] = useState<number[]>([]);
    const [savedEnvironments, setSavedEnvironments] = useState<SavedEnvironment[]>([]);
    const [activeEnvIds, setActiveEnvIds] = useState<Set<number>>(new Set());

    useEffect(() => {
        // Only the Home Screen Environments composer's own quick-uploads should be
        // pickable here — Content Management's curated library is a separate pool and
        // shouldn't surface in this picker. See src/lib/contentTags.ts.
        // Fetching a larger page here (rather than the old size: 20) since we're now
        // filtering client-side — a small page could miss tagged items sitting further
        // back in an untagged majority.
        contentApi.envVisuals
            .list({ status: "published", size: 100 })
            .then((res) => setEnvVisuals((res.results ?? []).filter((v) => v.tags?.includes(HOME_SCREEN_ONLY_TAG))))
            .catch(() => {})
            .finally(() => setLoadingVisuals(false));

        contentApi.envSounds
            .list({ status: "published", size: 20 })
            .then((res) => setEnvSounds(res.results ?? []))
            .catch(() => {})
            .finally(() => setLoadingSounds(false));

        // Fetch goals so uploads can include the required goals[] field
        apiClient.get<{ results?: { id: number }[] } | { id: number }[]>("explore/goals/", { params: { size: 100 } })
            .then((res) => {
                const data = res.data;
                const items = Array.isArray(data) ? data : (data.results ?? []);
                setGoalIds(items.map((g) => g.id));
            })
            .catch(() => {});

        // Try to load previously saved environments
        apiClient.get("explore/home-screen-environments/")
            .then((res) => {
                const raw: RawApiEnvironment[] = Array.isArray(res.data)
                    ? res.data
                    : (res.data as { results?: RawApiEnvironment[] }).results ?? [];

                const mapped: SavedEnvironment[] = raw
                    .filter((e) => e.env_visuals?.length > 0)
                    .map((e) => ({
                        id: e.id,
                        visual: e.env_visuals[0] as unknown as AdminEnvironmentVisual,
                        sounds: (e.env_sounds ?? []).map((s) => ({
                            sound: s as unknown as AdminEnvironmentSound,
                            volume: DEFAULT_VOLUME,
                        })),
                    }));

                setSavedEnvironments(mapped);
                const activeIds = raw.filter((e) => e.is_active).map((e) => e.id);
                if (activeIds.length > 0) setActiveEnvIds(new Set(activeIds));
            })
            .catch(() => {}); // endpoint may not exist yet
    }, []);

    return {
        envVisuals, setEnvVisuals,
        envSounds, setEnvSounds,
        loadingVisuals, loadingSounds,
        goalIds,
        savedEnvironments, setSavedEnvironments,
        activeEnvIds, setActiveEnvIds,
    };
}
