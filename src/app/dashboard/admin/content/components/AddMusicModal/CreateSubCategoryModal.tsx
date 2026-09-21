import React, { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { X, Layers } from "lucide-react";

interface CategoryOption {
    id: number;
    name: string;
}

interface CreateSubCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    categories: CategoryOption[];
    /** Pre-select whichever category the admin already has picked as Primary Category. */
    defaultCategoryId?: number | null;
    /**
     * `sub_category` is a plain free-text field on the content item (not a separate linked
     * entity — see API_SPEC.md), so "creating" one just means setting this form's Sub Category
     * text to the new name. The parent category is informational context for the admin only.
     */
    onCreate: (name: string) => void;
}

const CreateSubCategoryModal: React.FC<CreateSubCategoryModalProps> = ({
    isOpen,
    onClose,
    categories,
    defaultCategoryId = null,
    onCreate,
}) => {
    const [parentCategoryId, setParentCategoryId] = useState<string>("");
    const [name, setName] = useState("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setParentCategoryId(defaultCategoryId != null ? String(defaultCategoryId) : "");
            setName("");
            setError(null);
        }
    }, [isOpen, defaultCategoryId]);

    const handleCreate = () => {
        if (!name.trim()) {
            setError("Please enter a sub category name.");
            return;
        }
        onCreate(name.trim());
        onClose();
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
                    <Button variant="outline" onClick={onClose} className="px-6">Cancel</Button>
                    <Button onClick={handleCreate} className="bg-[#9810FA] hover:bg-[#8000E0] text-white border-none px-6">Create</Button>
                </div>
            </div>
        </Modal>
    );
};

export default CreateSubCategoryModal;
