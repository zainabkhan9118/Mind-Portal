import React from 'react';
import { Search, ChevronDown } from 'lucide-react';

interface UsersFilterProps {
    onSearch: (query: string) => void;
    onTypeChange: (type: string) => void;
    onTimeChange: (time: string) => void;
}

const UsersFilter: React.FC<UsersFilterProps> = ({ onSearch, onTypeChange, onTimeChange }) => {
    return (
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-end mb-6">
            <div className="relative w-full sm:w-auto max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search here"
                    className="pl-10 pr-4 py-2.5 w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-gray-600 dark:text-gray-300 transition-all shadow-sm"
                    onChange={(e) => onSearch(e.target.value)}
                />
            </div>

            <div className="flex gap-3 w-full sm:w-auto">
                <div className="relative">
                    <select
                        className="appearance-none pl-4 pr-10 py-2.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
                        onChange={(e) => onTypeChange(e.target.value)}
                    >
                        <option value="">Type</option>
                        <option value="Music">Music</option>
                        <option value="360">360</option>
                        <option value="VR">VR</option>
                        <option value="Sound">Sound</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                <div className="relative">
                    <select
                        className="appearance-none pl-4 pr-10 py-2.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
                        onChange={(e) => onTimeChange(e.target.value)}
                    >
                        <option value="">Time</option>
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
            </div>
        </div>
    );
};

export default UsersFilter;
