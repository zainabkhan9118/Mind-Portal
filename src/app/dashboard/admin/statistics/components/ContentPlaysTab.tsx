"use client";
import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import KeyMetricsOverview from './KeyMetricsOverview';
import GlobalMindPlays from './GlobalMindPlays';
import ComponentPlaysChart from './ComponentPlaysChart';
import AvgListeningTimeChart from './AvgListeningTimeChart';
import { contentApi } from '@/lib/api';
import type { AnalyticsParams, ContentType } from '@/lib/api/types';

// ── Static taxonomy (mirrors MostPlayedStylesChart) ───────────────────────────

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

interface CatEntry    { id: number; name: string; group: string; }
interface SubCatEntry { id: number; name: string; parentName: string; }

const GOALS = [
    'Relax & Unwind', 'Focus', 'Motivation', 'Creativity & Inspiration',
    'Productivity', 'Sleep & Dreams', 'Emotional Balance',
];

const TIME_OPTIONS = ['All-time', 'Last 24h', 'Last Week', 'Last Month', 'Last Year'];

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
    category:    'Category',
    subCategory: 'Sub Category',
    goals:       'Goals',
};

// Maps display label → API content_type value
const CONTENT_TYPE_API: Record<string, ContentType> = {
    Music:   'music',
    Guided:  'mind_session',
    Sounds:  'env_sound',
    Visuals: 'env_visual',
};

// ── Helpers ───────────────────────────────────────────────────────────────────

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

function toggleArr(arr: string[], item: string) {
    return arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];
}

// ── Component ─────────────────────────────────────────────────────────────────

const ContentPlaysTab: React.FC = () => {
    const [analysis, setAnalysis]           = useState('');
    const [contentTypes, setContentTypes]   = useState<string[]>([]);
    const [categories, setCategories]       = useState<string[]>([]);
    const [subCategories, setSubCategories] = useState<string[]>([]);
    const [goals, setGoals]                 = useState<string[]>([]);
    const [time, setTime]                   = useState(TIME_OPTIONS[0]);
    const [openKey, setOpenKey]             = useState<string | null>(null);
    const containerRef                      = useRef<HTMLDivElement>(null);
    const [allCategories, setAllCategories] = useState<CatEntry[]>([]);
    const [subCatPool, setSubCatPool]       = useState<SubCatEntry[]>([]);

    // Fetch all categories on mount
    useEffect(() => {
        Promise.all(
            CONTENT_TYPES.map((ct) =>
                contentApi.categories
                    .list({ type: CONTENT_TYPE_API[ct] as never, size: 200 })
                    .then((res) => res.results.map((c): CatEntry => ({ id: c.id, name: c.name, group: ct })))
            )
        )
            .then((results) => setAllCategories(results.flat()))
            .catch(console.error);
    }, []); // eslint-disable-line

    // Fetch sub-categories when selected categories change
    useEffect(() => {
        if (categories.length === 0) { setSubCatPool([]); return; }
        const selectedCatObjs = allCategories.filter((c) => categories.includes(c.name));
        if (selectedCatObjs.length === 0) { setSubCatPool([]); return; }
        Promise.all(
            selectedCatObjs.map((cat) =>
                contentApi.subCategories
                    .list({ type: CONTENT_TYPE_API[cat.group] as ContentType, category: cat.id, size: 200 })
                    .then((res) => res.results.map((s): SubCatEntry => ({ id: s.id, name: s.name, parentName: cat.name })))
            )
        )
            .then((results) => setSubCatPool(results.flat()))
            .catch(console.error);
    }, [categories, allCategories]); // eslint-disable-line

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpenKey(null);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const toggle_ = (key: string) => setOpenKey((k) => (k === key ? null : key));

    const handleAnalysisSelect = (opt: string) => {
        setAnalysis(opt);
        setContentTypes([]); setCategories([]); setSubCategories([]); setGoals([]);
        setOpenKey(null);
    };

    const visibleCategories = allCategories.filter(
        (c) => contentTypes.length === 0 || contentTypes.includes(c.group)
    );

    const steps: StepKey[] = analysis ? (ANALYSIS_STEPS[analysis] ?? []) : [];

    // Build API params — content_type only when exactly one type is selected
    const dateParams: AnalyticsParams = {
        ...getDateParams(time),
        ...(contentTypes.length === 1 ? { content_type: CONTENT_TYPE_API[contentTypes[0]] } : {}),
    };

    const btnBase = 'flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-medium transition-colors whitespace-nowrap';
    const btnIdle = 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:border-purple-300 hover:text-[#9810FA]';
    const btnActive = 'border-purple-200 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/20 text-[#9810FA] dark:text-purple-400';
    const chipLabel = (items: string[], singular: string) =>
        items.length === 0 ? singular : items.length === 1 ? items[0] : `${items[0]} +${items.length - 1}`;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* ── Filter row — Analysis cascade + Time ── */}
            <div ref={containerRef} className="flex items-end justify-between gap-4">
                <div className="flex flex-wrap items-end gap-2">

                    {/* Analysis dropdown */}
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

                    {/* Chained step dropdowns */}
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
                                                    <input type="checkbox" checked={contentTypes.includes(ct)} onChange={() => { setContentTypes(toggleArr(contentTypes, ct)); setCategories([]); setSubCategories([]); }} className="w-4 h-4 accent-[#9810FA] cursor-pointer" />
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
                                                visibleCategories.forEach(({ name, group }) => {
                                                    if (!grouped[group]) grouped[group] = [];
                                                    grouped[group].push(name);
                                                });
                                                return Object.keys(grouped).length === 0
                                                    ? <p className="px-4 py-3 text-sm text-gray-400">No categories yet.</p>
                                                    : Object.entries(grouped).map(([group, cats]) => (
                                                        <div key={group}>
                                                            <p className="px-4 pt-2 pb-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{group}</p>
                                                            {cats.map((cat) => (
                                                                <label key={cat} className="flex items-center justify-between px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                                                                    <span className={`text-sm ${categories.includes(cat) ? 'text-[#9810FA] font-medium' : 'text-gray-700 dark:text-gray-200'}`}>{cat}</span>
                                                                    <input type="checkbox" checked={categories.includes(cat)} onChange={() => { setCategories(toggleArr(categories, cat)); setSubCategories([]); }} className="w-4 h-4 accent-[#9810FA] cursor-pointer" />
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
                                            {(() => {
                                                const subGrouped: Record<string, string[]> = {};
                                                subCatPool.forEach(({ name, parentName }) => {
                                                    if (!subGrouped[parentName]) subGrouped[parentName] = [];
                                                    subGrouped[parentName].push(name);
                                                });
                                                return Object.keys(subGrouped).length === 0
                                                    ? <p className="px-4 py-3 text-sm text-gray-400">No sub-categories available.</p>
                                                    : Object.entries(subGrouped).map(([parent, subs]) => (
                                                        <div key={parent}>
                                                            <p className="px-4 pt-2 pb-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{parent}</p>
                                                            {subs.map((sub) => (
                                                                <label key={sub} className="flex items-center justify-between px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                                                                    <span className={`text-sm ${subCategories.includes(sub) ? 'text-[#9810FA] font-medium' : 'text-gray-700 dark:text-gray-200'}`}>{sub}</span>
                                                                    <input type="checkbox" checked={subCategories.includes(sub)} onChange={() => setSubCategories(toggleArr(subCategories, sub))} className="w-4 h-4 accent-[#9810FA] cursor-pointer" />
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
                                                    <input type="checkbox" checked={goals.includes(g)} onChange={() => setGoals(toggleArr(goals, g))} className="w-4 h-4 accent-[#9810FA] cursor-pointer" />
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );

                        return null;
                    })}

                </div>

                {/* Time — always anchored right */}
                <div className="flex-shrink-0">
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

            <KeyMetricsOverview dateParams={dateParams} />
            <GlobalMindPlays />
            <ComponentPlaysChart dateParams={dateParams} />
            <AvgListeningTimeChart />
        </div>
    );
};

export default ContentPlaysTab;
