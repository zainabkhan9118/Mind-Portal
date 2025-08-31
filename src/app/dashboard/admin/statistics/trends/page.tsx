"use client";
import React, { useState } from "react";
import { TrendingUp } from "lucide-react";
import dynamic from "next/dynamic";

const StaticBarChart = dynamic(() => import("@/components/charts/StaticBarChart"), { ssr: false });

export default function TrendsPage() {
  // Dropdown options and static data for each trend type
  const trendOptions = [
    { label: "Daily", value: "daily" },
    { label: "Weekly", value: "weekly" },
    { label: "Monthly", value: "monthly" },
    { label: "Yearly", value: "yearly" },
  ];

  const trendData = {
    daily: {
      title: "Trends in Number of Plays (Daily)",
      data: [12, 15, 18, 14, 20, 22, 19],
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      color: "#38bdf8",
    },
    weekly: {
      title: "Trends in Number of Plays (Weekly)",
      data: [80, 95, 110, 120],
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      color: "#a78bfa",
    },
    monthly: {
      title: "Trends in Number of Plays (Monthly)",
      data: [120, 140, 160, 180, 200, 220, 210, 190, 170, 150, 130, 110],
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      color: "#6366f1",
    },
    yearly: {
      title: "Trends in Number of Plays (Yearly)",
      data: [1200, 1350, 1500, 1700, 1600],
      labels: ["2021", "2022", "2023", "2024", "2025"],
      color: "#f472b6",
    },
  };

  type TrendType = "daily" | "weekly" | "monthly" | "yearly";
  const [selectedTrend, setSelectedTrend] = useState<TrendType>("monthly");

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTrend(e.target.value as TrendType);
  };

  const { title, data, labels, color } = trendData[selectedTrend];

  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] bg-white dark:bg-gray-900 transition-colors duration-300">
      <TrendingUp className="w-12 h-12 text-indigo-500 dark:text-indigo-400 mb-4" />
      <h2 className="text-2xl font-bold dark:text-gray-100 mb-4">Trends</h2>
      <div className="mb-4">
        <label htmlFor="trend-filter" className="font-semibold text-gray-700 dark:text-gray-200 mr-2">View by:</label>
        <select
          id="trend-filter"
          value={selectedTrend}
          onChange={handleChange}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          {trendOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
      <div className="w-full max-w-2xl mt-2 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow">
        <StaticBarChart
          title={title}
          data={data}
          labels={labels}
          color={color}
        />
      </div>
    </div>
  );
}
