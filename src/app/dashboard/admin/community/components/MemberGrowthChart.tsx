"use client";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import type { CommunityGrowthPoint } from "@/lib/api/types";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function MemberGrowthChart({ data }: { data: CommunityGrowthPoint[] }) {
    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center h-[300px] text-gray-400 text-sm">Loading...</div>
        );
    }
    const series = [{ name: "Members", data: data.map((p) => p.count ?? 0) }];
    const options: ApexOptions = {
        chart: { type: "line", toolbar: { show: false }, zoom: { enabled: false }, fontFamily: "inherit" },
        colors: ["#9810FA"],
        stroke: { curve: "smooth", width: 2 },
        xaxis: {
            categories: data.map((p) => p.period),
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: { style: { colors: "#9CA3AF", fontSize: "12px" } },
        },
        yaxis: { show: true, labels: { style: { colors: "#9CA3AF", fontSize: "12px" } } },
        grid: { strokeDashArray: 5, borderColor: "#E2E8F0" },
        legend: { position: "bottom", horizontalAlign: "center" },
    };
    return <ReactApexChart options={options} series={series} type="line" height={300} />;
}
