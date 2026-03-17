"use client";
import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import type { GrowthPoint } from "@/lib/api/types";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
});

interface UserGrowthChartProps {
    data: GrowthPoint[];
    isLoaded?: boolean;
}

const UserGrowthChart: React.FC<UserGrowthChartProps> = ({ data = [], isLoaded = false }) => {
    if (data.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm h-full">
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-6">User Growth (Weekly)</h3>
                <div className="flex items-center justify-center h-[320px] text-gray-400 text-sm">
                    {isLoaded ? 'No data available' : 'Loading...'}
                </div>
            </div>
        );
    }

    const series = [
        {
            name: "Users",
            data: data.map((p) => p.count ?? 0),
        },
    ];

    const options: ApexOptions = {
        chart: {
            type: "line",
            height: 350,
            toolbar: { show: false },
            fontFamily: "inherit",
            zoom: { enabled: false },
        },
        colors: ["#8B5CF6"],
        stroke: {
            curve: "smooth",
            width: 3,
        },
        dataLabels: { enabled: false },
        xaxis: {
            categories: data.map((p) => p.period ?? ""),
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
        legend: { position: "top", horizontalAlign: "right" },
        grid: {
            strokeDashArray: 4,
            borderColor: "#f1f1f1",
            padding: { top: 0, right: 0, bottom: 0, left: 10 },
        },
        markers: {
            size: 4,
            colors: ["#fff"],
            strokeColors: ["#8B5CF6"],
            strokeWidth: 2,
            hover: { size: 7 },
        },
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm h-full">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-6">
                User Growth (Weekly)
            </h3>
            <div id="user-growth-chart">
                <ReactApexChart
                    options={options}
                    series={series}
                    type="line"
                    height={320}
                />
            </div>
        </div>
    );
};

export default UserGrowthChart;
