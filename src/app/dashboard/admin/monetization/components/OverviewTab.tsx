"use client";
import React, { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, Users, UserMinus } from 'lucide-react';
import StatsCard from './StatsCard';
import RevenueChart from './RevenueChart';
import SubscriptionBreakdown from './SubscriptionBreakdown';
import RevenueByMarket from './RevenueByMarket';
import monetizationApi from '@/lib/api/monetizationApi';
import type {
    MonetizationDashboard,
    RevenueTimeseriesPoint,
    RevenueByPlan,
    RevenueByRegion,
} from '@/lib/api/types';

const fmt = (n?: number) =>
    n != null
        ? `$${(n ?? 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
        : '—';

const OverviewTab = () => {
    const [dashboard, setDashboard] = useState<MonetizationDashboard | null>(null);
    const [timeseries, setTimeseries] = useState<RevenueTimeseriesPoint[]>([]);
    const [byPlan, setByPlan] = useState<RevenueByPlan[]>([]);
    const [byRegion, setByRegion] = useState<RevenueByRegion[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            monetizationApi.getDashboard(),
            monetizationApi.getRevenueTimeseries('monthly'),
            monetizationApi.getRevenueByPlan(),
            monetizationApi.getRevenueByRegion(),
        ])
            .then(([dash, ts, plans, regions]) => {
                setDashboard(dash);
                setTimeseries(ts);
                setByPlan(plans);
                setByRegion(regions);
            })
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, []);

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Monthly Revenue (MRR)"
                    value={fmt(dashboard?.mrr)}
                    icon={<DollarSign className="w-6 h-6" />}
                    subtitle={dashboard?.arr != null ? `ARR: ${fmt(dashboard.arr)}` : undefined}
                    iconBgColor="bg-green-50 dark:bg-green-900/20"
                    iconColor="text-green-500"
                />
                <StatsCard
                    title="Total Revenue"
                    value={fmt(dashboard?.total_revenue)}
                    icon={<TrendingUp className="w-6 h-6" />}
                    subtitle="All-time total"
                    iconBgColor="bg-blue-50 dark:bg-blue-900/20"
                    iconColor="text-blue-500"
                />
                <StatsCard
                    title="Avg. Revenue Per User"
                    value={fmt(dashboard?.arpu)}
                    icon={<Users className="w-6 h-6" />}
                    subtitle={
                        dashboard?.active_subscribers != null
                            ? `${(dashboard.active_subscribers ?? 0).toLocaleString()} active subscribers`
                            : undefined
                    }
                    iconBgColor="bg-blue-50 dark:bg-blue-900/20"
                    iconColor="text-blue-500"
                />
                <StatsCard
                    title="Churn Rate"
                    value={dashboard?.churn_rate != null ? `${(dashboard.churn_rate ?? 0).toFixed(1)}%` : '—'}
                    icon={<UserMinus className="w-6 h-6" />}
                    subtitle={
                        dashboard?.churned_count != null
                            ? `${(dashboard.churned_count ?? 0).toLocaleString()} churned`
                            : undefined
                    }
                    iconBgColor="bg-red-50 dark:bg-red-900/20"
                    iconColor="text-red-500"
                />
            </div>

            {/* Middle Section: Chart */}
            <div className="grid grid-cols-12 gap-6">
                <RevenueChart data={timeseries} isLoading={isLoading} />
            </div>

            {/* Bottom Section: Breakdown and Market */}
            <div className="grid grid-cols-12 gap-6">
                <SubscriptionBreakdown data={byPlan} isLoading={isLoading} />
                <RevenueByMarket data={byRegion} isLoading={isLoading} />
            </div>
        </div>
    );
};

export default OverviewTab;
