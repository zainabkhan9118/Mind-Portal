"use client";
import { useCallback, useEffect, useRef, useState } from 'react';
import monetizationApi from '@/lib/api/monetizationApi';
import type { Subscription } from '@/lib/api/types';

const PAGE_SIZE = 10;

const STATUS_COLORS: Record<string, string> = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    expired: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
};

const TIER_COLORS: Record<string, string> = {
    free: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    basic: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    premium: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    enterprise: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
};

const B2BClientsTable = () => {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const fetchData = useCallback((search: string, pg: number) => {
        setIsLoading(true);
        monetizationApi
            .getSubscriptions({ tier: 'enterprise', search, page: pg, size: PAGE_SIZE })
            .then((res) => {
                setSubscriptions(res.results);
                setTotal(res.count ?? 0);
            })
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        fetchData(searchTerm, page);
    }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            setPage(1);
            fetchData(value, 1);
        }, 400);
    };

    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const start = (page - 1) * PAGE_SIZE + 1;
    const end = Math.min(page * PAGE_SIZE, total);

    const pageNumbers = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1);

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-orange-100 dark:bg-orange-900/20 rounded">
                        <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">Enterprise Clients</h3>
                    <span className="text-xs text-gray-400 font-normal">({total} total)</span>
                </div>

                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="pl-4 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 w-64"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-sm font-medium text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                            <th className="pb-4 pl-4">User</th>
                            <th className="pb-4">Plan</th>
                            <th className="pb-4 text-center">Tier</th>
                            <th className="pb-4 text-center">Status</th>
                            <th className="pb-4 pr-4 text-right">Period End</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {isLoading ? (
                            <tr>
                                <td colSpan={5} className="py-12 text-center">
                                    <div className="flex justify-center">
                                        <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                                    </div>
                                </td>
                            </tr>
                        ) : subscriptions.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-12 text-center text-sm text-gray-400">
                                    No enterprise subscriptions found
                                </td>
                            </tr>
                        ) : (
                            subscriptions.map((sub) => (
                                <tr key={sub.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors h-16">
                                    <td className="pl-4">
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">{sub.user_name}</p>
                                        <p className="text-xs text-gray-400">{sub.user_email}</p>
                                    </td>
                                    <td className="text-sm text-gray-700 dark:text-gray-300">{sub.plan_name}</td>
                                    <td className="text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${TIER_COLORS[sub.plan_tier] ?? TIER_COLORS.enterprise}`}>
                                            {sub.plan_tier || 'Enterprise'}
                                        </span>
                                    </td>
                                    <td className="text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[sub.status] ?? STATUS_COLORS.expired}`}>
                                            {sub.status}
                                        </span>
                                    </td>
                                    <td className="pr-4 text-right text-sm text-gray-600 dark:text-gray-400">
                                        {sub.current_period_end
                                            ? new Date(sub.current_period_end).toLocaleDateString()
                                            : '—'}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-0">
                    {total > 0
                        ? <>Showing <span className="font-medium text-gray-900 dark:text-white">{start}–{end}</span> of <span className="font-medium text-gray-900 dark:text-white">{total}</span></>
                        : 'No results'}
                </p>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-40"
                    >
                        <span className="sr-only">Previous</span>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    {pageNumbers.map((p) => (
                        <button
                            key={p}
                            onClick={() => setPage(p)}
                            className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                                p === page
                                    ? 'bg-[#9810FA] text-white'
                                    : 'border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                        >
                            {p}
                        </button>
                    ))}
                    {totalPages > 5 && (
                        <>
                            <span className="w-8 h-8 flex items-center justify-center text-gray-400">...</span>
                            <button
                                onClick={() => setPage(totalPages)}
                                className={`w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${page === totalPages ? 'bg-[#9810FA] text-white border-transparent' : ''}`}
                            >
                                {totalPages}
                            </button>
                        </>
                    )}
                    <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-40"
                    >
                        <span className="sr-only">Next</span>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default B2BClientsTable;
