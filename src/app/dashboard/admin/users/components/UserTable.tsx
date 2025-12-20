import React, { useState } from 'react';
import { User } from '../types';
import { MoreVertical, User as UserIcon } from 'lucide-react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';

interface UserTableProps {
    users: User[];
    onSwitchExpert: (user: User) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, onSwitchExpert }) => {
    const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());

    const toggleSelectAll = () => {
        if (selectedUsers.size === users.length) {
            setSelectedUsers(new Set());
        } else {
            setSelectedUsers(new Set(users.map(u => u.id)));
        }
    };

    const toggleSelectUser = (id: string) => {
        const newSelected = new Set(selectedUsers);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedUsers(newSelected);
    };

    const getAccessBadgeColor = (access: string) => {
        switch (access) {
            case 'Premium': return 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400';
            default: return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
        }
    };

    const getTypeBadgeColor = (type: string) => {
        switch (type) {
            case 'Music': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
            case '360': return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
            case 'VR': return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'Sound': return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <Table className="min-w-full">
                    <TableHeader className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                        <TableRow>
                            <TableCell isHeader className="w-12 px-6 py-4">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 rounded bg-gray-50"
                                    checked={users.length > 0 && selectedUsers.size === users.length}
                                    onChange={toggleSelectAll}
                                />
                            </TableCell>
                            <TableCell isHeader className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">Name</TableCell>
                            <TableCell isHeader className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">Email</TableCell>
                            <TableCell isHeader className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">Joined</TableCell>
                            <TableCell isHeader className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">Access</TableCell>
                            <TableCell isHeader className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">Type</TableCell>
                            <TableCell isHeader className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">Action</TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0">
                                <TableCell className="px-6 py-4">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 rounded bg-gray-50"
                                        checked={selectedUsers.has(user.id)}
                                        onChange={() => toggleSelectUser(user.id)}
                                    />
                                </TableCell>
                                <TableCell className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        {/* Placeholder Avatar */}
                                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500">
                                            <UserIcon className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="px-6 py-4">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">{user.email}</span>
                                </TableCell>
                                <TableCell className="px-6 py-4">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">{user.joined}</span>
                                </TableCell>
                                <TableCell className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAccessBadgeColor(user.access)}`}>
                                        {user.access}
                                    </span>
                                </TableCell>
                                <TableCell className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeBadgeColor(user.type)}`}>
                                        {user.type}
                                    </span>
                                </TableCell>
                                <TableCell className="px-6 py-4">
                                    <button
                                        onClick={() => onSwitchExpert(user)}
                                        className="flex items-center gap-1.5 text-xs font-medium text-purple-600 hover:text-purple-800 transition-colors"
                                    >
                                        <span className="w-4 h-4 rounded-full border border-purple-600 flex items-center justify-center text-[10px]">
                                            ⚡
                                        </span>
                                        Switch to Mind Expert
                                    </button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            {/* Pagination Placeholder */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    Showing 1-10 of {users.length * 5} results
                </div>
                <div className="flex gap-2">
                    <button className="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-50">Previous</button>
                    <button className="px-3 py-1 text-sm border border-gray-200 rounded-lg bg-gray-50">Next</button>
                </div>
            </div>
        </div>
    );
};

export default UserTable;
