"use client";
import React, { useState } from 'react';
import KeyMetricsOverview from './KeyMetricsOverview';
import ComponentPlaysChart from './ComponentPlaysChart';
import AvgListeningTimeChart from './AvgListeningTimeChart';
import TopRankingsTable from './TopRankingsTable';
import OverviewFilterBar from './OverviewFilterBar';
import ContentSearchTypeFilter from './ContentSearchTypeFilter';
import type { AnalyticsParams } from '@/lib/api/types';

const ContentPlaysTab: React.FC = () => {
    const [dateParams, setDateParams] = useState<AnalyticsParams>({});
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <OverviewFilterBar onFilterChange={setDateParams} />

            <KeyMetricsOverview dateParams={dateParams} />
            <ComponentPlaysChart dateParams={dateParams} />
            <AvgListeningTimeChart />

            {/* ── Content Performance ── */}
            <div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                    <h2 className="text-base font-semibold text-gray-900 dark:text-white">Content Performance</h2>
                    <ContentSearchTypeFilter
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        showTypeFilter={false}
                    />
                </div>

                <TopRankingsTable dateParams={dateParams} searchTerm={searchTerm} />
            </div>
        </div>
    );
};

export default ContentPlaysTab;
