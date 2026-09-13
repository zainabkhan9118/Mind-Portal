"use client";
import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LayoutGrid, Users } from 'lucide-react';
import UsersOverview from './components/UsersOverview';
import RecentUsers from './components/RecentUsers';

const UsersPage: React.FC = () => {
    return (
        <Suspense fallback={null}>
            <UsersPageInner />
        </Suspense>
    );
};

const UsersPageInner: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const tabParam = searchParams.get('tab');
    const [activeTab, setActiveTab] = useState<'overview' | 'recent'>(
        tabParam === 'recent' ? 'recent' : 'overview',
    );

    // Keep in sync with the URL — a Link to this same route only changes the query
    // string, it doesn't remount the page, so the initial useState value won't update.
    useEffect(() => {
        if (tabParam === 'overview' || tabParam === 'recent') setActiveTab(tabParam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tabParam]);

    const selectTab = (tab: 'overview' | 'recent') => {
        setActiveTab(tab);
        router.replace(`/dashboard/admin/users?tab=${tab}`, { scroll: false });
    };

    return (
        <div className="p-6 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">User Management</h1>
                <p className="text-gray-500 dark:text-gray-400">Insights and management of your user base.</p>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
                <div className="flex gap-8">
                    <button
                        onClick={() => selectTab('overview')}
                        className={`pb-4 text-sm font-medium flex items-center gap-2 transition-all relative ${activeTab === 'overview'
                                ? 'text-purple-600 dark:text-purple-400'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                    >
                        <LayoutGrid className="w-4 h-4" />
                        Overview
                        {activeTab === 'overview' && (
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 rounded-t-full" />
                        )}
                    </button>
                    <button
                        onClick={() => selectTab('recent')}
                        className={`pb-4 text-sm font-medium flex items-center gap-2 transition-all relative ${activeTab === 'recent'
                                ? 'text-purple-600 dark:text-purple-400'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                    >
                        <Users className="w-4 h-4" />
                        Recent Users
                        {activeTab === 'recent' && (
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 rounded-t-full" />
                        )}
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="min-h-[500px]">
                {activeTab === 'overview' && <UsersOverview />}
                {activeTab === 'recent' && <RecentUsers />}
            </div>
        </div>
    );
};

export default UsersPage;
