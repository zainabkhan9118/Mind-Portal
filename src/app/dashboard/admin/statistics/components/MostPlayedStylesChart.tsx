"use client";
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { Music, Eye, Waves, Glasses, ScanFace } from 'lucide-react';
import analyticsApi from '@/lib/api/analyticsApi';
import type { PlaysByType } from '@/lib/api/types';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const TYPE_LABELS: Record<string, string> = {
    music: 'Music',
    guided_session: 'Guided Sessions',
    env_sound: 'Sounds',
    env_visual: 'VR/360',
};

const TYPE_ICONS: Record<string, React.ReactNode> = {
    music: <Music className="w-4 h-4" />,
    guided_session: <ScanFace className="w-4 h-4" />,
    env_sound: <Waves className="w-4 h-4" />,
    env_visual: <Glasses className="w-4 h-4" />,
};

const COLORS = ['#A855F7', '#3B82F6', '#06B6D4', '#8B5CF6', '#6366F1'];

// VR types for audio vs VR segmentation
const VR_TYPES = ['env_visual'];

const MostPlayedStylesChart: React.FC = () => {
    const [byType, setByType] = useState<PlaysByType[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        analyticsApi.getPlaysByType()
            .then(setByType)
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, []);

    const total = byType.reduce((s, t) => s + (t.plays ?? 0), 0) || 1;
    const labels = byType.map((t, i) => TYPE_LABELS[t.type] ?? t.type ?? `Type ${i}`);
    const series = byType.map((t) => Math.round(((t.plays ?? 0) / total) * 100));

    // Audio vs VR segmentation
    const vrPlays = byType.filter((t) => VR_TYPES.includes(t.type)).reduce((s, t) => s + (t.plays ?? 0), 0);
    const audioPlays = total - vrPlays;
    const audioPct = total > 0 ? Math.round((audioPlays / total) * 100) : 0;
    const vrPct = 100 - audioPct;

    const options: ApexOptions = {
        chart: { type: 'pie' },
        labels,
        colors: COLORS.slice(0, byType.length),
        legend: { show: false },
        dataLabels: {
            enabled: true,
            formatter: (val) => `${Math.round(Number(val))}%`,
            style: { fontSize: '12px', fontFamily: 'inherit', fontWeight: 600, colors: ['#fff'] },
            dropShadow: { enabled: false },
        },
        stroke: { width: 1, colors: ['#fff'] },
        plotOptions: { pie: { donut: { size: '0%' } } },
        tooltip: { enabled: true, y: { formatter: (val) => `${val}%` } },
    };

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm h-full flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm h-full flex flex-col justify-between">
            <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Most Played Styles & Categories</h3>
                <p className="text-sm text-purple-600 dark:text-purple-400">Content distribution by category</p>
            </div>

            {byType.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-12">No data available</p>
            ) : (
                <>
                    <div className="flex justify-center mb-6">
                        <ReactApexChart options={options} series={series.length ? series : [1]} type="pie" width={320} />
                    </div>

                    <div className="space-y-3 mb-8">
                        {byType.map((t, i) => (
                            <div key={t.type || String(i)} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] ?? '#ccc' }} />
                                    <span className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-1.5">
                                        {TYPE_LABELS[t.type] ?? t.type}
                                        <span className="text-gray-400">{TYPE_ICONS[t.type] ?? <Eye className="w-4 h-4" />}</span>
                                    </span>
                                </div>
                                <span className="font-semibold text-gray-900 dark:text-white">{series[i]}%</span>
                            </div>
                        ))}
                    </div>

                    <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
                        <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-4">Audio vs VR Segmentation</h4>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm font-medium">
                                    <span className="text-gray-600 dark:text-gray-400">Audio</span>
                                    <span className="text-gray-900 dark:text-white">{audioPct}%</span>
                                </div>
                                <div className="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${audioPct}%` }} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm font-medium">
                                    <span className="text-gray-600 dark:text-gray-400">VR/360</span>
                                    <span className="text-gray-900 dark:text-white">{vrPct}%</span>
                                </div>
                                <div className="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-purple-500 rounded-full" style={{ width: `${vrPct}%` }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default MostPlayedStylesChart;
