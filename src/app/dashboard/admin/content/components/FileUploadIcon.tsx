import React from 'react';
import { CloudUpload } from 'lucide-react';
import { UploadStatus } from '../types';

interface FileUploadIconProps {
    status: UploadStatus;
}

const FileUploadIcon: React.FC<FileUploadIconProps> = ({ status }) => {
    return (
        <div className={`p-1.5 rounded-lg flex items-center justify-center ${status === 'Uploaded'
                ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                : 'bg-gray-50 text-gray-400 dark:bg-gray-800 dark:text-gray-500'
            }`}>
            <CloudUpload className="w-5 h-5" />
        </div>
    );
};

export default FileUploadIcon;
