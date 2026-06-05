"use client";
import { useEffect, useMemo, useState } from 'react';
import { Search, ChevronDown, ArrowUpDown, TrendingUp, TrendingDown, Music, Wind, TreePine, Headphones } from 'lucide-react';
import analyticsApi from '@/lib/api/analyticsApi';
import type { PlaysByContent, ContentType } from '@/lib/api/types';

const PAGE_SIZE = 10;

const TYPE_OPTIONS: { label: string; value: ContentType | '' }[] = [
    { label: 'All Types', value: '' },
    { label: 'Music', value: 'music' },
    { label: 'Guided Session', value: 'guided_session' },
    { label: 'Env Sound', value: 'env_sound' },
    { label: 'Env Visual', value: 'env_visual' },
];

const TYPE_LABELS: Record<string, string> = {
    music: 'Music',
    guided_session: 'Guided',
    env_sound: 'Sound',
    env_visual: 'Visuals',
};

const getBadgeStyle = (type: string) => {
    switch (type) {
        case 'music': return 'bg-purple-50 text-purple-500 dark:bg-purple-900/20 dark:text-purple-400';
        case 'env_visual': return 'bg-yellow-50 text-yellow-500 dark:bg-yellow-900/20 dark:text-yellow-400';
        case 'env_sound': return 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400';
        case 'guided_session': return 'bg-orange-50 text-orange-400 dark:bg-orange-900/20 dark:text-orange-400';
        default: return 'bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400';
    }
};

const getTypeIcon = (type: string) => {
    const cls = 'w-4 h-4 flex-shrink-0 text-gray-400 dark:text-gray-500';
    switch (type) {
        case 'music': return <Music className={cls} />;
        case 'guided_session': return <Headphones className={cls} />;
        case 'env_sound': return <Wind className={cls} />;
        case 'env_visual': return <TreePine className={cls} />;
        default: return <Music className={cls} />;
    }
};

function formatDuration(seconds: number | undefined): string {
    if (seconds == null) return '—';
    const s = Math.round(seconds);
    if (s < 60) return `${s} sec`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m} min`;
    const h = Math.floor(m / 60);
    const remM = m % 60;
    return remM > 0 ? `${h}h ${remM}m` : `${h}h`;
}

function formatPlays(n: number): string {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
    return n.toString();
}

const TopRankingsTable: React.FC = () => {
    const [allData, setAllData] = useState<PlaysByContent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState<ContentType | ''>('');
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState<Set<number>>(new Set());

    useEffect(() => {
        analyticsApi.getPlaysByContent({ size: 500 })
            .then((res) => setAllData(res.results ?? []))
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, []);

    const filteredData = useMemo(() => {
        let result = allData;
        if (typeFilter) result = result.filter((item) => item.content_type === typeFilter);
        if (searchTerm.trim()) {
            const q = searchTerm.toLowerCase();
            result = result.filter((item) => item.content_name?.toLowerCase().includes(q));
        }
        return result;
    }, [allData, searchTerm, typeFilter]);

    const totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE));
    const pageNumbers = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1);
    const start = (page - 1) * PAGE_SIZE + 1;
    const end = Math.min(page * PAGE_SIZE, filteredData.length);
    const pageData = filteredData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const handleSearch = (value: string) => { setSearchTerm(value); setPage(1); };
    const handleTypeFilter = (value: ContentType | '') => { setTypeFilter(value); setPage(1); };

    const allPageSelected = pageData.length > 0 && pageData.every((r) => selected.has(r.content_id));
    const toggleAll = () => {
        setSelected((prev) => {
            const next = new Set(prev);
            if (allPageSelected) pageData.forEach((r) => next.delete(r.content_id));
            else pageData.forEach((r) => next.add(r.content_id));
            return next;
        });
    };
    const toggleRow = (id: number) => {
        setSelected((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
    };

    return (
        <div className="space-y-4">
            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row justify-end items-center gap-4">
                <div className="relative w-full md:w-80">
                    <input
                        type="text"
                        placeholder="Search content..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full pl-6 pr-10 py-3 rounded-full border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 placeholder:text-gray-400"
                    />
                    <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
                <div className="relative">
                    <select
                        value={typeFilter}
                        onChange={(e) => handleTypeFilter(e.target.value as ContentType | '')}
                        className="appearance-none pl-4 pr-10 py-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 transition-all cursor-pointer focus:outline-none"
                    >
                        {TYPE_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-gray-800">
                                <th className="pl-5 pr-2 py-4 w-10">
                                    <input
                                        type="checkbox"
                                        checked={allPageSelected}
                                        onChange={toggleAll}
                                        className="w-4 h-4 rounded border-gray-300 text-purple-600 cursor-pointer accent-purple-600"
                                    />
                                </th>
                                <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider w-14">Rank</th>
                                <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    <div className="flex items-center gap-1">Title <ArrowUpDown className="w-3 h-3" /></div>
                                </th>
                                <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider min-w-[180px]">Retention</th>
                                <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">Avg Time per User</th>
                                <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">Avg Duration per Play</th>
                                <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Plays</th>
                                <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Growth</th>
                                <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Type</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={9} className="py-16 text-center">
                                        <div className="flex justify-center">
                                            <div className="w-7 h-7 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                                        </div>
                                    </td>
                                </tr>
                            ) : pageData.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="py-16 text-center text-sm text-gray-400">
                                        No content found
                                    </td>
                                </tr>
                            ) : (
                                pageData.map((item, index) => {
                                    const rowNum = (page - 1) * PAGE_SIZE + index + 1;
                                    const retention = item.retention;
                                    const growthRate = item.growth_rate;
                                    const isSelected = selected.has(item.content_id);

                                    return (
                                        <tr
                                            key={`${item.content_id}-${index}`}
                                            className={`transition-colors ${isSelected ? 'bg-purple-50/40 dark:bg-purple-900/10' : 'hover:bg-gray-50/50 dark:hover:bg-gray-800/50'}`}
                                        >
                                            {/* Checkbox */}
                                            <td className="pl-5 pr-2 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => toggleRow(item.content_id)}
                                                    className="w-4 h-4 rounded border-gray-300 text-purple-600 cursor-pointer accent-purple-600"
                                                />
                                            </td>
                                            {/* Rank */}
                                            <td className="px-4 py-4 text-sm font-bold text-gray-900 dark:text-white">
                                                {String(rowNum).padStart(2, '0')}
                                            </td>
                                            {/* Title + icon */}
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-2">
                                                    {getTypeIcon(item.content_type)}
                                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                                        {item.content_name}
                                                    </span>
                                                </div>
                                            </td>
                                            {/* Retention bar — only Music & Guided Session */}
                                            <td className="px-4 py-4">
                                                {(item.content_type === 'music' || item.content_type === 'guided_session') ? (
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-28 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden flex-shrink-0">
                                                            <div
                                                                className="h-full bg-green-500 rounded-full transition-all"
                                                                style={{ width: retention != null ? `${Math.min(retention, 100)}%` : '0%' }}
                                                            />
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-10 flex-shrink-0">
                                                            {retention != null ? `${Math.round(retention)}%` : '—'}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-gray-300 dark:text-gray-600">N/A</span>
                                                )}
                                            </td>
                                            {/* Avg Time per User */}
                                            <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                                                {formatDuration(item.avg_time_per_user)}
                                            </td>
                                            {/* Avg Duration per Play */}
                                            <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                                                {formatDuration(item.avg_duration_per_play)}
                                            </td>
                                            {/* Plays */}
                                            <td className="px-4 py-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                                                {formatPlays(item.plays ?? 0)}
                                            </td>
                                            {/* Growth */}
                                            <td className="px-4 py-4">
                                                {growthRate != null ? (
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                                                        growthRate >= 0
                                                            ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                                                            : 'bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400'
                                                    }`}>
                                                        {growthRate >= 0
                                                            ? <TrendingUp className="w-3 h-3" />
                                                            : <TrendingDown className="w-3 h-3" />}
                                                        {growthRate >= 0 ? '+' : ''}{growthRate}%
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-300 dark:text-gray-700 text-sm">—</span>
                                                )}
                                            </td>
                                            {/* Type */}
                                            <td className="px-4 py-4">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-bold tracking-wide ${getBadgeStyle(item.content_type)}`}>
                                                    {TYPE_LABELS[item.content_type] ?? item.content_type}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 border-t border-gray-50 dark:border-gray-800">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-0">
                        {filteredData.length > 0
                            ? <>Showing <span className="font-medium text-gray-900 dark:text-white">{start}–{end}</span> of <span className="font-medium text-gray-900 dark:text-white">{filteredData.length}</span></>
                            : 'No results'}
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        {pageNumbers.map((p) => (
                            <button
                                key={p}
                                onClick={() => setPage(p)}
                                className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${p === page ? 'bg-[#9810FA] text-white' : 'border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                            >
                                {p}
                            </button>
                        ))}
                        {totalPages > 5 && (
                            <>
                                <span className="text-gray-400">...</span>
                                <button
                                    onClick={() => setPage(totalPages)}
                                    className={`w-8 h-8 flex items-center justify-center rounded-lg border text-sm font-medium transition-colors ${page === totalPages ? 'bg-[#9810FA] text-white border-transparent' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                                >
                                    {totalPages}
                                </button>
                            </>
                        )}
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopRankingsTable;
