"use client";
import React from "react";

type StaticPieChartProps = {
	title: string;
	data: number[];
	labels: string[];
	colors: string[];
};

export default function StaticPieChart({ title, data, labels, colors }: StaticPieChartProps) {
	const total = data.reduce((a, b) => a + b, 0);
	let cumulative = 0;
	const radius = 60;
	const cx = 70;
	const cy = 70;
	return (
		<div className="w-full max-w-xs mx-auto bg-white dark:bg-gray-900 rounded-xl shadow p-6">
			<h3 className="text-lg font-semibold mb-4 text-center text-gray-900 dark:text-gray-100">{title}</h3>
			<svg width={140} height={140} viewBox="0 0 140 140">
				{data.map((value, i) => {
					const start = cumulative / total;
					cumulative += value;
					const end = cumulative / total;
					const largeArc = end - start > 0.5 ? 1 : 0;
					const x1 = cx + radius * Math.cos(2 * Math.PI * start - Math.PI / 2);
					const y1 = cy + radius * Math.sin(2 * Math.PI * start - Math.PI / 2);
					const x2 = cx + radius * Math.cos(2 * Math.PI * end - Math.PI / 2);
					const y2 = cy + radius * Math.sin(2 * Math.PI * end - Math.PI / 2);
					const d = `M${cx},${cy} L${x1},${y1} A${radius},${radius} 0 ${largeArc} 1 ${x2},${y2} Z`;
					return (
						<path key={i} d={d} fill={colors[i % colors.length]} stroke="#fff" strokeWidth={2} />
					);
				})}
			</svg>
			<div className="flex flex-wrap justify-center gap-2 mt-4">
				{labels.map((label, i) => (
					<span key={i} className="flex items-center gap-1 text-xs">
						<span className="inline-block w-3 h-3 rounded-full" style={{ background: colors[i % colors.length] }}></span>
						{label} ({data[i]})
					</span>
				))}
			</div>
		</div>
	);
}
