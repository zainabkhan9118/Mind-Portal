"use client";
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import analyticsApi from '@/lib/api/analyticsApi';
import type { PlaysByType, AnalyticsParams } from '@/lib/api/types';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

// ── Static taxonomy ────────────────────────────────────────────────────────

const ANALYSIS_OPTIONS = [
    'Content-type + Goals',
    'Category + Goals',
    'Sub Category + Goals',
    'Minds + Goals',
    'Goals + Content-type',
    'Goals + Category',
    'Goals + Sub Category',
    'Goals + Minds',
];

const CONTENT_TYPES = ['Music', 'Guided', 'Sounds', 'Visuals'];

const CATEGORIES: Record<string, string[]> = {
    Music:   ['Piano', 'Meditation/Spiritual', 'Nature Melodies', 'Classical', 'EMDR', 'Ambient', 'Beats', 'Café', 'Electronic', 'Lullabies'],
    Guided:  ['Coaching', 'Hypnosis', 'Meditation'],
    Sounds:  [],
    Visuals: [],
};

const SUB_CATEGORIES: Record<string, string[]> = {
    Ambient:  ['Mixed with Binaural Beats', 'Mixed with Solfeggio Frequencies'],
    Coaching: ['Life', 'Work'],
};

const GOALS = [
    'Relax & Unwind', 'Focus', 'Motivation', 'Creativity & Inspiration',
    'Productivity', 'Sleep & Dreams', 'Emotional Balance',
];

const TIME_OPTIONS = ['All-time', 'Last 24h', 'Last Week', 'Last Month', 'Last Year', 'Custom Range'];

// Which extra dropdowns appear after an analysis type is chosen
type StepKey = 'contentType' | 'category' | 'subCategory' | 'goals';

const ANALYSIS_STEPS: Record<string, StepKey[]> = {
    'Content-type + Goals':  ['contentType', 'goals'],
    'Category + Goals':      ['contentType', 'category', 'goals'],
    'Sub Category + Goals':  ['contentType', 'category', 'subCategory', 'goals'],
    'Minds + Goals':         ['goals'],
    'Goals + Content-type':  ['goals', 'contentType'],
    'Goals + Category':      ['goals', 'contentType', 'category'],
    'Goals + Sub Category':  ['goals', 'contentType', 'category', 'subCategory'],
    'Goals + Minds':         ['goals'],
};

const STEP_LABELS: Record<StepKey, string> = {
    contentType: 'Content-type',
    category: 'Category',
    subCategory: 'Sub Category',
    goals: 'Goals',
};

// ── Chart config ───────────────────────────────────────────────────────────

const TYPE_CONFIG = [
    { key: 'guided_session', label: 'Guided Sessions', emoji: '🧘', color: '#A855F7' },
    { key: 'music',          label: 'Music',           emoji: '🎵', color: '#3B82F6' },
    { key: 'env_sound',      label: 'Sounds',          emoji: '🎿', color: '#06B6D4' },
    { key: 'env_visual_vr',  label: 'VR',              emoji: '🌃', color: '#7C3AED' },
    { key: 'env_visual_360', label: '360°',            emoji: '👁️', color: '#6366F1' },
];

function getDateParams(time: string): AnalyticsParams {
    const today = new Date();
    const fmt = (d: Date) => d.toISOString().slice(0, 10);
    const ago = (days: number) => { const d = new Date(today); d.setDate(d.getDate() - days); return fmt(d); };
    switch (time) {
        case 'Last 24h':   return { start_date: ago(1),   end_date: fmt(today) };
        case 'Last Week':  return { start_date: ago(7),   end_date: fmt(today) };
        case 'Last Month': return { start_date: ago(30),  end_date: fmt(today) };
        case 'Last Year':  return { start_date: ago(365), end_date: fmt(today) };
        default:           return {};
    }
}

function toggle(arr: string[], item: string) {
    return arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];
}

// ── Component ──────────────────────────────────────────────────────────────

const MostPlayedStylesChart: React.FC = () => {
    const [byType, setByType] = useState<PlaysByType[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Analysis cascade state
    const [analysis, setAnalysis] = useState('');
    const [contentTypes, setContentTypes] = useState<string[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [subCategories, setSubCategories] = useState<string[]>([]);
    const [goals, setGoals] = useState<string[]>([]);

    // Time — independent
    const [time, setTime] = useState(TIME_OPTIONS[0]);

    // Which dropdown is open
    const [openKey, setOpenKey] = useState<string | null>(null);

    // Refs for click-outside
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpenKey(null);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    useEffect(() => {
        setIsLoading(true);
        analyticsApi.getPlaysByType(getDateParams(time))
            .then(setByType)
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, [time]);

    const toggle_ = (key: string) => setOpenKey((k) => (k === key ? null : key));

    // Reset downstream steps when analysis changes
    const handleAnalysisSelect = (opt: string) => {
        setAnalysis(opt);
        setContentTypes([]);
        setCategories([]);
        setSubCategories([]);
        setGoals([]);
        setOpenKey(null);
    };

    // Categories visible based on selected content types
    const visibleCategories = (contentTypes.length > 0 ? contentTypes : CONTENT_TYPES)
        .flatMap((ct) => (CATEGORIES[ct] ?? []).map((c) => ({ cat: c, group: ct })));

    // Sub-categories visible based on selected categories
    const visibleSubCats = (categories.length > 0 ? categories : Object.keys(SUB_CATEGORIES))
        .filter((c) => (SUB_CATEGORIES[c] ?? []).length > 0);

    const steps: StepKey[] = analysis ? (ANALYSIS_STEPS[analysis] ?? []) : [];

    // ── Chart ─────────────────────────────────────────────────────────────
    const total = byType.reduce((s, t) => s + (t.plays ?? 0), 0) || 1;
    const configuredData = TYPE_CONFIG.map((cfg) => {
        if (cfg.key === 'env_visual_vr' || cfg.key === 'env_visual_360') {
            const visual = byType.find((t) => t.content_type === 'env_visual');
            return { ...cfg, plays: visual ? Math.floor((visual.plays ?? 0) / 2) : 0 };
        }
        return { ...cfg, plays: byType.find((t) => t.content_type === cfg.key)?.plays ?? 0 };
    });
    const series = configuredData.map((d) => Math.round((d.plays / total) * 100));
    const options: ApexOptions = {
        chart: { type: 'pie', toolbar: { show: false } },
        labels: configuredData.map((d) => d.label),
        colors: configuredData.map((d) => d.color),
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

    // ── Dropdown button helpers ────────────────────────────────────────────
    const btnBase = 'flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-medium transition-colors whitespace-nowrap';
    const btnIdle = 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:border-purple-300 hover:text-[#9810FA]';
    const btnActive = 'border-purple-200 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/20 text-[#9810FA] dark:text-purple-400';

    const chipLabel = (items: string[], singular: string) =>
        items.length === 0 ? singular : items.length === 1 ? items[0] : `${items[0]} +${items.length - 1}`;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-6 pt-6 pb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Most Played Content.</h3>
            </div>

            <div className="mx-6 border-t-2 border-dashed border-purple-400 dark:border-purple-600 mb-5" />

            {/* ── Filter row ── */}
            <div className="px-6 mb-4" ref={containerRef}>
                <div className="flex flex-wrap items-end gap-2">

                    {/* ── Analysis dropdown ── */}
                    <div>
                        <p className="text-[11px] text-gray-400 mb-1">Analysis</p>
                        <div className="relative">
                            <button
                                onClick={() => toggle_('analysis')}
                                className={`${btnBase} min-w-[170px] justify-between ${analysis ? btnActive : btnIdle}`}
                            >
                                <span className="truncate">{analysis || 'Select...'}</span>
                                {openKey === 'analysis'
                                    ? <ChevronUp className="w-3.5 h-3.5 flex-shrink-0" />
                                    : <ChevronDown className="w-3.5 h-3.5 flex-shrink-0" />}
                            </button>
                            {openKey === 'analysis' && (
                                <div className="absolute left-0 top-full mt-1 z-30 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-lg py-1 min-w-[210px]">
                                    {ANALYSIS_OPTIONS.map((opt) => (
                                        <button
                                            key={opt}
                                            onClick={() => handleAnalysisSelect(opt)}
                                            className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left transition-colors ${
                                                opt === analysis
                                                    ? 'bg-purple-50 dark:bg-purple-900/20 text-[#9810FA] dark:text-purple-400 font-medium'
                                                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                                            }`}
                                        >
                                            <span className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 ${opt === analysis ? 'border-[#9810FA] bg-[#9810FA]' : 'border-gray-300 dark:border-gray-500'}`} />
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Chained step dropdowns ── */}
                    {steps.map((step) => {
                        const isOpen = openKey === step;

                        if (step === 'contentType') return (
                            <div key="contentType">
                                <p className="text-[11px] text-gray-400 mb-1">{STEP_LABELS.contentType}</p>
                                <div className="relative">
                                    <button onClick={() => toggle_('contentType')} className={`${btnBase} ${contentTypes.length > 0 ? btnActive : btnIdle}`}>
                                        <span>{chipLabel(contentTypes, 'All types')}</span>
                                        {contentTypes.length > 0 && (
                                            <span onClick={(e) => { e.stopPropagation(); setContentTypes([]); setCategories([]); setSubCategories([]); }} className="hover:text-red-500 transition-colors">
                                                <X className="w-3 h-3" />
                                            </span>
                                        )}
                                        {isOpen ? <ChevronUp className="w-3.5 h-3.5 flex-shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 flex-shrink-0" />}
                                    </button>
                                    {isOpen && (
                                        <div className="absolute left-0 top-full mt-1 z-30 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-lg py-1 min-w-[160px]">
                                            {CONTENT_TYPES.map((ct) => (
                                                <label key={ct} className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                                                    <span className={`text-sm ${contentTypes.includes(ct) ? 'text-[#9810FA] font-medium' : 'text-gray-700 dark:text-gray-200'}`}>{ct}</span>
                                                    <input type="checkbox" checked={contentTypes.includes(ct)} onChange={() => { setContentTypes(toggle(contentTypes, ct)); setCategories([]); setSubCategories([]); }} className="w-4 h-4 accent-[#9810FA] cursor-pointer" />
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );

                        if (step === 'category') return (
                            <div key="category">
                                <p className="text-[11px] text-gray-400 mb-1">{STEP_LABELS.category}</p>
                                <div className="relative">
                                    <button onClick={() => toggle_('category')} className={`${btnBase} ${categories.length > 0 ? btnActive : btnIdle}`}>
                                        <span>{chipLabel(categories, 'All categories')}</span>
                                        {categories.length > 0 && (
                                            <span onClick={(e) => { e.stopPropagation(); setCategories([]); setSubCategories([]); }} className="hover:text-red-500 transition-colors">
                                                <X className="w-3 h-3" />
                                            </span>
                                        )}
                                        {isOpen ? <ChevronUp className="w-3.5 h-3.5 flex-shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 flex-shrink-0" />}
                                    </button>
                                    {isOpen && (
                                        <div className="absolute left-0 top-full mt-1 z-30 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-lg py-1 min-w-[200px] max-h-60 overflow-y-auto">
                                            {(() => {
                                                const grouped: Record<string, string[]> = {};
                                                visibleCategories.forEach(({ cat, group }) => {
                                                    if (!grouped[group]) grouped[group] = [];
                                                    grouped[group].push(cat);
                                                });
                                                return Object.entries(grouped).map(([group, cats]) => (
                                                    <div key={group}>
                                                        <p className="px-4 pt-2 pb-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{group}</p>
                                                        {cats.map((cat) => (
                                                            <label key={cat} className="flex items-center justify-between px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                                                                <span className={`text-sm ${categories.includes(cat) ? 'text-[#9810FA] font-medium' : 'text-gray-700 dark:text-gray-200'}`}>{cat}</span>
                                                                <input type="checkbox" checked={categories.includes(cat)} onChange={() => { setCategories(toggle(categories, cat)); setSubCategories([]); }} className="w-4 h-4 accent-[#9810FA] cursor-pointer" />
                                                            </label>
                                                        ))}
                                                    </div>
                                                ));
                                            })()}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );

                        if (step === 'subCategory') return (
                            <div key="subCategory">
                                <p className="text-[11px] text-gray-400 mb-1">{STEP_LABELS.subCategory}</p>
                                <div className="relative">
                                    <button onClick={() => toggle_('subCategory')} className={`${btnBase} ${subCategories.length > 0 ? btnActive : btnIdle}`}>
                                        <span>{chipLabel(subCategories, 'All sub-categories')}</span>
                                        {subCategories.length > 0 && (
                                            <span onClick={(e) => { e.stopPropagation(); setSubCategories([]); }} className="hover:text-red-500 transition-colors">
                                                <X className="w-3 h-3" />
                                            </span>
                                        )}
                                        {isOpen ? <ChevronUp className="w-3.5 h-3.5 flex-shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 flex-shrink-0" />}
                                    </button>
                                    {isOpen && (
                                        <div className="absolute left-0 top-full mt-1 z-30 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-lg py-1 min-w-[220px] max-h-60 overflow-y-auto">
                                            {visibleSubCats.length === 0
                                                ? <p className="px-4 py-3 text-sm text-gray-400">No sub-categories available.</p>
                                                : visibleSubCats.map((parent) => (
                                                    <div key={parent}>
                                                        <p className="px-4 pt-2 pb-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{parent}</p>
                                                        {(SUB_CATEGORIES[parent] ?? []).map((sub) => (
                                                            <label key={sub} className="flex items-center justify-between px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                                                                <span className={`text-sm ${subCategories.includes(sub) ? 'text-[#9810FA] font-medium' : 'text-gray-700 dark:text-gray-200'}`}>{sub}</span>
                                                                <input type="checkbox" checked={subCategories.includes(sub)} onChange={() => setSubCategories(toggle(subCategories, sub))} className="w-4 h-4 accent-[#9810FA] cursor-pointer" />
                                                            </label>
                                                        ))}
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    )}
                                </div>
                            </div>
                        );

                        if (step === 'goals') return (
                            <div key="goals">
                                <p className="text-[11px] text-gray-400 mb-1">{STEP_LABELS.goals}</p>
                                <div className="relative">
                                    <button onClick={() => toggle_('goals')} className={`${btnBase} ${goals.length > 0 ? btnActive : btnIdle}`}>
                                        <span>{chipLabel(goals, 'All goals')}</span>
                                        {goals.length > 0 && (
                                            <span onClick={(e) => { e.stopPropagation(); setGoals([]); }} className="hover:text-red-500 transition-colors">
                                                <X className="w-3 h-3" />
                                            </span>
                                        )}
                                        {isOpen ? <ChevronUp className="w-3.5 h-3.5 flex-shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 flex-shrink-0" />}
                                    </button>
                                    {isOpen && (
                                        <div className="absolute left-0 top-full mt-1 z-30 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-lg py-1 min-w-[200px]">
                                            {GOALS.map((g) => (
                                                <label key={g} className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                                                    <span className={`text-sm ${goals.includes(g) ? 'text-[#9810FA] font-medium' : 'text-gray-700 dark:text-gray-200'}`}>{g}</span>
                                                    <input type="checkbox" checked={goals.includes(g)} onChange={() => setGoals(toggle(goals, g))} className="w-4 h-4 accent-[#9810FA] cursor-pointer" />
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );

                        return null;
                    })}

                    {/* Spacer pushes Time to the right */}
                    <div className="flex-1" />

                    {/* ── Time dropdown (independent) ── */}
                    <div>
                        <p className="text-[11px] text-gray-400 mb-1">Time</p>
                        <div className="relative">
                            <button onClick={() => toggle_('time')} className={`${btnBase} ${openKey === 'time' ? btnActive : btnIdle}`}>
                                <span>{time}</span>
                                {openKey === 'time' ? <ChevronUp className="w-3.5 h-3.5 flex-shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 flex-shrink-0" />}
                            </button>
                            {openKey === 'time' && (
                                <div className="absolute right-0 top-full mt-1 z-30 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-lg py-1 min-w-[140px]">
                                    {TIME_OPTIONS.map((opt) => (
                                        <button
                                            key={opt}
                                            onClick={() => { setTime(opt); setOpenKey(null); }}
                                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                                                opt === time
                                                    ? 'bg-purple-50 dark:bg-purple-900/20 text-[#9810FA] dark:text-purple-400 font-medium'
                                                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                                            }`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
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
                    <div className="space-y-3">
                        {configuredData.map((item, i) => (
                            <div key={item.key} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                                    <span className="text-sm text-gray-700 dark:text-gray-300 font-medium flex items-center gap-1.5">
                                        {item.label} <span>{item.emoji}</span>
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
