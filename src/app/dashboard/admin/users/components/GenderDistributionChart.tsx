"use client";
import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import type { DemographicItem } from "@/lib/api/types";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
});

interface GenderDistributionChartProps {
    genders: DemographicItem[];
    isLoaded?: boolean;
}

const GenderDistributionChart: React.FC<GenderDistributionChartProps> = ({ genders = [], isLoaded = false }) => {
    if (genders.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm h-full">
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-6">Gender Distribution</h3>
                <div className="flex items-center justify-center h-[320px] text-gray-400 text-sm">
                    {isLoaded ? 'No data available' : 'Loading...'}
                </div>
            </div>
        );
    }

    const series = genders.map((g) => g.count ?? 0);
    const labels = genders.map((g) => g.label ?? "");

    const options: ApexOptions = {
        chart: {
            type: "pie",
            height: 350,
            fontFamily: "inherit",
        },
        labels,
        colors: ["#8B5CF6", "#3B82F6", "#10B981", "#F59E0B", "#EF4444"],
        legend: { position: "right" },
        dataLabels: {
            enabled: true,
            formatter: function (val, opts) {
                return opts.w.config.labels[opts.seriesIndex] + " " + Math.round(val as number) + "%";
            },
            style: {
                fontSize: "12px",
                fontFamily: "inherit",
                fontWeight: 600,
            },
            background: { enabled: false },
            dropShadow: { enabled: false },
        },
        plotOptions: {
            pie: {
                dataLabels: {
                    offset: -10,
                    minAngleToShowLabel: 10,
                },
            },
        },
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm h-full">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-6">
                Gender Distribution
            </h3>
            <div id="gender-chart" className="flex justify-center items-center">
                <ReactApexChart
                    options={options}
                    series={series}
                    type="pie"
                    height={320}
                    width={380}
                />
            </div>
        </div>
    );
};

export default GenderDistributionChart;
