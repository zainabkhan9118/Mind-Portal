"use client";
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { Music, Waves, Mic, Eye } from 'lucide-react';
import analyticsApi from '@/lib/api/analyticsApi';
import type { PlaysByType } from '@/lib/api/types';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const TYPE_LABELS: Record<string, string> = {
    music: 'Music',
    guided_session: 'Guided',
    env_sound: 'Sound',
    env_visual: 'VR/360',
};

const TYPE_ICONS: Record<string, React.ReactNode> = {
    music: <Music className="w-5 h-5 text-purple-600" />,
    guided_session: <Mic className="w-5 h-5 text-cyan-500" />,
    env_sound: <Waves className="w-5 h-5 text-blue-500" />,
    env_visual: <Eye className="w-5 h-5 text-indigo-500" />,
};

const COLORS = ['#A855F7', '#3B82F6', '#06B6D4', '#8B5CF6'];

const ComponentPlaysChart: React.FC = () => {
    const [byType, setByType] = useState<PlaysByType[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        analyticsApi.getPlaysByType()
            .then(setByType)
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, []);

    // Embed fillColor per data point to avoid distributed:true (which crashes under React 18 StrictMode)
    const seriesData = byType.map((t, i) => ({
        x: TYPE_LABELS[t.content_type] ?? t.content_type ?? `Type ${i}`,
        y: t.plays ?? 0,
        fillColor: COLORS[i % COLORS.length],
    }));

    const series = [{ name: 'Plays', data: seriesData }];

    const options: ApexOptions = {
        chart: { type: 'bar', height: 300, toolbar: { show: false } },
        plotOptions: {
            bar: { borderRadius: 8, columnWidth: '60%' },
        },
        dataLabels: { enabled: false },
        xaxis: {
            labels: { style: { colors: '#9CA3AF' } },
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: {
            labels: {
                style: { colors: '#9CA3AF' },
                formatter: (v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`,
            },
        },
        grid: { borderColor: '#f3f4f6', strokeDashArray: 4 },
        legend: { show: false },
        tooltip: { y: { formatter: (v) => (v ?? 0).toLocaleString() } },
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Component Plays</h3>
                <p className="text-sm text-purple-600 dark:text-purple-400">Breakdown by content type</p>
            </div>

            <div className="mb-8 h-[300px]">
                {isLoading ? (
                    <div className="h-full flex items-center justify-center">
                        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : byType.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                        <p className="text-sm text-gray-400">No data available</p>
                    </div>
                ) : (
                    <ReactApexChart key={seriesData.map(d => d.y).join(',')} options={options} series={series} type="bar" height="100%" />
                )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {isLoading
                    ? [...Array(4)].map((_, i) => (
                        <div key={i} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 animate-pulse">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2" />
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-12" />
                        </div>
                    ))
                    : byType.map((t, i) => (
                        <div key={t.content_type || String(i)} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center gap-2 mb-2">
                                {TYPE_ICONS[t.content_type] ?? <Eye className="w-5 h-5 text-gray-400" />}
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {TYPE_LABELS[t.content_type] ?? t.content_type}
                                </span>
                            </div>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">
                                {(t.plays ?? 0).toLocaleString()}
                            </p>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default ComponentPlaysChart;
