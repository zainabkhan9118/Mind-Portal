"use client";
import { useEffect, useState } from 'react';
import B2BClientsTable from './B2BClientsTable';
import monetizationApi from '@/lib/api/monetizationApi';
import type { MonetizationDashboard } from '@/lib/api/types';

const fmt = (n?: number) =>
    n != null
        ? `$${(n ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        : '—';

const InfoCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col h-full min-h-[160px]">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">{title}</h3>
        <div className="space-y-4 flex-1">{children}</div>
    </div>
);

const B2BTab = () => {
    const [dashboard, setDashboard] = useState<MonetizationDashboard | null>(null);

    useEffect(() => {
        monetizationApi.getDashboard().then(setDashboard).catch(console.error);
    }, []);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InfoCard title="Subscriber Overview">
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Active Subscribers</p>
                        <p className="text-xl font-medium text-purple-600">
                            {dashboard?.active_subscribers != null
                                ? (dashboard.active_subscribers ?? 0).toLocaleString()
                                : '—'}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Churned</p>
                        <p className="text-xl font-medium text-red-500">
                            {dashboard?.churned_count != null
                                ? (dashboard.churned_count ?? 0).toLocaleString()
                                : '—'}
                        </p>
                    </div>
                </InfoCard>

                <InfoCard title="Revenue Summary">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400">MRR</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{fmt(dashboard?.mrr)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400">ARR</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{fmt(dashboard?.arr)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{fmt(dashboard?.total_revenue)}</span>
                    </div>
                </InfoCard>

                <InfoCard title="Key Metrics">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400">ARPU</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{fmt(dashboard?.arpu)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Churn Rate</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                            {dashboard?.churn_rate != null ? `${(dashboard.churn_rate ?? 0).toFixed(1)}%` : '—'}
                        </span>
                    </div>
                </InfoCard>
            </div>

            <B2BClientsTable />
        </div>
    );
};

export default B2BTab;
