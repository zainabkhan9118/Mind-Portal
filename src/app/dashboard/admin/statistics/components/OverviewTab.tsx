import React from 'react';
import KeyMetricsOverview from './KeyMetricsOverview';
import MostPlayedStylesChart from './MostPlayedStylesChart';
import VrVsMobileChart from './VrVsMobileChart';
import EngagementTrends from './EngagementTrends';

const OverviewTab: React.FC = () => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <KeyMetricsOverview />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <MostPlayedStylesChart />
                <VrVsMobileChart />
            </div>

            <EngagementTrends />
        </div>
    );
};

export default OverviewTab;
