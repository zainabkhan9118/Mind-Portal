import React, { FC, useRef, useState, useEffect } from "react";
import { Image, X } from "lucide-react";

interface CoverImageProps {
    coverImageFile: File | null;
    onCoverImageFileChange: (f: File | null) => void;
    existingImageUrl?: string | null;
}

const CoverImage: FC<CoverImageProps> = ({ coverImageFile, onCoverImageFileChange, existingImageUrl }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [showExisting, setShowExisting] = useState(!!existingImageUrl);

    // Sync when existingImageUrl changes (e.g. modal re-opened for a different item)
    useEffect(() => {
        setShowExisting(!!existingImageUrl);
    }, [existingImageUrl]);

    const handleFile = (file: File) => {
        onCoverImageFileChange(file);
        if (preview) URL.revokeObjectURL(preview);
        setPreview(URL.createObjectURL(file));
        setShowExisting(false);
    };

    const handleClear = () => {
        onCoverImageFileChange(null);
        if (preview) URL.revokeObjectURL(preview);
        setPreview(null);
        setShowExisting(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    };

    const displayUrl = preview ?? (showExisting ? existingImageUrl : null);
    const displayLabel = coverImageFile?.name ?? (showExisting && existingImageUrl
        ? existingImageUrl.split("/").pop()?.split("?")[0] ?? "Current image"
        : null);

    return (
        <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Cover Image
            </h3>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                    e.target.value = "";
                }}
            />
            {displayUrl ? (
                <div className="relative w-full rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={displayUrl} alt="Cover preview" className="w-full h-48 object-cover" />
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute top-2 right-2 bg-white dark:bg-gray-800 rounded-full p-1 shadow hover:bg-red-50"
                    >
                        <X className="w-4 h-4 text-gray-500 hover:text-red-500" />
                    </button>
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-2 bg-gray-50 dark:bg-gray-800 text-xs text-gray-500 truncate cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        title="Click to replace"
                    >
                        {displayLabel ?? "Current image"} · <span className="text-[#9810FA]">Click to replace</span>
                    </div>
                </div>
            ) : (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className={`border border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-colors cursor-pointer ${isDragging ? "border-[#9810FA] bg-purple-50 dark:bg-purple-900/10" : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50"}`}
                >
                    <div className="w-10 h-10 mb-4 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <Image className="w-5 h-5 text-gray-400 dark:text-gray-300" />
                    </div>
                    <p className="text-sm text-gray-500 mb-4 dark:text-gray-400">
                        Drag & drop an image here, or click to upload
                    </p>
                    <button type="button" className="px-6 py-2.5 bg-[#9810FA] text-white text-sm font-medium rounded-lg hover:bg-[#8000E0] transition-colors">
                        Browse Files
                    </button>
                </div>
            )}
        </div>
    );
};

export default CoverImage;
