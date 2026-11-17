"use client";
import React, { useEffect, useRef, useState } from "react";
import { CalendarClock, ChevronDown, Loader2, Trash2, X } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { ConfirmDeleteModal } from "@/components/ui/modal/ConfirmDeleteModal";
import accessLevelsApi from "@/lib/api/accessLevelsApi";
import type { AccessLevel } from "@/lib/api/types";
import { nowLocalTime, todayLocal } from "@/lib/dates";

export type BulkAction =
    | { kind: "delete" }
    /** "free" / "premium", or a custom access level id (makes the items exclusive to it). */
    | { kind: "access"; level: "free" | "premium" | number }
    | { kind: "status"; status: "published" | "draft" }
    | { kind: "schedule"; publishedAt: string };

interface BulkActionBarProps {
    selectedCount: number;
    isRunning: boolean;
    onRun: (action: BulkAction) => void;
    onClear: () => void;
}

/** Small dropdown button used for "Change access" / "Change status". */
const MenuButton: React.FC<{
    label: string;
    disabled: boolean;
    options: { label: string; onSelect: () => void }[];
}> = ({ label, disabled, options }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const close = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, []);
    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                disabled={disabled}
                onClick={() => setOpen(o => !o)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
            >
                {label}
                <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {open && (
                <div className="absolute left-0 top-full mt-1 z-50 min-w-[160px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg py-1">
                    {options.map(o => (
                        <button
                            key={o.label}
                            type="button"
                            onClick={() => { setOpen(false); o.onSelect(); }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        >
                            {o.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const inputClass =
    "w-full h-11 px-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-purple-500/20";

const BulkActionBar: React.FC<BulkActionBarProps> = ({ selectedCount, isRunning, onRun, onClear }) => {
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [scheduleOpen, setScheduleOpen] = useState(false);
    const [date, setDate] = useState("");
    const [time, setTime] = useState("09:00");
    const [scheduleError, setScheduleError] = useState<string | null>(null);
    const [customLevels, setCustomLevels] = useState<AccessLevel[]>([]);

    useEffect(() => {
        accessLevelsApi.listAll()
            .then(levels => setCustomLevels(levels.filter(l => l.is_active !== false)))
            .catch(err => console.error("Failed to load access levels:", err));
    }, []);

    // Close the dialogs once the running action finishes
    useEffect(() => {
        if (!isRunning) { setConfirmDelete(false); setScheduleOpen(false); }
    }, [isRunning]);

    if (selectedCount === 0) return null;
    const plural = selectedCount === 1 ? "item" : "items";

    const submitSchedule = () => {
        if (!date) { setScheduleError("Please pick a publish date."); return; }
        const publishedAt = `${date}T${time || "00:00"}:00`;
        if (new Date(publishedAt) <= new Date()) { setScheduleError("The publish date must be in the future."); return; }
        setScheduleError(null);
        onRun({ kind: "schedule", publishedAt });
    };

    return (
        <>
            <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-purple-50/60 dark:bg-purple-900/10">
                <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                    {selectedCount} {plural} selected
                </span>

                <MenuButton
                    label="Change access"
                    disabled={isRunning}
                    options={[
                        { label: "Free", onSelect: () => onRun({ kind: "access", level: "free" }) },
                        { label: "Premium", onSelect: () => onRun({ kind: "access", level: "premium" }) },
                        ...customLevels.map(l => ({ label: `Exclusive: ${l.name}`, onSelect: () => onRun({ kind: "access", level: l.id }) })),
                    ]}
                />
                <MenuButton
                    label="Change status"
                    disabled={isRunning}
                    options={[
                        { label: "Published", onSelect: () => onRun({ kind: "status", status: "published" }) },
                        { label: "Unpublished", onSelect: () => onRun({ kind: "status", status: "draft" }) },
                        { label: "Scheduled…", onSelect: () => { setScheduleError(null); setScheduleOpen(true); } },
                    ]}
                />
                <button
                    type="button"
                    disabled={isRunning}
                    onClick={() => setConfirmDelete(true)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-red-200 dark:border-red-800 bg-white dark:bg-gray-800 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 transition-colors"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                </button>

                {isRunning && <Loader2 className="w-4 h-4 animate-spin text-purple-600" />}

                <button
                    type="button"
                    disabled={isRunning}
                    onClick={onClear}
                    className="ml-auto flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-50"
                >
                    <X className="w-3.5 h-3.5" />
                    Clear selection
                </button>
            </div>

            <ConfirmDeleteModal
                isOpen={confirmDelete}
                title={`Delete ${selectedCount} ${plural}?`}
                message={`This will delete the ${selectedCount} selected ${plural}. This can't be undone from the dashboard.`}
                confirmText={`Delete ${selectedCount}`}
                isLoading={isRunning}
                onConfirm={() => onRun({ kind: "delete" })}
                onClose={() => !isRunning && setConfirmDelete(false)}
            />

            <Modal isOpen={scheduleOpen} onClose={() => !isRunning && setScheduleOpen(false)} className="max-w-[420px] m-4">
                <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 space-y-5">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-2xl shrink-0">
                            <CalendarClock className="w-5 h-5 text-purple-600" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Schedule {selectedCount} {plural}</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <label className="space-y-1.5">
                            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Publish date</span>
                            <input type="date" value={date} min={todayLocal()} onChange={e => setDate(e.target.value)} className={inputClass} />
                        </label>
                        <label className="space-y-1.5">
                            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Publish time</span>
                            <input type="time" value={time} min={date === todayLocal() ? nowLocalTime() : undefined} onChange={e => setTime(e.target.value)} className={inputClass} />
                        </label>
                    </div>
                    {scheduleError && <p className="text-sm text-red-500">{scheduleError}</p>}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => setScheduleOpen(false)}
                            disabled={isRunning}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={submitSchedule}
                            disabled={isRunning}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#9810FA] hover:bg-[#8000E0] text-white text-sm font-semibold disabled:opacity-50"
                        >
                            {isRunning && <Loader2 className="w-4 h-4 animate-spin" />}
                            Schedule
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default BulkActionBar;
