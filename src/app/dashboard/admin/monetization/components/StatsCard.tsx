import React from 'react';
import { Divide, LucideIcon } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    trend?: string;
    trendType?: 'positive' | 'negative';
    subtitle?: string; // For "This month", "All-time total", etc.
    iconBgColor: string;
    iconColor: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
    title,
    value,
    icon,
    trend,
    trendType = 'positive',
    subtitle,
    iconBgColor,
    iconColor,
}) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between h-full min-h-[160px]">
            <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${iconBgColor} ${iconColor}`}>
                    {icon}
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</h3>
                </div>
            </div>

            {(trend || subtitle) && (
                <div className="mt-4 text-sm font-medium">
                    {trend && (
                        <span className={`${trendType === 'positive' ? 'text-green-500' : 'text-red-500'} mr-2`}>
                            {trend}
                        </span>
                    )}
                    {subtitle && <span className="text-gray-500 dark:text-gray-400">{subtitle}</span>}
                </div>
            )}
        </div>
    );
};

export default StatsCard;
