import React from "react";
import Label from "@/components/form/Label";

interface Goal {
    id: number;
    name: string;
}

const selectClass =
    "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs " +
    "focus:outline-none focus:ring-2 focus:ring-purple-500/20 " +
    "bg-white dark:bg-gray-900 text-gray-800 dark:text-white border-gray-300 dark:border-gray-700 " +
    "cursor-pointer";

interface GoalSelectorProps {
    goalsList: Goal[];
    primaryGoal: number | null;
    onPrimaryGoalChange: (id: number | null) => void;
    secondaryGoals: number[];
    onToggleSecondaryGoal: (id: number) => void;
}

const GoalSelector: React.FC<GoalSelectorProps> = ({
    goalsList,
    primaryGoal,
    onPrimaryGoalChange,
    secondaryGoals,
    onToggleSecondaryGoal,
}) => {
    if (goalsList.length === 0) return null;

    const secondaryOptions = goalsList.filter((g) => g.id !== primaryGoal);

    return (
        <div className="space-y-5">
            <div>
                <Label htmlFor="primary-goal">
                    Primary Goal <span className="text-red-500">*</span>
                </Label>
                <select
                    id="primary-goal"
                    value={primaryGoal ?? ""}
                    onChange={(e) => onPrimaryGoalChange(e.target.value ? Number(e.target.value) : null)}
                    className={selectClass}
                >
                    <option value="" className="bg-white dark:bg-gray-900">Select primary goal...</option>
                    {goalsList.map((g) => (
                        <option key={g.id} value={g.id} className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
                            {g.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Secondary Goals
                </h3>
                <div className="flex flex-wrap gap-2">
                    {secondaryOptions.length === 0 ? (
                        <p className="text-xs text-gray-400">No other goals available.</p>
                    ) : (
                        secondaryOptions.map((g) => (
                            <button
                                key={g.id}
                                type="button"
                                onClick={() => onToggleSecondaryGoal(g.id)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                                    secondaryGoals.includes(g.id)
                                        ? "bg-[#9810FA] text-white border-[#9810FA]"
                                        : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-[#9810FA] hover:text-[#9810FA]"
                                }`}
                            >
                                {g.name}
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default GoalSelector;
