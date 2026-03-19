"use client";
import { useEffect, useMemo, useState } from 'react';
import { Search, ChevronDown, ArrowUpDown } from 'lucide-react';
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
    env_visual: 'VR/360',
};

const getBadgeStyle = (type: string) => {
    switch (type) {
        case 'music': return 'bg-blue-50 text-blue-500 dark:bg-blue-900/20 dark:text-blue-400';
        case 'env_visual': return 'bg-purple-50 text-purple-500 dark:bg-purple-900/20 dark:text-purple-400';
        case 'env_sound': return 'bg-green-50 text-green-500 dark:bg-green-900/20 dark:text-green-400';
        case 'guided_session': return 'bg-orange-50 text-orange-400 dark:bg-orange-900/20 dark:text-orange-400';
        default: return 'bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400';
    }
};

const TopRankingsTable: React.FC = () => {
    const [allData, setAllData] = useState<PlaysByContent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState<ContentType | ''>('');
    const [page, setPage] = useState(1);

    useEffect(() => {
        analyticsApi.getPlaysByContent({ size: 500 })
            .then((res) => setAllData(res.results ?? []))
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, []);

    const filteredData = useMemo(() => {
        let result = allData;
        if (typeFilter) {
            result = result.filter((item) => item.content_type === typeFilter);
        }
        if (searchTerm.trim()) {
            const q = searchTerm.toLowerCase();
            result = result.filter((item) =>
                item.content_name?.toLowerCase().includes(q)
            );
        }
        return result;
    }, [allData, searchTerm, typeFilter]);

    const totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE));
    const pageNumbers = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1);
    const start = (page - 1) * PAGE_SIZE + 1;
    const end = Math.min(page * PAGE_SIZE, filteredData.length);
    const pageData = filteredData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        setPage(1);
    };

    const handleTypeFilter = (value: ContentType | '') => {
        setTypeFilter(value);
        setPage(1);
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
                        className="appearance-none flex items-center gap-4 pl-4 pr-10 py-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 transition-all cursor-pointer focus:outline-none"
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
                            <tr className="border-b border-gray-50 dark:border-gray-800">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider w-12">#</th>
                                <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    <div className="flex items-center gap-1">Title <ArrowUpDown className="w-3 h-3" /></div>
                                </th>
                                <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Type</th>
                                <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Plays</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Unique Listeners</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="py-16 text-center">
                                        <div className="flex justify-center">
                                            <div className="w-7 h-7 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                                        </div>
                                    </td>
                                </tr>
                            ) : pageData.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-16 text-center text-sm text-gray-400">
                                        No content found
                                    </td>
                                </tr>
                            ) : (
                                pageData.map((item, index) => (
                                    <tr key={`${item.content_id}-${index}`} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">
                                            {String((page - 1) * PAGE_SIZE + index + 1).padStart(2, '0')}
                                        </td>
                                        <td className="px-4 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                                            {item.content_name}
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-bold tracking-wide ${getBadgeStyle(item.content_type)}`}>
                                                {TYPE_LABELS[item.content_type] ?? item.content_type}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                                            {(item.plays ?? 0).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                                            {(item.unique_listeners ?? 0).toLocaleString()}
                                        </td>
                                    </tr>
                                ))
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
