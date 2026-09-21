import React from "react";
import Label from "@/components/form/Label";
import { Loader2 } from "lucide-react";
import type { SubCategory } from "@/lib/api/types";

const selectClass =
    "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs " +
    "focus:outline-none focus:ring-2 focus:ring-purple-500/20 " +
    "bg-white dark:bg-gray-900 text-gray-800 dark:text-white border-gray-300 dark:border-gray-700 " +
    "cursor-pointer";

interface SubCategoryPickerProps {
    options: SubCategory[];
    isLoading: boolean;
    hasPrimaryCategory: boolean;
    value: string;
    onChange: (name: string) => void;
    onCreateNew: () => void;
}

/**
 * Options are scoped to whichever Primary Category is currently selected (via
 * `GET admin/content/sub-categories/?type=...&category=...`, which already supports this
 * filter today). `sub_category` is still a single free-text field on the backend (see
 * API_SPEC.md), so this stays a single-select — picking one replaces the current value,
 * same as typing it directly.
 */
const SubCategoryPicker: React.FC<SubCategoryPickerProps> = ({
    options,
    isLoading,
    hasPrimaryCategory,
    value,
    onChange,
    onCreateNew,
}) => {
    return (
        <div>
            <div className="flex items-center justify-between mb-0">
                <Label htmlFor="subCategory" className="mb-0">Sub Category</Label>
                <button
                    type="button"
                    onClick={onCreateNew}
                    className="text-[11px] font-medium text-[#9810FA] hover:text-[#8000E0]"
                >
                    Create new Sub Category
                </button>
            </div>
            {!hasPrimaryCategory ? (
                <p className="text-xs text-gray-400 py-2">Select a Primary Category first to see its sub categories.</p>
            ) : isLoading ? (
                <div className="flex items-center gap-2 text-sm text-gray-400 py-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Loading sub categories…
                </div>
            ) : (
                <select
                    id="subCategory"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={selectClass}
                >
                    <option value="" className="bg-white dark:bg-gray-900">
                        {options.length === 0 ? "No sub categories yet — create one" : "Select sub category..."}
                    </option>
                    {/* The currently-set value may not be in `options` yet (e.g. typed via
                        Create new, or set before backend indexed it) — keep it selectable. */}
                    {value && !options.some((o) => o.name === value) && (
                        <option value={value} className="bg-white dark:bg-gray-900">{value}</option>
                    )}
                    {options.map((o) => (
                        <option key={o.id} value={o.name} className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
                            {o.name}
                        </option>
                    ))}
                </select>
            )}
        </div>
    );
};

export default SubCategoryPicker;
