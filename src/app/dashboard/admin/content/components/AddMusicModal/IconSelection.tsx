import React, { useState, useEffect } from "react";
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

// SVG inner paths for each preset icon — used to build uploadable File objects
// without needing to read from the DOM.
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
    const svgContent = [
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"',
        ' viewBox="0 0 24 24" fill="none" stroke="currentColor"',
        ' stroke-width="2" stroke-linecap="round" stroke-linejoin="round">',
        paths,
        "</svg>",
    ].join("");
    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const fileName = name.toLowerCase().replace(/\s+/g, "-") + ".svg";
    const file = new File([blob], fileName, { type: "image/svg+xml" });
    return { file, previewUrl: URL.createObjectURL(file) };
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
    // Default to Soft Noise (index 0)
    const [selectedIndex, setSelectedIndex] = useState<number | null>(0);

    // Icon library browser state
    const [isLibraryOpen, setIsLibraryOpen] = useState(false);
    const [libraryIcons, setLibraryIcons] = useState<LibraryIcon[]>([]);
    const [isLoadingLibrary, setIsLoadingLibrary] = useState(false);

    const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);

    // When the toggle is turned on, auto-select Soft Noise if no icon is already set
    useEffect(() => {
        if (!useCustomIcon) return;
        if (iconFile || selectedIconId || initialIconUrl) return;
        const { file, previewUrl } = buildSvgFile(ICON_GRID[0].paths, ICON_GRID[0].name);
        setFilePreviewUrl(previewUrl);
        onIconFileChange(file);
        onIconIdChange(null);
        setSelectedIndex(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [useCustomIcon]);

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

    // Called by UploadIconModal — resets preset selection
    const handleIconFileSelected = (file: File) => {
        if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
        const url = URL.createObjectURL(file);
        setFilePreviewUrl(url);
        onIconFileChange(file);
        onIconIdChange(null);
        setSelectedIndex(null);
    };

    const handlePresetClick = (index: number) => {
        if (selectedIndex === index) {
            clearIcon();
            return;
        }
        const item = ICON_GRID[index];
        const { file, previewUrl } = buildSvgFile(item.paths, item.name);
        if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
        setFilePreviewUrl(previewUrl);
        onIconFileChange(file);
        onIconIdChange(null);
        setSelectedIndex(index);
    };

    const handleLibraryIconSelect = (icon: LibraryIcon) => {
        onIconIdChange(icon.id);
        onIconFileChange(null);
        if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
        setFilePreviewUrl(null);
        setIsLibraryOpen(false);
        setSelectedIndex(null);
    };

    const clearIcon = () => {
        onIconIdChange(null);
        onIconFileChange(null);
        if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
        setFilePreviewUrl(null);
        setSelectedIndex(null);
    };

    const selectedLibraryIconUrl = selectedIconId
        ? libraryIcons.find((i) => i.id === selectedIconId)?.url
        : null;
    const currentIconDisplayUrl = filePreviewUrl ?? selectedLibraryIconUrl ?? initialIconUrl ?? null;
    const hasIcon = !!(iconFile || selectedIconId);

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
                        {ICON_GRID.map((item, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => handlePresetClick(index)}
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
                                    {iconFile && selectedIndex === null
                                        ? iconFile.name.slice(0, 18) + (iconFile.name.length > 18 ? "…" : "")
                                        : "Upload Icon"}
                                </span>
                                {iconFile && selectedIndex === null && <Check className="w-4 h-4 text-green-500 ml-1" />}
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
