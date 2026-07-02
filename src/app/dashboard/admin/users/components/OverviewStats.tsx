import React from 'react';
import { Users, TrendingUp, Crown, UserPlus } from 'lucide-react';
import { KPI } from '../types';
import StatsCard from './StatsCard';
import type { UserDashboard, EngagementMetrics } from '@/lib/api/types';

interface OverviewStatsProps {
    dashboard: UserDashboard | null;
    engagement: EngagementMetrics | null;
}

const OverviewStats: React.FC<OverviewStatsProps> = ({ dashboard, engagement }) => {
    const fmt = (n: number | undefined | null) =>
        n != null ? n.toLocaleString() : '–';

    const growthPct = (dashboard && dashboard.total_users > 0)
        ? `+${((dashboard.new_month / dashboard.total_users) * 100).toFixed(1)}% this month`
        : 'Loading...';

    const mauGrowthPct = (engagement && engagement.mau > 0 && engagement.dau > 0)
        ? `+${((engagement.dau / engagement.mau) * 100).toFixed(1)}% daily rate`
        : 'Loading...';

    const conversionPct = (dashboard && dashboard.total_users > 0 && dashboard.premium_users != null)
        ? `${((dashboard.premium_users / dashboard.total_users) * 100).toFixed(1)}% of users`
        : 'Loading...';

    const avgDaily = dashboard ? Math.round(dashboard.new_week / 7) : null;
    const newTodayChange = dashboard
        ? avgDaily != null && dashboard.new_today > avgDaily
            ? `Above avg. of ${fmt(avgDaily)}`
            : `Avg of ${fmt(avgDaily)}`
        : 'Loading...';

    const stats: KPI[] = [
        {
            label: 'Total Users',
            value: fmt(dashboard?.total_users),
            change: growthPct,
            changeType: 'positive',
            icon: <Users className="w-5 h-5 text-purple-600" />,
            iconClassName: 'bg-purple-100 dark:bg-purple-900/20',
        },
        {
            label: 'Active Users (MAU)',
            value: fmt(engagement?.mau),
            change: mauGrowthPct,
            changeType: 'positive',
            icon: <TrendingUp className="w-5 h-5 text-blue-600" />,
            iconClassName: 'bg-blue-100 dark:bg-blue-900/20',
        },
        {
            label: 'Premium Users',
            value: fmt(dashboard?.premium_users),
            change: conversionPct,
            changeType: 'neutral',
            icon: <Crown className="w-5 h-5 text-orange-600" />,
            iconClassName: 'bg-orange-100 dark:bg-orange-900/20',
        },
        {
            label: 'New Today',
            value: fmt(dashboard?.new_today),
            change: newTodayChange,
            changeType: dashboard && avgDaily != null && dashboard.new_today > avgDaily ? 'positive' : 'neutral',
            icon: <UserPlus className="w-5 h-5 text-green-600" />,
            iconClassName: 'bg-green-100 dark:bg-green-900/20',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
                <StatsCard key={index} kpi={stat} />
            ))}
        </div>
    );
};

export default OverviewStats;
