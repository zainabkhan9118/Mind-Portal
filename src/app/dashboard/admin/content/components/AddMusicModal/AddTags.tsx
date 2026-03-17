import React, { useState } from "react";
import { X } from "lucide-react";

interface AddTagsProps {
    tags: string[];
    onTagsChange: (tags: string[]) => void;
}

const AddTags: React.FC<AddTagsProps> = ({ tags, onTagsChange }) => {
    const [inputValue, setInputValue] = useState("");

    const removeTag = (tagToRemove: string) => {
        onTagsChange(tags.filter(tag => tag !== tagToRemove));
    };

    const addTag = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            if (!tags.includes(inputValue.trim())) {
                onTagsChange([...tags, inputValue.trim()]);
            }
            setInputValue("");
        }
    };

    return (
        <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Add Tags
            </h3>
            <div className="relative flex items-center flex-wrap gap-2 min-h-[44px] w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900 px-3 py-1.5 shadow-theme-xs">
                {tags.map((tag, index) => (
                    <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300"
                    >
                        {tag}
                        <button onClick={() => removeTag(tag)} className="hover:text-purple-800 transition-colors">
                            <X className="w-3 h-3" />
                        </button>
                    </span>
                ))}
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={addTag}
                    placeholder={tags.length === 0 ? "Add tags..." : ""}
                    className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 dark:text-gray-200 min-w-[50px] placeholder:text-gray-400"
                />
            </div>
        </div>
    );
};

export default AddTags;