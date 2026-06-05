'use client';
import React, { useState, useEffect } from 'react';
import UsersFilter from './UsersFilter';
import UserTable from './UserTable';
import SwitchExpertModal from './SwitchExpertModal';
import UserActionModal from './UserActionModal';
import { usersApi } from '@/lib/api';
import type { ApiUser, UserStatus } from '@/lib/api/types';

const PAGE_SIZE = 10;

const RecentUsers: React.FC = () => {
    const [searchInput, setSearchInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [ordering, setOrdering] = useState('');

    const [users, setUsers] = useState<ApiUser[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [refreshKey, setRefreshKey] = useState(0);

    // Switch to Mind Expert modal
    const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<ApiUser | null>(null);
    const [isSwitching, setIsSwitching] = useState(false);
    const [switchError, setSwitchError] = useState<string | null>(null);

    // Status change modal
    const [isActionModalOpen, setIsActionModalOpen] = useState(false);
    const [pendingStatus, setPendingStatus] = useState<UserStatus>('active');
    const [isChangingStatus, setIsChangingStatus] = useState(false);
    const [statusChangeError, setStatusChangeError] = useState<string | null>(null);

    // Debounce search input by 400ms
    useEffect(() => {
        const timer = setTimeout(() => setSearchQuery(searchInput), 400);
        return () => clearTimeout(timer);
    }, [searchInput]);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, statusFilter, ordering]);

    // Fetch users — cancelled flag prevents stale responses from overwriting newer results
    useEffect(() => {
        let cancelled = false;
        setIsLoading(true);

        usersApi.getUsers({
            search: searchQuery || undefined,
            status: (statusFilter as UserStatus) || undefined,
            ordering: ordering || undefined,
            page: currentPage,
            size: PAGE_SIZE,
        }).then(res => {
            if (cancelled) return;
            setUsers(res.results ?? []);
            setTotalCount(res.count);
            setTotalPages(res.pages_count ?? Math.ceil(res.count / PAGE_SIZE));
            setIsLoading(false);
        }).catch(err => {
            if (cancelled) return;
            console.error('Failed to fetch users:', err);
            setUsers([]);
            setIsLoading(false);
        });

        return () => { cancelled = true; };
    }, [searchQuery, statusFilter, ordering, currentPage, refreshKey]);

    const handleSwitchExpert = (user: ApiUser) => {
        setSelectedUser(user);
        setSwitchError(null);
        setIsSwitchModalOpen(true);
    };

    const handleConfirmSwitch = async () => {
        if (!selectedUser) return;
        setIsSwitching(true);
        setSwitchError(null);
        try {
            await usersApi.switchToMindExpert(selectedUser.id);
            setIsSwitchModalOpen(false);
            setSelectedUser(null);
            setRefreshKey(k => k + 1);
        } catch {
            setSwitchError('Failed to switch user. Please try again.');
        } finally {
            setIsSwitching(false);
        }
    };

    const handleStatusChange = (user: ApiUser, status: UserStatus) => {
        setSelectedUser(user);
        setPendingStatus(status);
        setStatusChangeError(null);
        setIsActionModalOpen(true);
    };

    const handleConfirmStatusChange = async () => {
        if (!selectedUser) return;
        setIsChangingStatus(true);
        setStatusChangeError(null);
        try {
            await usersApi.changeUserStatus(selectedUser.id, { status: pendingStatus });
            setIsActionModalOpen(false);
            setSelectedUser(null);
            setRefreshKey(k => k + 1);
        } catch {
            setStatusChangeError('Failed to update user status. Please try again.');
        } finally {
            setIsChangingStatus(false);
        }
    };

    const displayName = selectedUser
        ? [selectedUser.first_name, selectedUser.last_name].filter(Boolean).join(' ') || selectedUser.email
        : undefined;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <UsersFilter
                onSearch={setSearchInput}
                onStatusChange={setStatusFilter}
                onOrderingChange={setOrdering}
            />

            {isLoading ? (
                <div className="flex items-center justify-center py-20 text-gray-400 text-sm">
                    Loading...
                </div>
            ) : (
                <UserTable
                    users={users}
                    onSwitchExpert={handleSwitchExpert}
                    onStatusChange={handleStatusChange}
                    currentPage={currentPage}
                    totalCount={totalCount}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}

            <SwitchExpertModal
                isOpen={isSwitchModalOpen}
                onClose={() => { setIsSwitchModalOpen(false); setSwitchError(null); }}
                onConfirm={handleConfirmSwitch}
                userName={displayName}
                isLoading={isSwitching}
                error={switchError}
            />

            <UserActionModal
                isOpen={isActionModalOpen}
                onClose={() => { setIsActionModalOpen(false); setStatusChangeError(null); }}
                onConfirm={handleConfirmStatusChange}
                userName={displayName}
                action={pendingStatus}
                isLoading={isChangingStatus}
                error={statusChangeError}
            />
        </div>
    );
};

export default RecentUsers;
