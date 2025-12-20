"use client";
import React from 'react';
import { Search, ChevronDown, Music, CloudRain, Trees, Waves, CloudLightning, Flame, Wind, Crown } from 'lucide-react';

interface RankingItem {
    rank: number;
    title: string;
    icon: React.ReactNode;
    plays: string;
    growth: string;
    type: string;
}

const rankingData: RankingItem[] = [
    { rank: 1, title: 'White Noise', icon: <Waves className="w-4 h-4" />, plays: '1.4k', growth: '+5.3%', type: 'Music' },
    { rank: 2, title: 'Rainfall', icon: <CloudRain className="w-4 h-4" />, plays: '67.0K', growth: '+5.3%', type: 'Music' },
    { rank: 3, title: 'Forest Birds', icon: <Trees className="w-4 h-4" />, plays: '67.0K', growth: '+5.3%', type: '360' },
    { rank: 4, title: 'Ocean Waves', icon: <Waves className="w-4 h-4" />, plays: '786', growth: '-3%', type: 'Music' },
    { rank: 5, title: 'Thunderstorm', icon: <CloudLightning className="w-4 h-4" />, plays: '987', growth: '+5.3%', type: 'Sound' },
    { rank: 6, title: 'Crackling Fire', icon: <Flame className="w-4 h-4" />, plays: '123', growth: '+5.3%', type: 'VR' },
    { rank: 7, title: 'Mountain Wind', icon: <Wind className="w-4 h-4" />, plays: '54', growth: '-3%', type: 'Sound' },
    { rank: 8, title: 'Ocean Breeze', icon: <Waves className="w-4 h-4" />, plays: '1.7k', growth: '+5.3%', type: 'Free' },
    { rank: 9, title: 'City Night', icon: <Crown className="w-4 h-4" />, plays: '23.78k', growth: '-3%', type: 'Sound' },
    { rank: 10, title: 'Jungle Rain', icon: <CloudRain className="w-4 h-4" />, plays: '456', growth: '-3%', type: '360' },
    { rank: 11, title: 'Ding dong Bell', icon: <Music className="w-4 h-4" />, plays: '342', growth: '+5.3%', type: 'VR' },
];

const TopRankingsTable: React.FC = () => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            {/* Filters */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row gap-4 justify-end items-center">
                <div className="relative w-full md:w-80">
                    <input
                        type="text"
                        placeholder="Search here"
                        className="w-full pl-4 pr-10 py-2.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>

                <div className="flex gap-2">
                    {['Type', 'Title', 'Play'].map((filter) => (
                        <button key={filter} className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            {filter}
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-900/50">
                        <tr>
                            <th className="p-4 w-12">
                                <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                            </th>
                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rank</th>
                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Plays</th>
                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Growth</th>
                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Type</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {rankingData.map((item) => (
                            <tr key={item.rank} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                <td className="p-4">
                                    <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                                </td>
                                <td className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {item.rank < 10 ? `0${item.rank}` : item.rank}
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500">
                                            {item.icon}
                                        </div>
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-sm text-gray-600 dark:text-gray-300 font-medium">
                                    {item.plays}
                                </td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${item.growth.startsWith('+')
                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                                        : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                                        }`}>
                                        {item.growth.startsWith('+') ? '↗' : '↘'} {item.growth}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${item.type === 'Music' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800' :
                                        item.type === 'Sound' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' :
                                            item.type === 'VR' ? 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800' :
                                                item.type === '360' ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800' :
                                                    'bg-gray-100 text-gray-700 border-gray-200'
                                        }`}>
                                        {item.type}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TopRankingsTable;
