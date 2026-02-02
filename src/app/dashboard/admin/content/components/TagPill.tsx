import React from 'react';

interface TagPillProps {
    tag: string;
}

const TagPill: React.FC<TagPillProps> = ({ tag }) => {
    return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 border border-purple-100 dark:border-purple-800">
            {tag}
        </span>
    );
};

export default TagPill;
