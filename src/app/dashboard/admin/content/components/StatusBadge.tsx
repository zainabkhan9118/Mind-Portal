import React from 'react';
import { ContentStatus } from '../types';

interface StatusBadgeProps {
    status: ContentStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const getStyles = () => {
        switch (status) {
            case 'Published':
                return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800';
            case 'Scheduled':
                return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800';
            case 'Unpublished':
                return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700';
        }
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStyles()}`}>
            {status}
        </span>
    );
};

export default StatusBadge;
