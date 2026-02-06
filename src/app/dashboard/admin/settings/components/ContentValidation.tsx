"use client";
import React, { useState } from "react";
import { Brain, Music2 } from "lucide-react";
import ValidationStats from "./validation/ValidationStats";
import ValidationItem, { ValidationItemData } from "./validation/ValidationItem";

import MindReviewModal from "./validation/MindReviewModal";
import PlaylistReviewModal from "./validation/PlaylistReviewModal";

const mockMinds: ValidationItemData[] = [
    {
        id: "1",
        type: "mind",
        title: "Peaceful Piano Collection",
        status: "Pending",
        category: "Music",
        description: "A curated collection of peaceful piano pieces for relaxation and focus.",
        creator: "Emma Williams",
        itemCount: 12,
        createdAt: "2026-01-10",
    },
    {
        id: "2",
        type: "mind",
        title: "Morning Meditation Series",
        status: "Pending",
        category: "Music",
        description: "A curated collection of peaceful piano pieces for relaxation and focus.",
        creator: "Emma Williams",
        itemCount: 12,
        createdAt: "2026-01-10",
    },
    {
        id: "3",
        type: "mind",
        title: "Electronic Focus Beats",
        status: "Pending",
        category: "Guided Session",
        description: "Upbeat electronic music to keep you energized and focused throughout the day.",
        creator: "Emma Williams",
        itemCount: 12,
        createdAt: "2026-01-10",
    },
    {
        id: "4",
        type: "mind",
        title: "Sleep Hypnosis Collection",
        status: "Pending",
        category: "Music",
        description: "Professional hypnosis sessions designed to help you achieve deep, restful sleep.",
        creator: "Emma Williams",
        itemCount: 12,
        createdAt: "2026-01-10",
    }
];

const mockPlaylists: ValidationItemData[] = [
    {
        id: "p1",
        type: "playlist",
        title: "Deep Zen Playlist",
        status: "Pending",
        category: "Music",
        description: "Deep meditation sounds for advanced practitioners.",
        creator: "Liam Johnson",
        itemCount: 8,
        createdAt: "2026-01-15",
    },
    {
        id: "p2",
        type: "playlist",
        title: "Nature Ambience Mix",
        status: "Pending",
        category: "Music",
        description: "High quality forest and rain recordings for stress relief.",
        creator: "Sophia Chen",
        itemCount: 15,
        createdAt: "2026-01-12",
    }
];

const ContentValidation: React.FC = () => {
    const [subTab, setSubTab] = useState<"minds" | "playlists">("playlists");
    const [selectedItem, setSelectedItem] = useState<ValidationItemData | null>(null);
    const [isMindModalOpen, setIsMindModalOpen] = useState(false);
    const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);

    const handleReview = (item: ValidationItemData) => {
        setSelectedItem(item);
        if (item.type === "mind") {
            setIsMindModalOpen(true);
        } else {
            setIsPlaylistModalOpen(true);
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Stats Header */}
            <ValidationStats />

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
                </div>

                {/* List of Items */}
                <div className="grid grid-cols-1 gap-5">
                    {(subTab === "minds" ? mockMinds : mockPlaylists).map((item) => (
                        <ValidationItem
                            key={item.id}
                            item={item}
                            onReview={handleReview}
                        />
                    ))}
                </div>
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
