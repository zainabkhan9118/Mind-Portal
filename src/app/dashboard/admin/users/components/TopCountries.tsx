import React from 'react';
import type { DemographicItem } from '@/lib/api/types';

interface TopCountriesProps {
    countries: DemographicItem[];
    isLoaded?: boolean;
}

const TopCountries: React.FC<TopCountriesProps> = ({ countries = [], isLoaded = false }) => {
    const top5 = countries.slice(0, 5);

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm h-full flex flex-col">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-6">
                Top Countries
            </h3>
            {top5.length > 0 ? (
                <div className="flex-1 flex flex-col justify-center space-y-6">
                    {top5.map((country) => (
                        <div key={country.label} className="flex justify-between items-center">
                            <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                                {country.label}
                            </span>
                            <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                                {country.count.toLocaleString()}
                            </span>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                    {isLoaded ? 'No data available' : 'Loading...'}
                </div>
            )}
        </div>
    );
};

export default TopCountries;
