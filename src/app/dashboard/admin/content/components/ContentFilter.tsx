import React from 'react';
import { Search, Plus, ChevronDown, Settings2 } from 'lucide-react';

interface ContentFilterProps {
    activeTab: string;
    searchTerm: string;
    accessFilter: string;
    statusFilter: string;
    categoryFilter: string;
    categories: { id: number; name: string }[];
    onSearchChange: (value: string) => void;
    onAccessChange: (value: string) => void;
    onStatusChange: (value: string) => void;
    onCategoryChange: (value: string) => void;
    onAddClick: () => void;
    onManageCategoriesClick?: () => void;
}

const ContentFilter: React.FC<ContentFilterProps> = ({
    activeTab,
    searchTerm,
    accessFilter,
    statusFilter,
    categoryFilter,
    categories,
    onSearchChange,
    onAccessChange,
    onStatusChange,
    onCategoryChange,
    onAddClick,
    onManageCategoriesClick,
}) => {
    const showCategories = activeTab !== "Minds";
    return (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:w-64">
                <input
                    type="text"
                    placeholder="Search here"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-purple-500"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>

            <div className="flex flex-wrap gap-3 w-full md:w-auto">
                <div className="relative">
                    <select
                        value={accessFilter}
                        onChange={(e) => onAccessChange(e.target.value)}
                        className="appearance-none flex items-center gap-2 pl-3 pr-10 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-900 hover:bg-gray-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    >
                        <option value="">Access Type</option>
                        <option value="Premium">Premium</option>
                        <option value="Free">Free</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                <div className="relative">
                    <select
                        value={statusFilter}
                        onChange={(e) => onStatusChange(e.target.value)}
                        className="appearance-none flex items-center gap-2 pl-3 pr-10 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-900 hover:bg-gray-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    >
                        <option value="">Status</option>
                        <option value="Published">Published</option>
                        <option value="Scheduled">Scheduled</option>
                        <option value="Unpublished">Unpublished</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                {showCategories && (
                    <div className="flex items-center gap-1">
                        <div className="relative">
                            <select
                                value={categoryFilter}
                                onChange={(e) => onCategoryChange(e.target.value)}
                                className="appearance-none flex items-center gap-2 pl-3 pr-10 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-900 hover:bg-gray-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                            >
                                <option value="">Category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                        {onManageCategoriesClick && (
                            <button
                                onClick={onManageCategoriesClick}
                                title="Manage categories"
                                className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 hover:text-purple-600 hover:border-purple-400 dark:hover:border-purple-500 bg-white dark:bg-gray-900 transition-colors"
                            >
                                <Settings2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                )}

                <button
                    onClick={onAddClick}
                    className="flex items-center gap-2 px-4 py-2 bg-[#9810FA] hover:bg-[#8000E0] text-white rounded-lg text-sm font-medium transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add New
                </button>
            </div>
        </div>
    );
};

export default ContentFilter;