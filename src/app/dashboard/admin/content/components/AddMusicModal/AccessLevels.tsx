import React, { useEffect, useState } from "react";
import Link from "next/link";
import Radio from "@/components/form/input/Radio";
import accessLevelsApi from "@/lib/api/accessLevelsApi";
import type { AccessLevel } from "@/lib/api/types";

interface AccessLevelsProps {
    /** "free" | "premium" | "exclusive" */
    accessLevel: string;
    onAccessLevelChange: (v: string) => void;
    /** Custom access level ids — used when accessLevel is "exclusive". */
    exclusiveLevels: number[];
    onExclusiveLevelsChange: (ids: number[]) => void;
}

const AccessLevels: React.FC<AccessLevelsProps> = ({ accessLevel, onAccessLevelChange, exclusiveLevels, onExclusiveLevelsChange }) => {
    const [levels, setLevels] = useState<AccessLevel[]>([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        accessLevelsApi.listAll()
            .then(setLevels)
            .catch(err => console.error("Failed to load access levels:", err))
            .finally(() => setLoaded(true));
    }, []);

    const toggle = (id: number) =>
        onExclusiveLevelsChange(exclusiveLevels.includes(id) ? exclusiveLevels.filter(x => x !== id) : [...exclusiveLevels, id]);

    // Keep showing levels already assigned to this item even if they're inactive now
    const shown = levels.filter(l => l.is_active !== false || exclusiveLevels.includes(l.id));

    return (
        <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Access Levels
            </h3>
            <div className="flex flex-wrap gap-4">
                <Radio
                    id="access-free"
                    name="accessLevel"
                    value="free"
                    label="Free"
                    checked={accessLevel === "free"}
                    onChange={onAccessLevelChange}
                />
                <Radio
                    id="access-premium"
                    name="accessLevel"
                    value="premium"
                    label="Premium"
                    checked={accessLevel === "premium"}
                    onChange={onAccessLevelChange}
                />
                <Radio
                    id="access-exclusive"
                    name="accessLevel"
                    value="exclusive"
                    label="Exclusive to client"
                    checked={accessLevel === "exclusive"}
                    onChange={onAccessLevelChange}
                />
            </div>

            {accessLevel === "exclusive" && (
                <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-3 space-y-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Only members of the selected access levels will see this content in the app.
                    </p>
                    {!loaded ? (
                        <p className="text-sm text-gray-400">Loading access levels…</p>
                    ) : shown.length === 0 ? (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            No custom access levels yet.{" "}
                            <Link href="/dashboard/admin/settings?tab=access-levels" className="text-purple-600 hover:underline">
                                Create one in Admin Control
                            </Link>
                        </p>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {shown.map(l => {
                                const on = exclusiveLevels.includes(l.id);
                                return (
                                    <button
                                        key={l.id}
                                        type="button"
                                        onClick={() => toggle(l.id)}
                                        className={`px-3 py-1.5 rounded-full border text-sm transition-colors ${on
                                            ? "bg-purple-600 border-purple-600 text-white"
                                            : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                                    >
                                        {l.name}{l.is_active === false ? " (inactive)" : ""}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AccessLevels;
