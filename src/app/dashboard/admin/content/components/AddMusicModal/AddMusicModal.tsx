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

interface AddMusicModalProps {
    isOpen: boolean;
    onClose: () => void;
    isEnvironmentSound?: boolean;
    isMindSession?: boolean;
    isEnvironmentVisual?: boolean; // New prop
}

const AddMusicModal: React.FC<AddMusicModalProps> = ({
    isOpen,
    onClose,
    isEnvironmentSound = false,
    isMindSession = false,
    isEnvironmentVisual = false,
}) => {
    const [useCustomIcon, setUseCustomIcon] = useState(false);

    // Determine Title and Description based on type
    let title = "Add Music";
    let description = "Fill in the details to add a new music track to your collection.";

    if (isEnvironmentSound) {
        title = "Add Environment Sound";
        description = "Fill in the details to add a new Environment Sound to your collection.";
    } else if (isMindSession) {
        title = "Add Mind Sessions";
        description = "Fill in the details to add a new mind session to your collection.";
    } else if (isEnvironmentVisual) {
        title = "Add Environment Visual";
        description = "Fill in the details to add a new environment visual to your collection.";
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4">
            <div className="relative flex flex-col w-full bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 overflow-hidden">
                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {title}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {description}
                    </p>
                </div>

                {/* content scrollable area */}
                <div className="flex-1 space-y-6 overflow-y-auto max-h-[70vh] pr-2 custom-scrollbar">
                    <BasicInfo
                        isEnvironmentSound={isEnvironmentSound}
                        isMindSession={isMindSession}
                        isEnvironmentVisual={isEnvironmentVisual}
                    />

                    <ThemePlaylist
                        isEnvironmentSound={isEnvironmentSound}
                        isMindSession={isMindSession}
                        isEnvironmentVisual={isEnvironmentVisual}
                    />

                    {(isMindSession || isEnvironmentVisual) && <AddTags />}

                    {/* Icon Selection NOT shown for Environment Visual */}
                    {!isEnvironmentVisual && (
                        <IconSelection
                            useCustomIcon={useCustomIcon}
                            setUseCustomIcon={setUseCustomIcon}
                        />
                    )}

                    {(isEnvironmentSound || isMindSession || isEnvironmentVisual) && <CoverImage />}

                    <VisibilitySettings />
                    <AccessLevels />
                </div>

                {/* Footer */}
                <div className="flex flex-col-reverse justify-end gap-3 pt-6 mt-6 border-t border-gray-100 dark:border-gray-800 sm:flex-row">
                    <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
                        Cancel
                    </Button>
                    <Button variant="outline" className="w-full sm:w-auto">
                        Save
                    </Button>
                    <Button variant="primary" onClick={onClose} className="w-full sm:w-auto bg-[#9810FA] border border-[#9810FA] hover:bg-[#8000E0]">
                        Save & Publish
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default AddMusicModal;
