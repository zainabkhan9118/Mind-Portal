import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const RevenueByMarket = () => {
    const markets = [
        { country: "United States", revenue: "$28,500", subscribers: "3,200", growth: "15.2%" },
        { country: "United Kingdom", revenue: "$12,300", subscribers: "1,450", growth: "12.8%" },
        { country: "Canada", revenue: "$8,700", subscribers: "980", growth: "18.5%" },
        { country: "Portugal", revenue: "$6,200", subscribers: "720", growth: "22.3%" },
        { country: "Australia", revenue: "$5,100", subscribers: "580", growth: "10.4%" },
    ];

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm col-span-12 lg:col-span-8">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-6">Revenue by Market</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-sm font-medium text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                            <th className="pb-4 pl-4">Country</th>
                            <th className="pb-4">Revenue</th>
                            <th className="pb-4">Subscribers</th>
                            <th className="pb-4 pr-4 text-right">Growth</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {markets.map((market, index) => (
                            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <td className="py-4 pl-4 text-sm font-medium text-gray-900 dark:text-white">{market.country}</td>
                                <td className="py-4 text-sm text-green-500 font-medium">{market.revenue}</td>
                                <td className="py-4 text-sm text-gray-600 dark:text-gray-400">{market.subscribers}</td>
                                <td className="py-4 pr-4 text-sm font-medium text-green-500 text-right flex justify-end items-center gap-1">
                                    <ArrowUpRight className="w-4 h-4" />
                                    {market.growth}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default RevenueByMarket;
