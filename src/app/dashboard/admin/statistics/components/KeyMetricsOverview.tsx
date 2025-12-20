import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface Metric {
    label: string;
    value: string;
    trend: 'up' | 'down';
    trendLabel: string; // The text "Button" in the screenshot, likely meant to be a trend value or label? I'll assume it's a trend value like "+12%" or just "Up"
}

const metrics: Metric[] = [
    { label: "Total Plays", value: "1.2M", trend: 'up', trendLabel: "+12.5%" },
    { label: "Avg. Listening Time", value: "1.8m 45s", trend: 'down', trendLabel: "-2.3%" },
    { label: "Completion Rate", value: "78.2%", trend: 'up', trendLabel: "+5.4%" },
    { label: "Repetition Rate", value: "1.6x", trend: 'up', trendLabel: "+0.2x" },
];

const KeyMetricsOverview: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{metric.label}</p>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{metric.value}</h3>
                    <div className={`flex items-center gap-1 text-sm font-medium ${metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                        {metric.trend === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                        <span>{metric.trendLabel}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default KeyMetricsOverview;
