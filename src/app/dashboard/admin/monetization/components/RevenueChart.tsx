"use client";
import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
});

const RevenueChart: React.FC = () => {
    const series = [
        {
            name: "Monthly Subscriptions",
            data: [12000, 13500, 14200, 15800, 17500, 18500],
        },
        {
            name: "Annual Subscriptions",
            data: [18000, 21000, 19500, 24000, 26000, 28900],
        },
        {
            name: "Lifetime Purchases",
            data: [5000, 6200, 5800, 7100, 8500, 9300],
        },
        {
            name: "B2B Revenue",
            data: [3000, 3500, 4100, 4800, 5200, 5800],
        },
    ];

    const options: ApexOptions = {
        chart: {
            type: "bar",
            height: 350,
            stacked: true,
            toolbar: {
                show: false,
            },
            fontFamily: "inherit",
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: "55%",
                borderRadius: 0,
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            show: true,
            width: 0,
            colors: ["transparent"],
        },
        xaxis: {
            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
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
                formatter: (value) => {
                    return value >= 1000 ? `${value / 1000}k` : `${value}`;
                }
            },
        },
        legend: {
            position: "bottom",
            horizontalAlign: "center",
            offsetY: 8,
            markers: {
                // radius: 0, 
            },
            itemMargin: {
                horizontal: 16,
                vertical: 8
            },
        },
        fill: {
            opacity: 1,
        },
        colors: ["#8B5CF6", "#3B82F6", "#10B981", "#F59E0B"], // Purple, Blue, Green, Orange
        grid: {
            strokeDashArray: 4,
            yaxis: {
                lines: {
                    show: true
                }
            },
            xaxis: {
                lines: {
                    show: true
                }
            },
            padding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 10
            }
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm col-span-12">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-6">
                Revenue by Subscription Type (Last 6 Months)
            </h3>
            <div id="revenue-chart" className="-ml-3">
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

export default RevenueChart;
