"use client";
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { Smartphone, Headset } from 'lucide-react';
import analyticsApi from '@/lib/api/analyticsApi';
import type { AnalyticsParams, PlaysByPlatform } from '@/lib/api/types';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const DEVICE_CONFIG: Record<string, { label: string; barClass: string }> = {
    ios: { label: 'iOS', barClass: 'bg-blue-500' },
    android: { label: 'Android', barClass: 'bg-cyan-500' },
    meta_quest: { label: 'Meta Quest', barClass: 'bg-purple-500' },
    other_vr: { label: 'Other VR', barClass: 'bg-indigo-500' },
    '': { label: 'Unclassified', barClass: 'bg-gray-400' },
};

function fmtTime(seconds?: number): string {
    if (seconds == null) return '—';
    const s = Math.round(seconds);
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return rem > 0 ? `${m}m ${rem}s` : `${m}m`;
}

interface VrVsMobileChartProps {
    dateParams?: AnalyticsParams;
}

const VrVsMobileChart: React.FC<VrVsMobileChartProps> = ({ dateParams }) => {
    const [data, setData] = useState<PlaysByPlatform | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        analyticsApi.getPlaysByPlatform(dateParams)
            .then(setData)
            .catch(() => setData(null))
            .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dateParams?.start_date, dateParams?.end_date, (dateParams?.content_type ?? []).join(','), dateParams?.category, dateParams?.sub_category, dateParams?.goal]);

    const mobileShare = data?.platform_share.find((p) => p.platform === 'mobile');
    const vrShare = data?.platform_share.find((p) => p.platform === 'vr');
    const mobileDuration = data?.average_session_duration.find((p) => p.platform === 'mobile');
    const vrDuration = data?.average_session_duration.find((p) => p.platform === 'vr');

    const series = [mobileShare?.percentage ?? 0, vrShare?.percentage ?? 0];
    const labels = ["Mobile", "VR Headset"];
    const colors = ["#3B82F6", "#8B5CF6"];

    const options: ApexOptions = {
        chart: { type: 'donut' },
        labels,
        colors,
        dataLabels: { enabled: false },
        plotOptions: { pie: { donut: { size: '75%', labels: { show: false } } } },
        legend: { show: false },
        stroke: { width: 0, colors: ['transparent'] },
        tooltip: { y: { formatter: (val) => `${val}%` } },
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm h-full flex flex-col justify-between overflow-hidden">
            {/* Header */}
            <div className="px-6 pt-6 pb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">VR vs Mobile Usage</h3>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">Platform distribution & device breakdown</p>
            </div>

            <div className="mx-6 border-t-2 border-dashed border-purple-400 dark:border-purple-600 mb-5" />

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : !data || data.total_plays === 0 ? (
                <p className="text-sm text-gray-400 text-center py-16 px-6">No plays recorded for this period</p>
            ) : (
                <>
                    {/* Top Section: Chart + Cards */}
                    <div className="flex flex-col xl:flex-row items-center justify-between gap-6 px-6 py-4">
                        <div className="relative flex-none">
                            <ReactApexChart options={options} series={series.some((v) => v > 0) ? series : [1, 1]} type="donut" width={300} />
                        </div>

                        <div className="flex flex-col gap-3 w-full xl:w-auto flex-1">
                            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 flex flex-col justify-center">
                                <div className="flex items-center gap-2 mb-2">
                                    <Smartphone className="w-4 h-4 text-blue-500" />
                                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Mobile</span>
                                </div>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">{Math.round(mobileShare?.percentage ?? 0)}%</p>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 flex flex-col justify-center">
                                <div className="flex items-center gap-2 mb-2">
                                    <Headset className="w-4 h-4 text-purple-500" />
                                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">VR Headset</span>
                                </div>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">{Math.round(vrShare?.percentage ?? 0)}%</p>
                            </div>
                        </div>
                    </div>

                    {/* Device Breakdown */}
                    <div className="space-y-5 px-6">
                        <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400">Device Breakdown</h4>
                        <div className="space-y-4">
                            {data.device_breakdown.map((d) => {
                                const cfg = DEVICE_CONFIG[d.device_type] ?? { label: d.device_type || 'Unclassified', barClass: 'bg-gray-400' };
                                return (
                                    <div key={d.device_type || 'unclassified'} className="space-y-2">
                                        <div className="flex justify-between text-sm font-medium">
                                            <span className="text-gray-600 dark:text-gray-300">{cfg.label}</span>
                                            <span className="text-gray-900 dark:text-white">{Math.round(d.percentage)}%</span>
                                        </div>
                                        <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <div className={`h-full rounded-full ${cfg.barClass}`} style={{ width: `${d.percentage}%` }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Bottom Section: Avg Session Stats */}
                    <div className="mt-8 mx-6 mb-6 bg-purple-50 dark:bg-purple-900/10 rounded-2xl p-6 grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1">Avg. Mobile Session</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">{fmtTime(mobileDuration?.average_duration_seconds)}</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1">Avg. VR Session</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">{fmtTime(vrDuration?.average_duration_seconds)}</p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default VrVsMobileChart;
