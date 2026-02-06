"use client";
import React from "react";
import dynamic from "next/dynamic";
import { Users, Calendar, MessageSquare, Clock, Activity, ArrowUpRight, CheckCircle2, Circle, Search } from "lucide-react";
import { ApexOptions } from "apexcharts";

// Dynamically import ApexCharts to avoid SSR issues
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function CommunityPage() {
    const [searchTerm, setSearchTerm] = React.useState("");

    const groups = [
        { rank: 1, name: "Morning meditation for boost your focus", members: 236, sessions: 15, messages: "1,524", activity: "Low Activity", activityColor: "bg-[#F2F4F7] text-[#344054] dark:bg-gray-800 dark:text-gray-400" },
        { rank: 2, name: "Evening Calm & Sleep", members: 526, sessions: 12, messages: "12", activity: "High", activityColor: "bg-[#ECFDF3] text-[#027A48] dark:bg-green-900/20 dark:text-green-400" },
        { rank: 3, name: "Deep Focus Flow", members: 52, sessions: 36, messages: "36", activity: "Medium", activityColor: "bg-[#FFF7E6] text-[#FF9F0A] dark:bg-orange-900/20 dark:text-orange-400" },
        { rank: 4, name: "Guided Breathwork", members: 63, sessions: 85, messages: "85", activity: "Low Activity", activityColor: "bg-[#F2F4F7] text-[#344054] dark:bg-gray-800 dark:text-gray-400" },
        { rank: 5, name: "VR Space Explorers", members: 23, sessions: 96, messages: "96", activity: "High", activityColor: "bg-[#ECFDF3] text-[#027A48] dark:bg-green-900/20 dark:text-green-400" },
        { rank: 6, name: "360 Nature Walk", members: 32, sessions: 12, messages: "12", activity: "Medium", activityColor: "bg-[#FFF7E6] text-[#FF9F0A] dark:bg-orange-900/20 dark:text-orange-400" },
        { rank: 7, name: "Mindfulness for Beginners", members: 54, sessions: 20, messages: "20", activity: "High", activityColor: "bg-[#ECFDF3] text-[#027A48] dark:bg-green-900/20 dark:text-green-400" },
        { rank: 8, name: "Zen Garden Group", members: 325, sessions: "09", messages: "09", activity: "Medium", activityColor: "bg-[#FFF7E6] text-[#FF9F0A] dark:bg-orange-900/20 dark:text-orange-400" },
        { rank: 9, name: "Ocean Ambience", members: 326, sessions: 23, messages: "23", activity: "High", activityColor: "bg-[#ECFDF3] text-[#027A48] dark:bg-green-900/20 dark:text-green-400" },
        { rank: 10, name: "Stress Relief Circle", members: 74, sessions: 220, messages: "220", activity: "Medium", activityColor: "bg-[#FFF7E6] text-[#FF9F0A] dark:bg-orange-900/20 dark:text-orange-400" },
    ];

    const filteredGroups = React.useMemo(() => {
        return groups.filter(g => g.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [searchTerm, groups]);

    // Chart Data
    const growthChartOptions: ApexOptions = {
        chart: {
            type: "line",
            toolbar: { show: false },
            zoom: { enabled: false },
            fontFamily: "inherit",
        },
        colors: ["#9810FA", "#3C50E0"],
        stroke: { curve: "smooth", width: 2 },
        xaxis: {
            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: { show: true },
        grid: {
            strokeDashArray: 5,
            borderColor: "#E2E8F0",
        },
        legend: {
            position: "bottom",
            horizontalAlign: "center",
            itemMargin: { horizontal: 10, vertical: 0 },
        },
    };

    const growthChartSeries = [
        { name: "Active Groups", data: [50, 60, 70, 100, 120, 150] },
        { name: "Sessions", data: [200, 250, 280, 350, 400, 489] },
    ];

    const chatActivityOptions: ApexOptions = {
        chart: {
            type: "bar",
            toolbar: { show: false },
            fontFamily: "inherit",
        },
        colors: ["#9810FA"],
        plotOptions: {
            bar: { borderRadius: 4, columnWidth: "60%" },
        },
        xaxis: {
            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        grid: {
            strokeDashArray: 5,
            borderColor: "#E2E8F0",
        },
    };

    const chatActivitySeries = [
        { name: "Messages", data: [1200, 1500, 1800, 2100, 2500, 2890] },
    ];

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Community</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Monitor and manage group activities and engagement
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Card 1 */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between h-full min-h-[160px]">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#F4ECFF] dark:bg-purple-900/20 flex items-center justify-center text-[#9810FA] shrink-0">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Group</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">82</h3>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-medium text-[#22AD5C]">
                        <ArrowUpRight className="w-4 h-4" />
                        <span>+10.8% this month</span>
                    </div>
                </div>

                {/* Card 2 */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between h-full min-h-[160px]">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#EAF2FF] dark:bg-blue-900/20 flex items-center justify-center text-[#2F80ED] shrink-0">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Group Sessions</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">489</h3>
                        </div>
                    </div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        This month
                    </div>
                </div>

                {/* Card 3 */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between h-full min-h-[160px]">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#E6F9F0] dark:bg-green-900/20 flex items-center justify-center text-[#027A48] shrink-0">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Participants</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">22</h3>
                        </div>
                    </div>
                    <div className="text-sm font-medium text-[#22AD5C]">
                        Per session
                    </div>
                </div>

                {/* Card 4 */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between h-full min-h-[160px]">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#FFF4ED] dark:bg-orange-900/20 flex items-center justify-center text-[#E0580C] shrink-0">
                            <MessageSquare className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Chat Messages</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">2,890</h3>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-medium text-[#22AD5C]">
                        <ArrowUpRight className="w-4 h-4" />
                        <span>+18.0% this month</span>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Growth Chart */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Community Growth (Last 6 Months)</h3>
                    <div className="h-[300px]">
                        <ReactApexChart options={growthChartOptions} series={growthChartSeries} type="line" height="100%" />
                    </div>
                </div>

                {/* Chat Activity Chart */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Chat Activity</h3>
                    <div className="h-[300px]">
                        <ReactApexChart options={chatActivityOptions} series={chatActivitySeries} type="bar" height="100%" />
                    </div>
                </div>
            </div>

            {/* Most Active Groups */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white whitespace-nowrap">Most Active Groups</h3>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search groups..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 w-full md:w-64"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                        <div className="flex gap-2">
                            <span className="px-3 py-1 bg-[#FFF7E6] text-[#FF9F0A] rounded-full text-[10px] font-bold uppercase dark:bg-orange-900/20 dark:text-orange-400">Medium</span>
                            <span className="px-3 py-1 bg-[#F2F4F7] text-[#344054] rounded-full text-[10px] font-bold uppercase dark:bg-gray-800 dark:text-gray-400">Low</span>
                            <span className="px-3 py-1 bg-[#ECFDF3] text-[#027A48] rounded-full text-[10px] font-bold uppercase dark:bg-green-900/20 dark:text-green-400">High</span>
                        </div>
                    </div>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                <th className="p-4 pl-6">Rank</th>
                                <th className="p-4">Group Name</th>
                                <th className="p-4 text-center">Members</th>
                                <th className="p-4 text-center">Sessions</th>
                                <th className="p-4 text-center">Messages</th>
                                <th className="p-4 pr-6 text-center">Activity</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700 bg-white dark:bg-gray-800">
                            {filteredGroups.map((group, index) => (
                                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="p-4 pl-6">
                                        <span className="w-8 h-8 rounded-full bg-[#9810FA]/10 text-[#9810FA] flex items-center justify-center text-xs font-bold">
                                            {group.rank < 10 ? `0${group.rank}` : group.rank}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm font-semibold text-gray-900 dark:text-white">{group.name}</td>
                                    <td className="p-4 text-center text-sm text-gray-600 dark:text-gray-400">{group.members}</td>
                                    <td className="p-4 text-center text-sm text-gray-600 dark:text-gray-400">{group.sessions}</td>
                                    <td className="p-4 text-center text-sm text-gray-600 dark:text-gray-400">{group.messages}</td>
                                    <td className="p-4 pr-6 text-center">
                                        <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase ${group.activityColor}`}>
                                            {group.activity}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Recent Group Sessions */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Recent Group Sessions</h3>
                <div className="space-y-4">
                    {[
                        { title: "Sunrise Flow", status: "Completed", statusColor: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400", time: "Today, 7:00 AM", group: "Morning Meditators", host: "Sarah M.", participants: 24 },
                        { title: "Deep Sleep Journey", status: "Scheduled", statusColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400", time: "Today, 10:00 PM", group: "Sleep Better Club", host: "Michael C.", participants: 18 },
                        { title: "Mountain Peak Experience", status: "Completed", statusColor: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400", time: "Yesterday, 6:00 PM", group: "VR Explorers", host: "Emma W.", participants: 32 },
                        { title: "Productivity Power Hour", status: "Scheduled", statusColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400", time: "Tomorrow, 9:00 AM", group: "Focus Warriors", host: "James B.", participants: 15 },
                        { title: "Midnight Calm", status: "Completed", statusColor: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400", time: "Yesterday, 11:00 PM", group: "Night Owls", host: "Olivia D.", participants: 21 },
                    ].map((session, index) => (
                        <div key={index} className="flex flex-col p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-[#9810FA]/30 hover:shadow-sm transition-all bg-gray-50/50 dark:bg-gray-900/50 gap-3">
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-3">
                                    <h4 className="font-semibold text-gray-900 dark:text-white">{session.title}</h4>
                                    <span className={`px-2.5 py-1 rounded text-[10px] uppercase font-bold tracking-wide ${session.statusColor}`}>
                                        {session.status}
                                    </span>
                                </div>
                                <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                    {session.time}
                                </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-6 text-xs text-gray-500 dark:text-gray-400">
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-gray-400" />
                                    <span>{session.group}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-400">Host</span>
                                    <span className="text-gray-700 dark:text-gray-300 font-medium">{session.host}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-gray-400" />
                                    <span>{session.participants} participants</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col h-[180px] relative">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white absolute top-6 left-6">Engagement Rate</h4>
                    <div className="flex-1 flex items-center justify-center">
                        <span className="text-5xl font-bold text-[#9810FA]">76%</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center pb-2">of group members actively participate</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col h-[180px] relative">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white absolute top-6 left-6">Most Popular Time</h4>
                    <div className="flex-1 flex items-center justify-center">
                        <span className="text-5xl font-bold text-blue-500">7 PM</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center pb-2">Peak session activity hour</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col h-[180px] relative">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white absolute top-6 left-6">Session Duration</h4>
                    <div className="flex-1 flex items-center justify-center">
                        <span className="text-5xl font-bold text-green-500">38m</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center pb-2">Average group session length</p>
                </div>
            </div>
        </div>
    );
}
