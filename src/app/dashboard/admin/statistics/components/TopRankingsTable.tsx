import React, { useState } from "react";
import {
    Search,
    ChevronDown,
    AudioWaveform,
    CloudRain,
    Trees,
    Waves,
    CloudLightning,
    Flame,
    Wind,
    Sparkles,
    Bell,
    ArrowUpRight,
    ArrowDownRight,
    ArrowUpDown
} from "lucide-react";

interface RankingItem {
    rank: string;
    title: string;
    icon: React.ReactNode;
    retention: number;
    sessionAvg: string;
    avgTimeSpent: string;
    plays: string;
    growth: string;
    growthType: "increase" | "decrease";
    type: string;
}

const rankingData: RankingItem[] = [
    { rank: "01", title: "White Noise", icon: <AudioWaveform className="w-5 h-5" />, retention: 78, sessionAvg: "1.4k", avgTimeSpent: "1.4k", plays: "1.4k", growth: "+5.3%", growthType: "increase", type: "Music" },
    { rank: "02", title: "Rainfall", icon: <CloudRain className="w-5 h-5" />, retention: 78, sessionAvg: "67.0K", avgTimeSpent: "67.0K", plays: "67.0K", growth: "+5.3%", growthType: "increase", type: "Music" },
    { rank: "03", title: "Forest Birds", icon: <Trees className="w-5 h-5" />, retention: 68, sessionAvg: "67.0K", avgTimeSpent: "67.0K", plays: "67.0K", growth: "+5.3%", growthType: "increase", type: "360" },
    { rank: "04", title: "Ocean Waves", icon: <Waves className="w-5 h-5" />, retention: 78, sessionAvg: "786", avgTimeSpent: "786", plays: "786", growth: "-3%", growthType: "decrease", type: "Music" },
    { rank: "05", title: "Thunderstorm", icon: <CloudLightning className="w-5 h-5" />, retention: 88, sessionAvg: "987", avgTimeSpent: "987", plays: "987", growth: "+5.3%", growthType: "increase", type: "Sound" },
    { rank: "06", title: "Crackling Fire", icon: <Flame className="w-5 h-5" />, retention: 78, sessionAvg: "123", avgTimeSpent: "123", plays: "123", growth: "+5.3%", growthType: "increase", type: "VR" },
    { rank: "07", title: "Mountain Wind", icon: <Wind className="w-5 h-5" />, retention: 78, sessionAvg: "54", avgTimeSpent: "54", plays: "54", growth: "-3%", growthType: "decrease", type: "Sound" },
    { rank: "08", title: "Ocean Breeze", icon: <Wind className="w-5 h-5" />, retention: 88, sessionAvg: "1.7k", avgTimeSpent: "1.7k", plays: "1.7k", growth: "+5.3%", growthType: "increase", type: "Free" },
    { rank: "09", title: "City Night", icon: <Sparkles className="w-5 h-5" />, retention: 88, sessionAvg: "23.78k", avgTimeSpent: "23.78k", plays: "23.78k", growth: "-3%", growthType: "decrease", type: "Sound" },
    { rank: "10", title: "Jungle Rain", icon: <CloudRain className="w-5 h-5" />, retention: 88, sessionAvg: "456", avgTimeSpent: "456", plays: "456", growth: "-3%", growthType: "decrease", type: "360" },
    { rank: "11", title: "Ding dong Bell", icon: <Bell className="w-5 h-5" />, retention: 78, sessionAvg: "342", avgTimeSpent: "342", plays: "342", growth: "+5.3%", growthType: "increase", type: "VR" },
];

const TopRankingsTable: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const getBadgeStyle = (type: string) => {
        switch (type) {
            case "Music": return "bg-blue-50 text-blue-500 dark:bg-blue-900/20 dark:text-blue-400";
            case "360": return "bg-purple-50 text-purple-500 dark:bg-purple-900/20 dark:text-purple-400";
            case "Sound": return "bg-green-50 text-green-500 dark:bg-green-900/20 dark:text-green-400";
            case "VR": return "bg-orange-50 text-orange-400 dark:bg-orange-900/20 dark:text-orange-400";
            case "Free": return "bg-indigo-50 text-indigo-400 dark:bg-indigo-900/20 dark:text-indigo-400";
            default: return "bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400";
        }
    };

    return (
        <div className="space-y-4">
            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row justify-end items-center gap-4">
                <div className="relative w-full md:w-80">
                    <input
                        type="text"
                        placeholder="Search here"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-6 pr-10 py-3 rounded-full border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 placeholder:text-gray-400"
                    />
                    <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-4 px-6 py-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 transition-all">
                        Time
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                    <button className="flex items-center gap-4 px-6 py-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 transition-all">
                        Analysis
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-50 dark:border-gray-800">
                                <th className="px-6 py-4 w-12">
                                    <input type="checkbox" className="w-5 h-5 rounded border-gray-200 text-purple-600 focus:ring-purple-500 cursor-pointer" />
                                </th>
                                <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Rank</th>
                                <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-gray-600">
                                        Title <ArrowUpDown className="w-3 h-3" />
                                    </div>
                                </th>
                                <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Retention</th>
                                <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Session Avg</th>
                                <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Avg Time Spent</th>
                                <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Plays</th>
                                <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Growth</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Type</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                            {rankingData.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <input type="checkbox" className="w-5 h-5 rounded border-gray-200 text-purple-600 focus:ring-purple-500 cursor-pointer" />
                                    </td>
                                    <td className="px-4 py-4 text-sm font-bold text-gray-900 dark:text-white">
                                        {item.rank}
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="text-gray-900 dark:text-gray-300">
                                                {item.icon}
                                            </div>
                                            <span className="text-sm font-semibold text-gray-900 dark:text-white">{item.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-3 min-w-[120px]">
                                            <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-emerald-400 rounded-full"
                                                    style={{ width: `${item.retention}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-bold text-gray-700 dark:text-gray-300 w-8">{item.retention}%</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                                        {item.sessionAvg}
                                    </td>
                                    <td className="px-4 py-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                                        {item.avgTimeSpent}
                                    </td>
                                    <td className="px-4 py-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                                        {item.plays}
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold gap-0.5 ${item.growthType === "increase"
                                                ? "bg-emerald-50 text-emerald-500 dark:bg-emerald-900/20 dark:text-emerald-400"
                                                : "bg-rose-50 text-rose-400 dark:bg-rose-900/20 dark:text-rose-400"
                                            }`}>
                                            {item.growthType === "increase" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                            {item.growth}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-bold tracking-wide ${getBadgeStyle(item.type)}`}>
                                            {item.type}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TopRankingsTable;
