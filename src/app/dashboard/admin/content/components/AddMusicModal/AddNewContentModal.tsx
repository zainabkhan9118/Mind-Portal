"use client";
import React, { useRef, useState } from "react";
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
    X,
    Image as ImageIcon,
} from "lucide-react";

interface AddNewContentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    activeTab?: string;
}

const TAB_TO_TYPE: Record<string, string> = {
    "Music": "music",
    "Environment Sound": "env_sound",
    "Mind Sessions": "mind_session",
    "Environment Visual": "env_visual",
    "Minds": "mind",
};

const ICON_GRID: { name: string; icon: React.ReactNode; paths: string }[] = [
    {
        name: "Soft Noise",
        icon: <AudioWaveform className="w-5 h-5" />,
        paths: '<path d="M2 13a2 2 0 0 0 2-2V7a2 2 0 0 1 4 0v13a2 2 0 0 0 4 0V4a2 2 0 0 1 4 0v13a2 2 0 0 0 4 0v-4a2 2 0 0 0-2-2"/>',
    },
    {
        name: "Rainfall",
        icon: <CloudRain className="w-5 h-5" />,
        paths: '<path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/>',
    },
    {
        name: "Forests",
        icon: <Trees className="w-5 h-5" />,
        paths: '<path d="M10 10v.2A3 3 0 0 1 8.9 16H5a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z"/><path d="M7 16v6"/><path d="M13 19v3"/><path d="M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.6l-5-6a1 1 0 0 0-1.6 0L7.3 6.8"/>',
    },
    {
        name: "Waves",
        icon: <Waves className="w-5 h-5" />,
        paths: '<path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>',
    },
    {
        name: "Thunderstorm",
        icon: <CloudLightning className="w-5 h-5" />,
        paths: '<path d="M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973"/><path d="m13 12-3 5h4l-3 5"/>',
    },
    {
        name: "Crackling Fire",
        icon: <Flame className="w-5 h-5" />,
        paths: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
    },
    {
        name: "Wind",
        icon: <Wind className="w-5 h-5" />,
        paths: '<path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/>',
    },
    {
        name: "Ocean Breeze",
        icon: <Wind className="w-5 h-5" />,
        paths: '<path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/>',
    },
    {
        name: "Night Music",
        icon: <Sparkles className="w-5 h-5" />,
        paths: '<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>',
    },
    {
        name: "Forest Rainfall",
        icon: <CloudDrizzle className="w-5 h-5" />,
        paths: '<path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M8 19v1"/><path d="M8 14v1"/><path d="M16 19v1"/><path d="M16 14v1"/><path d="M12 21v1"/><path d="M12 16v1"/>',
    },
    {
        name: "Bell Music",
        icon: <Bell className="w-5 h-5" />,
        paths: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
    },
    {
        name: "Guitar",
        icon: <Guitar className="w-5 h-5" />,
        paths: '<path d="m11.9 12.1 4.514-4.514"/><path d="M20.1 2.3a1 1 0 0 0-1.4 0l-.9.9a1 1 0 0 0 0 1.4l1.5 1.5a1 1 0 0 0 1.4 0l.9-.9a1 1 0 0 0 0-1.4Z"/><path d="m22 2-1.5 1.5"/><path d="M6.9 11.1a4.001 4.001 0 0 0 5.8 5.5"/><path d="M6.9 11.1l1.4-1.4a4 4 0 0 1 5.7 5.6l-1.4 1.4"/><circle cx="7" cy="17" r="3"/>',
    },
];

function buildSvgFile(paths: string, name: string): { file: File; previewUrl: string } {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const file = new File([blob], `${name.toLowerCase().replace(/\s+/g, "-")}.svg`, { type: "image/svg+xml" });
    return { file, previewUrl: URL.createObjectURL(blob) };
}

const AddNewContentModal: React.FC<AddNewContentModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    activeTab = "Music",
}) => {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(0);
    const [iconFile, setIconFile] = useState<File | null>(null);
    const [iconPreviewUrl, setIconPreviewUrl] = useState<string | null>(null);
    const [categoryName, setCategoryName] = useState("");
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isCustomUpload = selectedIndex === null && !!iconFile;

    const handlePresetClick = (index: number) => {
        if (iconPreviewUrl) URL.revokeObjectURL(iconPreviewUrl);
        const item = ICON_GRID[index];
        const { file, previewUrl } = buildSvgFile(item.paths, item.name);
        setIconFile(file);
        setIconPreviewUrl(previewUrl);
        setSelectedIndex(index);
    };

    const handleCustomIconSelect = (file: File) => {
        if (iconPreviewUrl) URL.revokeObjectURL(iconPreviewUrl);
        setIconFile(file);
        setIconPreviewUrl(URL.createObjectURL(file));
        setSelectedIndex(null);
    };

    const clearCustomIcon = () => {
        if (iconPreviewUrl) URL.revokeObjectURL(iconPreviewUrl);
        setIconFile(null);
        setIconPreviewUrl(null);
        setSelectedIndex(null);
    };

    const resetForm = () => {
        setCategoryName("");
        setSelectedIndex(0);
        if (iconPreviewUrl) URL.revokeObjectURL(iconPreviewUrl);
        setIconFile(null);
        setIconPreviewUrl(null);
        setSubmitError(null);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;
        const trimmedName = categoryName.trim();
        if (!trimmedName) {
            setSubmitError("Category name is required.");
            return;
        }
        setSubmitError(null);
        setIsSubmitting(true);
        try {
            const fd = new FormData();
            fd.append("name", trimmedName);
            if (iconFile) fd.append("icon", iconFile);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await contentApi.categories.create(fd as any, { type: TAB_TO_TYPE[activeTab] ?? "music" });
            resetForm();
            onSuccess?.();
            onClose();
        } catch (err) {
            console.error("Failed to create category:", err);
            setSubmitError("Failed to save. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const tabLabel =
        activeTab === "Mind Sessions" ? "Mind Session" :
        activeTab === "Environment Sound" ? "Environment Sound" :
        activeTab === "Environment Visual" ? "Environment Visual" :
        activeTab === "Minds" ? "Mind" :
        "Music";

    return (
        <Modal isOpen={isOpen} onClose={handleClose} className="max-w-[700px] m-4">
            <div className="relative flex flex-col w-full bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 overflow-hidden">
                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Add {tabLabel} Category
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Create a new category to organise your {tabLabel} content.
                    </p>
                </div>

                <div className="flex-1 space-y-8 overflow-y-auto max-h-[70vh] pr-2 custom-scrollbar pb-6">
                    {/* Category Name */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Basic Info</h3>
                        <div>
                            <Label htmlFor="categoryName">
                                Category Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="categoryName"
                                placeholder={`e.g., "Affirmations", "Mind Movies", "Stories"`}
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Icon — preset grid */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                            Category Icon{" "}
                            <span className="text-xs font-normal text-gray-400">(optional)</span>
                        </h3>

                        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                            {ICON_GRID.map((item, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => handlePresetClick(index)}
                                    className={`flex flex-col items-center justify-center p-3 gap-2 rounded-xl border transition-all group ${
                                        selectedIndex === index
                                            ? "border-purple-600 bg-purple-50 dark:bg-purple-900/20 text-purple-600"
                                            : "border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 hover:border-purple-200"
                                    }`}
                                >
                                    <div className={selectedIndex === index ? "text-purple-600" : "text-gray-400 group-hover:text-purple-400"}>
                                        {item.icon}
                                    </div>
                                    <span className="text-[10px] font-medium whitespace-nowrap">{item.name}</span>
                                </button>
                            ))}
                        </div>

                        {/* Custom upload */}
                        <div className="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-2">
                            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 pt-1">
                                Upload Custom Icon
                            </p>
                            <p className="text-xs text-gray-400">Upload from your device (SVG, PNG, JPG)</p>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".svg,.png,.jpg,.jpeg"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleCustomIconSelect(file);
                                    e.target.value = "";
                                }}
                            />

                            {isCustomUpload && iconFile ? (
                                <div className="flex items-center justify-between px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800">
                                    <div className="flex items-center gap-3 min-w-0">
                                        {iconPreviewUrl ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={iconPreviewUrl} alt="icon preview" className="w-6 h-6 object-contain shrink-0" />
                                        ) : (
                                            <ImageIcon className="w-5 h-5 text-[#9810FA] shrink-0" />
                                        )}
                                        <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{iconFile.name}</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={clearCustomIcon}
                                        className="ml-2 text-gray-400 hover:text-red-500 shrink-0"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex items-center justify-center w-full h-12 bg-gray-50/50 dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors gap-2"
                                >
                                    <Upload className="w-5 h-5 text-gray-400" />
                                    <span className="text-sm font-medium text-gray-400">Upload Icon</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {submitError && (
                    <p className="text-xs text-red-500 mt-4 px-1">{submitError}</p>
                )}

                <div className="flex flex-col-reverse justify-end gap-3 pt-6 mt-6 border-t border-gray-100 dark:border-gray-800 sm:flex-row">
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        className="w-full sm:w-auto px-10 rounded-xl py-2.5 h-auto text-sm font-medium"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full sm:w-auto bg-[#9810FA] border border-[#9810FA] hover:bg-[#8000E0] px-10 rounded-xl py-2.5 h-auto text-sm font-medium"
                    >
                        {isSubmitting ? "Saving…" : "Save Category"}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default AddNewContentModal;
