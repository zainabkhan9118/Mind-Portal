import React from "react";
import { ArrowUpRight } from "lucide-react";

interface StatsCardProps {
    icon: React.ReactNode;
    iconBgClass: string;
    iconColorClass: string;
    title: string;
    value: string;
    /** When provided, renders as a green "+X% {changeSuffix}" trend line instead of the plain subtitle. */
    change?: number | null;
    changeSuffix?: string;
    subtitle: string;
}

export default function StatsCard({
    icon,
    iconBgClass,
    iconColorClass,
    title,
    value,
    change,
    changeSuffix,
    subtitle,
}: StatsCardProps) {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between h-full min-h-[160px]">
            <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${iconBgClass} ${iconColorClass}`}>
                    {icon}
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</h3>
                </div>
            </div>
            {change != null ? (
                <div className="flex items-center gap-1 text-sm font-medium text-[#22AD5C]">
                    <ArrowUpRight className="w-4 h-4" />
                    <span>+{change.toFixed(1)}% {changeSuffix}</span>
                </div>
            ) : (
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{subtitle}</div>
            )}
        </div>
    );
}
