"use client";
import React, { useEffect, useState } from "react";
import { Brain, Music2, ShieldCheck } from "lucide-react";
import ValidationStats from "./validation/ValidationStats";
import ValidationItem, { ValidationItemData } from "./validation/ValidationItem";
import MindReviewModal from "./validation/MindReviewModal";
import PlaylistReviewModal from "./validation/PlaylistReviewModal";
import MindExpertsTab from "../../users/components/MindExpertsTab";
import contentApi from "@/lib/api/contentApi";
import type { AdminMindSession, AdminMusic } from "@/lib/api/types";

const ContentValidation: React.FC = () => {
    const [minds, setMinds] = useState<ValidationItemData[]>([]);
    const [playlists, setPlaylists] = useState<ValidationItemData[]>([]);
    const [mindsTotal, setMindsTotal] = useState(0);
    const [playlistsTotal, setPlaylistsTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [subTab, setSubTab] = useState<"minds" | "playlists" | "mind_experts">("playlists");
    const [selectedItem, setSelectedItem] = useState<ValidationItemData | null>(null);
    const [isMindModalOpen, setIsMindModalOpen] = useState(false);
    const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);

    useEffect(() => {
        Promise.all([
            contentApi.getAll({ status: 'review', type: 'mind_session', size: 20 }),
            contentApi.getAll({ status: 'review', type: 'music', size: 20 }),
        ]).then(([mindsRes, playlistsRes]) => {
            const mindItems = (mindsRes.results as AdminMindSession[]).map((item): ValidationItemData => ({
                id: String(item.id),
                type: 'mind',
                title: item.name,
                description: item.description ?? '',
                creator: item.artist ?? '',
                itemCount: item.steps?.length ?? 0,
                createdAt: item.created_at.split('T')[0],
                status: 'Pending',
                category: item.category_names || undefined,
            }));

            const playlistItems = (playlistsRes.results as AdminMusic[]).map((item): ValidationItemData => ({
                id: String(item.id),
                type: 'playlist',
                title: item.name,
                description: item.description ?? '',
                creator: item.artist ?? '',
                itemCount: 0,
                createdAt: item.created_at.split('T')[0],
                status: 'Pending',
                category: item.music_category_names || undefined,
            }));

            setMinds(mindItems);
            setPlaylists(playlistItems);
            setMindsTotal(mindsRes.count ?? 0);
            setPlaylistsTotal(playlistsRes.count ?? 0);
        }).catch(console.error).finally(() => setIsLoading(false));
    }, []);

    const handleReview = (item: ValidationItemData) => {
        setSelectedItem(item);
        if (item.type === "mind") {
            setIsMindModalOpen(true);
        } else {
            setIsPlaylistModalOpen(true);
        }
    };

    const currentItems = subTab === "minds" ? minds : playlists;

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Stats Header */}
            <ValidationStats
                total={mindsTotal + playlistsTotal}
                pendingMinds={mindsTotal}
                pendingPlaylists={playlistsTotal}
                isLoading={isLoading}
            />

            {/* Content Section */}
            <div className="space-y-8">
                {/* Sub Tab Switcher */}
                <div className="inline-flex p-1.5 bg-[#F5F5F5] dark:bg-gray-900/40 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-inner">
                    <button
                        onClick={() => setSubTab("minds")}
                        className={`flex items-center gap-2 px-10 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${subTab === "minds"
                            ? "bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 shadow-xl shadow-gray-200/50 dark:shadow-none transform scale-[1.02] border border-gray-100/50 dark:border-gray-700"
                            : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            }`}
                    >
                        <Brain className={`w-4 h-4 ${subTab === "minds" ? "text-purple-600 dark:text-purple-400" : "text-gray-400"}`} />
                        Minds
                    </button>
                    <button
                        onClick={() => setSubTab("playlists")}
                        className={`flex items-center gap-2 px-10 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${subTab === "playlists"
                            ? "bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 shadow-xl shadow-gray-200/50 dark:shadow-none transform scale-[1.02] border border-gray-100/50 dark:border-gray-700"
                            : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            }`}
                    >
                        <Music2 className={`w-4 h-4 ${subTab === "playlists" ? "text-purple-600 dark:text-purple-400" : "text-gray-400"}`} />
                        Playlist
                    </button>
                    <button
                        onClick={() => setSubTab("mind_experts")}
                        className={`flex items-center gap-2 px-10 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${subTab === "mind_experts"
                            ? "bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 shadow-xl shadow-gray-200/50 dark:shadow-none transform scale-[1.02] border border-gray-100/50 dark:border-gray-700"
                            : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            }`}
                    >
                        <ShieldCheck className={`w-4 h-4 ${subTab === "mind_experts" ? "text-purple-600 dark:text-purple-400" : "text-gray-400"}`} />
                        Mind Experts
                    </button>
                </div>

                {/* Mind Experts sub-tab */}
                {subTab === "mind_experts" && <MindExpertsTab />}

                {/* List of Items — Minds / Playlists only */}
                {subTab !== "mind_experts" && (
                    isLoading ? (
                        <div className="grid grid-cols-1 gap-5">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-[24px] border border-gray-100 dark:border-gray-700 flex items-center gap-6 animate-pulse">
                                    <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-gray-700 shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                                    </div>
                                    <div className="w-24 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl shrink-0" />
                                </div>
                            ))}
                        </div>
                    ) : currentItems.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-16">
                            No {subTab === "minds" ? "mind sessions" : "playlists"} pending review
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 gap-5">
                            {currentItems.map((item) => (
                                <ValidationItem
                                    key={item.id}
                                    item={item}
                                    onReview={handleReview}
                                />
                            ))}
                        </div>
                    )
                )}
            </div>

            <MindReviewModal
                isOpen={isMindModalOpen}
                onClose={() => setIsMindModalOpen(false)}
                item={selectedItem}
            />

            <PlaylistReviewModal
                isOpen={isPlaylistModalOpen}
                onClose={() => setIsPlaylistModalOpen(false)}
                item={selectedItem}
            />
        </div>
    );
};

export default ContentValidation;
