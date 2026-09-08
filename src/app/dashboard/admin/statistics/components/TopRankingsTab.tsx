"use client";
import React, { useState } from 'react';
import TopRankingsTable from './TopRankingsTable';
import OverviewFilterBar from './OverviewFilterBar';
import ContentSearchTypeFilter from './ContentSearchTypeFilter';
import type { AnalyticsParams, AnalyticsContentType } from '@/lib/api/types';

const TopRankingsTab: React.FC = () => {
    const [dateParams, setDateParams] = useState<AnalyticsParams>({});
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState<AnalyticsContentType | ''>('');

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <OverviewFilterBar
                onFilterChange={setDateParams}
                extraControls={
                    <ContentSearchTypeFilter
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        typeFilter={typeFilter}
                        onTypeFilterChange={setTypeFilter}
                    />
                }
            />

            <TopRankingsTable dateParams={dateParams} searchTerm={searchTerm} typeFilter={typeFilter} />
        </div>
    );
};

export default TopRankingsTab;
