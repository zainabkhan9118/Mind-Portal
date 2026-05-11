import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import BasicInfo from "./BasicInfo";
import ThemePlaylist from "./ThemePlaylist";
import VisibilitySettings from "./VisibilitySettings";
import AccessLevels from "./AccessLevels";
import CoverImage from "./CoverImage";
import AddTags from "./AddTags";
import CreateSubCategoryModal from "./CreateSubCategoryModal";
import { contentApi } from "@/lib/api";
import apiClient from "@/lib/api/axiosInstance";
import type { AdminCategory } from "@/lib/api/types";

interface Goal {
    id: number;
    name: string;
}

interface AddMusicModalProps {
    isOpen: boolean;
    onClose: () => void;
    isEnvironmentSound?: boolean;
    isMindSession?: boolean;
    isEnvironmentVisual?: boolean;
    categories: AdminCategory[];
    onSuccess: () => void;
}

const AddMusicModal: React.FC<AddMusicModalProps> = ({
    isOpen,
    onClose,
    isEnvironmentSound = false,
    isMindSession = false,
    isEnvironmentVisual = false,
    categories,
    onSuccess,
}) => {
    const [useCustomIcon, setUseCustomIcon] = useState(false);
    const [isCreateSubCategoryOpen, setIsCreateSubCategoryOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    // Goals
    const [goalsList, setGoalsList] = useState<Goal[]>([]);
    const [selectedGoals, setSelectedGoals] = useState<number[]>([]);

    // Form state
    const [title, setTitle] = useState("");
    const [artist, setArtist] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [status, setStatus] = useState("draft");
    const [accessLevel, setAccessLevel] = useState("free");
    const [details, setDetails] = useState("");
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
    const [frequency, setFrequency] = useState("");
    const [contentType, setContentType] = useState("");
    const [duration, setDuration] = useState<number>(0);

    // Fetch goals once
    useEffect(() => {
        apiClient
            .get<{ results: Goal[] }>("explore/goals/", { params: { size: 100 } })
            .then((res) => setGoalsList(res.data.results ?? []))
            .catch(() => {});
    }, []);

    const resetForm = () => {
        setTitle("");
        setArtist("");
        setCategoryId("");
        setTags([]);
        setStatus("draft");
        setAccessLevel("free");
        setDetails("");
        setAudioFile(null);
        setCoverImageFile(null);
        setFrequency("");
        setContentType("");
        setDuration(0);
        setSelectedGoals([]);
        setSubmitError(null);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const toggleGoal = (id: number) => {
        setSelectedGoals((prev) =>
            prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
        );
    };

    const buildFormData = (publish: boolean): FormData => {
        const apiStatus = publish ? "published" : status;
        const isPremium = accessLevel === "premium";

        const fd = new FormData();
        fd.append("name", title);
        fd.append("description", details);
        fd.append("status", apiStatus);
        fd.append("is_premium", String(isPremium));

        tags.forEach((tag) => fd.append("tags", tag));
        selectedGoals.forEach((id) => fd.append("goals", String(id)));

        fd.append("duration", String(duration));

        if (audioFile) {
            fd.append(isEnvironmentVisual ? "visual_file" : "audio_clip", audioFile);
        }
        if (coverImageFile) {
            fd.append("image", coverImageFile);
        }

        if (isEnvironmentSound) {
            fd.append("environment_sound_type", artist);
            if (frequency) fd.append("frequency", frequency);
            if (categoryId) fd.append("category", categoryId);
        } else if (isMindSession) {
            fd.append("artist", artist);
            fd.append("instructor_name", artist);
            if (contentType) fd.append("mind_session_type", contentType);
            if (categoryId) fd.append("mind_session_category", categoryId);
        } else if (isEnvironmentVisual) {
            fd.append("mood", artist);
            if (contentType) fd.append("environment_visual_type", contentType);
            if (categoryId) fd.append("category", categoryId);
        } else {
            // Music
            fd.append("artist", artist);
            if (categoryId) fd.append("music_category", categoryId);
        }

        return fd;
    };

    const handleSubmit = async (publish: boolean) => {
        if (!title.trim()) {
            setSubmitError("Title is required.");
            return;
        }
        if (!artist.trim()) {
            const artistLabel = isEnvironmentSound ? "Type" : isMindSession ? "Voice (Name of Professional)" : isEnvironmentVisual ? "Author" : "Artist";
            setSubmitError(`${artistLabel} is required.`);
            return;
        }
        if (!details.trim()) {
            setSubmitError("Description is required.");
            return;
        }
        if (!audioFile) {
            setSubmitError(`Please upload a${isEnvironmentVisual ? " video" : "n audio"} file.`);
            return;
        }
        if (!coverImageFile) {
            setSubmitError("Please upload a cover image.");
            return;
        }
        if (!isEnvironmentVisual && duration === 0) {
            setSubmitError("Audio duration could not be read yet. Please wait a moment or re-upload the file.");
            return;
        }
        if (selectedGoals.length === 0) {
            setSubmitError("Please select at least one goal.");
            return;
        }
        setSubmitError(null);
        setIsSubmitting(true);
        try {
            const fd = buildFormData(publish);
            if (isEnvironmentSound) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                await contentApi.envSounds.create(fd as any);
            } else if (isMindSession) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                await contentApi.guidedSessions.create(fd as any);
            } else if (isEnvironmentVisual) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                await contentApi.envVisuals.create(fd as any);
            } else {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                await contentApi.music.create(fd as any);
            }
            resetForm();
            onClose();
            onSuccess();
        } catch (err: unknown) {
            console.error("Failed to create content:", err);
            const axiosErr = err as { response?: { data?: { error?: { message?: string; details?: { field: string; message: string }[] } } } };
            const details = axiosErr?.response?.data?.error?.details;
            if (details?.length) {
                setSubmitError(details.map((d) => `${d.field}: ${d.message}`).join(" | "));
            } else {
                setSubmitError("Failed to save. Please check all fields and try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    let modalTitle = "Add Music";
    let modalDescription = "Fill in the details to add a new music track to your collection.";

    if (isEnvironmentSound) {
        modalTitle = "Add Environment Sound";
        modalDescription = "Fill in the details to add a new Environment Sound to your collection.";
    } else if (isMindSession) {
        modalTitle = "Add Mind Sessions";
        modalDescription = "Fill in the details to add a new mind session to your collection.";
    } else if (isEnvironmentVisual) {
        modalTitle = "Add Environment Visual";
        modalDescription = "Fill in the details to add a new environment visual to your collection.";
    }

    return (
        <>
            <Modal isOpen={isOpen} onClose={handleClose} className="max-w-[700px] m-4">
                <div className="relative flex flex-col w-full bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 overflow-hidden">
                    {/* Header */}
                    <div className="mb-6 flex justify-between items-start">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                {modalTitle}
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {modalDescription}
                            </p>
                        </div>
                    </div>

                    {/* content scrollable area */}
                    <div className="flex-1 space-y-10 overflow-y-auto max-h-[70vh] pr-2 custom-scrollbar pb-6">
                        <BasicInfo
                            isEnvironmentSound={isEnvironmentSound}
                            isMindSession={isMindSession}
                            isEnvironmentVisual={isEnvironmentVisual}
                            onCreateSubCategory={() => setIsCreateSubCategoryOpen(true)}
                            title={title}
                            onTitleChange={setTitle}
                            artist={artist}
                            onArtistChange={setArtist}
                            categoryId={categoryId}
                            onCategoryChange={setCategoryId}
                            categories={categories}
                            details={details}
                            onDetailsChange={setDetails}
                            audioFile={audioFile}
                            onAudioFileChange={setAudioFile}
                            onDurationExtracted={setDuration}
                        />

                        {/* Goals */}
                        {goalsList.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                    Goals <span className="text-red-500">*</span>
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {goalsList.map((g) => (
                                        <button
                                            key={g.id}
                                            type="button"
                                            onClick={() => toggleGoal(g.id)}
                                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                                                selectedGoals.includes(g.id)
                                                    ? "bg-[#9810FA] text-white border-[#9810FA]"
                                                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-[#9810FA] hover:text-[#9810FA]"
                                            }`}
                                        >
                                            {g.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <AddTags tags={tags} onTagsChange={setTags} />

                        {/* <IconSelection
                            useCustomIcon={useCustomIcon}
                            setUseCustomIcon={setUseCustomIcon}
                        /> */}

                        {(isEnvironmentSound || isMindSession || isEnvironmentVisual) && (
                            <ThemePlaylist
                                isEnvironmentSound={isEnvironmentSound}
                                isMindSession={isMindSession}
                                isEnvironmentVisual={isEnvironmentVisual}
                                frequency={frequency}
                                onFrequencyChange={setFrequency}
                                contentType={contentType}
                                onContentTypeChange={setContentType}
                            />
                        )}

                        {/* Cover image shown for all content types */}
                        <CoverImage
                            coverImageFile={coverImageFile}
                            onCoverImageFileChange={setCoverImageFile}
                        />

                        <VisibilitySettings status={status} onStatusChange={setStatus} />
                        <AccessLevels accessLevel={accessLevel} onAccessLevelChange={setAccessLevel} />
                    </div>

                    {/* Error */}
                    {submitError && (
                        <p className="text-xs text-red-500 mt-3 px-1">{submitError}</p>
                    )}

                    {/* Footer */}
                    <div className="flex flex-col-reverse justify-end gap-3 pt-6 mt-4 border-t border-gray-100 dark:border-gray-800 sm:flex-row">
                        <Button variant="outline" onClick={handleClose} disabled={isSubmitting} className="w-full sm:w-auto px-10 rounded-xl py-3 h-auto">
                            Cancel
                        </Button>
                        <Button variant="outline" onClick={() => handleSubmit(false)} disabled={isSubmitting} className="w-full sm:w-auto px-10 rounded-xl py-3 h-auto">
                            {isSubmitting ? "Saving..." : "Save"}
                        </Button>
                        <Button variant="primary" onClick={() => handleSubmit(true)} disabled={isSubmitting} className="w-full sm:w-auto bg-[#9810FA] border border-[#9810FA] hover:bg-[#8000E0] px-10 rounded-xl py-3 h-auto">
                            {isSubmitting ? "Publishing..." : "Save & Publish"}
                        </Button>
                    </div>
                </div>
            </Modal>

            <CreateSubCategoryModal
                isOpen={isCreateSubCategoryOpen}
                onClose={() => setIsCreateSubCategoryOpen(false)}
            />
        </>
    );
};

export default AddMusicModal;
