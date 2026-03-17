import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import BasicInfo from "./BasicInfo";
import ThemePlaylist from "./ThemePlaylist";
import IconSelection from "./IconSelection";
import VisibilitySettings from "./VisibilitySettings";
import AccessLevels from "./AccessLevels";
import CoverImage from "./CoverImage";
import AddTags from "./AddTags";
import CreateSubCategoryModal from "./CreateSubCategoryModal";
import { contentApi } from "@/lib/api";
import type { AdminCategory } from "@/lib/api/types";

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

    // Form state
    const [title, setTitle] = useState("");
    const [artist, setArtist] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [status, setStatus] = useState("draft");
    const [accessLevel, setAccessLevel] = useState("free");
    const [goal, setGoal] = useState("");
    const [details, setDetails] = useState("");

    const resetForm = () => {
        setTitle("");
        setArtist("");
        setCategoryId("");
        setTags([]);
        setStatus("draft");
        setAccessLevel("free");
        setGoal("");
        setDetails("");
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const buildPayload = (publish: boolean) => {
        const apiStatus = publish ? "published" : (status as "published" | "draft" | "archived" | "review");
        const catId = categoryId ? Number(categoryId) : undefined;
        const isPremium = accessLevel === "premium";

        if (isEnvironmentSound) {
            return {
                name: title,
                environment_sound_type: artist,
                description: details,
                tags,
                status: apiStatus,
                is_premium: isPremium,
                ...(catId ? { category: [catId] } : {}),
            };
        }
        if (isMindSession) {
            return {
                name: title,
                instructor_name: artist,
                description: details,
                tags,
                status: apiStatus,
                is_premium: isPremium,
                ...(catId ? { mind_session_category: [catId] } : {}),
            };
        }
        if (isEnvironmentVisual) {
            return {
                name: title,
                mood: artist,
                description: details,
                tags,
                status: apiStatus,
                is_premium: isPremium,
                ...(catId ? { category: [catId] } : {}),
            };
        }
        // Music
        return {
            name: title,
            artist,
            description: details,
            tags,
            status: apiStatus,
            is_premium: isPremium,
            ...(catId ? { music_category: [catId] } : {}),
        };
    };

    const handleSubmit = async (publish: boolean) => {
        if (!title.trim()) return;
        setIsSubmitting(true);
        try {
            const payload = buildPayload(publish);
            if (isEnvironmentSound) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                await contentApi.envSounds.create(payload as any);
            } else if (isMindSession) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                await contentApi.guidedSessions.create(payload as any);
            } else if (isEnvironmentVisual) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                await contentApi.envVisuals.create(payload as any);
            } else {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                await contentApi.music.create(payload as any);
            }
            resetForm();
            onClose();
            onSuccess();
        } catch (err) {
            console.error("Failed to create content:", err);
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
                            goal={goal}
                            onGoalChange={setGoal}
                            details={details}
                            onDetailsChange={setDetails}
                        />

                        <AddTags tags={tags} onTagsChange={setTags} />

                        {!isEnvironmentVisual && (
                            <IconSelection
                                useCustomIcon={useCustomIcon}
                                setUseCustomIcon={setUseCustomIcon}
                            />
                        )}

                        {(isEnvironmentSound || isMindSession || isEnvironmentVisual) && (
                            <>
                                <ThemePlaylist
                                    isEnvironmentSound={isEnvironmentSound}
                                    isMindSession={isMindSession}
                                    isEnvironmentVisual={isEnvironmentVisual}
                                />
                                <CoverImage />
                            </>
                        )}

                        <VisibilitySettings status={status} onStatusChange={setStatus} />
                        <AccessLevels accessLevel={accessLevel} onAccessLevelChange={setAccessLevel} />
                    </div>

                    {/* Footer */}
                    <div className="flex flex-col-reverse justify-end gap-3 pt-6 mt-6 border-t border-gray-100 dark:border-gray-800 sm:flex-row">
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