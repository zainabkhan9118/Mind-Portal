import React, { useRef, useState } from "react";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { Upload, X } from "lucide-react";
import Button from "@/components/ui/button/Button";

interface BasicInfoProps {
    isEnvironmentSound?: boolean;
    isMindSession?: boolean;
    isEnvironmentVisual?: boolean;
    onCreateSubCategory?: () => void;
    title: string;
    onTitleChange: (v: string) => void;
    artist: string;
    onArtistChange: (v: string) => void;
    categoryId: string;
    onCategoryChange: (v: string) => void;
    categories: { id: number; name: string }[];
    details: string;
    onDetailsChange: (v: string) => void;
    audioFile: File | null;
    onAudioFileChange: (f: File | null) => void;
    onDurationExtracted?: (seconds: number) => void;
}

const BasicInfo: React.FC<BasicInfoProps> = ({
    isEnvironmentSound = false,
    isMindSession = false,
    isEnvironmentVisual = false,
    // onCreateSubCategory,
    title,
    onTitleChange,
    artist,
    onArtistChange,
    categoryId,
    onCategoryChange,
    categories,
    details,
    onDetailsChange,
    audioFile,
    onAudioFileChange,
    onDurationExtracted,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const acceptType = isEnvironmentVisual ? "video/*" : "audio/*";

    const extractDuration = (file: File) => {
        if (isEnvironmentVisual || !onDurationExtracted) return;
        const url = URL.createObjectURL(file);
        const audio = document.createElement("audio");
        audio.preload = "metadata";
        audio.onloadedmetadata = () => {
            if (isFinite(audio.duration)) {
                onDurationExtracted(Math.round(audio.duration));
            }
            URL.revokeObjectURL(url);
        };
        audio.src = url;
    };

    const handleFileSelect = (file: File) => {
        onAudioFileChange(file);
        extractDuration(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFileSelect(file);
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                    Basic Info
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                            type="text"
                            id="title"
                            placeholder="Placeholder"
                            value={title}
                            onChange={(e) => onTitleChange(e.target.value)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="artist">
                            {isEnvironmentSound ? "Type" : (isMindSession ? "Voice (Name of Professional)" : (isEnvironmentVisual ? "Author" : "Artist"))}
                        </Label>
                        <Input
                            type="text"
                            id="artist"
                            placeholder="Placeholder"
                            value={artist}
                            onChange={(e) => onArtistChange(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Add Files Section */}
            <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                    {isEnvironmentVisual ? "Add Video File" : "Add Audio File"}
                </h3>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={acceptType}
                    className="hidden"
                    onChange={(e) => {
                        const file = e.target.files?.[0] ?? null;
                        if (file) handleFileSelect(file);
                        else onAudioFileChange(null);
                        e.target.value = "";
                    }}
                />
                {audioFile ? (
                    <div className="flex items-center justify-between w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-800">
                        <div className="flex items-center gap-3 min-w-0">
                            <Upload className="w-5 h-5 text-[#9810FA] shrink-0" />
                            <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{audioFile.name}</span>
                            <span className="text-xs text-gray-400 shrink-0">({(audioFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                        </div>
                        <button type="button" onClick={() => onAudioFileChange(null)} className="ml-2 text-gray-400 hover:text-red-500 shrink-0">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl transition-colors group cursor-pointer ${isDragging ? "border-[#9810FA] bg-purple-50 dark:bg-purple-900/10" : "border-gray-200 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-800/30 hover:bg-gray-50"}`}
                    >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-3 group-hover:scale-110 transition-transform">
                                <Upload className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Drag & drop a file here, or click to upload</p>
                            <Button className="bg-[#9810FA] hover:bg-[#8000E0] text-white border-none py-2 px-6 text-sm rounded-xl">
                                Browse Files
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <div>
                <Label htmlFor="addDetail">Add Detail</Label>
                <Input
                    type="text"
                    id="addDetail"
                    placeholder="Placeholder"
                    value={details}
                    onChange={(e) => onDetailsChange(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <Label htmlFor="category">Category</Label>
                    <select
                        id="category"
                        value={categoryId}
                        onChange={(e) => onCategoryChange(e.target.value)}
                        className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20 bg-transparent text-gray-800 dark:text-white border-gray-300 dark:border-gray-700 dark:bg-gray-900"
                    >
                        <option value="">Select category...</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
                        ))}
                    </select>
                </div>
                {/* <div>
                    <div className="flex items-center justify-between mb-0">
                        <Label htmlFor="subCategory" className="mb-0">Sub Category</Label>
                        {(isEnvironmentSound || isMindSession || isEnvironmentVisual) && onCreateSubCategory && (
                            <button
                                type="button"
                                onClick={onCreateSubCategory}
                                className="text-[11px] font-medium text-[#9810FA] hover:text-[#8000E0]"
                            >
                                Create new Sub Category
                            </button>
                        )}
                    </div>
                    <Input type="text" id="subCategory" placeholder="Placeholder" />
                </div> */}
            </div>
        </div>
    );
};

export default BasicInfo;