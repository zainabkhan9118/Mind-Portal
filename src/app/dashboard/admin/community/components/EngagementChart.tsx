"use client";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import type { CommunityEngagementPoint } from "@/lib/api/types";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function EngagementChart({ data }: { data: CommunityEngagementPoint[] }) {
    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center h-[300px] text-gray-400 text-sm">Loading...</div>
        );
    }
    const series = [
        { name: "Posts", data: data.map((p) => p.posts ?? 0) },
        { name: "Comments", data: data.map((p) => p.comments ?? 0) },
    ];
    const options: ApexOptions = {
        chart: { type: "bar", toolbar: { show: false }, fontFamily: "inherit" },
        colors: ["#9810FA", "#3C50E0"],
        plotOptions: { bar: { borderRadius: 4, columnWidth: "60%" } },
        xaxis: {
            categories: data.map((p) => p.period),
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: { style: { colors: "#9CA3AF", fontSize: "12px" } },
        },
        yaxis: { labels: { style: { colors: "#9CA3AF", fontSize: "12px" } } },
        grid: { strokeDashArray: 5, borderColor: "#E2E8F0" },
        legend: { position: "bottom", horizontalAlign: "center" },
    };
    return <ReactApexChart options={options} series={series} type="bar" height={300} />;
}
