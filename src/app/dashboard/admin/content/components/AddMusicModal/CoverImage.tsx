import React, { FC } from "react";
import { Image } from "lucide-react";

const CoverImage: FC = () => {
    return (
        <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Cover Image
            </h3>
            <div className="border border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="w-10 h-10 mb-4 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <Image className="w-5 h-5 text-gray-400 dark:text-gray-300" />
                </div>
                <p className="text-sm text-gray-500 mb-4 dark:text-gray-400">
                    Drag & drop an image here, or click to upload
                </p>
                <button className="px-6 py-2.5 bg-[#9810FA] text-white text-sm font-medium rounded-lg hover:bg-[#8000E0] transition-colors">
                    Browse Files
                </button>
            </div>
        </div>
    );
};

export default CoverImage;
