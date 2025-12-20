import React from 'react';
import { Users, TrendingUp, Crown, UserPlus } from 'lucide-react';
import { KPI } from '../types';
import StatsCard from './StatsCard';

const OverviewStats: React.FC = () => {
    const stats: KPI[] = [
        {
            label: 'Total Users',
            value: '24,589',
            change: '+12.5% this month',
            changeType: 'positive',
            icon: <Users className="w-6 h-6 text-purple-600" />,
            iconClassName: 'bg-purple-100 dark:bg-purple-900/20',
        },
        {
            label: 'Active Users (MAU)',
            value: '18,234',
            change: '+8.2% this month',
            changeType: 'positive',
            icon: <TrendingUp className="w-6 h-6 text-blue-600" />,
            iconClassName: 'bg-blue-100 dark:bg-blue-900/20',
        },
        {
            label: 'Premium Users',
            value: '5,010',
            change: '20.4% conversion',
            changeType: 'neutral', // Purple in design, distinct from green/red
            icon: <Crown className="w-6 h-6 text-orange-600" />,
            iconClassName: 'bg-orange-100 dark:bg-orange-900/20',
        },
        {
            label: 'New Today',
            value: '147',
            change: 'Above avg. of 125',
            changeType: 'positive', // Green text says "Above avg..."
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
