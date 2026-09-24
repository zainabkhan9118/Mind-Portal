"use client";
import React, { useEffect, useRef, useState } from "react";
import { contentApi, apiClient } from "@/lib/api";
import type { AdminEnvironmentSound } from "@/lib/api/types";
import ConfirmDeleteModal from "@/components/ui/modal/ConfirmDeleteModal";
import PhonePreview from "./PhonePreview";
import VisualPicker from "./VisualPicker";
import SoundPicker from "./SoundPicker";
import CompositionSummary from "./CompositionSummary";
import SavedEnvironmentsList from "./SavedEnvironmentsList";
import type { SavedEnvironment } from "./types";
import { useHomeScreenEnvironmentsData } from "./useHomeScreenEnvironmentsData";
import { DEFAULT_VOLUME } from "./constants";

const HomeScreenEnvironments: React.FC = () => {
    const {
        envVisuals, setEnvVisuals,
        envSounds, setEnvSounds,
        loadingVisuals, loadingSounds,
        goalIds,
        savedEnvironments, setSavedEnvironments,
        activeEnvIds, setActiveEnvIds,
    } = useHomeScreenEnvironmentsData();

    // ── Composer state ──────────────────────────────────────────────────
    const [selectedVisual, setSelectedVisual] = useState<number | null>(null);
    const [selectedSounds, setSelectedSounds] = useState<number[]>([]);
    const [soundVolumes, setSoundVolumes] = useState<Record<number, number>>({});
    const [playingSounds, setPlayingSounds] = useState<Set<number>>(new Set());
    const audioRefs = useRef<Record<number, HTMLAudioElement>>({});

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

    const [isUploadingSound, setIsUploadingSound] = useState(false);
    const [soundUploadError, setSoundUploadError] = useState<string | null>(null);

    // ── Delete confirmation ──────────────────────────────────────────────
    const [pendingDelete, setPendingDelete] = useState<{ type: "visual" | "sound"; id: number } | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // ── Cleanup audio on unmount ────────────────────────────────────────
    useEffect(() => {
        return () => {
            Object.values(audioRefs.current).forEach((a) => { a.pause(); a.src = ""; });
        };
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

    // The backend requires a cover `image` on env-sound create, but sounds don't
    // naturally have artwork — generate a plain placeholder so the admin only has
    // to pick the audio file; they can still opt to pick a real image instead.
    const generatePlaceholderSoundImage = (): Promise<File> => {
        return new Promise((resolve) => {
            const canvas = document.createElement("canvas");
            canvas.width = 512;
            canvas.height = 512;
            const ctx = canvas.getContext("2d");
            if (!ctx) { resolve(new File([], "cover.png", { type: "image/png" })); return; }
            ctx.fillStyle = "#9810FA";
            ctx.fillRect(0, 0, 512, 512);
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 220px sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("♪", 256, 270);
            canvas.toBlob((blob) => {
                resolve(new File([blob ?? new Blob()], "cover.png", { type: "image/png" }));
            }, "image/png");
        });
    };

    // ── Uploads ─────────────────────────────────────────────────────────
    const handleVisualUpload = async (file: File) => {
        setIsUploading(true); setUploadError(null);
        const fd = new FormData();
        fd.append("name", file.name.replace(/\.[^/.]+$/, ""));
        fd.append("visual_file", file);
        fd.append("image", file);
        fd.append("status", "published");
        goalIds.forEach((id) => fd.append("goals", String(id)));
        try {
            const created = await contentApi.envVisuals.create(fd);
            setEnvVisuals((prev) => [created, ...prev]);
            setSelectedVisual(created.id);
        } catch { setUploadError("Upload failed."); }
        finally { setIsUploading(false); }
    };

    const handleSoundUpload = async (file: File, imageFile: File) => {
        setIsUploadingSound(true); setSoundUploadError(null);
        const fd = new FormData();
        fd.append("name", file.name.replace(/\.[^/.]+$/, ""));
        fd.append("audio_clip", file);
        // The backend requires a cover `image` on create (confirmed via a live 400:
        // `"image": "No file was submitted."`) — unlike Visuals, an audio file can't
        // double as its own thumbnail, so this needs a real second file from the admin.
        fd.append("image", imageFile);
        fd.append("status", "published");
        goalIds.forEach((id) => fd.append("goals", String(id)));
        try {
            const created = await contentApi.envSounds.create(fd);
            setEnvSounds((prev) => [created, ...prev]);
            setSoundVolumes((prev) => ({ ...prev, [created.id]: DEFAULT_VOLUME }));
            setSelectedSounds((prev) => [...prev, created.id]);
            startAudio(created, DEFAULT_VOLUME);
        } catch { setSoundUploadError("Upload failed. Please try again."); }
        finally { setIsUploadingSound(false); }
    };

    const handleAudioFilePicked = async (file: File) => {
        const imageFile = await generatePlaceholderSoundImage();
        handleSoundUpload(file, imageFile);
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
                env_visual_ids: [selectedVisual],
                env_sound_ids: selectedSounds,
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
    // Verified in production (9 Sept 2026): the backend accepts `environment_ids`
    // as an array in a single request and replaces the full active set with it.
    const handleSaveHomeScreen = async () => {
        const activeIds = Array.from(activeEnvIds);
        if (activeIds.length === 0) { setSaveActiveError("Please select at least one environment first."); return; }
        setIsSavingActive(true); setSaveActiveError(null); setSaveActiveSuccess(false);
        try {
            await apiClient.post("explore/home-screen-environments/active/", { environment_ids: activeIds });
            setSaveActiveSuccess(true);
            setTimeout(() => setSaveActiveSuccess(false), 3000);
        } catch {
            setSaveActiveError("Failed to update. Please try again.");
        } finally {
            setIsSavingActive(false);
        }
    };

    const toggleActiveEnv = (id: number) => {
        setActiveEnvIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const deleteEnvironment = (id: number) => {
        setSavedEnvironments((prev) => prev.filter((e) => e.id !== id));
        setActiveEnvIds((prev) => { const s = new Set(prev); s.delete(id); return s; });
        apiClient.delete(`explore/home-screen-environments/${id}/`).catch(() => {});
    };

    const confirmDelete = async () => {
        if (!pendingDelete) return;
        const { type, id } = pendingDelete;
        setIsDeleting(true);
        try {
            if (type === "visual") {
                await contentApi.envVisuals.delete(id);
                setEnvVisuals((prev) => prev.filter((v) => v.id !== id));
                if (selectedVisual === id) setSelectedVisual(null);
            } else {
                await contentApi.envSounds.delete(id);
                stopAndRemoveAudio(id);
                setEnvSounds((prev) => prev.filter((s) => s.id !== id));
                setSelectedSounds((prev) => prev.filter((s) => s !== id));
            }
            setPendingDelete(null);
        } catch {
            if (type === "visual") setUploadError("Failed to delete visual.");
            else setSoundUploadError("Failed to delete sound.");
            setPendingDelete(null);
        } finally {
            setIsDeleting(false);
        }
    };

    // Checking a saved environment updates the Preview panel (see below), but the panel is
    // a static mockup — it can't play audio itself. Actually play/stop the checked
    // environment's sounds here so "previewing" a saved pairing is audible, not just visual.
    const previewedSavedEnvIdRef = useRef<number | null>(null);
    useEffect(() => {
        const nextEnv = savedEnvironments.find((e) => activeEnvIds.has(e.id)) ?? null;
        const nextId = nextEnv?.id ?? null;
        if (previewedSavedEnvIdRef.current === nextId) return;

        const prevEnv = savedEnvironments.find((e) => e.id === previewedSavedEnvIdRef.current);
        prevEnv?.sounds.forEach(({ sound }) => stopAndRemoveAudio(sound.id));

        nextEnv?.sounds.forEach(({ sound, volume }) => startAudio(sound, volume));

        previewedSavedEnvIdRef.current = nextId;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeEnvIds, savedEnvironments]);

    const selectedVisualItem = envVisuals.find((v) => v.id === selectedVisual);
    const selectedSoundItems = envSounds.filter((s) => selectedSounds.includes(s.id));

    // A checked "Your Screen Environments" row previews as its own saved pairing
    // (visual + its own sounds); with nothing checked there, the preview falls
    // back to whatever's currently being composed in Steps 1 & 2.
    const previewedSavedEnv = savedEnvironments.find((e) => activeEnvIds.has(e.id));
    const previewVisualImage = previewedSavedEnv ? previewedSavedEnv.visual.image : selectedVisualItem?.image;
    const previewSoundNames = previewedSavedEnv
        ? previewedSavedEnv.sounds.map((s) => s.sound.name)
        : selectedSoundItems.map((s) => s.name);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <VisualPicker
                visuals={envVisuals}
                selectedVisualId={selectedVisual}
                isLoading={loadingVisuals}
                isUploading={isUploading}
                uploadError={uploadError}
                onSelect={(id) => setSelectedVisual((prev) => (prev === id ? null : id))}
                onUpload={handleVisualUpload}
                onDeleteRequest={(id) => setPendingDelete({ type: "visual", id })}
            />

            <SoundPicker
                sounds={envSounds}
                selectedSoundIds={selectedSounds}
                playingSoundIds={playingSounds}
                getVolume={getVolume}
                isLoading={loadingSounds}
                isUploading={isUploadingSound}
                uploadError={soundUploadError}
                onToggleSound={toggleSound}
                onTogglePlayPause={togglePlayPause}
                onVolumeChange={handleVolumeChange}
                onDeleteRequest={(id) => setPendingDelete({ type: "sound", id })}
                onUploadAudioFile={handleAudioFilePicked}
            />

            <div className="space-y-6">
                {previewVisualImage && (
                    <PhonePreview visualImage={previewVisualImage} soundNames={previewSoundNames} />
                )}

                <CompositionSummary
                    selectedVisual={selectedVisualItem}
                    selectedSounds={selectedSoundItems}
                    getVolume={getVolume}
                    isSaving={isSaving}
                    saveError={saveError}
                    saveSuccess={saveSuccess}
                    onSave={handleSave}
                />

                <SavedEnvironmentsList
                    environments={savedEnvironments}
                    activeEnvIds={activeEnvIds}
                    onToggleActive={toggleActiveEnv}
                    onDelete={deleteEnvironment}
                    isSavingActive={isSavingActive}
                    saveActiveError={saveActiveError}
                    saveActiveSuccess={saveActiveSuccess}
                    onSaveActive={handleSaveHomeScreen}
                />
            </div>

            <ConfirmDeleteModal
                isOpen={pendingDelete !== null}
                title={pendingDelete?.type === "visual" ? "Delete Visual" : "Delete Sound"}
                message={
                    pendingDelete?.type === "visual"
                        ? "Are you sure you want to delete this visual? This action cannot be undone."
                        : "Are you sure you want to delete this sound? This action cannot be undone."
                }
                isLoading={isDeleting}
                onConfirm={confirmDelete}
                onClose={() => setPendingDelete(null)}
            />
        </div>
    );
};

export default HomeScreenEnvironments;
