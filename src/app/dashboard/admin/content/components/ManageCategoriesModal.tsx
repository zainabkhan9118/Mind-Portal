"use client";
import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { X, Plus, Pencil, Trash2, Check, Loader2 } from "lucide-react";
import { contentApi } from "@/lib/api";
import type { AdminCategory } from "@/lib/api/types";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    activeTab: string;
    onCategoriesChanged: () => void;
}

function tabToContentType(tab: string): string {
    switch (tab) {
        case "Sounds":  return "env_sound";
        case "Guided":  return "mind_session";
        case "Visuals": return "env_visual";
        default:        return "music";
    }
}

const ManageCategoriesModal: React.FC<Props> = ({ isOpen, onClose, activeTab, onCategoriesChanged }) => {
    const [categories, setCategories] = useState<AdminCategory[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [newName, setNewName] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingName, setEditingName] = useState("");
    const [error, setError] = useState<string | null>(null);

    const contentType = tabToContentType(activeTab);

    const load = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await contentApi.categories.list({ size: 100, type: contentType as never });
            setCategories(res.results);
        } catch {
            setError("Failed to load categories.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, activeTab]);

    const handleCreate = async () => {
        if (!newName.trim()) return;
        setIsSaving(true);
        setError(null);
        try {
            await contentApi.categories.create({ name: newName.trim() }, { type: contentType });
            setNewName("");
            await load();
            onCategoriesChanged();
        } catch {
            setError("Failed to create category.");
        } finally {
            setIsSaving(false);
        }
    };

    const startEdit = (cat: AdminCategory) => {
        setEditingId(cat.id);
        setEditingName(cat.name);
    };

    const handleUpdate = async (id: number) => {
        if (!editingName.trim()) return;
        setIsSaving(true);
        setError(null);
        try {
            await contentApi.categories.update(id, { name: editingName.trim() });
            setEditingId(null);
            await load();
            onCategoriesChanged();
        } catch {
            setError("Failed to update category.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        setError(null);
        try {
            await contentApi.categories.delete(id);
            await load();
            onCategoriesChanged();
        } catch {
            setError("Failed to delete category. It may still have content assigned.");
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[480px] m-4">
            <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800">
                    <div>
                        <h3 className="text-base font-bold text-gray-900 dark:text-white">Manage Categories</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{activeTab} tab</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Add new */}
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="New category name"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                            className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:border-purple-500 dark:text-white"
                        />
                        <button
                            onClick={handleCreate}
                            disabled={isSaving || !newName.trim()}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#9810FA] hover:bg-[#8000E0] text-white text-sm font-medium disabled:opacity-50 transition-colors"
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                            Add
                        </button>
                    </div>
                </div>

                {/* List */}
                <div className="overflow-y-auto" style={{ maxHeight: "320px" }}>
                    {isLoading ? (
                        <div className="flex items-center justify-center py-10 text-gray-400 text-sm gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" /> Loading…
                        </div>
                    ) : categories.length === 0 ? (
                        <p className="text-center text-sm text-gray-400 py-10">No categories yet.</p>
                    ) : (
                        <ul className="divide-y divide-gray-50 dark:divide-gray-800">
                            {categories.map((cat) => (
                                <li key={cat.id} className="flex items-center gap-3 px-6 py-3">
                                    {editingId === cat.id ? (
                                        <>
                                            <input
                                                autoFocus
                                                type="text"
                                                value={editingName}
                                                onChange={(e) => setEditingName(e.target.value)}
                                                onKeyDown={(e) => e.key === "Enter" && handleUpdate(cat.id)}
                                                className="flex-1 px-2 py-1 rounded border border-purple-400 dark:border-purple-600 bg-purple-50 dark:bg-purple-900/20 text-sm focus:outline-none dark:text-white"
                                            />
                                            <button
                                                onClick={() => handleUpdate(cat.id)}
                                                disabled={isSaving}
                                                className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 hover:bg-purple-200 transition-colors"
                                            >
                                                <Check className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setEditingId(null)}
                                                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <span className="flex-1 text-sm text-gray-800 dark:text-gray-200">{cat.name}</span>
                                            {cat.item_count > 0 && (
                                                <span className="text-xs text-gray-400 tabular-nums">{cat.item_count}</span>
                                            )}
                                            <button
                                                onClick={() => startEdit(cat)}
                                                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-purple-600 transition-colors"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(cat.id)}
                                                className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {error && (
                    <div className="px-6 py-3 border-t border-gray-100 dark:border-gray-800 text-xs text-red-500">
                        {error}
                    </div>
                )}

                <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        Done
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ManageCategoriesModal;
