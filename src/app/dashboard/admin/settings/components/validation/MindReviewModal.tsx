"use client";
import React, { useState, useEffect, useCallback } from "react";
import { X, Brain, Calendar, Clock, ChevronDown, Search, Loader2, XCircle } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import { ValidationItemData } from "./ValidationItem";
import contentApi from "@/lib/api/contentApi";
import usersApi from "@/lib/api/usersApi";
import type { ContentVisibility, UserSearchResult } from "@/lib/api/types";

interface MindReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: ValidationItemData | null;
    onApproved?: (id: string) => void;
    onRejected?: (id: string) => void;
}

const VISIBILITY_OPTIONS: { value: ContentVisibility; label: string }[] = [
    { value: "all", label: "All Users" },
    { value: "free", label: "Free Users" },
    { value: "premium", label: "Premium" },
    { value: "mind_expert", label: "Mind Experts" },
    { value: "b2b", label: "B2B" },
    { value: "restricted", label: "Restricted — Invite Only" },
];

const MindReviewModal: React.FC<MindReviewModalProps> = ({ isOpen, onClose, item, onApproved, onRejected }) => {
    const [visibility, setVisibility] = useState<ContentVisibility>("all");
    const [publishDate, setPublishDate] = useState("");
    const [publishTime, setPublishTime] = useState("");
    const [allowedUsers, setAllowedUsers] = useState<UserSearchResult[]>([]);
    const [userQuery, setUserQuery] = useState("");
    const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen) {
            setVisibility("all");
            setPublishDate("");
            setPublishTime("");
            setAllowedUsers([]);
            setUserQuery("");
            setSearchResults([]);
            setError(null);
        }
    }, [isOpen]);

    const searchDebounce = useCallback((q: string) => {
        if (!q.trim()) { setSearchResults([]); return; }
        const t = setTimeout(async () => {
            setIsSearching(true);
            try {
                const res = await usersApi.searchUsers(q, 20);
                setSearchResults(res.results.filter(r => !allowedUsers.some(u => u.id === r.id)));
            } catch { /* ignore */ } finally {
                setIsSearching(false);
            }
        }, 300);
        return () => clearTimeout(t);
    }, [allowedUsers]);

    useEffect(() => {
        if (visibility !== "restricted") { setSearchResults([]); return; }
        const cleanup = searchDebounce(userQuery);
        return cleanup;
    }, [userQuery, visibility, searchDebounce]);

    const addUser = (u: UserSearchResult) => {
        setAllowedUsers(prev => [...prev, u]);
        setUserQuery("");
        setSearchResults([]);
    };

    const removeUser = (id: number) => setAllowedUsers(prev => prev.filter(u => u.id !== id));

    const buildPublishedAt = () => {
        if (!publishDate) return undefined;
        const time = publishTime || "00:00";
        return `${publishDate}T${time}:00`;
    };

    const handleApprove = async () => {
        if (!item) return;
        setError(null);
        setIsSubmitting(true);
        try {
            const payload: Parameters<typeof contentApi.approveContent>[2] = {
                status: "published",
                visibility,
            };
            const publishedAt = buildPublishedAt();
            if (publishedAt) payload.published_at = publishedAt;
            if (visibility === "restricted") payload.allowed_user_ids = allowedUsers.map(u => u.id);

            await contentApi.approveContent("minds", Number(item.id), payload);
            onApproved?.(item.id);
            onClose();
        } catch {
            setError("Failed to approve. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReject = async () => {
        if (!item) return;
        setError(null);
        setIsRejecting(true);
        try {
            await contentApi.approveContent("minds", Number(item.id), { status: "archived" });
            onRejected?.(item.id);
            onClose();
        } catch {
            setError("Failed to reject. Please try again.");
        } finally {
            setIsRejecting(false);
        }
    };

    if (!item) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4">
            <div className="relative flex flex-col w-full bg-white dark:bg-gray-900 rounded-3xl p-8 overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Review Mind: <span className="text-purple-600 font-extrabold">{item.title}</span>
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-400">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Item Details */}
                <div className="flex gap-6 mb-8">
                    <div className="w-20 h-20 rounded-2xl bg-purple-100/50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
                        <Brain className="w-10 h-10" />
                    </div>
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{item.title}</h3>
                            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-[10px] font-bold rounded-lg uppercase tracking-wide border border-gray-200 dark:border-gray-700">
                                Mind Session
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            by <span className="font-bold text-gray-700 dark:text-gray-200">{item.creator}</span>
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-lg">{item.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-400 font-medium pt-1">
                            <span>{item.itemCount} items</span>
                            <span className="w-1 h-1 bg-gray-300 dark:bg-gray-700 rounded-full" />
                            <span>Created: {item.createdAt}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Access Level */}
                    <div>
                        <Label className="text-gray-700 dark:text-gray-300 font-semibold mb-2 flex items-center gap-1">
                            Access Level <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                            <select
                                value={visibility}
                                onChange={e => setVisibility(e.target.value as ContentVisibility)}
                                className="w-full h-12 pl-4 pr-10 appearance-none bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                            >
                                {VISIBILITY_OPTIONS.map(o => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                        </div>
                    </div>

                    {/* Restricted user picker */}
                    {visibility === "restricted" && (
                        <div className="space-y-3">
                            <Label className="text-gray-700 dark:text-gray-300 font-semibold">
                                Allowed Users
                            </Label>

                            {/* Selected pills */}
                            {allowedUsers.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {allowedUsers.map(u => (
                                        <span key={u.id} className="flex items-center gap-1.5 px-3 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium border border-purple-200 dark:border-purple-800">
                                            {u.display_name}
                                            <button onClick={() => removeUser(u.id)} className="hover:text-purple-900 dark:hover:text-purple-100">
                                                <XCircle className="w-3.5 h-3.5" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Search input */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search users by name or email…"
                                    value={userQuery}
                                    onChange={e => setUserQuery(e.target.value)}
                                    className="w-full h-11 pl-9 pr-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-purple-500/20"
                                />
                                {isSearching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />}
                            </div>

                            {/* Dropdown results */}
                            {searchResults.length > 0 && (
                                <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden divide-y divide-gray-100 dark:divide-gray-700/50">
                                    {searchResults.map(u => (
                                        <button
                                            key={u.id}
                                            onClick={() => addUser(u)}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                        >
                                            <div className="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 text-xs font-bold shrink-0">
                                                {(u.display_name || u.email)[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">{u.display_name}</p>
                                                <p className="text-xs text-gray-400">{u.email}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Schedule Publishing */}
                    <div className="bg-blue-50/30 dark:bg-blue-900/10 p-6 rounded-2xl border border-blue-100/50 dark:border-blue-900/30 space-y-4">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-purple-600" />
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white">Schedule Publishing</h4>
                            <span className="text-xs text-gray-400">(optional — publish immediately if left blank)</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-gray-700 dark:text-gray-300">Publish Date</Label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={publishDate}
                                        onChange={e => setPublishDate(e.target.value)}
                                        className="w-full h-11 px-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-purple-500/20"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-gray-700 dark:text-gray-300">Publish Time</Label>
                                <div className="relative">
                                    <input
                                        type="time"
                                        value={publishTime}
                                        onChange={e => setPublishTime(e.target.value)}
                                        className="w-full h-11 px-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-purple-500/20"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center gap-3 mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                    <button
                        onClick={handleReject}
                        disabled={isRejecting || isSubmitting}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 transition-colors"
                    >
                        {isRejecting && <Loader2 className="w-4 h-4 animate-spin" />}
                        Reject
                    </button>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={onClose} disabled={isSubmitting || isRejecting} className="px-6 rounded-xl py-2.5 h-auto font-semibold border-gray-200 text-gray-600">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleApprove}
                            disabled={isSubmitting || isRejecting || (visibility === "restricted" && allowedUsers.length === 0)}
                            className="px-6 bg-[#9810FA] hover:bg-[#8000E0] text-white rounded-xl py-2.5 h-auto font-semibold border-none shadow-lg shadow-purple-500/20 disabled:opacity-50"
                        >
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Approve & Schedule"}
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default MindReviewModal;
