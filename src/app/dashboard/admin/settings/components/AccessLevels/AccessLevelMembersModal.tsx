"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Loader2, Search, UserMinus, UserPlus } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import accessLevelsApi from "@/lib/api/accessLevelsApi";
import { getApiErrorMessage } from "@/lib/api/errors";
import type { AccessLevel, AccessLevelMember } from "@/lib/api/types";

interface Props {
    /** null = closed */
    level: AccessLevel | null;
    onClose: () => void;
    /** Member counts changed — refresh the levels list. */
    onChanged: () => void;
}

const PAGE_SIZE = 20;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AccessLevelMembersModal: React.FC<Props> = ({ level, onClose, onChanged }) => {
    const [members, setMembers] = useState<AccessLevelMember[]>([]);
    const [count, setCount] = useState(0);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [listError, setListError] = useState<string | null>(null);

    const [emailsText, setEmailsText] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const [addResult, setAddResult] = useState<{ type: "success" | "error"; text: string; notFound?: string[] } | null>(null);
    const [removingId, setRemovingId] = useState<number | null>(null);

    const load = useCallback(() => {
        if (!level) return;
        setIsLoading(true);
        setListError(null);
        accessLevelsApi.listMembers(level.id, { page, size: PAGE_SIZE, search: search.trim() || undefined })
            .then(res => { setMembers(res.results ?? []); setCount(res.count ?? 0); })
            .catch(err => setListError(getApiErrorMessage(err, "Could not load members.")))
            .finally(() => setIsLoading(false));
    }, [level, page, search]);

    useEffect(() => {
        const t = setTimeout(load, 250);
        return () => clearTimeout(t);
    }, [load]);

    // Reset when another level is opened
    useEffect(() => {
        setPage(1); setSearch(""); setEmailsText(""); setAddResult(null);
    }, [level?.id]);

    const handleAdd = async () => {
        if (!level) return;
        const emails = Array.from(new Set(emailsText.split(/[\s,;]+/).map(e => e.trim().toLowerCase()).filter(Boolean)));
        const invalid = emails.filter(e => !EMAIL_RE.test(e));
        if (emails.length === 0) { setAddResult({ type: "error", text: "Paste at least one email address." }); return; }
        if (invalid.length) { setAddResult({ type: "error", text: `Not valid email addresses: ${invalid.join(", ")}` }); return; }
        setIsAdding(true);
        setAddResult(null);
        try {
            const res = await accessLevelsApi.addMembers(level.id, { emails });
            const parts = [`Added ${res.added.length}`];
            if (res.already_members.length) parts.push(`${res.already_members.length} already members`);
            if (res.not_found.length) parts.push(`${res.not_found.length} without an account`);
            setAddResult({ type: res.not_found.length ? "error" : "success", text: parts.join(" · ") + ".", notFound: res.not_found });
            // Keep only the emails that didn't match an account, so they can be fixed and retried
            setEmailsText(res.not_found.join("\n"));
            setPage(1);
            load();
            onChanged();
        } catch (err) {
            setAddResult({ type: "error", text: getApiErrorMessage(err, "Failed to add members.") });
        } finally {
            setIsAdding(false);
        }
    };

    const handleRemove = async (member: AccessLevelMember) => {
        if (!level) return;
        setRemovingId(member.id);
        try {
            await accessLevelsApi.removeMember(level.id, member.id);
            load();
            onChanged();
        } catch (err) {
            setListError(getApiErrorMessage(err, "Failed to remove the member."));
        } finally {
            setRemovingId(null);
        }
    };

    const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

    return (
        <Modal isOpen={level !== null} onClose={onClose} className="max-w-[680px] m-4">
            <div className="flex flex-col bg-white dark:bg-gray-900 rounded-3xl p-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{level?.name} — Members</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{count.toLocaleString()} member{count === 1 ? "" : "s"}</p>

                <div className="space-y-6 overflow-y-auto max-h-[65vh] pr-2 custom-scrollbar">
                    {/* Add */}
                    <section className="space-y-2">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Add members</h3>
                        <textarea
                            value={emailsText}
                            onChange={e => setEmailsText(e.target.value)}
                            rows={3}
                            placeholder={"Paste email addresses, one per line or separated by commas\nplayer1@club.com, player2@club.com"}
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent dark:bg-gray-900 px-4 py-2.5 text-sm text-gray-800 dark:text-white/90 focus:outline-hidden focus:ring-3 focus:ring-purple-500/20"
                        />
                        <div className="flex flex-wrap items-center gap-3">
                            <button onClick={handleAdd} disabled={isAdding} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#9810FA] hover:bg-[#8000E0] text-white text-sm font-semibold disabled:opacity-50">
                                {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                                Add
                            </button>
                            {addResult && (
                                <span className={`text-sm ${addResult.type === "success" ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"}`}>{addResult.text}</span>
                            )}
                        </div>
                        {addResult?.notFound && addResult.notFound.length > 0 && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                These emails don&apos;t have a Mind Player account yet, so they&apos;re left in the box above. Ask them to sign up with that email, then add them again.
                            </p>
                        )}
                    </section>

                    {/* List */}
                    <section className="space-y-3">
                        <div className="relative">
                            <input
                                value={search}
                                onChange={e => { setSearch(e.target.value); setPage(1); }}
                                placeholder="Search members by name, email or username"
                                className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                            />
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                        {listError && <p className="text-sm text-red-500">{listError}</p>}
                        <div className="border border-gray-200 dark:border-gray-700 rounded-xl divide-y divide-gray-100 dark:divide-gray-700">
                            {isLoading ? (
                                <div className="py-8 text-center text-gray-400"><Loader2 className="w-5 h-5 animate-spin inline" /></div>
                            ) : members.length === 0 ? (
                                <p className="py-8 text-center text-sm text-gray-400">{search ? "No members match your search." : "No members yet."}</p>
                            ) : members.map(m => (
                                <div key={m.id} className="flex items-center justify-between gap-3 px-4 py-2.5">
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{m.name || m.email}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{m.email}{m.username ? ` · @${m.username}` : ""}</p>
                                    </div>
                                    <button
                                        onClick={() => handleRemove(m)}
                                        disabled={removingId === m.id}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50"
                                    >
                                        {removingId === m.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserMinus className="w-3.5 h-3.5" />}
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between text-sm text-gray-500">
                                <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-40">Previous</button>
                                <span>Page {page} of {totalPages}</span>
                                <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-40">Next</button>
                            </div>
                        )}
                    </section>
                </div>

                <div className="flex justify-end mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                    <button onClick={onClose} className="px-6 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800">
                        Done
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default AccessLevelMembersModal;
