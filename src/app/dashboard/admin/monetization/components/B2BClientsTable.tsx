import React from 'react';

const B2BClientsTable = () => {
    const clients = [
        { client: "Wellness Center NYC", type: "Gym/Club", users: 236, revenue: "$ 124.00", plan: "Annual", planColor: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
        { client: "Tech Corp", type: "Gym/Club", users: 526, revenue: "$ 124.00", plan: "Monthly", planColor: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
        { client: "Mindful School District", type: "Gym/Club", users: 52, revenue: "$ 124.00", plan: "Weekly", planColor: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300" },
        { client: "Yoga Studios LA", type: "Gym/Club", users: 63, revenue: "$ 124.00", plan: "Annually", planColor: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
    ];

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
                <div className="p-1.5 bg-orange-100 dark:bg-orange-900/20 rounded">
                    <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">B2B Clients</h3>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-sm font-medium text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                            <th className="pb-4 pl-4">Client</th>
                            <th className="pb-4 text-center">Type</th>
                            <th className="pb-4 text-center">Users</th>
                            <th className="pb-4 text-center">Monthly Revenue</th>
                            <th className="pb-4 pr-4 text-center">Plan</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {clients.map((client, index) => (
                            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors h-16">
                                <td className="pl-4 text-sm font-bold text-gray-900 dark:text-white">{client.client}</td>
                                <td className="text-center">
                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                                        {client.type}
                                    </span>
                                </td>
                                <td className="text-center text-sm font-bold text-gray-900 dark:text-white">{client.users}</td>
                                <td className="text-center text-sm font-medium text-green-500">{client.revenue}</td>
                                <td className="pr-4 text-center">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${client.planColor}`}>
                                        {client.plan}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-800 rounded-lg">
                <p className="text-sm text-orange-800 dark:text-orange-200 font-medium">
                    B2B Growth Opportunity: <span className="font-bold">2,130 total users</span> across enterprise clients generating <span className="font-bold">$5,800/month</span>
                </p>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-0">
                    Showing <span className="font-medium text-gray-900 dark:text-white">1-4</span> of <span className="font-medium text-gray-900 dark:text-white">10</span>
                </p>
                <div className="flex items-center gap-2">
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <span className="sr-only">Previous</span>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#9810FA] text-white font-medium transition-colors">
                        1
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        2
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        3
                    </button>
                    <span className="w-8 h-8 flex items-center justify-center text-gray-400">...</span>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        15
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <span className="sr-only">Next</span>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default B2BClientsTable;
