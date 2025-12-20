import React from 'react';

const TopCountries: React.FC = () => {
    const countries = [
        { name: 'United States', flag: '🇺🇸', value: 8234 },
        { name: 'United Kingdom', flag: '🇬🇧', value: 5678 },
        { name: 'Canada', flag: '🇨🇦', value: 3456 },
        { name: 'Portugal', flag: '🇵🇹', value: 2345 },
        { name: 'Australia', flag: '🇦🇺', value: 1876 },
    ];

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm h-full flex flex-col">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-6">
                Top Countries
            </h3>
            <div className="flex-1 flex flex-col justify-center space-y-6">
                {countries.map((country) => (
                    <div key={country.name} className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <span className="text-xl">{country.flag}</span>
                            <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{country.name}</span>
                        </div>
                        <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                            {country.value.toLocaleString()}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopCountries;
