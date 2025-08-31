"use client";
import React from "react";

type StaticBarChartProps = {
	title: string;
	data: number[];
	labels: string[];
	color?: string;
};

export default function StaticBarChart({ title, data, labels, color = "#a78bfa" }: StaticBarChartProps) {
	const max = Math.max(...data, 1);
	return (
		<div className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow p-6">
			<h3 className="text-lg font-semibold mb-4 text-center text-gray-900 dark:text-gray-100">{title}</h3>
			<div className="flex items-end h-56 gap-4">
				{data.map((value, i) => (
					<div key={i} className="flex flex-col items-center flex-1">
						<div
							className="w-8 rounded-t-lg"
							style={{ height: `${(value / max) * 100}%`, background: color, transition: 'height 0.3s' }}
							title={labels[i] + ": " + value}
						></div>
						<span className="text-xs mt-2 text-gray-700 dark:text-gray-200 font-medium">{labels[i]}</span>
						<span className="text-xs text-gray-500">{value}</span>
					</div>
				))}
			</div>
		</div>
	);
}
