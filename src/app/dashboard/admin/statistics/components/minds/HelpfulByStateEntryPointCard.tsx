import React from 'react';
import { Info, Waves } from 'lucide-react';
import type { MindStateEntryPoint } from '@/lib/api/types';

const HelpfulByStateEntryPointCard: React.FC<{ data: MindStateEntryPoint[]; isLoading: boolean }> = ({ data, isLoading }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex items-center gap-1.5 mb-5">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Helpful by State Entry Point</h3>
            <Info className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600" />
        </div>

        {isLoading ? (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => <div key={i} className="h-6 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />)}
            </div>
        ) : data.length === 0 ? (
            <p className="text-sm text-gray-400 py-8 text-center">No data available</p>
        ) : (
            <div className="space-y-4">
                {data.map((row) => (
                    <div key={row.state}>
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                                <Waves className="w-3.5 h-3.5 text-gray-400" />
                                {row.state}
                            </span>
                            <span className="text-xs text-gray-400">n={row.n}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div className="h-full bg-[#9810FA] rounded-full" style={{ width: `${Math.min(row.helpful_rate, 100)}%` }} />
                            </div>
                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 w-16 text-right shrink-0">{Math.round(row.helpful_rate)}% helpful</span>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
);

export default HelpfulByStateEntryPointCard;
