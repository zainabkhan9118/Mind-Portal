"use client";
import React from "react";
import { BarChart2 } from "lucide-react";
import dynamic from "next/dynamic";

const StaticBarChart = dynamic(() => import("@/components/charts/StaticBarChart"), { ssr: false });

export default function PlaysSessionPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] bg-white dark:bg-gray-900 transition-colors duration-300">
      <BarChart2 className="w-12 h-12 text-purple-500 dark:text-purple-400 mb-4" />
      <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">Number of Plays by Session</h2>
      <div className="w-full max-w-2xl mt-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow">
        <StaticBarChart
          title="Number of Plays by Session"
          data={[120, 90, 60, 30]}
          labels={["Session 1", "Session 2", "Session 3", "Session 4"]}
        />
      </div>
    </div>
  );
}
