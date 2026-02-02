import React, { useState } from "react";
import {
    Send,
    UserPlus,
    Shield,
    Bell,
    Eye,
    Smartphone,
    Users,
    Zap,
    Download,
    Share2,
    Mic,
    History,
    ChevronRight
} from "lucide-react";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Switch from "@/components/form/switch/Switch";

const adminRoles = [
    {
        role: "Admin User",
        email: "admin@mindportal.com",
        badges: [
            { label: "Super Admin", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300" },
            { label: "Full Access", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300" },
        ],
    },
    {
        role: "Content Manager",
        email: "content@mindportal.com",
        badges: [
            { label: "Content Editor", color: "bg-pink-100 text-pink-700 dark:bg-pink-900/20 dark:text-pink-300" },
            { label: "Content Only", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300" },
        ],
    },
    {
        role: "Analytics Team",
        email: "analytics@mindportal.com",
        badges: [
            { label: "Analytics Viewer", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300" },
            { label: "Read Only", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300" },
        ],
    },
];

const AdminOverview: React.FC = () => {
    const [featureFlags, setFeatureFlags] = useState({
        vrMode: true,
        groupSessions: true,
        aiRecommendations: false,
        offlineDownloads: true,
        socialSharing: false,
        voiceCommands: false,
    });

    const handleToggle = (key: keyof typeof featureFlags) => {
        setFeatureFlags((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Top Section: Permissions and Notifications */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-[32px] border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-purple-600" />
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Admin Permissions</h3>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-[#9810FA] text-white rounded-lg text-sm font-medium hover:bg-[#8000E0] transition-colors">
                            <UserPlus className="w-4 h-4" />
                            Add New Admins
                        </button>
                    </div>

                    <div className="space-y-4">
                        {adminRoles.map((user, index) => (
                            <div key={index} className="flex items-start justify-between p-6 bg-gray-50/50 dark:bg-gray-900/50 rounded-3xl border border-gray-50 dark:border-gray-700 shadow-sm group">
                                <div className="space-y-1">
                                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">{user.role}</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 pb-2">{user.email}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {user.badges.map((badge, idx) => (
                                            <span key={idx} className={`px-3 py-1 rounded-lg text-[10px] font-bold tracking-wide uppercase ${badge.color}`}>
                                                {badge.label}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <button className="text-sm font-semibold text-[#9810FA] hover:text-[#8000E0] transition-colors">Edit</button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-8 rounded-[32px] border border-gray-100 dark:border-gray-700 shadow-sm space-y-8">
                    <div className="flex items-center gap-2 mb-2">
                        <Bell className="w-5 h-5 text-purple-600" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Push Notifications</h3>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <Label htmlFor="targetAudience" className="text-sm font-bold text-gray-900 dark:text-white mb-2 block">Target Audience</Label>
                            <Input
                                id="targetAudience"
                                placeholder="e.g. All Users, Premium Members..."
                                className="bg-gray-50/50 dark:bg-gray-900 rounded-xl"
                            />
                        </div>

                        <div>
                            <Label htmlFor="message" className="text-sm font-bold text-gray-900 dark:text-white mb-2 block">Message</Label>
                            <textarea
                                id="message"
                                placeholder="Enter your notification message..."
                                rows={4}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#9810FA] focus:border-transparent transition-all resize-none shadow-theme-xs placeholder:text-gray-400 text-sm"
                            ></textarea>
                        </div>

                        <div className="p-5 rounded-2xl border border-purple-100/50 dark:border-purple-900/40 bg-purple-50/10 dark:bg-purple-900/5 flex items-center justify-between">
                            <div>
                                <h5 className="text-sm font-bold text-gray-900 dark:text-white">Schedule Notification</h5>
                                <p className="text-[11px] text-gray-500 dark:text-gray-400">Send notification at a specific time to all users</p>
                            </div>
                            <Switch label="" color="blue" />
                        </div>
                    </div>

                    <Button className="w-full py-3.5 bg-[#9810FA] hover:bg-[#8000E0] text-white rounded-2xl font-bold shadow-lg shadow-purple-500/20 text-sm tracking-wide transition-all border-none">
                        Send Notification
                    </Button>
                </div>
            </div>

            {/* Feature Flags Section */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-[32px] border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="flex items-center gap-2 mb-8">
                    <Eye className="w-5 h-5 text-purple-600" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Feature Flags</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    {[
                        { id: "vrMode", label: "VR Mode", desc: "Enable VR environment experiences", icon: <Smartphone className="w-6 h-6" /> },
                        { id: "groupSessions", label: "Group Sessions", desc: "Allow users to create and join group sessions", icon: <Users className="w-6 h-6" /> },
                        { id: "aiRecommendations", label: "AI Recommendations", desc: "Beta feature: AI-powered content recommendations", icon: <Zap className="w-6 h-6" /> },
                        { id: "offlineDownloads", label: "Offline Downloads", desc: "Allow premium users to download content", icon: <Download className="w-6 h-6" /> },
                        { id: "socialSharing", label: "Social Sharing", desc: "Enable sharing achievements to social media", icon: <Share2 className="w-6 h-6" /> },
                        { id: "voiceCommands", label: "Voice Commands", desc: "Beta feature: Voice-controlled navigation", icon: <Mic className="w-6 h-6" /> },
                    ].map((feature) => (
                        <div key={feature.id} className="flex items-center justify-between p-6 bg-gray-50/50 dark:bg-gray-900/50 rounded-3xl border border-gray-50 dark:border-gray-700">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm text-gray-400">
                                    {feature.icon}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white mb-1">{feature.label}</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{feature.desc}</p>
                                </div>
                            </div>
                            <Switch
                                label=""
                                defaultChecked={featureFlags[feature.id as keyof typeof featureFlags]}
                                onChange={() => handleToggle(feature.id as keyof typeof featureFlags)}
                                color="blue"
                            />
                        </div>
                    ))}
                </div>

                <div className="mt-8 flex justify-end">
                    <Button className="px-10 bg-[#9810FA] hover:bg-[#8000E0] text-white rounded-xl py-3 h-auto font-bold border-none">
                        Save Changes
                    </Button>
                </div>
            </div>

            {/* Change Log Section */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-[32px] border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="flex items-center gap-2 mb-8">
                    <History className="w-5 h-5 text-purple-600" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Change Log</h3>
                </div>

                <div className="space-y-4">
                    {[
                        { action: "Published new meditation session: Morning Flow", time: "2025-12-08 14:23 • Admin User" },
                        { action: "Updated playlist: Deep Sleep Collection", time: "2025-12-08 11:15 • Content Manager" },
                        { action: "Changed user subscription: sarah.j@email.com to Premium", time: "2025-12-07 18:45 • Admin User" },
                        { action: "Enabled feature flag: AI Recommendations (Beta)", time: "2025-12-07 16:30 • Admin User" },
                        { action: "Added new VR environment: Beach Sunset", time: "2025-12-07 09:20 • Content Manager" },
                    ].map((log, index) => (
                        <div key={index} className="flex items-start gap-4 p-5 bg-gray-50/50 dark:bg-gray-900/30 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
                            <span className="mt-1.5 w-2 h-2 rounded-full bg-[#9810FA] shrink-0 group-hover:scale-125 transition-transform"></span>
                            <div>
                                <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{log.action}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{log.time}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 text-center border-t border-gray-50 dark:border-gray-700 pt-6">
                    <button className="text-purple-600 hover:text-purple-700 text-sm font-bold tracking-wide">View Full History</button>
                </div>
            </div>

            {/* System & Actions Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* System Status */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-[32px] border border-gray-100 dark:border-gray-700 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-8">System Status</h3>
                    <div className="space-y-6">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500 dark:text-gray-400 font-medium">API Status</span>
                            <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 text-[10px] font-bold uppercase tracking-wider border border-green-100 dark:border-green-900/40">Operational</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500 dark:text-gray-400 font-medium">Database</span>
                            <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 text-[10px] font-bold uppercase tracking-wider border border-green-100 dark:border-green-900/40">Healthy</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500 dark:text-gray-400 font-medium">CDN</span>
                            <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 text-[10px] font-bold uppercase tracking-wider border border-green-100 dark:border-green-900/40">Active</span>
                        </div>
                    </div>
                </div>

                {/* App Version */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-[32px] border border-gray-100 dark:border-gray-700 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-8">App Version</h3>
                    <div className="space-y-6">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500 dark:text-gray-400 font-medium">Mobile App</span>
                            <span className="text-gray-900 dark:text-white font-bold">v2.4.1</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500 dark:text-gray-400 font-medium">VR App</span>
                            <span className="text-gray-900 dark:text-white font-bold">v1.8.5</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500 dark:text-gray-400 font-medium">API</span>
                            <span className="text-gray-900 dark:text-white font-bold">v3.2.0</span>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-[32px] border border-gray-100 dark:border-gray-700 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-8">Quick Actions</h3>
                    <div className="space-y-3">
                        <button className="w-full text-left p-4 rounded-2xl bg-gray-50/50 dark:bg-gray-900/50 text-sm font-bold text-gray-700 dark:text-gray-200 hover:text-[#9810FA] hover:bg-white dark:hover:bg-gray-800 transition-all flex items-center justify-between group border border-transparent hover:border-purple-100 dark:hover:border-purple-900/40">
                            <span>Export User Data</span>
                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#9810FA] group-hover:translate-x-1 transition-all" />
                        </button>
                        <button className="w-full text-left p-4 rounded-2xl bg-gray-50/50 dark:bg-gray-900/50 text-sm font-bold text-gray-700 dark:text-gray-200 hover:text-[#9810FA] hover:bg-white dark:hover:bg-gray-800 transition-all flex items-center justify-between group border border-transparent hover:border-purple-100 dark:hover:border-purple-900/40">
                            <span>Generate Report</span>
                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#9810FA] group-hover:translate-x-1 transition-all" />
                        </button>
                        <button className="w-full text-left p-4 rounded-2xl bg-gray-50/50 dark:bg-gray-900/50 text-sm font-bold text-gray-700 dark:text-gray-200 hover:text-[#9810FA] hover:bg-white dark:hover:bg-gray-800 transition-all flex items-center justify-between group border border-transparent hover:border-purple-100 dark:hover:border-purple-900/40">
                            <span>Clear Cache</span>
                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#9810FA] group-hover:translate-x-1 transition-all" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOverview;
