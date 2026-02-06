import React from "react";
import { MoreVertical, Trash2, Edit2, ExternalLink } from "lucide-react";

interface ImageCardProps {
    url: string;
    name: string;
    size: string;
    dimensions: string;
}

const ImageCard: React.FC<ImageCardProps> = ({ url, name, size, dimensions }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden group transition-all hover:shadow-md">
            <div className="aspect-video relative overflow-hidden bg-gray-100 dark:bg-gray-900">
                <img src={url} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button className="p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-lg text-white transition-colors">
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-lg text-white transition-colors">
                        <ExternalLink className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-red-500/80 hover:bg-red-500 backdrop-blur-md rounded-lg text-white transition-colors">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
            <div className="p-4">
                <div className="flex items-start justify-between">
                    <div>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[150px]">{name}</h4>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wide mt-1">{dimensions} • {size}</p>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <MoreVertical className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageCard;
