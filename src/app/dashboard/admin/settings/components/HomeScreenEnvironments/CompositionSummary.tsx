import React from "react";
import { Brain, Layers, Check, Volume2, Save, Loader2, CheckCircle } from "lucide-react";
import type { AdminEnvironmentVisual, AdminEnvironmentSound } from "@/lib/api/types";

interface CompositionSummaryProps {
    selectedVisual?: AdminEnvironmentVisual;
    selectedSounds: AdminEnvironmentSound[];
    getVolume: (id: number) => number;
    isSaving: boolean;
    saveError: string | null;
    saveSuccess: boolean;
    onSave: () => void;
}

const CompositionSummary: React.FC<CompositionSummaryProps> = ({
    selectedVisual,
    selectedSounds,
    getVolume,
    isSaving,
    saveError,
    saveSuccess,
    onSave,
}) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-8 space-y-5 shadow-sm">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Create Environment</h2>
                </div>
                <span className="px-3 py-1 bg-purple-100/50 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 text-[10px] font-bold uppercase tracking-wider rounded-full">Step 3</span>
            </div>

            <div className="p-5 bg-gray-50/50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700 space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
                    <Layers className="w-4 h-4" /><span>Composition</span>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden min-h-[72px] flex items-center justify-center">
                    {selectedVisual ? (
                        <div className="relative w-full">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={selectedVisual.image} alt={selectedVisual.name} className="w-full h-20 object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <span className="absolute bottom-2 left-3 text-xs font-semibold text-white">{selectedVisual.name}</span>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400 py-3">No visual selected</p>
                    )}
                </div>
                {selectedSounds.length > 0 && (
                    <ul className="space-y-1.5">
                        {selectedSounds.map((s) => (
                            <li key={s.id} className="flex items-center gap-2">
                                <Check className="w-3 h-3 text-purple-500 shrink-0" />
                                <span className="text-xs text-gray-700 dark:text-gray-300 flex-1 truncate">{s.name}</span>
                                <div className="flex items-center gap-1 shrink-0">
                                    <Volume2 className="w-3 h-3 text-gray-400" />
                                    <span className="text-[11px] font-semibold text-purple-600 w-7 text-right">{getVolume(s.id)}%</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {saveError && <p className="text-xs text-red-500">{saveError}</p>}

            <button onClick={onSave} disabled={isSaving || !selectedVisual}
                className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60">
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" />
                    : saveSuccess ? <CheckCircle className="w-4 h-4" />
                    : <Save className="w-4 h-4" />}
                {isSaving ? "Saving…" : saveSuccess ? "Saved!" : "Save this Environment"}
            </button>
        </div>
    );
};

export default CompositionSummary;
