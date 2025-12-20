"use client";

import React from 'react';
import OverviewTab from '@/app/dashboard/admin/statistics/components/OverviewTab';
import GlobalMindPlays from '@/app/dashboard/admin/statistics/components/GlobalMindPlays';
import TopRankingsTable from '@/app/dashboard/admin/statistics/components/TopRankingsTable';

export default function AdminDashboard() {
  return (
    <div className="p-2 space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome, Admin Name</h1>
        <p className="text-gray-600 dark:text-gray-400">Here is what's happening with your content today.</p>
      </div>

      {/* Main Analytics Overview */}
      <OverviewTab />

      {/* Additional Deep Dive Sections */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <GlobalMindPlays />
        <TopRankingsTable />
      </div>
    </div>
  );
}