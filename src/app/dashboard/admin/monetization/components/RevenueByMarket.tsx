import React from 'react';
import type { RevenueByRegion } from '@/lib/api/types';

interface Props {
    data: RevenueByRegion[];
    isLoading?: boolean;
}

const RevenueByMarket: React.FC<Props> = ({ data, isLoading }) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm col-span-12 lg:col-span-8">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-6">Revenue by Market</h3>
            {isLoading ? (
                <div className="h-40 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : data.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">No data available</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-sm font-medium text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                                <th className="pb-4 pl-4">Country</th>
                                <th className="pb-4">Revenue</th>
                                <th className="pb-4 pr-4 text-right">Transactions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {data.map((market, index) => (
                                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="py-4 pl-4 text-sm font-medium text-gray-900 dark:text-white">
                                        {market.country}
                                    </td>
                                    <td className="py-4 text-sm text-green-500 font-medium">
                                        ${(market.revenue ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </td>
                                    <td className="py-4 pr-4 text-sm text-gray-600 dark:text-gray-400 text-right">
                                        {(market.transaction_count ?? 0).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default RevenueByMarket;
