"use client";
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { Sun, Utensils, Moon, BedDouble } from 'lucide-react';
import analyticsApi from '@/lib/api/analyticsApi';
import type { PlaysTimeseriesPoint } from '@/lib/api/types';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const EngagementTrends: React.FC = () => {
    const [timeRange, setTimeRange] = useState<'daily' | 'monthly'>('monthly');
    const [data, setData] = useState<PlaysTimeseriesPoint[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        analyticsApi
            .getPlaysTimeseries(timeRange === 'daily' ? 'daily' : 'monthly')
            .then(setData)
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, [timeRange]);

    const periods = data.map((d) => d.period ?? '');
    const plays = data.map((d) => d.plays ?? 0);

    const series = [{ name: 'Plays', data: plays.length ? plays : [0] }];

    const options: ApexOptions = {
        chart: {
            type: 'area',
            height: 300,
            toolbar: { show: false },
            zoom: { enabled: false },
        },
        colors: ['#A855F7'],
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.1,
                stops: [0, 90, 100],
            },
        },
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 3 },
        xaxis: {
            categories: periods.length ? periods : [''],
            labels: { style: { colors: '#9CA3AF' } },
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: {
            show: true,
            labels: {
                style: { colors: '#9CA3AF' },
                formatter: (v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`,
            },
        },
        grid: { show: true, borderColor: '#f3f4f6', strokeDashArray: 4 },
        tooltip: {
            y: { formatter: (v) => (v ?? 0).toLocaleString() },
        },
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Engagement Trends</h3>
                    <p className="text-sm text-purple-600 dark:text-purple-400">Plays over time</p>
                </div>
                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                    {(['daily', 'monthly'] as const).map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-3 py-1 rounded-md text-xs font-medium transition-all capitalize ${timeRange === range
                                ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-900 dark:text-white'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                }`}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mb-8 h-[300px]">
                {isLoading ? (
                    <div className="h-full flex items-center justify-center">
                        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : data.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                        <p className="text-sm text-gray-400">No data available</p>
                    </div>
                ) : (
                    <ReactApexChart options={options} series={series} type="area" height="100%" />
                )}
            </div>

            <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-2 mb-4">
                <span className="w-4 h-4 rounded border border-gray-300 flex items-center justify-center">📅</span> Peak Activity Times
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { icon: <Sun className="w-4 h-4" />, color: 'text-orange-500', time: '6–8 AM', label: 'Morning Rush' },
                    { icon: <Utensils className="w-4 h-4" />, color: 'text-purple-500', time: '12–2 PM', label: 'Lunch Break' },
                    { icon: <Moon className="w-4 h-4" />, color: 'text-amber-500', time: '8–11 PM', label: 'Evening Wind-down' },
                    { icon: <BedDouble className="w-4 h-4" />, color: 'text-indigo-500', time: '10 PM', label: 'Bedtime Peak' },
                ].map((p, i) => (
                    <div key={i} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700">
                        <div className={`flex items-center gap-2 ${p.color} mb-2`}>
                            {p.icon}
                            <span className="text-sm font-medium">{p.time}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{p.label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EngagementTrends;
