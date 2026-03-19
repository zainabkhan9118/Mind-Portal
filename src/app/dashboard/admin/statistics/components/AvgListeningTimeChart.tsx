"use client";
import React from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { Music, Waves, Mic, Glasses } from 'lucide-react';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const AvgListeningTimeChart: React.FC = () => {
    // Mock Data
    const cards = [
        { type: 'Sound', title: 'Ocean Calm', time: '5m 33s', icon: <Waves className="w-5 h-5 text-cyan-500" />, bg: 'bg-cyan-50 dark:bg-cyan-900/20', text: 'text-cyan-600 dark:text-cyan-400' },
        { type: 'Music', title: 'Deep Focus Flow', time: '8m 42s', icon: <Music className="w-5 h-5 text-purple-600" />, bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400' },
        { type: 'Guided', title: 'Sleep Journey', time: '12m 18s', icon: <Mic className="w-5 h-5 text-amber-500" />, bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600 dark:text-amber-400' },
        { type: 'VR', title: 'Cosmic Journey VR', time: '15m 47s', icon: <Glasses className="w-5 h-5 text-indigo-500" />, bg: 'bg-indigo-50 dark:bg-indigo-900/20', text: 'text-indigo-600 dark:text-indigo-400' },
    ];

    const series = [
        { name: 'VR', data: [16, 14.5, 17, 15.5, 17.5, 18.5, 17] },
        { name: 'Guided', data: [12.5, 12, 13.5, 12.2, 11.8, 15, 14] },
        { name: 'Music', data: [8.5, 9.2, 8, 10.2, 9, 11.5, 11] },
        { name: 'Sound', data: [6.2, 7, 8.5, 6.8, 7.5, 9.2, 8.8] },
    ];

    const options: ApexOptions = {
        chart: {
            type: 'line',
            height: 350,
            toolbar: { show: false },
            zoom: { enabled: false }
        },
        colors: ["#6366F1", "#06B6D4", "#A855F7", "#3B82F6"], // Indigo (VR), Cyan (Guided), Purple (Music), Blue (Sound) - matching standard palette roughly
        stroke: {
            curve: 'smooth',
            width: 3
        },
        dataLabels: { enabled: false },
        xaxis: {
            categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: { style: { colors: ['#9CA3AF', '#9CA3AF', '#9CA3AF', '#9CA3AF', '#9CA3AF', '#9CA3AF', '#9CA3AF'] } }
        },
        yaxis: {
            min: 0,
            max: 20,
            tickAmount: 4,
            title: {
                text: 'Minutes',
                style: { color: '#9CA3AF' }
            },
            labels: { style: { colors: '#9CA3AF' } }
        },
        grid: {
            borderColor: '#f3f4f6',
            strokeDashArray: 4,
            padding: { top: 0, right: 0, bottom: 0, left: 10 }
        },
        legend: {
            position: 'bottom',
            horizontalAlign: 'center',
        },
        markers: {
            size: 4,
            strokeWidth: 2,
            hover: { sizeOffset: 2 }
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Average Listening & Experience Time</h3>
                <p className="text-sm text-purple-600 dark:text-purple-400">Duration analytics per content type</p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {cards.map((card, idx) => (
                    <div key={idx} className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-2 mb-3">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${card.bg} ${card.text}`}>
                                {card.type}
                            </span>
                        </div>
                        <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{card.title}</h4>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-400">{/* Clock icon could go here */}⏱️</span>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">{card.time}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Chart */}
            <div id="avg-listening-chart">
                <ReactApexChart options={options} series={series} type="line" height={350} />
            </div>
        </div>
    );
};

export default AvgListeningTimeChart;
