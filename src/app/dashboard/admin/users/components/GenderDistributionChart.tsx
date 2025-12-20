"use client";
import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
});

const GenderDistributionChart: React.FC = () => {
    const series = [52, 45, 3];

    const options: ApexOptions = {
        chart: {
            type: "pie",
            height: 350,
            fontFamily: "inherit",
        },
        labels: ["Female", "Male", "Other"],
        colors: ["#8B5CF6", "#3B82F6", "#10B981"],
        legend: {
            position: 'right', // Can adjust position
            markers: {
                // width: 12,
                // height: 12,
            },
        },
        dataLabels: {
            enabled: true,
            formatter: function (val, opts) {
                return opts.w.config.labels[opts.seriesIndex] + " " + Math.round(val as number) + "%";
            },
            style: {
                colors: ['#8B5CF6', '#3B82F6', '#10B981'], // Match label color to slice or use contrast
                fontSize: '12px',
                fontFamily: 'inherit',
                fontWeight: 600,
            },
            background: {
                enabled: false,
            },
            dropShadow: {
                enabled: false,
            }
        },
        plotOptions: {
            pie: {
                dataLabels: {
                    offset: -10, // Adjust if needed
                    minAngleToShowLabel: 10
                }
            }
        },
        // To approximate the design look (labels outside with line?)
        // The design shows labels floating around the pie. Apexcharts pie usually has labels inside or legend.
        // Let's stick to standard pie for now or attempt custom positioning.
        // Apexcharts "pie" with `dataLabels.style.colors` matching series might work if background is white?
        // Actually, let's keep it simple. Clean pie chart.
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
