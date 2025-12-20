import React from 'react';
import B2BClientsTable from './B2BClientsTable';

const InfoCard = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col h-full min-h-[160px]">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">{title}</h3>
        <div className="space-y-4 flex-1">
            {children}
        </div>
    </div>
);

const B2BTab = () => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InfoCard title="Conversion Metrics">
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Free to Premium</p>
                        <p className="text-xl font-medium text-purple-600">20.4%</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Trial to Paid</p>
                        <p className="text-xl font-medium text-blue-600">68.2%</p>
                    </div>
                </InfoCard>

                <InfoCard title="Revenue Time Periods">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400">This Week</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">$14,520</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400">This Quarter</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">$178,400</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Last 6 Months</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">$324,200</span>
                    </div>
                </InfoCard>

                <InfoCard title="Key Metrics">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400">ARPU</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">$12.50</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400">CAC</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">$8.20</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400">CAC:LTV Ratio</span>
                        <span className="text-sm font-bold text-green-500">1:11.5</span>
                    </div>
                </InfoCard>
            </div>

            <B2BClientsTable />
        </div>
    );
};

export default B2BTab;
