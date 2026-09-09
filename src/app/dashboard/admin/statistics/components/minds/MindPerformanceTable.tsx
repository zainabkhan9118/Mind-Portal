import React, { useMemo, useState } from 'react';
import { Search, TrendingUp, TrendingDown } from 'lucide-react';
import type { MindPerformanceRow } from '@/lib/api/types';

function formatDuration(seconds: number | undefined): string {
    if (seconds == null) return '—';
    const s = Math.round(seconds);
    const m = Math.floor(s / 60);
    const rem = s % 60;
    if (m < 60) return rem > 0 ? `${m}m ${rem}s` : `${m}m`;
    const h = Math.floor(m / 60);
    const remM = m % 60;
    return remM > 0 ? `${h}h ${remM}m` : `${h}h`;
}

function formatCount(n: number): string {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
    return n.toString();
}

const COMPONENT_LABELS: Record<string, string> = {
    music: 'music',
    env_sound: 'sound',
    env_visual: 'visual',
    guided_session: 'guided',
};

interface MindPerformanceTableProps {
    rows: MindPerformanceRow[];
    isLoading: boolean;
    selectedMindId: number | null;
    onSelectMind: (row: MindPerformanceRow) => void;
}

const MindPerformanceTable: React.FC<MindPerformanceTableProps> = ({ rows, isLoading, selectedMindId, onSelectMind }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredRows = useMemo(() => {
        if (!searchTerm.trim()) return rows;
        const q = searchTerm.toLowerCase();
        return rows.filter((r) => r.name.toLowerCase().includes(q));
    }, [rows, searchTerm]);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
                <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">Mind Performance</h3>
                </div>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search minds"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-48 pl-9 pr-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-100 dark:border-gray-700">
                            {['Mind', 'Primary Goal', 'Primary State', 'Components', 'Helpful Rate', 'Best State', 'Weakest State', 'Plays', 'Unique users', 'Avg time per user', 'Avg duration per play', 'Repeat rate', 'Saved', 'Timer used', 'Growth'].map((h) => (
                                <th key={h} className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                        {isLoading ? (
                            <tr>
                                <td colSpan={15} className="py-16 text-center">
                                    <div className="flex justify-center">
                                        <div className="w-7 h-7 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                                    </div>
                                </td>
                            </tr>
                        ) : filteredRows.length === 0 ? (
                            <tr>
                                <td colSpan={15} className="py-16 text-center text-sm text-gray-400">No minds found</td>
                            </tr>
                        ) : (
                            filteredRows.map((row) => {
                                const isSelected = row.id === selectedMindId;
                                return (
                                    <tr
                                        key={row.id}
                                        onClick={() => onSelectMind(row)}
                                        className={`cursor-pointer transition-colors ${isSelected ? 'bg-purple-50/60 dark:bg-purple-900/10' : 'hover:bg-gray-50/50 dark:hover:bg-gray-700/30'}`}
                                    >
                                        <td className="px-4 py-4 text-sm font-semibold text-gray-900 dark:text-white whitespace-nowrap">{row.name}</td>
                                        <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">{row.primary_goal}</td>
                                        <td className="px-4 py-4 text-sm text-purple-600 dark:text-purple-400 whitespace-nowrap">{row.primary_state}</td>
                                        <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                            {row.components.map((c) => COMPONENT_LABELS[c] ?? c).join('-')}
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2 min-w-[110px]">
                                                <div className="w-14 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden shrink-0">
                                                    <div className="h-full bg-[#9810FA] rounded-full" style={{ width: `${Math.min(row.helpful_rate, 100)}%` }} />
                                                </div>
                                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{Math.round(row.helpful_rate)}%</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                                            {row.best_state} <span className="text-green-500 font-medium">({Math.round(row.best_state_rate)}%)</span>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                                            {row.weakest_state} <span className="text-red-400 font-medium">({Math.round(row.weakest_state_rate)}%)</span>
                                        </td>
                                        <td className="px-4 py-4 text-sm font-medium text-gray-600 dark:text-gray-400">{formatCount(row.plays)}</td>
                                        <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">{formatCount(row.unique_users)}</td>
                                        <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">{formatDuration(row.avg_time_per_user)}</td>
                                        <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">{formatDuration(row.avg_duration_per_play)}</td>
                                        <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">{Math.round(row.repeat_rate)}%</td>
                                        <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">{formatCount(row.saved)}</td>
                                        <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">{Math.round(row.timer_used)}%</td>
                                        <td className="px-4 py-4">
                                            <span className={`inline-flex items-center gap-1 text-xs font-semibold ${row.growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                {row.growth >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                                {row.growth >= 0 ? '+' : ''}{row.growth.toFixed(1)}%
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MindPerformanceTable;
