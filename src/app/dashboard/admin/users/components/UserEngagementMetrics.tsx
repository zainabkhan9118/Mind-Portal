import React from "react";
import { Clock, RefreshCw, CheckCircle2 } from "lucide-react";

const engagementMetrics = [
    {
        id: "immersion",
        label: "Avg. Immersion Time",
        value: "15m 47s",
        icon: <Clock className="w-5 h-5 text-yellow-500" />,
        color: "text-purple-600"
    },
    {
        id: "return",
        label: "Return Rate",
        value: "68%",
        icon: <RefreshCw className="w-5 h-5 text-red-500" />,
        color: "text-purple-600"
    },
    {
        id: "completion",
        label: "Session Completion",
        value: "72%",
        icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
        color: "text-purple-600"
    }
];

const focusAreas = [
    { label: "Mental Health", percentage: "37%", users: "9,200 Users" },
    { label: "Work & Career", percentage: "28%", users: "6,800 Users" },
    { label: "Academics & Learning", percentage: "18%", users: "4,500 Users" },
    { label: "Sports & Fitness", percentage: "11%", users: "2,200 Users" },
    { label: "Personal Growth", percentage: "6%", users: "1,200 Users" },
];

const UserEngagementMetrics: React.FC = () => {
    return (
        <div className="space-y-8 mt-12">
            {/* Top Focus Area Section */}
            <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-6">Top Focus Area</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {focusAreas.map((area, index) => (
                        <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center justify-center text-center space-y-2">
                            <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">{area.percentage}</span>
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{area.label}</span>
                            <span className="text-xs text-gray-400">{area.users}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* VR Immersion & Return Analytics Section */}
            <div className="bg-white dark:bg-gray-900 rounded-[32px] border border-purple-100/50 dark:border-purple-900/30 p-8 shadow-sm">
                <div className="mb-10">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">VR Immersion & Return Analytics</h3>
                    <p className="text-sm text-purple-600/80 dark:text-purple-400/80">Virtual reality engagement metrics</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {engagementMetrics.map((metric) => (
                        <div key={metric.id} className="bg-gray-50/50 dark:bg-gray-800/40 rounded-3xl p-8 border border-transparent hover:border-purple-100 dark:hover:border-purple-900/40 transition-all">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg">
                                    {metric.icon}
                                </div>
                                <span className="text-sm font-medium text-purple-600/90 dark:text-purple-400/90">{metric.label}</span>
                            </div>
                            <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                {metric.value}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserEngagementMetrics;
