import React from "react";
import Select from "@/components/form/Select";
import DatePicker from "@/components/form/date-picker";
import Label from "@/components/form/Label";
import { Clock } from "lucide-react";

interface VisibilitySettingsProps {
    status: string;
    onStatusChange: (v: string) => void;
    releaseDate?: string | null;
    onReleaseDateChange?: (dateStr: string) => void;
    releaseTime?: string;
    onReleaseTimeChange?: (time: string) => void;
}

const VisibilitySettings: React.FC<VisibilitySettingsProps> = ({
    status,
    onStatusChange,
    releaseDate,
    onReleaseDateChange,
    releaseTime,
    onReleaseTimeChange,
}) => {
    return (
        <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Visibility Settings
            </h3>

            <div>
                <Label htmlFor="status">Status</Label>
                <Select
                    options={[
                        { value: "published", label: "Published" },
                        { value: "review", label: "Scheduled" },
                        { value: "draft", label: "Unpublished" },
                    ]}
                    placeholder="Select status"
                    onChange={onStatusChange}
                    defaultValue={status}
                />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <Label htmlFor="releaseDate">Release Date</Label>
                    <DatePicker
                        id="releaseDate"
                        placeholder="Select one..."
                        defaultDate={releaseDate ? new Date(releaseDate) : undefined}
                        onChange={(dates, dateStr) => onReleaseDateChange?.(dateStr)}
                    />
                </div>
                <div>
                    <Label htmlFor="releaseTime">Release Time</Label>
                    <div className="relative">
                        <input
                            type="time"
                            id="releaseTime"
                            value={releaseTime ?? ""}
                            onChange={(e) => onReleaseTimeChange?.(e.target.value)}
                            className="h-11 w-full rounded-lg border px-4 py-2.5 pr-10 text-sm shadow-theme-xs focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 bg-white text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
                        />
                        <span className="absolute text-gray-400 -translate-y-1/2 pointer-events-none right-3 top-1/2">
                            <Clock className="w-5 h-5" />
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VisibilitySettings;
