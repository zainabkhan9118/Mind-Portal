import React from "react";
import { Eye, Music2, Brain } from "lucide-react";

export interface ValidationItemData {
    id: string;
    type: "mind" | "playlist";
    title: string;
    description: string;
    creator: string;
    itemCount: number;
    createdAt: string;
    status: "Pending" | "Reviewing" | "Completed";
    category?: string;
}

interface ValidationItemProps {
    item: ValidationItemData;
    onReview?: (item: ValidationItemData) => void;
}

const ValidationItem: React.FC<ValidationItemProps> = ({ item, onReview }) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-[24px] border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between group hover:border-purple-200 dark:hover:border-purple-900/40 transition-all">
            <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0 mt-1">
                    {item.type === "mind" ? <Brain className="w-6 h-6" /> : <Music2 className="w-6 h-6" />}
                </div>
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white">{item.title}</h4>
                        <div className="flex gap-2">
                            <span className="px-2.5 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold rounded-lg uppercase tracking-wide">
                                {item.status}
                            </span>
                            {item.category && (
                                <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400 text-[10px] font-bold rounded-lg uppercase tracking-wide">
                                    {item.category}
                                </span>
                            )}
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl line-clamp-2">
                        {item.description}
                    </p>
                    <div className="flex items-center gap-4 pt-2 text-xs text-gray-500 dark:text-gray-400 font-medium">
                        <span>
                            Creator: <span className="text-gray-900 dark:text-gray-100 font-bold">{item.creator}</span>
                        </span>
                        <span className="text-gray-300 dark:text-gray-600">•</span>
                        <span>{item.itemCount} items</span>
                        <span className="text-gray-300 dark:text-gray-600">•</span>
                        <span>Created: {item.createdAt}</span>
                    </div>
                </div>
            </div>

            <button
                onClick={() => onReview?.(item)}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#9810FA] text-white rounded-xl text-sm font-bold hover:bg-[#8000E0] shadow-xl shadow-purple-500/20 transition-all shrink-0"
            >
                <Eye className="w-4 h-4" />
                Review
            </button>
        </div>
    );
};


export default ValidationItem;
