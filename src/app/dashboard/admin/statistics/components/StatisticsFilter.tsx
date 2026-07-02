"use client";
import React, { useState, useEffect } from "react";
import { ChevronLeft, X, SlidersHorizontal } from "lucide-react";
import apiClient from "@/lib/api/axiosInstance";
import type { ContentType } from "@/lib/api/types";

// ── Content types ──────────────────────────────────────────────────────────

const CONTENT_TYPE_OPTIONS: { label: string; value: ContentType }[] = [
    { label: "Music",         value: "music" },
    { label: "Mind Sessions", value: "mind_session" },
    { label: "Env Sounds",    value: "env_sound" },
    { label: "Env Visuals",   value: "env_visual" },
];

// ── API response shapes ────────────────────────────────────────────────────

interface ApiGoal { id: number; name: string }
interface ApiCategory { id: number; name: string; item_count: number; contentType: ContentType }
interface ApiSubCategory { id: number; name: string; category: number | null; category_name: string | null }

const TIME_OPTIONS = [
    { label: "Last 24h",      value: "last_24h" },
    { label: "Last Week",     value: "last_week" },
    { label: "Last Month",    value: "last_month" },
    { label: "Last Year",     value: "last_year" },
    { label: "All-time",      value: "all_time" },
    { label: "Custom Range",  value: "custom" },
];

const ANALYSIS_TYPES = [
    { label: "Content-type + Goals",  value: "content_type_goals" },
    { label: "Category + Goals",      value: "category_goals" },
    { label: "Sub Category + Goals",  value: "sub_category_goals" },
    { label: "Minds + Goals",         value: "minds_goals" },
    { label: "Goals + Content-type",  value: "goals_content_type" },
    { label: "Goals + Category",      value: "goals_category" },
    { label: "Goals + Sub Category",  value: "goals_sub_category" },
    { label: "Goals + Minds",         value: "goals_minds" },
];

// ── Step flows ─────────────────────────────────────────────────────────────

type StepKey = "analysis" | "contentType" | "category" | "subCategory" | "goals" | "time";

const STEP_FLOWS: Record<string, StepKey[]> = {
    content_type_goals:  ["analysis", "contentType", "goals", "time"],
    category_goals:      ["analysis", "contentType", "category", "goals", "time"],
    sub_category_goals:  ["analysis", "contentType", "category", "subCategory", "goals", "time"],
    minds_goals:         ["analysis", "goals", "time"],
    goals_content_type:  ["analysis", "goals", "contentType", "time"],
    goals_category:      ["analysis", "goals", "contentType", "category", "time"],
    goals_sub_category:  ["analysis", "goals", "contentType", "category", "subCategory", "time"],
    goals_minds:         ["analysis", "goals", "time"],
};

// ── Public types ───────────────────────────────────────────────────────────

export interface StatisticsFilterState {
    analysisType: string;
    contentTypes: string[];
    categories: string[];
    subCategories: string[];
    goals: string[];
    timeRange: string;
    customRangeStart?: string;
    customRangeEnd?: string;
}

export const DEFAULT_FILTER_STATE: StatisticsFilterState = {
    analysisType: "",
    contentTypes: [],
    categories: [],
    subCategories: [],
    goals: [],
    timeRange: "all_time",
};

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onApply: (filter: StatisticsFilterState) => void;
    /** When false, the Time step is omitted (Time is handled separately) */
    showTimeStep?: boolean;
}

// ── Helper ─────────────────────────────────────────────────────────────────

function toggle<T>(arr: T[], item: T): T[] {
    return arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];
}

// ── Component ──────────────────────────────────────────────────────────────

const StatisticsFilter: React.FC<Props> = ({ isOpen, onClose, onApply, showTimeStep = true }) => {
    const [state, setState] = useState<StatisticsFilterState>(DEFAULT_FILTER_STATE);
    const [stepIndex, setStepIndex] = useState(0);

    // ── Dynamic data ─────────────────────────────────────────────────────────
    const [apiGoals, setApiGoals] = useState<ApiGoal[]>([]);
    const [apiCategories, setApiCategories] = useState<ApiCategory[]>([]);
    const [apiSubCategories, setApiSubCategories] = useState<ApiSubCategory[]>([]);
    const [isLoadingGoals, setIsLoadingGoals] = useState(false);
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);
    const [isLoadingSubCategories, setIsLoadingSubCategories] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        setIsLoadingGoals(true);
        apiClient.get<{ results: ApiGoal[] }>('explore/goals/', { params: { size: 100 } })
            .then(r => setApiGoals(r.data.results ?? []))
            .catch(() => {})
            .finally(() => setIsLoadingGoals(false));
    }, [isOpen]);

    const steps: StepKey[] = (state.analysisType
        ? (STEP_FLOWS[state.analysisType] ?? ["analysis"])
        : ["analysis"]
    ).filter((s): s is StepKey => showTimeStep || s !== "time");
    const currentStep = steps[stepIndex];

    useEffect(() => {
        if (currentStep !== 'category') return;
        const types = (state.contentTypes.length > 0 ? state.contentTypes : CONTENT_TYPE_OPTIONS.map(o => o.value)) as ContentType[];
        setIsLoadingCategories(true);
        Promise.all(
            types.map(type =>
                apiClient.get<{ results: { id: number; name: string; item_count: number }[] }>(
                    'admin/content/categories/',
                    { params: { type, size: 100 } }
                ).then(r => (r.data.results ?? []).map(c => ({ ...c, contentType: type })))
            )
        )
            .then(results => setApiCategories(results.flat()))
            .catch(() => {})
            .finally(() => setIsLoadingCategories(false));
    }, [currentStep, state.contentTypes]);

    useEffect(() => {
        if (currentStep !== 'subCategory') return;
        const types = (state.contentTypes.length > 0 ? state.contentTypes : CONTENT_TYPE_OPTIONS.map(o => o.value)) as ContentType[];
        const selectedCatIds = state.categories
            .map(name => apiCategories.find(c => c.name === name)?.id)
            .filter((id): id is number => id != null);
        setIsLoadingSubCategories(true);
        Promise.all(
            types.map(type => {
                const params: Record<string, unknown> = { type, size: 100 };
                if (selectedCatIds.length === 1) params.category = selectedCatIds[0];
                return apiClient.get<{ results: ApiSubCategory[] }>(
                    'admin/content/sub-categories/',
                    { params }
                ).then(r => r.data.results ?? []);
            })
        )
            .then(results => {
                const seen = new Set<string>();
                const unique = results.flat().filter(s => {
                    if (seen.has(s.name)) return false;
                    seen.add(s.name);
                    return true;
                });
                setApiSubCategories(unique);
            })
            .catch(() => {})
            .finally(() => setIsLoadingSubCategories(false));
    }, [currentStep, state.contentTypes, state.categories, apiCategories]);

    const isLastStep = stepIndex === steps.length - 1;

    const goNext = () => { if (stepIndex < steps.length - 1) setStepIndex((i) => i + 1); };
    const goBack = () => {
        if (stepIndex > 0) setStepIndex((i) => i - 1);
        else { reset(); onClose(); }
    };
    const reset = () => { setState(DEFAULT_FILTER_STATE); setStepIndex(0); };
    const handleClose = () => { reset(); onClose(); };
    const handleApply = () => { onApply(state); handleClose(); };

    if (!isOpen) return null;

    // ── Shared UI pieces ────────────────────────────────────────────────────

    const PanelHeader = ({ title }: { title: string }) => (
        <div className="flex items-center gap-2 px-5 py-4 shrink-0 border-b border-gray-100 dark:border-gray-700">
            <button
                onClick={goBack}
                className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 transition-colors flex items-center gap-0.5 min-w-[40px]"
            >
                <ChevronLeft className="w-3.5 h-3.5" />
                Back
            </button>
            <span className="flex-1 text-center text-sm font-semibold text-gray-800 dark:text-white">
                {title}
            </span>
            <button
                onClick={handleClose}
                className="text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 transition-colors min-w-[40px] flex justify-end"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );

    const CheckRow = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) => (
        <label className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer rounded-xl mx-1 transition-colors">
            <span className={`text-sm transition-colors ${checked ? "text-[#9810FA] dark:text-purple-400 font-medium" : "text-gray-700 dark:text-gray-300"}`}>
                {label}
            </span>
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 accent-[#9810FA] cursor-pointer flex-shrink-0"
            />
        </label>
    );

    const RadioRow = ({ label, checked, onChange, suffix }: { label: string; checked: boolean; onChange: () => void; suffix?: React.ReactNode }) => (
        <label className={`flex items-center px-4 py-2.5 cursor-pointer rounded-xl mx-1 transition-colors ${checked ? "bg-purple-50 dark:bg-purple-900/20" : "hover:bg-gray-50 dark:hover:bg-gray-700/50"}`}>
            <input
                type="radio"
                checked={checked}
                onChange={onChange}
                className="w-4 h-4 accent-[#9810FA] cursor-pointer flex-shrink-0"
            />
            <span className={`flex-1 ml-3 text-sm ${checked ? "text-[#9810FA] dark:text-purple-400 font-medium" : "text-gray-700 dark:text-gray-300"}`}>
                {label}
            </span>
            {suffix}
        </label>
    );

    const GroupHeader = ({ label }: { label: string }) => (
        <p className="px-5 pt-3 pb-1 text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            {label}
        </p>
    );

    const PanelFooter = ({ onClear }: { onClear: () => void }) => (
        <div className="flex gap-2 px-5 py-4 shrink-0 border-t border-gray-100 dark:border-gray-700">
            <button
                onClick={onClear}
                className="flex-1 py-2 rounded-xl border border-gray-200 dark:border-gray-600 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
                Clear All
            </button>
            {isLastStep ? (
                <button
                    onClick={handleApply}
                    className="flex-1 py-2 rounded-xl bg-[#9810FA] hover:bg-[#8000E0] text-white text-sm font-semibold transition-colors shadow-sm shadow-purple-200 dark:shadow-purple-900/30"
                >
                    Show Results
                </button>
            ) : (
                <button
                    onClick={goNext}
                    className="flex-1 py-2 rounded-xl bg-[#9810FA] hover:bg-[#8000E0] text-white text-sm font-semibold transition-colors shadow-sm shadow-purple-200 dark:shadow-purple-900/30"
                >
                    Next
                </button>
            )}
        </div>
    );

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={handleClose}
        >
            <div
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 w-72 flex flex-col overflow-hidden"
                style={{ maxHeight: "min(90vh, 540px)" }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* ── Analysis ── */}
                {currentStep === "analysis" && (
                    <>
                        <PanelHeader title="Analysis" />
                        <div className="flex-1 overflow-y-auto py-2">
                            {ANALYSIS_TYPES.map((type) => (
                                <RadioRow
                                    key={type.value}
                                    label={type.label}
                                    checked={state.analysisType === type.value}
                                    onChange={() => setState({ ...DEFAULT_FILTER_STATE, analysisType: type.value })}
                                />
                            ))}
                        </div>
                        <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-700 shrink-0">
                            <button
                                onClick={goNext}
                                disabled={!state.analysisType}
                                className="w-full py-2 rounded-xl bg-[#9810FA] hover:bg-[#8000E0] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}

                {/* ── Content-type ── */}
                {currentStep === "contentType" && (
                    <>
                        <PanelHeader title="Content-type" />
                        <div className="flex-1 overflow-y-auto py-2">
                            {CONTENT_TYPE_OPTIONS.map((ct) => (
                                <CheckRow
                                    key={ct.value}
                                    label={ct.label}
                                    checked={state.contentTypes.includes(ct.value)}
                                    onChange={() => setState((s) => ({ ...s, contentTypes: toggle(s.contentTypes, ct.value), categories: [], subCategories: [] }))}
                                />
                            ))}
                        </div>
                        <PanelFooter onClear={() => setState((s) => ({ ...s, contentTypes: [], categories: [], subCategories: [] }))} />
                    </>
                )}

                {/* ── Category ── */}
                {currentStep === "category" && (
                    <>
                        <PanelHeader title="Category" />
                        <div className="flex-1 overflow-y-auto py-2">
                            {isLoadingCategories ? (
                                <p className="px-5 py-6 text-sm text-gray-400 text-center">Loading…</p>
                            ) : apiCategories.length === 0 ? (
                                <p className="px-5 py-6 text-sm text-gray-400 text-center">No categories found.</p>
                            ) : (
                                CONTENT_TYPE_OPTIONS
                                    .filter(opt => state.contentTypes.length === 0 || state.contentTypes.includes(opt.value))
                                    .map(opt => {
                                        const cats = apiCategories.filter(c => c.contentType === opt.value);
                                        if (cats.length === 0) return null;
                                        return (
                                            <div key={opt.value}>
                                                <GroupHeader label={opt.label} />
                                                {cats.map(cat => (
                                                    <CheckRow
                                                        key={cat.id}
                                                        label={cat.name}
                                                        checked={state.categories.includes(cat.name)}
                                                        onChange={() => setState(s => ({ ...s, categories: toggle(s.categories, cat.name), subCategories: [] }))}
                                                    />
                                                ))}
                                            </div>
                                        );
                                    })
                            )}
                        </div>
                        <PanelFooter onClear={() => setState((s) => ({ ...s, categories: [], subCategories: [] }))} />
                    </>
                )}

                {/* ── Sub Category ── */}
                {currentStep === "subCategory" && (
                    <>
                        <PanelHeader title="Sub Category" />
                        <div className="flex-1 overflow-y-auto py-2">
                            {isLoadingSubCategories ? (
                                <p className="px-5 py-6 text-sm text-gray-400 text-center">Loading…</p>
                            ) : apiSubCategories.length === 0 ? (
                                <p className="px-5 py-6 text-sm text-gray-400 text-center">
                                    No sub-categories for selected categories.
                                </p>
                            ) : (
                                (() => {
                                    const grouped = apiSubCategories.reduce<Record<string, ApiSubCategory[]>>((acc, s) => {
                                        const key = s.category_name ?? 'Other';
                                        if (!acc[key]) acc[key] = [];
                                        acc[key].push(s);
                                        return acc;
                                    }, {});
                                    return Object.entries(grouped).map(([groupName, subs]) => (
                                        <div key={groupName}>
                                            <GroupHeader label={groupName} />
                                            {subs.map(sub => (
                                                <CheckRow
                                                    key={sub.id}
                                                    label={sub.name}
                                                    checked={state.subCategories.includes(sub.name)}
                                                    onChange={() => setState(s => ({ ...s, subCategories: toggle(s.subCategories, sub.name) }))}
                                                />
                                            ))}
                                        </div>
                                    ));
                                })()
                            )}
                        </div>
                        <PanelFooter onClear={() => setState((s) => ({ ...s, subCategories: [] }))} />
                    </>
                )}

                {/* ── Goals ── */}
                {currentStep === "goals" && (
                    <>
                        <PanelHeader title="Goals" />
                        <div className="flex-1 overflow-y-auto py-2">
                            {isLoadingGoals ? (
                                <p className="px-5 py-6 text-sm text-gray-400 text-center">Loading…</p>
                            ) : apiGoals.length === 0 ? (
                                <p className="px-5 py-6 text-sm text-gray-400 text-center">No goals found.</p>
                            ) : (
                                apiGoals.map(goal => (
                                    <CheckRow
                                        key={goal.id}
                                        label={goal.name}
                                        checked={state.goals.includes(goal.name)}
                                        onChange={() => setState(s => ({ ...s, goals: toggle(s.goals, goal.name) }))}
                                    />
                                ))
                            )}
                        </div>
                        <PanelFooter onClear={() => setState((s) => ({ ...s, goals: [] }))} />
                    </>
                )}

                {/* ── Time ── */}
                {currentStep === "time" && (
                    <>
                        <PanelHeader title="Time" />
                        <div className="flex-1 overflow-y-auto py-2">
                            {TIME_OPTIONS.map((opt) => (
                                <RadioRow
                                    key={opt.value}
                                    label={opt.label}
                                    checked={state.timeRange === opt.value}
                                    onChange={() => setState((s) => ({ ...s, timeRange: opt.value }))}
                                    suffix={
                                        opt.value === "custom" ? (
                                            <span className="text-xs text-[#9810FA] font-medium">Select</span>
                                        ) : undefined
                                    }
                                />
                            ))}
                            {state.timeRange === "custom" && (
                                <div className="px-5 pt-2 pb-3 space-y-2">
                                    <input
                                        type="date"
                                        value={state.customRangeStart ?? ""}
                                        onChange={(e) => setState((s) => ({ ...s, customRangeStart: e.target.value }))}
                                        className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:border-[#9810FA] transition-colors"
                                    />
                                    <input
                                        type="date"
                                        value={state.customRangeEnd ?? ""}
                                        onChange={(e) => setState((s) => ({ ...s, customRangeEnd: e.target.value }))}
                                        className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:border-[#9810FA] transition-colors"
                                    />
                                </div>
                            )}
                        </div>
                        <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-700 shrink-0">
                            <button
                                onClick={handleApply}
                                className="w-full py-2 rounded-xl bg-[#9810FA] hover:bg-[#8000E0] text-white text-sm font-semibold transition-colors shadow-sm shadow-purple-200 dark:shadow-purple-900/30"
                            >
                                Show Results
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default StatisticsFilter;

// ── Trigger button ─────────────────────────────────────────────────────────

interface TriggerProps {
    onClick: () => void;
    isActive: boolean;
    label?: string;
}

export const StatisticsFilterTrigger: React.FC<TriggerProps> = ({ onClick, isActive, label = "Filter" }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
            isActive
                ? "bg-[#9810FA] border-[#9810FA] text-white shadow-sm shadow-purple-200 dark:shadow-purple-900/30"
                : "border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-[#9810FA] hover:text-[#9810FA] dark:hover:text-purple-400 bg-white dark:bg-gray-800"
        }`}
    >
        <SlidersHorizontal className="w-4 h-4" />
        {label}
        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white/80 flex-shrink-0" />}
    </button>
);
