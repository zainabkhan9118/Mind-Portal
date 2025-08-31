"use client";
import React from "react";
import { CalendarClock } from "lucide-react";

export default function SchedulePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh]">
      <CalendarClock className="w-12 h-12 text-blue-500 mb-4" />
      <h2 className="text-2xl font-bold mb-2">Schedule Content Release</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-4">Schedule your content for future release here.</p>
      {/* Add your schedule management UI here */}
      <div className="rounded-lg border border-dashed border-blue-300 p-8 text-center text-blue-400">Static placeholder for schedule management.</div>
    </div>
  );
}
