import React from 'react';

const TopGoals: React.FC = () => {
    const goals = [
        { name: 'Sleep', value: 8900, max: 10000, color: 'bg-purple-600' },
        { name: 'Relax', value: 7400, max: 10000, color: 'bg-purple-600' },
        { name: 'Focus', value: 4900, max: 10000, color: 'bg-purple-600' },
        { name: 'Motivation', value: 2100, max: 10000, color: 'bg-purple-600' },
        { name: 'Other', value: 1289, max: 10000, color: 'bg-purple-600' },
    ];

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm h-full">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-6">
                Top Goals
            </h3>
            <div className="space-y-6">
                {goals.map((goal) => (
                    <div key={goal.name}>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">{goal.name}</span>
                            <span className="text-sm text-gray-900 dark:text-white font-bold">{goal.value.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5">
                            <div
                                className={`${goal.color} h-2.5 rounded-full`}
                                style={{ width: `${(goal.value / goal.max) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopGoals;
