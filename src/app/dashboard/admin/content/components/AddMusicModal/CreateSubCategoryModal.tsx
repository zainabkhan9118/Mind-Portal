import React, { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { X, Layers, Loader2 } from "lucide-react";
import contentApi from "@/lib/api/contentApi";
import type { ContentType, SubCategory } from "@/lib/api/types";

interface CategoryOption {
    id: number;
    name: string;
}

interface CreateSubCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    /** Only the categories already selected on this item (Primary + Secondary) — a new
     * sub-category must be linked to one of them, per the backend's validation rule. */
    categories: CategoryOption[];
    defaultCategoryId?: number | null;
    contentType: ContentType;
    onCreated: (created: SubCategory) => void;
}

const CreateSubCategoryModal: React.FC<CreateSubCategoryModalProps> = ({
    isOpen,
    onClose,
    categories,
    defaultCategoryId = null,
    contentType,
    onCreated,
}) => {
    const [parentCategoryId, setParentCategoryId] = useState<string>("");
    const [name, setName] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setParentCategoryId(defaultCategoryId != null ? String(defaultCategoryId) : "");
            setName("");
            setError(null);
        }
    }, [isOpen, defaultCategoryId]);

    const handleCreate = async () => {
        if (!name.trim()) { setError("Please enter a sub category name."); return; }
        if (!parentCategoryId) { setError("Please select a parent category."); return; }
        setError(null);
        setIsCreating(true);
        try {
            const created = await contentApi.subCategories.create({
                name: name.trim(),
                type: contentType,
                category: Number(parentCategoryId),
            });
            onCreated(created);
            onClose();
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { error?: { message?: string } } } };
            setError(axiosErr?.response?.data?.error?.message ?? "Failed to create sub category. It may already exist.");
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[480px] z-[999999]">
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-0 overflow-hidden">
                {/* Header with Close Button */}
                <div className="flex justify-between items-center p-6 pb-0">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Create New Sub Category</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Icon Preview Placeholder */}
                    <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center border border-purple-100 dark:border-purple-800 shadow-sm">
                            <Layers className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                        </div>
                    </div>

                    {/* Category Select */}
                    <div className="space-y-1.5">
                        <Label htmlFor="parentCategory">Parent Category</Label>
                        <select
                            id="parentCategory"
                            value={parentCategoryId}
                            onChange={(e) => setParentCategoryId(e.target.value)}
                            className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-700"
                        >
                            <option value="">Select parent category...</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                        {categories.length === 0 && (
                            <p className="text-xs text-gray-400">Select a Primary or Secondary Category on this item first.</p>
                        )}
                    </div>

                    {/* Sub Category Name Input */}
                    <div className="space-y-1.5">
                        <Label htmlFor="subCategoryName">Sub Category Name</Label>
                        <Input
                            id="subCategoryName"
                            placeholder="Enter Sub Category Name"
                            className="bg-gray-50 dark:bg-gray-800"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    {error && <p className="text-xs text-red-500">{error}</p>}
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-3 p-6 pt-0">
                    <Button variant="outline" onClick={onClose} disabled={isCreating} className="px-6">Cancel</Button>
                    <Button
                        onClick={handleCreate}
                        disabled={isCreating || categories.length === 0}
                        className="bg-[#9810FA] hover:bg-[#8000E0] text-white border-none px-6 disabled:opacity-50"
                    >
                        {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create"}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default CreateSubCategoryModal;
