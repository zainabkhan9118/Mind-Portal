"use client";
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import analyticsApi from '@/lib/api/analyticsApi';
import type { PlaysByType, AnalyticsParams } from '@/lib/api/types';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

// ── Chart config ───────────────────────────────────────────────────────────

// Note: the analytics API returns "guided_session" for this content type — NOT "mind_session"
// (the slug used by Content Management). Don't "fix" this back to mind_session.
const TYPE_CONFIG = [
    { key: 'guided_session', label: 'Guided Sessions', emoji: '🧘', color: '#A855F7' },
    { key: 'music',          label: 'Music',           emoji: '🎵', color: '#3B82F6' },
    { key: 'env_sound',      label: 'Sounds',          emoji: '🎿', color: '#06B6D4' },
    { key: 'env_visual_vr',  label: 'VR',              emoji: '🌃', color: '#7C3AED' },
    { key: 'env_visual_360', label: '360°',            emoji: '👁️', color: '#6366F1' },
];

interface MostPlayedStylesChartProps {
    dateParams?: AnalyticsParams;
}

// ── Component ──────────────────────────────────────────────────────────────

const MostPlayedStylesChart: React.FC<MostPlayedStylesChartProps> = ({ dateParams }) => {
    const [byType, setByType] = useState<PlaysByType[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        analyticsApi.getPlaysByType(dateParams)
            .then(setByType)
            .catch(console.error)
            .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dateParams?.start_date, dateParams?.end_date, (dateParams?.content_type ?? []).join(','), dateParams?.category, dateParams?.sub_category, dateParams?.goal]);

    // ── Chart ─────────────────────────────────────────────────────────────
    const total = byType.reduce((s, t) => s + (t.plays ?? 0), 0) || 1;
    const configuredData = TYPE_CONFIG.map((cfg) => {
        if (cfg.key === 'env_visual_vr' || cfg.key === 'env_visual_360') {
            const visual = byType.find((t) => t.content_type === 'env_visual');
            return { ...cfg, plays: visual ? Math.floor((visual.plays ?? 0) / 2) : 0 };
        }
        return { ...cfg, plays: byType.find((t) => t.content_type === cfg.key)?.plays ?? 0 };
    });
    const series = configuredData.map((d) => Math.round((d.plays / total) * 100));
    const options: ApexOptions = {
        chart: { type: 'pie', toolbar: { show: false } },
        labels: configuredData.map((d) => d.label),
        colors: configuredData.map((d) => d.color),
        legend: { show: false },
        dataLabels: {
            enabled: true,
            formatter: (val) => `${Math.round(Number(val))}%`,
            style: { fontSize: '12px', fontFamily: 'inherit', fontWeight: '600', colors: ['#fff'] },
            dropShadow: { enabled: false },
        },
        stroke: { width: 2, colors: ['#fff'] },
        tooltip: { enabled: true, y: { formatter: (val) => `${val}%` } },
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-6 pt-6 pb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Most Played Content.</h3>
            </div>

            <div className="mx-6 border-t-2 border-dashed border-purple-400 dark:border-purple-600 mb-5" />

            {/* Chart + legend */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : byType.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-16 px-6">No data available</p>
            ) : (
                <div className="px-6 pb-6">
                    <div className="flex justify-center mb-6">
                        <ReactApexChart
                            options={options}
                            series={series.some((v) => v > 0) ? series : [1]}
                            type="pie"
                            width={300}
                        />
                    </div>
                    <div className="space-y-3">
                        {configuredData.map((item, i) => (
                            <div key={item.key} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                                    <span className="text-sm text-gray-700 dark:text-gray-300 font-medium flex items-center gap-1.5">
                                        {item.label} <span>{item.emoji}</span>
                                    </span>
                                </div>
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">{series[i]}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MostPlayedStylesChart;
