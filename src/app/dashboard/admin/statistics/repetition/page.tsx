"use client";
import React from "react";
import { Repeat } from "lucide-react";
import dynamic from "next/dynamic";

const StaticBarChart = dynamic(() => import("@/components/charts/StaticBarChart"), { ssr: false });

export default function RepetitionRatePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh]">
      <Repeat className="w-12 h-12 text-yellow-500 mb-4" />
      <h2 className="text-2xl font-bold  dark:text-gray-100 mb-2">Repetition Rate</h2>
      <div className="w-full mt-6">
          <StaticBarChart
            title="Repetition Rate (How Often Content is Replayed)"
            data={[30, 25, 20, 15]}
            labels={["Content X", "Content Y", "Content Z", "Content W"]}
            color="#a78bfa"
          />
      </div>
    </div>
  );
}
