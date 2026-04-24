"use client";
import React, { useEffect, useRef, useState } from "react";
import {
    Image as ImageIcon,
    Volume2,
    Plus,
    Save,
    Trash2,
    ArrowRight,
    Check,
    Upload,
    Monitor,
    Brain,
    Layers,
    Loader2,
    Music,
} from "lucide-react";
import { contentApi, apiClient } from "@/lib/api";
import type { AdminEnvironmentVisual, AdminEnvironmentSound } from "@/lib/api/types";

const HomeScreenEnvironments: React.FC = () => {
    const [envVisuals, setEnvVisuals] = useState<AdminEnvironmentVisual[]>([]);
    const [envSounds, setEnvSounds] = useState<AdminEnvironmentSound[]>([]);
    const [loadingVisuals, setLoadingVisuals] = useState(true);
    const [loadingSounds, setLoadingSounds] = useState(true);

    const [selectedVisual, setSelectedVisual] = useState<number | null>(null);
    const [selectedSounds, setSelectedSounds] = useState<number[]>([]);

    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const [activeEnvironments, setActiveEnvironments] = useState<number[]>([]);

    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const uploadInputRef = useRef<HTMLInputElement>(null);

    const [isUploadingSound, setIsUploadingSound] = useState(false);
    const [soundUploadError, setSoundUploadError] = useState<string | null>(null);
    const soundUploadInputRef = useRef<HTMLInputElement>(null);

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
    }, []);

    const handleSoundUpload = async (file: File) => {
        setIsUploadingSound(true);
        setSoundUploadError(null);
        const fd = new FormData();
        fd.append("name", file.name.replace(/\.[^/.]+$/, ""));
        fd.append("audio_clip", file);
        fd.append("status", "published");
        try {
            const created = await contentApi.envSounds.create(fd);
            setEnvSounds((prev) => [created, ...prev]);
            setSelectedSounds((prev) => [...prev, created.id]);
        } catch {
            setSoundUploadError("Upload failed. Please try again.");
        } finally {
            setIsUploadingSound(false);
        }
    };

    const toggleActiveEnvironment = (id: number) => {
        setActiveEnvironments((prev) =>
            prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
        );
    };

    const handleVisualUpload = async (file: File) => {
        setIsUploading(true);
        setUploadError(null);
        const fd = new FormData();
        fd.append("name", file.name.replace(/\.[^/.]+$/, ""));
        fd.append("image", file);
        fd.append("status", "published");
        try {
            const created = await contentApi.envVisuals.create(fd);
            setEnvVisuals((prev) => [created, ...prev]);
            setSelectedVisual(created.id);
        } catch {
            setUploadError("Upload failed — make sure all required fields are provided.");
        } finally {
            setIsUploading(false);
        }
    };

    const toggleSound = (id: number) => {
        setSelectedSounds((prev) =>
            prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
        );
    };

    const handleSave = async () => {
        if (!selectedVisual) {
            setSaveError("Please select a visual environment first.");
            return;
        }
        setIsSaving(true);
        setSaveError(null);
        setSaveSuccess(false);
        try {
            await apiClient.post("explore/home-screen-environments/", {
                visual_id: selectedVisual,
                sound_ids: selectedSounds,
            });
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err: unknown) {
            const status = (err as { response?: { status?: number } })?.response?.status;
            setSaveError(status === 404 ? "Save endpoint is not yet available on the backend." : "Failed to save. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const selectedVisualItem = envVisuals.find((v) => v.id === selectedVisual);
    const selectedSoundItems = envSounds.filter((s) => selectedSounds.includes(s.id));

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Column 1: Select Visual Environment */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-8 space-y-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                            <ImageIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Select Visual Environment</h2>
                    </div>
                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 text-[10px] font-bold uppercase tracking-wider rounded-full">Step 1</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Choose a 360° panoramic image</p>

                {loadingVisuals ? (
                    <div className="flex items-center justify-center py-12 text-gray-400 gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="text-sm">Loading…</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4 pt-4">
                        {envVisuals.map((env) => (
                            <button
                                key={env.id}
                                onClick={() => setSelectedVisual(env.id)}
                                className={`group relative aspect-[1.4/1] rounded-2xl overflow-hidden transition-all duration-300 ${
                                    selectedVisual === env.id
                                        ? "ring-4 ring-purple-600 ring-offset-2 dark:ring-offset-gray-800 scale-[1.02]"
                                        : "hover:scale-[1.02]"
                                }`}
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={env.image} alt={env.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                                {selectedVisual === env.id && (
                                    <div className="absolute top-2 right-2 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                                        <Check className="w-3 h-3 text-white" />
                                    </div>
                                )}
                                <span className="absolute bottom-3 left-3 text-[11px] font-semibold text-white tracking-tight leading-none">{env.name}</span>
                            </button>
                        ))}
                        <button
                            onClick={() => uploadInputRef.current?.click()}
                            disabled={isUploading}
                            className="aspect-[1.4/1] rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-purple-600 hover:bg-purple-50/50 dark:hover:bg-purple-900/10 transition-all flex flex-col items-center justify-center gap-3 group disabled:opacity-50"
                        >
                            <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-2xl group-hover:bg-white dark:group-hover:bg-purple-900/30 transition-colors shadow-sm">
                                {isUploading ? <Loader2 className="w-5 h-5 text-purple-600 animate-spin" /> : <Upload className="w-5 h-5 text-gray-400 group-hover:text-purple-600" />}
                            </div>
                            <span className="text-[11px] font-bold text-gray-500 group-hover:text-purple-600 uppercase tracking-widest">
                                {isUploading ? "Uploading…" : "Upload New"}
                            </span>
                        </button>
                        <input
                            ref={uploadInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleVisualUpload(file);
                                e.target.value = "";
                            }}
                        />
                        {uploadError && (
                            <p className="col-span-2 text-xs text-red-500">{uploadError}</p>
                        )}
                    </div>
                )}
            </div>

            {/* Column 2: Select Ambient Sounds */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-8 space-y-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                            <Volume2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Select Ambient Sounds</h2>
                    </div>
                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 text-[10px] font-bold uppercase tracking-wider rounded-full">Step 2</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Layer sounds to create the perfect atmosphere.</p>

                {loadingSounds ? (
                    <div className="flex items-center justify-center py-12 text-gray-400 gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="text-sm">Loading…</span>
                    </div>
                ) : (
                    <div className="space-y-4 pt-4">
                        {envSounds.map((sound) => (
                            <div key={sound.id} className="p-1 transition-all">
                                <div className="flex items-center gap-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedSounds.includes(sound.id)}
                                        onChange={() => toggleSound(sound.id)}
                                        className="w-5 h-5 rounded-md border-gray-300 dark:border-gray-600 text-purple-600 focus:ring-purple-600 transition-all cursor-pointer"
                                    />
                                    <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-2xl text-gray-400">
                                        <Music className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">{sound.name}</p>
                                        <p className="text-xs text-gray-400 font-medium capitalize">
                                            {sound.environment_sound_type ?? "Ambient"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="pt-4 space-y-2">
                    <button
                        onClick={() => soundUploadInputRef.current?.click()}
                        disabled={isUploadingSound}
                        className="w-full py-4 px-6 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-purple-600 hover:bg-purple-50/50 dark:hover:bg-purple-900/10 transition-all flex items-center justify-center gap-3 group disabled:opacity-50"
                    >
                        <div className="p-1.5 bg-gray-900 dark:bg-gray-700 rounded-lg text-white">
                            {isUploadingSound ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        </div>
                        <span className="text-sm font-bold text-gray-500 group-hover:text-purple-600">
                            {isUploadingSound ? "Uploading…" : "Add New Sound"}
                        </span>
                    </button>
                    <input
                        ref={soundUploadInputRef}
                        type="file"
                        accept="audio/*"
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleSoundUpload(file);
                            e.target.value = "";
                        }}
                    />
                    {soundUploadError && (
                        <p className="text-xs text-red-500">{soundUploadError}</p>
                    )}
                </div>
            </div>

            {/* Column 3: Create & Summary */}
            <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-8 space-y-4 shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Brain className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create Environment</h2>
                        </div>
                        <span className="px-3 py-1 bg-purple-100/50 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 text-[10px] font-bold uppercase tracking-wider rounded-full">Step 3</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Review your composition and save this Environment</p>

                    <div className="border-t border-gray-100 dark:border-gray-700 my-2" />

                    <div className="p-8 bg-gray-50/50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700 space-y-6">
                        <div className="flex items-center gap-3 text-gray-900 dark:text-white font-bold text-sm">
                            <Layers className="w-5 h-5" />
                            <span className="font-bold">Composition Summary</span>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden min-h-[100px] flex items-center justify-center">
                            {selectedVisualItem ? (
                                <div className="relative w-full">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={selectedVisualItem.image} alt={selectedVisualItem.name} className="w-full h-28 object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <span className="absolute bottom-2 left-3 text-xs font-semibold text-white">{selectedVisualItem.name}</span>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400 font-medium">No environment selected yet</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <p className="text-[13px] text-gray-500 font-medium">
                                Active Sounds (<span className="mx-1 text-gray-900 dark:text-white">{selectedSoundItems.length}</span>)
                            </p>
                            {selectedSoundItems.length > 0 ? (
                                <ul className="space-y-1">
                                    {selectedSoundItems.map((s) => (
                                        <li key={s.id} className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                            <Check className="w-3 h-3 text-purple-500" />
                                            {s.name}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-[13px] text-gray-400 mt-1">No sounds added</p>
                            )}
                        </div>
                    </div>

                    {saveError && <p className="text-xs text-red-500">{saveError}</p>}

                    <button
                        onClick={handleSave}
                        disabled={isSaving || !selectedVisual}
                        className="w-full py-4 px-6 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] mt-2 disabled:opacity-60"
                    >
                        {isSaving ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : saveSuccess ? (
                            <Check className="w-5 h-5" />
                        ) : (
                            <Save className="w-5 h-5" />
                        )}
                        {isSaving ? "Saving…" : saveSuccess ? "Saved!" : "Save this Environment"}
                        {!isSaving && !saveSuccess && <ArrowRight className="w-5 h-5 ml-auto" />}
                    </button>
                </div>

                {/* Your Screen Environments */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-8 space-y-8 shadow-sm">
                    <div className="flex justify-center border-b-2 border-purple-600 pb-4">
                        <div className="flex items-center gap-3">
                            <Monitor className="w-6 h-6 text-purple-600" />
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Screen Environments</h2>
                        </div>
                    </div>

                    {envVisuals.length > 0 ? (
                        <div className="space-y-6">
                            {envVisuals.slice(0, 4).map((env) => (
                                <div key={env.id} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="checkbox"
                                            checked={activeEnvironments.includes(env.id)}
                                            onChange={() => toggleActiveEnvironment(env.id)}
                                            className="w-5 h-5 rounded-md border-gray-300 dark:border-gray-600 text-purple-600 focus:ring-purple-600 transition-all cursor-pointer"
                                        />
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={env.image} alt="" className="w-14 h-10 rounded-xl object-cover shadow-md" />
                                        <span className="text-sm font-bold text-gray-900 dark:text-white tracking-tight">{env.name}</span>
                                    </div>
                                    <button
                                        onClick={() => setEnvVisuals((prev) => prev.filter((e) => e.id !== env.id))}
                                        className="p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400 text-center py-4">No environments available</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HomeScreenEnvironments;
