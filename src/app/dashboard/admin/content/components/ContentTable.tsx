import React, { useState } from 'react';
import {
    MoreHorizontal,
    Trash2,
    Music,
    SlidersHorizontal,
    CloudUpload
} from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { ContentItem, EnvironmentSoundItem, MindSessionItem, EnvironmentVisualItem } from '../types';
import StatusBadge from './StatusBadge';
import TagPill from './TagPill';
import FileUploadIcon from './FileUploadIcon';

interface ContentTableProps {
    activeTab: string;
    data: (ContentItem | EnvironmentSoundItem | MindSessionItem | EnvironmentVisualItem)[];
}

const ContentTable: React.FC<ContentTableProps> = ({ activeTab, data }) => {
    const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

    const toggleSelectAll = () => {
        if (selectedItems.size === data.length) {
            setSelectedItems(new Set());
        } else {
            setSelectedItems(new Set(data.map(item => item.id)));
        }
    };

    const toggleSelectItem = (id: number) => {
        const newSelected = new Set(selectedItems);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedItems(newSelected);
    };

    const getAccessBadgeColor = (access: string) => {
        switch (access) {
            case 'Premium':
                return 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800';
            default:
                return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800';
        }
    };

    return (
        <div className="overflow-x-auto">
            <Table className="w-full text-left border-collapse">
                <TableHeader className="border-b border-gray-100 dark:border-gray-700">
                    <TableRow>
                        <TableCell isHeader className="p-4 w-10">
                            <input
                                type="checkbox"
                                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                checked={data.length > 0 && selectedItems.size === data.length}
                                onChange={toggleSelectAll}
                            />
                        </TableCell>
                        <TableCell isHeader className="p-4 text-xs font-semibold text-gray-500 tracking-wider">ID</TableCell>
                        <TableCell isHeader className="p-4 text-xs font-semibold text-gray-500 tracking-wider">
                            <div className="flex items-center gap-1 cursor-pointer">
                                Title
                                <SlidersHorizontal className="w-3 h-3 rotate-90" />
                            </div>
                        </TableCell>

                        {/* Tab Specific Columns */}
                        {activeTab === "Music" && (
                            <>
                                <TableCell isHeader className="p-4 text-xs font-semibold text-gray-500 tracking-wider">Artist</TableCell>
                                <TableCell isHeader className="p-4 text-xs font-semibold text-gray-500 tracking-wider">URL</TableCell>
                            </>
                        )}
                        {activeTab === "Environment Sound" && (
                            <>
                                <TableCell isHeader className="p-4 text-xs font-semibold text-gray-500 tracking-wider">Category</TableCell>
                                <TableCell isHeader className="p-4 text-xs font-semibold text-gray-500 tracking-wider">Frequency</TableCell>
                                <TableCell isHeader className="p-4 text-xs font-semibold text-gray-500 tracking-wider">Type</TableCell>
                                <TableCell isHeader className="p-4 text-xs font-semibold text-gray-500 tracking-wider">Goal</TableCell>
                                <TableCell isHeader className="p-4 text-xs font-semibold text-gray-500 tracking-wider">Details</TableCell>
                            </>
                        )}
                        {activeTab === "Mind Sessions" && (
                            <>
                                <TableCell isHeader className="p-4 text-xs font-semibold text-gray-500 tracking-wider">Category</TableCell>
                                <TableCell isHeader className="p-4 text-xs font-semibold text-gray-500 tracking-wider">Voice</TableCell>
                                <TableCell isHeader className="p-4 text-xs font-semibold text-gray-500 tracking-wider">Duration</TableCell>
                                <TableCell isHeader className="p-4 text-xs font-semibold text-gray-500 tracking-wider">Goal</TableCell>
                                <TableCell isHeader className="p-4 text-xs font-semibold text-gray-500 tracking-wider">Details</TableCell>
                            </>
                        )}
                        {activeTab === "Environment Visual" && (
                            <>
                                <TableCell isHeader className="p-4 text-xs font-semibold text-gray-500 tracking-wider">Category</TableCell>
                                <TableCell isHeader className="p-4 text-xs font-semibold text-gray-500 tracking-wider">Author</TableCell>
                                <TableCell isHeader className="p-4 text-xs font-semibold text-gray-500 tracking-wider">Goal</TableCell>
                                <TableCell isHeader className="p-4 text-xs font-semibold text-gray-500 tracking-wider">Details</TableCell>
                            </>
                        )}

                        <TableCell isHeader className="p-4 text-xs font-semibold text-gray-500 tracking-wider">Status</TableCell>
                        <TableCell isHeader className="p-4 text-xs font-semibold text-gray-500 tracking-wider">Access Type</TableCell>

                        {/* New Columns */}
                        <TableCell isHeader className="p-4 text-xs font-semibold text-gray-500 tracking-wider">File Upload</TableCell>
                        <TableCell isHeader className="p-4 text-xs font-semibold text-gray-500 tracking-wider">Tags</TableCell>

                        {(activeTab === "Environment Sound" || activeTab === "Mind Sessions" || activeTab === "Environment Visual") && (
                            <TableCell isHeader className="p-4 text-xs font-semibold text-gray-500 tracking-wider">URL</TableCell>
                        )}
                        <TableCell isHeader className="p-4 text-xs font-semibold text-gray-500 tracking-wider text-right">Actions</TableCell>
                    </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-gray-50 dark:divide-gray-700">
                    {data.map((item) => (
                        <TableRow key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                            <TableCell className="p-4 text-center">
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                    checked={selectedItems.has(item.id)}
                                    onChange={() => toggleSelectItem(item.id)}
                                />
                            </TableCell>
                            <TableCell className="p-4 text-xs text-gray-500">
                                {item.id < 10 ? `0${item.id}` : item.id}
                            </TableCell>
                            <TableCell className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 group-hover:bg-white group-hover:text-purple-600 transition-colors">
                                        {'icon' in item ? (item.icon) : <Music className="w-4 h-4" />}
                                    </div>
                                    <span className="font-medium text-gray-900 dark:text-white whitespace-nowrap">{item.title}</span>
                                </div>
                            </TableCell>

                            {/* Tab Specific Cells */}
                            {activeTab === "Music" && (
                                <>
                                    <TableCell className="p-4 text-sm text-gray-600 dark:text-gray-300">{(item as ContentItem).artist}</TableCell>
                                    <TableCell className="p-4 text-sm text-gray-500 dark:text-gray-400 font-mono">{(item as ContentItem).url}</TableCell>
                                </>
                            )}
                            {activeTab === "Environment Sound" && (
                                <>
                                    <TableCell className="p-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">{(item as EnvironmentSoundItem).category}</TableCell>
                                    <TableCell className="p-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">{(item as EnvironmentSoundItem).frequency}</TableCell>
                                    <TableCell className="p-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">{(item as EnvironmentSoundItem).type}</TableCell>
                                    <TableCell className="p-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">{(item as EnvironmentSoundItem).goal}</TableCell>
                                    <TableCell className="p-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">{(item as EnvironmentSoundItem).details}</TableCell>
                                </>
                            )}
                            {activeTab === "Mind Sessions" && (
                                <>
                                    <TableCell className="p-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">{(item as MindSessionItem).category}</TableCell>
                                    <TableCell className="p-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">{(item as MindSessionItem).voice}</TableCell>
                                    <TableCell className="p-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">{(item as MindSessionItem).duration}</TableCell>
                                    <TableCell className="p-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">{(item as MindSessionItem).goal}</TableCell>
                                    <TableCell className="p-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">{(item as MindSessionItem).details}</TableCell>
                                </>
                            )}
                            {activeTab === "Environment Visual" && (
                                <>
                                    <TableCell className="p-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">{(item as EnvironmentVisualItem).category}</TableCell>
                                    <TableCell className="p-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">{(item as EnvironmentVisualItem).author}</TableCell>
                                    <TableCell className="p-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">{(item as EnvironmentVisualItem).goal}</TableCell>
                                    <TableCell className="p-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">{(item as EnvironmentVisualItem).details}</TableCell>
                                </>
                            )}

                            <TableCell className="p-4">
                                <StatusBadge status={item.status} />
                            </TableCell>
                            <TableCell className="p-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getAccessBadgeColor(item.accessType)}`}>
                                    {item.accessType}
                                </span>
                            </TableCell>

                            {/* New Column Cells */}
                            <TableCell className="p-4">
                                <FileUploadIcon status={item.uploadStatus} />
                            </TableCell>
                            <TableCell className="p-4">
                                <div className="flex flex-wrap gap-1.5 min-w-[120px]">
                                    {item.tags.map((tag, idx) => (
                                        <TagPill key={idx} tag={tag} />
                                    ))}
                                </div>
                            </TableCell>

                            {(activeTab === "Environment Sound" || activeTab === "Mind Sessions" || activeTab === "Environment Visual") && (
                                <TableCell className="p-4 text-sm text-[#9810FA] whitespace-nowrap">Link</TableCell>
                            )}

                            <TableCell className="p-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full border border-gray-300 dark:border-gray-600 text-gray-400 hover:text-gray-600 transition-colors">
                                        <MoreHorizontal className="w-5 h-5" />
                                    </button>
                                    <button className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md text-gray-400 hover:text-red-600 transition-colors">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default ContentTable;
