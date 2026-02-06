"use client";
import React from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { Sun, Utensils, Moon, BedDouble } from 'lucide-react';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const EngagementTrends: React.FC = () => {
    const [timeRange, setTimeRange] = React.useState<'daily' | 'monthly'>('daily');

    const dailyData = [250, 200, 180, 150, 280, 450, 580, 700, 850, 920, 800, 750, 680, 650, 800, 950, 1050, 1200, 1350, 1200, 900];
    const monthlyData = [4500, 5200, 4800, 6100, 7500, 8200, 9100, 8800, 9500, 10200, 11500, 12000];

    const series = [{
        name: 'Active Users',
        data: timeRange === 'daily' ? dailyData : monthlyData
    }];

    const options: ApexOptions = {
        chart: {
            type: 'area',
            height: 300,
            toolbar: { show: false },
            zoom: { enabled: false }
        },
        colors: ['#A855F7'],
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.1,
                stops: [0, 90, 100]
            }
        },
        dataLabels: { enabled: false },
        stroke: {
            curve: 'smooth',
            width: 3
        },
        xaxis: {
            categories: timeRange === 'daily'
                ? ['12am', '2am', '4am', '6am', '8am', '10am', '12pm', '2pm', '4pm', '6pm', '8pm', '10pm']
                : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            labels: {
                style: { colors: '#9CA3AF' }
            },
            axisBorder: { show: false },
            axisTicks: { show: false }
        },
        yaxis: {
            show: true,
            labels: { style: { colors: '#9CA3AF' } }
        },
        grid: {
            show: true,
            borderColor: '#f3f4f6',
            strokeDashArray: 4,
        }
    };


    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Engagement Trends</h3>
                    <p className="text-sm text-purple-600 dark:text-purple-400">Usage patterns and peak activity times</p>
                </div>
                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                    <button
                        onClick={() => setTimeRange('daily')}
                        className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${timeRange === 'daily' ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                    >
                        Daily
                    </button>
                    <button
                        onClick={() => setTimeRange('monthly')}
                        className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${timeRange === 'monthly' ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                    >
                        Monthly
                    </button>
                </div>
            </div>

            <div className="mb-8 h-[300px]">
                <ReactApexChart options={options} series={series} type="area" height="100%" />
            </div>

            <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-2 mb-4">
                <span className="w-4 h-4 rounded border border-gray-300 flex items-center justify-center">📅</span> Peak Activity Times
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-orange-500 mb-2">
                        <Sun className="w-4 h-4" />
                        <span className="text-sm font-medium">6-8 AM</span>
                    </div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Morning Rush</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">587 avg</p>
                </div>

                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-purple-500 mb-2">
                        <Utensils className="w-4 h-4" />
                        <span className="text-sm font-medium">12-2 PM</span>
                    </div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Lunch Break</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">824 avg</p>
                </div>

                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-amber-500 mb-2">
                        <Moon className="w-4 h-4" />
                        <span className="text-sm font-medium">8-11 PM</span>
                    </div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Evening Wind-down</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">1,035 avg</p>
                </div>

                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-indigo-500 mb-2">
                        <BedDouble className="w-4 h-4" />
                        <span className="text-sm font-medium">10 PM</span>
                    </div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Bedtime Peak</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">1,245 peak</p>
                </div>
            </div>
        </div>
    );
};

export default EngagementTrends;
