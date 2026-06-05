"use client";
import React, { useEffect, useRef, useState } from "react";
import {
    Image as ImageIcon,
    Volume2,
    VolumeX,
    Plus,
    Save,
    Trash2,
    Check,
    Upload,
    Monitor,
    Brain,
    Layers,
    Loader2,
    Music,
    Pause,
    Play,
    CheckCircle,
} from "lucide-react";
import { contentApi, apiClient } from "@/lib/api";
import type { AdminEnvironmentVisual, AdminEnvironmentSound } from "@/lib/api/types";

const DEFAULT_VOLUME = 80;

interface SavedEnvironment {
    id: number;
    visual: AdminEnvironmentVisual;
    sounds: Array<{ sound: AdminEnvironmentSound; volume: number }>;
}

const HomeScreenEnvironments: React.FC = () => {
    // ── Library data ────────────────────────────────────────────────────
    const [envVisuals, setEnvVisuals] = useState<AdminEnvironmentVisual[]>([]);
    const [envSounds, setEnvSounds] = useState<AdminEnvironmentSound[]>([]);
    const [loadingVisuals, setLoadingVisuals] = useState(true);
    const [loadingSounds, setLoadingSounds] = useState(true);

    // ── Composer state ──────────────────────────────────────────────────
    const [selectedVisual, setSelectedVisual] = useState<number | null>(null);
    const [selectedSounds, setSelectedSounds] = useState<number[]>([]);
    const [soundVolumes, setSoundVolumes] = useState<Record<number, number>>({});
    const [playingSounds, setPlayingSounds] = useState<Set<number>>(new Set());
    const audioRefs = useRef<Record<number, HTMLAudioElement>>({});

    // ── Saved / active environments ─────────────────────────────────────
    const [savedEnvironments, setSavedEnvironments] = useState<SavedEnvironment[]>([]);
    const [activeEnvIds, setActiveEnvIds] = useState<Set<number>>(new Set());
    const [nextLocalId, setNextLocalId] = useState(-1); // negative = not yet persisted

    // ── Save / upload state ─────────────────────────────────────────────
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const [isSavingActive, setIsSavingActive] = useState(false);
    const [saveActiveError, setSaveActiveError] = useState<string | null>(null);
    const [saveActiveSuccess, setSaveActiveSuccess] = useState(false);

    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const uploadInputRef = useRef<HTMLInputElement>(null);

    const [isUploadingSound, setIsUploadingSound] = useState(false);
    const [soundUploadError, setSoundUploadError] = useState<string | null>(null);
    const soundUploadInputRef = useRef<HTMLInputElement>(null);

    // ── Cleanup audio on unmount ────────────────────────────────────────
    useEffect(() => {
        return () => {
            Object.values(audioRefs.current).forEach((a) => { a.pause(); a.src = ""; });
        };
    }, []);

    // ── Load library ────────────────────────────────────────────────────
    useEffect(() => {
        contentApi.envVisuals
            .list({ status: "published", size: 20 })
            .then((res) => setEnvVisuals(res.results ?? []))
            .catch(() => {})
            .finally(() => setLoadingVisuals(false));

        contentApi.envSounds
            .list({ status: "published", size: 20 })
            .then((res) => setEnvSounds(res.results ?? []))
            .catch(() => {})
            .finally(() => setLoadingSounds(false));

        // Try to load previously saved environments
        apiClient.get("explore/home-screen-environments/")
            .then((res) => {
                const data = res.data as { results?: SavedEnvironment[]; active_ids?: number[] } | SavedEnvironment[];
                if (Array.isArray(data)) {
                    setSavedEnvironments(data);
                } else {
                    setSavedEnvironments(data.results ?? []);
                    if (data.active_ids) setActiveEnvIds(new Set(data.active_ids));
                }
            })
            .catch(() => {}); // endpoint may not exist yet
    }, []);

    // ── Audio helpers ───────────────────────────────────────────────────
    const getVolume = (id: number) => soundVolumes[id] ?? DEFAULT_VOLUME;

    const startAudio = (sound: AdminEnvironmentSound, vol?: number) => {
        const volume = (vol ?? getVolume(sound.id)) / 100;
        let audio = audioRefs.current[sound.id];
        if (!audio) {
            audio = new Audio(sound.audio_clip);
            audio.loop = sound.is_loopable !== false;
            audioRefs.current[sound.id] = audio;
        }
        audio.volume = volume;
        audio.play().catch(() => {});
        setPlayingSounds((prev) => new Set([...prev, sound.id]));
    };

    const pauseAudio = (id: number) => {
        audioRefs.current[id]?.pause();
        setPlayingSounds((prev) => { const s = new Set(prev); s.delete(id); return s; });
    };

    const stopAndRemoveAudio = (id: number) => {
        const audio = audioRefs.current[id];
        if (audio) { audio.pause(); audio.src = ""; delete audioRefs.current[id]; }
        setPlayingSounds((prev) => { const s = new Set(prev); s.delete(id); return s; });
    };

    const toggleSound = (sound: AdminEnvironmentSound) => {
        if (selectedSounds.includes(sound.id)) {
            stopAndRemoveAudio(sound.id);
            setSelectedSounds((prev) => prev.filter((s) => s !== sound.id));
        } else {
            if (!(sound.id in soundVolumes)) {
                const dflt = sound.default_volume
                    ? Math.round(parseFloat(sound.default_volume) * 100)
                    : DEFAULT_VOLUME;
                setSoundVolumes((prev) => ({ ...prev, [sound.id]: Math.min(100, Math.max(0, dflt)) }));
            }
            setSelectedSounds((prev) => [...prev, sound.id]);
            startAudio(sound);
        }
    };

    const togglePlayPause = (sound: AdminEnvironmentSound) => {
        playingSounds.has(sound.id) ? pauseAudio(sound.id) : startAudio(sound);
    };

    const handleVolumeChange = (id: number, volume: number) => {
        setSoundVolumes((prev) => ({ ...prev, [id]: volume }));
        if (audioRefs.current[id]) audioRefs.current[id].volume = volume / 100;
    };

    // ── Uploads ─────────────────────────────────────────────────────────
    const handleVisualUpload = async (file: File) => {
        setIsUploading(true); setUploadError(null);
        const fd = new FormData();
        fd.append("name", file.name.replace(/\.[^/.]+$/, ""));
        fd.append("image", file);
        fd.append("status", "published");
        try {
            const created = await contentApi.envVisuals.create(fd);
            setEnvVisuals((prev) => [created, ...prev]);
            setSelectedVisual(created.id);
        } catch { setUploadError("Upload failed."); }
        finally { setIsUploading(false); }
    };

    const handleSoundUpload = async (file: File) => {
        setIsUploadingSound(true); setSoundUploadError(null);
        const fd = new FormData();
        fd.append("name", file.name.replace(/\.[^/.]+$/, ""));
        fd.append("audio_clip", file);
        fd.append("status", "published");
        try {
            const created = await contentApi.envSounds.create(fd);
            setEnvSounds((prev) => [created, ...prev]);
            setSoundVolumes((prev) => ({ ...prev, [created.id]: DEFAULT_VOLUME }));
            setSelectedSounds((prev) => [...prev, created.id]);
            startAudio(created, DEFAULT_VOLUME);
        } catch { setSoundUploadError("Upload failed. Please try again."); }
        finally { setIsUploadingSound(false); }
    };

    // ── Save this Environment ───────────────────────────────────────────
    const handleSave = async () => {
        if (!selectedVisual) { setSaveError("Please select a visual first."); return; }
        setIsSaving(true); setSaveError(null); setSaveSuccess(false);

        const visual = envVisuals.find((v) => v.id === selectedVisual)!;
        const sounds = envSounds
            .filter((s) => selectedSounds.includes(s.id))
            .map((s) => ({ sound: s, volume: getVolume(s.id) }));

        try {
            const res = await apiClient.post<{ id: number }>("explore/home-screen-environments/", {
                visual_id: selectedVisual,
                sound_ids: selectedSounds,
                sound_volumes: Object.fromEntries(selectedSounds.map((id) => [id, getVolume(id) / 100])),
            });
            const newEnv: SavedEnvironment = { id: res.data?.id ?? nextLocalId, visual, sounds };
            setNextLocalId((n) => n - 1);
            setSavedEnvironments((prev) => [newEnv, ...prev]);
            setSaveSuccess(true);

            // Reset composer
            selectedSounds.forEach(stopAndRemoveAudio);
            setSelectedVisual(null);
            setSelectedSounds([]);
            setSoundVolumes({});
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err: unknown) {
            const status = (err as { response?: { status?: number } })?.response?.status;
            if (status === 404) {
                // Backend not ready — store locally anyway
                const newEnv: SavedEnvironment = { id: nextLocalId, visual, sounds };
                setNextLocalId((n) => n - 1);
                setSavedEnvironments((prev) => [newEnv, ...prev]);
                setSaveSuccess(true);
                selectedSounds.forEach(stopAndRemoveAudio);
                setSelectedVisual(null);
                setSelectedSounds([]);
                setSoundVolumes({});
                setTimeout(() => setSaveSuccess(false), 3000);
            } else {
                setSaveError("Failed to save. Please try again.");
            }
        } finally {
            setIsSaving(false);
        }
    };

    // ── Save Home Screen (active selection) ─────────────────────────────
    const handleSaveHomeScreen = async () => {
        setIsSavingActive(true); setSaveActiveError(null); setSaveActiveSuccess(false);
        try {
            await apiClient.post("explore/home-screen-environments/active/", {
                environment_ids: Array.from(activeEnvIds),
            });
            setSaveActiveSuccess(true);
            setTimeout(() => setSaveActiveSuccess(false), 3000);
        } catch (err: unknown) {
            const status = (err as { response?: { status?: number } })?.response?.status;
            if (status === 404) {
                // endpoint not yet available, mark success locally
                setSaveActiveSuccess(true);
                setTimeout(() => setSaveActiveSuccess(false), 3000);
            } else {
                setSaveActiveError("Failed to update. Please try again.");
            }
        } finally {
            setIsSavingActive(false);
        }
    };

    const toggleActiveEnv = (id: number) => {
        setActiveEnvIds((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const deleteEnvironment = (id: number) => {
        setSavedEnvironments((prev) => prev.filter((e) => e.id !== id));
        setActiveEnvIds((prev) => { const s = new Set(prev); s.delete(id); return s; });
        apiClient.delete(`explore/home-screen-environments/${id}/`).catch(() => {});
    };

    const selectedVisualItem = envVisuals.find((v) => v.id === selectedVisual);
    const selectedSoundItems = envSounds.filter((s) => selectedSounds.includes(s.id));

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── Column 1: Select Visual ── */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-8 space-y-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                            <ImageIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Select Visual</h2>
                    </div>
                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 text-[10px] font-bold uppercase tracking-wider rounded-full">Step 1</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Choose a 360° panoramic image</p>

                {loadingVisuals ? (
                    <div className="flex items-center justify-center py-12 text-gray-400 gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" /><span className="text-sm">Loading…</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4 pt-2">
                        {envVisuals.map((env) => (
                            <button key={env.id} onClick={() => setSelectedVisual(env.id)}
                                className={`group relative aspect-[1.4/1] rounded-2xl overflow-hidden transition-all duration-300 ${selectedVisual === env.id ? "ring-4 ring-purple-600 ring-offset-2 dark:ring-offset-gray-800 scale-[1.02]" : "hover:scale-[1.02]"}`}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={env.image} alt={env.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                                {selectedVisual === env.id && (
                                    <div className="absolute top-2 right-2 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                                        <Check className="w-3 h-3 text-white" />
                                    </div>
                                )}
                                <span className="absolute bottom-3 left-3 text-[11px] font-semibold text-white leading-none">{env.name}</span>
                            </button>
                        ))}
                        <button onClick={() => uploadInputRef.current?.click()} disabled={isUploading}
                            className="aspect-[1.4/1] rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-purple-600 hover:bg-purple-50/50 dark:hover:bg-purple-900/10 transition-all flex flex-col items-center justify-center gap-3 group disabled:opacity-50">
                            <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-2xl group-hover:bg-white dark:group-hover:bg-purple-900/30 shadow-sm">
                                {isUploading ? <Loader2 className="w-5 h-5 text-purple-600 animate-spin" /> : <Upload className="w-5 h-5 text-gray-400 group-hover:text-purple-600" />}
                            </div>
                            <span className="text-[11px] font-bold text-gray-500 group-hover:text-purple-600 uppercase tracking-widest">
                                {isUploading ? "Uploading…" : "Upload New"}
                            </span>
                        </button>
                        <input ref={uploadInputRef} type="file" accept="image/*" className="hidden"
                            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleVisualUpload(f); e.target.value = ""; }} />
                        {uploadError && <p className="col-span-2 text-xs text-red-500">{uploadError}</p>}
                    </div>
                )}
            </div>

            {/* ── Column 2: Select Ambient Sounds ── */}
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

                {loadingSounds ? (
                    <div className="flex items-center justify-center py-12 text-gray-400 gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" /><span className="text-sm">Loading…</span>
                    </div>
                ) : (
                    <div className="space-y-3 pt-2">
                        {envSounds.map((sound) => {
                            const isSelected = selectedSounds.includes(sound.id);
                            const isPlaying = playingSounds.has(sound.id);
                            const volume = getVolume(sound.id);
                            return (
                                <div key={sound.id} className={`rounded-2xl border transition-all duration-200 overflow-hidden ${isSelected ? "border-purple-200 dark:border-purple-700 bg-purple-50/50 dark:bg-purple-900/10" : "border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800"}`}>
                                    <div className="flex items-center gap-3 px-4 py-3">
                                        <input type="checkbox" checked={isSelected} onChange={() => toggleSound(sound)}
                                            className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-purple-600 focus:ring-purple-600 cursor-pointer shrink-0" />
                                        <div className={`p-2 rounded-xl shrink-0 ${isSelected ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600" : "bg-gray-100 dark:bg-gray-700 text-gray-400"}`}>
                                            <Music className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{sound.name}</p>
                                            <p className="text-xs text-gray-400 capitalize truncate">{sound.environment_sound_type ?? "Ambient"}</p>
                                        </div>
                                        {isSelected && (
                                            <button onClick={() => togglePlayPause(sound)}
                                                className="p-1.5 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-800/50 text-purple-600 dark:text-purple-400 transition-colors shrink-0">
                                                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                            </button>
                                        )}
                                    </div>
                                    {isSelected && (
                                        <div className="px-4 pb-3 space-y-1.5">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => handleVolumeChange(sound.id, volume === 0 ? DEFAULT_VOLUME : 0)}
                                                    className="shrink-0 text-gray-400 hover:text-purple-600 transition-colors">
                                                    {volume === 0 ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                                                </button>
                                                <input type="range" min={0} max={100} step={1} value={volume}
                                                    onChange={(e) => handleVolumeChange(sound.id, Number(e.target.value))}
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
                    <button onClick={() => soundUploadInputRef.current?.click()} disabled={isUploadingSound}
                        className="w-full py-4 px-6 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-purple-600 hover:bg-purple-50/50 dark:hover:bg-purple-900/10 transition-all flex items-center justify-center gap-3 group disabled:opacity-50">
                        <div className="p-1.5 bg-gray-900 dark:bg-gray-700 rounded-lg text-white">
                            {isUploadingSound ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        </div>
                        <span className="text-sm font-bold text-gray-500 group-hover:text-purple-600">
                            {isUploadingSound ? "Uploading…" : "Add New Sound"}
                        </span>
                    </button>
                    <input ref={soundUploadInputRef} type="file" accept="audio/*" className="hidden"
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleSoundUpload(f); e.target.value = ""; }} />
                    {soundUploadError && <p className="text-xs text-red-500">{soundUploadError}</p>}
                </div>
            </div>

            {/* ── Column 3: Composer + Saved Environments ── */}
            <div className="space-y-6">

                {/* Step 3: Composition summary + Save */}
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
                            {selectedVisualItem ? (
                                <div className="relative w-full">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={selectedVisualItem.image} alt={selectedVisualItem.name} className="w-full h-20 object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <span className="absolute bottom-2 left-3 text-xs font-semibold text-white">{selectedVisualItem.name}</span>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400 py-3">No visual selected</p>
                            )}
                        </div>
                        {selectedSoundItems.length > 0 && (
                            <ul className="space-y-1.5">
                                {selectedSoundItems.map((s) => (
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

                    <button onClick={handleSave} disabled={isSaving || !selectedVisual}
                        className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60">
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" />
                            : saveSuccess ? <CheckCircle className="w-4 h-4" />
                            : <Save className="w-4 h-4" />}
                        {isSaving ? "Saving…" : saveSuccess ? "Saved!" : "Save this Environment"}
                    </button>
                </div>

                {/* Your Screen Environments */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-8 space-y-5 shadow-sm">
                    <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-700 pb-4">
                        <Monitor className="w-5 h-5 text-purple-600" />
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Your Screen Environments</h2>
                    </div>

                    {savedEnvironments.length === 0 ? (
                        <div className="py-8 text-center">
                            <p className="text-sm text-gray-400">No environments saved yet.</p>
                            <p className="text-xs text-gray-400 mt-1">Create one above and click "Save this Environment".</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {savedEnvironments.map((env) => (
                                <div key={env.id}
                                    className={`rounded-2xl border transition-all overflow-hidden ${activeEnvIds.has(env.id) ? "border-purple-300 dark:border-purple-600 bg-purple-50/30 dark:bg-purple-900/10" : "border-gray-100 dark:border-gray-700"}`}>
                                    <div className="flex items-center gap-3 p-3">
                                        <input type="checkbox" checked={activeEnvIds.has(env.id)} onChange={() => toggleActiveEnv(env.id)}
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
                                        <button onClick={() => deleteEnvironment(env.id)}
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
                        onClick={handleSaveHomeScreen}
                        disabled={isSavingActive || savedEnvironments.length === 0}
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
            </div>
        </div>
    );
};

export default HomeScreenEnvironments;
