"use client";
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { ChevronDown, ChevronUp } from 'lucide-react';
import analyticsApi from '@/lib/api/analyticsApi';
import type { PlaysByType, AnalyticsParams } from '@/lib/api/types';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const TYPE_CONFIG: { key: string; label: string; emoji: string; color: string }[] = [
    { key: 'guided_session', label: 'Guided Sessions', emoji: '🧘', color: '#A855F7' },
    { key: 'music',          label: 'Music',           emoji: '🎵', color: '#3B82F6' },
    { key: 'env_sound',      label: 'Sounds',          emoji: '🎿', color: '#06B6D4' },
    { key: 'env_visual_vr',  label: 'VR',              emoji: '🌃', color: '#7C3AED' },
    { key: 'env_visual_360', label: '360°',            emoji: '👁️', color: '#6366F1' },
];

const ANALYSIS_OPTIONS = ['Goals - Minds', 'Sessions', 'Plays'];

const TIME_OPTIONS = ['All Time', 'Last 24h', 'Weekly', 'Monthly', 'Yearly'];

function getDateParams(time: string): AnalyticsParams {
    const today = new Date();
    const fmt = (d: Date) => d.toISOString().slice(0, 10);
    const ago = (days: number) => { const d = new Date(today); d.setDate(d.getDate() - days); return fmt(d); };
    switch (time) {
        case 'Last 24h': return { start_date: ago(1), end_date: fmt(today) };
        case 'Weekly':   return { start_date: ago(7), end_date: fmt(today) };
        case 'Monthly':  return { start_date: ago(30), end_date: fmt(today) };
        case 'Yearly':   return { start_date: ago(365), end_date: fmt(today) };
        default:         return {};
    }
}

const MostPlayedStylesChart: React.FC = () => {
    const [byType, setByType] = useState<PlaysByType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [analysis, setAnalysis] = useState(ANALYSIS_OPTIONS[0]);
    const [time, setTime] = useState(TIME_OPTIONS[0]);
    const [timeOpen, setTimeOpen] = useState(false);
    const [analysisOpen, setAnalysisOpen] = useState(false);
    const timeRef = useRef<HTMLDivElement>(null);
    const analysisRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsLoading(true);
        analyticsApi.getPlaysByType(getDateParams(time))
            .then(setByType)
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, [time]);

    // Close dropdowns on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (timeRef.current && !timeRef.current.contains(e.target as Node)) setTimeOpen(false);
            if (analysisRef.current && !analysisRef.current.contains(e.target as Node)) setAnalysisOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const total = byType.reduce((s, t) => s + (t.plays ?? 0), 0) || 1;

    // Map API types to config entries; split env_visual evenly into VR + 360° if needed
    const configuredData = TYPE_CONFIG.map((cfg) => {
        if (cfg.key === 'env_visual_vr' || cfg.key === 'env_visual_360') {
            const visual = byType.find((t) => t.content_type === 'env_visual');
            const half = visual ? Math.floor((visual.plays ?? 0) / 2) : 0;
            return { ...cfg, plays: half };
        }
        const match = byType.find((t) => t.content_type === cfg.key);
        return { ...cfg, plays: match?.plays ?? 0 };
    });

    const series = configuredData.map((d) => Math.round((d.plays / total) * 100));
    const labels = configuredData.map((d) => d.label);
    const colors = configuredData.map((d) => d.color);

    const options: ApexOptions = {
        chart: { type: 'pie', toolbar: { show: false } },
        labels,
        colors,
        legend: { show: false },
        dataLabels: {
            enabled: true,
            formatter: (val) => `${Math.round(Number(val))}%`,
            style: { fontSize: '12px', fontFamily: 'inherit', fontWeight: '600', colors: ['#fff'] },
            dropShadow: { enabled: false },
        },
        stroke: { width: 2, colors: ['#fff'] },
        tooltip: { enabled: true, y: { formatter: (val) => `${val}%` } },
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-6 pt-6 pb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Most Played Content.</h3>
            </div>

            {/* Purple dashed divider */}
            <div className="mx-6 border-t-2 border-dashed border-purple-400 dark:border-purple-600 mb-5" />

            {/* Dropdowns row */}
            <div className="px-6 flex justify-end gap-3 mb-4">
                {/* Analysis dropdown */}
                <div className="relative" ref={analysisRef}>
                    <div className="text-xs text-gray-400 mb-1 text-center">Analysis</div>
                    <button
                        onClick={() => { setAnalysisOpen((o) => !o); setTimeOpen(false); }}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 transition-colors min-w-[140px] justify-between"
                    >
                        <span>{analysis}</span>
                        <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    </button>
                    {analysisOpen && (
                        <div className="absolute right-0 top-full mt-1 z-20 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-lg py-1 min-w-[160px]">
                            {ANALYSIS_OPTIONS.map((opt) => (
                                <button
                                    key={opt}
                                    onClick={() => { setAnalysis(opt); setAnalysisOpen(false); }}
                                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${opt === analysis ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-medium' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Time dropdown */}
                <div className="relative" ref={timeRef}>
                    <div className="text-xs text-gray-400 mb-1 text-center">Time</div>
                    <button
                        onClick={() => { setTimeOpen((o) => !o); setAnalysisOpen(false); }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium min-w-[110px] justify-between transition-colors ${timeOpen ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-700' : 'border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50'}`}
                    >
                        <span>{time}</span>
                        {timeOpen
                            ? <ChevronUp className="w-4 h-4 flex-shrink-0" />
                            : <ChevronDown className="w-4 h-4 flex-shrink-0" />}
                    </button>
                    {timeOpen && (
                        <div className="absolute right-0 top-full mt-1 z-20 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-lg py-1 min-w-[140px]">
                            {TIME_OPTIONS.map((opt) => (
                                <button
                                    key={opt}
                                    onClick={() => { setTime(opt); setTimeOpen(false); }}
                                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${opt === time ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-medium' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Chart + legend */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : byType.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-16 px-6">No data available</p>
            ) : (
                <div className="px-6 pb-6">
                    <div className="flex justify-center mb-6">
                        <ReactApexChart
                            options={options}
                            series={series.some((v) => v > 0) ? series : [1]}
                            type="pie"
                            width={300}
                        />
                    </div>

                    {/* Legend */}
                    <div className="space-y-3">
                        {configuredData.map((item, i) => (
                            <div key={item.key} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                                    <span className="text-sm text-gray-700 dark:text-gray-300 font-medium flex items-center gap-1.5">
                                        {item.label}
                                        <span>{item.emoji}</span>
                                    </span>
                                </div>
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">{series[i]}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MostPlayedStylesChart;
