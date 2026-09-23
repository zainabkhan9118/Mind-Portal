import React, { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { X, Pencil, Trash2, Check, Loader2 } from "lucide-react";
import contentApi from "@/lib/api/contentApi";
import type { SubCategory } from "@/lib/api/types";

interface ManageSubCategoriesModalProps {
    isOpen: boolean;
    onClose: () => void;
    /** Whatever's currently loaded for this item's selected parent categories — same scope
     * as the picker itself, since a sub-category rename/delete doesn't need any other context. */
    subCategories: SubCategory[];
    onChanged: () => void;
}

const ManageSubCategoriesModal: React.FC<ManageSubCategoriesModalProps> = ({
    isOpen,
    onClose,
    subCategories,
    onChanged,
}) => {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingName, setEditingName] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen) {
            setEditingId(null);
            setEditingName("");
            setError(null);
        }
    }, [isOpen]);

    const startEdit = (sc: SubCategory) => {
        setEditingId(sc.id);
        setEditingName(sc.name);
        setError(null);
    };

    const handleUpdate = async (id: number) => {
        if (!editingName.trim()) return;
        setIsSaving(true);
        setError(null);
        try {
            await contentApi.subCategories.update(id, { name: editingName.trim() });
            setEditingId(null);
            onChanged();
        } catch {
            setError("Failed to update sub category. The name may already be in use.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        setError(null);
        setDeletingId(id);
        try {
            await contentApi.subCategories.delete(id);
            onChanged();
        } catch {
            setError("Failed to delete sub category.");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[480px] m-4 z-[999999]">
            <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800">
                    <div>
                        <h3 className="text-base font-bold text-gray-900 dark:text-white">Manage Sub Categories</h3>
                        <p className="text-xs text-gray-500 mt-0.5">For this item's selected categories</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* List */}
                <div className="overflow-y-auto" style={{ maxHeight: "320px" }}>
                    {subCategories.length === 0 ? (
                        <p className="text-center text-sm text-gray-400 py-10">No sub categories yet for the selected categories.</p>
                    ) : (
                        <ul className="divide-y divide-gray-50 dark:divide-gray-800">
                            {subCategories.map((sc) => (
                                <li key={sc.id} className="flex items-center gap-3 px-6 py-3">
                                    {editingId === sc.id ? (
                                        <>
                                            <input
                                                autoFocus
                                                type="text"
                                                value={editingName}
                                                onChange={(e) => setEditingName(e.target.value)}
                                                onKeyDown={(e) => e.key === "Enter" && handleUpdate(sc.id)}
                                                className="flex-1 px-2 py-1 rounded border border-purple-400 dark:border-purple-600 bg-purple-50 dark:bg-purple-900/20 text-sm focus:outline-none dark:text-white"
                                            />
                                            <button
                                                onClick={() => handleUpdate(sc.id)}
                                                disabled={isSaving}
                                                className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 hover:bg-purple-200 transition-colors"
                                            >
                                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
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
                                            <span className="flex-1 text-sm text-gray-800 dark:text-gray-200">
                                                {sc.name}
                                                {sc.category_name && (
                                                    <span className="text-gray-400"> · {sc.category_name}</span>
                                                )}
                                            </span>
                                            {sc.item_count > 0 && (
                                                <span className="text-xs text-gray-400 tabular-nums">{sc.item_count}</span>
                                            )}
                                            <button
                                                onClick={() => startEdit(sc)}
                                                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-purple-600 transition-colors"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(sc.id)}
                                                disabled={deletingId === sc.id}
                                                className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                                            >
                                                {deletingId === sc.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
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

export default ManageSubCategoriesModal;
