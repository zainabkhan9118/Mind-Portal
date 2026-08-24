"use client";
import React, { useState, useEffect } from "react";
import { ShieldCheck, ShieldX, ExternalLink, Loader2, RefreshCw } from "lucide-react";
import usersApi from "@/lib/api/usersApi";
import type { ApiUser } from "@/lib/api/types";

const MindExpertsTab: React.FC = () => {
    const [applications, setApplications] = useState<ApiUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<Record<number, "approve" | "reject" | null>>({});
    const [actionDone, setActionDone] = useState<Record<number, "approved" | "rejected">>({});

    const load = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await usersApi.getMindExpertApplications();
            setApplications(res.results ?? []);
        } catch {
            setError("Could not load applications. The backend endpoint may not be available yet.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const handleApprove = async (user: ApiUser) => {
        setActionLoading(p => ({ ...p, [user.id]: "approve" }));
        try {
            await usersApi.approveMindExpert(user.id);
            setActionDone(p => ({ ...p, [user.id]: "approved" }));
            setApplications(prev => prev.filter(u => u.id !== user.id));
        } catch {
            setError(`Failed to approve ${[user.first_name, user.last_name].filter(Boolean).join(" ") || user.email}.`);
        } finally {
            setActionLoading(p => ({ ...p, [user.id]: null }));
        }
    };

    const handleReject = async (user: ApiUser) => {
        setActionLoading(p => ({ ...p, [user.id]: "reject" }));
        try {
            await usersApi.rejectMindExpert(user.id);
            setActionDone(p => ({ ...p, [user.id]: "rejected" }));
            setApplications(prev => prev.filter(u => u.id !== user.id));
        } catch {
            setError(`Failed to reject ${[user.first_name, user.last_name].filter(Boolean).join(" ") || user.email}.`);
        } finally {
            setActionLoading(p => ({ ...p, [user.id]: null }));
        }
    };

    return (
        <div className="space-y-6">
            {/* Header row */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-base font-semibold text-gray-900 dark:text-white">Mind Expert Applications</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        Users who have submitted credential files for Mind Expert validation.
                    </p>
                </div>
                <button
                    onClick={load}
                    disabled={isLoading}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                    Refresh
                </button>
            </div>

            {error && (
                <div className="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400">
                    {error}
                </div>
            )}

            {isLoading ? (
                <div className="flex items-center justify-center py-20 text-gray-400 gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm">Loading applications…</span>
                </div>
            ) : applications.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col items-center justify-center py-20 text-center px-6">
                    <div className="w-14 h-14 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center mb-4">
                        <ShieldCheck className="w-7 h-7 text-purple-400" />
                    </div>
                    <p className="text-base font-medium text-gray-700 dark:text-gray-300">No pending applications</p>
                    <p className="text-sm text-gray-400 mt-1">All Mind Expert applications have been reviewed.</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 tracking-wider">User</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 tracking-wider">Email</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 tracking-wider">Joined</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 tracking-wider">Credentials</th>
                                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                            {applications.map((user) => {
                                const loading = actionLoading[user.id];
                                return (
                                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 text-xs font-bold flex-shrink-0">
                                                    {([user.first_name, user.last_name].filter(Boolean).join(" ") || user.email || "?")[0].toUpperCase()}
                                                </div>
                                                <span className="font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                                    {[user.first_name, user.last_name].filter(Boolean).join(" ") || "—"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-gray-600 dark:text-gray-300">{user.email}</td>
                                        <td className="px-5 py-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                            {user.date_joined
                                                ? new Date(user.date_joined).toLocaleDateString()
                                                : "—"}
                                        </td>
                                        <td className="px-5 py-4">
                                            {(user as ApiUser & { credential_files?: string[] }).credential_files?.length ? (
                                                <div className="flex flex-wrap gap-1.5">
                                                    {(user as ApiUser & { credential_files?: string[] }).credential_files!.map((url, i) => (
                                                        <a
                                                            key={i}
                                                            href={url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs hover:underline"
                                                        >
                                                            <ExternalLink className="w-3 h-3" />
                                                            File {i + 1}
                                                        </a>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 text-xs">No files attached</span>
                                            )}
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleApprove(user)}
                                                    disabled={!!loading}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-xs font-medium hover:bg-green-100 dark:hover:bg-green-900/40 disabled:opacity-50 transition-colors"
                                                >
                                                    {loading === "approve"
                                                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                        : <ShieldCheck className="w-3.5 h-3.5" />}
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleReject(user)}
                                                    disabled={!!loading}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-medium hover:bg-red-100 dark:hover:bg-red-900/40 disabled:opacity-50 transition-colors"
                                                >
                                                    {loading === "reject"
                                                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                        : <ShieldX className="w-3.5 h-3.5" />}
                                                    Reject
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/40 rounded-xl px-4 py-3 text-xs text-amber-700 dark:text-amber-400">
                <strong>Backend note:</strong> This tab queries <code>admin/users/?mind_expert_pending=true</code>.
                The backend must expose this filter and return a <code>credential_files</code> array on each user record for the file links to appear.
            </div>
        </div>
    );
};

export default MindExpertsTab;
