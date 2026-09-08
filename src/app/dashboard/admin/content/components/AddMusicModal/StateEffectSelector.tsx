import React, { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import Label from "@/components/form/Label";

interface TaxonomyItem {
    id: number;
    name: string;
}

const selectClass =
    "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs " +
    "focus:outline-none focus:ring-2 focus:ring-purple-500/20 " +
    "bg-white dark:bg-gray-900 text-gray-800 dark:text-white border-gray-300 dark:border-gray-700 " +
    "cursor-pointer";

interface TaxonomyPickerProps {
    label: string;
    idPrefix: string;
    items: TaxonomyItem[];
    primary: number | null;
    onPrimaryChange: (id: number | null) => void;
    secondary: number[];
    onToggleSecondary: (id: number) => void;
    onCreate: (name: string) => Promise<void>;
    accentColorClass: string;
}

const TaxonomyPicker: React.FC<TaxonomyPickerProps> = ({
    label,
    idPrefix,
    items,
    primary,
    onPrimaryChange,
    secondary,
    onToggleSecondary,
    onCreate,
    accentColorClass,
}) => {
    const [newName, setNewName] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [createError, setCreateError] = useState<string | null>(null);

    const secondaryOptions = items.filter((i) => i.id !== primary);

    const handleCreate = async () => {
        const name = newName.trim();
        if (!name || isCreating) return;
        setIsCreating(true);
        setCreateError(null);
        try {
            await onCreate(name);
            setNewName("");
        } catch {
            setCreateError(`Failed to create ${label.toLowerCase()}.`);
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="space-y-3">
            <div>
                <Label htmlFor={`${idPrefix}-primary`}>Primary {label}</Label>
                <select
                    id={`${idPrefix}-primary`}
                    value={primary ?? ""}
                    onChange={(e) => onPrimaryChange(e.target.value ? Number(e.target.value) : null)}
                    className={selectClass}
                >
                    <option value="" className="bg-white dark:bg-gray-900">Select {label.toLowerCase()}...</option>
                    {items.map((item) => (
                        <option key={item.id} value={item.id} className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
                            {item.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="space-y-2">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Secondary {label}s</span>
                <div className="flex flex-wrap gap-2">
                    {secondaryOptions.length === 0 ? (
                        <p className="text-xs text-gray-400">No other {label.toLowerCase()}s yet.</p>
                    ) : (
                        secondaryOptions.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => onToggleSecondary(item.id)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                                    secondary.includes(item.id)
                                        ? `${accentColorClass} text-white border-transparent`
                                        : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-400"
                                }`}
                            >
                                {item.name}
                            </button>
                        ))
                    )}
                </div>
            </div>

            <div className="flex gap-2 pt-1">
                <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleCreate())}
                    placeholder={`Create new ${label.toLowerCase()}...`}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs focus:outline-none focus:border-purple-500 dark:text-white"
                />
                <button
                    type="button"
                    onClick={handleCreate}
                    disabled={isCreating || !newName.trim()}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-900 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 text-white text-xs font-medium disabled:opacity-50 transition-colors"
                >
                    {isCreating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                    Add
                </button>
            </div>
            {createError && <p className="text-xs text-red-500">{createError}</p>}
        </div>
    );
};

interface StateEffectSelectorProps {
    statesList: TaxonomyItem[];
    primaryState: number | null;
    onPrimaryStateChange: (id: number | null) => void;
    secondaryStates: number[];
    onToggleSecondaryState: (id: number) => void;
    onCreateState: (name: string) => Promise<void>;

    effectsList: TaxonomyItem[];
    primaryEffect: number | null;
    onPrimaryEffectChange: (id: number | null) => void;
    secondaryEffects: number[];
    onToggleSecondaryEffect: (id: number) => void;
    onCreateEffect: (name: string) => Promise<void>;
}

const StateEffectSelector: React.FC<StateEffectSelectorProps> = ({
    statesList,
    primaryState,
    onPrimaryStateChange,
    secondaryStates,
    onToggleSecondaryState,
    onCreateState,
    effectsList,
    primaryEffect,
    onPrimaryEffectChange,
    secondaryEffects,
    onToggleSecondaryEffect,
    onCreateEffect,
}) => (
    <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            State &amp; Effect
        </h3>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <TaxonomyPicker
                label="State"
                idPrefix="state"
                items={statesList}
                primary={primaryState}
                onPrimaryChange={onPrimaryStateChange}
                secondary={secondaryStates}
                onToggleSecondary={onToggleSecondaryState}
                onCreate={onCreateState}
                accentColorClass="bg-[#9810FA]"
            />

            <TaxonomyPicker
                label="Effect"
                idPrefix="effect"
                items={effectsList}
                primary={primaryEffect}
                onPrimaryChange={onPrimaryEffectChange}
                secondary={secondaryEffects}
                onToggleSecondary={onToggleSecondaryEffect}
                onCreate={onCreateEffect}
                accentColorClass="bg-blue-600"
            />
        </div>
    </div>
);

export default StateEffectSelector;
