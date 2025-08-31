"use client";
import React from "react";
import { Repeat } from "lucide-react";
import dynamic from "next/dynamic";

const StaticBarChart = dynamic(() => import("@/components/charts/StaticBarChart"), { ssr: false });

export default function CompletionRatePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh]">
      <Repeat className="w-12 h-12 text-green-500 mb-4" />
      <h2 className="text-2xl font-bold mb-2 dark:text-gray-100">Content Completion Rate</h2>
      <div className="w-full mt-6">
          <StaticBarChart
            title="Content Retention Rate (Completion Rate)"
            data={[90, 80, 70, 60]}
            labels={["Content A", "Content B", "Content C", "Content D"]}
            color="#34d399"
          />
      </div>
    </div>
  );
}
