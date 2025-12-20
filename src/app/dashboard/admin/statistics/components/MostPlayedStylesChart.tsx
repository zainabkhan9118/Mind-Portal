"use client";
import React from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { Music, Eye, Waves, Glasses, ScanFace } from 'lucide-react';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const MostPlayedStylesChart: React.FC = () => {
    // Data matched to image: Guided 34%, Music 28%, Sounds 17%, VR 13%, 360 8%
    const series = [34, 28, 17, 13, 8];
    const labels = ["Guided Sessions", "Music", "Sounds", "VR", "360°"];
    // Colors matched to image
    const colors = ["#A855F7", "#3B82F6", "#06B6D4", "#8B5CF6", "#6366F1"];

    const options: ApexOptions = {
        chart: {
            type: 'pie',
        },
        labels: labels,
        colors: colors,
        legend: {
            show: false, // Using custom legend
        },
        dataLabels: {
            enabled: true,
            formatter: function (val) {
                return Math.round(Number(val)) + "%";
            },
            style: {
                fontSize: '12px',
                fontFamily: 'inherit',
                fontWeight: 600,
                colors: ['#fff']
            },
            dropShadow: { enabled: false }
        },
        stroke: {
            width: 1,
            colors: ['#fff']
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '0%' // Full pie, not donut
                }
            }
        },
        tooltip: {
            enabled: true,
            y: {
                formatter: function (val) {
                    return val + "%"
                }
            }
        }
    };

    const icons = [
        <ScanFace key="guided" className="w-4 h-4" />,
        <Music key="music" className="w-4 h-4" />,
        <Waves key="sounds" className="w-4 h-4" />,
        <Glasses key="vr" className="w-4 h-4" />,
        <Eye key="360" className="w-4 h-4" />
    ];

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm h-full flex flex-col justify-between">
            {/* Header */}
            <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Most Played Styles & Categories</h3>
                <p className="text-sm text-purple-600 dark:text-purple-400">Content distribution by category</p>
            </div>

            {/* Chart */}
            <div className="flex justify-center mb-6">
                <ReactApexChart options={options} series={series} type="pie" width={320} />
            </div>

            {/* Custom Legend */}
            <div className="space-y-3 mb-8">
                {labels.map((label, i) => (
                    <div key={label} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[i] }}></div>
                            <span className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-1.5">
                                {label}
                                <span className="text-gray-400">{icons[i]}</span>
                            </span>
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white">{series[i]}%</span>
                    </div>
                ))}
            </div>

            {/* Audio vs VR Segmentation */}
            <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
                <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-4">Audio vs VR Segmentation</h4>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm font-medium">
                            <span className="text-gray-600 dark:text-gray-400">Audio</span>
                            <span className="text-gray-900 dark:text-white">79%</span>
                        </div>
                        <div className="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 w-[79%] rounded-full"></div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-sm font-medium">
                            <span className="text-gray-600 dark:text-gray-400">VR/360</span>
                            <span className="text-gray-900 dark:text-white">21%</span>
                        </div>
                        <div className="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500 w-[21%] rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MostPlayedStylesChart;
