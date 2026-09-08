"use client";
import React from "react";
import { Users, MessageSquare, CalendarDays, UserCheck, Radio } from "lucide-react";
import communityApi from "@/lib/api/communityApi";
import type {
    CommunityDashboard,
    CommunityGrowthPoint,
    CommunityEngagementPoint,
    CommunityGroup,
    CommunityGroupSession,
    CommunityPost,
} from "@/lib/api/types";
import MemberGrowthChart from "./components/MemberGrowthChart";
import EngagementChart from "./components/EngagementChart";
import GroupsTable from "./components/GroupsTable";
import SessionsTable from "./components/SessionsTable";
import GroupsModal from "./components/GroupsModal";
import SessionsModal from "./components/SessionsModal";
import RecentPosts from "./components/RecentPosts";
import StatsCard from "./components/StatsCard";
import MetricCard from "./components/MetricCard";
import SearchInput from "./components/SearchInput";

const TOP_N = 10;

export default function CommunityPage() {
    const [searchTerm, setSearchTerm] = React.useState("");
    const [sessionSearch, setSessionSearch] = React.useState("");
    const [dashboard, setDashboard] = React.useState<CommunityDashboard | null>(null);
    const [growth, setGrowth] = React.useState<CommunityGrowthPoint[]>([]);
    const [engagementData, setEngagementData] = React.useState<CommunityEngagementPoint[]>([]);
    const [groups, setGroups] = React.useState<CommunityGroup[]>([]);
    const [sessions, setSessions] = React.useState<CommunityGroupSession[]>([]);
    const [recentPosts, setRecentPosts] = React.useState<CommunityPost[]>([]);
    const [isGroupsModalOpen, setIsGroupsModalOpen] = React.useState(false);
    const [isSessionsModalOpen, setIsSessionsModalOpen] = React.useState(false);

    React.useEffect(() => {
        Promise.all([
            communityApi.getDashboard(),
            communityApi.getGrowth("weekly"),
            communityApi.getEngagement("weekly"),
            communityApi.getGroups({ size: 100 }),
            communityApi.getPosts({ size: 5 }),
            communityApi.getSessions({ size: 100, ordering: "-participants_count" }),
        ])
            .then(([dash, grow, eng, grps, posts, sess]) => {
                setDashboard(dash);
                setGrowth(grow);
                setEngagementData(eng);
                setGroups(grps.results);
                setRecentPosts(posts.results);
                setSessions(sess.results);
            })
            .catch(console.error);
    }, []);

    const fmt = (n: number | undefined | null) =>
        n != null ? n.toLocaleString() : "–";

    const filteredGroups = React.useMemo(
        () => groups.filter((g) => g.name.toLowerCase().includes(searchTerm.toLowerCase())),
        [searchTerm, groups],
    );

    const filteredSessions = React.useMemo(
        () => sessions.filter((s) =>
            s.title.toLowerCase().includes(sessionSearch.toLowerCase()) ||
            (s.group_name ?? "").toLowerCase().includes(sessionSearch.toLowerCase())
        ),
        [sessionSearch, sessions],
    );

    const topGroups = React.useMemo(() => filteredGroups.slice(0, TOP_N), [filteredGroups]);
    const topSessions = React.useMemo(() => filteredSessions.slice(0, TOP_N), [filteredSessions]);

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
                <StatsCard
                    icon={<Users className="w-6 h-6" />}
                    iconBgClass="bg-[#F4ECFF] dark:bg-purple-900/20"
                    iconColorClass="text-[#9810FA]"
                    title="Active Group"
                    value={fmt(dashboard?.active_groups ?? dashboard?.total_groups)}
                    change={dashboard?.active_groups_change}
                    changeSuffix="this month"
                    subtitle="This month"
                />
                <StatsCard
                    icon={<CalendarDays className="w-6 h-6" />}
                    iconBgClass="bg-[#EAF2FF] dark:bg-blue-900/20"
                    iconColorClass="text-[#2F80ED]"
                    title="Group Sessions"
                    value={fmt(dashboard?.group_sessions)}
                    subtitle="This month"
                />
                <StatsCard
                    icon={<UserCheck className="w-6 h-6" />}
                    iconBgClass="bg-[#E6F9F0] dark:bg-green-900/20"
                    iconColorClass="text-[#027A48]"
                    title="Average Participants"
                    value={fmt(dashboard?.avg_participants)}
                    subtitle="Per session"
                />
                <StatsCard
                    icon={<MessageSquare className="w-6 h-6" />}
                    iconBgClass="bg-[#FFF0EC] dark:bg-orange-900/20"
                    iconColorClass="text-[#E0580C]"
                    title="Chat Messages"
                    value={fmt(dashboard?.chat_messages)}
                    change={dashboard?.chat_messages_change}
                    changeSuffix="this month"
                    subtitle="This month"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
                        Member Growth (Weekly)
                    </h3>
                    <MemberGrowthChart data={growth} />
                </div>

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
                    <div className="flex items-center gap-3">
                        <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Search groups..." />
                        <button
                            onClick={() => setIsGroupsModalOpen(true)}
                            className="whitespace-nowrap px-4 py-2 rounded-xl text-sm font-semibold text-[#9810FA] border border-[#9810FA]/30 hover:bg-[#9810FA]/5 transition-colors"
                        >
                            See All
                        </button>
                    </div>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                    <GroupsTable
                        groups={topGroups}
                        emptyMessage={groups.length === 0 ? "Loading..." : "No groups found"}
                    />
                </div>
            </div>

            {/* Group Sessions Rankings */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                    <div className="flex items-center gap-2">
                        <Radio className="w-5 h-5 text-blue-500" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white whitespace-nowrap">
                            Group Sessions
                        </h3>
                        <span className="text-xs text-gray-400 font-normal ml-1">ranked by participants</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <SearchInput value={sessionSearch} onChange={setSessionSearch} placeholder="Search sessions..." />
                        <button
                            onClick={() => setIsSessionsModalOpen(true)}
                            className="whitespace-nowrap px-4 py-2 rounded-xl text-sm font-semibold text-blue-600 border border-blue-600/30 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                        >
                            See All
                        </button>
                    </div>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                    <SessionsTable
                        sessions={topSessions}
                        emptyMessage={sessions.length === 0 ? "Loading..." : "No sessions found"}
                    />
                </div>
            </div>

            {/* Recent Posts */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Recent Posts</h3>
                <RecentPosts posts={recentPosts} />
            </div>

            {/* Bottom Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard
                    title="Engagement Rate"
                    value={dashboard?.engagement_rate != null ? `${dashboard.engagement_rate.toFixed(1)}%` : "–"}
                    valueColorClass="text-[#9810FA]"
                    subtitle="of members actively participate"
                />
                <MetricCard
                    title="Total Groups"
                    value={fmt(dashboard?.total_groups)}
                    valueColorClass="text-blue-500"
                    subtitle="Active community groups"
                />
                <MetricCard
                    title="Open Reports"
                    value={fmt(dashboard?.open_reports)}
                    valueColorClass="text-orange-500"
                    subtitle="Awaiting moderation review"
                />
            </div>

            <GroupsModal
                isOpen={isGroupsModalOpen}
                onClose={() => setIsGroupsModalOpen(false)}
                groups={filteredGroups}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
            />

            <SessionsModal
                isOpen={isSessionsModalOpen}
                onClose={() => setIsSessionsModalOpen(false)}
                sessions={filteredSessions}
                searchTerm={sessionSearch}
                onSearchChange={setSessionSearch}
            />
        </div>
    );
}
