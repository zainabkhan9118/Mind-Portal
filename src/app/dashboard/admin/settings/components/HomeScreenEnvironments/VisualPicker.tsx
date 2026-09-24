import React, { useRef } from "react";
import { Image as ImageIcon, Check, Trash2, Upload, Loader2 } from "lucide-react";
import type { AdminEnvironmentVisual } from "@/lib/api/types";

interface VisualPickerProps {
    visuals: AdminEnvironmentVisual[];
    selectedVisualId: number | null;
    isLoading: boolean;
    isUploading: boolean;
    uploadError: string | null;
    onSelect: (id: number) => void;
    onUpload: (file: File) => void;
    onDeleteRequest: (id: number) => void;
}

const VisualPicker: React.FC<VisualPickerProps> = ({
    visuals,
    selectedVisualId,
    isLoading,
    isUploading,
    uploadError,
    onSelect,
    onUpload,
    onDeleteRequest,
}) => {
    const uploadInputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                        <ImageIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Select Visual</h2>
                </div>
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 text-[10px] font-bold uppercase tracking-wider rounded-full">Step 1</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Choose a 360° panoramic image</p>

            {isLoading ? (
                <div className="flex items-center justify-center py-12 text-gray-400 gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" /><span className="text-sm">Loading…</span>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4 pt-2 max-h-[480px] overflow-y-auto pr-1">
                    {visuals.map((env) => (
                        <div key={env.id}
                            className={`group relative aspect-[1.4/1] rounded-2xl overflow-hidden transition-all duration-300 ${selectedVisualId === env.id ? "ring-4 ring-purple-600 ring-offset-2 dark:ring-offset-gray-800 scale-[1.02]" : "hover:scale-[1.02]"}`}>
                            <button onClick={() => onSelect(env.id)} className="absolute inset-0 w-full h-full">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={env.image} alt={env.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                                {selectedVisualId === env.id && (
                                    <div className="absolute top-2 right-2 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                                        <Check className="w-3 h-3 text-white" />
                                    </div>
                                )}
                                <span className="absolute bottom-3 left-3 text-[11px] font-semibold text-white leading-none">{env.name}</span>
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); onDeleteRequest(env.id); }}
                                title="Delete visual"
                                className="absolute top-2 left-2 p-1.5 bg-black/50 hover:bg-red-500 text-white rounded-lg transition-colors">
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))}
                    <button onClick={() => uploadInputRef.current?.click()} disabled={isUploading}
                        className="aspect-[1.4/1] rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-purple-600 hover:bg-purple-50/50 dark:hover:bg-purple-900/10 transition-all flex flex-col items-center justify-center gap-3 group disabled:opacity-50">
                        <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-2xl group-hover:bg-white dark:group-hover:bg-purple-900/30 shadow-sm">
                            {isUploading ? <Loader2 className="w-5 h-5 text-purple-600 animate-spin" /> : <Upload className="w-5 h-5 text-gray-400 group-hover:text-purple-600" />}
                        </div>
                        <span className="text-[11px] font-bold text-gray-500 group-hover:text-purple-600 uppercase tracking-widest">
                            {isUploading ? "Uploading…" : "Upload New"}
                        </span>
                    </button>
                    <input ref={uploadInputRef} type="file" accept="image/*" className="hidden"
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) onUpload(f); e.target.value = ""; }} />
                    {uploadError && <p className="col-span-2 text-xs text-red-500">{uploadError}</p>}
                </div>
            )}
        </div>
    );
};

export default VisualPicker;
