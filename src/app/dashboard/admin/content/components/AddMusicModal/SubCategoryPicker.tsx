import React from "react";
import Label from "@/components/form/Label";
import { Loader2 } from "lucide-react";
import type { SubCategory } from "@/lib/api/types";

interface SubCategoryPickerProps {
    /** Merged, deduped sub-categories across every currently-selected Primary + Secondary
     * Category — this content type can have multiple parent categories, so options come
     * from all of them, not just the primary one. */
    options: SubCategory[];
    isLoading: boolean;
    hasParentCategory: boolean;
    selectedIds: number[];
    onToggle: (id: number) => void;
    onCreateNew: () => void;
    onManage: () => void;
}

/**
 * Multi-select — the backend now supports multiple stable sub-category ids per item
 * (see content-subcategories.md, confirmed live 21 Sept 2026). Options are scoped to
 * whichever parent categories are currently selected on this item.
 */
const SubCategoryPicker: React.FC<SubCategoryPickerProps> = ({
    options,
    isLoading,
    hasParentCategory,
    selectedIds,
    onToggle,
    onCreateNew,
    onManage,
}) => {
    // Only label each pill with its parent category when more than one is in play —
    // keeps the common single-category case clean.
    const groupNames = new Set(options.map((o) => o.category_name).filter(Boolean));
    const showGroupLabel = groupNames.size > 1;

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between mb-0">
                <Label className="mb-0">Sub Categories</Label>
                <div className="flex items-center gap-3">
                    {options.length > 0 && (
                        <button
                            type="button"
                            onClick={onManage}
                            className="text-[11px] font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            Manage
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={onCreateNew}
                        disabled={!hasParentCategory}
                        className="text-[11px] font-medium text-[#9810FA] hover:text-[#8000E0] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Create new Sub Category
                    </button>
                </div>
            </div>
            {!hasParentCategory ? (
                <p className="text-xs text-gray-400 py-2">Select a Primary or Secondary Category first to see its sub categories.</p>
            ) : isLoading ? (
                <div className="flex items-center gap-2 text-sm text-gray-400 py-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Loading sub categories…
                </div>
            ) : options.length === 0 ? (
                <p className="text-xs text-gray-400 py-2">No sub categories yet for the selected categories — create one.</p>
            ) : (
                <div className="flex flex-wrap gap-2">
                    {options.map((sc) => {
                        const isSelected = selectedIds.includes(sc.id);
                        return (
                            <button
                                key={sc.id}
                                type="button"
                                onClick={() => onToggle(sc.id)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                                    isSelected
                                        ? "bg-[#9810FA] text-white border-[#9810FA]"
                                        : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-[#9810FA] hover:text-[#9810FA]"
                                }`}
                            >
                                {showGroupLabel && sc.category_name ? `${sc.category_name}: ${sc.name}` : sc.name}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default SubCategoryPicker;
