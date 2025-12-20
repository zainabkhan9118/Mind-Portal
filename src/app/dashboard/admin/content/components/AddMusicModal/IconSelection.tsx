import React, { useState } from "react";
import Switch from "@/components/form/switch/Switch";
import Label from "@/components/form/Label";
import UploadIconModal from "./UploadIconModal";
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
    Search,
    Plus
} from "lucide-react";

interface IconSelectionProps {
    useCustomIcon: boolean;
    setUseCustomIcon: (value: boolean) => void;
}

const IconSelection: React.FC<IconSelectionProps> = ({
    useCustomIcon,
    setUseCustomIcon,
}) => {
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

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

    return (
        <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Icon Selection
            </h3>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400">
                        <Music className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                            Default Music Icon
                        </p>
                    </div>
                </div>
                <Switch
                    label="Use Custom Icon"
                    defaultChecked={useCustomIcon}
                    onChange={setUseCustomIcon}
                    color="blue"
                />
            </div>

            {useCustomIcon && (
                <div className="space-y-6 pt-2 mt-4 animate-fadeIn">

                    {/* Icon Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {iconGrid.map((item, index) => (
                            <button
                                key={index}
                                className="flex flex-col items-center justify-center p-3 gap-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-[#9810FA] hover:bg-[#9810FA]/5 transition-all group bg-white dark:bg-gray-800"
                            >
                                <div className="text-gray-600 dark:text-gray-400 group-hover:text-[#9810FA]">
                                    {item.icon}
                                </div>
                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400 group-hover:text-[#9810FA]">
                                    {item.name}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Upload Custom Icon */}
                    <div className="space-y-3">
                        <Label>Upload Custom Icon</Label>
                        <p className="text-xs text-gray-500 mb-2">Upload an icon from your device (SVG, PNG, JPG)</p>
                        <button
                            onClick={() => setIsUploadModalOpen(true)}
                            className="flex items-center justify-center w-full h-12 bg-gray-50 dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors group"
                        >
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                <Upload className="w-5 h-5 mb-0.5" />
                                <span className="text-sm font-medium">Upload Icon</span>
                            </div>
                        </button>
                    </div>

                    {/* Choose from Icon Library */}
                    <div className="space-y-3">
                        <Label>Choose from Icon Library</Label>
                        <p className="text-xs text-gray-500 mb-2">Search and select from a vast icon library</p>
                        <button className="flex items-center justify-center w-full h-12 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors text-gray-500 dark:text-gray-400 gap-2">
                            <Plus className="w-5 h-5 bg-gray-300 dark:bg-gray-600 text-white rounded-[4px] p-0.5" />
                            <span className="text-sm font-medium">Browse Icon Library</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Upload Modal */}
            <UploadIconModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
            />
        </div>
    );
};

export default IconSelection;
