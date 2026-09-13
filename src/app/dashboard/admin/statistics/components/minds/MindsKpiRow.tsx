import React from 'react';
import { Brain, Activity, ThumbsUp, Clock, Repeat, Star } from 'lucide-react';
import type { MindsOverviewKPI } from '@/lib/api/types';

function fmtTime(seconds?: number): string {
    if (seconds == null) return '—';
    const s = Math.round(seconds);
    const m = Math.floor(s / 60);
    const rem = s % 60;
    if (m < 60) return rem > 0 ? `${m}m ${rem}s` : `${m}m`;
    const h = Math.floor(m / 60);
    const remM = m % 60;
    return remM > 0 ? `${h}h ${remM}m` : `${h}h`;
}

interface KpiCardProps {
    icon: React.ReactNode;
    iconBgClass: string;
    iconColorClass: string;
    label: string;
    value: string;
    compareText?: string;
    compareColorClass?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ icon, iconBgClass, iconColorClass, label, value, compareText, compareColorClass }) => (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col gap-3">
        <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${iconBgClass} ${iconColorClass}`}>
                {icon}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 truncate">{label}</span>
        </div>
        <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">{value}</p>
            {compareText && (
                <p className={`text-[11px] mt-1 ${compareColorClass ?? 'text-gray-400'}`}>{compareText}</p>
            )}
        </div>
    </div>
);

const MindsKpiRow: React.FC<{ kpi: MindsOverviewKPI | null; isLoading: boolean }> = ({ kpi, isLoading }) => {
    if (isLoading || !kpi) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm animate-pulse">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-3" />
                        <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-14" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <KpiCard
                icon={<Brain className="w-4 h-4" />}
                iconBgClass="bg-purple-50 dark:bg-purple-900/20" iconColorClass="text-purple-600 dark:text-purple-400"
                label="Total Minds"
                value={kpi.total_minds.toLocaleString()}
            />
            <KpiCard
                icon={<Activity className="w-4 h-4" />}
                iconBgClass="bg-green-50 dark:bg-green-900/20" iconColorClass="text-green-600 dark:text-green-400"
                label="Active Minds"
                value={kpi.active_minds.toLocaleString()}
                compareText={kpi.active_minds_change != null ? `${kpi.active_minds_change >= 0 ? '↑' : '↓'} ${Math.abs(kpi.active_minds_change).toFixed(0)}% vs prior period` : undefined}
                compareColorClass={kpi.active_minds_change != null && kpi.active_minds_change < 0 ? 'text-red-500' : 'text-green-500'}
            />
            <KpiCard
                icon={<ThumbsUp className="w-4 h-4" />}
                iconBgClass="bg-blue-50 dark:bg-blue-900/20" iconColorClass="text-blue-500 dark:text-blue-400"
                label="Overall Helpful Rate"
                value={`${Math.round(kpi.overall_helpful_rate)}%`}
                compareText={kpi.overall_helpful_rate_prior != null ? `vs ${Math.round(kpi.overall_helpful_rate_prior)}% prior 31 days` : undefined}
            />
            <KpiCard
                icon={<Clock className="w-4 h-4" />}
                iconBgClass="bg-purple-50 dark:bg-purple-900/20" iconColorClass="text-purple-600 dark:text-purple-400"
                label="Avg Time per User"
                value={fmtTime(kpi.avg_time_per_user)}
                compareText={kpi.avg_time_per_user_prior != null ? `vs ${fmtTime(kpi.avg_time_per_user_prior)} prior 31 days` : undefined}
            />
            <KpiCard
                icon={<Repeat className="w-4 h-4" />}
                iconBgClass="bg-orange-50 dark:bg-orange-900/20" iconColorClass="text-orange-500 dark:text-orange-400"
                label="Replays"
                value={`${kpi.replays.toFixed(1)}x`}
                compareText={kpi.replays_prior != null ? `vs ${kpi.replays_prior.toFixed(1)}x prior 31 days` : undefined}
            />
            <KpiCard
                icon={<Star className="w-4 h-4" />}
                iconBgClass="bg-yellow-50 dark:bg-yellow-900/20" iconColorClass="text-yellow-500 dark:text-yellow-400"
                label="Top Pathway"
                value={kpi.top_pathway_goal && kpi.top_pathway_state ? `${kpi.top_pathway_goal} → ${kpi.top_pathway_state}` : '—'}
            />
        </div>
    );
};

export default MindsKpiRow;
