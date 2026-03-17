"use client";
import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import type { RevenueTimeseriesPoint } from "@/lib/api/types";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
});

interface Props {
    data: RevenueTimeseriesPoint[];
    isLoading?: boolean;
}

const RevenueChart: React.FC<Props> = ({ data, isLoading }) => {
    const categories = data.map((p) => p.period);

    const series = [
        { name: "Free", data: data.map((p) => p.free ?? 0) },
        { name: "Basic", data: data.map((p) => p.basic ?? 0) },
        { name: "Premium", data: data.map((p) => p.premium ?? 0) },
        { name: "Enterprise", data: data.map((p) => p.enterprise ?? 0) },
    ];

    const options: ApexOptions = {
        chart: {
            type: "bar",
            height: 350,
            stacked: true,
            toolbar: { show: false },
            fontFamily: "inherit",
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: "55%",
                borderRadius: 0,
            },
        },
        dataLabels: { enabled: false },
        stroke: { show: true, width: 0, colors: ["transparent"] },
        xaxis: {
            categories,
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: { style: { colors: "#9CA3AF", fontSize: "12px" } },
        },
        yaxis: {
            labels: {
                style: { colors: "#9CA3AF", fontSize: "12px" },
                formatter: (value) =>
                    value >= 1000 ? `${value / 1000}k` : `${value}`,
            },
        },
        legend: {
            position: "bottom",
            horizontalAlign: "center",
            offsetY: 8,
            itemMargin: { horizontal: 16, vertical: 8 },
        },
        fill: { opacity: 1 },
        colors: ["#9CA3AF", "#3B82F6", "#8B5CF6", "#F59E0B"],
        grid: {
            strokeDashArray: 4,
            yaxis: { lines: { show: true } },
            xaxis: { lines: { show: true } },
            padding: { top: 0, right: 0, bottom: 0, left: 10 },
        },
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm col-span-12">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-6">
                Revenue by Subscription Type
            </h3>
            {isLoading ? (
                <div className="h-80 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : data.length === 0 ? (
                <div className="h-80 flex items-center justify-center text-sm text-gray-400">
                    No revenue data available
                </div>
            ) : (
                <div id="revenue-chart" className="-ml-3">
                    <ReactApexChart
                        options={options}
                        series={series}
                        type="bar"
                        height={320}
                    />
                </div>
            )}
        </div>
    );
};

export default RevenueChart;
