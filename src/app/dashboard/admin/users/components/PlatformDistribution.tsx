import React from 'react';

const PlatformDistribution: React.FC = () => {
    const platforms = [
        { name: 'Mobile Users', value: 16720, percentage: 68, color: 'bg-purple-600' },
        { name: 'VR Users', value: 7869, percentage: 32, color: 'bg-blue-600' },
    ];

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm h-full flex flex-col justify-center">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-6">
                Platform Distribution
            </h3>
            <div className="space-y-8">
                {platforms.map((platform) => (
                    <div key={platform.name}>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">{platform.name}</span>
                            <span className="text-sm text-gray-900 dark:text-white font-medium">
                                {platform.value.toLocaleString()} <span className="text-gray-400">({platform.percentage}%)</span>
                            </span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3">
                            <div
                                className={`${platform.color} h-3 rounded-full`}
                                style={{ width: `${platform.percentage}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlatformDistribution;
