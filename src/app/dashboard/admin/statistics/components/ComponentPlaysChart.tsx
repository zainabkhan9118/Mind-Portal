"use client";
import React from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { Music, Waves, Mic, Eye } from 'lucide-react';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const ComponentPlaysChart: React.FC = () => {
    const series = [{
        name: 'Plays',
        data: [4250, 3180, 2840, 1980]
    }];
    const categories = ['Music', 'Sound', 'Guided', 'VR/360'];

    // For the custom legend/cards below
    const stats = [
        { label: 'Music', value: '4,250', icon: <Music className="w-5 h-5 text-purple-600" /> },
        { label: 'Sound', value: '3,180', icon: <Waves className="w-5 h-5 text-blue-500" /> },
        { label: 'Guided', value: '2,840', icon: <Mic className="w-5 h-5 text-cyan-500" /> },
        { label: 'VR/360', value: '1,980', icon: <Eye className="w-5 h-5 text-indigo-500" /> },
    ];

    const options: ApexOptions = {
        chart: {
            type: 'bar',
            height: 300,
            toolbar: { show: false }
        },
        plotOptions: {
            bar: {
                borderRadius: 8,
                columnWidth: '60%',
                distributed: true, // Different colors per bar
            }
        },
        colors: ["#A855F7", "#3B82F6", "#06B6D4", "#8B5CF6"],
        dataLabels: { enabled: false },
        xaxis: {
            categories: categories,
            labels: {
                style: { colors: '#9CA3AF' }
            },
            axisBorder: { show: false },
            axisTicks: { show: false }
        },
        yaxis: {
            labels: {
                style: { colors: '#9CA3AF' }
            }
        },
        grid: {
            borderColor: '#f3f4f6',
            strokeDashArray: 4,
        },
        legend: { show: false }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Component Plays</h3>
                <p className="text-sm text-purple-600 dark:text-purple-400">Breakdown by content type</p>
            </div>

            <div className="mb-8 h-[300px]">
                <ReactApexChart options={options} series={series} type="bar" height="100%" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <div key={index} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-2 mb-2">
                            {stat.icon}
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{stat.label}</span>
                        </div>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ComponentPlaysChart;
