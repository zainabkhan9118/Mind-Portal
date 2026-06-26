import React from "react";
import Label from "@/components/form/Label";

// ── State options ─────────────────────────────────────────────────────────────

export const STATE_GROUPS = [
    { label: "🔻 DOWNREGULATION", options: ["overload", "anxious", "tense", "overthinking"] },
    { label: "🔺 ACTIVATION",     options: ["low_energy", "unmotivated", "sluggish"] },
    { label: "🎯 FOCUS",          options: ["distracted", "scattered", "lack_clarity"] },
    { label: "⚖️ EMOTIONAL",      options: ["frustrated", "reactive", "overwhelmed"] },
    { label: "🌊 CREATIVE",       options: ["blocked", "rigid", "uninspired"] },
] as const;

export const EFFECT_GROUPS = [
    { label: "🔻 CALM / REGULATION", options: ["calm", "downregulate", "ground", "regulate"] },
    { label: "🔺 ACTIVATION",        options: ["activate", "energize"] },
    { label: "🎯 FOCUS",             options: ["focus", "narrow"] },
    { label: "🌊 EXPANSION",         options: ["open"] },
] as const;

export type StateValue  = typeof STATE_GROUPS[number]["options"][number];
export type EffectValue = typeof EFFECT_GROUPS[number]["options"][number];

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatLabel(value: string): string {
    return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

const selectClass =
    "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs " +
    "focus:outline-none focus:ring-2 focus:ring-purple-500/20 bg-transparent " +
    "text-gray-800 dark:text-white border-gray-300 dark:border-gray-700 dark:bg-gray-900";

// ── Component ─────────────────────────────────────────────────────────────────

interface StateEffectSelectorProps {
    state: string;
    onStateChange: (v: string) => void;
    effect: string;
    onEffectChange: (v: string) => void;
}

const StateEffectSelector: React.FC<StateEffectSelectorProps> = ({
    state,
    onStateChange,
    effect,
    onEffectChange,
}) => (
    <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            State &amp; Effect
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* State */}
            <div>
                <Label htmlFor="state">State</Label>
                <select
                    id="state"
                    value={state}
                    onChange={(e) => onStateChange(e.target.value)}
                    className={selectClass}
                >
                    <option value="">Select state...</option>
                    {STATE_GROUPS.map((group) => (
                        <optgroup key={group.label} label={group.label}>
                            {group.options.map((opt) => (
                                <option key={opt} value={opt}>
                                    {formatLabel(opt)}
                                </option>
                            ))}
                        </optgroup>
                    ))}
                </select>
            </div>

            {/* Effect */}
            <div>
                <Label htmlFor="effect">Effect</Label>
                <select
                    id="effect"
                    value={effect}
                    onChange={(e) => onEffectChange(e.target.value)}
                    className={selectClass}
                >
                    <option value="">Select effect...</option>
                    {EFFECT_GROUPS.map((group) => (
                        <optgroup key={group.label} label={group.label}>
                            {group.options.map((opt) => (
                                <option key={opt} value={opt}>
                                    {formatLabel(opt)}
                                </option>
                            ))}
                        </optgroup>
                    ))}
                </select>
            </div>
        </div>
    </div>
);

export default StateEffectSelector;
