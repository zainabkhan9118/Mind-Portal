"use client";
import React from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { Smartphone, Headset } from 'lucide-react'; // Using Lucide icons

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const VrVsMobileChart: React.FC = () => {
    const series = [72, 28];
    const labels = ["Mobile", "VR Headset"];
    const colors = ["#3B82F6", "#8B5CF6"]; // Blue, Purple

    const options: ApexOptions = {
        chart: {
            type: 'donut',
        },
        labels: labels,
        colors: colors,
        dataLabels: { enabled: false },
        plotOptions: {
            pie: {
                donut: {
                    size: '75%', // Thinner donut
                    labels: {
                        show: false
                    }
                }
            }
        },
        legend: { show: false },
        stroke: { width: 0, colors: ['transparent'] }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm h-full flex flex-col justify-between overflow-hidden">
            {/* Header */}
            <div className="px-6 pt-6 pb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">VR vs Mobile Usage</h3>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">Platform distribution & device breakdown</p>
            </div>

            {/* Purple dashed divider */}
            <div className="mx-6 border-t-2 border-dashed border-purple-400 dark:border-purple-600 mb-5" />

            {/* Top Section: Chart + Cards */}
            <div className="flex flex-col xl:flex-row items-center justify-between gap-6 px-6 py-4">
                {/* Donut Chart */}
                <div className="relative flex-none">
                    <ReactApexChart options={options} series={series} type="donut" width={300} />
                </div>

                {/* Stat Cards */}
                <div className="flex flex-col gap-3 w-full xl:w-auto flex-1">
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-2">
                            <Smartphone className="w-4 h-4 text-blue-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Mobile</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">72%</p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-2">
                            <Headset className="w-4 h-4 text-purple-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">VR Headset</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">28%</p>
                    </div>
                </div>
            </div>

            {/* Middle Section: Device Breakdown */}
            <div className="space-y-5 px-6">
                <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400">Device Breakdown</h4>

                <div className="space-y-4">
                    {/* iOS */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm font-medium">
                            <span className="text-gray-600 dark:text-gray-300">iOS</span>
                            <span className="text-gray-900 dark:text-white">42%</span>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 w-[42%] rounded-full"></div>
                        </div>
                    </div>

                    {/* Android */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm font-medium">
                            <span className="text-gray-600 dark:text-gray-300">Android</span>
                            <span className="text-gray-900 dark:text-white">30%</span>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-cyan-500 w-[30%] rounded-full"></div>
                        </div>
                    </div>

                    {/* Meta Quest */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm font-medium">
                            <span className="text-gray-600 dark:text-gray-300">Meta Quest</span>
                            <span className="text-gray-900 dark:text-white">18%</span>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500 w-[18%] rounded-full"></div>
                        </div>
                    </div>

                    {/* Other VR */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm font-medium">
                            <span className="text-gray-600 dark:text-gray-300">Other VR</span>
                            <span className="text-gray-900 dark:text-white">10%</span>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 w-[10%] rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Avg Session Stats */}
            <div className="mt-8 mx-6 mb-6 bg-purple-50 dark:bg-purple-900/10 rounded-2xl p-6 grid grid-cols-2 gap-4">
                <div>
                    <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1">Avg. Mobile Session</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">6m 24s</p>
                </div>
                <div>
                    <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1">Avg. VR Session</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">15m 47s</p>
                </div>
            </div>
        </div>
    );
};

export default VrVsMobileChart;
