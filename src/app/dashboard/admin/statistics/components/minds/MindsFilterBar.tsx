"use client";
import React, { useEffect, useRef, useState } from 'react';
import { Calendar, Target, Waves, Sun, Layers, RotateCcw, ChevronDown } from 'lucide-react';
import apiClient from '@/lib/api/axiosInstance';
import { contentApi } from '@/lib/api';
import type { AnalyticsContentType, MindsAnalyticsParams } from '@/lib/api/types';

interface Option {
    id: number;
    name: string;
}

const COMPONENT_OPTIONS: { label: string; value: AnalyticsContentType }[] = [
    { label: 'Music', value: 'music' },
    { label: 'Sound', value: 'env_sound' },
    { label: 'Visual', value: 'env_visual' },
    { label: 'Guided', value: 'guided_session' },
];

function fmtDate(d: Date): string {
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function isoDate(d: Date): string {
    return d.toISOString().slice(0, 10);
}

const btnClass = 'flex items-center gap-3 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-purple-300 dark:hover:border-purple-600 transition-colors text-left';

interface MindsFilterBarProps {
    onFilterChange: (params: MindsAnalyticsParams) => void;
}

const MindsFilterBar: React.FC<MindsFilterBarProps> = ({ onFilterChange }) => {
    const today = new Date();
    const defaultStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const defaultEnd = today;

    const [startDate, setStartDate] = useState(isoDate(defaultStart));
    const [endDate, setEndDate] = useState(isoDate(defaultEnd));
    const [goalId, setGoalId] = useState<number | null>(null);
    const [stateId, setStateId] = useState<number | null>(null);
    const [effectId, setEffectId] = useState<number | null>(null);
    const [components, setComponents] = useState<AnalyticsContentType[]>([]);

    const [goals, setGoals] = useState<Option[]>([]);
    const [states, setStates] = useState<Option[]>([]);
    const [effects, setEffects] = useState<Option[]>([]);

    const [openKey, setOpenKey] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        apiClient.get<{ results: Option[] }>('explore/goals/', { params: { size: 100 } })
            .then((res) => setGoals(res.data.results ?? []))
            .catch(() => {});
        contentApi.states.list({ size: 100 })
            .then((res) => setStates(res.results ?? []))
            .catch(() => {});
        contentApi.effects.list({ size: 100 })
            .then((res) => setEffects(res.results ?? []))
            .catch(() => {});
    }, []);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpenKey(null);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    useEffect(() => {
        onFilterChange({
            start_date: startDate || undefined,
            end_date: endDate || undefined,
            goal_id: goalId ?? undefined,
            state_id: stateId ?? undefined,
            effect_id: effectId ?? undefined,
            components: components.length > 0 ? components : undefined,
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startDate, endDate, goalId, stateId, effectId, components]);

    const toggle = (key: string) => setOpenKey((k) => (k === key ? null : key));

    const handleReset = () => {
        setStartDate(isoDate(defaultStart));
        setEndDate(isoDate(defaultEnd));
        setGoalId(null);
        setStateId(null);
        setEffectId(null);
        setComponents([]);
        setOpenKey(null);
    };

    const toggleComponent = (value: AnalyticsContentType) => {
        setComponents((prev) => (prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]));
    };

    const singleSelectPanel = (options: Option[], selected: number | null, onSelect: (id: number | null) => void) => (
        <div className="absolute left-0 top-full mt-1 z-30 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-lg py-1 min-w-[180px] max-h-64 overflow-y-auto">
            <button
                onClick={() => { onSelect(null); setOpenKey(null); }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${selected == null ? 'bg-purple-50 dark:bg-purple-900/20 text-[#9810FA] dark:text-purple-400 font-medium' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
            >
                All
            </button>
            {options.map((opt) => (
                <button
                    key={opt.id}
                    onClick={() => { onSelect(opt.id); setOpenKey(null); }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${selected === opt.id ? 'bg-purple-50 dark:bg-purple-900/20 text-[#9810FA] dark:text-purple-400 font-medium' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                >
                    {opt.name}
                </button>
            ))}
        </div>
    );

    return (
        <div ref={containerRef} className="flex flex-wrap items-center gap-3">
            {/* Date Range */}
            <div className="relative">
                <button onClick={() => toggle('date')} className={btnClass}>
                    <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                    <span>
                        <span className="block text-[10px] text-gray-400">Date Range</span>
                        <span className="block text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
                            {fmtDate(new Date(startDate))} – {fmtDate(new Date(endDate))}
                        </span>
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                </button>
                {openKey === 'date' && (
                    <div className="absolute left-0 top-full mt-1 z-30 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-lg p-4 space-y-3 min-w-[220px]">
                        <div>
                            <label className="text-[10px] text-gray-400">Start</label>
                            <input type="date" value={startDate} max={endDate} onChange={(e) => setStartDate(e.target.value)}
                                className="w-full text-sm px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 focus:outline-none" />
                        </div>
                        <div>
                            <label className="text-[10px] text-gray-400">End</label>
                            <input type="date" value={endDate} min={startDate} onChange={(e) => setEndDate(e.target.value)}
                                className="w-full text-sm px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 focus:outline-none" />
                        </div>
                        <button onClick={() => setOpenKey(null)} className="w-full text-xs font-semibold text-white bg-[#9810FA] hover:bg-[#8000E0] rounded-lg py-1.5 transition-colors">
                            Apply
                        </button>
                    </div>
                )}
            </div>

            {/* Goal */}
            <div className="relative">
                <button onClick={() => toggle('goal')} className={btnClass}>
                    <Target className="w-4 h-4 text-gray-400 shrink-0" />
                    <span>
                        <span className="block text-[10px] text-gray-400">Goal</span>
                        <span className="block text-sm font-medium text-gray-900 dark:text-white">
                            {goalId != null ? goals.find((g) => g.id === goalId)?.name ?? 'All' : 'All'}
                        </span>
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                </button>
                {openKey === 'goal' && singleSelectPanel(goals, goalId, setGoalId)}
            </div>

            {/* State */}
            <div className="relative">
                <button onClick={() => toggle('state')} className={btnClass}>
                    <Waves className="w-4 h-4 text-gray-400 shrink-0" />
                    <span>
                        <span className="block text-[10px] text-gray-400">State</span>
                        <span className="block text-sm font-medium text-gray-900 dark:text-white">
                            {stateId != null ? states.find((s) => s.id === stateId)?.name ?? 'All' : 'All'}
                        </span>
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                </button>
                {openKey === 'state' && singleSelectPanel(states, stateId, setStateId)}
            </div>

            {/* Effect */}
            <div className="relative">
                <button onClick={() => toggle('effect')} className={btnClass}>
                    <Sun className="w-4 h-4 text-gray-400 shrink-0" />
                    <span>
                        <span className="block text-[10px] text-gray-400">Effect</span>
                        <span className="block text-sm font-medium text-gray-900 dark:text-white">
                            {effectId != null ? effects.find((e) => e.id === effectId)?.name ?? 'All' : 'All'}
                        </span>
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                </button>
                {openKey === 'effect' && singleSelectPanel(effects, effectId, setEffectId)}
            </div>

            {/* Components */}
            <div className="relative">
                <button onClick={() => toggle('components')} className={btnClass}>
                    <Layers className="w-4 h-4 text-gray-400 shrink-0" />
                    <span>
                        <span className="block text-[10px] text-gray-400">Components</span>
                        <span className="block text-sm font-medium text-gray-900 dark:text-white">
                            {components.length === 0 ? 'None' : components.length === 1
                                ? COMPONENT_OPTIONS.find((c) => c.value === components[0])?.label
                                : `${components.length} selected`}
                        </span>
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                </button>
                {openKey === 'components' && (
                    <div className="absolute left-0 top-full mt-1 z-30 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-lg py-1 min-w-[160px]">
                        {COMPONENT_OPTIONS.map((opt) => (
                            <label key={opt.value} className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                                <span className={`text-sm ${components.includes(opt.value) ? 'text-[#9810FA] font-medium' : 'text-gray-700 dark:text-gray-200'}`}>{opt.label}</span>
                                <input type="checkbox" checked={components.includes(opt.value)} onChange={() => toggleComponent(opt.value)} className="w-4 h-4 accent-[#9810FA] cursor-pointer" />
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Reset */}
            <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-[#9810FA] hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-colors">
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Filters
            </button>
        </div>
    );
};

export default MindsFilterBar;
