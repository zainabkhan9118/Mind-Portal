"use client";
import React from "react";
import { BarChart2 } from "lucide-react";
import dynamic from "next/dynamic";

const StaticBarChart = dynamic(() => import("@/components/charts/StaticBarChart"), { ssr: false });

export default function PlaysMusicPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] bg-white dark:bg-gray-900 transition-colors duration-300">
      <BarChart2 className="w-12 h-12 text-blue-500 dark:text-blue-400 mb-4" />
      <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">Number of Plays by Music</h2>
      <div className="w-full max-w-2xl mt-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow">
        <StaticBarChart
          title="Number of Plays by Music"
          data={[200, 150, 100, 50]}
          labels={["Music A", "Music B", "Music C", "Music D"]}
          color="#60a5fa"
        />
      </div>
    </div>
  );
}
