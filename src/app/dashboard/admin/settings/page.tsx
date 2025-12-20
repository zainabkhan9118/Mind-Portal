"use client";
import React, { useState } from "react";
import {
    Shield,
    Bell,
    Eye,
    History,
    Activity,
    Smartphone,
    Zap,
    Check,
    ChevronRight,
    UserPlus,
    Send,
    Download,
    Share2,
    Mic,
    Users,
    ToggleLeft,
    ToggleRight,
    Server,
    Database,
    Globe,
    Trash2,
    FileText
} from "lucide-react";

export default function SettingsPage() {
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
        <div className="p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Admin Control</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Manage system settings, permissions, and notifications.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Admin Permissions */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col h-full">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-purple-600" />
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Admin Permissions</h3>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-[#9810FA] text-white rounded-lg text-sm font-medium hover:bg-[#8000E0] transition-colors">
                            <UserPlus className="w-4 h-4" />
                            Add New Admins
                        </button>
                    </div>

                    <div className="space-y-4 flex-1">
                        {[
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
                        ].map((user, index) => (
                            <div key={index} className="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-700">
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white">{user.role}</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{user.email}</p>
                                    <div className="flex gap-2">
                                        {user.badges.map((badge, idx) => (
                                            <span key={idx} className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wide ${badge.color}`}>
                                                {badge.label}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <button className="text-sm font-medium text-[#9810FA] hover:text-[#8000E0]">Edit</button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Push Notifications */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col h-full">
                    <div className="flex items-center gap-2 mb-6">
                        <Bell className="w-5 h-5 text-purple-600" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Push Notifications</h3>
                    </div>

                    <div className="space-y-6 flex-1">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Target Audience</label>
                            <input
                                type="text"
                                placeholder="e.g. All Users, Premium Members..."
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#9810FA] focus:border-transparent transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
                            <textarea
                                placeholder="Enter your notification message..."
                                rows={4}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#9810FA] focus:border-transparent transition-all resize-none"
                            ></textarea>
                        </div>

                        <button className="w-full py-3 bg-[#9810FA] text-white rounded-lg font-medium hover:bg-[#8000E0] transition-colors flex items-center justify-center gap-2">
                            <Send className="w-4 h-4" />
                            Send Notification
                        </button>

                        <div className="p-4 bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-300 rounded-lg text-sm border border-blue-100 dark:border-blue-800">
                            <span className="font-bold">Tip:</span> Notifications are sent immediately and cannot be undone. Preview before sending.
                        </div>
                    </div>
                </div>

                {/* Feature Flags */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm lg:col-span-2">
                    <div className="flex items-center gap-2 mb-6">
                        <Eye className="w-5 h-5 text-purple-600" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Feature Flags</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                        {[
                            {
                                id: "vrMode",
                                label: "VR Mode",
                                desc: "Enable VR environment experiences",
                                icon: <Smartphone className="w-10 h-10 text-gray-400" />,
                            },
                            {
                                id: "groupSessions",
                                label: "Group Sessions",
                                desc: "Allow users to create and join group sessions",
                                icon: <Users className="w-10 h-10 text-gray-400" />,
                            },
                            {
                                id: "aiRecommendations",
                                label: "AI Recommendations",
                                desc: "Beta feature: AI-powered content recommendations",
                                icon: <Zap className="w-10 h-10 text-gray-400" />,
                            },
                            {
                                id: "offlineDownloads",
                                label: "Offline Downloads",
                                desc: "Allow premium users to download content",
                                icon: <Download className="w-10 h-10 text-gray-400" />,
                            },
                            {
                                id: "socialSharing",
                                label: "Social Sharing",
                                desc: "Enable sharing achievements to social media",
                                icon: <Share2 className="w-10 h-10 text-gray-400" />,
                            },
                            {
                                id: "voiceCommands",
                                label: "Voice Commands",
                                desc: "Beta feature: Voice-controlled navigation",
                                icon: <Mic className="w-10 h-10 text-gray-400" />,
                            },
                        ].map((feature) => (
                            <div key={feature.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{feature.label}</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{feature.desc}</p>
                                </div>
                                <button
                                    onClick={() => handleToggle(feature.id as keyof typeof featureFlags)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${featureFlags[feature.id as keyof typeof featureFlags] ? "bg-[#9810FA]" : "bg-gray-200 dark:bg-gray-600"
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${featureFlags[feature.id as keyof typeof featureFlags] ? "translate-x-6" : "translate-x-1"
                                            }`}
                                    />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 flex justify-end">
                        <button className="px-6 py-2 bg-[#9810FA] text-white rounded-lg font-medium hover:bg-[#8000E0] transition-colors">
                            Save Changes
                        </button>
                    </div>
                </div>

                {/* Change Log */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm lg:col-span-2">
                    <div className="flex items-center gap-2 mb-6">
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
                            <div key={index} className="flex items-start gap-3 p-3 bg-gray-50/50 dark:bg-gray-900/30 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                <span className="mt-1.5 w-2 h-2 rounded-full bg-[#9810FA] shrink-0"></span>
                                <div>
                                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{log.action}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{log.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 text-center">
                        <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">View Full History</button>
                    </div>
                </div>

                {/* System & Actions Section */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* System Status */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-6">System Status</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600 dark:text-gray-400">API Status</span>
                                <span className="px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 text-xs font-medium">Operational</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Database</span>
                                <span className="px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 text-xs font-medium">Healthy</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600 dark:text-gray-400">CDN</span>
                                <span className="px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 text-xs font-medium">Active</span>
                            </div>
                        </div>
                    </div>

                    {/* App Version */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-6">App Version</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Mobile App</span>
                                <span className="text-gray-900 dark:text-white font-medium">v2.4.1</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600 dark:text-gray-400">VR App</span>
                                <span className="text-gray-900 dark:text-white font-medium">v1.8.5</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600 dark:text-gray-400">API</span>
                                <span className="text-gray-900 dark:text-white font-medium">v3.2.0</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h3>
                        <div className="space-y-4">
                            <button className="w-full text-left text-sm text-gray-700 dark:text-gray-300 hover:text-[#9810FA] transition-colors flex items-center justify-between group">
                                <span>Export User Data</span>
                                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#9810FA]" />
                            </button>
                            <button className="w-full text-left text-sm text-gray-700 dark:text-gray-300 hover:text-[#9810FA] transition-colors flex items-center justify-between group">
                                <span>Generate Report</span>
                                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#9810FA]" />
                            </button>
                            <button className="w-full text-left text-sm text-gray-700 dark:text-gray-300 hover:text-[#9810FA] transition-colors flex items-center justify-between group">
                                <span>Clear Cache</span>
                                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#9810FA]" />
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
