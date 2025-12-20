"use client";
import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
});

const UserGrowthChart: React.FC = () => {
    const series = [
        {
            name: "Total Users",
            data: [18500, 19200, 20100, 21500, 23200, 24589],
        },
        {
            name: "Premium Users",
            data: [3200, 3500, 3800, 4200, 4600, 5010],
        }
    ];

    const options: ApexOptions = {
        chart: {
            type: "line",
            height: 350,
            toolbar: {
                show: false,
            },
            fontFamily: "inherit",
            zoom: {
                enabled: false
            }
        },
        colors: ["#8B5CF6", "#F59E0B"], // Purple, Orange
        stroke: {
            curve: "smooth",
            width: 3,
        },
        dataLabels: {
            enabled: false,
        },
        xaxis: {
            categories: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"],
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
        legend: {
            position: "top",
            horizontalAlign: "right",
        },
        grid: {
            strokeDashArray: 4,
            borderColor: '#f1f1f1',
            padding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 10
            }
        },
        markers: {
            size: 4,
            colors: ["#fff"],
            strokeColors: ["#8B5CF6", "#F59E0B"],
            strokeWidth: 2,
            hover: {
                size: 7,
            }
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm h-full">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-6">
                User Growth (Last 6 Weeks)
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
