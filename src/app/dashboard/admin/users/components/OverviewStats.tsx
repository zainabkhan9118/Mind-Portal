import React from 'react';
import { Users, TrendingUp, CalendarDays, UserPlus } from 'lucide-react';
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

    const stats: KPI[] = [
        {
            label: 'Total Users',
            value: fmt(dashboard?.total_users),
            change: dashboard ? `+${fmt(dashboard.new_this_month)} this month` : 'Loading...',
            changeType: 'positive',
            icon: <Users className="w-6 h-6 text-purple-600" />,
            iconClassName: 'bg-purple-100 dark:bg-purple-900/20',
        },
        {
            label: 'Active Users (MAU)',
            value: fmt(engagement?.mau),
            change: engagement
                ? `DAU: ${fmt(engagement.dau)} · WAU: ${fmt(engagement.wau)}`
                : 'Loading...',
            changeType: 'positive',
            icon: <TrendingUp className="w-6 h-6 text-blue-600" />,
            iconClassName: 'bg-blue-100 dark:bg-blue-900/20',
        },
        {
            label: 'New This Month',
            value: fmt(dashboard?.new_this_month),
            change: dashboard ? `This week: ${fmt(dashboard.new_this_week)}` : 'Loading...',
            changeType: 'neutral',
            icon: <CalendarDays className="w-6 h-6 text-orange-600" />,
            iconClassName: 'bg-orange-100 dark:bg-orange-900/20',
        },
        {
            label: 'New Today',
            value: fmt(dashboard?.new_today),
            change: dashboard?.churn_rate != null
                ? `Churn rate: ${(dashboard.churn_rate * 100).toFixed(1)}%`
                : 'Loading...',
            changeType: 'positive',
            icon: <UserPlus className="w-6 h-6 text-green-600" />,
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
