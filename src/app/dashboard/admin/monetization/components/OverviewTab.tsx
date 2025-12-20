import React from 'react';
import { DollarSign, TrendingUp, Users, UserMinus } from 'lucide-react';
import StatsCard from './StatsCard';
import RevenueChart from './RevenueChart';
import SubscriptionBreakdown from './SubscriptionBreakdown';
import RevenueByMarket from './RevenueByMarket';

const OverviewTab = () => {
    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Monthly Revenue"
                    value="$ 6,453.0"
                    icon={<DollarSign className="w-6 h-6" />}
                    trend="+12.5% this month"
                    trendType="positive"
                    iconBgColor="bg-green-50 dark:bg-green-900/20"
                    iconColor="text-green-500"
                />
                <StatsCard
                    title="Lifetime Revenue"
                    value="$ 456.0"
                    icon={<TrendingUp className="w-6 h-6" />}
                    subtitle="All-time total"
                    iconBgColor="bg-blue-50 dark:bg-blue-900/20"
                    iconColor="text-blue-500"
                />
                <StatsCard
                    title="Average LTV"
                    value="$ 6,453.0"
                    icon={<Users className="w-6 h-6" />}
                    trend="+8.3% vs last quarter"
                    trendType="positive"
                    iconBgColor="bg-blue-50 dark:bg-blue-900/20"
                    iconColor="text-blue-500"
                />
                <StatsCard
                    title="Churn Rate"
                    value="147"
                    icon={<UserMinus className="w-6 h-6" />}
                    trend="-1.2% improvement"
                    trendType="positive"
                    iconBgColor="bg-green-50 dark:bg-green-900/20"
                    iconColor="text-green-500"
                />
            </div>

            {/* Middle Section: Chart */}
            <div className="grid grid-cols-12 gap-6">
                <RevenueChart />
            </div>

            {/* Bottom Section: Breakdown and Market */}
            <div className="grid grid-cols-12 gap-6">
                <SubscriptionBreakdown />
                <RevenueByMarket />
            </div>
        </div>
    );
};

export default OverviewTab;
