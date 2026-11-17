"use client";
import { useCallback, useState } from "react";
import type { CommunityBulkDeleteResponse } from "@/lib/api/types";

interface Named { id: number }

/**
 * Selection + bulk-delete state for one table. Deletes go through the backend's
 * bulk-delete endpoint (one request) and report which ones failed; failures stay selected for retry.
 */
export function useBulkDelete<T extends Named>(opts: {
    items: T[];
    label: (item: T) => string;
    noun: { one: string; many: string };
    deleteMany: (ids: number[]) => Promise<CommunityBulkDeleteResponse>;
    onDone: () => void;
}) {
    const { items, label, noun, deleteMany, onDone } = opts;
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [isRunning, setIsRunning] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const toggle = useCallback((id: number) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    }, []);

    /** Select every id given; if they're all already selected, deselect them. */
    const toggleAll = useCallback((ids: number[]) => {
        setSelectedIds(prev => {
            const allIn = ids.length > 0 && ids.every(id => prev.has(id));
            const next = new Set(prev);
            ids.forEach(id => (allIn ? next.delete(id) : next.add(id)));
            return next;
        });
    }, []);

    const clear = useCallback(() => setSelectedIds(new Set()), []);

    const run = async () => {
        const ids = Array.from(selectedIds);
        if (ids.length === 0) return;
        setIsRunning(true);
        setMessage(null);
        let failedIds: number[];
        try {
            const res = await deleteMany(ids);
            failedIds = (res.results ?? []).filter(r => !r.ok).map(r => r.id);
        } catch (err) {
            console.error("Bulk delete failed:", err);
            failedIds = ids;
        }
        const ok = ids.length - failedIds.length;
        if (failedIds.length === 0) {
            setMessage({ type: "success", text: `Deleted ${ok} ${ok === 1 ? noun.one : noun.many}.` });
        } else {
            const names = items.filter(i => failedIds.includes(i.id)).map(label).join(", ");
            setMessage({ type: "error", text: `Deleted ${ok} of ${ids.length}. Failed: ${names}` });
        }
        setSelectedIds(new Set(failedIds));
        setIsRunning(false);
        setConfirmOpen(false);
        onDone();
    };

    return { selectedIds, toggle, toggleAll, clear, isRunning, confirmOpen, setConfirmOpen, message, setMessage, run };
}
