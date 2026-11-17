"use client";
import React from "react";
import { Loader2, Trash2, X } from "lucide-react";

interface BulkDeleteBarProps {
    selectedCount: number;
    /** e.g. { one: "group", many: "groups" } */
    noun: { one: string; many: string };
    isRunning: boolean;
    /** Opens the confirmation (owned by the page, so it stacks above any open list modal). */
    onDeleteClick: () => void;
    onClear: () => void;
    /** Shown after a run finishes — success or partial failure. */
    message?: { type: "success" | "error"; text: string } | null;
    onDismissMessage?: () => void;
}

/** "N selected · Delete · Clear" bar shown above a table when rows are selected. */
export default function BulkDeleteBar({ selectedCount, noun, isRunning, onDeleteClick, onClear, message, onDismissMessage }: BulkDeleteBarProps) {
    const word = selectedCount === 1 ? noun.one : noun.many;

    return (
        <>
            {message && (
                <div className={`flex items-start justify-between gap-3 px-4 py-2.5 mb-3 rounded-xl text-sm ${message.type === "success"
                    ? "bg-green-50 text-green-700 dark:bg-green-900/10 dark:text-green-400"
                    : "bg-red-50 text-red-600 dark:bg-red-900/10 dark:text-red-400"}`}>
                    <span>{message.text}</span>
                    {onDismissMessage && (
                        <button onClick={onDismissMessage} className="shrink-0 opacity-70 hover:opacity-100" aria-label="Dismiss">✕</button>
                    )}
                </div>
            )}

            {selectedCount > 0 && (
                <div className="flex flex-wrap items-center gap-3 px-4 py-3 mb-3 rounded-xl bg-purple-50/60 dark:bg-purple-900/10">
                    <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                        {selectedCount} {word} selected
                    </span>
                    <button
                        type="button"
                        disabled={isRunning}
                        onClick={onDeleteClick}
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
            )}

        </>
    );
}
