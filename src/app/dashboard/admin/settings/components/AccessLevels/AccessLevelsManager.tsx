"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Crown, Loader2, Pencil, Plus, Search, Trash2, Users } from "lucide-react";
import accessLevelsApi from "@/lib/api/accessLevelsApi";
import { getApiErrorMessage } from "@/lib/api/errors";
import type { AccessLevel } from "@/lib/api/types";
import { ConfirmDeleteModal } from "@/components/ui/modal/ConfirmDeleteModal";
import AccessLevelFormModal from "./AccessLevelFormModal";
import AccessLevelMembersModal from "./AccessLevelMembersModal";

const formatDate = (iso?: string | null) =>
    iso ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "No end date";

function statusOf(level: AccessLevel): { label: string; className: string } {
    if (level.is_active === false) return { label: "Inactive", className: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" };
    if (level.expires_at && new Date(level.expires_at) <= new Date()) return { label: "Expired", className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" };
    return { label: "Active", className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" };
}

/** Admin Control → Access Levels: client groups (e.g. a sports team) with exclusive content. */
const AccessLevelsManager: React.FC = () => {
    const [levels, setLevels] = useState<AccessLevel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [search, setSearch] = useState("");

    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState<AccessLevel | null>(null);
    const [membersOf, setMembersOf] = useState<AccessLevel | null>(null);
    const [deleting, setDeleting] = useState<AccessLevel | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const load = useCallback(() => {
        setIsLoading(true);
        setLoadError(null);
        accessLevelsApi.list({ size: 200, ordering: "name", search: search.trim() || undefined })
            .then(res => setLevels(res.results ?? []))
            .catch(err => setLoadError(getApiErrorMessage(err, "Could not load access levels.")))
            .finally(() => setIsLoading(false));
    }, [search]);

    useEffect(() => {
        const t = setTimeout(load, 300);
        return () => clearTimeout(t);
    }, [load]);

    const handleDelete = async () => {
        if (!deleting) return;
        setIsDeleting(true);
        setDeleteError(null);
        try {
            await accessLevelsApi.delete(deleting.id);
            setDeleting(null);
            load();
        } catch (err) {
            setDeleteError(getApiErrorMessage(err, "Failed to delete the access level."));
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Access Levels</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl">
                        Give a client (e.g. a sports team) its own access. Members get Free content plus the content assigned to their level,
                        and the regular Premium library only if their contract includes it. Access ends automatically on the contract end date.
                    </p>
                </div>
                <div className="flex gap-3">
                    <div className="relative w-full sm:w-64">
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search levels"
                            className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                        />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                    <button
                        onClick={() => { setEditing(null); setFormOpen(true); }}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#9810FA] hover:bg-[#8000E0] text-white text-sm font-semibold whitespace-nowrap"
                    >
                        <Plus className="w-4 h-4" /> New level
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-900/40 text-xs text-gray-500 uppercase tracking-wider">
                        <tr>
                            <th className="px-5 py-3 text-left font-semibold">Name</th>
                            <th className="px-5 py-3 text-left font-semibold">Members</th>
                            <th className="px-5 py-3 text-left font-semibold">Content</th>
                            <th className="px-5 py-3 text-left font-semibold">Premium library</th>
                            <th className="px-5 py-3 text-left font-semibold">Contract ends</th>
                            <th className="px-5 py-3 text-left font-semibold">Status</th>
                            <th className="px-5 py-3 text-right font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {isLoading ? (
                            <tr><td colSpan={7} className="px-5 py-12 text-center text-gray-400"><Loader2 className="w-5 h-5 animate-spin inline" /></td></tr>
                        ) : loadError ? (
                            <tr><td colSpan={7} className="px-5 py-12 text-center text-red-500">{loadError}</td></tr>
                        ) : levels.length === 0 ? (
                            <tr><td colSpan={7} className="px-5 py-12 text-center text-gray-400">
                                {search ? "No levels match your search." : "No access levels yet. Create one for your first client."}
                            </td></tr>
                        ) : levels.map(level => {
                            const status = statusOf(level);
                            return (
                                <tr key={level.id} className="hover:bg-gray-50/60 dark:hover:bg-gray-700/20">
                                    <td className="px-5 py-3.5">
                                        <p className="font-semibold text-gray-900 dark:text-white">{level.name}</p>
                                        {level.description && <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 max-w-xs">{level.description}</p>}
                                    </td>
                                    <td className="px-5 py-3.5 text-gray-700 dark:text-gray-300">{level.member_count.toLocaleString()}</td>
                                    <td className="px-5 py-3.5 text-gray-700 dark:text-gray-300">{level.content_count.toLocaleString()}</td>
                                    <td className="px-5 py-3.5">
                                        {level.includes_premium
                                            ? <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium"><Crown className="w-3.5 h-3.5" /> Included</span>
                                            : <span className="text-gray-400">Not included</span>}
                                    </td>
                                    <td className="px-5 py-3.5 text-gray-700 dark:text-gray-300 whitespace-nowrap">{formatDate(level.expires_at)}</td>
                                    <td className="px-5 py-3.5">
                                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${status.className}`}>{status.label}</span>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex justify-end gap-1">
                                            <button onClick={() => setMembersOf(level)} title="Members" className="p-2 rounded-lg text-gray-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                                                <Users className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => { setEditing(level); setFormOpen(true); }} title="Edit" className="p-2 rounded-lg text-gray-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => { setDeleteError(null); setDeleting(level); }} title="Delete" className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <AccessLevelFormModal
                isOpen={formOpen}
                level={editing}
                onClose={() => setFormOpen(false)}
                onSaved={load}
            />
            <AccessLevelMembersModal
                level={membersOf}
                onClose={() => setMembersOf(null)}
                onChanged={load}
            />
            <ConfirmDeleteModal
                isOpen={deleting !== null}
                title={`Delete "${deleting?.name ?? ""}"?`}
                message={deleteError ?? `Its ${deleting?.member_count ?? 0} members lose this access, and its ${deleting?.content_count ?? 0} exclusive content items are no longer assigned to it. This can't be undone. To pause access instead, edit the level and mark it inactive.`}
                confirmText="Delete level"
                isLoading={isDeleting}
                onConfirm={handleDelete}
                onClose={() => !isDeleting && setDeleting(null)}
            />
        </div>
    );
};

export default AccessLevelsManager;
