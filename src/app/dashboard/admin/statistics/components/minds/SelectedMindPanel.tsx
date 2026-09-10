import React from 'react';
import { Target, Waves, Sun, ListChecks, Info, X } from 'lucide-react';
import type { MindDetail, MindStateEntryPoint } from '@/lib/api/types';

const Field: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
    <div className="flex items-start gap-2">
        <span className="text-gray-400 mt-0.5 shrink-0">{icon}</span>
        <div className="min-w-0">
            <p className="text-[11px] text-gray-400">{label}</p>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{value}</p>
        </div>
    </div>
);

interface SelectedMindPanelProps {
    mind: MindDetail | null;
    isMindLoading: boolean;
    /** True while a fresh detail fetch (with the real image) is in flight for an already-displayed mind. */
    isRefreshing?: boolean;
    entryPoints: MindStateEntryPoint[];
    isEntryPointsLoading: boolean;
    onClose: () => void;
}

const SelectedMindPanel: React.FC<SelectedMindPanelProps> = ({ mind, isMindLoading, isRefreshing, entryPoints, isEntryPointsLoading, onClose }) => {
    // Nothing selected — this whole panel only exists as a result of clicking a row below, so hide it entirely.
    if (!mind && !isMindLoading) return null;

    const iconCls = 'w-3.5 h-3.5';

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm relative">
            <button
                onClick={onClose}
                title="Close"
                className="absolute top-4 right-4 z-10 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-200 transition-colors"
            >
                <X className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Mind detail */}
                <div className="p-6">
                    {isMindLoading || !mind ? (
                        <div className="animate-pulse h-40" />
                    ) : (
                        <div className="flex flex-col sm:flex-row gap-5">
                            <div className="relative w-full sm:w-32 h-32 shrink-0 rounded-2xl overflow-hidden">
                                {mind.image ? (
                                    // Deliberately a plain <img>, not next/image — mind.image is a presigned,
                                    // per-request S3 URL (changing signature/expiry each fetch), which defeats
                                    // next/image's URL-keyed optimization cache and adds a slower round trip
                                    // through the Next.js image optimizer for no benefit. Same reason every other
                                    // S3-hosted asset in this app (covers, icons, avatars, env images) uses <img>.
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={mind.image}
                                        alt={mind.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-purple-600 to-indigo-800" />
                                )}
                                {isRefreshing && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0 pr-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">{mind.name}</h3>
                                    <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 text-[10px] font-bold uppercase tracking-wide shrink-0">
                                        Selected
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                                    <Field icon={<Target className={iconCls} />} label="Primary Goal" value={mind.primary_goal} />
                                    <Field icon={<Target className={iconCls} />} label="Secondary Goal" value={(mind.secondary_goals ?? []).join(', ') || '—'} />
                                    <Field icon={<Waves className={iconCls} />} label="Primary State" value={mind.primary_state} />
                                    <Field icon={<Waves className={iconCls} />} label="Secondary State" value={(mind.secondary_states ?? []).join(', ') || '—'} />
                                    <Field icon={<Sun className={iconCls} />} label="Primary Effect" value={mind.primary_effect} />
                                    <Field icon={<ListChecks className={iconCls} />} label="Total Plays" value={mind.total_plays.toLocaleString()} />
                                </div>

                                <div className="grid grid-cols-2 gap-x-6 gap-y-3 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                                    <Field icon={<Sun className={iconCls} />} label="Secondary Effects" value={(mind.secondary_effects ?? []).join(', ') || '—'} />
                                    <Field icon={<ListChecks className={iconCls} />} label="Helpful" value={`${Math.round(mind.helpful_rate)}%`} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Divider between the two halves */}
                <div className="p-6 border-t lg:border-t-0 lg:border-l border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-1.5 mb-5">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Helpful by State Entry Point</h3>
                        <Info className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600" />
                    </div>

                    {isEntryPointsLoading ? (
                        <div className="space-y-4">
                            {[...Array(3)].map((_, i) => <div key={i} className="h-6 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />)}
                        </div>
                    ) : entryPoints.length === 0 ? (
                        <p className="text-sm text-gray-400 py-8 text-center">No data available</p>
                    ) : (
                        <div className="space-y-4">
                            {entryPoints.map((row) => (
                                <div key={row.state}>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                                            <Waves className="w-3.5 h-3.5 text-gray-400" />
                                            {row.state}
                                        </span>
                                        <span className="text-xs text-gray-400">n={row.n}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <div className="h-full bg-[#9810FA] rounded-full" style={{ width: `${Math.min(row.helpful_rate, 100)}%` }} />
                                        </div>
                                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 w-16 text-right shrink-0">{Math.round(row.helpful_rate)}% helpful</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SelectedMindPanel;
