import React from 'react';

const SubscriptionBreakdown = () => {
    const items = [
        {
            label: "Monthly",
            amount: "$18,500",
            subtext: "2,100 subscribers",
            color: "bg-purple-500",
            percentage: 45 // Visual estimate
        },
        {
            label: "Annual",
            amount: "$28,900",
            subtext: "1,850 subscribers",
            color: "bg-blue-600",
            percentage: 70 // Visual estimate
        },
        {
            label: "Lifetime",
            amount: "$9,300",
            subtext: "310 purchases",
            color: "bg-green-500",
            percentage: 25 // Visual estimate
        },
        {
            label: "B2B",
            amount: "$5,800",
            subtext: "4 enterprise clients",
            color: "bg-orange-500",
            percentage: 15 // Visual estimate 
        }
    ];

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm col-span-12 lg:col-span-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-6">Subscription Breakdown</h3>
            <div className="space-y-6">
                {items.map((item, index) => (
                    <div key={index}>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
                            <span className="text-sm font-bold text-gray-900 dark:text-purple-400">{item.amount}</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 mb-2">
                            <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.percentage}%` }}></div>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{item.subtext}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SubscriptionBreakdown;
