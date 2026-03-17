import React from 'react';
import type { RevenueByPlan } from '@/lib/api/types';

interface Props {
    data: RevenueByPlan[];
    isLoading?: boolean;
}

const TIER_COLORS: Record<string, string> = {
    free: 'bg-gray-400',
    basic: 'bg-blue-600',
    premium: 'bg-purple-500',
    enterprise: 'bg-orange-500',
};

const SubscriptionBreakdown: React.FC<Props> = ({ data, isLoading }) => {
    const maxRevenue = Math.max(...data.map((p) => p.revenue ?? 0), 1);

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm col-span-12 lg:col-span-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-6">Subscription Breakdown</h3>
            {isLoading ? (
                <div className="h-40 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : data.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">No data available</p>
            ) : (
                <div className="space-y-6">
                    {data.map((item, index) => {
                        const pct = Math.round(((item.revenue ?? 0) / maxRevenue) * 100);
                        const color = TIER_COLORS[item.tier] ?? 'bg-purple-500';
                        const revenue = `$${(item.revenue ?? 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
                        return (
                            <div key={index}>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                                        {item.plan_name || item.tier}
                                    </span>
                                    <span className="text-sm font-bold text-gray-900 dark:text-purple-400">{revenue}</span>
                                </div>
                                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 mb-2">
                                    <div className={`${color} h-2 rounded-full`} style={{ width: `${pct}%` }} />
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {(item.transaction_count ?? 0).toLocaleString()} transactions
                                </p>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default SubscriptionBreakdown;
