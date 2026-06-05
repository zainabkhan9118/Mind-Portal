"use client";
import React, { useEffect, useRef, useState } from "react";
import {
    UserPlus,
    Shield,
    Eye,
    Smartphone,
    Users,
    Zap,
    Download,
    Share2,
    Mic,
    History,
    ChevronRight,
    CheckCircle,
    Loader2,
    X,
} from "lucide-react";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Switch from "@/components/form/switch/Switch";
import settingsApi from "@/lib/api/settingsApi";
import globalApi from "@/lib/api/globalApi";
import type { AdminAccount, AuditLogEntry, HealthStatus, Role } from "@/lib/api/types";
import PushNotifications from "./PushNotifications";

const FEATURE_FLAG_KEYS: Record<string, string> = {
    vrMode: 'vr_mode',
    groupSessions: 'group_sessions',
    aiRecommendations: 'ai_recommendations',
    offlineDownloads: 'offline_downloads',
    socialSharing: 'social_sharing',
    voiceCommands: 'voice_commands',
};

const DEFAULT_FLAGS = {
    vrMode: true,
    groupSessions: true,
    aiRecommendations: false,
    offlineDownloads: true,
    socialSharing: false,
    voiceCommands: false,
};

const EMPTY_ADD_FORM = { email: '', password: '', first_name: '', last_name: '', group_id: '' };
const EMPTY_EDIT_FORM = { first_name: '', last_name: '', is_active: true, group_id: '' };

const AdminOverview: React.FC = () => {
    const [admins, setAdmins] = useState<AdminAccount[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
    const [health, setHealth] = useState<HealthStatus | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [roles, setRoles] = useState<Role[]>([]);

    // Add admin modal
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [addForm, setAddForm] = useState(EMPTY_ADD_FORM);
    const [addError, setAddError] = useState('');
    const [isAddingAdmin, setIsAddingAdmin] = useState(false);

    // Edit admin modal
    const [editingAdmin, setEditingAdmin] = useState<AdminAccount | null>(null);
    const [editForm, setEditForm] = useState(EMPTY_EDIT_FORM);
    const [editError, setEditError] = useState('');
    const [isEditingAdmin, setIsEditingAdmin] = useState(false);

    // Audit log full history modal
    const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
    const [allAuditLogs, setAllAuditLogs] = useState<AuditLogEntry[]>([]);
    const [auditPage, setAuditPage] = useState(1);
    const [auditTotal, setAuditTotal] = useState(0);
    const [isAuditLoading, setIsAuditLoading] = useState(false);
    const AUDIT_PAGE_SIZE = 20;

    const openAuditModal = async () => {
        setIsAuditModalOpen(true);
        setAuditPage(1);
        setAllAuditLogs([]);
        setIsAuditLoading(true);
        try {
            const res = await settingsApi.getAuditLog({ size: AUDIT_PAGE_SIZE, page: 1 });
            setAllAuditLogs(res.results);
            setAuditTotal(res.count ?? 0);
        } catch (err) {
            console.error(err);
        } finally {
            setIsAuditLoading(false);
        }
    };

    const loadMoreAuditLogs = async () => {
        const nextPage = auditPage + 1;
        setIsAuditLoading(true);
        try {
            const res = await settingsApi.getAuditLog({ size: AUDIT_PAGE_SIZE, page: nextPage });
            setAllAuditLogs((prev) => [...prev, ...res.results]);
            setAuditPage(nextPage);
        } catch (err) {
            console.error(err);
        } finally {
            setIsAuditLoading(false);
        }
    };

    // Feature flags
    const [featureFlags, setFeatureFlags] = useState(DEFAULT_FLAGS);
    const [isSavingFlags, setIsSavingFlags] = useState(false);
    const [flagsSaved, setFlagsSaved] = useState(false);
    const flagsSavedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);


    useEffect(() => {
        // Roles load separately so failure doesn't block the rest of the page
        settingsApi.getRoles().then(setRoles).catch(() => setRoles([]));

        Promise.all([
            settingsApi.getAdmins({ size: 5 }),
            settingsApi.getAuditLog({ size: 5 }),
            globalApi.getHealth(),
            settingsApi.getSettings('general'),
        ]).then(([adminsRes, logsRes, healthRes, generalSettings]) => {
            setAdmins(adminsRes.results);
            setAuditLogs(logsRes.results);
            setHealth(healthRes);
            setFeatureFlags({
                vrMode: generalSettings.vr_mode !== undefined ? Boolean(generalSettings.vr_mode) : DEFAULT_FLAGS.vrMode,
                groupSessions: generalSettings.group_sessions !== undefined ? Boolean(generalSettings.group_sessions) : DEFAULT_FLAGS.groupSessions,
                aiRecommendations: generalSettings.ai_recommendations !== undefined ? Boolean(generalSettings.ai_recommendations) : DEFAULT_FLAGS.aiRecommendations,
                offlineDownloads: generalSettings.offline_downloads !== undefined ? Boolean(generalSettings.offline_downloads) : DEFAULT_FLAGS.offlineDownloads,
                socialSharing: generalSettings.social_sharing !== undefined ? Boolean(generalSettings.social_sharing) : DEFAULT_FLAGS.socialSharing,
                voiceCommands: generalSettings.voice_commands !== undefined ? Boolean(generalSettings.voice_commands) : DEFAULT_FLAGS.voiceCommands,
            });
        }).catch(console.error).finally(() => setIsLoading(false));

        return () => {
            if (flagsSavedTimer.current) clearTimeout(flagsSavedTimer.current);
        };
    }, []);

    const openEditModal = (admin: AdminAccount) => {
        setEditingAdmin(admin);
        setEditForm({
            first_name: admin.first_name,
            last_name: admin.last_name,
            is_active: admin.is_active,
            group_id: admin.group_id ? String(admin.group_id) : '',
        });
        setEditError('');
    };

    const handleAddAdmin = async () => {
        if (!addForm.email.trim() || !addForm.password.trim() || !addForm.first_name.trim() || !addForm.last_name.trim()) {
            setAddError('Please fill in all required fields.');
            return;
        }
        setAddError('');
        setIsAddingAdmin(true);
        try {
            const created = await settingsApi.createAdmin({
                email: addForm.email,
                password: addForm.password,
                first_name: addForm.first_name,
                last_name: addForm.last_name,
                ...(addForm.group_id ? { group_id: Number(addForm.group_id) } : {}),
                event_type: 'create_admin',
            });
            setAdmins((prev) => [created, ...prev]);
            setIsAddModalOpen(false);
            setAddForm(EMPTY_ADD_FORM);
        } catch {
            setAddError('Failed to create admin. Please check the details and try again.');
        } finally {
            setIsAddingAdmin(false);
        }
    };

    const handleUpdateAdmin = async () => {
        if (!editingAdmin) return;
        setEditError('');
        setIsEditingAdmin(true);
        try {
            const updated = await settingsApi.updateAdmin(editingAdmin.id, {
                first_name: editForm.first_name,
                last_name: editForm.last_name,
                is_active: editForm.is_active,
                group_id: editForm.group_id ? Number(editForm.group_id) : undefined,
            });
            setAdmins((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
            setEditingAdmin(null);
        } catch {
            setEditError('Failed to update admin. Please try again.');
        } finally {
            setIsEditingAdmin(false);
        }
    };

    const handleToggle = (key: keyof typeof featureFlags) => {
        setFeatureFlags((prev) => ({ ...prev, [key]: !prev[key] }));
        setFlagsSaved(false);
    };

    const handleSaveFlags = async () => {
        setIsSavingFlags(true);
        try {
            const payload: Record<string, boolean> = {};
            for (const [jsKey, apiKey] of Object.entries(FEATURE_FLAG_KEYS)) {
                payload[apiKey] = featureFlags[jsKey as keyof typeof featureFlags];
            }
            await settingsApi.updateSettings('general', payload);
            setFlagsSaved(true);
            if (flagsSavedTimer.current) clearTimeout(flagsSavedTimer.current);
            flagsSavedTimer.current = setTimeout(() => setFlagsSaved(false), 3000);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSavingFlags(false);
        }
    };

    const getHealthColor = (status: string) => {
        const isGood = ['healthy', 'ok', 'connected', 'operational', 'active', 'up', 'running'].some(
            (s) => status.toLowerCase().includes(s)
        );
        return isGood
            ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 border-green-100 dark:border-green-900/40'
            : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 border-red-100 dark:border-red-900/40';
    };

    return (
        <>
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Top Section: Permissions and Notifications */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-[32px] border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-purple-600" />
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Admin Permissions</h3>
                        </div>
                        <button
                            onClick={() => { setAddForm(EMPTY_ADD_FORM); setAddError(''); setIsAddModalOpen(true); }}
                            className="flex items-center gap-2 px-4 py-2 bg-[#9810FA] text-white rounded-lg text-sm font-medium hover:bg-[#8000E0] transition-colors"
                        >
                            <UserPlus className="w-4 h-4" />
                            Add New Admins
                        </button>
                    </div>

                    <div className="space-y-4">
                        {isLoading ? (
                            [...Array(3)].map((_, i) => (
                                <div key={i} className="p-6 bg-gray-50/50 dark:bg-gray-900/50 rounded-3xl border border-gray-50 dark:border-gray-700 animate-pulse">
                                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2" />
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3" />
                                    <div className="flex gap-2">
                                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                                    </div>
                                </div>
                            ))
                        ) : admins.length === 0 ? (
                            <p className="text-sm text-gray-400 text-center py-8">No admin accounts found</p>
                        ) : (
                            admins.map((admin: AdminAccount) => (
                                <div key={admin.id} className="flex items-start justify-between p-6 bg-gray-50/50 dark:bg-gray-900/50 rounded-3xl border border-gray-50 dark:border-gray-700 shadow-sm group">
                                    <div className="space-y-1">
                                        <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                                            {admin.first_name} {admin.last_name}
                                        </h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 pb-2">{admin.email}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {admin.group_name && (
                                                <span className="px-3 py-1 rounded-lg text-[10px] font-bold tracking-wide uppercase bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300">
                                                    {admin.group_name}
                                                </span>
                                            )}
                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-bold tracking-wide uppercase ${admin.is_active ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}>
                                                {admin.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => openEditModal(admin)}
                                        className="text-sm font-semibold text-[#9810FA] hover:text-[#8000E0] transition-colors"
                                    >
                                        Edit
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Push Notifications */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-[32px] border border-gray-100 dark:border-gray-700 shadow-sm">
                    <PushNotifications />
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
                                key={`${feature.id}-${featureFlags[feature.id as keyof typeof featureFlags]}-${isLoading}`}
                                label=""
                                defaultChecked={featureFlags[feature.id as keyof typeof featureFlags]}
                                onChange={() => handleToggle(feature.id as keyof typeof featureFlags)}
                                color="blue"
                            />
                        </div>
                    ))}
                </div>

                <div className="mt-8 flex justify-end items-center gap-4">
                    {flagsSaved && (
                        <span className="flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400 font-medium">
                            <CheckCircle className="w-4 h-4" />
                            Saved!
                        </span>
                    )}
                    <Button
                        onClick={handleSaveFlags}
                        disabled={isSavingFlags}
                        className="px-10 bg-[#9810FA] hover:bg-[#8000E0] disabled:opacity-60 text-white rounded-xl py-3 h-auto font-bold border-none flex items-center gap-2"
                    >
                        {isSavingFlags ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Saving...
                            </>
                        ) : 'Save Changes'}
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
                    {isLoading ? (
                        [...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-start gap-4 p-5 bg-gray-50/50 dark:bg-gray-900/30 rounded-2xl animate-pulse">
                                <div className="mt-1.5 w-2 h-2 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                                </div>
                            </div>
                        ))
                    ) : auditLogs.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-8">No recent activity</p>
                    ) : (
                        auditLogs.map((log: AuditLogEntry) => (
                            <div key={log.id} className="flex items-start gap-4 p-5 bg-gray-50/50 dark:bg-gray-900/30 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
                                <span className="mt-1.5 w-2 h-2 rounded-full bg-[#9810FA] shrink-0 group-hover:scale-125 transition-transform"></span>
                                <div>
                                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{log.action}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {new Date(log.created_at).toLocaleString()} • {log.admin_email}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="mt-8 text-center border-t border-gray-50 dark:border-gray-700 pt-6">
                    <button onClick={openAuditModal} className="text-purple-600 hover:text-purple-700 text-sm font-bold tracking-wide">View Full History</button>
                </div>
            </div>

            {/* System & Actions Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* System Status */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-[32px] border border-gray-100 dark:border-gray-700 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-8">System Status</h3>
                    <div className="space-y-6">
                        {isLoading ? (
                            [...Array(3)].map((_, i) => (
                                <div key={i} className="flex justify-between items-center animate-pulse">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                                </div>
                            ))
                        ) : (
                            [
                                { label: 'Database', value: health?.database ?? 'Unknown' },
                                { label: 'Redis', value: health?.redis ?? 'Unknown' },
                                { label: 'Celery', value: health?.celery ?? 'Unknown' },
                            ].map(({ label, value }) => (
                                <div key={label} className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500 dark:text-gray-400 font-medium">{label}</span>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getHealthColor(value)}`}>
                                        {value}
                                    </span>
                                </div>
                            ))
                        )}
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

            {/* ── Modals ── */}
            {/* Add Admin Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-[32px] shadow-2xl border border-gray-100 dark:border-gray-700 w-full max-w-md p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <UserPlus className="w-5 h-5 text-purple-600" />
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Add New Admin</h3>
                            </div>
                            <button onClick={() => setIsAddModalOpen(false)} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                <X className="w-4 h-4 text-gray-500" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 block">First Name *</Label>
                                    <Input placeholder="First name" value={addForm.first_name} onChange={(e) => setAddForm((f) => ({ ...f, first_name: e.target.value }))} />
                                </div>
                                <div>
                                    <Label className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 block">Last Name *</Label>
                                    <Input placeholder="Last name" value={addForm.last_name} onChange={(e) => setAddForm((f) => ({ ...f, last_name: e.target.value }))} />
                                </div>
                            </div>
                            <div>
                                <Label className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 block">Email *</Label>
                                <Input type="email" placeholder="admin@example.com" value={addForm.email} onChange={(e) => setAddForm((f) => ({ ...f, email: e.target.value }))} />
                            </div>
                            <div>
                                <Label className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 block">Password *</Label>
                                <Input type="password" placeholder="Set a password" value={addForm.password} onChange={(e) => setAddForm((f) => ({ ...f, password: e.target.value }))} />
                            </div>
                            <div>
                                <Label className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 block">Role</Label>
                                <select
                                    value={addForm.group_id}
                                    onChange={(e) => setAddForm((f) => ({ ...f, group_id: e.target.value }))}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#9810FA] focus:border-transparent transition-all"
                                >
                                    <option value="">Select a role</option>
                                    {roles.map((role) => (
                                        <option key={role.id} value={role.id}>{role.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {addError && <p className="text-xs text-red-500 font-medium">{addError}</p>}

                        <div className="flex gap-3 pt-2">
                            <button onClick={() => setIsAddModalOpen(false)} className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                Cancel
                            </button>
                            <button
                                onClick={handleAddAdmin}
                                disabled={isAddingAdmin}
                                className="flex-1 py-3 rounded-xl bg-[#9810FA] hover:bg-[#8000E0] disabled:opacity-60 text-white text-sm font-bold transition-colors flex items-center justify-center gap-2"
                            >
                                {isAddingAdmin ? <><Loader2 className="w-4 h-4 animate-spin" />Creating...</> : 'Create Admin'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Admin Modal */}
            {/* Audit Log Full History Modal */}
            {isAuditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-[32px] shadow-2xl border border-gray-100 dark:border-gray-700 w-full max-w-2xl p-8 flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-6 shrink-0">
                            <div className="flex items-center gap-2">
                                <History className="w-5 h-5 text-purple-600" />
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Full Change History</h3>
                                {auditTotal > 0 && (
                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300">
                                        {auditTotal.toLocaleString()} entries
                                    </span>
                                )}
                            </div>
                            <button onClick={() => setIsAuditModalOpen(false)} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                <X className="w-4 h-4 text-gray-500" />
                            </button>
                        </div>

                        <div className="overflow-y-auto flex-1 space-y-3 pr-1">
                            {isAuditLoading && allAuditLogs.length === 0 ? (
                                [...Array(5)].map((_, i) => (
                                    <div key={i} className="flex items-start gap-4 p-5 bg-gray-50/50 dark:bg-gray-900/30 rounded-2xl animate-pulse">
                                        <div className="mt-1.5 w-2 h-2 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                                        </div>
                                    </div>
                                ))
                            ) : allAuditLogs.length === 0 ? (
                                <p className="text-sm text-gray-400 text-center py-12">No audit log entries found</p>
                            ) : (
                                allAuditLogs.map((log: AuditLogEntry) => (
                                    <div key={log.id} className="flex items-start gap-4 p-5 bg-gray-50/50 dark:bg-gray-900/30 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <span className="mt-1.5 w-2 h-2 rounded-full bg-[#9810FA] shrink-0"></span>
                                        <div>
                                            <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{log.action}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                {new Date(log.created_at).toLocaleString()} • {log.admin_email}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {allAuditLogs.length < auditTotal && (
                            <div className="mt-6 shrink-0 border-t border-gray-100 dark:border-gray-700 pt-5 text-center">
                                <button
                                    onClick={loadMoreAuditLogs}
                                    disabled={isAuditLoading}
                                    className="px-8 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors flex items-center gap-2 mx-auto"
                                >
                                    {isAuditLoading ? <><Loader2 className="w-4 h-4 animate-spin" />Loading...</> : `Load More (${allAuditLogs.length} / ${auditTotal})`}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {editingAdmin && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-[32px] shadow-2xl border border-gray-100 dark:border-gray-700 w-full max-w-md p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Shield className="w-5 h-5 text-purple-600" />
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Edit Admin</h3>
                            </div>
                            <button onClick={() => setEditingAdmin(null)} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                <X className="w-4 h-4 text-gray-500" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 block">First Name</Label>
                                    <Input value={editForm.first_name} onChange={(e) => setEditForm((f) => ({ ...f, first_name: e.target.value }))} />
                                </div>
                                <div>
                                    <Label className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 block">Last Name</Label>
                                    <Input value={editForm.last_name} onChange={(e) => setEditForm((f) => ({ ...f, last_name: e.target.value }))} />
                                </div>
                            </div>
                            <div>
                                <Label className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 block">Role</Label>
                                <select
                                    value={editForm.group_id}
                                    onChange={(e) => setEditForm((f) => ({ ...f, group_id: e.target.value }))}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#9810FA] focus:border-transparent transition-all"
                                >
                                    <option value="">Select a role</option>
                                    {roles.map((role) => (
                                        <option key={role.id} value={role.id}>{role.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700">
                                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Active</span>
                                <Switch
                                    key={`edit-active-${editingAdmin.id}`}
                                    label=""
                                    defaultChecked={editForm.is_active}
                                    onChange={() => setEditForm((f) => ({ ...f, is_active: !f.is_active }))}
                                    color="blue"
                                />
                            </div>
                        </div>

                        {editError && <p className="text-xs text-red-500 font-medium">{editError}</p>}

                        <div className="flex gap-3 pt-2">
                            <button onClick={() => setEditingAdmin(null)} className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateAdmin}
                                disabled={isEditingAdmin}
                                className="flex-1 py-3 rounded-xl bg-[#9810FA] hover:bg-[#8000E0] disabled:opacity-60 text-white text-sm font-bold transition-colors flex items-center justify-center gap-2"
                            >
                                {isEditingAdmin ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminOverview;
