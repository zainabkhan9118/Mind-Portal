import React from 'react';
import { KPI } from '../types';

interface StatsCardProps {
    kpi: KPI;
}

const StatsCard: React.FC<StatsCardProps> = ({ kpi }) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${kpi.iconClassName || 'bg-gray-100 dark:bg-gray-700'}`}>
                {kpi.icon}
            </div>
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">{kpi.label}</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{kpi.value}</h3>
                <p className={`text-xs font-semibold ${kpi.changeType === 'positive' ? 'text-green-500' :
                        kpi.changeType === 'negative' ? 'text-red-500' : 'text-purple-500'
                    }`}>
                    {kpi.change}
                    {kpi.subText && <span className="text-gray-400 font-normal ml-1">{kpi.subText}</span>}
                </p>
            </div>
        </div>
    );
};

export default StatsCard;
