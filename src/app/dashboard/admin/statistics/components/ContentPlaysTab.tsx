import React from 'react';
import KeyMetricsOverview from './KeyMetricsOverview'; // Or similar metrics
import GlobalMindPlays from './GlobalMindPlays';
import ComponentPlaysChart from './ComponentPlaysChart';
import AvgListeningTimeChart from './AvgListeningTimeChart';

const ContentPlaysTab: React.FC = () => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Using KeyMetricsOverview as a placeholder - in real app, might pass different data props */}
            <KeyMetricsOverview />

            <GlobalMindPlays />
            
            <ComponentPlaysChart />
            
            {/* <AvgListeningTimeChart /> */}
        </div>
    );
};

export default ContentPlaysTab;
