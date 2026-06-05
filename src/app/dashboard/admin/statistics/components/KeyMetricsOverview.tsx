"use client";
import { useEffect, useState } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import analyticsApi from '@/lib/api/analyticsApi';
import type { AnalyticsOverview, PlaysKPI } from '@/lib/api/types';

const Skeleton = () => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-36 mb-4" />
        <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded w-28 mb-4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
    </div>
);

function fmtNum(n?: number): string {
    if (n == null) return '—';
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return n.toLocaleString();
}

function fmtTime(seconds?: number): string {
    if (seconds == null) return '—';
    const s = Math.round(seconds);
    if (s < 60) return `${s}s`;
    const m = Math.floor(s / 60);
    const rem = s % 60;
    if (m < 60) return rem > 0 ? `${m}m ${rem}s` : `${m}m`;
    const h = Math.floor(m / 60);
    const remM = m % 60;
    return remM > 0 ? `${h}h ${remM}m` : `${h}h`;
}

interface Metric {
    label: string;
    value: string;
    change?: number; // % value; positive = up, negative = down, undefined = unknown
    changeLabel: string;
}

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

    const totalMindsCreated =
        kpi?.total_minds_created ??
        (overview?.total_items
            ? Object.values(overview.total_items).reduce((a, b) => a + b, 0)
            : undefined);

    const metrics: Metric[] = [
        {
            label: 'Total Plays',
            value: fmtNum(kpi?.total_plays ?? overview?.total_plays),
            change: kpi?.total_plays_change,
            changeLabel: 'in last 24h',
        },
        {
            label: 'Total Minds Created',
            value: fmtNum(totalMindsCreated),
            change: kpi?.total_minds_created_change,
            changeLabel: 'in last 4h',
        },
        {
            label: 'Avg Mind Time per User',
            value: fmtTime(kpi?.avg_time_per_user),
            change: kpi?.avg_time_per_user_change,
            changeLabel: 'in last 24h',
        },
        {
            label: 'Avg Mind Duration per Play',
            value: fmtTime(kpi?.avg_duration_per_play),
            change: kpi?.avg_duration_per_play_change,
            changeLabel: 'in last 24h',
        },
    ];

    return (
        <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Key Metrics Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((metric) => {
                    const isUp = metric.change == null || metric.change >= 0;
                    return (
                        <div
                            key={metric.label}
                            className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{metric.label}</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
                                {metric.value}
                            </h3>
                            <div className={`flex items-center gap-1 text-sm font-medium ${isUp ? 'text-green-500' : 'text-red-500'}`}>
                                {isUp
                                    ? <ArrowUp className="w-4 h-4 flex-shrink-0" />
                                    : <ArrowDown className="w-4 h-4 flex-shrink-0" />}
                                <span>
                                    {metric.change != null
                                        ? `${metric.change > 0 ? '+' : ''}${metric.change.toFixed(1)}% ${metric.changeLabel}`
                                        : metric.changeLabel}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default KeyMetricsOverview;
