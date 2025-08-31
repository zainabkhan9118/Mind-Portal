"use client";
import React from "react";
import { PieChart } from "lucide-react";
import dynamic from "next/dynamic";

const StaticPieChart = dynamic(() => import("@/components/charts/StaticPieChart"), { ssr: false });

export default function StylesPlayedMostPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] bg-white dark:bg-gray-900 transition-colors duration-300">
      <PieChart className="w-12 h-12 text-yellow-500 dark:text-yellow-400 mb-4" />
      <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">% of Styles or Categories Played Most</h2>
      <div className="w-full max-w-2xl mt-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow">
        <StaticPieChart
          title="% of Styles or Categories Played Most"
          data={[40, 30, 20, 10]}
          labels={["Style A", "Style B", "Style C", "Style D"]}
          colors={["#fbbf24", "#f59e42", "#f472b6", "#60a5fa"]}
        />
      </div>
    </div>
  );
}
