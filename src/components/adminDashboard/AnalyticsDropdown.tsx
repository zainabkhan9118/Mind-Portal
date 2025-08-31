"use client";
import React, { useState } from "react";
import { BarChart2, Clock, Repeat, TrendingUp, Smartphone, PieChart } from "lucide-react";
import { useRouter } from "next/navigation";

const analyticsOptions = [
  { label: "Number of Plays by Session", value: "/dashboard/admin/statistics/plays-session", icon: <BarChart2 className="w-5 h-5" /> },
  { label: "Number of Plays by Music", value: "/dashboard/admin/statistics/plays-music", icon: <BarChart2 className="w-5 h-5" /> },
  { label: "Number of Plays by Sound", value: "/dashboard/admin/statistics/plays-sound", icon: <BarChart2 className="w-5 h-5" /> },
  { label: "Number of Plays by Playlist", value: "/dashboard/admin/statistics/plays-playlist", icon: <BarChart2 className="w-5 h-5" /> },
  { label: "Average Listening Time per Session", value: "/dashboard/admin/statistics/time", icon: <Clock className="w-5 h-5" /> },
  { label: "% of Styles or Categories Played Most", value: "/dashboard/admin/statistics/styles", icon: <PieChart className="w-5 h-5" /> },
  { label: "Content Retention Rate (Completion Rate)", value: "/dashboard/admin/statistics/completion", icon: <Repeat className="w-5 h-5" /> },
  { label: "Repetition Rate (How Often Content is Replayed)", value: "/dashboard/admin/statistics/repetition", icon: <Repeat className="w-5 h-5" /> },
  { label: "Top 10 Most Popular Contents Ranking", value: "/dashboard/admin/statistics/top10", icon: <TrendingUp className="w-5 h-5" /> },
  { label: "Trends (Daily, Weekly, Monthly, Yearly)", value: "/dashboard/admin/statistics/trends", icon: <TrendingUp className="w-5 h-5" /> },
  { label: "Compare VR vs Mobile Usage", value: "/dashboard/admin/statistics/vr-vs-mobile", icon: <Smartphone className="w-5 h-5" /> },
];

export default function AnalyticsDropdown() {
  const router = useRouter();
  const [selected, setSelected] = useState(analyticsOptions[0].value);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelected(e.target.value);
    router.push(e.target.value);
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="analytics-dropdown" className="font-semibold text-gray-700 dark:text-gray-200">Analytics Type:</label>
      <select
        id="analytics-dropdown"
        value={selected}
        onChange={handleChange}
        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
      >
        {analyticsOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <span className="ml-2">
        {analyticsOptions.find((o) => o.value === selected)?.icon}
      </span>
    </div>
  );
}