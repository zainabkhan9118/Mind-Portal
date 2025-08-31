"use client";
import React from "react";
import { BarChart2 } from "lucide-react";
import dynamic from "next/dynamic"; // Ensure dynamic import is present

const StaticBarChart = dynamic(() => import("@/components/charts/StaticBarChart"), { ssr: false }); // Dynamic import for StaticBarChart

export default function PlaysPlaylistPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] bg-white dark:bg-gray-900 transition-colors duration-300">
      <BarChart2 className="w-12 h-12 text-pink-500 dark:text-pink-400 mb-4" />
      <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">Number of Plays by Playlist</h2>
      <div className="w-full max-w-2xl mt-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow">
        <StaticBarChart
          title="Number of Plays by Playlist"
          data={[60, 40, 30, 10]}
          labels={["Playlist 1", "Playlist 2", "Playlist 3", "Playlist 4"]}
          color="#f472b6"
        />
      </div>
    </div>
  );
}
