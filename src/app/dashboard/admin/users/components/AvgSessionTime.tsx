import React from 'react';

const AvgSessionTime: React.FC = () => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm h-full flex flex-col justify-between items-center text-center">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 self-start">
                Average Session Time
            </h3>
            <div className="flex-1 flex flex-col justify-center items-center">
                <h1 className="text-5xl font-bold text-purple-600 dark:text-purple-400 mb-2">42:35</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">minutes per user</p>
            </div>
            <div className="text-sm font-semibold text-green-500 mt-4">
                +15.3% from last month
            </div>
        </div>
    );
};

export default AvgSessionTime;
