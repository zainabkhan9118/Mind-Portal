"use client";
import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import type { DemographicItem } from "@/lib/api/types";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
});

interface AgeDistributionChartProps {
    ageGroups: DemographicItem[];
    isLoaded?: boolean;
}

const AgeDistributionChart: React.FC<AgeDistributionChartProps> = ({ ageGroups = [], isLoaded = false }) => {
    if (ageGroups.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm h-full">
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-6">Age Distribution</h3>
                <div className="flex items-center justify-center h-[320px] text-gray-400 text-sm">
                    {isLoaded ? 'No data available' : 'Loading...'}
                </div>
            </div>
        );
    }

    const series = [
        {
            name: "Users",
            data: ageGroups.map((g) => g.count ?? 0),
        },
    ];

    const options: ApexOptions = {
        chart: {
            type: "bar",
            height: 350,
            toolbar: { show: false },
            fontFamily: "inherit",
        },
        colors: ["#8B5CF6"],
        plotOptions: {
            bar: {
                borderRadius: 4,
                columnWidth: "60%",
                distributed: false,
            },
        },
        dataLabels: { enabled: false },
        xaxis: {
            categories: ageGroups.map((g) => g.label ?? ""),
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: {
                style: { colors: "#9CA3AF", fontSize: "12px" },
            },
        },
        yaxis: {
            labels: {
                style: { colors: "#9CA3AF", fontSize: "12px" },
            },
        },
        grid: {
            strokeDashArray: 4,
            borderColor: "#f1f1f1",
        },
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm h-full">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-6">
                Age Distribution
            </h3>
            <div id="age-chart">
                <ReactApexChart
                    options={options}
                    series={series}
                    type="bar"
                    height={320}
                />
            </div>
        </div>
    );
};

export default AgeDistributionChart;
