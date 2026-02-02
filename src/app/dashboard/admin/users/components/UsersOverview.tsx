import React from 'react';
import OverviewStats from './OverviewStats';
import UserGrowthChart from './UserGrowthChart';
import AgeDistributionChart from './AgeDistributionChart';
import GenderDistributionChart from './GenderDistributionChart';
import TopGoals from './TopGoals';
import TopCountries from './TopCountries';
import PlatformDistribution from './PlatformDistribution';
import AvgSessionTime from './AvgSessionTime';

import UserEngagementMetrics from './UserEngagementMetrics';

const UsersOverview: React.FC = () => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            <OverviewStats />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <UserGrowthChart />
                <AgeDistributionChart />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <GenderDistributionChart />
                <TopGoals />
                <TopCountries />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PlatformDistribution />
                <AvgSessionTime />
            </div>

            <UserEngagementMetrics />
        </div>
    );
};


export default UsersOverview;
