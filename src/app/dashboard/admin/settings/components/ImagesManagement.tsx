import React from "react";
import { Upload, Trash2, Image as ImageIcon } from "lucide-react";

const ImagesManagement: React.FC = () => {
    const images = [
        { id: "1", name: "Serene Beach Sunset", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=400" },
        { id: "2", name: "Mountain Peak", url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=400" },
        { id: "3", name: "Serene Beach Sunset", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=400" },
        { id: "4", name: "Mountain Peak", url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=400" },
        { id: "5", name: "Serene Beach Sunset", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=400" },
        { id: "6", name: "Mountain Peak", url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=400" },
        { id: "7", name: "Serene Beach Sunset", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=400" },
        { id: "8", name: "Deep Forest", url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=400" },
        { id: "9", name: "Urban Night", url: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=400" },
        { id: "10", name: "Deep Forest", url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=400" },
        { id: "11", name: "Urban Night", url: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=400" },
        { id: "12", name: "Deep Forest", url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=400" },
        { id: "13", name: "Urban Night", url: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=400" },
        { id: "14", name: "Deep Forest", url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=400" },
        { id: "15", name: "Desert Dunes", url: "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&q=80&w=400" },
        { id: "16", name: "Arctic Aurora", url: "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?auto=format&fit=crop&q=80&w=400" },
        { id: "17", name: "Desert Dunes", url: "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&q=80&w=400" },
        { id: "18", name: "Arctic Aurora", url: "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?auto=format&fit=crop&q=80&w=400" },
        { id: "19", name: "Desert Dunes", url: "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&q=80&w=400" },
        { id: "20", name: "Arctic Aurora", url: "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?auto=format&fit=crop&q=80&w=400" },
        { id: "21", name: "Desert Dunes", url: "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&q=80&w=400" },
    ];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden animate-in fade-in duration-500">
            {/* Header */}
            <div className="p-8 pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                        <ImageIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Mind Player's Gallery</h2>
                    </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 ml-14">Images available for users to use across the platform</p>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-700 mx-8" />

            {/* Grid */}
            <div className="p-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 auto-rows-fr">
                    {images.map((img) => (
                        <div key={img.id} className="group relative aspect-video rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                            <img src={img.url} alt={img.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                            <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white leading-tight pr-2">{img.name}</span>
                            <button className="absolute top-2 right-2 p-1.5 text-white/60 hover:text-white transition-colors">
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))}

                    {/* Upload New Card */}
                    <button className="aspect-video rounded-xl border-2 border-dashed border-gray-100 dark:border-gray-700 hover:border-purple-600 hover:bg-purple-50/50 dark:hover:bg-purple-900/10 transition-all flex flex-col items-center justify-center gap-2 group">
                        <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded-xl group-hover:bg-white dark:group-hover:bg-purple-900/30 transition-colors shadow-xs">
                            <ImageIcon className="w-4 h-4 text-gray-400 group-hover:text-purple-600" />
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 group-hover:text-purple-600 uppercase tracking-widest">Upload New</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImagesManagement;
