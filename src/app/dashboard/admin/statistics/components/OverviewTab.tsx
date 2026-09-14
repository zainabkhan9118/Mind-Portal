"use client";
import React, { useState } from 'react';
import KeyMetricsOverview from './KeyMetricsOverview';
import MostPlayedStylesChart from './MostPlayedStylesChart';
import VrVsMobileChart from './VrVsMobileChart';
import EngagementTrends from './EngagementTrends';
import OverviewFilterBar, { DEFAULT_ANALYSIS_OPTIONS } from './OverviewFilterBar';
import type { AnalyticsParams } from '@/lib/api/types';

const ANALYSIS_OPTIONS = [...DEFAULT_ANALYSIS_OPTIONS, 'Minds + Goals'];

const OverviewTab: React.FC = () => {
    const [dateParams, setDateParams] = useState<AnalyticsParams>({});

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <OverviewFilterBar onFilterChange={setDateParams} analysisOptions={ANALYSIS_OPTIONS} />

            <KeyMetricsOverview dateParams={dateParams} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <MostPlayedStylesChart dateParams={dateParams} />
                <VrVsMobileChart dateParams={dateParams} />
            </div>

            <EngagementTrends dateParams={dateParams} />
        </div>
    );
};

export default OverviewTab;
