"use client";
import React from "react";
import { Star } from "lucide-react";

export default function PremiumPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh]">
      <Star className="w-12 h-12 text-yellow-500 mb-4" />
      <h2 className="text-2xl font-bold mb-2">Premium / Free Content</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-4">Set your content as Premium or Free here.</p>
      {/* Add your premium/free management UI here */}
      <div className="rounded-lg border border-dashed border-yellow-300 p-8 text-center text-yellow-400">Static placeholder for premium/free management.</div>
    </div>
  );
}
