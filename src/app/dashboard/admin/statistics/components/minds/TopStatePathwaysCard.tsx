import React from 'react';
import { Info } from 'lucide-react';
import type { MindsTopStatePathway } from '@/lib/api/types';

interface TopStatePathwaysCardProps {
    data: MindsTopStatePathway[];
    isLoading: boolean;
    /** Jumps to the full "Mind Coverage" tab, which shows every pathway (not just the top few). */
    onSeeAll?: () => void;
}

const TopStatePathwaysCard: React.FC<TopStatePathwaysCardProps> = ({ data, isLoading, onSeeAll }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Top State Pathways</h3>
                <Info className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600" />
            </div>
            {onSeeAll && (
                <button onClick={onSeeAll} className="text-xs font-semibold text-[#9810FA] hover:underline">
                    See All
                </button>
            )}
        </div>

        {isLoading ? (
            <div className="space-y-3">
                {[...Array(5)].map((_, i) => <div key={i} className="h-5 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />)}
            </div>
        ) : data.length === 0 ? (
            <p className="text-sm text-gray-400 py-8 text-center">No data available</p>
        ) : (
            <div className="space-y-3">
                {data.map((row, i) => (
                    <div key={`${row.primary_goal}-${row.primary_state}-${i}`} className="flex items-center gap-3">
                        <span className="text-xs text-gray-600 dark:text-gray-300 flex-1 min-w-0 truncate">
                            {row.primary_goal} → {row.primary_state}
                        </span>
                        <div className="w-20 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden shrink-0">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(row.share, 100)}%` }} />
                        </div>
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 w-9 text-right shrink-0">{Math.round(row.share)}%</span>
                    </div>
                ))}
            </div>
        )}
    </div>
);

export default TopStatePathwaysCard;
