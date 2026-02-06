import React from "react";
import { Upload, Search, Filter, Plus } from "lucide-react";
import ImageCard from "./images/ImageCard";

const ImagesManagement: React.FC = () => {
    const images = [
        { id: "1", name: "Zen Garden Background", url: "https://images.unsplash.com/photo-1542002422-96d20bc16298?q=80&w=800&auto=format&fit=crop", size: "1.2 MB", dimensions: "1920x1080" },
        { id: "2", name: "Misty Mountains", url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop", size: "2.4 MB", dimensions: "3840x2160" },
        { id: "3", name: "Ocean Waves", url: "https://images.unsplash.com/photo-1505118380757-91f5f45d8de0?q=80&w=800&auto=format&fit=crop", size: "850 KB", dimensions: "1280x720" },
        { id: "4", name: "Forest Path", url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=800&auto=format&fit=crop", size: "1.8 MB", dimensions: "2560x1440" },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header / Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search images..."
                            className="pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 w-full md:w-64 transition-all"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 transition-all">
                        <Filter className="w-4 h-4" />
                        All Formats
                    </button>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 transition-all">
                        <Upload className="w-4 h-4" />
                        Bulk Upload
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#9810FA] text-white rounded-xl text-sm font-bold hover:bg-[#8000E0] shadow-lg shadow-purple-500/20 transition-all">
                        <Plus className="w-4 h-4" />
                        Add Image
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {images.map((img) => (
                    <ImageCard key={img.id} {...img} />
                ))}
            </div>

            {/* Placeholder for empty state / more images */}
            <button className="w-full py-8 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-3xl text-gray-400 hover:border-purple-200 dark:hover:border-purple-900/40 hover:text-purple-500 transition-all font-medium">
                Click to upload or drag and drop more assets
            </button>
        </div>
    );
};

export default ImagesManagement;
