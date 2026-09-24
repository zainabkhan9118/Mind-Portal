import React, { useRef } from "react";
import { Volume2, VolumeX, Music, Pause, Play, Trash2, Plus, Loader2 } from "lucide-react";
import type { AdminEnvironmentSound } from "@/lib/api/types";
import { DEFAULT_VOLUME } from "./constants";

interface SoundPickerProps {
    sounds: AdminEnvironmentSound[];
    selectedSoundIds: number[];
    playingSoundIds: Set<number>;
    getVolume: (id: number) => number;
    isLoading: boolean;
    isUploading: boolean;
    uploadError: string | null;
    onToggleSound: (sound: AdminEnvironmentSound) => void;
    onTogglePlayPause: (sound: AdminEnvironmentSound) => void;
    onVolumeChange: (id: number, volume: number) => void;
    onDeleteRequest: (id: number) => void;
    onUploadAudioFile: (file: File) => void;
}

const SoundPicker: React.FC<SoundPickerProps> = ({
    sounds,
    selectedSoundIds,
    playingSoundIds,
    getVolume,
    isLoading,
    isUploading,
    uploadError,
    onToggleSound,
    onTogglePlayPause,
    onVolumeChange,
    onDeleteRequest,
    onUploadAudioFile,
}) => {
    const soundAudioPickerRef = useRef<HTMLInputElement>(null);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                        <Volume2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Select Ambient Sounds</h2>
                </div>
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 text-[10px] font-bold uppercase tracking-wider rounded-full">Step 2</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Select sounds to preview live. Adjust each volume to set the mix.</p>

            {isLoading ? (
                <div className="flex items-center justify-center py-12 text-gray-400 gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" /><span className="text-sm">Loading…</span>
                </div>
            ) : (
                <div className="space-y-3 pt-2 max-h-[420px] overflow-y-auto pr-1">
                    {sounds.map((sound) => {
                        const isSelected = selectedSoundIds.includes(sound.id);
                        const isPlaying = playingSoundIds.has(sound.id);
                        const volume = getVolume(sound.id);
                        return (
                            <div key={sound.id} className={`rounded-2xl border transition-all duration-200 overflow-hidden ${isSelected ? "border-purple-200 dark:border-purple-700 bg-purple-50/50 dark:bg-purple-900/10" : "border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800"}`}>
                                <div className="flex items-center gap-3 px-4 py-3">
                                    <input type="checkbox" checked={isSelected} onChange={() => onToggleSound(sound)}
                                        className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-purple-600 focus:ring-purple-600 cursor-pointer shrink-0" />
                                    <div className={`p-2 rounded-xl shrink-0 ${isSelected ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600" : "bg-gray-100 dark:bg-gray-700 text-gray-400"}`}>
                                        <Music className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{sound.name}</p>
                                        <p className="text-xs text-gray-400 capitalize truncate">{sound.environment_sound_type ?? "Ambient"}</p>
                                    </div>
                                    {isSelected && (
                                        <button onClick={() => onTogglePlayPause(sound)}
                                            className="p-1.5 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-800/50 text-purple-600 dark:text-purple-400 transition-colors shrink-0">
                                            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                        </button>
                                    )}
                                    <button onClick={() => onDeleteRequest(sound.id)}
                                        title="Delete sound"
                                        className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all shrink-0">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                {isSelected && (
                                    <div className="px-4 pb-3 space-y-1.5">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => onVolumeChange(sound.id, volume === 0 ? DEFAULT_VOLUME : 0)}
                                                className="shrink-0 text-gray-400 hover:text-purple-600 transition-colors">
                                                {volume === 0 ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                                            </button>
                                            <input type="range" min={0} max={100} step={1} value={volume}
                                                onChange={(e) => onVolumeChange(sound.id, Number(e.target.value))}
                                                className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer accent-purple-600"
                                                style={{ background: `linear-gradient(to right, #9810FA ${volume}%, #E5E7EB ${volume}%)` }} />
                                            <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 w-8 text-right shrink-0">{volume}%</span>
                                        </div>
                                        {isPlaying && (
                                            <div className="flex items-center gap-1 pl-5">
                                                {[3, 5, 4, 6, 3].map((h, i) => (
                                                    <div key={i} className="w-0.5 bg-purple-500 rounded-full animate-pulse"
                                                        style={{ height: `${h * 2}px`, animationDelay: `${i * 120}ms`, animationDuration: "800ms" }} />
                                                ))}
                                                <span className="text-[10px] text-purple-500 font-medium ml-1">Playing</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            <div className="space-y-2 pt-2">
                <button onClick={() => soundAudioPickerRef.current?.click()} disabled={isUploading}
                    className="w-full py-4 px-6 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-purple-600 hover:bg-purple-50/50 dark:hover:bg-purple-900/10 transition-all flex items-center justify-center gap-3 group disabled:opacity-50">
                    <div className="p-1.5 bg-gray-900 dark:bg-gray-700 rounded-lg text-white">
                        {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    </div>
                    <span className="text-sm font-bold text-gray-500 group-hover:text-purple-600">
                        {isUploading ? "Uploading…" : "Add New Sound"}
                    </span>
                </button>
                <input ref={soundAudioPickerRef} type="file" accept="audio/*" className="hidden"
                    onChange={(e) => {
                        const f = e.target.files?.[0];
                        e.target.value = "";
                        if (f) onUploadAudioFile(f);
                    }} />
                {uploadError && <p className="text-xs text-red-500">{uploadError}</p>}
            </div>
        </div>
    );
};

export default SoundPicker;
