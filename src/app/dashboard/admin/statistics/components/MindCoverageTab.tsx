"use client";
import React from 'react';
import { Target } from 'lucide-react';

const MindCoverageTab: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center py-24 text-center animate-in fade-in duration-500">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4">
                <Target className="w-7 h-7" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Mind Coverage</h2>
            <p className="text-sm text-gray-400 mt-1">Coming soon.</p>
        </div>
    );
};

export default MindCoverageTab;
