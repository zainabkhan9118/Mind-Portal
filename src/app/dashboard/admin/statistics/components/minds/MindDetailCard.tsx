import React from 'react';
import { Target, Waves, Sun, ListChecks } from 'lucide-react';
import type { MindDetail } from '@/lib/api/types';

const Field: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
    <div className="flex items-start gap-2">
        <span className="text-gray-400 mt-0.5 shrink-0">{icon}</span>
        <div className="min-w-0">
            <p className="text-[11px] text-gray-400">{label}</p>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{value}</p>
        </div>
    </div>
);

const MindDetailCard: React.FC<{ mind: MindDetail | null; isLoading: boolean }> = ({ mind, isLoading }) => {
    if (isLoading || !mind) {
        return (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm animate-pulse h-full min-h-[220px]" />
        );
    }

    const iconCls = 'w-3.5 h-3.5';

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-5">
                {mind.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={mind.image}
                        alt={mind.name}
                        className="w-full sm:w-32 h-32 rounded-2xl object-cover shrink-0"
                    />
                ) : (
                    <div className="w-full sm:w-32 h-32 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-800 shrink-0" />
                )}

                <div className="flex-1 min-w-0">
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
        </div>
    );
};

export default MindDetailCard;
