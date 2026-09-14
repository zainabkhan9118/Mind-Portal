"use client";
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { Music, Waves, Mic, Glasses } from 'lucide-react';
import analyticsApi from '@/lib/api/analyticsApi';
import type { AnalyticsParams, AvgDurationByType, AvgDurationTimeseriesPoint } from '@/lib/api/types';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

// Note: the analytics API returns "guided_session" for this content type — NOT "mind_session"
// (the slug used by Content Management). Don't "fix" this back to mind_session.
const KNOWN_TYPES = ['env_sound', 'music', 'guided_session', 'env_visual'] as const;

const TYPE_CONFIG: Record<string, { label: string; icon: React.ReactNode; bg: string; text: string; color: string }> = {
    env_sound: { label: 'Sound', icon: <Waves className="w-5 h-5 text-cyan-500" />, bg: 'bg-cyan-50 dark:bg-cyan-900/20', text: 'text-cyan-600 dark:text-cyan-400', color: '#06B6D4' },
    music: { label: 'Music', icon: <Music className="w-5 h-5 text-purple-600" />, bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400', color: '#A855F7' },
    guided_session: { label: 'Guided', icon: <Mic className="w-5 h-5 text-amber-500" />, bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600 dark:text-amber-400', color: '#F59E0B' },
    env_visual: { label: 'Visuals', icon: <Glasses className="w-5 h-5 text-indigo-500" />, bg: 'bg-indigo-50 dark:bg-indigo-900/20', text: 'text-indigo-600 dark:text-indigo-400', color: '#6366F1' },
};

function fmtTime(seconds?: number): string {
    if (!seconds) return '0m';
    const s = Math.round(seconds);
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return rem > 0 ? `${m}m ${rem}s` : `${m}m`;
}

interface AvgListeningTimeChartProps {
    dateParams?: AnalyticsParams;
}

const AvgListeningTimeChart: React.FC<AvgListeningTimeChartProps> = ({ dateParams }) => {
    const [byType, setByType] = useState<AvgDurationByType[]>([]);
    const [timeseries, setTimeseries] = useState<AvgDurationTimeseriesPoint[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        Promise.all([
            analyticsApi.getAvgDurationByType(dateParams),
            analyticsApi.getAvgDurationTimeseries(dateParams),
        ])
            .then(([byTypeRes, timeseriesRes]) => { setByType(byTypeRes); setTimeseries(timeseriesRes); })
            .catch(() => { setByType([]); setTimeseries([]); })
            .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dateParams?.start_date, dateParams?.end_date, (dateParams?.content_type ?? []).join(','), dateParams?.category, dateParams?.sub_category, dateParams?.goal]);

    const cards = KNOWN_TYPES.map((type) => ({
        type,
        ...TYPE_CONFIG[type],
        durationSeconds: byType.find((t) => t.content_type === type)?.average_duration_seconds,
    }));

    const dates = Array.from(new Set(timeseries.map((p) => p.date))).sort();
    const series = KNOWN_TYPES.map((type) => ({
        name: TYPE_CONFIG[type].label,
        data: dates.map((date) => {
            const point = timeseries.find((p) => p.date === date && p.content_type === type);
            return point ? Math.round((point.average_duration_seconds / 60) * 10) / 10 : 0;
        }),
    }));

    const options: ApexOptions = {
        chart: { type: 'line', height: 350, toolbar: { show: false }, zoom: { enabled: false } },
        colors: KNOWN_TYPES.map((t) => TYPE_CONFIG[t].color),
        stroke: { curve: 'smooth', width: 3 },
        dataLabels: { enabled: false },
        xaxis: {
            categories: dates.map((d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: { style: { colors: '#9CA3AF' } },
        },
        yaxis: {
            min: 0,
            title: { text: 'Minutes', style: { color: '#9CA3AF' } },
            labels: { style: { colors: '#9CA3AF' } },
        },
        grid: { borderColor: '#f3f4f6', strokeDashArray: 4, padding: { top: 0, right: 0, bottom: 0, left: 10 } },
        legend: { position: 'bottom', horizontalAlign: 'center' },
        markers: { size: 4, strokeWidth: 2, hover: { sizeOffset: 2 } },
        tooltip: { y: { formatter: (v) => `${v}m` } },
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Average Listening & Experience Time</h3>
                <p className="text-sm text-purple-600 dark:text-purple-400">Duration analytics per content type</p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {isLoading ? (
                    [...Array(4)].map((_, i) => (
                        <div key={i} className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 animate-pulse">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-14 mb-3" />
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                        </div>
                    ))
                ) : (
                    cards.map((card) => (
                        <div key={card.type} className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center gap-2 mb-3">
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${card.bg} ${card.text}`}>
                                    {card.label}
                                </span>
                            </div>
                            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Avg. Duration</h4>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-400">⏱️</span>
                                <p className="text-xl font-bold text-gray-900 dark:text-white">{fmtTime(card.durationSeconds)}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Chart */}
            <div id="avg-listening-chart" className="h-[350px]">
                {isLoading ? (
                    <div className="h-full flex items-center justify-center">
                        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : dates.length === 0 ? (
                    <p className="h-full flex items-center justify-center text-sm text-gray-400">No data available</p>
                ) : (
                    <ReactApexChart options={options} series={series} type="line" height={350} />
                )}
            </div>
        </div>
    );
};

export default AvgListeningTimeChart;
