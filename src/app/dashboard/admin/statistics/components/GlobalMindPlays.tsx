"use client";
import { useEffect, useState } from 'react';
import { Music, Waves, Image as ImageIcon, Sun, Mic } from 'lucide-react';
import analyticsApi from '@/lib/api/analyticsApi';
import type { TrendingContent } from '@/lib/api/types';

const TYPE_ICON: Record<string, React.ReactNode> = {
    music: <Music className="w-6 h-6" />,
    env_sound: <Waves className="w-6 h-6" />,
    env_visual: <ImageIcon className="w-6 h-6" />,
    guided_session: <Mic className="w-6 h-6" />,
};

const TYPE_COLOR: Record<string, string> = {
    music: 'from-purple-500 to-indigo-600',
    env_sound: 'from-blue-500 to-cyan-400',
    env_visual: 'from-blue-500 to-purple-500',
    guided_session: 'from-cyan-400 to-blue-500',
};

const GlobalMindPlays: React.FC = () => {
    const [trending, setTrending] = useState<TrendingContent[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        analyticsApi.getTrending()
            .then((data) => setTrending(data.slice(0, 4)))
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, []);

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Global Mind Plays</h3>
                <p className="text-sm text-purple-600 dark:text-purple-400">Trending content this week</p>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex items-center gap-5 animate-pulse">
                            <div className="w-16 h-16 rounded-2xl bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : trending.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">No trending content available</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {trending.map((item) => {
                        const velocity = item.velocity ?? 0;
                        const trendLabel = velocity > 0 ? `↑ ${velocity.toFixed(0)}% vs last week` : `${velocity.toFixed(0)}% vs last week`;
                        return (
                            <div key={item.content_id} className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex items-center gap-5 hover:bg-white dark:hover:bg-gray-800 transition-colors group">
                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${TYPE_COLOR[item.type] ?? 'from-purple-500 to-indigo-600'} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-300 flex-shrink-0`}>
                                    {TYPE_ICON[item.type] ?? <Sun className="w-6 h-6" />}
                                </div>
                                <div className="flex flex-col gap-1 min-w-0">
                                    <h4 className="text-base font-medium text-gray-900 dark:text-white truncate">{item.title}</h4>
                                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                        {(item.plays ?? 0).toLocaleString()}
                                    </p>
                                    <p className={`text-xs font-semibold flex items-center gap-1 ${velocity >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        {trendLabel}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default GlobalMindPlays;
