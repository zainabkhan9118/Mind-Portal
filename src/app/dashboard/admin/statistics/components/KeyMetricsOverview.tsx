"use client";
import { useEffect, useState } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import analyticsApi from '@/lib/api/analyticsApi';
import type { AnalyticsOverview, PlaysKPI } from '@/lib/api/types';

const Skeleton = () => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4" />
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
    </div>
);

const fmtNum = (n?: number) => {
    if (n == null) return '—';
    if (n >= 1_000_000) return `${((n ?? 0) / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${((n ?? 0) / 1_000).toFixed(1)}K`;
    return (n ?? 0).toLocaleString();
};

const KeyMetricsOverview: React.FC = () => {
    const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
    const [kpi, setKpi] = useState<PlaysKPI | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        Promise.all([analyticsApi.getOverview(), analyticsApi.getPlaysKPI()])
            .then(([ov, k]) => { setOverview(ov); setKpi(k); })
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, []);

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => <Skeleton key={i} />)}
            </div>
        );
    }

    const metrics = [
        {
            label: 'Total Plays',
            value: fmtNum(kpi?.total_plays),
            trend: 'up' as const,
            trendLabel: `${fmtNum(overview?.total_plays)} all-time`,
        },
        {
            label: 'Unique Listeners',
            value: fmtNum(kpi?.unique_listeners),
            trend: 'up' as const,
            trendLabel: `${fmtNum(overview?.total_listeners)} total`,
        },
        {
            label: 'Avg Completion Rate',
            value: overview?.avg_completion_rate != null
                ? `${(overview.avg_completion_rate ?? 0).toFixed(1)}%`
                : '—',
            trend: 'up' as const,
            trendLabel: 'overall average',
        },
        {
            label: 'Avg Plays / User',
            value: kpi?.avg_plays_per_user != null
                ? `${(kpi.avg_plays_per_user ?? 0).toFixed(1)}x`
                : '—',
            trend: 'up' as const,
            trendLabel: 'per active user',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{metric.label}</p>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{metric.value}</h3>
                    <div className={`flex items-center gap-1 text-sm font-medium ${metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                        {metric.trend === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                        <span>{metric.trendLabel}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default KeyMetricsOverview;
