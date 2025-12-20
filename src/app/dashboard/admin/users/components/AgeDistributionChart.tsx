"use client";
import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
});

const AgeDistributionChart: React.FC = () => {
    const series = [
        {
            name: "Users",
            data: [3200, 8900, 6500, 4100, 1889],
        }
    ];

    const options: ApexOptions = {
        chart: {
            type: "bar",
            height: 350,
            toolbar: {
                show: false,
            },
            fontFamily: "inherit",
        },
        colors: ["#8B5CF6"], // Purple
        plotOptions: {
            bar: {
                borderRadius: 4,
                columnWidth: "60%",
                distributed: false, // Same color for all
            }
        },
        dataLabels: {
            enabled: false,
        },
        xaxis: {
            categories: ["18-24", "25-34", "35-44", "45-54", "55+"],
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
            labels: {
                style: {
                    colors: "#9CA3AF",
                    fontSize: "12px",
                },
            },
        },
        yaxis: {
            labels: {
                style: {
                    colors: "#9CA3AF",
                    fontSize: "12px",
                },
            },
        },
        grid: {
            strokeDashArray: 4,
            borderColor: '#f1f1f1',
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
