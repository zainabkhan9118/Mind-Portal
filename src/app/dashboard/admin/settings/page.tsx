"use client";
import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    LayoutGrid,
    ListChecks,
    Image as ImageIcon,
    Monitor
} from "lucide-react";
import AdminOverview from "./components/AdminOverview";
import ContentValidation from "./components/ContentValidation";
import ImagesManagement from "./components/ImagesManagement";
import HomeScreenEnvironments from "./components/HomeScreenEnvironments";

export default function SettingsPage() {
    return (
        <Suspense fallback={null}>
            <SettingsPageInner />
        </Suspense>
    );
}

const SETTINGS_TABS = [
    { id: "Overview", slug: "overview", icon: <LayoutGrid className="w-4 h-4" /> },
    { id: "Content Validation", slug: "content-validation", icon: <ListChecks className="w-4 h-4" /> },
    { id: "Home Screen Environments", slug: "home-screen-environments", icon: <Monitor className="w-4 h-4" /> },
    { id: "MP Gallery", slug: "mp-gallery", icon: <ImageIcon className="w-4 h-4" /> },
];

function slugToTab(slug: string | null): string | null {
    return SETTINGS_TABS.find((t) => t.slug === slug)?.id ?? null;
}

function tabToSlug(id: string): string {
    return SETTINGS_TABS.find((t) => t.id === id)?.slug ?? "overview";
}

function SettingsPageInner() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const tabParam = searchParams.get("tab");
    const [activeTab, setActiveTab] = useState(slugToTab(tabParam) ?? "Overview");
    const tabs = SETTINGS_TABS;

    // Keep the tab in sync with the URL — a Link to this same route (e.g. from the
    // notification bell) only changes the query string, it doesn't remount the page,
    // so the initial useState value above won't update on its own.
    useEffect(() => {
        const tab = slugToTab(tabParam);
        if (tab) setActiveTab(tab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tabParam]);

    const selectTab = (id: string) => {
        setActiveTab(id);
        router.replace(`/dashboard/admin/settings?tab=${tabToSlug(id)}`, { scroll: false });
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">Admin Control</h1>
                <p className="text-gray-500 dark:text-gray-400">Manage system settings, permissions, and notifications.</p>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
                <div className="flex gap-8 overflow-x-auto no-scrollbar">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => selectTab(tab.id)}
                            className={`pb-4 text-sm font-medium flex items-center gap-2 transition-all relative whitespace-nowrap ${activeTab === tab.id
                                ? 'text-purple-600 dark:text-purple-400'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                }`}
                        >
                            {tab.icon}
                            {tab.id}
                            {activeTab === tab.id && (
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 rounded-t-full" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab content */}
            <div className="min-h-[500px]">
                {activeTab === "Overview" && <AdminOverview />}
                {activeTab === "Content Validation" && <ContentValidation />}
                {activeTab === "Home Screen Environments" && <HomeScreenEnvironments />}
                {activeTab === "MP Gallery" && <ImagesManagement />}
            </div>
        </div>
    );
}
