import { ChevronDown, Search } from 'lucide-react';
import type { AnalyticsContentType } from '@/lib/api/types';

// Note: the analytics API returns "guided_session" for this content type — NOT "mind_session"
// (the slug used by Content Management). Don't "fix" this back to mind_session.
const TYPE_OPTIONS: { label: string; value: AnalyticsContentType | '' }[] = [
    { label: 'All Types', value: '' },
    { label: 'Music', value: 'music' },
    { label: 'Guided', value: 'guided_session' },
    { label: 'Env Sound', value: 'env_sound' },
    { label: 'Env Visual', value: 'env_visual' },
];

interface ContentSearchTypeFilterProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    typeFilter?: AnalyticsContentType | '';
    onTypeFilterChange?: (value: AnalyticsContentType | '') => void;
    /** Hide the Type select — useful when a page-level filter (e.g. the Analysis dropdown) already controls content type. */
    showTypeFilter?: boolean;
}

const ContentSearchTypeFilter: React.FC<ContentSearchTypeFilterProps> = ({
    searchTerm,
    onSearchChange,
    typeFilter = '',
    onTypeFilterChange,
    showTypeFilter = true,
}) => (
    <div className="flex items-center gap-2">
        <div className="relative">
            <input
                type="text"
                placeholder="Search content..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-52 pl-4 pr-9 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
        </div>

        {showTypeFilter && (
            <div className="relative">
                <select
                    value={typeFilter}
                    onChange={(e) => onTypeFilterChange?.(e.target.value as AnalyticsContentType | '')}
                    className="appearance-none pl-3 pr-8 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 cursor-pointer focus:outline-none"
                >
                    {TYPE_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            </div>
        )}
    </div>
);

export default ContentSearchTypeFilter;
