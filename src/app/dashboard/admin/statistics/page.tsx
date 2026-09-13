"use client";
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LayoutGrid, Headphones, Trophy, Brain, Target } from 'lucide-react';
import OverviewTab from './components/OverviewTab';
import ContentPlaysTab from './components/ContentPlaysTab';
import TopRankingsTab from './components/TopRankingsTab';
import MindsTab from './components/MindsTab';
import MindCoverageTab from './components/MindCoverageTab';

const TABS = [
  { id: 'Overview', slug: 'overview', icon: <LayoutGrid className="w-4 h-4" /> },
  { id: 'Content', slug: 'content', icon: <Headphones className="w-4 h-4" /> },
  { id: 'Minds', slug: 'minds', icon: <Brain className="w-4 h-4" /> },
  { id: 'Mind Coverage', slug: 'mind-coverage', icon: <Target className="w-4 h-4" /> },
  // { id: 'Top Rankings', slug: 'top-rankings', icon: <Trophy className="w-4 h-4" /> },
];

function slugToTab(slug: string | null): string | null {
  return TABS.find((t) => t.slug === slug)?.id ?? null;
}

function tabToSlug(id: string): string {
  return TABS.find((t) => t.id === id)?.slug ?? 'overview';
}

export default function StatisticsPage() {
  return (
    <Suspense fallback={null}>
      <StatisticsPageInner />
    </Suspense>
  );
}

function StatisticsPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(slugToTab(tabParam) ?? 'Overview');
  const tabs = TABS;

  // Keep in sync with the URL — a Link to this same route only changes the query
  // string, it doesn't remount the page, so the initial useState value won't update.
  useEffect(() => {
    const tab = slugToTab(tabParam);
    if (tab) setActiveTab(tab);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabParam]);

  const selectTab = (id: string) => {
    setActiveTab(id);
    router.replace(`/dashboard/admin/statistics?tab=${tabToSlug(id)}`, { scroll: false });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">Statistics & Analytics</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage and track your content here.</p>
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

      {/* Content */}
      <div className="min-h-[500px]">
        {activeTab === 'Overview' && <OverviewTab />}
        {activeTab === 'Content' && <ContentPlaysTab />}
        {activeTab === 'Minds' && <MindsTab onNavigateToMindCoverage={() => selectTab('Mind Coverage')} />}
        {activeTab === 'Mind Coverage' && <MindCoverageTab />}
        {/* {activeTab === 'Top Rankings' && <TopRankingsTab />} */}
      </div>
    </div>
  );
}
