import React, { useState } from "react";
import Switch from "@/components/form/switch/Switch";
import Label from "@/components/form/Label";
import UploadIconModal from "./UploadIconModal";
import { apiClient } from "@/lib/api";
import {
    Waves,
    CloudRain,
    Trees,
    CloudLightning,
    Flame,
    Wind,
    Bell,
    Guitar,
    Music,
    Sparkles,
    CloudDrizzle,
    AudioWaveform,
    Upload,
    Check,
    Loader2,
    X,
    Image as ImageIcon,
} from "lucide-react";

interface LibraryIcon {
    id: number;
    url: string;
    name: string;
}

interface IconSelectionProps {
    useCustomIcon: boolean;
    setUseCustomIcon: (value: boolean) => void;
    selectedIconId: number | null;
    onIconIdChange: (id: number | null) => void;
    iconFile: File | null;
    onIconFileChange: (file: File | null) => void;
    initialIconUrl?: string | null;
}

const IconSelection: React.FC<IconSelectionProps> = ({
    useCustomIcon,
    setUseCustomIcon,
    selectedIconId,
    onIconIdChange,
    iconFile,
    onIconFileChange,
    initialIconUrl,
}) => {
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    // Icon library browser state
    const [isLibraryOpen, setIsLibraryOpen] = useState(false);
    const [libraryIcons, setLibraryIcons] = useState<LibraryIcon[]>([]);
    const [isLoadingLibrary, setIsLoadingLibrary] = useState(false);

    // Local preview for uploaded file
    const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);

    const openLibrary = async () => {
        setIsLibraryOpen(true);
        if (libraryIcons.length > 0) return;
        setIsLoadingLibrary(true);
        try {
            const res = await apiClient.get<{ results?: LibraryIcon[] } | LibraryIcon[]>(
                "admin/media/images/",
                { params: { media_type: "icon", size: 50 } }
            );
            const data = res.data;
            setLibraryIcons(Array.isArray(data) ? data : (data.results ?? []));
        } catch {
            // silently fail — library shows empty
        } finally {
            setIsLoadingLibrary(false);
        }
    };

    const handleIconFileSelected = (file: File) => {
        if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
        const url = URL.createObjectURL(file);
        setFilePreviewUrl(url);
        onIconFileChange(file);
        onIconIdChange(null);
    };

    const handleLibraryIconSelect = (icon: LibraryIcon) => {
        onIconIdChange(icon.id);
        onIconFileChange(null);
        if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
        setFilePreviewUrl(null);
        setIsLibraryOpen(false);
    };

    const clearIcon = () => {
        onIconIdChange(null);
        onIconFileChange(null);
        if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
        setFilePreviewUrl(null);
    };

    // Resolve what to show as the current icon preview
    const selectedLibraryIconUrl = selectedIconId
        ? libraryIcons.find((i) => i.id === selectedIconId)?.url
        : null;
    const currentIconDisplayUrl = filePreviewUrl ?? selectedLibraryIconUrl ?? initialIconUrl ?? null;
    const hasIcon = !!(iconFile || selectedIconId);

    const iconGrid = [
        { name: "Soft Noise", icon: <AudioWaveform className="w-5 h-5" /> },
        { name: "Rainfall",   icon: <CloudRain className="w-5 h-5" /> },
        { name: "Forests",    icon: <Trees className="w-5 h-5" /> },
        { name: "Waves",      icon: <Waves className="w-5 h-5" /> },
        { name: "Thunderstorm", icon: <CloudLightning className="w-5 h-5" /> },
        { name: "Crackling Fire", icon: <Flame className="w-5 h-5" /> },
        { name: "Wind",       icon: <Wind className="w-5 h-5" /> },
        { name: "Ocean Breeze", icon: <Wind className="w-5 h-5" /> },
        { name: "Night Music", icon: <Sparkles className="w-5 h-5" /> },
        { name: "Forest Rainfall", icon: <CloudDrizzle className="w-5 h-5" /> },
        { name: "Bell Music", icon: <Bell className="w-5 h-5" /> },
        { name: "Guitar",     icon: <Guitar className="w-5 h-5" /> },
    ];

    return (
        <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Icon Selection
            </h3>
            <div className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-gray-800 pb-4">
                <div className="flex items-center gap-3">
                    {currentIconDisplayUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={currentIconDisplayUrl} alt="Selected icon" className="w-6 h-6 rounded object-cover" />
                    ) : (
                        <Music className="w-6 h-6 text-gray-900 dark:text-white" />
                    )}
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        {hasIcon ? "Custom Icon Selected" : "Default Music Icon"}
                    </p>
                    {hasIcon && (
                        <button
                            type="button"
                            onClick={clearIcon}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            title="Remove icon"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Use Custom Icon</span>
                    <Switch
                        label=""
                        defaultChecked={useCustomIcon}
                        onChange={setUseCustomIcon}
                        color="blue"
                    />
                </div>
            </div>

            {useCustomIcon && (
                <div className="space-y-6 pt-4 animate-fadeIn">
                    {/* Preset icon grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {iconGrid.map((item, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => setSelectedIndex(index === selectedIndex ? null : index)}
                                className={`flex flex-col items-center justify-center p-3 gap-2 rounded-xl border transition-all group ${
                                    selectedIndex === index
                                        ? "border-[#9810FA] bg-[#9810FA]/10 text-[#9810FA]"
                                        : "border-gray-200 dark:border-gray-700 hover:border-[#9810FA] hover:bg-[#9810FA]/5 bg-white dark:bg-gray-800"
                                }`}
                            >
                                <div className={selectedIndex === index ? "text-[#9810FA]" : "text-gray-600 dark:text-gray-400 group-hover:text-[#9810FA]"}>
                                    {item.icon}
                                </div>
                                <span className={`text-xs font-medium ${selectedIndex === index ? "text-[#9810FA]" : "text-gray-600 dark:text-gray-400 group-hover:text-[#9810FA]"}`}>
                                    {item.name}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Upload or Library pick */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Upload Custom Icon</Label>
                            <button
                                type="button"
                                onClick={() => setIsUploadModalOpen(true)}
                                className="flex items-center justify-center w-full h-12 bg-gray-50/50 dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors gap-2"
                            >
                                <Upload className="w-5 h-5 text-gray-400" />
                                <span className="text-sm font-medium text-gray-500">
                                    {iconFile ? iconFile.name.slice(0, 18) + (iconFile.name.length > 18 ? "…" : "") : "Upload Icon"}
                                </span>
                                {iconFile && <Check className="w-4 h-4 text-green-500 ml-1" />}
                            </button>
                        </div>
                        <div className="space-y-2">
                            <Label>Icon Library</Label>
                            <button
                                type="button"
                                onClick={openLibrary}
                                className="flex items-center justify-center w-full h-12 bg-gray-50/50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors gap-2 text-gray-500"
                            >
                                <ImageIcon className="w-5 h-5" />
                                <span className="text-sm font-medium">
                                    {selectedIconId ? `Icon #${selectedIconId} selected` : "Browse Library"}
                                </span>
                                {selectedIconId && <Check className="w-4 h-4 text-green-500 ml-1" />}
                            </button>
                        </div>
                    </div>

                    {/* Inline Icon Library Panel */}
                    {isLibraryOpen && (
                        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">Icon Library</p>
                                <button
                                    type="button"
                                    onClick={() => setIsLibraryOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {isLoadingLibrary ? (
                                <div className="flex items-center justify-center py-8 gap-2 text-gray-400">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span className="text-sm">Loading icons…</span>
                                </div>
                            ) : libraryIcons.length === 0 ? (
                                <p className="text-sm text-gray-400 text-center py-6">
                                    No icons in library yet. Upload icons via MP Gallery.
                                </p>
                            ) : (
                                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto pr-1">
                                    {libraryIcons.map((icon) => (
                                        <button
                                            key={icon.id}
                                            type="button"
                                            onClick={() => handleLibraryIconSelect(icon)}
                                            title={icon.name}
                                            className={`relative aspect-square rounded-xl border-2 overflow-hidden transition-all ${
                                                selectedIconId === icon.id
                                                    ? "border-[#9810FA] ring-2 ring-[#9810FA]/30"
                                                    : "border-gray-200 dark:border-gray-700 hover:border-[#9810FA]"
                                            }`}
                                        >
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={icon.url} alt={icon.name} className="w-full h-full object-contain p-1 bg-white dark:bg-gray-800" />
                                            {selectedIconId === icon.id && (
                                                <div className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#9810FA] rounded-full flex items-center justify-center">
                                                    <Check className="w-2.5 h-2.5 text-white" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            <UploadIconModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onIconSelected={handleIconFileSelected}
            />
        </div>
    );
};

export default IconSelection;
