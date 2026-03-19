import React from "react";
import { Users, Brain, LayoutList } from "lucide-react";

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    iconBg: string;
    iconColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, iconBg, iconColor }) => (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-[32px] border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-6 flex-1 hover:shadow-md transition-shadow">
        <div className={`w-14 h-14 rounded-2xl ${iconBg} flex items-center justify-center ${iconColor} shadow-theme-xs`}>
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</p>
            <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white">{value}</h3>
        </div>
    </div>
);

interface ValidationStatsProps {
    total: number;
    pendingMinds: number;
    pendingPlaylists: number;
    isLoading?: boolean;
}

const ValidationStats: React.FC<ValidationStatsProps> = ({ total, pendingMinds, pendingPlaylists, isLoading }) => {
    const display = (n: number) => isLoading ? '—' : n.toLocaleString();

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatCard
                icon={<Users className="w-7 h-7" />}
                label="Total Pending"
                value={display(total)}
                iconBg="bg-green-50 dark:bg-green-900/10"
                iconColor="text-green-500"
            />
            <StatCard
                icon={<Brain className="w-7 h-7" />}
                label="Pending Minds"
                value={display(pendingMinds)}
                iconBg="bg-purple-50 dark:bg-purple-900/10"
                iconColor="text-purple-500"
            />
            <StatCard
                icon={<LayoutList className="w-7 h-7" />}
                label="Pending Playlists"
                value={display(pendingPlaylists)}
                iconBg="bg-blue-50 dark:bg-blue-900/10"
                iconColor="text-blue-500"
            />
        </div>
    );
};


export default ValidationStats;
