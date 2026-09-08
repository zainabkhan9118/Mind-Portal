interface MetricCardProps {
    title: string;
    value: string;
    valueColorClass: string;
    subtitle: string;
}

export default function MetricCard({ title, value, valueColorClass, subtitle }: MetricCardProps) {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col h-[180px] relative">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white absolute top-6 left-6">
                {title}
            </h4>
            <div className="flex-1 flex items-center justify-center">
                <span className={`text-5xl font-bold ${valueColorClass}`}>{value}</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center pb-2">
                {subtitle}
            </p>
        </div>
    );
}
