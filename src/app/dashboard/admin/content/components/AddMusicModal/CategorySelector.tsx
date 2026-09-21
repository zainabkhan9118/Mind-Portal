import React from "react";
import Label from "@/components/form/Label";

interface Category {
    id: number;
    name: string;
}

const selectClass =
    "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs " +
    "focus:outline-none focus:ring-2 focus:ring-purple-500/20 " +
    "bg-white dark:bg-gray-900 text-gray-800 dark:text-white border-gray-300 dark:border-gray-700 " +
    "cursor-pointer";

interface CategorySelectorProps {
    categories: Category[];
    primaryCategory: number | null;
    onPrimaryCategoryChange: (id: number | null) => void;
    secondaryCategories: number[];
    onToggleSecondaryCategory: (id: number) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
    categories,
    primaryCategory,
    onPrimaryCategoryChange,
    secondaryCategories,
    onToggleSecondaryCategory,
}) => {
    if (categories.length === 0) return null;

    const secondaryOptions = categories.filter((c) => c.id !== primaryCategory);

    return (
        <div className="space-y-5">
            <div>
                <Label htmlFor="primary-category">
                    Primary Category
                </Label>
                <select
                    id="primary-category"
                    value={primaryCategory ?? ""}
                    onChange={(e) => onPrimaryCategoryChange(e.target.value ? Number(e.target.value) : null)}
                    className={selectClass}
                >
                    <option value="" className="bg-white dark:bg-gray-900">Select category...</option>
                    {categories.map((c) => (
                        <option key={c.id} value={c.id} className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
                            {c.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Secondary Categories
                </h3>
                <div className="flex flex-wrap gap-2">
                    {secondaryOptions.length === 0 ? (
                        <p className="text-xs text-gray-400">No other categories available.</p>
                    ) : (
                        secondaryOptions.map((c) => (
                            <button
                                key={c.id}
                                type="button"
                                onClick={() => onToggleSecondaryCategory(c.id)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                                    secondaryCategories.includes(c.id)
                                        ? "bg-[#9810FA] text-white border-[#9810FA]"
                                        : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-[#9810FA] hover:text-[#9810FA]"
                                }`}
                            >
                                {c.name}
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategorySelector;
