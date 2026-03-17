import React, { useState } from 'react';
import { User as UserIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import type { ApiUser } from '@/lib/api/types';

interface UserTableProps {
    users: ApiUser[];
    onSwitchExpert: (user: ApiUser) => void;
    currentPage: number;
    totalCount: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const PAGE_SIZE = 10;

const UserTable: React.FC<UserTableProps> = ({
    users,
    onSwitchExpert,
    currentPage,
    totalCount,
    totalPages,
    onPageChange,
}) => {
    const [selectedUsers, setSelectedUsers] = useState<Set<number>>(new Set());

    const toggleSelectAll = () => {
        if (selectedUsers.size === users.length) {
            setSelectedUsers(new Set());
        } else {
            setSelectedUsers(new Set(users.map((u) => u.id)));
        }
    };

    const toggleSelectUser = (id: number) => {
        const newSelected = new Set(selectedUsers);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedUsers(newSelected);
    };

    const getAccessBadgeColor = (isPremium: boolean) =>
        isPremium
            ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
            : 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'suspended': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'banned': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const startItem = totalCount === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
    const endItem = Math.min(currentPage * PAGE_SIZE, totalCount);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <Table className="min-w-full">
                    <TableHeader className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                        <TableRow>
                            <TableCell isHeader className="w-12 px-6 py-4">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                    checked={users.length > 0 && selectedUsers.size === users.length}
                                    onChange={toggleSelectAll}
                                />
                            </TableCell>
                            <TableCell isHeader className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">Name</TableCell>
                            <TableCell isHeader className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">Email</TableCell>
                            <TableCell isHeader className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">Joined</TableCell>
                            <TableCell isHeader className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">Access</TableCell>
                            <TableCell isHeader className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">Status</TableCell>
                            <TableCell isHeader className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">Action</TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.length === 0 && (
                            <TableRow>
                                <td colSpan={7} className="px-6 py-16 text-center text-sm text-gray-400">
                                    No users found
                                </td>
                            </TableRow>
                        )}
                        {users.map((user) => {
                            const displayName = [user.first_name, user.last_name].filter(Boolean).join(' ') || user.email;
                            const rawDate = user.date_joined ?? user.created_at;
                            const joinedDate = rawDate
                                ? new Date(rawDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                : '—';

                            return (
                                <TableRow key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0">
                                    <TableCell className="px-6 py-4">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                            checked={selectedUsers.has(user.id)}
                                            onChange={() => toggleSelectUser(user.id)}
                                        />
                                    </TableCell>
                                    <TableCell className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {user.avatar ? (
                                                <img src={user.avatar} alt={displayName} className="w-8 h-8 rounded-full object-cover" />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500">
                                                    <UserIcon className="w-4 h-4" />
                                                </div>
                                            )}
                                            <span className="text-sm font-medium text-gray-900 dark:text-white">{displayName}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 py-4">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">{user.email}</span>
                                    </TableCell>
                                    <TableCell className="px-6 py-4">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">{joinedDate}</span>
                                    </TableCell>
                                    <TableCell className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAccessBadgeColor(user.is_premium)}`}>
                                            {user.is_premium ? 'Premium' : 'Free'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusBadgeColor(user.status)}`}>
                                            {user.status}
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
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    Showing <span className="font-medium">{startItem}–{endItem}</span> of{' '}
                    <span className="font-medium">{totalCount}</span> users
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-sm text-gray-700 dark:text-gray-300 px-2">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserTable;
