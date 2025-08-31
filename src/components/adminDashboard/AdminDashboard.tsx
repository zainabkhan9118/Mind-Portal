"use client";

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const LineChartOne = dynamic(() => import("@/components/charts/line/LineChartOne"), { ssr: false });
const BarChartOne = dynamic(() => import("@/components/charts/bar/BarChartOne"), { ssr: false });

const adminCards = [
  {
    title: 'Content',
    stat: '128',
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" fill="#a78bfa"/><rect x="7" y="9" width="10" height="2" rx="1" fill="#fff"/><rect x="7" y="13" width="6" height="2" rx="1" fill="#fff"/></svg>
    ),
    link: '/dashboard/admin/content',
    label: 'Manage Content',
  },
  {
    title: 'Analytics',
    stat: '4.2K',
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M5 12v7M12 7v12M19 3v16" stroke="#34d399" strokeWidth="2" strokeLinecap="round"/></svg>
    ),
    link: '/dashboard/admin/analytics/plays',
    label: 'View Analytics',
  },
  {
    title: 'Users',
    stat: '1,024',
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" fill="#f472b6"/><path d="M4 20c0-2.21 3.58-4 8-4s8 1.79 8 4" fill="#f472b6"/></svg>
    ),
    link: '/dashboard/admin/users/stats',
    label: 'Manage Users',
  },
  {
    title: 'Revenue',
    stat: '$12,340',
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" fill="#fbbf24"/><path d="M8 12h8M12 8v8" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
    ),
    link: '/dashboard/admin/monetization/revenue',
    label: 'View Revenue',
  },
  {
    title: 'Community',
    stat: '32',
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><circle cx="8" cy="12" r="4" fill="#60a5fa"/><circle cx="16" cy="12" r="4" fill="#60a5fa"/></svg>
    ),
    link: '/dashboard/admin/community/groups',
    label: 'Manage Community',
  },
  {
    title: 'Admin Controls',
    stat: '5',
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="3" fill="#f87171"/><path d="M12 9v3l2 2" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
    ),
    link: '/dashboard/admin/controls/permissions',
    label: 'Admin Controls',
  },
];

export default function AdminDashboard() {
  return (
    <div className="relative px-4 py-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Mind Player Admin Dashboard</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">Quick overview and access to all admin areas.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {adminCards.map((card) => (
          <div key={card.title} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm flex flex-col items-center text-center">
            <div className="mb-3">{card.icon}</div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{card.title}</h2>
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-300 mb-2">{card.stat}</div>
            <Link href={card.link} className="mt-auto">
              <span className="inline-block px-4 py-2 bg-purple-700 text-white dark:bg-purple-300 dark:text-purple-900 rounded-lg text-sm font-medium hover:bg-purple-800 dark:hover:bg-purple-200 transition-all">{card.label}</span>
            </Link>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Plays Over Time</h3>
          <LineChartOne />
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenue Breakdown</h3>
          <BarChartOne />
        </div>
      </div>
    </div>
  );
}