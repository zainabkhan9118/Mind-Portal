import React from 'react';
import TopRankingsTable from './TopRankingsTable';

const TopRankingsTab: React.FC = () => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <TopRankingsTable />
        </div>
    );
};

export default TopRankingsTab;
