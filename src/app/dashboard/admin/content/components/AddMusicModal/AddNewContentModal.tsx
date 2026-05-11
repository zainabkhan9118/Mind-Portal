import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { contentApi } from "@/lib/api";
import {
    Waves,
    CloudRain,
    Trees,
    CloudLightning,
    Flame,
    Wind,
    Bell,
    Guitar,
    Sparkles,
    CloudDrizzle,
    AudioWaveform,
    Upload,
    Plus,
    X
} from "lucide-react";

interface AddNewContentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    activeTab?: string;
}

const tabToType: Record<string, string> = {
    "Music": "music",
    "Environment Sound": "env_sound",
    "Mind Sessions": "guided_session",
    "Environment Visual": "env_visual",
};

const AddNewContentModal: React.FC<AddNewContentModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    activeTab = "Music",
}) => {
    const [selectedIcon, setSelectedIcon] = useState("Night Music");
    const [contentTypeName, setContentTypeName] = useState("");
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const iconGrid = [
        { name: "Soft Noise", icon: <AudioWaveform className="w-5 h-5" /> },
        { name: "Rainfall", icon: <CloudRain className="w-5 h-5" /> },
        { name: "Forests", icon: <Trees className="w-5 h-5" /> },
        { name: "Waves", icon: <Waves className="w-5 h-5" /> },
        { name: "Thunderstorm", icon: <CloudLightning className="w-5 h-5" /> },
        { name: "Crackling Fire", icon: <Flame className="w-5 h-5" /> },
        { name: "Wind", icon: <Wind className="w-5 h-5" /> },
        { name: "Ocean Breeze", icon: <Wind className="w-5 h-5" /> },
        { name: "Night Music", icon: <Sparkles className="w-5 h-5" /> },
        { name: "Forest Rainfall", icon: <CloudDrizzle className="w-5 h-5" /> },
        { name: "Bell Music", icon: <Bell className="w-5 h-5" /> },
        { name: "Guitar", icon: <Guitar className="w-5 h-5" /> },
    ];

    const handleSubmit = async () => {
        if (isSubmitting) {
            return;
        }
        const trimmedName = contentTypeName.trim();
        if (!trimmedName) {
            setSubmitError("Content type name is required.");
            return;
        }
        setSubmitError(null);
        setIsSubmitting(true);
        try {
            await contentApi.categories.create({ name: trimmedName }, { type: tabToType[activeTab] ?? "music" });
            setContentTypeName("");
            onSuccess?.();
            onClose();
        } catch (err) {
            console.error("Failed to create category:", err);
            setSubmitError("Failed to save. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4">
            <div className="relative flex flex-col w-full bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 overflow-hidden">
                {/* Header */}
                <div className="mb-6 flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            Add New Content
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Fill in the details to add a new music track to your collection.
                        </p>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 space-y-8 overflow-y-auto max-h-[70vh] pr-2 custom-scrollbar pb-6">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                            Basic Info
                        </h3>
                        <div>
                            <Label htmlFor="contentTypeName">Content Type Name</Label>
                            <Input
                                id="contentTypeName"
                                placeholder="e.g., “Affirmations,” “Mind Movies,” “Stories,” etc."
                                className="bg-gray-50/50 dark:bg-gray-800"
                                value={contentTypeName}
                                onChange={(event) => setContentTypeName(event.target.value)}
                            />
                        </div>
                    </div>

                    {/* Icon Selection */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                            Icon Selection
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                            {iconGrid.map((item, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedIcon(item.name)}
                                    className={`flex flex-col items-center justify-center p-3 gap-2 rounded-xl border transition-all group ${selectedIcon === item.name
                                            ? "border-purple-600 bg-purple-50 dark:bg-purple-900/20 text-purple-600"
                                            : "border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 hover:border-purple-200"
                                        }`}
                                >
                                    <div className={`${selectedIcon === item.name ? "text-purple-600" : "text-gray-400 group-hover:text-purple-400"}`}>
                                        {item.icon}
                                    </div>
                                    <span className="text-[10px] font-medium whitespace-nowrap">
                                        {item.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                        <div className="flex justify-end">
                            <Button className="bg-[#9810FA] hover:bg-[#8000E0] text-white border-none py-2 px-6 text-sm rounded-xl">
                                Set As Default Icon
                            </Button>
                        </div>
                    </div>

                    {/* Upload Custom Icon */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                            Upload Custom Icon
                        </h3>
                        <p className="text-xs text-gray-500 mb-2">Upload an icon from your device (SVG, PNG, JPG)</p>
                        <button
                            className="flex items-center justify-center w-full h-12 bg-gray-50/50 dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors gap-2"
                        >
                            <Upload className="w-5 h-5 text-gray-400" />
                            <span className="text-sm font-medium text-gray-400">Upload Icon</span>
                        </button>
                    </div>

                    {/* Choose from Icon Library */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                            Choose from Icon Library
                        </h3>
                        <p className="text-xs text-gray-500 mb-2">Search and select from a vast icon library</p>
                        <button className="flex items-center justify-center w-full h-12 bg-gray-50/50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors gap-2 text-gray-400">
                            <Plus className="w-5 h-5 bg-gray-300 dark:bg-gray-600 text-white rounded-[4px] p-0.5" />
                            <span className="text-sm font-medium">Browse Icon Library</span>
                        </button>
                    </div>
                </div>

                {submitError && (
                    <p className="text-xs text-red-500 mt-4 px-1">{submitError}</p>
                )}

                {/* Footer */}
                <div className="flex flex-col-reverse justify-end gap-3 pt-6 mt-6 border-t border-gray-100 dark:border-gray-800 sm:flex-row">
                    <Button variant="outline" onClick={onClose} className="w-full sm:w-auto px-10 rounded-xl py-2.5 h-auto text-sm font-medium">
                        Cancel
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full sm:w-auto px-10 rounded-xl py-2.5 h-auto text-sm font-medium"
                    >
                        Save
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full sm:w-auto bg-[#9810FA] border border-[#9810FA] hover:bg-[#8000E0] px-10 rounded-xl py-2.5 h-auto text-sm font-medium"
                    >
                        Save & Publish
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default AddNewContentModal;
