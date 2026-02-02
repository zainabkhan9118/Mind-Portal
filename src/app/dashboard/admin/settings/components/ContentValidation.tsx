import React from "react";
import { CheckCircle, AlertCircle, Clock } from "lucide-react";

const ContentValidation: React.FC = () => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm animate-in fade-in duration-500">
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-full">
                    <CheckCircle className="w-12 h-12 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Content Quality Check</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                    All currently published contents have been validated against our quality standards. New items will appear here for review.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-gray-50 dark:border-gray-700">
                <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Pending</span>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">0</p>
                </div>
                <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Validated</span>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">1,284</p>
                </div>
                <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Flagged</span>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">2</p>
                </div>
            </div>
        </div>
    );
};

export default ContentValidation;
