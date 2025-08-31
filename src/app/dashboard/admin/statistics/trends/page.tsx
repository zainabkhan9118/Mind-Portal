"use client";
import React from "react";
import { TrendingUp } from "lucide-react";
import dynamic from "next/dynamic";

const StaticBarChart = dynamic(() => import("@/components/charts/StaticBarChart"), { ssr: false });

export default function TrendsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh]">
      <TrendingUp className="w-12 h-12 text-indigo-500 mb-4" />
      <h2 className="text-2xl font-bold dark:text-gray-100 mb-2">Trends</h2>
      <ul className="text-gray-700 dark:text-gray-300 mb-4 list-disc pl-6 text-left">
        <li>Daily</li>
        <li>Weekly</li>
        <li>Monthly</li>
        <li>Yearly</li>
      </ul>
      <div className="w-full mt-6">
        <StaticBarChart
          title="Trends in Number of Plays (Monthly)"
          data={[120, 140, 160, 180, 200, 220, 210, 190, 170, 150, 130, 110]}
          labels={["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]}
          color="#6366f1"
        />
      </div>
    </div>
  );
}
