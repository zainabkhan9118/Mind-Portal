"use client";
import React from "react";
import dynamic from "next/dynamic";
import { Users, MessageSquare, ArrowUpRight, Search, ThumbsUp, CalendarDays, UserCheck } from "lucide-react";
import { ApexOptions } from "apexcharts";
import communityApi from "@/lib/api/communityApi";
import type {
    CommunityDashboard,
    CommunityGrowthPoint,
    CommunityEngagementPoint,
    CommunityGroup,
    CommunityPost,
} from "@/lib/api/types";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const LOADING_PLACEHOLDER = (
    <div className="flex items-center justify-center h-[300px] text-gray-400 text-sm">Loading...</div>
);

function MemberGrowthChart({ data }: { data: CommunityGrowthPoint[] }) {
    if (data.length === 0) return LOADING_PLACEHOLDER;
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

function EngagementChart({ data }: { data: CommunityEngagementPoint[] }) {
    if (data.length === 0) return LOADING_PLACEHOLDER;
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

export default function CommunityPage() {
    const [searchTerm, setSearchTerm] = React.useState("");
    const [dashboard, setDashboard] = React.useState<CommunityDashboard | null>(null);
    const [growth, setGrowth] = React.useState<CommunityGrowthPoint[]>([]);
    const [engagementData, setEngagementData] = React.useState<CommunityEngagementPoint[]>([]);
    const [groups, setGroups] = React.useState<CommunityGroup[]>([]);
    const [recentPosts, setRecentPosts] = React.useState<CommunityPost[]>([]);

    React.useEffect(() => {
        Promise.all([
            communityApi.getDashboard(),
            communityApi.getGrowth("weekly"),
            communityApi.getEngagement("weekly"),
            communityApi.getGroups({ size: 20 }),
            communityApi.getPosts({ size: 5 }),
        ])
            .then(([dash, grow, eng, grps, posts]) => {
                setDashboard(dash);
                setGrowth(grow);
                setEngagementData(eng);
                setGroups(grps.results);
                setRecentPosts(posts.results);
            })
            .catch(console.error);
    }, []);

    const fmt = (n: number | undefined | null) =>
        n != null ? n.toLocaleString() : "–";

    const filteredGroups = React.useMemo(
        () => groups.filter((g) => g.name.toLowerCase().includes(searchTerm.toLowerCase())),
        [searchTerm, groups],
    );

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
                {/* Active Group */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between h-full min-h-[160px]">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#F4ECFF] dark:bg-purple-900/20 flex items-center justify-center text-[#9810FA] shrink-0">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Group</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                {fmt(dashboard?.active_groups ?? dashboard?.total_groups)}
                            </h3>
                        </div>
                    </div>
                    {dashboard?.active_groups_change != null ? (
                        <div className="flex items-center gap-1 text-sm font-medium text-[#22AD5C]">
                            <ArrowUpRight className="w-4 h-4" />
                            <span>+{dashboard.active_groups_change.toFixed(1)}% this month</span>
                        </div>
                    ) : (
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">This month</div>
                    )}
                </div>

                {/* Group Sessions */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between h-full min-h-[160px]">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#EAF2FF] dark:bg-blue-900/20 flex items-center justify-center text-[#2F80ED] shrink-0">
                            <CalendarDays className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Group Sessions</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                {fmt(dashboard?.group_sessions)}
                            </h3>
                        </div>
                    </div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">This month</div>
                </div>

                {/* Average Participants */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between h-full min-h-[160px]">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#E6F9F0] dark:bg-green-900/20 flex items-center justify-center text-[#027A48] shrink-0">
                            <UserCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Participants</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                {fmt(dashboard?.avg_participants)}
                            </h3>
                        </div>
                    </div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Per session</div>
                </div>

                {/* Chat Messages */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between h-full min-h-[160px]">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#FFF0EC] dark:bg-orange-900/20 flex items-center justify-center text-[#E0580C] shrink-0">
                            <MessageSquare className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Chat Messages</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                {fmt(dashboard?.chat_messages)}
                            </h3>
                        </div>
                    </div>
                    {dashboard?.chat_messages_change != null ? (
                        <div className="flex items-center gap-1 text-sm font-medium text-[#22AD5C]">
                            <ArrowUpRight className="w-4 h-4" />
                            <span>+{dashboard.chat_messages_change.toFixed(1)}% this month</span>
                        </div>
                    ) : (
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">This month</div>
                    )}
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Member Growth Chart */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
                        Member Growth (Weekly)
                    </h3>
                    <MemberGrowthChart data={growth} />
                </div>

                {/* Posts & Comments Chart */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
                        Posts &amp; Comments Activity
                    </h3>
                    <EngagementChart data={engagementData} />
                </div>
            </div>

            {/* Groups Table */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white whitespace-nowrap">
                        Community Groups
                    </h3>
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
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                <th className="p-4 pl-6">Rank</th>
                                <th className="p-4">Group Name</th>
                                <th className="p-4 text-center">Members</th>
                                <th className="p-4 text-center">Created</th>
                                <th className="p-4 pr-6 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700 bg-white dark:bg-gray-800">
                            {filteredGroups.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-400 text-sm">
                                        {groups.length === 0 ? "Loading..." : "No groups found"}
                                    </td>
                                </tr>
                            ) : (
                                filteredGroups.map((group, index) => (
                                    <tr
                                        key={group.id}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                    >
                                        <td className="p-4 pl-6">
                                            <span className="w-8 h-8 rounded-full bg-[#9810FA]/10 text-[#9810FA] flex items-center justify-center text-xs font-bold">
                                                {String(index + 1).padStart(2, "0")}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm font-semibold text-gray-900 dark:text-white">
                                            {group.name}
                                        </td>
                                        <td className="p-4 text-center text-sm text-gray-600 dark:text-gray-400">
                                            {group.members_count.toLocaleString()}
                                        </td>
                                        <td className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(group.created_at).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </td>
                                        <td className="p-4 pr-6 text-center">
                                            {group.is_hidden ? (
                                                <span className="inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-[#F2F4F7] text-[#344054] dark:bg-gray-700 dark:text-gray-400">
                                                    Hidden
                                                </span>
                                            ) : (
                                                <span className="inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-[#ECFDF3] text-[#027A48] dark:bg-green-900/20 dark:text-green-400">
                                                    Active
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Recent Posts */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Recent Posts</h3>
                {recentPosts.length === 0 ? (
                    <div className="flex items-center justify-center h-24 text-gray-400 text-sm">
                        Loading...
                    </div>
                ) : (
                    <div className="space-y-4">
                        {recentPosts.map((post) => (
                            <div
                                key={post.id}
                                className="flex flex-col p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-[#9810FA]/30 hover:shadow-sm transition-all bg-gray-50/50 dark:bg-gray-900/50 gap-3"
                            >
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-3">
                                        <h4 className="font-semibold text-gray-900 dark:text-white">
                                            {post.content || post.title || "—"}
                                        </h4>
                                        <span
                                            className={`px-2.5 py-1 rounded text-[10px] uppercase font-bold tracking-wide ${
                                                post.status === "approved"
                                                    ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                                                    : post.status === "hidden" || post.status === "rejected"
                                                      ? "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                                                      : "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                                            }`}
                                        >
                                            {post.status}
                                        </span>
                                        {post.group_name && (
                                            <span className="px-2.5 py-1 rounded text-[10px] font-medium bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
                                                {post.group_name}
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                        {new Date(post.created_at).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                    </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-6 text-xs text-gray-500 dark:text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4 text-gray-400" />
                                        <span>{post.user_name ?? "Unknown"}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <ThumbsUp className="w-4 h-4 text-gray-400" />
                                        <span>{(post.like_count ?? 0).toLocaleString()} likes</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4 text-gray-400" />
                                        <span>{(post.comment_count ?? 0).toLocaleString()} comments</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Bottom Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col h-[180px] relative">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white absolute top-6 left-6">
                        Engagement Rate
                    </h4>
                    <div className="flex-1 flex items-center justify-center">
                        <span className="text-5xl font-bold text-[#9810FA]">
                            {dashboard?.engagement_rate != null
                                ? `${dashboard.engagement_rate.toFixed(1)}%`
                                : "–"}
                        </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center pb-2">
                        of members actively participate
                    </p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col h-[180px] relative">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white absolute top-6 left-6">
                        Total Groups
                    </h4>
                    <div className="flex-1 flex items-center justify-center">
                        <span className="text-5xl font-bold text-blue-500">
                            {fmt(dashboard?.total_groups)}
                        </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center pb-2">
                        Active community groups
                    </p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col h-[180px] relative">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white absolute top-6 left-6">
                        Open Reports
                    </h4>
                    <div className="flex-1 flex items-center justify-center">
                        <span className="text-5xl font-bold text-orange-500">
                            {fmt(dashboard?.open_reports)}
                        </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center pb-2">
                        Awaiting moderation review
                    </p>
                </div>
            </div>
        </div>
    );
}
