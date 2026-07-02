"use client";
import React, { useEffect, useRef, useState } from "react";
import { Upload, Trash2, Image as ImageIcon, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api";

interface GalleryImage {
    id: number;
    url: string;
    name: string;
    filename: string;
    size_bytes: number;
    media_type: 'image' | 'icon';
    created_at: string;
}

const ImagesManagement: React.FC = () => {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        apiClient
            .get<{ results: GalleryImage[] } | GalleryImage[]>("admin/media/images/", { params: { media_type: 'image', size: 100 } })
            .then((res) => {
                const data = res.data;
                setImages(Array.isArray(data) ? data : (data.results ?? []));
            })
            .catch((err) => {
                // 404 means endpoint not deployed yet — show empty state silently
                if (err?.response?.status !== 404) {
                    setError("Failed to load gallery images.");
                }
            })
            .finally(() => setIsLoading(false));
    }, []);

    const handleUpload = async (file: File) => {
        setIsUploading(true);
        setError(null);
        const fd = new FormData();
        fd.append("image", file);
        fd.append("name", file.name.replace(/\.[^/.]+$/, ""));
        fd.append("media_type", "image");
        try {
            const res = await apiClient.post<GalleryImage>("admin/media/images/", fd);
            setImages((prev) => [res.data, ...prev]);
        } catch (err: unknown) {
            const status = (err as { response?: { status?: number } })?.response?.status;
            setError(status === 404 ? "Image upload endpoint is not yet available." : "Upload failed. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (id: number) => {
        setDeletingIds((prev) => new Set(prev).add(id));
        try {
            await apiClient.delete(`admin/media/images/${id}/`);
            setImages((prev) => prev.filter((img) => img.id !== id));
        } catch (err: unknown) {
            const status = (err as { response?: { status?: number } })?.response?.status;
            setError(status === 404 ? "Delete endpoint is not yet available." : "Delete failed. Please try again.");
        } finally {
            setDeletingIds((prev) => {
                const next = new Set(prev);
                next.delete(id);
                return next;
            });
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden animate-in fade-in duration-500">
            <div className="p-8 pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                            <ImageIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Mind Player&apos;s Gallery</h2>
                        </div>
                    </div>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="flex items-center gap-2 px-4 py-2 bg-[#9810FA] hover:bg-[#8000E0] text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-60"
                    >
                        {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                        {isUploading ? "Uploading…" : "Upload Image"}
                    </button>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 ml-14">
                    Images available for users to use across the platform
                </p>
                {error && <p className="text-xs text-red-500 mt-2 ml-14">{error}</p>}
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUpload(file);
                    e.target.value = "";
                }}
            />

            <div className="border-t border-gray-100 dark:border-gray-700 mx-8" />

            <div className="p-8">
                {isLoading ? (
                    <div className="flex items-center justify-center py-16 text-gray-400 gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="text-sm">Loading gallery…</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 auto-rows-fr">
                        {images.map((img) => (
                            <div key={img.id} className="group relative aspect-video rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={img.url} alt={img.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                                <span className="absolute bottom-2 left-2 text-xs font-bold text-white leading-tight pr-10">{img.name}</span>
                                <button
                                    onClick={() => handleDelete(img.id)}
                                    disabled={deletingIds.has(img.id)}
                                    className="absolute top-2 right-2 p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors disabled:opacity-50 shadow-md"
                                >
                                    {deletingIds.has(img.id)
                                        ? <Loader2 className="w-4 h-4 animate-spin" />
                                        : <Trash2 className="w-4 h-4" />
                                    }
                                </button>
                            </div>
                        ))}

                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className="aspect-video rounded-xl border-2 border-dashed border-gray-100 dark:border-gray-700 hover:border-purple-600 hover:bg-purple-50/50 dark:hover:bg-purple-900/10 transition-all flex flex-col items-center justify-center gap-2 group disabled:opacity-50"
                        >
                            <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded-xl group-hover:bg-white dark:group-hover:bg-purple-900/30 transition-colors shadow-xs">
                                <ImageIcon className="w-5 h-5 text-gray-400 group-hover:text-purple-600" />
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 group-hover:text-purple-600 uppercase tracking-widest">Upload New</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImagesManagement;
