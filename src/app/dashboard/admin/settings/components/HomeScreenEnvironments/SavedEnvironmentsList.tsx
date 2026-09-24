import React from "react";
import { Monitor, Trash2, Save, Loader2, CheckCircle } from "lucide-react";
import type { SavedEnvironment } from "./types";

interface SavedEnvironmentsListProps {
    environments: SavedEnvironment[];
    activeEnvIds: Set<number>;
    onToggleActive: (id: number) => void;
    onDelete: (id: number) => void;
    isSavingActive: boolean;
    saveActiveError: string | null;
    saveActiveSuccess: boolean;
    onSaveActive: () => void;
}

const SavedEnvironmentsList: React.FC<SavedEnvironmentsListProps> = ({
    environments,
    activeEnvIds,
    onToggleActive,
    onDelete,
    isSavingActive,
    saveActiveError,
    saveActiveSuccess,
    onSaveActive,
}) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-8 space-y-5 shadow-sm">
            <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-700 pb-4">
                <Monitor className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Your Screen Environments</h2>
            </div>

            {environments.length === 0 ? (
                <div className="py-8 text-center">
                    <p className="text-sm text-gray-400">No environments saved yet.</p>
                    <p className="text-xs text-gray-400 mt-1">Create one above and click &quot;Save this Environment&quot;.</p>
                </div>
            ) : (
                <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                    {environments.map((env) => (
                        <div key={env.id}
                            className={`rounded-2xl border transition-all overflow-hidden ${activeEnvIds.has(env.id) ? "border-purple-300 dark:border-purple-600 bg-purple-50/30 dark:bg-purple-900/10" : "border-gray-100 dark:border-gray-700"}`}>
                            <div className="flex items-center gap-3 p-3">
                                <input type="checkbox" checked={activeEnvIds.has(env.id)} onChange={() => onToggleActive(env.id)}
                                    className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-purple-600 focus:ring-purple-600 cursor-pointer shrink-0" />
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={env.visual.image} alt={env.visual.name} className="w-14 h-9 rounded-xl object-cover shadow-sm shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{env.visual.name}</p>
                                    {env.sounds.length > 0 && (
                                        <p className="text-[11px] text-gray-400 truncate">
                                            {env.sounds.map((s) => `${s.sound.name} (${s.volume}%)`).join(" · ")}
                                        </p>
                                    )}
                                </div>
                                <button onClick={() => onDelete(env.id)}
                                    className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all shrink-0">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {saveActiveError && <p className="text-xs text-red-500">{saveActiveError}</p>}

            <button
                onClick={onSaveActive}
                disabled={isSavingActive || environments.length === 0}
                className={`w-full py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 text-white ${
                    saveActiveSuccess
                        ? "bg-green-500"
                        : "bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-500/20"
                }`}>
                {isSavingActive ? <Loader2 className="w-4 h-4 animate-spin" />
                    : saveActiveSuccess ? <CheckCircle className="w-4 h-4" />
                    : <Save className="w-4 h-4" />}
                {isSavingActive ? "Saving…"
                    : saveActiveSuccess ? "Home Screen Updated!"
                    : `Save Home Screen Environments${activeEnvIds.size > 0 ? ` (${activeEnvIds.size})` : ""}`}
            </button>
        </div>
    );
};

export default SavedEnvironmentsList;
