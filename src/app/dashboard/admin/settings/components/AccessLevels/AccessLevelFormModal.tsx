"use client";
import React, { useCallback, useEffect, useState } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import DatePicker from "@/components/form/date-picker";
import { isPastDay, todayLocal } from "@/lib/dates";
import accessLevelsApi from "@/lib/api/accessLevelsApi";
import { getApiErrorMessage } from "@/lib/api/errors";
import type { AccessLevel, AccessLevelInput } from "@/lib/api/types";

interface Props {
    isOpen: boolean;
    /** null = create a new level */
    level: AccessLevel | null;
    onClose: () => void;
    onSaved: () => void;
}

const AI_FIELDS = [
    { key: "ai_hourly_limit", label: "Per hour" },
    { key: "ai_daily_limit", label: "Per day" },
    { key: "ai_monthly_limit", label: "Per month" },
    { key: "ai_max_input_chars", label: "Max message length (chars)" },
    { key: "ai_max_response_chars", label: "Max reply length (chars)" },
] as const;
type AiKey = typeof AI_FIELDS[number]["key"];

const toDateInput = (iso?: string | null) => (iso ? iso.slice(0, 10) : "");

const CheckRow: React.FC<{ checked: boolean; onChange: (v: boolean) => void; title: string; hint: string }> = ({ checked, onChange, title, hint }) => (
    <label className="flex items-start gap-3 cursor-pointer">
        <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="mt-0.5 w-4 h-4 accent-purple-600" />
        <span>
            <span className="block text-sm font-medium text-gray-900 dark:text-white">{title}</span>
            <span className="block text-xs text-gray-500 dark:text-gray-400">{hint}</span>
        </span>
    </label>
);

const AccessLevelFormModal: React.FC<Props> = ({ isOpen, level, onClose, onSaved }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [includesPremium, setIncludesPremium] = useState(false);
    const [endDate, setEndDate] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [showAi, setShowAi] = useState(false);
    const [ai, setAi] = useState<Record<AiKey, string>>({ ai_hourly_limit: "", ai_daily_limit: "", ai_monthly_limit: "", ai_max_input_chars: "", ai_max_response_chars: "" });
    // Bumped to remount the calendar (e.g. after "Clear" or opening another level)
    const [pickerKey, setPickerKey] = useState(0);
    const handleEndDateChange = useCallback((_dates: Date[], dateStr: string) => setEndDate(dateStr), []);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen) return;
        setName(level?.name ?? "");
        setDescription(level?.description ?? "");
        setIncludesPremium(level?.includes_premium ?? false);
        setEndDate(toDateInput(level?.expires_at));
        setIsActive(level?.is_active ?? true);
        const nextAi = Object.fromEntries(AI_FIELDS.map(f => [f.key, level?.[f.key] != null ? String(level[f.key]) : ""])) as Record<AiKey, string>;
        setAi(nextAi);
        setShowAi(Object.values(nextAi).some(v => v !== ""));
        setError(null);
        setPickerKey(k => k + 1);
    }, [isOpen, level]);

    const handleSave = async () => {
        if (!name.trim()) { setError("Please enter a name."); return; }
        // An existing level may keep its (already passed) end date; a new or changed date must not be in the past
        if (endDate && endDate !== toDateInput(level?.expires_at) && isPastDay(endDate)) {
            setError("The contract end date can't be a day that has already ended.");
            return;
        }
        for (const f of AI_FIELDS) {
            const v = ai[f.key];
            if (v !== "" && (!/^\d+$/.test(v))) { setError(`AI limit "${f.label}" must be a whole number, or left empty.`); return; }
        }
        setError(null);
        setIsSaving(true);
        const payload: AccessLevelInput = {
            name: name.trim(),
            description: description.trim(),
            includes_premium: includesPremium,
            // End of the chosen day, local time
            expires_at: endDate ? new Date(`${endDate}T23:59:59`).toISOString() : null,
            is_active: isActive,
        };
        AI_FIELDS.forEach(f => { payload[f.key] = ai[f.key] === "" ? null : Number(ai[f.key]); });
        try {
            if (level) await accessLevelsApi.update(level.id, payload);
            else await accessLevelsApi.create(payload);
            onSaved();
            onClose();
        } catch (err) {
            setError(getApiErrorMessage(err, "Failed to save the access level."));
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={() => !isSaving && onClose()} className="max-w-[560px] m-4">
            <div className="flex flex-col bg-white dark:bg-gray-900 rounded-3xl p-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{level ? "Edit access level" : "New access level"}</h2>

                <div className="space-y-5 overflow-y-auto max-h-[65vh] pr-2 custom-scrollbar">
                    <div>
                        <Label htmlFor="al-name">Name <span className="text-red-500">*</span></Label>
                        <Input id="al-name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. FC Example" />
                    </div>
                    <div>
                        <Label htmlFor="al-desc">Description</Label>
                        <textarea
                            id="al-desc"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            rows={2}
                            placeholder="Internal note, e.g. contract reference"
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent dark:bg-gray-900 px-4 py-2.5 text-sm text-gray-800 dark:text-white/90 focus:outline-hidden focus:ring-3 focus:ring-purple-500/20"
                        />
                    </div>
                    <div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="al-end">Contract end date</Label>
                            {endDate && (
                                <button type="button" onClick={() => { setEndDate(""); setPickerKey(k => k + 1); }} className="text-xs text-purple-600 hover:underline mb-1.5">
                                    Clear
                                </button>
                            )}
                        </div>
                        <DatePicker
                            key={pickerKey}
                            id="al-end"
                            placeholder="Select a date"
                            defaultDate={endDate || undefined}
                            minDate={todayLocal()}
                            onChange={handleEndDateChange}
                        />
                        {endDate && isPastDay(endDate) && (
                            <p className="text-xs text-red-500 mt-1">This contract ended on {endDate}. Pick a new date to renew it.</p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">Access ends automatically after this day. Extend it to renew. Leave empty for no end date.</p>
                    </div>
                    <CheckRow
                        checked={includesPremium}
                        onChange={setIncludesPremium}
                        title="Includes the Premium library"
                        hint="Only if the client's contract includes it. Otherwise members get Free content plus this level's content."
                    />
                    <CheckRow
                        checked={isActive}
                        onChange={setIsActive}
                        title="Active"
                        hint="Untick to pause access for every member without deleting the level."
                    />

                    <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
                        <button type="button" onClick={() => setShowAi(v => !v)} className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 dark:text-gray-200">
                            <ChevronDown className={`w-4 h-4 transition-transform ${showAi ? "" : "-rotate-90"}`} />
                            AI Mind Coach limits (optional)
                        </button>
                        {showAi && (
                            <div className="mt-3 space-y-3">
                                <p className="text-xs text-gray-500 dark:text-gray-400">Overrides the plan limits for this client&apos;s members. Leave a field empty to use the plan&apos;s limit.</p>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {AI_FIELDS.map(f => (
                                        <div key={f.key}>
                                            <Label htmlFor={`al-${f.key}`}>{f.label}</Label>
                                            <Input id={`al-${f.key}`} type="number" min="0" value={ai[f.key]} onChange={e => setAi(prev => ({ ...prev, [f.key]: e.target.value }))} placeholder="Plan default" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {error && <p className="text-sm text-red-500 mt-4">{error}</p>}

                <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                    <button onClick={onClose} disabled={isSaving} className="px-6 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50">
                        Cancel
                    </button>
                    <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#9810FA] hover:bg-[#8000E0] text-white font-semibold disabled:opacity-50">
                        {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                        {level ? "Save changes" : "Create level"}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default AccessLevelFormModal;
