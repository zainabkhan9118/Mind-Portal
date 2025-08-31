"use client";
import React from "react";
import AnalyticsDropdown from "@/components/adminDashboard/AnalyticsDropdown";

export default function StatisticsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-6 flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Statistics & Analytics</h1>
      <AnalyticsDropdown />
      <div className="mt-4">{children}</div>
    </div>
  );
}