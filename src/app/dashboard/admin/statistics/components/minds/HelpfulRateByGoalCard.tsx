import React from 'react';
import { Info } from 'lucide-react';
import type { MindsHelpfulRateByGoal } from '@/lib/api/types';

const HelpfulRateByGoalCard: React.FC<{ data: MindsHelpfulRateByGoal[]; isLoading: boolean }> = ({ data, isLoading }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex items-center gap-1.5 mb-5">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Helpful Rate by Goal</h3>
            <Info className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600" />
        </div>

        {isLoading ? (
            <div className="space-y-3">
                {[...Array(5)].map((_, i) => <div key={i} className="h-5 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />)}
            </div>
        ) : data.length === 0 ? (
            <p className="text-sm text-gray-400 py-8 text-center">No data available</p>
        ) : (
            <div className="space-y-3">
                {data.map((row) => (
                    <div key={row.goal} className="flex items-center gap-3">
                        <span className="text-xs text-gray-600 dark:text-gray-300 w-32 shrink-0 truncate">{row.goal}</span>
                        <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-[#9810FA] rounded-full" style={{ width: `${Math.min(row.helpful_rate, 100)}%` }} />
                        </div>
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 w-9 text-right shrink-0">{Math.round(row.helpful_rate)}%</span>
                    </div>
                ))}
            </div>
        )}
    </div>
);

export default HelpfulRateByGoalCard;
