"use client";
import React, { useState } from "react";
import { LayoutGrid, Building2 } from "lucide-react";
import OverviewTab from "./components/OverviewTab";
import B2BTab from "./components/B2BTab";

export default function MonetizationPage() {
    const [activeTab, setActiveTab] = useState<"overview" | "b2b">("overview");

    return (
        <div className="p-6 space-y-6">
            {/* Sticky Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Monetization
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4">
                    Revenue tracking and financial analytics.
                </p>

                {/* Tabs */}
                <div className="flex gap-6 mt-4">
                    <button
                        onClick={() => setActiveTab("overview")}
                        className={`flex items-center gap-2 pb-2 text-sm font-medium transition-colors relative ${activeTab === "overview"
                                ? "text-purple-600 dark:text-purple-400"
                                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                            }`}
                    >
                        <LayoutGrid className="w-4 h-4" />
                        Overview
                        {activeTab === "overview" && (
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 dark:bg-purple-400 rounded-t-full" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab("b2b")}
                        className={`flex items-center gap-2 pb-2 text-sm font-medium transition-colors relative ${activeTab === "b2b"
                                ? "text-purple-600 dark:text-purple-400"
                                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                            }`}
                    >
                        <Building2 className="w-4 h-4" />
                        B2B Clients
                        {activeTab === "b2b" && (
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 dark:bg-purple-400 rounded-t-full" />
                        )}
                    </button>
                </div>
            </div>

            <div className="mt-6">
                {activeTab === "overview" ? <OverviewTab /> : <B2BTab />}
            </div>
        </div>
    );
}
