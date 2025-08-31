"use client";
import React from "react";
import { Clock } from "lucide-react";
import dynamic from "next/dynamic";

const StaticBarChart = dynamic(() => import("@/components/charts/StaticBarChart"), { ssr: false });

export default function ListeningTimePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] bg-white dark:bg-gray-900 transition-colors duration-300">
      <Clock className="w-12 h-12 text-indigo-500 dark:text-indigo-400 mb-4" />
      <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">Average Listening Time per Session</h2>
      <div className="w-full max-w-2xl mt-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow">
        <StaticBarChart
          title="Average Listening Time per Session"
          data={[45, 38, 32, 28]}
          labels={["Session A", "Session B", "Session C", "Session D"]}
          color="#6366f1"
        />
      </div>
    </div>
  );
}
