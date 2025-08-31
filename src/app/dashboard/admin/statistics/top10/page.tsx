"use client";
import React from "react";
import { TrendingUp } from "lucide-react";
import dynamic from "next/dynamic";

const StaticBarChart = dynamic(() => import("@/components/charts/StaticBarChart"), { ssr: false });

export default function Top10ContentsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] bg-white dark:bg-gray-900 transition-colors duration-300">
      <TrendingUp className="w-12 h-12 text-orange-500 dark:text-orange-400 mb-4" />
      <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">Top 10 Most Popular Contents Ranking</h2>
      <div className="w-full max-w-2xl mt-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow">
        <StaticBarChart
          title="Top 10 Most Popular Contents"
          data={[100, 95, 90, 85, 80, 75, 70, 65, 60, 55]}
          labels={["Content 1", "Content 2", "Content 3", "Content 4", "Content 5", "Content 6", "Content 7", "Content 8", "Content 9", "Content 10"]}
          color="#fb923c"
        />
      </div>
    </div>
  );
}
