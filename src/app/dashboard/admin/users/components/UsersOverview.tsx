'use client';
import React, { useState, useEffect } from 'react';
import OverviewStats from './OverviewStats';
import UserGrowthChart from './UserGrowthChart';
import AgeDistributionChart from './AgeDistributionChart';
import GenderDistributionChart from './GenderDistributionChart';
import TopGoals from './TopGoals';
import TopCountries from './TopCountries';
import PlatformDistribution from './PlatformDistribution';
import AvgSessionTime from './AvgSessionTime';
import UserEngagementMetrics from './UserEngagementMetrics';
import { usersApi } from '@/lib/api';
import type {
    UserDashboard,
    EngagementMetrics,
    GrowthPoint,
    UserDemographics,
} from '@/lib/api/types';

const UsersOverview: React.FC = () => {
    const [dashboard, setDashboard] = useState<UserDashboard | null>(null);
    const [engagement, setEngagement] = useState<EngagementMetrics | null>(null);
    const [growth, setGrowth] = useState<GrowthPoint[]>([]);
    const [growthLoaded, setGrowthLoaded] = useState(false);
    const [demographics, setDemographics] = useState<UserDemographics | null>(null);

    useEffect(() => {
        Promise.all([
            usersApi.getDashboard(),
            usersApi.getEngagement(),
            usersApi.getGrowth('weekly'),
            usersApi.getDemographics(),
        ])
            .then(([dash, eng, grow, demo]) => {
                setDashboard(dash);
                setEngagement(eng);
                setGrowth(grow ?? []);
                setGrowthLoaded(true);
                setDemographics(demo);
            })
            .catch((err) => {
                console.error(err);
                setGrowthLoaded(true);
            });
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            <OverviewStats dashboard={dashboard} engagement={engagement} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <UserGrowthChart data={growth} isLoaded={growthLoaded} />
                <AgeDistributionChart ageGroups={demographics?.age_groups ?? []} isLoaded={demographics !== null} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <GenderDistributionChart genders={demographics?.genders ?? []} isLoaded={demographics !== null} />
                <TopGoals />
                <TopCountries countries={demographics?.countries ?? []} isLoaded={demographics !== null} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PlatformDistribution />
                <AvgSessionTime />
            </div>

            <UserEngagementMetrics engagement={engagement} />
        </div>
    );
};

export default UsersOverview;
