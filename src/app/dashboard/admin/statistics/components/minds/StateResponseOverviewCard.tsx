import React from 'react';
import { Info } from 'lucide-react';
import type { MindsStateResponseRow } from '@/lib/api/types';

// Purple (high helpful rate) → teal (low helpful rate)
const HIGH_COLOR = [152, 16, 250];  // #9810FA
const LOW_COLOR = [6, 182, 212];    // #06B6D4

function lerp(a: number, b: number, t: number): number {
    return Math.round(a + (b - a) * t);
}

function colorForRank(index: number, total: number): string {
    const t = total <= 1 ? 0 : index / (total - 1);
    const [r, g, b] = [
        lerp(HIGH_COLOR[0], LOW_COLOR[0], t),
        lerp(HIGH_COLOR[1], LOW_COLOR[1], t),
        lerp(HIGH_COLOR[2], LOW_COLOR[2], t),
    ];
    return `rgb(${r}, ${g}, ${b})`;
}

const StateResponseOverviewCard: React.FC<{ data: MindsStateResponseRow[]; isLoading: boolean }> = ({ data, isLoading }) => {
    const sorted = [...data].sort((a, b) => b.helpful_rate - a.helpful_rate);
    const maxRate = sorted[0]?.helpful_rate ?? 100;

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-1.5 mb-6">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">State Response Overview</h3>
                <Info className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600" />
            </div>

            {isLoading ? (
                <div className="h-40 flex items-center justify-center">
                    <div className="w-7 h-7 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : sorted.length === 0 ? (
                <p className="text-sm text-gray-400 py-8 text-center">No data available</p>
            ) : (
                <>
                    <div className="flex items-end gap-1.5 overflow-x-auto pb-2" style={{ height: '120px' }}>
                        {sorted.map((row, i) => {
                            const heightPct = maxRate > 0 ? (row.helpful_rate / maxRate) * 100 : 0;
                            return (
                                <div key={row.state} className="flex flex-col items-center justify-end shrink-0 w-9 h-full">
                                    <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1">{Math.round(row.helpful_rate)}%</span>
                                    <div
                                        className="w-6 rounded-t-md"
                                        style={{ height: `${Math.max(heightPct, 4)}%`, backgroundColor: colorForRank(i, sorted.length) }}
                                    />
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex gap-1.5 mt-1">
                        {sorted.map((row) => (
                            <span
                                key={row.state}
                                className="text-[9px] text-gray-400 shrink-0 w-9 text-center truncate"
                                style={{ transform: 'rotate(-40deg) translateX(-4px)', transformOrigin: 'top left' }}
                            >
                                {row.state}
                            </span>
                        ))}
                    </div>
                    <div className="flex items-center gap-3 mt-8 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <span className="text-[10px] text-gray-400 whitespace-nowrap">Higher Helpful Rate</span>
                        <div className="flex-1 h-1.5 rounded-full" style={{ background: `linear-gradient(to right, rgb(${HIGH_COLOR.join(',')}), rgb(${LOW_COLOR.join(',')}))` }} />
                        <span className="text-[10px] text-gray-400 whitespace-nowrap">Lower Helpful Rate</span>
                    </div>
                </>
            )}
        </div>
    );
};

export default StateResponseOverviewCard;
