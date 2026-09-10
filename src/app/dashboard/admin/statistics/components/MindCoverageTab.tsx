"use client";
import React, { useEffect, useState } from 'react';
import { Brain, Target, ChevronDown, ChevronUp, Check } from 'lucide-react';
import apiClient from '@/lib/api/axiosInstance';
import analyticsApi from '@/lib/api/analyticsApi';
import type { MindCoverageRow } from '@/lib/api/types';

interface Goal {
    id: number;
    name: string;
}

const MindCoverageTab: React.FC = () => {
    const [goalsList, setGoalsList] = useState<Goal[]>([]);
    const [selectedGoals, setSelectedGoals] = useState<number[]>([]);
    const [isGoalsExpanded, setIsGoalsExpanded] = useState(true);

    const [rows, setRows] = useState<MindCoverageRow[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch goals once
    useEffect(() => {
        apiClient
            .get<{ results: Goal[] }>('explore/goals/', { params: { size: 100 } })
            .then((res) => setGoalsList(res.data.results ?? []))
            .catch(() => {});
    }, []);

    // Fetch coverage whenever the selected goals change.
    // The backend's `goal_id` param is singular, so to support selecting multiple goals we
    // fire one request per selected goal and concatenate the results (each response only
    // contains rows for its own goal, so there's no overlap to merge/sum).
    useEffect(() => {
        setIsLoading(true);
        const requests = selectedGoals.length === 0
            ? [analyticsApi.getMindCoverage({})]
            : selectedGoals.map((goal_id) => analyticsApi.getMindCoverage({ goal_id }));

        Promise.all(requests)
            .then((results) => setRows(results.flat()))
            .catch(() => setRows([]))
            .finally(() => setIsLoading(false));
    }, [selectedGoals]);

    const toggleGoal = (id: number) => {
        setSelectedGoals((prev) => (prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]));
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
                    <Brain className="w-7 h-7" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mind Coverage</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        Coverage across goal and primary state pathways
                    </p>
                </div>
            </div>

            {/* Goals filter */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                <button
                    onClick={() => setIsGoalsExpanded((v) => !v)}
                    className="w-full flex items-start justify-between gap-4"
                >
                    <div className="flex items-start gap-3 text-left">
                        <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 shrink-0">
                            <Target className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-base font-bold text-gray-900 dark:text-white">Goals</h2>
                                <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 text-[10px] font-bold uppercase tracking-wide">
                                    Multi-select
                                </span>
                            </div>
                            <p className="text-xs text-gray-400 mt-0.5">Select one or more goals to filter coverage</p>
                        </div>
                    </div>
                    {isGoalsExpanded
                        ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0 mt-2" />
                        : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0 mt-2" />}
                </button>

                {isGoalsExpanded && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
                        {goalsList.map((goal) => {
                            const isSelected = selectedGoals.includes(goal.id);
                            return (
                                <label
                                    key={goal.id}
                                    className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border cursor-pointer transition-colors ${
                                        isSelected
                                            ? 'border-purple-300 dark:border-purple-600 bg-purple-50/60 dark:bg-purple-900/20'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                    }`}
                                >
                                    <span
                                        className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${
                                            isSelected
                                                ? 'bg-[#9810FA] border-[#9810FA]'
                                                : 'border-gray-300 dark:border-gray-600'
                                        }`}
                                    >
                                        {isSelected && <Check className="w-3 h-3 text-white" />}
                                    </span>
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => toggleGoal(goal.id)}
                                        className="sr-only"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-200">{goal.name}</span>
                                </label>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Coverage table */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-gray-700 bg-purple-50/40 dark:bg-purple-900/10">
                                <th className="px-6 py-4 text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">Primary Goal</th>
                                <th className="px-6 py-4 text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">Primary State</th>
                                <th className="px-6 py-4 text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider text-right">Number of Minds</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={3} className="py-16 text-center">
                                        <div className="flex justify-center">
                                            <div className="w-7 h-7 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                                        </div>
                                    </td>
                                </tr>
                            ) : rows.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="py-16 text-center text-sm text-gray-400">
                                        No coverage data available
                                    </td>
                                </tr>
                            ) : (
                                rows.map((row, i) => (
                                    <tr key={`${row.primary_goal}-${row.primary_state}-${i}`} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">{row.primary_goal}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">{row.primary_state}</td>
                                        <td className="px-6 py-4 text-sm font-bold text-[#9810FA] text-right">{row.count}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MindCoverageTab;
