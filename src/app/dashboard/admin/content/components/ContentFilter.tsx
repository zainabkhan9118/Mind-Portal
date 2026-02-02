import React from 'react';
import { Search, Plus, ChevronDown } from 'lucide-react';

interface ContentFilterProps {
    activeTab: string;
    searchTerm: string;
    onSearchChange: (value: string) => void;
    onAddClick: () => void;
}

const ContentFilter: React.FC<ContentFilterProps> = ({
    activeTab,
    searchTerm,
    onSearchChange,
    onAddClick
}) => {
    return (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row gap-4 justify-end items-center">
            <div className="relative w-full md:w-64">
                <input
                    type="text"
                    placeholder="Search here"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:border-purple-500"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>

            <div className="flex flex-wrap gap-3 w-full md:w-auto">
                <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-900 hover:bg-gray-50">
                    Access Type
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-900 hover:bg-gray-50">
                    Visibility Status
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-900 hover:bg-gray-50">
                    {activeTab === "Music" ? "Artist" : (activeTab === "Environment Sound" ? "Type" : (activeTab === "Mind Sessions" ? "Category" : "Category"))}
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
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
