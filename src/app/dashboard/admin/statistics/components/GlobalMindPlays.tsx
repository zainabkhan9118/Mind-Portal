import React from 'react';
import { Music, Waves, Image as ImageIcon, Sun } from 'lucide-react';

const GlobalMindPlays: React.FC = () => {
    const items = [
        {
            title: "Deep Focus Flow",
            value: "1,420",
            trend: "↑ 15% vs last week",
            icon: <Music className="w-6 h-6 text-2xl" />,
            color: "from-purple-500 to-indigo-600" // Purple gradient
        },
        {
            title: "Ocean Calm",
            value: "1,285",
            trend: "↑ 23% vs last week",
            icon: <Waves className="w-6 h-6" />,
            color: "from-blue-500 to-cyan-400" // Blue/Cyan gradient
        },
        {
            title: "Cosmic Journey VR",
            value: "987",
            trend: "↑ 31% vs last week",
            icon: <ImageIcon className="w-6 h-6" />,
            color: "from-blue-500 to-purple-500" // Blue/Purple gradient
        },
        {
            title: "Morning Energy",
            value: "856",
            trend: "↑ 8% vs last week",
            icon: <Sun className="w-6 h-6" />,
            color: "from-cyan-400 to-blue-500" // Cyan/Blue gradient
        },
    ];

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Global Mind Plays</h3>
                <p className="text-sm text-purple-600 dark:text-purple-400">Most played content this week</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {items.map((item, index) => (
                    <div key={index} className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex items-center gap-5 hover:bg-white dark:hover:bg-gray-800 transition-colors group">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-300`}>
                            {item.icon}
                        </div>
                        <div className="flex flex-col gap-1">
                            <h4 className="text-base font-medium text-gray-900 dark:text-white">{item.title}</h4>
                            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{item.value}</p>
                            <p className="text-xs font-semibold text-green-500 flex items-center gap-1">
                                {item.trend}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GlobalMindPlays;
